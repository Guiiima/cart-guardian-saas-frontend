import { Component, Input, OnInit } from '@angular/core';

interface EmailTemplate {
  name: string;
  thumbnailUrl: string;
}

interface Template {
  name: string;
  thumbnailUrl: string;
}

@Component({
  selector: 'app-preview-panel',
  standalone: true,
  imports: [],
  templateUrl: './preview-panel.html',
  styleUrl: './preview-panel.scss'
})
export class PreviewPanel implements OnInit {

  @Input() template: EmailTemplate | null = null;
  templates: Template[] = [
    {
      name: 'Template 1',
      thumbnailUrl: 'https://i.pinimg.com/1200x/fb/11/ab/fb11ab467790861dea01e73c62f8bc46.jpg'
    },
    {
      name: 'Template 2',
      thumbnailUrl: 'https://i.pinimg.com/1200x/ac/4d/93/ac4d938a6b3f44bce75b38b15c06f367.jpg'
    },
    {
      name: 'Template 3',
      thumbnailUrl: 'https://i.pinimg.com/1200x/81/81/3e/81813e128aaa4746d1aa9174b7d95acb.jpg'
    },
    {
      name: 'Template 4',
      thumbnailUrl: 'https://i.pinimg.com/736x/f0/33/46/f0334698845d942200e84287df41f21b.jpg'
    }
  ];

  selectedIndex = 0;
  trackTransform = '';

  private readonly ITEM_WIDTH = 400;
  private readonly ITEM_GAP = 15;
  
  ngOnInit(): void {
    if (this.templates.length > 0) {
      this.selectTemplate(0);
    }
  }

  selectTemplate(index: number): void {
    if (index < 0 || index >= this.templates.length) {
      return;
    }
    this.selectedIndex = index;
    this.updateTrackPosition();
  }

  nextTemplate(): void {
    const nextIndex = (this.selectedIndex + 1) % this.templates.length;
    this.selectTemplate(nextIndex);
  }

  prevTemplate(): void {
    const prevIndex = (this.selectedIndex - 1 + this.templates.length) % this.templates.length;
    this.selectTemplate(prevIndex);
  }

  private updateTrackPosition(): void {
    
    const activeItemVisualWidth = this.ITEM_WIDTH * 1.05;

    const viewportWidth = 600;

    const centeringOffset = (viewportWidth - activeItemVisualWidth) / 2;

    const itemWithGap = this.ITEM_WIDTH + this.ITEM_GAP;
    
    const offset = centeringOffset - (this.selectedIndex * itemWithGap);
    
    this.trackTransform = `translateX(${offset}px)`;
  }
}
