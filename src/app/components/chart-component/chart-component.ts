import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {
  Chart,
  LinearScale,
  BarElement,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  BarController,
  PointElement,
  LineElement,
  LineController,
  ArcElement,
  RadialLinearScale,
  PieController,
  DoughnutController,
  RadarController
} from 'chart.js';

export interface AppChartData {
  labels: string[];
  datasets: any[];
}

@Component({
  selector: 'app-chart-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-component.html',
  styleUrls: ['./chart-component.scss']
})
export class ChartComponentComponent implements AfterViewInit, OnChanges {
  @Input() chartType: 'bar' | 'radar' | 'pie' | 'line' | 'doughnut' = 'bar';
  @Input() chartData: AppChartData = { labels: [], datasets: [] };
  @Input() chartTitle: string = 'Meu Gráfico';
  @Input() valuePrefix: string = '';
  @Input() valueSuffix: string = '';

  @Output() onChartClick = new EventEmitter<{ label: string; value: number; index: number }>();

  public selectedType: string;

  private chart!: Chart;

  constructor() {
    this.selectedType = this.chartType;
    Chart.register(
      LinearScale, BarElement, CategoryScale, Title, Tooltip, Legend, BarController,
      PointElement, LineElement, LineController, ArcElement, RadialLinearScale,
      PieController, DoughnutController, RadarController
    );
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      this.createChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart && (changes['chartData'] || changes['chartType'])) {
      this.selectedType = this.chartType;
      this.createChart();
    }
  }

  mudarTipoGrafico(type: string) {
    if (type && ['bar', 'radar', 'pie', 'line', 'doughnut'].includes(type)) {
      this.chartType = type as 'bar' | 'radar' | 'pie' | 'line' | 'doughnut';
      this.selectedType = type;
      this.createChart();
    }
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    const processedData = this.processChartData(this.chartData);
    const chartConfig = this.getChartConfig(processedData);
    // Usamos um ID único para o canvas para evitar conflitos se o componente for reutilizado
    const canvasId = `chart-${Math.random().toString(36).substring(2)}`;
    const canvas = document.getElementById('meuGrafico') as HTMLCanvasElement;
    if (canvas) {
        canvas.id = canvasId;
        this.chart = new Chart(canvasId, chartConfig);
    }
  }

  private processChartData(data: AppChartData): AppChartData {
    const modernColors = this.getModernColors(data.labels.length);
    data.datasets.forEach(dataset => {
        // Lógica de cores específica para cada tipo de gráfico
        if (this.chartType === 'line') {
            dataset.backgroundColor = 'rgba(43, 191, 130, 0.2)'; // Fundo suave para a área da linha
            dataset.borderColor = '#2bbf82'; // Cor primária para a linha
            dataset.pointBackgroundColor = '#2bbf82';
            dataset.pointBorderColor = '#fff';
            dataset.pointHoverBackgroundColor = '#fff';
            dataset.pointHoverBorderColor = '#2bbf82';
            dataset.tension = 0.4; // Linhas mais suaves
        } else {
             dataset.backgroundColor = dataset.backgroundColor || modernColors;
             dataset.borderColor = '#ffffff'; // Bordas brancas para separar as fatias/barras
        }
        dataset.borderWidth = dataset.borderWidth ?? 2;
    });
    return data;
  }

  private getChartConfig(data: AppChartData): any {
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: this.chartTitle,
          font: { size: 16, weight: '500', family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto' },
          color: '#6c757d', // Cinza suave para o título
          padding: { top: 10, bottom: 25 }
        },
        legend: {
            // A legenda é desnecessária para gráficos com apenas um conjunto de dados
            display: data.datasets.length > 1,
            labels: {
                font: { family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto' }
            }
        },
        tooltip: {
          backgroundColor: '#1e293b', // Fundo escuro
          titleFont: { size: 14, weight: 'bold', family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto' },
          bodyFont: { size: 12, family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto' },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (context: any) => {
              const value = context.raw.toLocaleString('pt-BR');
              return ` ${this.valuePrefix}${value}${this.valueSuffix}`;
            }
          }
        }
      },
      onClick: (event: any, elements: any[]) => {
        if (elements.length > 0) {
          const element = elements[0];
          const index = element.index;
          const label = data.labels[index];
          const value = data.datasets[element.datasetIndex].data[index];
          this.onChartClick.emit({ label, value, index });
        }
      }
    };

    const axisOptions = {
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#e9ecef', drawBorder: false }, // Linhas de grade mais suaves
                ticks: { color: '#6c757d' } // Cor dos números do eixo
            },
            x: {
                grid: { display: false }, // Remove linhas de grade verticais
                ticks: { color: '#6c757d' }
            }
        }
    };

    switch (this.chartType) {
      case 'bar':
      case 'line':
        return { type: this.chartType, data, options: { ...commonOptions, ...axisOptions } };
      case 'pie':
      case 'doughnut':
        return { type: this.chartType, data, options: { ...commonOptions, plugins: { ...commonOptions.plugins, legend: { position: 'right' as const, display: true } } } };
      case 'radar':
        return { type: 'radar', data, options: commonOptions };
      default:
        throw new Error(`Tipo de gráfico não suportado: ${this.chartType}`);
    }
  }

  // NOVA FUNÇÃO DE CORES
  private getModernColors(count: number): string[] {
    const colors = [
      '#2bbf82', // Verde Primário
      '#34d399', // Tom mais claro
      '#229968', // Tom mais escuro
      '#6ee7b7', // Tom bem claro
      '#1a734e', // Tom bem escuro
      '#a7f3d0', // Verde-pastel
      '#059669'
    ];
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
  }
}
