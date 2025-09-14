import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, registerables, ChartType as ChartJsType } from 'chart.js';

export interface AppChartData {
  labels: string[];
  datasets: any[];
}
export type PeriodoGrafico = 'SEMANAL' | 'MENSAL' | 'ANUAL';
export type ChartTheme = 'professional' | 'energetic' | 'dark';

const THEME_PALETTES = {
  professional: {
    primary: '#3498DB',
    danger: '#E74C3C',
    grid: 'rgba(0, 0, 0, 0.08)',
    text: '#1e293b',
    tooltipBg: '#1e293b',
  },
  energetic: {
    primary: '#1ABC9C',
    danger: '#E74C3C',
    grid: 'rgba(0, 0, 0, 0.08)',
    text: '#34495E',
    tooltipBg: '#34495E',
  },
  dark: {
    primary: '#5DADE2',
    danger: '#EF5350',
    grid: 'rgba(255, 255, 255, 0.1)',
    text: '#f9fafb',
    tooltipBg: '#111827',
  }
};

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
  @Input() theme: ChartTheme = 'professional';

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
    if (this.chartCanvas && (changes['chartData'] || changes['theme']) && this.chartData?.labels?.length > 0) {
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
    const mapa: { [key: string]: string } = { bar: 'Barras', line: 'Linha', pie: 'Pizza', doughnut: 'Rosca', radar: 'Radar' };
    return mapa[tipo] || tipo;
  }

  private createChart(): void {
    if (!this.chartCanvas) return;
    this.chart?.destroy();
    if (!this.chartData || !this.chartData.labels || this.chartData.labels.length === 0) return;

    const processedData = this.processChartData(this.chartData);
    const chartConfig = this.getChartConfig(processedData);
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, chartConfig);
    }
  }

  private processChartData(data: AppChartData): AppChartData {
    if (!data) return data;
    const palette = THEME_PALETTES[this.theme];
    const harmonicas = this.generateHarmoniousColors(palette.primary, data.labels.length);

    data.datasets.forEach(dataset => {
      if (this.selectedType === 'line') {
        dataset.backgroundColor = this.hexToRgba(palette.primary, 0.2);
        dataset.borderColor = palette.primary;
        dataset.tension = 0.4;
      } else if (this.selectedType === 'bar') {
        dataset.backgroundColor = harmonicas;
        dataset.borderColor = '#ffffff';
        dataset.borderWidth = 2;
      } else {
        dataset.backgroundColor = harmonicas;
        dataset.borderColor = harmonicas;
      }
    });

    return data;
  }

  private generateHarmoniousColors(hex: string, count: number): string[] {
    const colors: string[] = [];
    const base = this.hexToRgb(hex);

    for (let i = 0; i < count; i++) {
      const factor = 0.6 + (0.4 * i) / (count - 1);
      const r = Math.min(255, Math.round(base.r * factor));
      const g = Math.min(255, Math.round(base.g * factor));
      const b = Math.min(255, Math.round(base.b * factor));
      colors.push(`rgb(${r}, ${g}, ${b})`);
    }

    return colors;
  }

  private hexToRgb(hex: string): { r: number, g: number, b: number } {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }

  private hexToRgba(hex: string, alpha: number): string {
    const { r, g, b } = this.hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  private getChartConfig(data: AppChartData): any {
    const palette = THEME_PALETTES[this.theme];
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Meu Título do Gráfico',
          color: palette.text,
          font: {
            size: 18,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        },
        legend: {
          display: data.datasets.length > 1,
          labels: { color: palette.text }
        },
        tooltip: {
          backgroundColor: palette.tooltipBg,
          titleColor: palette.text === '#f9fafb' ? '#f9fafb' : '#ffffff',
          bodyColor: palette.text === '#f9fafb' ? '#f9fafb' : '#ffffff',
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
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: palette.grid },
          ticks: { color: palette.text }
        },
        x: {
          grid: { display: false },
          ticks: { color: palette.text }
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
    return { type, data, options: commonOptions };
  }
}
