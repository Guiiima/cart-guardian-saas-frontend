import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from "app/components/header/header";
import { CardMetrica, Metrica } from "app/components/card-metrica/card-metrica";
import { ChartComponentComponent, AppChartData } from 'app/components/chart-component/chart-component';
import { Table } from 'app/components/table/table';
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

  public periodoSelecionado: Periodo = 'MENSAL';
  public metricaSelecionada: MetricaId = 'receita';
  public metricasDosCards: Metrica[] = [];
  public dadosDoGrafico: AppChartData = { labels: [], datasets: [] };

  constructor(private shopifyAuthService: ShopifyAuthService) { }

  ngOnInit(): void {
    this.carregarDadosDoDashboard();
  }

  async carregarDadosDoDashboard(): Promise<void> {
    try {
      if (!environment.production) {
        this.metricasDosCards = [
          { id: 'receita', titulo: 'Receita Recuperada (Hoje)', metrica: this.formatarMoeda(3108.92), detalhe: 'teste' },
          { id: 'conversao', titulo: 'Taxa de Conversão (Hoje)', metrica: `25.0%`, detalhe: 'teste' },
          { id: 'emails', titulo: 'E-mails Enviados (Hoje)', metrica: '12', detalhe: 'teste' },
          { id: 'ticket', titulo: 'Ticket Médio (Hoje)', metrica: this.formatarMoeda(259.07), detalhe: 'teste' }
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

        console.log(" Dados fake carregados para DEV:", this.dadosDoGrafico);
        return;
      }

      const endpoint = `/api/dashboard/metrics?metric=${this.metricaSelecionada}&periodo=${this.periodoSelecionado}`;
      const response: CombinedDashboardData = await this.shopifyAuthService.get(endpoint);

      const kpis = response.kpisDiarios;
      this.metricasDosCards = [
        { id: 'receita', titulo: 'Receita Recuperada (Hoje)', metrica: this.formatarMoeda(kpis.receitaRecuperada ?? 0), detalhe: '' },
        { id: 'conversao', titulo: 'Taxa de Conversão (Hoje)', metrica: `${(kpis.taxaDeConversao ?? 0).toFixed(1)}%`, detalhe: '' },
        { id: 'emails', titulo: 'E-mails Enviados (Hoje)', metrica: (kpis.emailsEnviados ?? 0).toString(), detalhe: '' },
        { id: 'ticket', titulo: 'Ticket Médio (Hoje)', metrica: this.formatarMoeda(kpis.ticketMedioRecuperado ?? 0), detalhe: '' }
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
}
