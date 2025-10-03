import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { HomeScreen } from './features/home-screen/home-screen';
import { Navbar } from './components/navbar/navbar';
import { TemplateSelector } from '@features/template-selector/template-selector';
import { Search } from './components/search/search';
import { PreviewPanel } from './components/preview-panel/preview-panel';
import { NotificationSettings } from '@features/notification-settings/notification-settings';

export const routes: Routes = [
   { path: '', component: PreviewPanel, title: 'DashBoard' },
   { path: 'HomeSreen', component: HomeScreen, title: 'DashBoard' },
   { path: 'TemplateSelector', component: TemplateSelector, title: 'DashBoard' },
   { path: 'NotificationSettings', component: NotificationSettings, title: 'NotificationSettings' },
];
