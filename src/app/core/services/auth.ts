import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  async login(credentials: { email: string; password: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (
          credentials.email === 'admin@example.com' &&
          credentials.password === 'password123'
        ) {
          console.log('Login successful');
          resolve();
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000); 
    });
  }

  async logout(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('User logged out');
        resolve();
      }, 500);
    });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  clearAuthToken(): void {
    localStorage.removeItem('auth_token');
  }
}
