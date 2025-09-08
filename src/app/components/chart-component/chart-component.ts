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
export type PeriodoGrafico = 'SEMANAL' | 'MENSAL' | 'ANUAL';

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
  @Output() periodoChange = new EventEmitter<PeriodoGrafico>();

  public selectedType: string;
  periodoAtivo: PeriodoGrafico = 'MENSAL';

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

  selecionarPeriodo(periodo: PeriodoGrafico): void {
    if (periodo === this.periodoAtivo) {
      return;
    }
    this.periodoAtivo = periodo;
    this.periodoChange.emit(periodo);
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

    const canvas = document.getElementById('meuGrafico') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        this.chart = new Chart(ctx, chartConfig);
      }
    }
  }

  private processChartData(data: AppChartData): AppChartData {
    const modernColors = this.getModernColors(data.labels.length);
    data.datasets.forEach(dataset => {
      if (this.chartType === 'line') {
        dataset.backgroundColor = 'rgba(43, 191, 130, 0.2)';
        dataset.borderColor = '#2bbf82';
        dataset.pointBackgroundColor = '#2bbf82';
        dataset.pointBorderColor = '#fff';
        dataset.pointHoverBackgroundColor = '#fff';
        dataset.pointHoverBorderColor = '#2bbf82';
        dataset.tension = 0.4;
      } else {
        dataset.backgroundColor = modernColors;
        dataset.borderColor = '#ffffff';
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
                color: '#6c757d',
                padding: { top: 10, bottom: 25 }
            },
            legend: {
                display: data.datasets.length > 1,
                labels: {
                    font: { family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto' }
                }
            },
            tooltip: {
                backgroundColor: '#1e293b',
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
  
  private getModernColors(count: number): string[] {
    const colors = [
        '#2bbf82', '#34d399', '#229968', '#6ee7b7',
        '#1a734e', '#a7f3d0', '#059669'
    ];
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
  }
}
