import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from "app/components/header/header";
import { CardMetrica } from "app/components/card-metrica/card-metrica";
import { ChartComponentComponent, AppChartData } from 'app/components/chart-component/chart-component';
import { Coluna, Table, Tabs, TipoTabela } from 'app/components/table/table';
import { Metrica } from '@core/interface/metrica';
import { Dashboard } from '@core/services/dashboard';
import { metrica } from '@core/enums/metrica';


type Periodo = 'SEMANAL' | 'MENSAL' | 'ANUAL';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [CommonModule, Header, CardMetrica, ChartComponentComponent, Table],
  templateUrl: './home-screen.html',
  styleUrl: './home-screen.scss'
})
export class HomeScreen implements OnInit {

  public periodoSelecionado: Periodo = 'SEMANAL';
  public metricaSelecionada: metrica = metrica.RECEITA;

  public metricasDosCards: Metrica[] = [];
  public dadosDoGrafico: AppChartData = { labels: [], datasets: [] };
  public colunasDaTabela: Coluna<any>[] = [];
  public tabsDaTabela: Tabs[] = [];
  public listTable: any[] = [];

  constructor(private dashboardService: Dashboard) { }

  ngOnInit(): void {
    this.carregarDadosDoDashboard();
    this.configurarComponentesVisuaisTable();
    this.carregarTabela('recuperacoes');
  }

  async carregarTabela(type: 'ranking' | 'recuperacoes'): Promise<void> {
    try {
      setTimeout(async () => {
        this.listTable = await this.dashboardService.getTableData(type);
        this.listTable
      }, 0);
    } catch (error) {
      console.error(`Erro ao carregar dados de ${type}:`, error);
      this.listTable = [];
    }
  }

  public configurarComponentesVisuaisTable(): void {
    this.tabsDaTabela = [
      { id: 'ranking', titulo: 'Ranking Produtos Abandonados' },
      { id: 'recuperacoes', titulo: 'Produtos Recuperados' },
    ];
  }

  public async configurarComponentesVisuaisTds(type: TipoTabela): Promise<void> {
    switch (type) {
      case 'ranking':
        this.colunasDaTabela = [
          { key: 'id', label: 'Id' },
          { key: 'posicao', label: 'Posição' },
          { key: 'valor', label: 'Valor Do produto' },
          { key: 'quantidade', label: 'Quantidade Abandonada' }
        ];
        this.carregarTabela('ranking');
        break;
      case 'recuperacoes':
        this.colunasDaTabela = [
          { key: 'id', label: 'ID' },
          { key: 'produto', label: 'Produto' },
          { key: 'status', label: 'Status' },
        ];
        this.carregarTabela('recuperacoes');
        break;
    }
  }

  async carregarDadosDoDashboard(): Promise<void> {
    try {
      const data = await this.dashboardService.getHomeScreenData(this.metricaSelecionada, this.periodoSelecionado);
      this.metricasDosCards = data.metricasDosCards;
      this.dadosDoGrafico = data.dadosDoGrafico;
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    }
  }

  public onPeriodoChange(novoPeriodo: Periodo): void {
    this.periodoSelecionado = novoPeriodo;
    this.carregarDadosDoDashboard();
  }

  public onCardSelect(metricaId: metrica): void {
    this.metricaSelecionada = metricaId;
    this.carregarDadosDoDashboard();
  }
}