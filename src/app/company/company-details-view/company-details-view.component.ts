import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { CompanyService } from 'src/app/shared/services/company.service';

@Component({
  selector: 'pim-company-details-view',
  templateUrl: './company-details-view.component.html',
  styleUrls: ['./company-details-view.component.sass']
})
export class CompanyDetailsViewComponent implements OnInit {
  companyData$: Observable<any>;
  imgSource$: Observable<SafeResourceUrl>;

  constructor(
    private companyService: CompanyService
  ) { }

  ngOnInit(): void {
    this.companyData$ = this.companyService.getCompanyDetails();
    this.imgSource$ = this.companyService.getCompanyLogo();
  }

}
