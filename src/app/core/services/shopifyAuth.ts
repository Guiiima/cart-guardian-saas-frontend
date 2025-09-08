import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import createApp, { ClientApplication } from '@shopify/app-bridge';
import { getSessionToken } from '@shopify/app-bridge-utils';
import { AppBridgeState } from '@shopify/app-bridge';

import { environment } from '../../../environments/environment';

type Periodo = 'DIARIO' | 'SEMANAL' | 'MENSAL' | 'ANUAL';

@Injectable({
  providedIn: 'root'
})
export class ShopifyAuthService {

  private app: ClientApplication<AppBridgeState> | undefined;
  private initializationPromise: Promise<void> | null = null;

  constructor(private httpClient: HttpClient) { }

  private ensureInitialized(): Promise<void> {
    if (!this.initializationPromise) {
      this.initializationPromise = this.initializeAppBridge();
    }
    return this.initializationPromise;
  }

  private async initializeAppBridge(): Promise<void> {
    if (!environment.production) {
      console.warn("MODO DESENVOLVIMENTO: Shopify App Bridge não será inicializado.");
      return;
    }

    try {
      const params = new URLSearchParams(window.location.search);
      const host = params.get('host');

      if (!host) {
        throw new Error('Parâmetro "host" não encontrado na URL.');
      }

      const config = await lastValueFrom(this.httpClient.get<any>(`/api/config?host=${host}`));
      console.log('Configurações recebidas pelo serviço:', config);

      if (config && config.apiKey) {
        this.app = createApp({
          apiKey: config.apiKey,
          host: config.host,
          forceRedirect: true,
        });
      } else {
        throw new Error('API Key não recebida do backend.');
      }
    } catch (error) {
      console.error('Falha crítica ao inicializar o Shopify App Bridge:', error);
      return Promise.reject(error);
    }
  }

  private async getAuthHeaders(): Promise<HttpHeaders> {
    await this.ensureInitialized();

    if (!this.app) {
      throw new Error('Shopify App Bridge não está disponível. Verifique se está no ambiente Shopify.');
    }
    const token = await getSessionToken(this.app);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  public async post(endpoint: string, data: any): Promise<any> {
    if (!environment.production) {
      console.warn(`MODO DESENVOLVIMENTO: Simulação de POST para ${endpoint}`, data);
      return Promise.resolve({ success: true, message: "Resposta mockada" });
    }
    const headers = await this.getAuthHeaders();
    const request$ = this.httpClient.post(endpoint, data, { headers });
    return await lastValueFrom(request$);
  }

  public async get(endpoint: string): Promise<any> {
    if (!environment.production) {
      const url = new URL(endpoint, 'http://dummy-base.com');
      const periodo = (url.searchParams.get('periodo')?.toUpperCase() || 'DIARIO') as Periodo;

      console.warn(`MODO DESENVOLVIMENTO: Simulação de GET para ${endpoint} com período '${periodo}'`);

      const mockResponse = {
        metricasDiarias: this.generateMockMetrics('DIARIO'),
        metricasDoPeriodo: this.generateChartData(periodo)
      };

      return Promise.resolve(mockResponse);
    }

    const headers = await this.getAuthHeaders();
    const request$ = this.httpClient.get(endpoint, { headers });
    return await lastValueFrom(request$);
  }

  /**
 * Função auxiliar para gerar um número aleatório com alguma variação.
 * @param baseValue O valor base para a randomização.
 * @param variationPercent A porcentagem de variação (ex: 0.5 para 50%).
 * @returns Um número aleatório.
 */
  private randomize(baseValue: number, variationPercent: number = 0.5): number {
    const variation = baseValue * variationPercent;
    const min = baseValue - variation;
    const max = baseValue + variation;
    const randomValue = Math.random() * (max - min) + min;
    return parseFloat(randomValue.toFixed(2)); // Arredonda para 2 casas decimais
  }

  private generateMockMetrics(periodo: Periodo) {
    // Agora, os valores base são usados para gerar dados aleatórios.
    // Isso simula os valores de UM DIA para os períodos diário, semanal e mensal,
    // e de UM MÊS para o período anual.
    switch (periodo) {
      case 'SEMANAL':
        return {
          receitaRecuperada: this.randomize(180), // Média diária de ~1250/7
          taxaDeConversao: this.randomize(14, 0.3),
          emailsEnviados: Math.floor(this.randomize(22)),
          ticketMedioRecuperado: this.randomize(295)
        };
      case 'MENSAL':
        return {
          receitaRecuperada: this.randomize(195), // Média diária de ~5900/30
          taxaDeConversao: this.randomize(12, 0.4),
          emailsEnviados: Math.floor(this.randomize(20)),
          ticketMedioRecuperado: this.randomize(310)
        };
      case 'ANUAL':
        return {
          receitaRecuperada: this.randomize(6200), // Média mensal de ~75000/12
          taxaDeConversao: this.randomize(9.5, 0.2),
          emailsEnviados: Math.floor(this.randomize(675)),
          ticketMedioRecuperado: this.randomize(280)
        };
      case 'DIARIO':
      default:
        return {
          receitaRecuperada: this.randomize(185),
          taxaDeConversao: this.randomize(18.5, 0.5),
          emailsEnviados: Math.floor(this.randomize(25)),
          ticketMedioRecuperado: this.randomize(320)
        };
    }
  }
  private generateChartData(periodo: Periodo) {
    const today = new Date();
    const data: { label: string; receitaRecuperada: number }[] = [];

    switch (periodo) {
      case 'SEMANAL': {
        const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const todayIndex = today.getDay(); // Hoje é Segunda-feira, então todayIndex será 1

        for (let i = 0; i < 7; i++) {
          data.push({
            label: weekDays[i],
            // PONTO CHAVE: Chama a função que gera dados *dentro* do loop
            // e zera os valores para dias futuros.
            receitaRecuperada: i <= todayIndex ? this.generateMockMetrics(periodo).receitaRecuperada : 0
          });
        }
        break;
      }

      case 'MENSAL': {
        // Itera do dia 1 até o dia atual do mês (hoje é dia 8)
        for (let day = 1; day <= today.getDate(); day++) {
          data.push({
            label: day.toString(),
            receitaRecuperada: this.generateMockMetrics(periodo).receitaRecuperada
          });
        }
        break;
      }

      case 'ANUAL': {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const currentMonth = today.getMonth(); // Setembro, então currentMonth será 8

        for (let i = 0; i < 12; i++) {
          data.push({
            label: months[i],
            receitaRecuperada: i <= currentMonth ? this.generateMockMetrics(periodo).receitaRecuperada : 0
          });
        }
        break;
      }

      default: { // DIARIO
        data.push({
          label: today.getDate().toString(),
          receitaRecuperada: this.generateMockMetrics(periodo).receitaRecuperada
        });
        break;
      }
    }

    return data;
  }
}
