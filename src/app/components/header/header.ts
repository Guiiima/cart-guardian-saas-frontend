import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Setting } from '../setting/setting';
import { NotificationSettings } from '../notification-settings/notification-settings';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements AfterViewInit, OnDestroy {
  @ViewChild('typingEffect') typingElementRef?: ElementRef<HTMLElement>;
  isDropdownOpen = false;

  private phrases = [
    "Recuperando vendas, um carrinho por vez",
    "Transformando abandono em conversão",
    "Reconectando com seus clientes indecisos",
    "Sua principal ferramenta contra o abandono"
  ];
  private phraseIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private timeoutId?: ReturnType<typeof setTimeout>;

  private readonly typingSpeed = 50;
  private readonly deletingSpeed = 50;
  private readonly delayBetweenPhrases = 4000;

  constructor(
    private elementRef: ElementRef, 
    private dialog: MatDialog
  ) { }

  ngAfterViewInit(): void {
    this.type();
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private type(): void {
    if (!this.typingElementRef) return;
    
    const currentPhrase = this.phrases[this.phraseIndex];
    const element = this.typingElementRef.nativeElement;

    if (this.isDeleting) {
      element.textContent = currentPhrase.substring(0, this.charIndex - 1);
      this.charIndex--;

      if (this.charIndex === 0) {
        this.isDeleting = false;
        this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
        this.timeoutId = setTimeout(() => this.type(), this.typingSpeed);
      } else {
        this.timeoutId = setTimeout(() => this.type(), this.deletingSpeed);
      }
    } else {
      element.textContent = currentPhrase.substring(0, this.charIndex + 1);
      this.charIndex++;

      if (this.charIndex === currentPhrase.length) {
        this.isDeleting = true;
        this.timeoutId = setTimeout(() => this.type(), this.delayBetweenPhrases);
      } else {
        this.timeoutId = setTimeout(() => this.type(), this.typingSpeed);
      }
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  openConfig(): void {
    this.dialog.open(NotificationSettings, {
      width: '900px',
    });
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target as Node);
    if (!clickedInside && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }
}
