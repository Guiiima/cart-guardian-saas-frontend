import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import createApp, { ClientApplication } from '@shopify/app-bridge';
import { getSessionToken } from '@shopify/app-bridge-utils';
import { AppBridgeState } from '@shopify/app-bridge';

import { environment } from '../../../environments/environment';

// Mock data
import { COMBINET_DASHBOARD_DATA, MOCK_RANKING, MOCK_RECUPERACAO_SIMPLE } from '@core/mocks/dashboard';

@Injectable({
  providedIn: 'root'
})
export class ShopifyAuthService {

  private app: ClientApplication<AppBridgeState> | undefined;
  private initializationPromise: Promise<void> | null = null;

  constructor(private httpClient: HttpClient) {}

  // Inicialização única do App Bridge
  public whenReady(): Promise<void> {
    if (!this.initializationPromise) {
      this.initializationPromise = this.initializeAppBridge();
    }
    return this.initializationPromise;
  }

  private async initializeAppBridge(): Promise<void> {
    if (!environment.production) {
      console.warn('MODO DESENVOLVIMENTO: Shopify App Bridge não será inicializado.');
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const host = params.get('host');

    if (!host) throw new Error('Parâmetro "host" não encontrado na URL.');

    try {
      const config = await lastValueFrom(this.httpClient.get<any>(`/api/config?host=${host}`));

      if (!config || !config.apiKey) throw new Error('API Key não recebida do backend.');

      this.app = createApp({
        apiKey: config.apiKey,
        host: config.host,
        forceRedirect: true,
      });

    } catch (error) {
      console.error('Falha ao inicializar o Shopify App Bridge:', error);
      return Promise.reject(error);
    }
  }

  // Retorna os headers com token JWT
  private async getAuthHeaders(): Promise<HttpHeaders> {
    await this.whenReady();

    if (!this.app) throw new Error('Shopify App Bridge não disponível.');

    const token = await getSessionToken(this.app);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // GET genérico
  public async get(endpoint: string): Promise<any> {
    if (!environment.production) {
      return this.mockGet(endpoint);
    }

    try {
      const headers = await this.getAuthHeaders();
      const request$ = this.httpClient.get(endpoint, { headers });
      return await lastValueFrom(request$);
    } catch (error) {
      console.error(`Erro ao fazer GET para ${endpoint}:`, error);
      return Promise.reject(error);
    }
  }

  // POST genérico
  public async post(endpoint: string, data: any): Promise<any> {
    if (!environment.production) {
      console.warn(`MODO DESENVOLVIMENTO: Simulação de POST para ${endpoint}`, data);
      return Promise.resolve({ success: true, message: 'Resposta mockada' });
    }

    try {
      const headers = await this.getAuthHeaders();
      const request$ = this.httpClient.post(endpoint, data, { headers });
      return await lastValueFrom(request$);
    } catch (error) {
      console.error(`Erro ao fazer POST para ${endpoint}:`, error);
      return Promise.reject(error);
    }
  }

  // Mock de GET
  private mockGet(endpoint: string): Promise<any> {
    if (endpoint.includes('/api/dashboard/metrics')) return Promise.resolve(COMBINET_DASHBOARD_DATA);
    if (endpoint.includes('/api/analytics/ranking')) return Promise.resolve(MOCK_RANKING);
    if (endpoint.includes('/api/analytics/recuperacao')) return Promise.resolve(MOCK_RECUPERACAO_SIMPLE);
    if (endpoint.includes('/api/settings')) return Promise.resolve({ id: 'mock-id-123', templateEmail: 'd-mock-template-id' });
    return Promise.resolve({});
  }

  // Funções específicas
  public async saveSelectedTemplate(templateId: string): Promise<any> {
    return this.post('/api/settings/template', { templateId });
  }

  public async getSettings(): Promise<any> {
    return this.get('/api/settings');
  }
}
