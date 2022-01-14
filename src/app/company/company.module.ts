import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyPageComponent } from './company-page/company-page.component';
import { CompanyDetailsViewComponent } from './company-details-view/company-details-view.component';
import { CompanyDeparmentsFunctionsViewComponent } from './company-deparments-functions-view/company-deparments-functions-view.component';
import { CompanyFilesViewComponent } from './company-files-view/company-files-view.component';
import { CompanyUsersViewComponent } from './company-users-view/company-users-view.component';
import { CompanySettingsViewComponent } from './company-settings-view/company-settings-view.component';
import { MatIconModule } from '@angular/material/icon';
import { NgxColorsModule } from 'ngx-colors';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    CompanyPageComponent,
    CompanyDetailsViewComponent,
    CompanyDeparmentsFunctionsViewComponent,
    CompanyFilesViewComponent,
    CompanyUsersViewComponent,
    CompanySettingsViewComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    NgxColorsModule,
    FormsModule,
    MatButtonModule
  ],
  exports: [
    CompanyPageComponent
  ]
})
export class CompanyModule { }
