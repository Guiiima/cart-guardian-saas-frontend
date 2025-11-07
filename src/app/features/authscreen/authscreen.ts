import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-authscreen',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './authscreen.html',
  styleUrls: ['./authscreen.scss']
})
export class Authscreen implements OnInit {
  isRightPanelActive = false;
  isLoading = false;
  errorMessageLogin: string | null = null;
  errorMessageRegister: string | null = null;

  signInForm!: FormGroup;
  signUpForm!: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.initializeForms();
  }

  // --- Inicializa os formulários ---
  private initializeForms(): void {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/) // Exemplo: força senha com maiúscula, minúscula e número
        ]
      ],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // --- Valida se as senhas coincidem ---
  private passwordMatchValidator(form: FormGroup): void {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword) {
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ mismatch: true });
      } else {
        confirmPassword.setErrors(null);
      }
    }
  }

  // --- SUBMIT LOGIN ---
  async onLoginSubmit(): Promise<void> {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.clearErrors();

    try {
      // await this.authService.login(this.signInForm.value);
      this.router.navigate(['/HomeScreen']);
    } catch (error: any) {
      console.error('Falha no login:', error);
      this.errorMessageLogin = error?.error?.error || 'E-mail ou palavra-passe inválidos.';
    } finally {
      this.isLoading = false;
    }
  }

  // --- SUBMIT REGISTRO ---
  async onRegisterSubmit(): Promise<void> {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.clearErrors();

    try {
      // await this.authService.register(this.signUpForm.value);
      console.log('Cadastro bem-sucedido!', this.signUpForm.value);
    } catch (error: any) {
      console.error('Falha no registo:', error);
      this.errorMessageRegister = error?.error?.error || 'Este e-mail já está a ser utilizado.';
    } finally {
      this.isLoading = false;
    }
  }

  // --- Troca de telas ---
  toggleSignUp(): void {
    this.isRightPanelActive = true;
    this.clearErrors();
  }

  toggleSignIn(): void {
    this.isRightPanelActive = false;
    this.clearErrors();
  }

  // --- Limpa mensagens de erro ---
  private clearErrors(): void {
    this.errorMessageLogin = null;
    this.errorMessageRegister = null;
  }

  // --- Getters úteis para o HTML ---
  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }
}
