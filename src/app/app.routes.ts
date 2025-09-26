import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { LoginScreen } from './features/login-screen/login-screen';
import { HomeScreen } from './features/home-screen/home-screen';
import { Navbar } from './components/navbar/navbar';
import { TemplateSelector } from './components/template-selector/template-selector';

export const routes: Routes = [
   //{ path: '', component: LoginScreen, title: 'Login' },
   { path: '', component: HomeScreen, title: 'DashBoard' },
   { path: 'TemplateSelector', component: TemplateSelector, title: 'DashBoard' },
];
