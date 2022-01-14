import { Component, OnDestroy, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import { Json } from 'src/app/shared/model/json';
import { ReloaderService } from 'src/app/shared/services/reloader.service';
import { ProfileService } from 'src/app/_services/profile.service';
import { StyleService } from 'src/app/_services/style.service';

@Component({
  selector: 'pim-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.sass']
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  customColor: Json;
  imgSource$: Observable<SafeResourceUrl>;
  userData$: Observable<any>;
  userAge$: Observable<number>;
  currentProfilePictureId$: Observable<string>;
  reloaderSubscription: Subscription;

  constructor(
    private profileService: ProfileService,
    private styleService: StyleService,
    private reloaderService: ReloaderService
  ) { 
    this.customColor = this.styleService.getTextColor();
  }

  ngOnInit(): void {
    this.userData$ = this.profileService.getUserData();
    this.userAge$ = this.profileService.getUserAge();
    this.reloaderSubscription = this.reloaderService.reloadProfilePicture$.subscribe(data => {
      this.imgSource$ = this.profileService.getProfilePicture();
    });
  }

  ngOnDestroy(): void {
    this.reloaderSubscription.unsubscribe();
  }

  editProfilePicture() {
    this.profileService.changeProfilePicture();
  }

  resetPassword() {
    this.profileService.resetPassword();
  }

}
