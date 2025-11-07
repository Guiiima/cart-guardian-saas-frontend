import { Injectable } from '@angular/core';
import { EmailTemplate } from '@features/template-selector/template-selector';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

private templates: EmailTemplate[] = [
    {
      id: 'd-d8bb8b83fc794478b27423c4d62e3b03', // ID do "Template 1"
      name: 'O Minimalista e Pessoal',
      description: 'Um design limpo e focado, que se assemelha a um bilhete pessoal. Ótimo para comunicação direta e conversão.',
      thumbnailUrl: 'template-1.png',
      icon: 'https://i.pinimg.com/1200x/2d/f9/59/2df959c7b724f1ec4a48cdc48d72417c.jpg'
    },
    {
      id: 'd-f79df919d4f64d1dadfe29df8029d398', // ID do "Template 3" (Verde)
      name: 'Verde Natural / Orgânico',
      description: 'Um template com tons de verde e um layout limpo, perfeito para marcas de produtos naturais, orgânicos ou com apelo ecológico.',
      thumbnailUrl: 'template-2.png',
      icon: 'https://i.pinimg.com/736x/c9/6d/e1/c96de188bee2ed5d9b1f5c800527b4fd.jpg'
    },
    {
      id: 'd-3973f4fb4fb942f9ac93cc30c211e08e', // ID do "Template 2" (Rosa)
      name: 'Preto e Rosa Premium',
      description: 'Design dark-mode elegante com destaques em rosa neon. Ideal para marcas premium, tech ou de moda que buscam um visual moderno.',
      thumbnailUrl: 'template-3.png',
      icon: 'https://i.pinimg.com/1200x/9a/9e/c7/9a9ec729ebadc870224da64c131a269b.jpg'
    },
    {
      id: 'd-84308244de004816be988f8e6d4193f4', // ID do "Template 4"
      name: 'Neon Futurista',
      description: 'Um template vibrante com cores neon sobre um fundo escuro, criando um visual futurista e chamativo. Perfeito para tech, games ou eventos.',
      thumbnailUrl: 'template-4.png',
      icon: 'https://i.pinimg.com/736x/f3/6d/75/f36d75cf8211c8e2b25c2776fb6c8cc2.jpg'
    },
    {
      id: 'd-c1db4567648d4f0b95eb002c7a4a4fe1', // ID do "Template 5"
      name: 'Verão Tropical / Colorido',
      description: 'Template vibrante e colorido com um tema tropical. Excelente para promoções de verão, agências de viagens ou marcas de moda praia.',
      thumbnailUrl: 'template-5.png',
      icon: 'https://i.pinimg.com/736x/ae/ee/04/aeee04e1229606df6092465ddfa0d0e9.jpg'
    },
    {
      id: 'd-e2eec0fd7a3242a4902846b212e5ddbb', // ID do "Template 6"
      name: 'Modelo "Moderno Dark"',
      description: 'Um design sofisticado em "dark mode" com alto contraste. Passa uma sensação de modernidade e foco, ideal para SaaS e tecnologia.',
      thumbnailUrl: 'template-6.png',
      icon: 'https://i.pinimg.com/1200x/e4/0f/91/e40f91c27b06b6ba86e23c412e7d1347.jpg'
    },
    {
      id: 'd-20eeb275608647e0bea3f683a7a2464f', // ID do "Template 7"
      name: 'Modelo "Luxury Gold"',
      description: 'Design premium com detalhes em dourado e tipografia elegante. Perfeito para marcas de luxo, joalherias ou convites exclusivos.',
      thumbnailUrl: 'template-7.png',
      icon: 'https://i.pinimg.com/1200x/f4/b3/2e/f4b32e1eacdfa6cc38a1e35a0572e65b.jpg'
    },
    {
      id: 'd-c9b7b92e71ed40879e0df77c666fed95', // ID do "Template 8"
      name: 'Modelo "Urgência com Timer"',
      description: 'Template focado em conversão com cores de urgência (laranja/vermelho) e um (GIF) de timer para criar escassez e impulsionar a ação.',
      thumbnailUrl: 'template-8.png',
      icon: 'https://i.pinimg.com/736x/64/7d/ca/647dca3789950a2a7117398d0920d10b.jpg'
    },
    {
      id: 'd-318e84b7eb304cf1a2aabe150b3a756d', // ID do "Template 9"
      name: 'Modelo Minimalista',
      description: 'Layout super limpo com foco na tipografia e no espaço em branco. Um design "clean" que passa clareza e elegância.',
      thumbnailUrl: 'template-9.png',
      icon: 'https://i.pinimg.com/736x/64/7d/ca/647dca3789950a2a7117398d0920d10b.jpg'
    },
    {
      id: 'd-25ccc66caab54332821c93f29b655fc4', // ID do "Template 10"
      name: 'Modelo "Divertido & Vibrante"',
      description: 'Usa cores vibrantes (roxo, verde-limão) e fontes arredondadas para um tom de voz jovem e casual. Ótimo para marcas de games ou streetwear.',
      thumbnailUrl: 'template-10.png',
      icon: 'https://i.pinimg.com/736x/64/7d/ca/647dca3789950a2a7117398d0920d10b.jpg'
    }
  ];

  constructor() { }

  getTemplates(): EmailTemplate[] {
    return [...this.templates];
  }
}
