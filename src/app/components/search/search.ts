import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, output, ViewChild } from '@angular/core';
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
  @Output() inputValue = new EventEmitter<String>();

  searchText: string = '';
  isSearchActive: boolean = false;
  onInput(value?: Event) {
    if(value === undefined) return;
    const input = value.target as HTMLInputElement;
    this.inputValue.emit(input.value);
  }
  toggleSearch(): void {
    this.isSearchActive = !this.isSearchActive;

    if (this.isSearchActive) {
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      }, 300);
    }
  }

}
