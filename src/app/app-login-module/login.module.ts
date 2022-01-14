import { NgModule } from '@angular/core';
// imports:
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../app-shared-module/shared.module';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { AanmeldenComponent } from './login-pages/aanmelden/aanmelden.component';
import { LoginComponent } from './login-pages/login/login.component';
import { WachtwoordActiverenComponent } from './login-pages/wachtwoord-activeren/wachtwoord-activeren.component';
import { WachtwoordVergetenComponent } from './login-pages/wachtwoord-vergeten/wachtwoord-vergeten.component';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    AanmeldenComponent,
    LoginComponent,
    WachtwoordActiverenComponent,
    WachtwoordVergetenComponent
  ],
  imports: [
    SharedModule,
    FormsModule,
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatPasswordStrengthModule.forRoot()
  ]
})
export class LoginModule { }

