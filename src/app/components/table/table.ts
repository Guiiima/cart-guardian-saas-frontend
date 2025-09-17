import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

export type TipoTabela = 'ranking' | 'recuperacoes';

export interface Coluna<T extends object> {
  key: keyof T;
  label: string;
}

export interface Tabs {
  id: TipoTabela; 
  titulo: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrls: ['./table.scss'] 
})
export class Table<T extends object> implements OnInit {
  @Input() ths: Coluna<T>[] = [];
  @Input() lista: T[] = [];
  @Input() tabs: Tabs[] = [];

  @Output() idTap = new EventEmitter<TipoTabela>();

  currentType!: TipoTabela; 

  ngOnInit(): void {
    if (this.tabs.length > 0) {
      this.currentType = this.tabs[0].id;
      this.setTableTabs(this.currentType);
      this.lista
    }
  }

  setTableTabs(tap: TipoTabela): void {
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
