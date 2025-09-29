import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { LoginScreen } from './features/login-screen/login-screen';
import { HomeScreen } from './features/home-screen/home-screen';
import { Navbar } from './components/navbar/navbar';
import { Search } from './components/search/search';
import { TemplateSelector } from '@features/template-selector/template-selector';

export const routes: Routes = [
   { path: '', component: Search, title: 'Login' },
   //{ path: '', component: HomeScreen, title: 'DashBoard' },
   { path: 'HomeSreen', component: HomeScreen, title: 'DashBoard' },
   { path: 'TemplateSelector', component: TemplateSelector, title: 'DashBoard' },
];
