import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import createApp, { ClientApplication } from '@shopify/app-bridge';
import { getSessionToken } from '@shopify/app-bridge-utils';
import { AppBridgeState } from '@shopify/app-bridge';

@Injectable({
  providedIn: 'root'
})
export class ShopifyAuthService {

  private app: ClientApplication<AppBridgeState> | undefined;
  private initializationPromise: Promise<void>;

  constructor(private httpClient: HttpClient) {
    // Inicia a inicialização assíncrona assim que o serviço é criado
    this.initializationPromise = this.initializeAppBridge();
  }

  // O método de inicialização agora é privado e busca os dados da API
  private async initializeAppBridge(): Promise<void> {
    try {
      const params = new URLSearchParams(window.location.search);
      const host = params.get('host');

      if (!host) {
        throw new Error('Parâmetro "host" não encontrado na URL.');
      }
      
      // Busca a configuração do nosso backend
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
      // Rejeita a promessa para que outras partes do app saibam que falhou
      return Promise.reject(error);
    }
  }

  // Garante que o App Bridge está pronto antes de continuar
  private async ensureInitialized(): Promise<void> {
    return this.initializationPromise;
  }

  // O método para obter os headers agora espera a inicialização
  private async getAuthHeaders(): Promise<HttpHeaders> {
    await this.ensureInitialized(); // Espera a inicialização terminar
    
    if (!this.app) {
      throw new Error('Shopify App Bridge não foi inicializado.');
    }
    const token = await getSessionToken(this.app);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Seus métodos de API agora esperam a inicialização automaticamente
  public async post(endpoint: string, data: any): Promise<any> {
    const headers = await this.getAuthHeaders();
    const request$ = this.httpClient.post(endpoint, data, { headers });
    return await lastValueFrom(request$);
  }

  public async get(endpoint: string): Promise<any> {
    const headers = await this.getAuthHeaders();
    const request$ = this.httpClient.get(endpoint, { headers });
    return await lastValueFrom(request$);
  }
}