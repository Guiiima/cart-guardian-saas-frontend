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

interface DashboardMetrics {
  receitaRecuperada: number;
  taxaDeConversao: number;
  carrinhosAbandonados: number;
  ticketMedioRecuperado: number;
}

interface AppChartDataset {
  labels: string[];
  data: number[];
}

interface Recuperacao {
  id: string;
  cliente: string;
  valor: number;
  status: 'Recuperado' | 'Pendente' | 'Falhou';
  data: string;
}

interface CombinedDashboardData {
  kpisDiarios: DashboardMetrics;
  dadosDoGrafico: AppChartDataset;
}

type Periodo = 'SEMANAL' | 'MENSAL' | 'ANUAL';
type MetricaId = 'receita' | 'conversao' | 'abandonados' | 'ticket';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [CommonModule, Header, CardMetrica, ChartComponentComponent, Table, Footer],
  templateUrl: './home-screen.html',
  styleUrl: './home-screen.scss'
})
export class HomeScreen implements OnInit {

  public periodoSelecionado: Periodo = 'SEMANAL';
  public metricaSelecionada: MetricaId = 'receita';

  public metricasDosCards: Metrica[] = [];
  public dadosDoGrafico: AppChartData = { labels: [], datasets: [] };
  public colunasDaTabela: Coluna<Recuperacao>[] = [];
  public tabsDaTabela: Tabs[] = [];

  private listaCompletaRecuperacoes: Recuperacao[] = [];
  public listaFiltradaRecuperacoes: Recuperacao[] = [];

  constructor(private shopifyAuthService: ShopifyAuthService) { }

  ngOnInit(): void {
    this.configurarComponentesVisuais();
    this.carregarDadosDoDashboard();
    this.carregarDadosDaTabela();
  }

  private configurarComponentesVisuais(): void {
    this.colunasDaTabela = [
      { key: 'data', label: 'Data' },
      { key: 'cliente', label: 'Cliente' },
      { key: 'status', label: 'Status' },
      { key: 'valor', label: 'Valor Recuperado' }
    ];

    this.tabsDaTabela = [
      { id: 'todos', titulo: 'Todos' },
      { id: 'Recuperado', titulo: 'Recuperados' },
      { id: 'Pendente', titulo: 'Pendentes' },
      { id: 'Falhou', titulo: 'Falhas' }
    ];
  }

  async carregarDadosDoDashboard(): Promise<void> {
    try {
      //const endpoint = `/api/dashboard/metrics?metric=${this.metricaSelecionada}&periodo=${this.periodoSelecionado}`;
      //const response: CombinedDashboardData = await this.shopifyAuthService.get(endpoint);
      const dadosDoGraficoMock: ChartData = MOCK_GRAFICO_POR_PERIODO[this.periodoSelecionado];
      const responseMetrics: CombinedDashboardData = await this.shopifyAuthService.getMetrics();



      this.atualizarCards(responseMetrics, undefined);
      this.atualizarGrafico(dadosDoGraficoMock);

    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    }
  }

  async carregarDadosDaTabela(): Promise<void> {
    try {
      const endpoint = '/api/dashboard/recoveries';
      const recuperacoes: Recuperacao[] = await this.shopifyAuthService.get(endpoint);

      this.listaCompletaRecuperacoes = recuperacoes;
      this.filtrarTabela('todos');

    } catch (error) {
      console.error("Erro ao carregar dados da tabela:", error);
      this.listaCompletaRecuperacoes = [];
      this.listaFiltradaRecuperacoes = [];
    }
  }

  private atualizarCards(kpisTeste: any, kpis?: DashboardMetrics): void {
    if (!kpis) {
      this.metricasDosCards = kpisTeste;
      return
    }
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

  private atualizarGrafico(chartData: ChartData): void {
    const metricaInfo = this.metricasDosCards.find(m => m.id === this.metricaSelecionada);
    const chartLabel = metricaInfo ? metricaInfo.titulo.replace(' (Hoje)', '') : 'Dados';
    if (environment.production === false) {
      this.dadosDoGrafico = {
        labels: chartData.labels as string[],
        datasets: [{
          label: chartLabel,
          data: chartData.datasets && chartData.datasets[0] ? (chartData.datasets[0] as any).data : [],
          backgroundColor: 'rgba(26, 188, 156, 0.8)',
          borderColor: 'rgba(22, 160, 133, 1)'
        }]
      };
    }
    // else {
    //   this.dadosDoGrafico = {
    //     labels: chartData.labels,
    //     datasets: [{
    //       label: chartLabel,
    //       data: chartData.data,
    //       backgroundColor: 'rgba(26, 188, 156, 0.8)',
    //       borderColor: 'rgba(22, 160, 133, 1)'
    //     }]
    //   };
    // }
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
