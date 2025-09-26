import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from 'environments/environment';
import { ShopifyAuthService } from '@core/services/shopifyAuth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  // Precisamos importar o ReactiveFormsModule para o [formGroup]
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './notification-settings.html',
  styleUrls: ['./notification-settings.scss']
})
export class NotificationSettings implements OnInit {
  settingsForm!: FormGroup;
  private campaignId: string | null = null;
  private lojaId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private shopifyAuthService: ShopifyAuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      enableNotifications: [true],
      sendDelay: [10, [Validators.required, Validators.min(1)]]
    });

    this.loadSettings();
  }

  async loadSettings(): Promise<void> {
    if (!environment.production) {
      console.warn("MODO DESENVOLVIMENTO: Usando dados mockados para carregar as configurações.");
      this.settingsForm.patchValue({
        enableNotifications: true,
        sendDelay: 45
      });
      this.campaignId = "mock-campaign-id-123";
      this.lojaId = "mock-loja-id-456";
      return; 
    }

    try {
      const settings = await this.shopifyAuthService.get('/api/campanhas/minha-campanha');

      if (settings) {
        this.campaignId = settings.id;
        this.lojaId = settings.lojaId;
        this.settingsForm.patchValue({
          notificationMessage: settings.templateEmail,
          enableNotifications: settings.ativa,
          sendDelay: settings.tempoEsperaMin
        });
      }
    } catch (error) {
      console.error('Erro ao carregar as configurações', error);
      this.snackBar.open('Não foi possível carregar as configurações.', 'Fechar', { duration: 3000 });
    }
  }

  async onSave(): Promise<void> {
    if (this.settingsForm.valid) { 
      if (!environment.production) {
        console.warn("MODO DESENVOLVIMENTO: Simulação de salvamento bem-sucedida.", this.settingsForm.value);
        this.snackBar.open('Configurações salvas com sucesso! (Simulação)', 'Fechar', { duration: 3000 });
        this.settingsForm.markAsPristine();
        return; 
      }

      const settingsData = {
        id: this.campaignId,
        lojaId: this.lojaId,
        templateEmail: this.settingsForm.value.templateId,
        ativa: this.settingsForm.value.enableNotifications,
        tempoEsperaMin: this.settingsForm.value.sendDelay
      };

      try {
        await this.shopifyAuthService.post('/api/campanhas', settingsData);

        this.snackBar.open('Configurações salvas com sucesso!', 'Fechar', { duration: 3000 });
        this.settingsForm.markAsPristine();

      } catch (error) {
        console.error('Erro ao salvar as configurações', error);
        this.snackBar.open('Erro ao salvar as configurações.', 'Fechar', { duration: 3000 });
      }
    }
  }
}