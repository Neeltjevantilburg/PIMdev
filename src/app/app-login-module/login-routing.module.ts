import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Routes Components:
import { LoginComponent } from './login-pages/login/login.component';
import { WachtwoordVergetenComponent } from './login-pages/wachtwoord-vergeten/wachtwoord-vergeten.component';
import { WachtwoordActiverenComponent } from './login-pages/wachtwoord-activeren/wachtwoord-activeren.component';
import { AanmeldenComponent } from './login-pages/aanmelden/aanmelden.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'wachtwoord',
    children: [
      {
        path: '',
        redirectTo: 'vergeten',
        pathMatch: 'full'
      },
      {
        path: 'vergeten',
        component: WachtwoordVergetenComponent
      },
      {
        path: 'activeren',
        component: WachtwoordActiverenComponent
      }
    ]
  },
  {
    path: 'aanmelden',
    component: AanmeldenComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
