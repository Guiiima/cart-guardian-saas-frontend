import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface Coluna<T extends object> {
  key: keyof T;
  label: string;
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

  ngOnInit(): void {
    if (this.tabs.length > 0) {
      this.currentType = this.tabs[0].id;
      this.setTableTabs(this.currentType);
    }
  }
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
