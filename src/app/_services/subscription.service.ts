import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor( ) { }
  
  cleanUp(subscriptions: Subscription[] | undefined) {
    if (subscriptions) {
      subscriptions.forEach(sub => sub.unsubscribe());
    }
  }

}
