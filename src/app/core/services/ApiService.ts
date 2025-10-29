import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import createApp, { ClientApplication } from '@shopify/app-bridge';
import { getSessionToken } from '@shopify/app-bridge-utils';
import { AppBridgeState } from '@shopify/app-bridge';

import { environment } from '../../../environments/environment';

// Mock data para as chamadas GET em ambiente de desenvolvimento
import { COMBINED_DASHBOARD_DATA, MOCK_RANKING, MOCK_RECUPERACAO } from '@core/mocks/dashboard';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private app: ClientApplication<AppBridgeState> | undefined;
  private initializationPromise: Promise<void> | null = null;

  constructor(private httpClient: HttpClient) { }

  /**
   * Garante que a inicialização do App Bridge (se aplicável) seja concluída
   * antes de prosseguir. Usado pelo APP_INITIALIZER.
   */
  public whenReady(): Promise<void> {
    if (!this.initializationPromise) {
      this.initializationPromise = this.initializeAppBridge();
    }
    return this.initializationPromise;
  }

  /**
   * Inicializa o Shopify App Bridge, mas apenas em ambiente de produção.
   */
  private async initializeAppBridge(): Promise<void> {
    if (!environment.production) {
      console.warn('MODO DESENVOLVIMENTO: Shopify App Bridge não será inicializado.');
      return;
    }

    // A lógica de inicialização para produção permanece a mesma
    try {
      const params = new URLSearchParams(window.location.search);
      const host = params.get('host');

      if (!host) throw new Error('Parâmetro "host" não encontrado na URL.');
      
      const config = await lastValueFrom(this.httpClient.get<any>(`/api/config?host=${host}`));

      if (!config || !config.apiKey) throw new Error('API Key não recebida do backend.');

      this.app = createApp({
        apiKey: config.apiKey,
        host: config.host,
        forceRedirect: true,
      });
      console.log("Shopify App Bridge inicializado em modo de produção.");

    } catch (error) {
      console.error('Falha crítica ao inicializar o Shopify App Bridge:', error);
      return Promise.reject(error);
    }
  }

  /**
   * Obtém os cabeçalhos de autenticação com o token JWT da Shopify.
   * Só funciona em ambiente de produção.
   */
  private async getAuthHeaders(): Promise<HttpHeaders> {
    await this.whenReady();
    if (!this.app) throw new Error('Shopify App Bridge não está disponível.');
    const token = await getSessionToken(this.app);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /**
   * Realiza uma requisição GET para o backend.
   * Em desenvolvimento, retorna dados mockados.
   * Em produção, faz uma chamada autenticada.
   */
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

  /**
   * Realiza uma requisição POST para o backend.
   * Em desenvolvimento, faz a chamada real sem autenticação (via proxy).
   * Em produção, faz uma chamada autenticada.
   */
  public async post(endpoint: string, data: any): Promise<any> {
    // --- LÓGICA CORRIGIDA PARA TESTES LOCAIS ---
    if (!environment.production) {
      console.warn(`MODO DESENVOLVIMENTO: A fazer chamada POST REAL (sem token) para ${endpoint}`, data);
      
      // Faz a chamada de API real. O proxy.conf.json a redirecionará para o backend.
      const request$ = this.httpClient.post(endpoint, data);
      return await lastValueFrom(request$);
    }
    // ------------------------------------------

    // Lógica de produção
    try {
      const headers = await this.getAuthHeaders();
      const request$ = this.httpClient.post(endpoint, data, { headers });
      return await lastValueFrom(request$);
    } catch (error) {
      console.error(`Erro ao fazer POST para ${endpoint}:`, error);
      return Promise.reject(error);
    }
  }

  /**
   * Retorna dados mockados para as chamadas GET em ambiente de desenvolvimento.
   */
  private mockGet(endpoint: string): Promise<any> {
    console.warn(`MODO DESENVOLVIMENTO: Simulação de GET para ${endpoint}`);
    if (endpoint.includes('/api/dashboard/metrics')) return Promise.resolve(COMBINED_DASHBOARD_DATA);
    if (endpoint.includes('/api/analytics/ranking')) return Promise.resolve(MOCK_RANKING);
    if (endpoint.includes('/api/analytics/recuperacao')) return Promise.resolve(MOCK_RECUPERACAO);
    if (endpoint.includes('/api/settings')) return Promise.resolve({ id: 'mock-id-123', templateEmail: 'd-mock-template-id' });
    return Promise.resolve({});
  }

  // --- Funções Específicas da API (que usam os métodos genéricos GET/POST) ---

  public async getSettings(): Promise<any> {
    return this.get('/api/settings');
  }

  public async saveSelectedTemplate(templateId: string): Promise<any> {
    return this.post('/api/settings/template', { templateId });
  }

  public async connectWooCommerceStore(data: { storeUrl: string, consumerKey: string, consumerSecret: string }): Promise<any> {
    return this.post('/api/woocommerce/connect', data);
  }
}