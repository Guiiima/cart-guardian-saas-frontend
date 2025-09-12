export interface Metrica {
  id: string;
  titulo: string;
  metrica: string;
  icone: string;
  detalhe: string;
}

export const MOCK_METRICAS: Metrica[] = [
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