import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './ApiService';

// Interface para os dados do utilizador que guardamos
interface UserState {
  email: string;
  isLoggedIn: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiService = inject(ApiService);
  private router = inject(Router);

  private readonly TOKEN_KEY = 'cartguardian_token';

  // Um 'Subject' para que outros componentes saibam em tempo real se o utilizador está logado
  private currentUserSubject = new BehaviorSubject<UserState | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() { }

  /**
   * Verifica se o utilizador está autenticado (se existe um token).
   */
  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Pega o token JWT interno do localStorage.
   */
  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Guarda o token JWT interno no localStorage.
   */
  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Remove o token JWT interno do localStorage.
   */
  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Verifica o localStorage no arranque para ver se o utilizador já tem uma sessão.
   */
  private getUserFromStorage(): UserState | null {
    if (this.isAuthenticated()) {
      // No futuro, podemos guardar mais dados do utilizador (como o e-mail) no localStorage
      return { email: 'utilizador@logado.com', isLoggedIn: true }; 
    }
    return null;
  }

  /**
   * Tenta fazer login no backend interno.
   * @param credentials - email e password
   */
  async login(credentials: { email: string, password: string }): Promise<any> {
    const response = await this.apiService.login(credentials); // Chama o endpoint público de login
    if (response && response.token) {
      this.saveToken(response.token);
      this.currentUserSubject.next({ email: response.email, isLoggedIn: true });
      this.router.navigate(['/dashboard']); // Redireciona para o dashboard após o login
    }
    return response;
  }

  /**
   * Regista um novo utilizador no backend interno.
   * @param credentials - email e password
   */
  async register(credentials: { email: string, password: string }): Promise<any> {
    const response = await this.apiService.register(credentials); // Chama o endpoint público de registo
    if (response && response.token) {
      this.saveToken(response.token);
      this.currentUserSubject.next({ email: response.email, isLoggedIn: true });
      // Redireciona para o passo de conexão da loja
      this.router.navigate(['/connect-woocommerce']); 
    }
    return response;
  }

  /**
   * Faz logout do utilizador.
   */
  logout(): void {
    this.removeToken();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']); // Redireciona para a página de login
  }
}