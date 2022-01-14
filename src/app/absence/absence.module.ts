import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PageAbsenceViewComponent } from './page-absence-view/page-absence-view.component';
import { MatTabsModule } from '@angular/material/tabs';
// import { PortaalModule } from 'src/app/app-portaal-module/portaal.module';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';

import { AbsenceListComponent } from './absence-list/absence-list.component';
import { AbsenceFormDialogComponent } from './absence-form-dialog/absence-form-dialog.component';
import { ManagerAbsenceListComponent } from './manager-absence-list/manager-absence-list.component';
import { AbsenceListFilterComponent } from './absence-list-filter/absence-list-filter.component';
import { ManageAbsenceDialogComponent } from './manage-absence-dialog/manage-absence-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDividerModule,
    MatMenuModule,
    MatTableModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,

  ],
  declarations: [
    PageAbsenceViewComponent, 
    AbsenceListComponent,
    AbsenceFormDialogComponent,
    ManagerAbsenceListComponent,
    AbsenceListFilterComponent,
    ManageAbsenceDialogComponent,
  ],
  exports: [
    AbsenceFormDialogComponent,
    AbsenceListComponent
  ]
})
export class AbsenceModule { }
