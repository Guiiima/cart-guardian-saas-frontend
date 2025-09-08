import { Component, OnInit } from '@angular/core';
import { Header } from "app/components/header/header";
import { CardMetrica, Metrica } from "app/components/card-metrica/card-metrica";
import { ChartComponentComponent, AppChartData } from 'app/components/chart-component/chart-component';
import { Table } from 'app/components/table/table';
import { Footer } from "app/components/footer/footer";
import { ShopifyAuthService } from '@core/services/shopifyAuth';
import { CommonModule } from '@angular/common';

interface DashboardMetrics {
  receitaRecuperada: number;
  taxaDeConversao: number;
  emailsEnviados: number;
  ticketMedioRecuperado: number;
}

interface CombinedDashboardMetrics {
  metricasDiarias: DashboardMetrics;
  metricasDoPeriodo: DashboardMetrics;
}

type Periodo = 'DIARIO' | 'SEMANAL' | 'MENSAL' | 'ANUAL';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [CommonModule, Header, CardMetrica, ChartComponentComponent, Table],
  templateUrl: './home-screen.html',
  styleUrl: './home-screen.scss'
})
export class HomeScreen implements OnInit {
  
  metricas: Metrica[] = [];
  
  cardSelecionadoId: string = 'receita';
  dadosDoGrafico!: AppChartData 

  constructor(private shopifyAuthService: ShopifyAuthService) {}

  ngOnInit(): void {
    this.carregarMetricasDosCards();
    this.carregarDadosDoGrafico('MENSAL');
  }

  onPeriodoGraficoChange(periodo: any): void {
    this.carregarDadosDoGrafico(periodo);
  }

  async carregarMetricasDosCards(): Promise<void> {
    try {
      const dados: CombinedDashboardMetrics = await this.shopifyAuthService.get('/api/dashboard/metrics?periodo=MENSAL');

      const metricasDoPeriodo = dados.metricasDoPeriodo;
      const metricasDiarias = dados.metricasDiarias;

      this.metricas = [
        {
          id: 'receita',
          titulo: 'Receita Recuperada',
          metrica: this.formatarMoeda(metricasDoPeriodo.receitaRecuperada),
          detalhe: `Hoje: ${this.formatarMoeda(metricasDiarias.receitaRecuperada)}`,
        },
        {
          id: 'conversao',
          titulo: 'Taxa de conversão por e-mail',
          metrica: `${metricasDoPeriodo.taxaDeConversao.toFixed(1)}%`,
          detalhe: `Hoje: ${metricasDiarias.taxaDeConversao.toFixed(1)}%`,
        },
        {
          id: 'emails',
          titulo: 'E-mails de Recuperação Enviados',
          metrica: metricasDoPeriodo.emailsEnviados.toString(),
          detalhe: `Hoje: ${metricasDiarias.emailsEnviados}`,
        },
        {
          id: 'ticket',
          titulo: 'Ticket médio recuperado',
          metrica: this.formatarMoeda(metricasDoPeriodo.ticketMedioRecuperado),
          detalhe: `Hoje: ${this.formatarMoeda(metricasDiarias.ticketMedioRecuperado)}`,
        }
      ];
    } catch (error) {
      console.error("Erro ao carregar métricas dos cards:", error);
    }
  }

  async carregarDadosDoGrafico(periodo: Periodo): Promise<void> {
    try {
      this.dadosDoGrafico = undefined as any; 
      const url = `/api/dashboard/metrics?periodo=${periodo}`;
      const dados: CombinedDashboardMetrics = await this.shopifyAuthService.get(url);

      const dadosDoPeriodo = dados.metricasDoPeriodo;

      this.dadosDoGrafico = {
        labels: ['Receita', 'E-mails Enviados', 'Taxa de Conversão', 'Ticket Médio'],
        datasets: [{
          label: `Dados de ${periodo.charAt(0) + periodo.slice(1).toLowerCase()}`,
          data: [
            dadosDoPeriodo.receitaRecuperada,
            dadosDoPeriodo.emailsEnviados,
            dadosDoPeriodo.taxaDeConversao,
            dadosDoPeriodo.ticketMedioRecuperado
          ],
        }]
      };
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

  selecionarCard(id: string): void {
    this.cardSelecionadoId = id;
  }
}
