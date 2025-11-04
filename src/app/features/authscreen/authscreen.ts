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
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  async onLoginSubmit(): Promise<void> {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.clearErrors();

    try {
      //await this.authService.login(this.signInForm.value);
      this.router.navigate(['/HomeSreen']);
    } catch (error: any) {
      console.error('Falha no login:', error);
      this.errorMessageLogin = error?.error?.error || 'E-mail ou palavra-passe inválidos.';
    } finally {
      this.isLoading = false;
    }
  }

  async onRegisterSubmit(): Promise<void> {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.clearErrors();

    try {
      //await this.authService.register(this.signUpForm.value);
      this.router.navigate(['/Login']);
    } catch (error: any) {
      console.error('Falha no registo:', error);
      this.errorMessageRegister = error?.error?.error || 'Este e-mail já está a ser utilizado.';
    } finally {
      this.isLoading = false;
    }
  }

  toggleSignUp(): void {
    this.isRightPanelActive = true;
    this.clearErrors();
  }

  toggleSignIn(): void {
    this.isRightPanelActive = false;
    this.clearErrors();
  }

  // --- Limpeza de mensagens ---
  private clearErrors(): void {
    this.errorMessageLogin = null;
    this.errorMessageRegister = null;
  }
}
