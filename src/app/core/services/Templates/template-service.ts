import { Injectable } from '@angular/core';
import { EmailTemplate } from '@features/template-selector/template-selector';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  private templates: EmailTemplate[] = [
    { id: 'd-8fbd711045fb4f63ab851beda397f2c3', name: 'O Minimalista e Pessoal', description: 'Template com design limpo e personalizado, ideal para comunicação direta e pessoal.', thumbnailUrl: 'template-1.png' },
    { id: 'd-d064c3f93a3847a7949b5c382e0f6c09', name: 'A Prova Social', description: 'Mostra depoimentos, avaliações ou conquistas para gerar confiança.', thumbnailUrl: 'template-2.png' },
    { id: 'd-b01afe6458f143a894f36e485d3c16a8', name: 'O Senso de Urgência', description: 'Cria um efeito de urgência ou escassez para motivar ações rápidas.', thumbnailUrl: 'template-3.png' },
    { id: 'd-8e33b8af92094ee09b1650230d1de356', name: 'O Visualmente Atraente', description: 'Design chamativo e moderno para atrair a atenção do usuário.', thumbnailUrl: 'template-4.png' },
    { id: 'd-ea42b9db9c36458a9bee1a53bb656925', name: 'O Prestativo (Tire suas dúvidas)', description: 'Focado em ajudar o usuário com suporte, FAQs ou instruções.', thumbnailUrl: 'template-5.png' },
    { id: 'd-9fa7cf886d1f4d31891c4295c1e2289d', name: 'O Divertido e Gamificado', description: 'Inclui elementos lúdicos ou gamificação para engajamento.', thumbnailUrl: 'template-6.png' },
    { id: 'd-ccc67f919a6f4ef28589ed067b9eb53c', name: 'O Benefício em Foco', description: 'Destaca vantagens ou benefícios do produto/serviço.', thumbnailUrl: 'template-7.png' },
    { id: 'd-23f352c8d3d441aa83b8122570f9fd38', name: 'O Dark Mode', description: 'Design moderno em modo escuro, ideal para usuários que preferem dark theme.', thumbnailUrl: 'template-8.png' }
  ];

  constructor() { }

  getTemplates(): EmailTemplate[] {
    return [...this.templates]; // retorna cópia para não alterar o original
  }
}
