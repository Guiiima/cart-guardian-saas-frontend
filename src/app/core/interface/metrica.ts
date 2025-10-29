import { metrica } from "@core/enums/metrica";


export interface Metrica {
  id: metrica;
  titulo: string;
  metrica: string;
  icone: string;
  detalhe: string;
}