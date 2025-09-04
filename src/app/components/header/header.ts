import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild, AfterViewInit, OnDestroy, Renderer2, ViewChildren, QueryList } from '@angular/core';
import { Setting } from '../setting/setting';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements AfterViewInit, OnDestroy {
  @ViewChildren('animatedElement') elementsToAnimate: QueryList<ElementRef> | undefined;

  private observer?: IntersectionObserver;

  constructor(private elementRef: ElementRef, private dialog: MatDialog) { }

  ngAfterViewInit() {
    this.type();
    if (this.elementsToAnimate) {
      this.elementsToAnimate.forEach((el: ElementRef) => this.observer?.observe(el.nativeElement));
    }
  }
  @ViewChild('typingEffect') typingElementRef: ElementRef | undefined;
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
  private timeoutId: any;

  private readonly typingSpeed = 100;
  private readonly deletingSpeed = 50;
  private readonly delayBetweenPhrases = 2000;


  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private type(): void {
    const currentPhrase = this.phrases[this.phraseIndex];
    if (!this.typingElementRef) {
      return;
    }
    const element = this.typingElementRef.nativeElement;

    if (!this.isDeleting) {
      element.textContent = currentPhrase.substring(0, this.charIndex + 1);
      this.charIndex++;

      if (this.charIndex === currentPhrase.length) {
        this.isDeleting = true;
        this.timeoutId = setTimeout(() => this.type(), this.delayBetweenPhrases);
      } else {
        this.timeoutId = setTimeout(() => this.type(), this.typingSpeed);
      }
    }
    else {
      element.textContent = currentPhrase.substring(0, this.charIndex);
      this.charIndex--;

      if (this.charIndex < 0) {
        this.charIndex = 0;
        this.isDeleting = false;
        this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
        this.timeoutId = setTimeout(() => this.type(), this.typingSpeed);
      } else {
        this.timeoutId = setTimeout(() => this.type(), this.deletingSpeed);
      }
    }
  }
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
