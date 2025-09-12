import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from "app/components/header/header";
import { CardMetrica, Metrica } from "app/components/card-metrica/card-metrica";
import { ChartComponentComponent, AppChartData } from 'app/components/chart-component/chart-component';
import { Coluna, Table, Tabs } from 'app/components/table/table';
import { Footer } from "app/components/footer/footer";
import { ShopifyAuthService } from '@core/services/shopifyAuth';
import { environment } from 'environments/environment';

interface DashboardMetrics {
  receitaRecuperada: number;
  taxaDeConversao: number;
  emailsEnviados: number;
  ticketMedioRecuperado: number;
}

interface ChartData {
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
  dadosDoGrafico: ChartData;
}

type Periodo = 'SEMANAL' | 'MENSAL' | 'ANUAL';
type MetricaId = 'receita' | 'conversao' | 'emails' | 'ticket';

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
    this.carregarDadosDoDashboard();
    this.carregarDadosDaTabela();
  }

  async carregarDadosDoDashboard(): Promise<void> {
    try {
      if (!environment.production) {
        this.metricasDosCards = [
          {
            id: 'receita',
            titulo: 'Receita Recuperada (Hoje)',
            icone: 'monetization_on',
            metrica: this.formatarMoeda(3108.92),
            detalhe: '-10 do que ontem'
          },
          {
            id: 'conversao',
            titulo: 'Taxa de Conversão (Hoje)',
            icone: 'trending_up',
            metrica: `25.0%`,
            detalhe: '+42 do que ontem'
          },
          {
            id: 'abandonados',
            titulo: 'Carrinhos Abandonados',
            icone: 'remove_shopping_cart',
            metrica: '84',
            detalhe: '+12 nas últimas 24h'
          },
          {
            id: 'ticket',
            titulo: 'Ticket Médio (Hoje)',
            icone: 'receipt_long',
            metrica: this.formatarMoeda(259.07),
            detalhe: '+87 do que ontem'
          }
        ];

        setTimeout(() => {
          this.dadosDoGrafico = {
            labels: ['seg.', 'ter.', 'qua.', 'qui.', 'sex.'],
            datasets: [
              {
                label: 'Receita Recuperada',
                data: [455.43, 3108.92, 1200.50, 800.75, 2500.00],
                backgroundColor: 'rgba(26, 188, 156, 0.8)',
                borderColor: 'rgba(22, 160, 133, 1)'
              }
            ]
          };
        }, 0);

        console.log("Dados fake carregados para DEV:", this.dadosDoGrafico);
        return;
      }

      const endpoint = `/api/dashboard/metrics?metric=${this.metricaSelecionada}&periodo=${this.periodoSelecionado}`;
      const response: CombinedDashboardData = await this.shopifyAuthService.get(endpoint);

      const kpis = response.kpisDiarios;
      this.metricasDosCards = [
        {
          id: 'receita',
          titulo: 'Receita Recuperada (Hoje)',
          icone: 'monetization_on',
          metrica: this.formatarMoeda(3108.92),
          detalhe: '-10 do que ontem'
        },
        {
          id: 'conversao',
          titulo: 'Taxa de Conversão (Hoje)',
          icone: 'trending_up',
          metrica: `25.0%`,
          detalhe: '+42 do que ontem'
        },
        {
          id: 'abandonados',
          titulo: 'Carrinhos Abandonados',
          icone: 'remove_shopping_cart',
          metrica: '84',
          detalhe: '+12 nas últimas 24h'
        },
        {
          id: 'ticket',
          titulo: 'Ticket Médio (Hoje)',
          icone: 'receipt_long',
          metrica: this.formatarMoeda(259.07),
          detalhe: '+87 do que ontem'
        }
      ];

      const chartData = response.dadosDoGrafico;
      const metricaInfo = this.metricasDosCards.find(m => m.id === this.metricaSelecionada);
      const chartLabel = metricaInfo ? metricaInfo.titulo.replace(' (Hoje)', '') : 'Dados';

      this.dadosDoGrafico = {
        labels: chartData.labels,
        datasets: [{
          label: chartLabel,
          data: chartData.data,
          backgroundColor: 'rgba(26, 188, 156, 0.8)',
          borderColor: 'rgba(22, 160, 133, 1)'
        }]
      };
      console.log("Dados do gráfico atualizados:", this.dadosDoGrafico);

    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    }
  }

  onPeriodoChange(novoPeriodo: Periodo): void {
    this.periodoSelecionado = novoPeriodo;
    this.carregarDadosDoDashboard();
  }

  onCardSelect(metricaId: any): void {
    this.metricaSelecionada = metricaId;
    this.carregarDadosDoDashboard();
  }

  private formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  }
  private carregarDadosDaTabela(): void {
    // Definindo as colunas
    this.colunasDaTabela = [
      { key: 'data', label: 'Data' },
      { key: 'cliente', label: 'Cliente' },
      { key: 'status', label: 'Status' },
      { key: 'valor', label: 'Valor Recuperado' }
    ];

    // Definindo as abas de filtro
    this.tabsDaTabela = [
      { id: 'todos', titulo: 'Todos' },
      { id: 'Recuperado', titulo: 'Recuperados' },
      { id: 'Pendente', titulo: 'Pendentes' },
      { id: 'Falhou', titulo: 'Falhas' }
    ];

    // Criando os dados falsos
    this.listaCompletaRecuperacoes = [
      { id: 'R001', cliente: 'Mariana Costa', valor: 259.90, status: 'Recuperado', data: '12/09/2025' },
      { id: 'R002', cliente: 'João Pedro Alves', valor: 110.50, status: 'Pendente', data: '12/09/2025' },
      { id: 'R003', cliente: 'Beatriz Lima', valor: 45.00, status: 'Falhou', data: '11/09/2025' },
      { id: 'R004', cliente: 'Lucas Martins', valor: 320.00, status: 'Recuperado', data: '11/09/2025' },
      { id: 'R005', cliente: 'Gabriela Souza', valor: 89.99, status: 'Recuperado', data: '10/09/2025' },
      { id: 'R006', cliente: 'Rafael Oliveira', valor: 150.75, status: 'Pendente', data: '10/09/2025' },
    ];

    // Inicializa a lista filtrada com todos os dados
    this.listaFiltradaRecuperacoes = [...this.listaCompletaRecuperacoes];
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
}
