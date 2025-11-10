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
        this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            const url = event.url.split('?')[0]; 

            this.showNavbar = !(
              url === '/' ||
              url === '/login' ||
              url === '/register' ||
              url === '/forgot-password' ||
              url === '/reset-password'
            );
          }
        });

      });
  }
  toggleNavbar() {
    this.navbarFechada = !this.navbarFechada;
  }
  ngOnInit(): void {
  }
}
