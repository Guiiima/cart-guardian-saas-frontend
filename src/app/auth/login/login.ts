import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'; // FormsModule é redundante
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necessário para *ngIf
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// 1. Importe o seu serviço de autenticação
import { AuthService } from '@core/services/auth.service'; // Verifique se este é o caminho correto

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  isLoading = false; 
  errorMessage: string | null = null; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  
  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); 
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    try {
      await this.authService.login(this.loginForm.value);
    } catch (error: any) {
      console.error('Falha no login', error);
      this.errorMessage = error?.error?.error || 'E-mail ou palavra-passe inválidos.';
    } finally {
      this.isLoading = false;
    }
  }
}