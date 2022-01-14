import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  check = true

  constructor( ) { }

  authorized(level: number = 99) {
    let auth: boolean = false;

    switch (level) {
      case 1:
        if (this.check) {
          auth = true;
        }
        break;
    }
    
    return auth;
  }
}
