import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  isDropdownOpen = false;
  constructor(private elementRef: ElementRef) { }
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // 3. (Opcional, mas recomendado) Função para fechar o menu ao clicar fora dele
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Verifica se o clique foi fora do container do dropdown e se o menu está aberto
    if (!this.elementRef.nativeElement.contains(event.target) && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }

}
