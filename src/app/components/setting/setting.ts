import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

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

  constructor(
    private fb: FormBuilder,
    //private dataService: DataService,
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

  loadSettings(): void {
    // this.dataService.getSettings().subscribe((settings: { [key: string]: any; }) => {
    //   this.settingsForm.patchValue(settings);
    // });
  }

  onSave(): void {
    // if (this.settingsForm.valid && this.settingsForm.dirty) {
    //   this.dataService.saveSettings(this.settingsForm.value).subscribe({
    //     next: () => {
    //       this.snackBar.open('Configurações salvas com sucesso!', 'Fechar', { duration: 3000 });
    //       this.settingsForm.markAsPristine();
    //     },
    //     error: (err: any) => {
    //       console.error('Erro ao salvar as configurações', err);
    //       this.snackBar.open('Erro ao salvar as configurações.', 'Fechar', { duration: 3000 });
    //     }
    //   });
    // }
  }
}