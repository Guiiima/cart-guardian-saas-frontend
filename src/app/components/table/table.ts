import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface Coluna<T extends object> {
  key: keyof T;
  label: string;
}
interface ItemComStatus {
  status: 'Recuperado' | 'Abandonado' | 'Recuperação';
  [key: string]: any;
}
export interface Tabs {
  id: string;
  titulo: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.scss'
})
export class Table<T extends object> {
  @Input() ths: Coluna<T>[] = [];
  @Input() lista: T[] = [];
  @Input() tabs: Tabs[] = [];

  @Output() idTap = new EventEmitter<string>();

  currentType: string = '';

  setTableTabs(tap: string): void {
    this.currentType = tap;
    this.idTap.emit(tap);
  }
  public getValor(item: T, key: keyof T): any {
    return item[key];
  }


  public getStatusClass(item: T): string {
    const itemComStatus = item as { status?: unknown };
    if (itemComStatus && typeof itemComStatus.status === 'string') {
      return itemComStatus.status.toLowerCase();
    }
    return '';
  }
}
