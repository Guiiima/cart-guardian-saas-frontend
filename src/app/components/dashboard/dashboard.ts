import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Setting } from '../setting/setting';
import { ChartData } from 'chart.js';
import { AppChartData, ChartComponentComponent } from "../chart-component/chart-component";

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ChartComponentComponent],
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
    labels: ['Sudeste', 'Nordeste', 'Sul', 'Centro-Oeste', 'Norte'],
    datasets: [{
      label: 'Clientes por Região',
      data: [850, 620, 410, 310, 180],
      // Cores diferentes para o gráfico de pizza
      backgroundColor: [
        'rgba(26, 188, 156, 0.8)',
        'rgba(230, 126, 34, 0.8)',
        'rgba(155, 89, 182, 0.8)',
        'rgba(241, 196, 15, 0.8)',
        'rgba(231, 76, 60, 0.8)'
      ]
    }]
  };
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target) && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }

}
