import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-boasvindas',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './boasvindas.html',
  styleUrls: ['./boasvindas.scss']
})
export class Boasvindas implements OnInit {

  isNavigating = false;

  // Mensagem fixa
  welcomeText = 'Bem-vindo';
  welcomeTextArray: string[] = [];

  // Mensagem aleatória
  randomMessage = '';
  randomMessageArray: string[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Configura mensagem fixa
    this.welcomeTextArray = Array.from(this.welcomeText);

    // Lista de mensagens aleatórias
    const messages = [
      'Vamos recuperar suas vendas.',
      'Transformando cliques em clientes.',
      'Analisando oportunidades.',
      'Hora de converter.',
      'Carregando insights.',
      'Onde carrinhos viram compras.'
    ];

    // Escolhe uma mensagem aleatória
    const randomIndex = Math.floor(Math.random() * messages.length);
    this.randomMessage = messages[randomIndex];
    this.randomMessageArray = Array.from(this.randomMessage);
  }

  // Ativa animação de zoom e navega
  navigateToGraph(): void {
    this.isNavigating = true;

    setTimeout(() => {
      this.router.navigate(['/HomeSreen']);
    }, 700);
  }
}
