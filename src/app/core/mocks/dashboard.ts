import { DashboardMetrics } from "@core/interface/dashboardMetrics";
import { AppChartDataset } from "@core/interface/appChartDataset";
import { CombinedDashboardData } from "@core/interface/combinedDashboardData";
import { Ranking } from "@core/interface/ranking";
import { Recuperacao } from "@core/interface/recuperacao";
import { metrica } from "@core/enums/metrica";



export let MOCK_KPIS_DIARIOS: DashboardMetrics;
export let MOCK_GRAFICO_POR_PERIODO: AppChartDataset;
export let COMBINED_DASHBOARD_DATA: CombinedDashboardData;

export const MOCK_METRICAS = [
  {
    id: metrica.RECEITA,
    titulo: 'Receita Total (Mês)',
    icone: 'monetization_on',
    metrica: 'R$ 45.870,50',
    detalhe: '+12,5% em relação ao mês anterior'
  },
  {
    id: metrica.CONVERSAO,
    titulo: 'Novos Clientes',
    icone: 'person_add',
    metrica: '215',
    detalhe: '+32 novos este mês'
  },
  {
    id: metrica.ABANDONADOS,
    titulo: 'Taxa de Recuperação',
    icone: 'published_with_changes',
    metrica: '23,4%',
    detalhe: 'A meta é 25%'
  },
  {
    id: metrica.TICKET,
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

COMBINED_DASHBOARD_DATA = {
  kpisDiarios: MOCK_KPIS_DIARIOS,
  dadosDoGrafico: MOCK_GRAFICO_POR_PERIODO
};

export const MOCK_RECUPERACAO:  Recuperacao[]= [
  { id: '1', produto: 'Notebook Dell', status: 'Recuperado' },
  { id: '2', produto: 'Smartphone Samsung', status: 'Pendente' },
  { id: '3', produto: 'Tablet Apple', status: 'Falhou' },
  { id: '4', produto: 'Monitor LG', status: 'Em Recuperação' },
  { id: '5', produto: 'Teclado Mecânico', status: 'Pendente' },
  { id: '6', produto: 'Mouse Gamer', status: 'Recuperado' },
  { id: '7', produto: 'Headset', status: 'Falhou' },
  { id: '8', produto: 'Webcam HD', status: 'Recuperado' },
  { id: '9', produto: 'Impressora Epson', status: 'Pendente' },
  { id: '10', produto: 'Cadeira Gamer', status: 'Recuperado' }
];
export const MOCK_RANKING: Ranking[] = [
  { id: '1', posicao: 1, valor: 5000, quantidade: 10 },
  { id: '2', posicao: 2, valor: 4200, quantidade: 8 },
  { id: '3', posicao: 3, valor: 3800, quantidade: 7 },
  { id: '4', posicao: 4, valor: 3500, quantidade: 6 },
  { id: '5', posicao: 5, valor: 3200, quantidade: 5 },
  { id: '6', posicao: 6, valor: 3000, quantidade: 4 },
  { id: '7', posicao: 7, valor: 2800, quantidade: 3 },
  { id: '8', posicao: 8, valor: 2600, quantidade: 2 },
  { id: '9', posicao: 9, valor: 2400, quantidade: 1 },
  { id: '10', posicao: 10, valor: 2200, quantidade: 1 }
];