import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core'; // Adicione Inject, PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // Adicione isPlatformBrowser
import { RouterOutlet } from '@angular/router';
import createApp from '@shopify/app-bridge';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'guardin-saas-frontend';

  constructor() { }
}