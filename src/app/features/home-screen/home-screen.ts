import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from "app/components/header/header";
import { CardMetrica, Metrica } from "app/components/card-metrica/card-metrica";
import { ChartComponentComponent, AppChartData } from 'app/components/chart-component/chart-component';
import { Coluna, Table, Tabs } from 'app/components/table/table';
import { Footer } from "app/components/footer/footer";
import { ShopifyAuthService } from '@core/services/shopifyAuth';
import { environment } from 'environments/environment';
import { MOCK_GRAFICO_POR_PERIODO } from '@core/mocks/dashboard';
import { ChartData } from 'chart.js';

export interface DashboardMetrics {
  receitaRecuperada: number;
  taxaDeConversao: number;
  carrinhosAbandonados: number;
  ticketMedioRecuperado: number;
}

export interface AppChartDataset {
  labels: string[];
  data: number[];
}

export interface Recuperacao {
  id: string;
  produto?: string;
  status: 'Recuperado' | 'Pendente' | 'Falhou';
}
export interface Ranking {
  id: string;
  posicao: number;
  valor: number;
  quantidade: number;
}
export interface CombinedDashboardData {
  kpisDiarios: DashboardMetrics;
  dadosDoGrafico: AppChartDataset;
}

type Periodo = 'SEMANAL' | 'MENSAL' | 'ANUAL';
type MetricaId = 'receita' | 'conversao' | 'abandonados' | 'ticket';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [CommonModule, Header, CardMetrica, ChartComponentComponent, Table],
  templateUrl: './home-screen.html',
  styleUrl: './home-screen.scss'
})
export class HomeScreen implements OnInit {

  public periodoSelecionado: Periodo = 'SEMANAL';
  public metricaSelecionada: MetricaId = 'receita';

  public metricasDosCards: Metrica[] = [];
  public dadosDoGrafico: AppChartData = { labels: [], datasets: [] };
  public colunasDaTabela: Coluna<any>[] = [];
  public tabsDaTabela: Tabs[] = [];
  public listaRecuperacoes: Recuperacao[] = [];
  public listaRanking: Ranking[] = [];
  private listaCompletaRecuperacoes: any[] = [];
  public listaFiltradaRecuperacoes: Recuperacao[] = [];

  constructor(private shopifyAuthService: ShopifyAuthService) { }

  async ngOnInit(): Promise<void> {
    this.carregarDadosDoDashboard();
    this.configurarComponentesVisuaisTable();
  }

  async carregarListaRecuperacao(): Promise<void> {
    try {
      const endpoint = '/api/analytics/recuperacao';
      this.listaRecuperacoes = await this.shopifyAuthService.get(endpoint);
      console.log('Dados de recuperação carregados:', this.listaRecuperacoes);
    } catch (error) {
      console.error("Erro ao carregar dados de recuperação:", error);
      this.listaRecuperacoes = []; 
    }
  }

  async carregarRankingProdutos(): Promise<void> {
    try {
      const endpoint = '/api/analytics/ranking';
      this.listaRanking = await this.shopifyAuthService.get(endpoint);
      console.log('Dados do ranking carregados:', this.listaRanking);
    } catch (error) {
      console.error("Erro ao carregar dados do ranking:", error);
      this.listaRanking = []; 
    }
  }

  public configurarComponentesVisuaisTable(type?: string): void {
    this.tabsDaTabela = [
      { id: 'ranking', titulo: 'Ranking Produtos Abandonados' },
      { id: 'recuperacoes', titulo: 'Produtos Recuperads' },
    ];
  }
  public async configurarComponentesVisuaisTds(type?: string): Promise<void> {
    const endpoint = `/api/dashboard/recoveries?typeTabela=${type}`;
    setTimeout(async () => {
      this.listaFiltradaRecuperacoes = await this.shopifyAuthService.get(endpoint);
    }, 0);
    switch (type) {
      case 'ranking':
        this.colunasDaTabela = [
          { key: 'id', label: 'Id' },
          { key: 'posicao', label: 'Posição' },
          { key: 'valor', label: 'Valor Do produto' },
          { key: 'quantidade', label: 'Quantidade Abandonada' }
        ];
        break;
      case 'recuperacoes':
        this.colunasDaTabela = [
          { key: 'id', label: 'ID' },
          { key: 'produto', label: 'Produto' },
          { key: 'status', label: 'Status' },
        ];
        break;
      default:
        break;
    }
    this.listaFiltradaRecuperacoes
  }

  async carregarDadosDoDashboard(): Promise<void> {
    try {
      const endpoint = `/api/dashboard/metrics?metric=${this.metricaSelecionada}&periodo=${this.periodoSelecionado}`;
      const response: CombinedDashboardData = await this.shopifyAuthService.get(endpoint);
      this.atualizarCards(response.kpisDiarios);
      this.atualizarGrafico(response.dadosDoGrafico);

    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    }
  }

  private atualizarCards(kpis: DashboardMetrics): void {
    this.metricasDosCards = [
      {
        id: 'receita',
        titulo: 'Receita Recuperada (Hoje)',
        icone: 'monetization_on',
        metrica: this.formatarMoeda(kpis.receitaRecuperada),
        detalhe: `${kpis.taxaDeConversao.toFixed(2)}% de conversão`
      },
      {
        id: 'conversao',
        titulo: 'Taxa de Conversão (Hoje)',
        icone: 'trending_up',
        metrica: `${kpis.taxaDeConversao.toFixed(2)}%`,
        detalhe: `${kpis.taxaDeConversao.toFixed(2)}% de conversão`
      },
      {
        id: 'abandonados',
        titulo: 'Carrinhos Abandonados',
        icone: 'remove_shopping_cart',
        metrica: `${kpis.carrinhosAbandonados}`,
        detalhe: `${kpis.taxaDeConversao.toFixed(2)}% de conversão`
      },
      {
        id: 'ticket',
        titulo: 'Ticket Médio (Hoje)',
        icone: 'receipt_long',
        metrica: this.formatarMoeda(kpis.ticketMedioRecuperado),
        detalhe: `${kpis.taxaDeConversao.toFixed(2)}% de conversão`
      }
    ];
  }

  private atualizarGrafico(charData: AppChartDataset): void {
    const metricaInfo = this.metricasDosCards.find(m => m.id === this.metricaSelecionada);
    const chartLabel = metricaInfo ? metricaInfo.titulo.replace(' (Hoje)', '') : 'Dados';
    this.dadosDoGrafico = {
      labels: charData.labels,
      datasets: [{
        label: chartLabel,
        data: charData.data,
        backgroundColor: 'rgba(26, 188, 156, 0.8)',
        borderColor: 'rgba(22, 160, 133, 1)'
      }]
    };
  }

  public onPeriodoChange(novoPeriodo: any): void {
    this.periodoSelecionado = novoPeriodo;
    this.carregarDadosDoDashboard();
  }

  public onCardSelect(metricaId: any): void {
    this.metricaSelecionada = metricaId;
    this.carregarDadosDoDashboard();
  }

  public filtrarTabela(status: string): void {
    if (status === 'todos') {
      this.listaFiltradaRecuperacoes = [...this.listaCompletaRecuperacoes];
    } else {
      this.listaFiltradaRecuperacoes = this.listaCompletaRecuperacoes.filter(
        item => item.status === status
      );
    }
  }

  private formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  }
}
