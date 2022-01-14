import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthEGuard } from './shared-module/guards/auth-e.guard';
import { PortaalLayoutComponent } from './portaal-layout/portaal-layout.component';
import { WelcomeLayoutComponent } from './welcome-layout/welcome-layout.component';
import { Page404Component } from './shared-module/page404/page404.component';

const routes: Routes = [
  {
    path: '',
    component: PortaalLayoutComponent,
    canActivate: [AuthEGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./portaal-module/portaal.module').then(m => m.PortaalModule)
      }
    ]
  },
  {
    path: '',
    component: WelcomeLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./welcome-module/welcome.module').then(m => m.WelcomeModule)
      }
    ]
  },
  {
    path: '**',
    component: Page404Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
