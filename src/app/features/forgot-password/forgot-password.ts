import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth.service';
// Importe os módulos do Material que irá usar
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})
export class ForgotPassword implements OnInit {
  forgotForm!: FormGroup;
  isLoading = false;
  message: string | null = null;
  isError = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.forgotForm.invalid) return;

    this.isLoading = true;
    this.message = null;
    this.isError = false;

    try {
      const response = await this.authService.forgotPassword(this.forgotForm.value.email);
      this.message = response.message; 
    } catch (error: any) {
      this.isError = true;
      this.message = error?.error?.error || "Ocorreu um erro. Tente novamente.";
    } finally {
      this.isLoading = false;
    }
  }
}