import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, registerables, ChartType as ChartJsType } from 'chart.js';

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
export class ChartComponentComponent implements OnChanges, AfterViewInit, OnDestroy {

  @Input() chartType: 'bar' | 'radar' | 'pie' | 'line' | 'doughnut' = 'bar';
  @Input() chartData: AppChartData = { labels: [], datasets: [] };
  @Input() chartTitle: string = 'Meu Gráfico';
  @Input() valuePrefix: string = '';
  @Input() valueSuffix: string = '';

  @Output() onChartClick = new EventEmitter<{ label: string; value: number; index: number }>();
  @Output() periodoChange = new EventEmitter<PeriodoGrafico>();

  public selectedType: 'bar' | 'radar' | 'pie' | 'line' | 'doughnut';
  public periodoAtivo: PeriodoGrafico = 'SEMANAL';

  @ViewChild('chartCanvas') private chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  constructor() {
    this.selectedType = this.chartType;
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    this.periodoChange.emit(this.periodoAtivo);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedType = this.chartType;
    if (this.chartCanvas && changes['chartData'] && this.chartData?.labels?.length > 0) {
      this.createChart();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  selecionarPeriodo(periodo: PeriodoGrafico): void {
    if (periodo === this.periodoAtivo) return;
    this.periodoAtivo = periodo;
    this.periodoChange.emit(periodo);
  }

  mudarTipoGrafico(type: 'bar' | 'radar' | 'pie' | 'line' | 'doughnut'): void {
    if (type === this.selectedType) return;
    this.selectedType = type;
    this.createChart();
  }

  tipoGraficoTraduzido(tipo: string): string {
    const mapa: { [key: string]: string } = {
      bar: 'Barras',
      line: 'Linha',
      pie: 'Pizza',
      doughnut: 'Rosca',
      radar: 'Radar'
    };
    return mapa[tipo] || tipo;
  }

  private createChart(): void {
    if (!this.chartCanvas) return;
    this.chart?.destroy();
    if (!this.chartData || !this.chartData.labels || this.chartData.labels.length === 0) {
      return;
    }
    const processedData = this.processChartData(this.chartData);
    const chartConfig = this.getChartConfig(processedData);
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, chartConfig);
    }
  }

  private processChartData(data: AppChartData): AppChartData {
    if (!data) return data;
    const modernColors = this.getModernColors(data.labels.length);
    data.datasets.forEach(dataset => {
      if (this.selectedType === 'line') {
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
    data.datasets[0].label
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: data.datasets[0].label,
          font: {
            size: 16,
            weight: 'bold'
          },
          color: '#1e293b'
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

    const type = this.selectedType as ChartJsType;

    switch (this.selectedType) {
      case 'bar':
      case 'line':
        return { type, data, options: { ...commonOptions, scales: { y: { beginAtZero: true } } } };
      case 'pie':
      case 'doughnut':
        return { type, data, options: { ...commonOptions, plugins: { ...commonOptions.plugins, legend: { position: 'right' as const } } } };
      case 'radar':
        return { type: 'radar', data, options: commonOptions };
      default:
        throw new Error(`Tipo de gráfico não suportado: ${this.selectedType}`);
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