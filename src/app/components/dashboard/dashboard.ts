import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Setting } from '../setting/setting';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  @Output()
  congiguracao = new EventEmitter<boolean>();
  isDropdownOpen = false;
  constructor(private elementRef: ElementRef, private dialog: MatDialog) { }
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  openConfig(): void {
    // this.congiguracao.emit(true);
    // this.isDropdownOpen = false;
    this.dialog.open(Setting, {
      width: '400px',
      data: { mensagem: 'Olá do pai!' }
    });
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target) && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }

}
