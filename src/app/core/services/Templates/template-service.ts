import { Injectable } from '@angular/core';
import { EmailTemplate } from '@features/template-selector/template-selector';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

private templates: EmailTemplate[] = [
    {
      id: 'd-d8bb8b83fc794478b27423c4d62e3b03',
      name: 'O Minimalista e Pessoal',
      description: 'Um design limpo e focado, que se assemelha a um bilhete pessoal. Ótimo para comunicação direta e conversão.',
      thumbnailUrl: 'template-1.png',
      icon: 'https://cdn-icons-png.flaticon.com/128/3071/3071773.png' // Ícone de carta/escrita
    },
    {
      id: 'd-f79df919d4f64d1dadfe29df8029d398',
      name: 'Verde Natural / Orgânico',
      description: 'Um template com tons de verde e um layout limpo, perfeito para marcas de produtos naturais, orgânicos ou com apelo ecológico.',
      thumbnailUrl: 'template-2.png',
      icon: 'https://cdn-icons-png.flaticon.com/128/861/861054.png' // Ícone de folha
    },
    {
      id: 'd-3973f4fb4fb942f9ac93cc30c211e08e',
      name: 'Preto e Rosa Premium',
      description: 'Design dark-mode elegante com destaques em rosa neon. Ideal para marcas premium, tech ou de moda que buscam um visual moderno.',
      thumbnailUrl: 'template-3.png',
      icon: 'https://cdn-icons-png.flaticon.com/128/774/774122.png' // Ícone de neon rosa
    },
    {
      id: 'd-84308244de004816be988f8e6d4193f4',
      name: 'Neon Futurista',
      description: 'Um template vibrante com cores neon sobre um fundo escuro, criando um visual futurista e chamativo. Perfeito para tech, games ou eventos.',
      thumbnailUrl: 'template-4.png',
      icon: 'https://cdn-icons-png.flaticon.com/128/2961/2961073.png' // Ícone de grid neon
    },
    {
      id: 'd-c1db4567648d4f0b95eb002c7a4a4fe1',
      name: 'Verão Tropical / Colorido',
      description: 'Template vibrante e colorido com um tema tropical. Excelente para promoções de verão, agências de viagens ou marcas de moda praia.',
      thumbnailUrl: 'template-5.png',
      icon: 'https://cdn-icons-png.flaticon.com/128/1397/1397755.png' // Ícone de palmeira
    },
    {
      id: 'd-e2eec0fd7a3242a4902846b212e5ddbb',
      name: 'Modelo "Moderno Dark"',
      description: 'Um design sofisticado em "dark mode" com alto contraste. Passa uma sensação de modernidade e foco, ideal para SaaS e tecnologia.',
      thumbnailUrl: 'template-6.png',
      icon: 'https://cdn-icons-png.flaticon.com/128/867/867904.png' // Ícone de lua (dark mode)
    },
    {
      id: 'd-20eeb275608647e0bea3f683a7a2464f',
      name: 'Modelo "Luxury Gold"',
      description: 'Design premium com detalhes em dourado e tipografia elegante. Perfeito para marcas de luxo, joalherias ou convites exclusivos.',
      thumbnailUrl: 'template-7.png',
      icon: 'https://cdn-icons-png.flaticon.com/128/1844/1844425.png' // Ícone de mármore e ouro
    },
    {
      id: 'd-c9b7b92e71ed40879e0df77c666fed95',
      name: 'Modelo "Urgência com Timer"',
      description: 'Template focado em conversão com cores de urgência (laranja/vermelho) e um (GIF) de timer para criar escassez e impulsionar a ação.',
      thumbnailUrl: 'template-8.png',
      icon: 'https://cdn-icons-png.flaticon.com/128/3964/3964963.png' // Ícone de relógio/timer
    },
    {
      id: 'd-318e84b7eb304cf1a2aabe150b3a756d',
      name: 'Modelo Minimalista',
      description: 'Layout super limpo com foco na tipografia e no espaço em branco. Um design "clean" que passa clareza e elegância.',
      thumbnailUrl: 'template-9.png',
      icon: 'https://cdn-icons-png.flaticon.com/128/13139/13139053.png' // Ícone de arte minimalista
    },
    {
      id: 'd-25ccc66caab54332821c93f29b655fc4',
      name: 'Modelo "Divertido & Vibrante"',
      description: 'Usa cores vibrantes (roxo, verde-limão) e fontes arredondadas para um tom de voz jovem e casual. Ótimo para marcas de games ou streetwear.',
      thumbnailUrl: 'template-10.png',
      icon: 'https://cdn-icons-png.flaticon.com/128/5166/5166323.png' // Ícone de controle gamer neon
    }
  ];

  constructor() { }

  getTemplates(): EmailTemplate[] {
    return [...this.templates];
  }
}
