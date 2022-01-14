import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Contact } from 'src/app/shared/model/contact';
import { Json } from 'src/app/shared/model/json';
import { ReloaderService } from 'src/app/shared/services/reloader.service';
import { ProfileService } from 'src/app/_services/profile.service';
import { StyleService } from 'src/app/_services/style.service';

@Component({
  selector: 'pim-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.sass']
})
export class ProfileViewComponent implements OnInit, OnDestroy {
  @Input()
  contact$: Observable<Contact>;
  imgSource$: Observable<SafeResourceUrl>
  customColor: Json;
  reloaderSubscription: Subscription;

  constructor(
    private profileService: ProfileService,
    private activatedRoute: ActivatedRoute,
    private styleService: StyleService,
    private reloaderService: ReloaderService
  ) { 
    this.customColor = this.styleService.getTextColor();
  }

  ngOnInit(): void {
    this.reloaderSubscription = this.reloaderService.reloadProfilePicture$.subscribe(data => {
      this.imgSource$ = this.profileService.getProfilePicture(this.activatedRoute.snapshot.params.id);
    });
  }

  ngOnDestroy(): void {
    this.reloaderSubscription.unsubscribe();
  }

  editProfilePicture() {
    this.profileService.changeProfilePicture();
  }

}
