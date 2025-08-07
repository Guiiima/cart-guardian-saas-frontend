import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { LoginScreen } from './features/login-screen/login-screen';

export const routes: Routes = [
   { path: '', component: LoginScreen, title: 'Login' },
];
