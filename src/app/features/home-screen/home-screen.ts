import { Component } from '@angular/core';
import { Setting } from "../../components/setting/setting";
import { Dashboard } from "../../components/dashboard/dashboard";

@Component({
  selector: 'app-home-screen',
  imports: [Setting, Dashboard],
  templateUrl: './home-screen.html',
  styleUrl: './home-screen.scss'
})
export class HomeScreen {

}
