import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigateService {

  constructor(
    private router: Router
   ) { }

  to(location?: string) {
    this.router.navigate([`${location}`]);
  }

}
