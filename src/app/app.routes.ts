import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { LoginScreen } from './features/login-screen/login-screen';
import { HomeScreen } from './features/home-screen/home-screen';
import { Navbar } from './components/navbar/navbar';
import { TemplateSelector } from '@features/template-selector/template-selector';
import { Search } from './components/search/search';
import { PreviewPanel } from './components/preview-panel/preview-panel';

export const routes: Routes = [
   //{ path: '', component: LoginScreen, title: 'Login' },
   { path: '', component: PreviewPanel, title: 'DashBoard' },
   { path: 'HomeSreen', component: HomeScreen, title: 'DashBoard' },
   { path: 'TemplateSelector', component: TemplateSelector, title: 'DashBoard' },
];
