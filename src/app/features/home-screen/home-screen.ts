import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

interface ChartData {
  labels: string[];
  data: number[];
}

type Periodo = 'SEMANAL' | 'MENSAL' | 'ANUAL';
type MetricaId = 'receita' | 'conversao' | 'emails' | 'ticket';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [CommonModule, Header, CardMetrica, ChartComponentComponent, Table],
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
    this.carregarMetricasDosCards();
    this.carregarDadosDoGrafico();
  }

  async carregarMetricasDosCards(): Promise<void> {
    try {
      const dados: DashboardMetrics = await this.shopifyAuthService.get('/api/dashboard/kpis-diarios');
      
      this.metricasDosCards = [
        { id: 'receita', titulo: 'Receita Recuperada (Hoje)', metrica: this.formatarMoeda(dados.receitaRecuperada), detalhe: '' },
        { id: 'conversao', titulo: 'Taxa de Conversão (Hoje)', metrica: `${dados.taxaDeConversao.toFixed(1)}%`, detalhe: '' },
        { id: 'emails', titulo: 'E-mails Enviados (Hoje)', metrica: dados.emailsEnviados.toString(), detalhe: '' },
        { id: 'ticket', titulo: 'Ticket Médio (Hoje)', metrica: this.formatarMoeda(dados.ticketMedioRecuperado), detalhe: '' }
      ];
    } catch (error) {
      console.error("Erro ao carregar KPIs diários:", error);
    }
  }

  async carregarDadosDoGrafico(): Promise<void> {
    try {
      const endpoint = `/api/dashboard/chart-data?metric=${this.metricaSelecionada}&periodo=${this.periodoSelecionado}`;
      const chartData: ChartData = await this.shopifyAuthService.get(endpoint);

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
    } catch (error) {
      console.error(`Erro ao carregar dados do gráfico para ${this.metricaSelecionada}/${this.periodoSelecionado}:`, error);
    }
  }

  onPeriodoChange(novoPeriodo: Periodo): void {
    this.periodoSelecionado = novoPeriodo;
    this.carregarDadosDoGrafico();
  }

  onCardSelect(metricaId: any): void {
    this.metricaSelecionada = metricaId;
    this.carregarDadosDoGrafico();
  }
  
  private formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  }
}
