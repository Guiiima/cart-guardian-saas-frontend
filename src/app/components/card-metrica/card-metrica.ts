import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-metrica',
  imports: [CommonModule],
  templateUrl: './card-metrica.html',
  styleUrl: './card-metrica.scss'
})
export class CardMetrica {
  @Input() titulo: string = '';
  @Input() metrica: string = '';
  @Input() detalhe: string = '';

  isPositive(): boolean {
    return this.detalhe.startsWith('+');
  }

  isNegative(): boolean {
    return this.detalhe.startsWith('-');
  }
}
