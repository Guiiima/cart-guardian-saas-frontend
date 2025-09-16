import { Component } from '@angular/core';
import { Login } from '../../auth/login/login';

@Component({
  selector: 'app-login-screen',
  imports: [Login],
  templateUrl: './login-screen.html',
  styleUrl: './login-screen.scss'
})
export class LoginScreen {

}
