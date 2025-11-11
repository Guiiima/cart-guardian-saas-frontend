import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { NotificationSettings } from '@features/notification-settings/notification-settings';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  isExpanded: boolean = false;
  public isShopifyContext: boolean = false;

  constructor(
    private dialog: MatDialog
  ) {
    this.isShopifyContext = window.self !== window.top;
  }
  openConfig(): void {
    this.dialog.open(NotificationSettings, {
      width: '900px',
    });
  }
}
