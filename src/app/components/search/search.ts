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
  @ViewChild('searchInput') searchInput!: ElementRef;

  searchText: string = '';
  isSearchActive: boolean = false;

  toggleSearch(): void {
    this.isSearchActive = !this.isSearchActive;

    if (this.isSearchActive) {
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      }, 300);
    }
  }

}
