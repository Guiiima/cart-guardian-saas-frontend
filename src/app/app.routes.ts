import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { LoginScreen } from './features/login-screen/login-screen';
import { Setting } from './components/setting/setting';
import { HomeScreen } from './features/home-screen/home-screen';

export const routes: Routes = [
   { path: '', component: HomeScreen, title: 'Login' },
];
