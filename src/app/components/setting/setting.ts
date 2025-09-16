import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

// Imports dos Módulos do Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { ShopifyAuthService } from '@core/services/shopifyAuth'; 
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './setting.html',
  styleUrls: ['./setting.scss']
})
export class Setting implements OnInit {
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
      notificationMessage: ['', Validators.required],
      enableNotifications: [true],
      sendDelay: [10, [Validators.required, Validators.min(1)]]
    });

    this.loadSettings();
  }

  async loadSettings(): Promise<void> {
    // ---- LÓGICA DE DESENVOLVIMENTO LOCAL ----
    if (!environment.production) {
      console.warn("MODO DESENVOLVIMENTO: Usando dados mockados para carregar as configurações.");
      this.settingsForm.patchValue({
        notificationMessage: "Este é um template de teste carregado localmente.",
        enableNotifications: true,
        sendDelay: 45
      });
      this.campaignId = "mock-campaign-id-123";
      this.lojaId = "mock-loja-id-456";
      return; // Pula a chamada de API real
    }
    // -----------------------------------------

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
    if (this.settingsForm.valid) { // A verificação 'dirty' pode atrapalhar em alguns casos
      
      // ---- LÓGICA DE DESENVOLVIMENTO LOCAL ----
      if (!environment.production) {
        console.warn("MODO DESENVOLVIMENTO: Simulação de salvamento bem-sucedida.", this.settingsForm.value);
        this.snackBar.open('Configurações salvas com sucesso! (Simulação)', 'Fechar', { duration: 3000 });
        this.settingsForm.markAsPristine();
        return; // Pula a chamada de API real
      }
      // -----------------------------------------

      const settingsData = {
        id: this.campaignId,
        lojaId: this.lojaId,
        templateEmail: this.settingsForm.value.notificationMessage,
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