import { Component } from '@angular/core';
import { Setting } from "../../components/setting/setting";
import { Dashboard, Metrica } from "../../components/dashboard/dashboard";
import { AppChartData, ChartComponentComponent } from 'app/components/chart-component/chart-component';
import { Table } from 'app/components/table/table';
import { Header } from "app/components/header/header";
import { CardMetrica } from "app/components/card-metrica/card-metrica";

@Component({
  selector: 'app-home-screen',
  imports: [Header, CardMetrica, ChartComponentComponent, Table],
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
  metricas: Metrica[] = [
      {
        titulo: 'Taxa de conversão por e-mail',
        metrica: '12,4%',
        detalhe: '+1,8% vs. ontem'
      },
      {
        titulo: 'Ticket médio recuperado',
        metrica: 'R$ 287,90',
        detalhe: '+6,5% na última semana'
      },
      {
        titulo: 'Total de carrinhos abandonados',
        metrica: '154',
        detalhe: 'Atualizado há 10 minutos'
      },
      {
        titulo: 'Receita perdida',
        metrica: 'R$ 12.540,00',
        detalhe: 'Estimativa para o mês'
      }
    ];
}
