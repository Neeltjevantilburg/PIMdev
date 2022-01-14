import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class TokenService {
  decoded?: any;

  constructor( ) { }

  decodeToken() {
    if (localStorage.getItem('connection')) {
      let token = localStorage.getItem('connection')!;
      this.decoded = jwt_decode(token);
      return true;
    }

    return false;
  }

  getAccount() {
    if (this.decodeToken()) {
      return this.decoded.Account;
    }
  }
  
  getContact() {
    if (this.decodeToken()) {
      return this.decoded.Contact;
    }
  }

  getUser() {
    if (this.decodeToken()) {
      return this.decoded.PortalUserName;
    }
  }
  
  getRTI() {
    if (this.decodeToken()) {
      return this.decoded.Recordtype;
    }
  }

  getExp() {
    if (this.decodeToken()) {
      return this.decoded.exp;
    }
  }

}
