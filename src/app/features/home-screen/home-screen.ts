import { Component, OnInit } from '@angular/core';
import { Header } from "app/components/header/header";
import { CardMetrica, Metrica } from "app/components/card-metrica/card-metrica";
import { ChartComponentComponent, AppChartData } from 'app/components/chart-component/chart-component';
import { Table } from 'app/components/table/table';
import { Footer } from "app/components/footer/footer";
import { ShopifyAuthService } from '@core/services/shopifyAuth';

interface DashboardMetrics {
  receitaRecuperada: number;
  taxaDeConversao: number;
  emailsEnviados: number;
  ticketMedioRecuperado: number;
}
interface DashboardMetricForPeriod {
  label: string[];
  receitaRecuperada: number[];
}
interface CombinedDashboardMetricsDTO {
  metricasDiarias: DashboardMetrics;
  metricasDoPeriodo: DashboardMetrics
}
export enum Periodo {
  DIARIO = 'DIARIO',
  SEMANAL = 'SEMANAL',
  MENSAL = 'MENSAL',
  ANUAL = 'ANUAL',
}
@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [Header, CardMetrica, ChartComponentComponent, Table, Footer],
  templateUrl: './home-screen.html',
  styleUrl: './home-screen.scss'
})
export class HomeScreen implements OnInit {

  metricas: Metrica[] = [];
  cardSelecionadoId: string = 'receita';
  cardSelecionadoTitulo: string = 'Receita Recuperada';
  public periodoSelecionado: Periodo = Periodo.DIARIO;
  public dadosDeClientes: AppChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
    datasets: [{
      label: '% de Cliques no Link de Recuperação',
      data: [32, 34, 37, 35, 39, 42, 44],
    }]
  };
  public dadosDoGrafico: any | null = null;
  constructor(private shopifyAuthService: ShopifyAuthService) { }

  ngOnInit(): void {
    this.carregarMetricas();
  }

  async carregarMetricas(): Promise<void> {
    try {
      const dados: CombinedDashboardMetricsDTO = await this.shopifyAuthService.get('/api/dashboard/metrics');

      this.metricas = [
        {
          id: 'receita',
          titulo: 'Receita Recuperada',
          metrica: this.formatarMoeda(dados.metricasDiarias.receitaRecuperada),
          detalhe: '+4.5% que ontem'
        },
        {
          id: 'conversao',
          titulo: 'Taxa de conversão por e-mail',
          metrica: `${dados.metricasDiarias.taxaDeConversao.toFixed(1)}%`,
          detalhe: '-0.8% que ontem'
        },
        {
          id: 'emails',
          titulo: 'E-mails de Recuperação Enviados',
          metrica: dados.metricasDiarias.emailsEnviados.toString(),
          detalhe: '+8.9% que ontem'
        },
        {
          id: 'ticket',
          titulo: 'Ticket médio recuperado',
          metrica: this.formatarMoeda(dados.metricasDiarias.ticketMedioRecuperado),
          detalhe: '+2.4% que ontem'
        }
      ];

    } catch (error) {
      console.error("Erro ao carregar métricas do dashboard:", error);
    }
  }
  onPeriodoGraficoChange(periodo: any): void {
    if (periodo === this.periodoSelecionado && this.dadosDoGrafico) {
      return;
    }

    this.periodoSelecionado = periodo;

    this.carregarDadosDoGrafico(periodo);
  }
  async carregarDadosDoGrafico(periodo: Periodo): Promise<void> {
    try {
      this.dadosDoGrafico = undefined as any;
      const url = `/api/dashboard/metrics?periodo=${periodo}`;
      const dados = await this.shopifyAuthService.get(url);

      const dadosDoPeriodo: DashboardMetricForPeriod[] = dados.metricasDoPeriodo;

      this.dadosDeClientes = {
        labels: dadosDoPeriodo.flatMap(d => d.label),
        datasets: [{
          label:  `${this.cardSelecionadoTitulo} no Período`,
          data: dadosDoPeriodo.map(d => d.receitaRecuperada),
        }]
      };
      this.dadosDeClientes
      this.dadosDoGrafico
    } catch (error) {
      console.error(`Erro ao carregar dados do gráfico para o período ${periodo}:`, error);
      this.dadosDoGrafico = undefined as any;
    }
  }

  private formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  selecionarCard(titulo: string, id: string, ): void {
    this.cardSelecionadoId = id;
    this.cardSelecionadoTitulo = titulo;
    this.carregarDadosDoGrafico(this.periodoSelecionado);
    console.log(`Card selecionado: ${id}.`);
  }
}
