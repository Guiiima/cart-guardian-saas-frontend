import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { Setting } from '../setting/setting';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
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
