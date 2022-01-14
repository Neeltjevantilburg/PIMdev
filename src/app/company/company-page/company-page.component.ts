import { Component, OnInit } from '@angular/core';
import { StyleService } from 'src/app/_services/style.service';

@Component({
  selector: 'pim-company-page',
  templateUrl: './company-page.component.html',
  styleUrls: ['./company-page.component.sass']
})
export class CompanyPageComponent implements OnInit {
  tabStyle = {
    bedrijfsgegevens : 'active',
    afdelingenEnFuncties : 'inactive',
    documenten : 'inactive',
    gebruikers : 'inactive',
    instellingen : 'inactive'
  }
  view = 'bedrijfsgegevens';
  
  constructor(
    private styleService: StyleService
  ) { }

  ngOnInit(): void { }

  switchContent(tab: string) {
    this.styleService.setTabStyle(this.tabStyle, tab);
    this.view = tab;
  }

}
