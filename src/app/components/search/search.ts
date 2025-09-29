import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.html',
  styleUrls: ['./search.scss']
})
export class Search {
// ViewChild para pegar a referência do elemento <input> no HTML
  @ViewChild('searchInput') searchInput!: ElementRef;

  searchText: string = '';
  isSearchActive: boolean = false;

  toggleSearch(): void {
    this.isSearchActive = !this.isSearchActive;

    // Se a busca foi ativada, foca no input
    if (this.isSearchActive) {
      // Usamos um pequeno timeout para garantir que o input esteja visível antes de focar
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      }, 300); // O tempo deve ser um pouco menor que a transição do CSS
    }
  }

}
