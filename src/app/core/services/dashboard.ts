import { Injectable } from '@angular/core';
import { ShopifyAuthService } from './shopifyAuth';
import { AppChartData } from 'app/components/chart-component/chart-component';
import { environment } from '../../../environments/environment';
import { COMBINET_DASHBOARD_DATA, MOCK_RANKING, MOCK_RECUPERACAO_SIMPLE } from '@core/mocks/dashboard';
import { CombinedDashboardData } from '@core/interface/combinedDashboardData';
import { HomeScreenData } from '@core/interface/homeScreenData';
import { DashboardMetrics } from '@core/interface/dashboardMetrics';
import { Metrica } from '@core/interface/metrica';
import { AppChartDataset } from '@core/interface/appChartDataset';
import { metrica } from '@core/enums/metrica';


@Injectable({
  providedIn: 'root'
})
export class Dashboard {

  constructor(private shopifyAuth: ShopifyAuthService) { }

  public getTableData(type: 'ranking' | 'recuperacoes'): Promise<any[]> {
    if (!environment.production) {
      const mockData = type === 'ranking' ? MOCK_RANKING : MOCK_RECUPERACAO_SIMPLE;
      return Promise.resolve(mockData);
    }
    
    const endpoint = type === 'ranking' ? '/api/analytics/ranking' : '/api/analytics/recuperacao';
    return this.shopifyAuth.get(endpoint);
  }

  public async getHomeScreenData(metrica: string, periodo: string): Promise<HomeScreenData> {
    if (!environment.production) {
      const response: CombinedDashboardData = COMBINET_DASHBOARD_DATA;
      const metricasDosCards = this.transformKpisToCards(response.kpisDiarios);
      const dadosDoGrafico = this.transformChartData(response.dadosDoGrafico, metrica, metricasDosCards);
      return { metricasDosCards, dadosDoGrafico };
    }

    const endpoint = `/api/dashboard/metrics?metric=${metrica}&periodo=${periodo}`;
    const response: CombinedDashboardData = await this.shopifyAuth.get(endpoint);

    const metricasDosCards = this.transformKpisToCards(response.kpisDiarios);
    const dadosDoGrafico = this.transformChartData(response.dadosDoGrafico, metrica, metricasDosCards);
    return { metricasDosCards, dadosDoGrafico };
  }

  private transformKpisToCards(kpis: DashboardMetrics): Metrica[] {
    return [
        { id: metrica.RECEITA, titulo: 'Receita Recuperada (Hoje)', icone: 'monetization_on', metrica: this.formatarMoeda(kpis.receitaRecuperada), detalhe: `${kpis.taxaDeConversao.toFixed(2)}% de conversão`},
        { id: metrica.CONVERSAO, titulo: 'Taxa de Conversão (Hoje)', icone: 'trending_up', metrica: `${kpis.taxaDeConversao.toFixed(2)}%`, detalhe: `${kpis.taxaDeConversao.toFixed(2)}% de conversão`},
        { id: metrica.ABANDONADOS, titulo: 'Carrinhos Abandonados', icone: 'remove_shopping_cart', metrica: `${kpis.carrinhosAbandonados}`, detalhe: `${kpis.taxaDeConversao.toFixed(2)}% de conversão`},
        { id: metrica.TICKET, titulo: 'Ticket Médio (Hoje)', icone: 'receipt_long', metrica: this.formatarMoeda(kpis.ticketMedioRecuperado), detalhe: `${kpis.taxaDeConversao.toFixed(2)}% de conversão`}
    ];
  }

  private transformChartData(chartData: AppChartDataset, metricaSelecionada: string, cards: Metrica[]): AppChartData {
    const metricaInfo = cards.find(m => m.id === metricaSelecionada);
    const chartLabel = metricaInfo ? metricaInfo.titulo.replace(' (Hoje)', '') : 'Dados';
    return {
      labels: chartData.labels,
      datasets: [{
        label: chartLabel,
        data: chartData.data,
        backgroundColor: 'rgba(26, 188, 156, 0.8)',
        borderColor: 'rgba(22, 160, 133, 1)'
      }]
    };
  }

  private formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  }
}
