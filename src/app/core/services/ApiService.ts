import { Injectable, inject } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import createApp, { ClientApplication } from '@shopify/app-bridge';
import { getSessionToken } from '@shopify/app-bridge-utils';
import { AppBridgeState } from '@shopify/app-bridge';
import { environment } from '../../../environments/environment';
import { COMBINED_DASHBOARD_DATA, MOCK_RANKING, MOCK_RECUPERACAO } from '@core/mocks/dashboard';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private app: ClientApplication<AppBridgeState> | undefined;
  private initializationPromise: Promise<void> | null = null;
  private apiUrl = environment.apiUrl;
  private isShopifyEmbedded = false;
  private authService: AuthService | undefined;

  constructor(private httpClient: HttpClient) { }

  public whenReady(): Promise<void> {
    if (!this.initializationPromise) {
      this.initializationPromise = this.initializeAppLogic();
    }
    return this.initializationPromise;
  }
private async initializeAppLogic(): Promise<void> {
        if (!environment.production) {
            console.warn('MODO DESENVOLVIMENTO: Shopify App Bridge não será inicializado.');
            this.isShopifyEmbedded = false;
            return;
        }

        try {
            const params = new URLSearchParams(window.location.search);
            const host = params.get('host');

            if (!host) {
                console.log('Parâmetro "host" não encontrado. Iniciando em modo Standalone (Netlify/WooCommerce).');
                this.isShopifyEmbedded = false;
                return;
            }

            this.isShopifyEmbedded = true;

            const config = await lastValueFrom(this.httpClient.get<any>(`${this.apiUrl}/api/config?host=${host}`));
            if (!config || !config.apiKey) throw new Error('API Key não recebida do backend.');

            this.app = createApp({
                apiKey: config.apiKey,
                host: config.host,
                forceRedirect: true,
            });
            console.log("Shopify App Bridge inicializado com sucesso.");
        } catch (error) {
            console.error('Falha crítica ao inicializar o Shopify App Bridge:', error);
            this.isShopifyEmbedded = false;
            return Promise.reject(error);
        }
    }

    private async getAuthHeaders(): Promise<HttpHeaders> {
        await this.whenReady();
        if (!this.app) throw new Error('Shopify App Bridge não está disponível.');

        const token = await getSessionToken(this.app);
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

  /**
   * Constrói os cabeçalhos de autenticação corretos dependendo do modo.
   */
  private async buildHeaders(): Promise<HttpHeaders> {
    let headers = new HttpHeaders();
    
    if (this.isShopifyEmbedded) {
      headers = await this.getAuthHeaders();
    } else {
      
      if (!this.authService) this.authService = inject(AuthService); 
      
      const internalToken = this.authService.getToken();
      if (internalToken) {
        headers = headers.set('Authorization', `Bearer ${internalToken}`);
      }
    }
    return headers;
  }


  public async get(endpoint: string): Promise<any> {
    const url = this.apiUrl + endpoint;

    if (!environment.production) {
      return this.mockGet(endpoint);
    }

    await this.whenReady(); 
    try {
      const headers = await this.buildHeaders();
      const request$ = this.httpClient.get(url, { headers });
      return await lastValueFrom(request$);
    } catch (error) {
      console.error(`Erro ao fazer GET para ${url}:`, error);
      return Promise.reject(error);
    }
  }

  public async post(endpoint: string, data: any): Promise<any> {
    const url = this.apiUrl + endpoint;

    if (!environment.production) {
      console.warn(`MODO DESENVOLVIMENTO: A fazer chamada POST REAL (sem token) para ${url}`, data);
      const request$ = this.httpClient.post(url, data);
      return await lastValueFrom(request$);
    }

    await this.whenReady(); 
    try {
      const headers = await this.buildHeaders();
      const request$ = this.httpClient.post(url, data, { headers });
      return await lastValueFrom(request$);
    } catch (error) {
      console.error(`Erro ao fazer POST para ${url}:`, error);
      return Promise.reject(error);
    }
  }


  public async login(credentials: any): Promise<any> {
    const url = this.apiUrl + '/api/auth/login';
    return await lastValueFrom(this.httpClient.post(url, credentials));
  }

  public async register(credentials: any): Promise<any> {
    const url = this.apiUrl + '/api/auth/register';
    return await lastValueFrom(this.httpClient.post(url, credentials));
  }


  private mockGet(endpoint: string): Promise<any> {
    try {
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
    } catch (e) {
      return Promise.resolve({});
    }

    return Promise.resolve({});
  }

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