import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '@core/services/ApiService';


@Component({
  selector: 'app-connect-woocommerce',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './connect-woocommerce.html',
  styleUrls: ['./connect-woocommerce.scss']
})
export class ConnectWoocommerce implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private apiService = inject(ApiService);

  isLoading = false;
  errorMessage: string | null = null;

connectForm!: FormGroup<{
  storeUrl: FormControl<string>;
  consumerKey: FormControl<string>;
  consumerSecret: FormControl<string>;
}>;

  ngOnInit(): void {
    this.connectForm = this.fb.nonNullable.group({
      storeUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      consumerKey: ['', Validators.required],
      consumerSecret: ['', Validators.required]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.connectForm.invalid) {
      this.connectForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    try {
      await this.apiService.connectWooCommerceStore(this.connectForm.getRawValue());

      alert('Loja conectada com sucesso!'); 
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Erro ao conectar a loja WooCommerce', error);
      this.errorMessage = error?.error?.error || 'Ocorreu um erro desconhecido. Tente novamente.';
    } finally {
      this.isLoading = false;
    }
  }
}
