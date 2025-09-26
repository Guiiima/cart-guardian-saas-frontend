import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';


@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './setting.html',
  styleUrls: ['./setting.scss']
})
export class Setting implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}