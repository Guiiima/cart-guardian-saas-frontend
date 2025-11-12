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
  welcomeText = 'Bem-vindo';
  welcomeTextArray: string[] = [];
  randomMessage = '';
  randomMessageArray: string[] = [];

  private welcomeScreenTime = 3000; 
  private fadeOutTime = 700; 

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.welcomeTextArray = Array.from(this.welcomeText);

    const messages = [
      'Vamos recuperar suas vendas.',
      'Transformando cliques em clientes.',
      'Analisando oportunidades.',
      'Hora de converter.',
      'Carregando insights.',
      'Onde carrinhos viram compras.'
    ];

    const randomIndex = Math.floor(Math.random() * messages.length);
    this.randomMessage = messages[randomIndex];
    this.randomMessageArray = Array.from(this.randomMessage);

    setTimeout(() => {
      this.navigateToGraph();
    }, this.welcomeScreenTime);
  }

  navigateToGraph(): void {
    this.isNavigating = true;
    setTimeout(() => {
      this.router.navigate(['/DashBoard']);
    }, this.fadeOutTime); 
  }
}