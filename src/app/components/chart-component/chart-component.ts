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
    this.chart = new Chart('meuGrafico', chartConfig);
  }

  private processChartData(data: AppChartData): AppChartData {
    const genericColors = this.getGenericColors(data.labels.length);
    data.datasets.forEach(dataset => {
      dataset.backgroundColor = dataset.backgroundColor || genericColors;
      dataset.borderColor = dataset.borderColor || '#333';
      dataset.borderWidth = dataset.borderWidth ?? 1.5;
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
          font: { size: 18, weight: 'bold' },
          padding: { top: 10, bottom: 20 }
        },
        legend: { display: true, position: 'top' as const },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const value = context.raw.toLocaleString('pt-BR');
              return `${this.valuePrefix}${value}${this.valueSuffix}`;
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

    switch (this.chartType) {
      case 'bar':
      case 'line':
        return { type: this.chartType, data, options: { ...commonOptions, scales: { y: { beginAtZero: true } } } };
      case 'pie':
      case 'doughnut':
        return { type: this.chartType, data, options: { ...commonOptions, plugins: { ...commonOptions.plugins, legend: { position: 'right' as const } } } };
      case 'radar':
        return { type: 'radar', data, options: commonOptions };
      default:
        throw new Error(`Tipo de gráfico não suportado: ${this.chartType}`);
    }
  }

  private getGenericColors(count: number): string[] {
    const colors = [
      'rgba(52, 152, 219, 0.7)', 'rgba(46, 204, 113, 0.7)',
      'rgba(231, 76, 60, 0.7)', 'rgba(241, 196, 15, 0.7)',
      'rgba(155, 89, 182, 0.7)', 'rgba(26, 188, 156, 0.7)',
      'rgba(230, 126, 34, 0.7)', 'rgba(52, 73, 94, 0.7)',
    ];
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
  }
}
