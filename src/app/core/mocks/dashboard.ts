import { AppChartDataset, CombinedDashboardData, DashboardMetrics } from "@features/home-screen/home-screen";
import { ChartData } from "chart.js";

export interface Metrica {
  id: string;
  titulo: string;
  metrica: string;
  icone: string;
  detalhe: string;
}

export let MOCK_METRICAS: Metrica[];
export let MOCK_KPIS_DIARIOS: DashboardMetrics;
export let MOCK_GRAFICO_POR_PERIODO: AppChartDataset;
export let COMBINET_DASHBOARD_DATA: CombinedDashboardData;

MOCK_METRICAS = [
  {
    id: 'receita_total',
    titulo: 'Receita Total (Mês)',
    icone: 'monetization_on',
    metrica: 'R$ 45.870,50',
    detalhe: '+12,5% em relação ao mês anterior'
  },
  {
    id: 'novos_clientes',
    titulo: 'Novos Clientes',
    icone: 'person_add',
    metrica: '215',
    detalhe: '+32 novos este mês'
  },
  {
    id: 'taxa_recuperacao',
    titulo: 'Taxa de Recuperação',
    icone: 'published_with_changes',
    metrica: '23,4%',
    detalhe: 'A meta é 25%'
  },
  {
    id: 'ticket_medio',
    titulo: 'Ticket Médio',
    icone: 'receipt_long',
    metrica: 'R$ 213,35',
    detalhe: '-2,1% em relação ao mês anterior'
  }
];

MOCK_KPIS_DIARIOS = {
  receitaRecuperada: 1250.75,
  taxaDeConversao: 18.5,
  carrinhosAbandonados: 47,
  ticketMedioRecuperado: 85.30
};

MOCK_GRAFICO_POR_PERIODO = {
  labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  data: [1200, 1900, 1500, 2100, 1800, 2300, 1750]
};

COMBINET_DASHBOARD_DATA = {
  kpisDiarios: MOCK_KPIS_DIARIOS,
  dadosDoGrafico: MOCK_GRAFICO_POR_PERIODO
};
// MOCK_GRAFICO_POR_PERIODO = {
//   SEMANAL: {
//     labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
//     datasets: [
//       {
//         label: 'Receita',
//         data: [1200, 1900, 1500, 2100, 1800, 2300, 1750]
//       }
//     ]
//   },
//   MENSAL: {
//     labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
//     datasets: [
//       {
//         label: 'Receita',
//         data: [8500, 9200, 7800, 11500]
//       }
//     ]
//   },
//   ANUAL: {
//     labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
//     datasets: [
//       {
//         label: 'Receita',
//         data: [45000, 47000, 52000, 49000, 55000, 58000, 61000, 59000, 63000, 68000, 71000, 75000]
//       }
//     ]
//   }
//};
