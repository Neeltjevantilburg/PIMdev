import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  public observable!: Observable<any>;

  constructor(
    private router: Router
   ) { 
    this.observable = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => event as NavigationEnd)
    );
  }

  url(button: boolean, url?: any) {
    let pageUrl = this.router.url

    if (url) {
      pageUrl = url;
    }

    if (button) {
      pageUrl = pageUrl.slice(1);
    } else {
      pageUrl = pageUrl[1].toUpperCase() + pageUrl.slice(2);
      if (pageUrl.includes("_")) {
        let split = pageUrl.split("_");
  
        pageUrl = `${split[0]} ${split[1]}`;
      }
    }
    
    if (pageUrl.includes('/')) {
      let split = pageUrl.split("/");
  
      pageUrl = `${split[0]}`;
    }
    
    return pageUrl;
  }

  isDashboard(url?: any) {
    let pageUrl = this.router.url
    let check = {
      dashboard: false,
      verlof: false,
      declaratie: false,
      verzuim: false,
      contract: false
    }

    if (url) {
      pageUrl = url;
    }

    check.dashboard = true

    switch (pageUrl.slice(1)) {
      case 'verlof':
        check.verlof = true,
        check.declaratie = false,
        check.verzuim = false,
        check.contract = false
        break;    
      case 'declaratie':
        check.verlof = false,
        check.declaratie = true,
        check.verzuim = false,
        check.contract = false
        break;    
      case 'verzuim':
        check.verlof = false,
        check.declaratie = false,
        check.verzuim = true,
        check.contract = false
        break;    
      case 'contract':
        check.verlof = false,
        check.declaratie = false,
        check.verzuim = false,
        check.contract = true
        break;    
      default:
        check.dashboard = false
        break;
    }

    return check
  }

}

