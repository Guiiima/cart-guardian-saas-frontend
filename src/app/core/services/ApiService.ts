import { Injectable, Injector, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import createApp, { ClientApplication } from '@shopify/app-bridge';
import { getSessionToken } from '@shopify/app-bridge-utils';
import { AppBridgeState } from '@shopify/app-bridge';
import { environment } from '../../../environments/environment';
import {
  COMBINED_DASHBOARD_DATA,
  MOCK_RANKING,
  MOCK_RECUPERACAO,
} from '@core/mocks/dashboard';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private app?: ClientApplication<AppBridgeState>;
  private initializationPromise: Promise<void> | null = null;
  private apiUrl = environment.apiUrl;
  private isShopifyEmbedded = false;
  private authService?: AuthService;

  // ✅ Angular moderno: use `inject()` em vez de `constructor` se quiser mais clareza.
  private httpClient = inject(HttpClient);
  private injector = inject(Injector);

  /**
   * Garante que a inicialização ocorra apenas uma vez.
   */
  public whenReady(): Promise<void> {
    if (!this.initializationPromise) {
      this.initializationPromise = this.initializeAppLogic();
    }
    return this.initializationPromise;
  }

  /**
   * Inicializa a lógica do App Bridge da Shopify ou entra em modo Standalone.
   */
  private async initializeAppLogic(): Promise<void> {
    if (!environment.production) {
      console.warn(
        '🔧 MODO DESENVOLVIMENTO: Shopify App Bridge não será inicializado.'
      );
      this.isShopifyEmbedded = false;
      return;
    }

    try {
      const params = new URLSearchParams(window.location.search);
      const host = params.get('host');

      if (!host) {
        console.log('Parâmetro "host" não encontrado. Modo Standalone.');
        this.isShopifyEmbedded = false;
        return;
      }

      console.log('Parâmetro "host" encontrado. Modo Shopify Embedded.');
      this.isShopifyEmbedded = true;

      const config = await lastValueFrom(
        this.httpClient.get<any>(`${this.apiUrl}/api/config?host=${host}`)
      );

      if (!config?.apiKey) {
        throw new Error('API Key não recebida do backend.');
      }

      this.app = createApp({
        apiKey: config.apiKey,
        host: config.host,
        forceRedirect: true,
      });

      console.log('✅ Shopify App Bridge inicializado com sucesso.');
    } catch (error) {
      console.error('❌ Falha ao inicializar o App Bridge:', error);
      this.isShopifyEmbedded = false;
      return Promise.reject(error);
    }
  }

  /**
   * Retorna o cabeçalho de autorização Shopify.
   */
  private async getAuthHeaders(): Promise<HttpHeaders> {
    await this.whenReady();
    if (!this.app) throw new Error('Shopify App Bridge não está disponível.');

    const token = await getSessionToken(this.app);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /**
   * Monta os headers de autenticação de acordo com o modo (Shopify ou interno).
   */
  private async buildHeaders(): Promise<HttpHeaders> {
    let headers = new HttpHeaders();

    if (this.isShopifyEmbedded) {
      headers = await this.getAuthHeaders();
    } else {
      if (!this.authService) this.authService = this.injector.get(AuthService);
      const internalToken = this.authService.getToken();
      if (internalToken) {
        headers = headers.set('Authorization', `Bearer ${internalToken}`);
      }
    }

    return headers;
  }

  /**
   * Método GET padrão.
   */
  public async get(endpoint: string): Promise<any> {
    const url = this.apiUrl + endpoint;

    if (!environment.production) {
      return this.mockGet(endpoint);
    }

    await this.whenReady();

    try {
      const headers = await this.buildHeaders();
      return await lastValueFrom(this.httpClient.get(url, { headers }));
    } catch (error) {
      console.error(`Erro ao fazer GET para ${url}:`, error);
      return Promise.reject(error);
    }
  }

  /**
   * Método POST padrão.
   */
  public async post(endpoint: string, data: any): Promise<any> {
    const url = this.apiUrl + endpoint;

    if (!environment.production) {
      return await lastValueFrom(this.httpClient.post(url, data));
    }

    await this.whenReady();

    try {
      const headers = await this.buildHeaders();
      return await lastValueFrom(
        this.httpClient.post(url, data, { headers })
      );
    } catch (error) {
      console.error(`Erro ao fazer POST para ${url}:`, error);
      return Promise.reject(error);
    }
  }

  /**
   * Login e registro.
   */
  public async login(credentials: any): Promise<any> {
    return await lastValueFrom(
      this.httpClient.post(`${this.apiUrl}/api/auth/login`, credentials)
    );
  }

  public async register(credentials: any): Promise<any> {
    return await lastValueFrom(
      this.httpClient.post(`${this.apiUrl}/api/auth/register`, credentials)
    );
  }

  /**
   * Mock para ambiente de desenvolvimento.
   */
  private mockGet(endpoint: string): Promise<any> {
    if (endpoint.includes('/api/dashboard/combined')) {
      return Promise.resolve(COMBINED_DASHBOARD_DATA);
    }
    if (endpoint.includes('/api/dashboard/ranking')) {
      return Promise.resolve(MOCK_RANKING);
    }
    if (endpoint.includes('/api/dashboard/recuperacao')) {
      return Promise.resolve(MOCK_RECUPERACAO);
    }
    if (endpoint.includes('/api/settings')) {
      return Promise.resolve({ tenant: 'dev', features: [] });
    }
    return Promise.resolve({});
  }

  /**
   * Endpoints de configuração e integrações.
   */
  public async getSettings(): Promise<any> {
    return this.get('/api/settings');
  }

  public async saveSelectedTemplate(templateId: string): Promise<any> {
    return this.post('/api/settings/template', { templateId });
  }

  public async connectWooCommerceStore(data: {
    storeUrl: string;
    consumerKey: string;
    consumerSecret: string;
  }): Promise<any> {
    return this.post('/api/woocommerce/connect', data);
  }
  /**
   * Envia um pedido de redefinição de senha para o backend.
   * @param email O e-mail do utilizador.
   */
  public async forgotPassword(email: string): Promise<any> {
    const url = this.apiUrl + '/api/auth/forgot-password';
    return await lastValueFrom(this.httpClient.post(url, { email }));
  }

  /**
   * Envia o token de reset e a nova senha para o backend.
   * @param data O token e a nova senha.
   */
  public async resetPassword(data: { token: string, newPassword: string }): Promise<any> {
    const url = this.apiUrl + '/api/auth/reset-password';
    return await lastValueFrom(this.httpClient.post(url, data));
  }
}
