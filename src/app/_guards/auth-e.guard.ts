import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavigateService } from '../_services/navigate.service';
import { TokenService } from '../_services/token.service';


@Injectable({
  providedIn: 'root'
})
export class AuthEGuard implements CanActivate {

  constructor(
    private token: TokenService,
    private navigate: NavigateService
  ) {}

  canActivate(): boolean {    
    if (!localStorage.getItem('connection')) {
      this.navigate.to('/login');
      return false;
    }
    else if (localStorage.getItem('connection')) {
      let dateNow = Date.now();
      let timestampNow = Math.floor(dateNow/1000);
      let tokenDateExp = this.token.getExp();
      
      if (tokenDateExp < timestampNow) {
        this.navigate.to('/login');
        return false;
      }
    }
    return true;
  }
    
}