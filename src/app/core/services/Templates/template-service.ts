import { Injectable } from '@angular/core';
import { EmailTemplate } from '@features/template-selector/template-selector';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  private templates: EmailTemplate[] = [
    {
      id: 'd-8fbd711045fb4f63ab851beda397f2c3',
      name: 'O Minimalista e Pessoal',
      description: 'Template com design limpo e personalizado, ideal para comunicação direta e pessoal.',
      thumbnailUrl: 'template-1.png',
      icon: 'https://i.pinimg.com/1200x/2d/f9/59/2df959c7b724f1ec4a48cdc48d72417c.jpg'
    },
    {
      id: 'd-d064c3f93a3847a7949b5c382e0f6c09',
      name: 'A Prova Social',
      description: 'Mostra depoimentos, avaliações ou conquistas para gerar confiança.',
      thumbnailUrl: 'template-2.png',
      icon: 'https://i.pinimg.com/736x/c9/6d/e1/c96de188bee2ed5d9b1f5c800527b4fd.jpg'
    },
    {
      id: 'd-b01afe6458f143a894f36e485d3c16a8',
      name: 'O Senso de Urgência',
      description: 'Cria um efeito de urgência ou escassez para motivar ações rápidas.',
      thumbnailUrl: 'template-3.png',
      icon: 'https://i.pinimg.com/1200x/9a/9e/c7/9a9ec729ebadc870224da64c131a269b.jpg'
    },
    {
      id: 'd-8e33b8af92094ee09b1650230d1de356',
      name: 'O Visualmente Atraente',
      description: 'Design chamativo e moderno para atrair a atenção do usuário.',
      thumbnailUrl: 'template-4.png',
      icon: 'https://i.pinimg.com/736x/f3/6d/75/f36d75cf8211c8e2b25c2776fb6c8cc2.jpg'
    },
    {
      id: 'd-ea42b9db9c36458a9bee1a53bb656925',
      name: 'O Prestativo (Tire suas dúvidas)',
      description: 'Focado em ajudar o usuário com suporte, FAQs ou instruções.',
      thumbnailUrl: 'template-5.png',
      icon: 'https://i.pinimg.com/736x/ae/ee/04/aeee04e1229606df6092465ddfa0d0e9.jpg'
    },
    {
      id: 'd-9fa7cf886d1f4d31891c4295c1e2289d',
      name: 'O Divertido e Gamificado',
      description: 'Inclui elementos lúdicos ou gamificação para engajamento.',
      thumbnailUrl: 'template-6.png',
      icon: 'https://i.pinimg.com/1200x/e4/0f/91/e40f91c27b06b6ba86e23c412e7d1347.jpg'
    },
    {
      id: 'd-ccc67f919a6f4ef28589ed067b9eb53c',
      name: 'O Benefício em Foco',
      description: 'Destaca vantagens ou benefícios do produto/serviço.',
      thumbnailUrl: 'template-7.png',
      icon: 'https://i.pinimg.com/1200x/f4/b3/2e/f4b32e1eacdfa6cc38a1e35a0572e65b.jpg'
    },
    {
      id: 'd-23f352c8d3d441aa83b8122570f9fd38',
      name: 'O Dark Mode',
      description: 'Design moderno em modo escuro, ideal para usuários que preferem dark theme.',
      thumbnailUrl: 'template-8.png',
      icon: 'https://i.pinimg.com/736x/64/7d/ca/647dca3789950a2a7117398d0920d10b.jpg'
    }
  ];

  constructor() { }

  getTemplates(): EmailTemplate[] {
    return [...this.templates]; 
  }
}
