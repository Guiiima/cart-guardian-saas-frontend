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

  /**
   * Controla o loader INICIAL da página (o spinner).
   * Começa true e vira false quando os dados da loja são carregados.
   */
  isLoading = true;

  /**
   * Controla o estado "Validando..." do botão de submit.
   */
  isConnecting = false;

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
      if (this.originalConsumerKey && value !== this.originalConsumerKey || this.originalConsumerKey === null) {
        this.showConsumerSecret = true;
        this.connectForm.get('consumerSecret')?.enable();
      }
    });
  }

  async loadStoreStatus(): Promise<void> {
    try {
      // Simula um pequeno delay para a animação de carregamento ser visível
      // Remova isso em produção se a chamada de API for sempre rápida.
      // await new Promise(resolve => setTimeout(resolve, 1500)); 

      const settings = await this.apiService.getSettings();

      if (settings?.shop?.platform === 'WOOCOMMERCE') {
        this.isAlreadyConnected = true;
        this.originalConsumerKey = settings.shop.consumerKey;

        this.connectForm.patchValue({
          storeUrl: settings.shop.shopUrl,
          consumerKey: settings.shop.consumerKey,
          consumerSecret: ''
        });

        this.connectForm.get('storeUrl')?.disable();
        this.connectForm.get('consumerSecret')?.disable();
        this.showConsumerSecret = false;
      }
    } catch {
      // Erro ao carregar, mas o formulário deve aparecer mesmo assim
    } finally {
      // Este é o gatilho!
      // Mudar para false fará o @if no HTML trocar o spinner pelo formulário.
      this.isLoading = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.connectForm.invalid) {
      this.connectForm.markAllAsTouched();
      return;
    }

    // Usa a nova variável 'isConnecting' para o botão
    this.isConnecting = true; 
    this.errorMessage = null;

    try {
      await this.apiService.connectWooCommerceStore(this.connectForm.getRawValue());
      
      // NOTA: Eu removi o alert()! 
      // Alertas pausam a execução e são ruins para UX.
      // Substitua por um "toast" ou mensagem de sucesso na UI.
      // Para este exemplo, vou apenas navegar.
      console.log('Loja conectada com sucesso!');
      
      this.isAlreadyConnected = true;
      this.connectForm.disable();

      // Adiciona um pequeno delay antes de navegar para o usuário ver o sucesso
      setTimeout(() => {
        this.router.navigate(['/DashBoard']); // Exemplo de navegação
      }, 1000);

    } catch (error: any) {
      console.error('Erro ao conectar a loja WooCommerce', error);
      this.errorMessage = error?.error?.message ?? error?.message ?? 'Ocorreu um erro desconhecido.';
    } finally {
      this.isConnecting = false;
    }
  }
}