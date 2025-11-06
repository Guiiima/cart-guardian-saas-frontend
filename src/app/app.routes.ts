import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { HomeScreen } from './features/home-screen/home-screen';
import { Navbar } from './components/navbar/navbar';
import { TemplateSelector } from '@features/template-selector/template-selector';
import { Search } from './components/search/search';
import { PreviewPanel } from './components/preview-panel/preview-panel';
import { NotificationSettings } from '@features/notification-settings/notification-settings';
import { Boasvindas } from './components/boasvindas/boasvindas';
import { ConnectWoocommerce } from '@features/connect-woocommerce/connect-woocommerce';
import { RegisterComponent } from 'app/components/register/register';
import { authGuard } from '@core/guards/auth-guard';
import { Authscreen } from '@features/authscreen/authscreen';
import { ResetPassword } from '@features/reset-password/reset-password';
import { ForgotPassword } from '@features/forgot-password/forgot-password';


export const routes: Routes = [
   { path: '', component: Authscreen, title: 'Login' },
   { path: 'login', component: Login, title: 'Login' },
   { path: 'register', component: RegisterComponent, title: 'Register' },
   { path: 'forgot-password', component: ForgotPassword, title: 'Esqueci a Senha' },
   { path: 'reset-password', component: ResetPassword, title: 'Redefinir Senha' },
   {
      path: 'HomeSreen',
      component: HomeScreen,
      title: 'DashBoard',
   },
   {
      path: 'TemplateSelector',
      component: TemplateSelector,
      title: 'DashBoard',
      //canActivate: [authGuard] 
   },
   {
      path: 'NotificationSettings',
      component: NotificationSettings,
      title: 'NotificationSettings',
      //canActivate: [authGuard] 
   },
   {
      path: 'ConnectWoocommerce',
      component: ConnectWoocommerce,
      title: 'Connect WooCommerce',
      //canActivate: [authGuard] 
   },

   { path: '**', redirectTo: '/Boasvindas' }
];