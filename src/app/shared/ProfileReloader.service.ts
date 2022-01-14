import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileReloaderService {

  private reload = new BehaviorSubject<boolean>(false);
  reload$ = this.reload.asObservable();

  constructor() { }

  reloadProfileData(){
    this.reload.next(true);
  }
}
