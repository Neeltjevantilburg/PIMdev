import { Component, Input, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Json } from 'src/app/shared/model/json';
import { ReloaderService } from 'src/app/shared/services/reloader.service';
import { ApiService } from 'src/app/_services/api.service';
import { ProfileService } from 'src/app/_services/profile.service';

@Component({
  selector: 'pim-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.sass']
})
export class HeaderMenuComponent implements OnInit {
  @Input()
    customBackgroundColor: Json;
  imgSource$: Observable<SafeResourceUrl>
  
  constructor(
    private apiService: ApiService,
    private profileService: ProfileService,
    private reloaderService: ReloaderService
  ) { }

  ngOnInit(): void {
    this.reloaderService.reloadProfilePicture$.subscribe(data => {
      this.imgSource$ = this.profileService.getProfilePicture();
    });
  }

  logOut() {
    this.apiService.logout();
  }

}
