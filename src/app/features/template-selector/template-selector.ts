import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Search } from "app/components/search/search";
import { PreviewPanel } from "app/components/preview-panel/preview-panel";
import { TemplateService } from '@core/services/Templates/template-service';
import { ApiService } from '@core/services/ApiService';

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  icon: string;
}

@Component({
  selector: 'app-template-selector',
  standalone: true,
  imports: [CommonModule, Search, PreviewPanel],
  templateUrl: './template-selector.html',
  styleUrls: ['./template-selector.scss']
})
export class TemplateSelector implements OnInit {
  public isSaving = false;
  public isLoading = true;
  allTemplates: EmailTemplate[] = [];
  filteredTemplates: EmailTemplate[] = [];
  selectedTemplate: EmailTemplate | null = null;
  selectedTemplateId: string | null = null;
  searchTerm: string = '';
  currentView: 'grid' | 'list' = 'grid';
  thumbnailType: 'image' | 'icon' = 'image';
  indexSelect: number = 0;
  isViewTransitioning: boolean = false;
  isThumbnailTransitioning: boolean = false;

  constructor(
    private templateService: TemplateService,
    private shopifyAuthService: ApiService
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      const [_, settings] = await Promise.all([
        this.loadAllTemplates(),
        this.shopifyAuthService.getSettings()
      ]);

      const savedTemplateId = settings?.templateEmail;
      console.log('Template salvo nas configurações:', settings);
      this.initSelection(savedTemplateId);

    } catch (error) {
      console.error('Erro ao inicializar dados:', error);
      this.initSelection();
    } finally {
      this.isLoading = false;
    }
  }

  private async loadAllTemplates(): Promise<void> {
    this.allTemplates = this.templateService.getTemplates();
    this.filteredTemplates = [...this.allTemplates];
  }

  private initSelection(savedTemplateId?: string | null): void {
    if (!this.allTemplates || this.allTemplates.length === 0) {
      return;
    }

    let templateToSelect: EmailTemplate | undefined;

    if (savedTemplateId) {
      templateToSelect = this.allTemplates.find(t => t.id === savedTemplateId);
      console.log('Template encontrado para seleção:', templateToSelect);
    }

    if (!templateToSelect && this.allTemplates.length > 0) {
      templateToSelect = this.allTemplates[0];
    }

    if (templateToSelect) {
      const index = this.allTemplates.indexOf(templateToSelect);
      console.log('Índice do template selecionado:', index);
      this.selectTemplate(templateToSelect, index, false);
    }
  }

  async selectTemplate(template: EmailTemplate, index: number, shouldSave: boolean = true): Promise<void> {
    this.selectedTemplateId = template.id;
    this.indexSelect = index;
    this.selectedTemplate = template;

    if (shouldSave) {
      this.isSaving = true;
      try {
        await this.shopifyAuthService.saveSelectedTemplate(template.id);
      } catch (error) {
        console.error('Erro ao salvar o template:', error);
      } finally {
        this.isSaving = false;
      }
    }
  }

  buscarTemplates(searchTerm: String): void {
    if (!searchTerm.trim()) {
      this.filteredTemplates = [...this.allTemplates];
      return;
    }
    const lowerSearch = searchTerm.toLowerCase();
    this.filteredTemplates = this.allTemplates.filter(t =>
      t.name.toLowerCase().includes(lowerSearch) ||
      t.description.toLowerCase().includes(lowerSearch)
    );
  }

  previewTemplate(index: number): void {
    this.indexSelect = index;
  }

  isSelected(template: EmailTemplate): boolean {
    return this.selectedTemplateId === template.id;
  }

  setView(view: 'grid' | 'list'): void {
    if (this.currentView === view || this.isViewTransitioning) return;
    this.isViewTransitioning = true;
    setTimeout(() => {
      this.currentView = view;
      this.isViewTransitioning = false;
    }, 300);
  }

  setThumbnailType(type: 'image' | 'icon'): void {
    if (this.thumbnailType === type || this.isThumbnailTransitioning) return;
    this.isThumbnailTransitioning = true;
    setTimeout(() => {
      this.thumbnailType = type;
      this.isThumbnailTransitioning = false;
    }, 250);
  }
}

