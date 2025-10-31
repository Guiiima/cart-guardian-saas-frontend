import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
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

  isLoading = true; 
  isAlreadyConnected = false;
  errorMessage: string | null = null;
  connectForm!: FormGroup;
  showConsumerSecret = false;
  originalConsumerKey: string | null = null;

  ngOnInit(): void {
    this.connectForm = this.fb.nonNullable.group({
      storeUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      consumerKey: ['', Validators.required],
      consumerSecret: ['', Validators.required]
    });

    this.loadStoreStatus();

    // Monitora mudanças no campo consumerKey
    this.connectForm.get('consumerKey')?.valueChanges.subscribe(value => {
      if (this.originalConsumerKey && value !== this.originalConsumerKey) {
        this.showConsumerSecret = true;
        this.connectForm.get('consumerSecret')?.enable();
      }
    });
  }

  async loadStoreStatus(): Promise<void> {
    try {
      const settings = await this.apiService.getSettings();

      if (settings?.shop?.platform === 'WOOCOMMERCE') {
        this.isAlreadyConnected = true;
        this.originalConsumerKey = settings.shop.consumerKey;

        this.connectForm.patchValue({
          storeUrl: settings.shop.shopUrl,
          consumerKey: settings.shop.consumerKey,
          consumerSecret: ''
        });

        // Deixa apenas storeUrl desativado
        this.connectForm.get('storeUrl')?.disable();
        this.connectForm.get('consumerSecret')?.disable();

        // Oculta o campo consumerSecret inicialmente
        this.showConsumerSecret = false;
      }
    } catch {
      console.log('Nenhuma configuração de loja encontrada. Exibindo formulário de conexão.');
    } finally {
      this.isLoading = false;
    }
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
      this.isAlreadyConnected = true;
      this.connectForm.disable();
    } catch (error: any) {
      console.error('Erro ao conectar a loja WooCommerce', error);
      this.errorMessage = error?.error?.message ?? error?.message ?? 'Ocorreu um erro desconhecido.';
    } finally {
      this.isLoading = false;
    }
  }
}
