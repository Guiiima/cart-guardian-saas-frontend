import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { LoginScreen } from './features/login-screen/login-screen';
import { Setting } from './features/setting/setting';

export const routes: Routes = [
   { path: '', component: Setting, title: 'Login' },
];
