import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';
import { ApiService } from '@core/services/ApiService';

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './notification-settings.html',
  styleUrls: ['./notification-settings.scss']
})
export class NotificationSettings implements OnInit {
  settingsForm!: FormGroup;
  loading = false;

  private campaignId: string | null = null;
  private lojaId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      enableNotifications: [true],  
      sendDelay: [, [Validators.required, Validators.min(1), Validators.max(1440)]],
      logoUrl: ['']
    });

    this.loadSettings();
  }

  async loadSettings(): Promise<void> {
    if (!environment.production) {
      console.warn('MODO DEV: Carregando configurações mockadas.');
      this.settingsForm.patchValue({
        enableNotifications: true,
        sendDelay: 45,
        logoUrl: 'https://cdn.exemplo.com/logo.png'
      });
      this.campaignId = 'mock-campaign-id-123';
      this.lojaId = 'mock-loja-id-456';
      return;
    }

    try {
      const settings = await this.apiService.get('/api/campanhas/minha-campanha');

      if (settings) {
        this.campaignId = settings.id;
        this.lojaId = settings.lojaId;
        console.log('Configurações carregadas:', settings);
        this.settingsForm.patchValue({
          enableNotifications: settings.ativa,
          sendDelay: settings.tempoEsperaMin,
          logoUrl: settings.logoUrl
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      this.snackBar.open('Não foi possível carregar as configurações.', 'Fechar', { duration: 3000 });
    }
  }

  async onSave(): Promise<void> {
    if (this.settingsForm.invalid) return;

    this.loading = true;

    if (!environment.production) {
      this.snackBar.open('Configurações salvas com sucesso! (Simulação)', 'Fechar', { duration: 3000 });
      this.settingsForm.markAsPristine();
      this.loading = false;
      return;
    }

    const { enableNotifications, sendDelay, logoUrl } = this.settingsForm.value;

    const settingsData = {
      id: this.campaignId,
      lojaId: this.lojaId,
      ativa: enableNotifications,
      tempoEsperaMin: sendDelay,
      logoUrl
    };

    try {
      await this.apiService.post('/api/campanhas', settingsData);
      this.snackBar.open('Configurações salvas com sucesso!', 'Fechar', { duration: 3000 });
      this.settingsForm.markAsPristine();
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      this.snackBar.open('Erro ao salvar as configurações.', 'Fechar', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }
}
