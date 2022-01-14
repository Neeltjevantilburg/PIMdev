import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Json } from 'src/app/shared/model/json';
import { ReloaderService } from 'src/app/shared/services/reloader.service';
import { CompanyService } from 'src/app/shared/services/company.service';
import { StyleService } from 'src/app/_services/style.service';

@Component({
  selector: 'pim-company-settings-view',
  templateUrl: './company-settings-view.component.html',
  styleUrls: ['./company-settings-view.component.sass']
})
export class CompanySettingsViewComponent implements OnInit {
  customColor: Json;
  logoSource$: Observable<SafeResourceUrl>;
  colorPalette:Array<any> = [
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#00FFFF',
    '#808080',
    '#FFC0CB',
    '#E5732B',
    '#7E5FDA'
  ]
  color = "#E5732B";
  colorBtn = true;

  @ViewChild("colorSelect") 
    colorSelect!: ElementRef<HTMLElement>;

  constructor(
    private styleService: StyleService,
    private reloaderService: ReloaderService,
    private companyService: CompanyService
  ) { }

  ngOnInit(): void {
    this.reloaderService.reload$.subscribe(
      reload => {
        this.color = localStorage.getItem('customColor')!;
        this.customColor = this.styleService.getTextColor();
      }
    )
    this.reloaderService.reloadLogo$.subscribe(
      reload => {
        this.logoSource$ = this.companyService.getCompanyLogo();
      }
    )
  }

  editLogo() {
    console.log('editLogo function');
    /*
      https://oakpim--partieel.lightning.force.com/lightning/r/Account/0015r00000H8lNOAAZ/view
      Api function not fully functional, uploads to wrong account
    */
    // this.companyService.changeLogo();
  }

  setColor() {
    this.styleService.setCustomColor(this.color);
  }

  selectColor() {
    let colorSelector: HTMLElement = this.colorSelect.nativeElement;

    colorSelector?.click();
    this.colorBtn = false;
  }

}
