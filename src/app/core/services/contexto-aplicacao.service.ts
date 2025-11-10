import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContextService {

  /**
   * Verifica se a aplicação está rodando dentro de um iframe.
   */
  public isInsideIframe(): boolean {
    return window.self !== window.top;
  }

  /**
   * Verifica se está no contexto do Shopify.
   * (Você pode melhorar isso depois checando query params, etc.)
   */
  public isShopifyContext(): boolean {
    return this.isInsideIframe(); 
  }
}