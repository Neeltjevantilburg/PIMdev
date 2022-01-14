import { NgModule } from '@angular/core';
// imports:
import { PortaalRoutingModule } from './portaal-routing.module';
import { DashboardComponent } from './portaal-pages/dashboard/dashboard.component';
import { FaqComponent } from './portaal-pages/faq/faq.component';
import { CompanyComponent } from './portaal-pages/company/company.component';
import { EmployeeOverviewComponent } from './portaal-pages/employee-overview/employee-overview.component';
import { PayrollComponent } from './portaal-pages/payroll/payroll.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxColorsModule } from 'ngx-colors';
import { ColorSketchModule } from 'ngx-color/sketch';
import { ColorPickerModule } from 'ngx-color-picker';
import { SharedModule } from '../app-shared-module/shared.module';
import { CommonModule } from '@angular/common';
import { TaskOverviewComponent } from './portaal-pages/task-overview/task-overview.component';
import { ExpenseComponent } from './portaal-pages/expense/expense.component';
import { LeaveComponent } from './portaal-pages/leave/leave.component';
import { AbsenteeismComponent } from './portaal-pages/absenteeism/absenteeism.component';
import { ContractComponent } from './portaal-pages/contract/contract.component';
import { BirthdayOverviewComponent } from './portaal-pages/birthday-overview/birthday-overview.component';
import { SharedMaterialModule } from '../app-shared-module/shared-material.module';

@NgModule({
  declarations: [
    DashboardComponent,
    FaqComponent,
    PayrollComponent,
    EmployeeOverviewComponent,
    CompanyComponent,
    TaskOverviewComponent,
    ExpenseComponent,
    LeaveComponent,
    AbsenteeismComponent,
    ContractComponent,
    BirthdayOverviewComponent
  ],
  imports: [
    NgxColorsModule,
    ColorSketchModule,
    ColorPickerModule,
    FormsModule,
    CommonModule,
    PortaalRoutingModule,
    ReactiveFormsModule,
    SharedMaterialModule
  ],
  exports: [
    LeaveComponent,
    TaskOverviewComponent
  ]
})
export class PortaalModule { }
