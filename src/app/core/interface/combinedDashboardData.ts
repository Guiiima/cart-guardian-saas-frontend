import { AppChartDataset } from "./appChartDataset";
import { DashboardMetrics } from "./dashboardMetrics";

export interface CombinedDashboardData {
  kpisDiarios: DashboardMetrics;
  dadosDoGrafico: AppChartDataset;
}