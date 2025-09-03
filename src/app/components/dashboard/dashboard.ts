import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Setting } from '../setting/setting';
import { ChartData } from 'chart.js';
import { AppChartData, ChartComponentComponent } from "../chart-component/chart-component";
import { Table } from '../table/table';
import { CardMetrica } from '../card-metrica/card-metrica';
export interface Metrica {
  titulo: string;
  metrica: string;
  detalhe: string;
}
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ChartComponentComponent, Table, CardMetrica],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  @Output()
  congiguracao = new EventEmitter<boolean>();
  isDropdownOpen = false;
  constructor(private elementRef: ElementRef, private dialog: MatDialog) { }
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  openConfig(): void {
    // this.congiguracao.emit(true);
    // this.isDropdownOpen = false;
    this.dialog.open(Setting, {
      width: '400px',
      data: { mensagem: 'Olá do pai!' }
    });
  }
  
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
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target) && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }
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
