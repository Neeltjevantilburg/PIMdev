import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloaderService {

  private reload = new BehaviorSubject<boolean>(false);
  reload$ = this.reload.asObservable();
  
  private reloadProfilePicture = new BehaviorSubject<boolean>(false);
  reloadProfilePicture$ = this.reloadProfilePicture.asObservable();

  private reloadLogo = new BehaviorSubject<boolean>(false);
  reloadLogo$ = this.reloadLogo.asObservable();

  constructor() { }

  reloadData(){
    this.reload.next(true);
  }

  reloadProfileImg(){
    this.reloadProfilePicture.next(true);
  }

  reloadLogoImg(){
    this.reloadLogo.next(true);
  }
}
