import { Component, Input, OnInit } from '@angular/core';

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
  private _indexTemplate = 0;

  @Input()
  set indexTemplate(value: number) {
    this._indexTemplate = value;
    this.selectTemplate(value);
  }

  get indexTemplate() {
    return this._indexTemplate;
  }
  @Input() template: Template | undefined
  @Input() templates: Template[] = [];

  selectedIndex = 0;
  trackTransform = '';

  private readonly ITEM_WIDTH = 400;
  private readonly ITEM_GAP = 15;

  ngOnInit(): void {
    if (this.templates.length > 0) {
      this.selectTemplate(this.indexTemplate);
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
    const itemWithGap = this.ITEM_WIDTH + this.ITEM_GAP;
    const offset = -(this.selectedIndex * itemWithGap);

    this.trackTransform = `translateX(${offset}px)`;
  }
}