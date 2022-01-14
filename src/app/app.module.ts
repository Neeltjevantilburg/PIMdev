import { NgModule } from '@angular/core';
// declarations:
import { AppComponent } from './app.component';
import { HeaderMenuComponent } from './portaal-layout/header-menu/header-menu.component';
import { PortaalLayoutComponent } from './portaal-layout/portaal-layout.component';
import { WelcomeLayoutComponent } from './welcome-layout/welcome-layout.component';
import { SideMenuComponent } from './portaal-layout/side-menu/side-menu.component';
// imports;
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared-module/shared.module';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpInterceptorProviders } from './shared-module/services/http-interceptors/interceptors';
// import { LOCALE_ID } from '@angular/core';

import {MatListModule} from '@angular/material/list';
import { AbsenceModule } from './portaal-module/absence/absence.module';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatNativeDateModule } from '@angular/material/core';
import { FilesModule } from './portaal-module/files/files.module';
import { ExpensesModule } from './portaal-module/expenses/expenses.module';
import { ProfileModule } from './portaal-module/profile/profile.module';
import { CompanyModule } from './portaal-module/company/company.module';
import { EmployeeModule } from './portaal-module/employee/employee.module';
import { EmployeeFileModule } from './portaal-module/employee-file/employee-file.module';
import { PortaalModule } from './portaal-module/portaal.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { WelcomeModule } from './welcome-module/welcome.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeLayoutComponent,
    PortaalLayoutComponent,
    HeaderMenuComponent,
    SideMenuComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    // SharedModule,
    AppRoutingModule,
    HttpClientModule,
    MatListModule,
    // MatFormFieldModule,
    // MatInputModule,
    // AbsenceModule,
    // MatNativeDateModule,
    // FilesModule,
    // ExpensesModule,
    // ProfileModule,
    // CompanyModule,
    // EmployeeModule,
    // EmployeeFileModule,
    // PortaalModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatDialogModule
  ],
  providers: [
    DatePipe,
    HttpInterceptorProviders,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
