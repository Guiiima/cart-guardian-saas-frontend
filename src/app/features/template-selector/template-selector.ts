import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Search } from "app/components/search/search";
import { MatIconModule } from '@angular/material/icon';
import { PreviewPanel } from "app/components/preview-panel/preview-panel";

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
}

@Component({
  selector: 'app-template-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, Search, MatIconModule, PreviewPanel],
  templateUrl: './template-selector.html',
  styleUrls: ['./template-selector.scss']
})
export class TemplateSelector implements OnInit {
  allTemplates: EmailTemplate[] = [];
  filteredTemplates: EmailTemplate[] = [];
  displayedTemplates: EmailTemplate[] = [];
  selectedTemplate: EmailTemplate | null = null;
  selectedTemplateId: string | null = null;
  searchTerm: string = '';
  currentView: 'grid' | 'list' = 'grid';
  indexSelect: number = 0

  private batchSize = 8;
  private currentlyDisplayedCount = 0;
  private currentSearchTerm = '';

  constructor() { }

  ngOnInit(): void {
    this.loadMockTemplates();
    this.filteredTemplates = this.allTemplates;
    if (this.allTemplates.length > 0) {
      this.buscarIdTemplate()
    }
  }
  async buscarIdTemplate() {
    //Por enquanto vou colocar manual depois tenho que alterar para buscar no banco
    this.selectedTemplateId = this.allTemplates[1].id;
    this.indexSelect = this.allTemplates.findIndex( x => x.id === this.selectedTemplateId)
    this.selectedTemplate = this.allTemplates.find(x => x.id === this.selectedTemplateId) ?? null;

  }

  loadMockTemplates(): void {
    this.allTemplates = [
      {
        id: 'd-8fbd711045fb4f63ab851beda397f2c3',
        name: 'O Minimalista e Pessoal',
        description: 'Template com design limpo e personalizado, ideal para comunicação direta e pessoal.',
        thumbnailUrl: 'template-1.png'
      },
      {
        id: 'd-d064c3f93a3847a7949b5c382e0f6c09',
        name: 'A Prova Social',
        description: 'Mostra depoimentos, avaliações ou conquistas para gerar confiança.',
        thumbnailUrl: 'template-2.png'
      },
      {
        id: 'd-b01afe6458f143a894f36e485d3c16a8',
        name: 'O Senso de Urgência',
        description: 'Cria um efeito de urgência ou escassez para motivar ações rápidas.',
        thumbnailUrl: 'template-3.png'
      },
      {
        id: 'd-8e33b8af92094ee09b1650230d1de356',
        name: 'O Visualmente Atraente',
        description: 'Design chamativo e moderno para atrair a atenção do usuário.',
        thumbnailUrl: 'template-4.png'
      },
      {
        id: 'd-ea42b9db9c36458a9bee1a53bb656925',
        name: 'O Prestativo (Tire suas dúvidas)',
        description: 'Focado em ajudar o usuário com suporte, FAQs ou instruções.',
        thumbnailUrl: 'template-5.png'
      },
      {
        id: 'd-9fa7cf886d1f4d31891c4295c1e2289d',
        name: 'O Divertido e Gamificado',
        description: 'Inclui elementos lúdicos ou gamificação para engajamento.',
        thumbnailUrl: 'template-6.png'
      },
      {
        id: 'd-ccc67f919a6f4ef28589ed067b9eb53c',
        name: 'O Benefício em Foco',
        description: 'Destaca vantagens ou benefícios do produto/serviço.',
        thumbnailUrl: 'template-7.png'
      },
      {
        id: 'd-23f352c8d3d441aa83b8122570f9fd38',
        name: 'O Dark Mode',
        description: 'Design moderno em modo escuro, ideal para usuários que preferem dark theme.',
        thumbnailUrl: 'template-8.png'
      }
    ];

  }

  filterTemplates(): void {
    if (!this.searchTerm) {
      this.filteredTemplates = this.allTemplates;
      return;
    }
    const lowerCaseSearch = this.searchTerm.toLowerCase();
    this.filteredTemplates = this.allTemplates.filter(template =>
      template.name.toLowerCase().includes(lowerCaseSearch) ||
      template.description.toLowerCase().includes(lowerCaseSearch)
    );
  }

  selectTemplate(template: EmailTemplate, index: Number): void {
    this.selectedTemplateId = template.id;
    this.indexSelect = Number(index)
    console.log('Template Selecionado:', template);
  }

  previewTemplate(template: EmailTemplate): void {
    this.selectedTemplate = template;
  }

  isSelected(template: EmailTemplate): boolean {
    return this.selectedTemplateId === template.id;
  }

  clearFilters(): void {
    this.currentSearchTerm = '';
    this.applyFiltersAndShowInitialBatch();
  }

  applyFiltersAndShowInitialBatch(): void {
    const filtered = this.allTemplates.filter(template =>
      template.name.toLowerCase().includes(this.currentSearchTerm) ||
      template.description.toLowerCase().includes(this.currentSearchTerm)
    );

    this.currentlyDisplayedCount = 0;
    this.displayedTemplates = [];
    this.loadMore(filtered);
  }

  loadMore(sourceList?: EmailTemplate[]): void {
    const source = sourceList || this.allTemplates.filter(t =>
      t.name.toLowerCase().includes(this.currentSearchTerm)
    );

    const nextBatch = source.slice(
      this.currentlyDisplayedCount,
      this.currentlyDisplayedCount + this.batchSize
    );
    this.displayedTemplates.push(...nextBatch);
    this.currentlyDisplayedCount += this.batchSize;
  }

  hasMoreTemplatesToShow(): boolean {
    const sourceCount = this.allTemplates.filter(t =>
      t.name.toLowerCase().includes(this.currentSearchTerm)
    ).length;
    return this.displayedTemplates.length < sourceCount;
  }

  setView(view: 'grid' | 'list'): void {
    this.currentView = view;
  }
}
