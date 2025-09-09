import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface Metrica {
  id: string;
  titulo: string;
  metrica: string;
  detalhe: string;
}

@Component({
  selector: 'app-card-metrica',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-metrica.html',
  styleUrl: './card-metrica.scss'
})
export class CardMetrica {
  @Input() dados!: Metrica;
  @Input() selecionado: boolean = false;
  @Output() aoSelecionar = new EventEmitter<void>();

  get isPositive(): boolean {
    return this.dados && this.dados.detalhe.startsWith('+');
  }

  get isNegative(): boolean {
    return this.dados && this.dados.detalhe.startsWith('-');
  }

  onCardClick(): void {
    this.aoSelecionar.emit();
  }
}
