import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Search } from "app/components/search/search";
import { PreviewPanel } from "app/components/preview-panel/preview-panel";
import { TemplateService } from '@core/services/Templates/template-service';

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
}

@Component({
  selector: 'app-template-selector',
  standalone: true,
  imports: [CommonModule, Search, PreviewPanel],
  templateUrl: './template-selector.html',
  styleUrls: ['./template-selector.scss']
})
export class TemplateSelector implements OnInit {
  allTemplates: EmailTemplate[] = [];
  filteredTemplates: EmailTemplate[] = [];
  selectedTemplate: EmailTemplate | null = null;
  selectedTemplateId: string | null = null;
  searchTerm: string = '';
  currentView: 'grid' | 'list' = 'grid';
  indexSelect: number = 0;

  constructor(private templateService: TemplateService) { }

  ngOnInit(): void {
    this.allTemplates = this.templateService.getTemplates();
    this.filteredTemplates = [...this.allTemplates];
    this.initSelection();
  }

  private initSelection(): void {
    if (this.allTemplates.length > 1) {
      this.selectedTemplateId = this.allTemplates[1].id;
      this.indexSelect = this.allTemplates.findIndex(t => t.id === this.selectedTemplateId);
      this.selectedTemplate = this.allTemplates[this.indexSelect] ?? null;
    }
  }

  buscarTemplates(): void {
    if (!this.searchTerm.trim()) {
      this.filteredTemplates = [...this.allTemplates];
      return;
    }
    const lowerSearch = this.searchTerm.toLowerCase();
    this.filteredTemplates = this.allTemplates.filter(t =>
      t.name.toLowerCase().includes(lowerSearch) ||
      t.description.toLowerCase().includes(lowerSearch)
    );
  }

  selectTemplate(template: EmailTemplate, index: number): void {
    this.selectedTemplateId = template.id;
    this.indexSelect = index;
    this.selectedTemplate = template;
    console.log('Template selecionado:', template);
  }

  previewTemplate(index: number): void {
    this.indexSelect = index;
  }

  isSelected(template: EmailTemplate): boolean {
    return this.selectedTemplateId === template.id;
  }

  setView(view: 'grid' | 'list'): void {
    this.currentView = view;
  }
}
