import { CommonModule } from '@angular/common';
import { Component, Inject, Input, Output, EventEmitter} from '@angular/core';

export interface Atividade {
  id: string;
  produto: string;
  status: 'Recuperado' | 'Abandonado' | 'Em Recuperação';
}
export interface Tabs {
  id: string;
  titulo: string;
}

@Component({
  selector: 'app-table',
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.scss'
})
export class Table {
  // @Input()
  // tabs: Tabs[] = [];
  @Input()
  tabs: Tabs[] = [
    { id: 'abandonados', titulo: 'Abandonados' },
    { id: 'ranking', titulo: 'Ranking' }
  ];
  @Output()
  idTap = new EventEmitter<void>()
  



  atividades: Atividade[] = [
    { id: '#2030', produto: 'Fone de Ouvido Bluetooth', status: 'Recuperado' },
    { id: '#2029', produto: 'Notebook Gamer 15"', status: 'Abandonado' },
    { id: '#2028', produto: 'Smartwatch Série 8', status: 'Recuperado' },
    { id: '#2027', produto: 'Mochila Antifurto', status: 'Em Recuperação' },
    { id: '#2026', produto: 'Teclado Mecânico RGB', status: 'Abandonado' },
    { id: '#2025', produto: 'Mouse Gamer Sem Fio', status: 'Recuperado' },
    { id: '#2024', produto: 'Cadeira Ergonômica', status: 'Abandonado' },
    { id: '#2023', produto: 'Monitor Curvo 27"', status: 'Recuperado' },
    { id: '#2022', produto: 'Caixa de Som Bluetooth', status: 'Em Recuperação' },
    { id: '#2021', produto: 'SSD 1TB NVMe', status: 'Abandonado' },
    { id: '#2020', produto: 'Tablet 10.5"', status: 'Recuperado' },
    { id: '#2019', produto: 'Headset Gamer', status: 'Em Recuperação' },
    { id: '#2018', produto: 'Smart TV 50"', status: 'Recuperado' },
    { id: '#2017', produto: 'Placa de Vídeo RTX 4060', status: 'Abandonado' },
    { id: '#2016', produto: 'Câmera Digital', status: 'Em Recuperação' },
    { id: '#2015', produto: 'Console de Videogame', status: 'Recuperado' },
    { id: '#2014', produto: 'Microfone Condensador', status: 'Abandonado' },
    { id: '#2013', produto: 'Roteador Wi-Fi 6', status: 'Recuperado' },
    { id: '#2012', produto: 'Drone 4K', status: 'Em Recuperação' },
    { id: '#2011', produto: 'Impressora Multifuncional', status: 'Abandonado' }
  ];
  currentType: 'abandonados' | 'ranking' = 'abandonados';


  setTableTabs(tap: any): void {
    this.currentType = tap;
    this.idTap.emit();
    // if (type === 'abandonados') {
    //   this.carregarDadosAbandonados();
    // } else {
    //   this.carregarDadosRanking();
    // }
  }

}
