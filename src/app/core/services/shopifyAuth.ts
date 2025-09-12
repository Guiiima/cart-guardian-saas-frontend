import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import createApp, { ClientApplication } from '@shopify/app-bridge';
import { getSessionToken } from '@shopify/app-bridge-utils';
import { AppBridgeState } from '@shopify/app-bridge';
import { MOCK_METRICAS } from '@core/mocks/dashboard';
import { environment } from '../../../environments/environment';

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
      return;
    }

    try {
      const params = new URLSearchParams(window.location.search);
      const host = params.get('host');

      if (!host) {
        throw new Error('Parâmetro "host" não encontrado na URL.');
      }

      const config = await lastValueFrom(this.httpClient.get<any>(`/api/config?host=${host}`));

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
      throw new Error('Shopify App Bridge não está disponível.');
    }
    const token = await getSessionToken(this.app);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  public async post(endpoint: string, data: any): Promise<any> {
    if (!environment.production) {
      return Promise.resolve({ success: true, message: "Resposta mockada" });
    }
    const headers = await this.getAuthHeaders();
    const request$ = this.httpClient.post(endpoint, data, { headers });
    return await lastValueFrom(request$);
  }

  public async get(endpoint: string): Promise<any> {
    if (!environment.production) {
      await new Promise(resolve => setTimeout(resolve, 400));

      if (endpoint.includes('/api/dashboard/metrics')) {
        return MOCK_METRICAS;
      }
      return Promise.resolve({});
    }

    const headers = await this.getAuthHeaders();
    const request$ = this.httpClient.get(endpoint, { headers });
    return await lastValueFrom(request$);
  }
  public async getMetrics(): Promise<any> {
    return MOCK_METRICAS;
  }
}
