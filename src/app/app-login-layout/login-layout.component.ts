import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'pim-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.sass']
})
export class LoginLayoutComponent implements OnInit, OnDestroy {
  login: boolean
  imgSource = "/assets/images/PIM.png";
  sub: Subscription

  constructor(
    private router: Router
  ) {
    this.sub = this.router.events.subscribe((event:Event) => {
      if(event instanceof NavigationEnd ){
        if (event.url.includes('login')) {
          this.login = true;
        } else {
          this.login = false;
        }          
      }
    });
  }
  
  ngOnInit(): void {

  }
  
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
