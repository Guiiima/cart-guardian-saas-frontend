import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core'; // Adicione Inject, PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // Adicione isPlatformBrowser
import { Router, RouterOutlet } from '@angular/router';
import createApp from '@shopify/app-bridge';
import { HttpClient } from '@angular/common/http';
import { animate, group, query, state, style, transition, trigger } from '@angular/animations';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss',

})
export class App {
  protected title = 'guardin-saas-frontend';

  mensagemErro: string = '';
  exibirNavbar: boolean = false;
  navbarFechada: boolean = true;
  isLoginPage = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isLoginPage = this.router.url === '/login'; 
    });
  }
  toggleNavbar() {
    this.navbarFechada = !this.navbarFechada;
  }
   ngOnInit(): void {
  }
}
