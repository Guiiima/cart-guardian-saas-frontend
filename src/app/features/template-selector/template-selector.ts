import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Search } from "app/components/search/search";
import { MatIconModule } from '@angular/material/icon';

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
}

@Component({
  selector: 'app-template-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, Search, MatIconModule],
  templateUrl: './template-selector.html',
  styleUrls: ['./template-selector.scss']
})
export class TemplateSelector implements OnInit {

  @Output() templateSelected = new EventEmitter<EmailTemplate>();

  allTemplates: EmailTemplate[] = [];
  filteredTemplates: EmailTemplate[] = [];
  selectedTemplateId: string | null = null;
  searchTerm: string = '';

  constructor() { }

  ngOnInit(): void {
    this.loadMockTemplates();
    this.filteredTemplates = this.allTemplates;
  }

  loadMockTemplates(): void {
    this.allTemplates = [
      {
        id: 'd-12345abcde',
        name: 'Boas-vindas ao Novo Usuário',
        description: 'Template para enviar aos usuários logo após o cadastro no sistema. Inclui um call-to-action para completar o perfil.',
        thumbnailUrl: 'https://i.pinimg.com/1200x/fb/11/ab/fb11ab467790861dea01e73c62f8bc46.jpg'
      },
      {
        id: 'd-67890fghij',
        name: 'Redefinição de Senha',
        description: 'E-mail transacional para permitir que os usuários redefinam suas senhas com segurança.',
        thumbnailUrl: 'https://i.pinimg.com/1200x/ac/4d/93/ac4d938a6b3f44bce75b38b15c06f367.jpg'
      },
      {
        id: 'd-54321klmno',
        name: 'Newsletter Semanal',
        description: 'Engaje seus usuários com as últimas notícias e atualizações do seu produto ou serviço. Ideal para marketing.',
        thumbnailUrl: 'https://i.pinimg.com/1200x/81/81/3e/81813e128aaa4746d1aa9174b7d95acb.jpg'
      },
      {
        id: 'd-09876pqrst',
        name: 'Confirmação de Compra',
        description: 'Envie um resumo detalhado do pedido para o cliente após a finalização de uma compra na sua plataforma.',
        thumbnailUrl: 'https://i.pinimg.com/736x/f0/33/46/f0334698845d942200e84287df41f21b.jpg'
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

  selectTemplate(template: EmailTemplate): void {
    this.selectedTemplateId = template.id;
    console.log('Template Selecionado:', template);
    this.templateSelected.emit(template);
  }

  previewTemplate(template: EmailTemplate): void {
    alert(`Pré-visualizando o template: ${template.name}`);
    console.log('Pré-visualizando:', template);
  }

  isSelected(template: EmailTemplate): boolean {
    return this.selectedTemplateId === template.id;
  }

  displayedTemplates: EmailTemplate[] = [];
  selectedTemplate: EmailTemplate | null = null;
  currentView: 'grid' | 'list' = 'grid';

  // --- Lógica de Paginação ---
  private batchSize = 8; // Quantos carregar por vez
  private currentlyDisplayedCount = 0;

  // --- Lógica de Busca ---
  private currentSearchTerm = '';
  clearFilters(): void {
    this.currentSearchTerm = '';
    // Se você tivesse outros filtros (categorias, etc.), limpe-os aqui também.
    // Dispare um evento no seu app-search para limpar o input.
    this.applyFiltersAndShowInitialBatch();
  }

  applyFiltersAndShowInitialBatch(): void {
    // 1. Filtra a lista completa de templates
    const filtered = this.allTemplates.filter(template =>
      template.name.toLowerCase().includes(this.currentSearchTerm) ||
      template.description.toLowerCase().includes(this.currentSearchTerm)
    );

    // 2. Reseta a paginação e exibe o primeiro lote dos resultados filtrados
    this.currentlyDisplayedCount = 0;
    this.displayedTemplates = [];
    this.loadMore(filtered); // Passa a lista já filtrada
  }

  loadMore(sourceList?: EmailTemplate[]): void {
    const source = sourceList || this.allTemplates.filter(t => t.name.toLowerCase().includes(this.currentSearchTerm));

    const nextBatch = source.slice(
      this.currentlyDisplayedCount,
      this.currentlyDisplayedCount + this.batchSize
    );
    this.displayedTemplates.push(...nextBatch);
    this.currentlyDisplayedCount += this.batchSize;
  }

  hasMoreTemplatesToShow(): boolean {
    const sourceCount = this.allTemplates.filter(t => t.name.toLowerCase().includes(this.currentSearchTerm)).length;
    return this.displayedTemplates.length < sourceCount;
  }
  setView(view: 'grid' | 'list'): void {
    this.currentView = view;
  }
}

