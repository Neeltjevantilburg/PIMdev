import { StyleService } from 'src/app/_services/style.service';
import { Component, OnInit } from '@angular/core';
import { Json } from '../shared/model/json';
import { CompanyService } from '../shared/services/company.service';
import { Observable } from 'rxjs';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ReloaderService } from '../shared/services/reloader.service';

@Component({
  selector: 'pim-portaal-layout',
  templateUrl: './portaal-layout.component.html',
  styleUrls: ['./portaal-layout.component.sass']
})
export class PortaalLayoutComponent implements OnInit {
  customBackgroundColor: Json;
  companyUrl$: Observable<any>;
  imgSource$: Observable<SafeResourceUrl>;

  constructor(
    private styleService: StyleService,
    private companyService: CompanyService,
    private reloaderService: ReloaderService
  ) {
    this.imgSource$ = this.companyService.getCompanyLogo();
    this.companyUrl$ = this.companyService.getCompanyWebsiteUrl();
  }
  
  async ngOnInit(): Promise<void> {
    await this.styleService.getAccountCustomColor();
    this.reloaderService.reload$.subscribe(
      reload => {
        this.customBackgroundColor = this.styleService.getCustomBackgroundColor();
      }
    )
  }

}