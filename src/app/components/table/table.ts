import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';

export interface Atividade {
  id: string;
  produto: string;
  status: 'Recuperado' | 'Abandonado' | 'Em Recuperação';
}

@Component({
  selector: 'app-table',
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.scss'
})
export class Table {

  atividades: Atividade[] = [
    { id: '#2025', produto: 'Fone de Ouvido Bluetooth', status: 'Recuperado' },
    { id: '#2024', produto: 'Notebook Gamer 15"', status: 'Abandonado' },
    { id: '#2023', produto: 'Smartwatch Série 8', status: 'Recuperado' },
    { id: '#2022', produto: 'Mochila Antifurto', status: 'Em Recuperação' },
    { id: '#2021', produto: 'Teclado Mecânico RGB', status: 'Abandonado' },
    { id: '#2025', produto: 'Fone de Ouvido Bluetooth', status: 'Recuperado' },
    { id: '#2024', produto: 'Notebook Gamer 15"', status: 'Abandonado' },
    { id: '#2023', produto: 'Smartwatch Série 8', status: 'Recuperado' },
    { id: '#2022', produto: 'Mochila Antifurto', status: 'Em Recuperação' },
    { id: '#2021', produto: 'Teclado Mecânico RGB', status: 'Abandonado' }
  ];

}
