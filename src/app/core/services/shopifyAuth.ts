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

  constructor(private httpClient: HttpClient) {}

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
        metricasDoPeriodo: this.generateMockMetrics(periodo)
      };

      return Promise.resolve(mockResponse);
    }

    const headers = await this.getAuthHeaders();
    const request$ = this.httpClient.get(endpoint, { headers });
    return await lastValueFrom(request$);
  }

  private generateMockMetrics(periodo: Periodo) {
    switch (periodo) {
      case 'SEMANAL':
        return {
          receitaRecuperada: 1250.75,
          taxaDeConversao: 14.2,
          emailsEnviados: 150,
          ticketMedioRecuperado: 295.50
        };
      case 'MENSAL':
        return {
          receitaRecuperada: 5890.50,
          taxaDeConversao: 11.8,
          emailsEnviados: 620,
          ticketMedioRecuperado: 310.20
        };
      case 'ANUAL':
        return {
          receitaRecuperada: 75430.20,
          taxaDeConversao: 9.5,
          emailsEnviados: 8100,
          ticketMedioRecuperado: 280.90
        };
      case 'DIARIO':
      default:
        return {
          receitaRecuperada: 185.30,
          taxaDeConversao: 18.5,
          emailsEnviados: 25,
          ticketMedioRecuperado: 320.00
        };
    }
  }
}
