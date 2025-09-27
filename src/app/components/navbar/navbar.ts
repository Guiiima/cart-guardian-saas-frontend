import { Component } from '@angular/core';
import { NotificationSettings } from '../notification-settings/notification-settings';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  isExpanded: boolean = false;
  constructor(
    private dialog: MatDialog
  ){}
  openConfig(): void {
    this.dialog.open(NotificationSettings, {
      width: '900px',
    });
  }
}
