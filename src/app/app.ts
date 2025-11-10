import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core'; // Adicione Inject, PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // Adicione isPlatformBrowser
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import createApp from '@shopify/app-bridge';
import { HttpClient } from '@angular/common/http';
import { animate, group, query, state, style, transition, trigger } from '@angular/animations';
import { Navbar } from './components/navbar/navbar';
import { filter } from 'rxjs';

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
  showNavbar = true;

constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        
        // Pega a URL e remove qualquer coisa depois do '?'
        const path = event.url.split('?')[0]; 

        const hiddenRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
        
        // Agora a verificação vai funcionar
        this.showNavbar = !hiddenRoutes.includes(path); 

      });
  }
  toggleNavbar() {
    this.navbarFechada = !this.navbarFechada;
  }
  ngOnInit(): void {
  }
}
