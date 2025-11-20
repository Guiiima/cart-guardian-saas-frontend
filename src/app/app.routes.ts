import { Routes } from '@angular/router';
import { HomeScreen } from './features/home-screen/home-screen';
import { TemplateSelector } from '@features/template-selector/template-selector';
import { NotificationSettings } from '@features/notification-settings/notification-settings';
import { Boasvindas } from './components/boasvindas/boasvindas';
import { ConnectWoocommerce } from '@features/connect-woocommerce/connect-woocommerce';
import { authGuard } from '@core/guards/auth-guard';
import { Authscreen } from '@features/authscreen/authscreen';
import { ResetPassword } from '@features/reset-password/reset-password';
import { ForgotPassword } from '@features/forgot-password/forgot-password';
import { HelpscremComponent } from '@features/helpscrem/helpscrem';

const isInsideIframe = window.self !== window.top;

const wildcardRedirect = isInsideIframe ? '/Boasvindas' : '/login';


export const routes: Routes = [
   { path: 'login', component: Authscreen, title: 'Login' },
   { path: 'register', component: Authscreen, title: 'Register' },
   { path: 'forgot-password', component: ForgotPassword, title: 'Esqueci a Senha' },
   { path: 'reset-password', component: ResetPassword, title: 'Redefinir Senha' },
   {
      path: 'Boasvindas',
      component: Authscreen,
      title: 'Boasvindas',
   },
   {
      path: 'DashBoard',
      component: HomeScreen,
      title: 'DashBoard',
      canActivate: [authGuard]
   },
   {
      path: 'TemplateSelector',
      component: TemplateSelector,
      title: 'Templates',
      canActivate: [authGuard]
   },
   {
      path: 'NotificationSettings',
      component: NotificationSettings,
      title: 'NotificationSettings',
      canActivate: [authGuard]
   },
   {
      path: 'ConnectWoocommerce',
      component: ConnectWoocommerce,
      title: 'Connect WooCommerce',
      canActivate: [authGuard]
   },
   {
      path: 'HelpScreen',
      component: HelpscremComponent,
      title: 'Help Screen',
      canActivate: [authGuard]
   },
   // Rota Wildcard
   { path: '**', redirectTo: wildcardRedirect }
];