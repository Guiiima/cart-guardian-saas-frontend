import { Component } from '@angular/core';
import { Setting } from "../../components/setting/setting";
import { Dashboard } from "../../components/dashboard/dashboard";
import { AppChartData, ChartComponentComponent } from 'app/components/chart-component/chart-component';

@Component({
  selector: 'app-home-screen',
  imports: [ChartComponentComponent],
  templateUrl: './home-screen.html',
  styleUrl: './home-screen.scss'
})
export class HomeScreen {
  public dadosDeClientes: AppChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
    datasets: [{
      label: '% de Cliques no Link de Recuperação',
      data: [32, 34, 37, 35, 39, 42, 44],
      backgroundColor: [
        'rgba(26, 188, 156, 0.8)',
        'rgba(230, 126, 34, 0.8)',
        'rgba(155, 89, 182, 0.8)',
        'rgba(241, 196, 15, 0.8)',
        'rgba(231, 76, 60, 0.8)'
      ],
      borderColor: 'rgba(0, 0, 0, 1)',
      borderWidth: 2
    }]
  };
}
