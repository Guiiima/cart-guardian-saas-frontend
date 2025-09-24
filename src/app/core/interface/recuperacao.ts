export interface Recuperacao {
  id: string;
  produto?: string;
  status: 'Recuperado' | 'Pendente' | 'Falhou'| 'Em Recuperação';
}