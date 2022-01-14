import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewContainerComponent } from './view-container/view-container.component';
import { MatIconModule } from '@angular/material/icon';
import { FilesModule } from '../files/files.module';
import { PersonalTabComponent } from './personal-tab/personal-tab.component';
import { DocumentsTabComponent } from './documents-tab/documents-tab.component';
import { AbsenceModule } from '../absence/absence.module';
import { ExpensesModule } from '../expenses/expenses.module';



@NgModule({
  declarations: [
    ViewContainerComponent,
    PersonalTabComponent,
    DocumentsTabComponent
  ],
  imports: [
    CommonModule,
    FilesModule,
    MatIconModule,
    AbsenceModule,
    ExpensesModule
  ],
  exports: [
    ViewContainerComponent
  ]
})
export class EmployeeFileModule { }
