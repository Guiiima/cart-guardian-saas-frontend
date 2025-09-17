import { AppChartData } from "app/components/chart-component/chart-component";
import { Metrica } from "./metrica";

export interface HomeScreenData {
  metricasDosCards: Metrica[];
  dadosDoGrafico: AppChartData;
}
