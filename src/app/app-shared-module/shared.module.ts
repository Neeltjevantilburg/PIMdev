import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComingSoonComponent } from './dialogs/coming-soon/coming-soon.component';
import { ConfirmComponent } from './dialogs/confirm/confirm.component';
import { HttpErrorComponent } from './dialogs/httpError/http-error.component';
import { LoadingComponent } from './dialogs/loading/loading.component';
import { EmployeeFormComponent } from './dialogs/employee-form/employee-form.component';
import { EmployeeFileComponent } from './employee-file/employee-file.component';
import { SharedMaterialModule } from './shared-material.module';
import { RedirectComponent } from './dialogs/redirect/redirect.component';
import { ExpenseFormComponent } from './dialogs/expense-form/expense-form.component';
import { LeaveFormComponent } from './dialogs/leave-form/leave-form.component';
import { Page404Component } from './page404/page404.component';
import { AbsenteeismFormComponent } from './dialogs/absenteeism-form/absenteeism-form.component';
import { LeaveViewComponent } from './dialogs/leave-view/leave-view.component';
import { ExpenseViewComponent } from './dialogs/expense-view/expense-view.component';
import { AbsenteeismViewComponent } from './dialogs/absenteeism-view/absenteeism-view.component';
import { AbsenteeismRecoveryComponent } from './dialogs/absenteeism-recovery/absenteeism-recovery.component';
import { AccountFormComponent } from './dialogs/account-form/account-form.component';
import { RouterModule } from '@angular/router';
import { EmployeeFileEditComponent } from './dialogs/employee-file-edit/employee-file-edit.component';
import { FilesModule } from '../files/files.module';
import { ExpensesModule } from '../expenses/expenses.module';
import { AbsenceModule } from '../absence/absence.module';
import { TaskOverviewComponent } from '../app-portaal-module/portaal-pages/task-overview/task-overview.component';
import { PortaalModule } from '../app-portaal-module/portaal.module';


@NgModule({
    declarations: [
        EmployeeFileComponent,
        ConfirmComponent,
        HttpErrorComponent,
        LoadingComponent,
        EmployeeFormComponent,
        ComingSoonComponent,
        RedirectComponent,
        ExpenseFormComponent,
        LeaveFormComponent,
        Page404Component,
        AbsenteeismFormComponent,
        LeaveViewComponent,
        ExpenseViewComponent,
        AbsenteeismRecoveryComponent,
        AbsenteeismViewComponent,
        AccountFormComponent,
        EmployeeFileEditComponent,
        AbsenteeismViewComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedMaterialModule,
        RouterModule,
        FilesModule,
        ExpensesModule,
        AbsenceModule
    ],
    exports: [
        SharedMaterialModule,
        CommonModule,
        ReactiveFormsModule,
        EmployeeFileComponent,
        ConfirmComponent,
        HttpErrorComponent,
        LoadingComponent,
        EmployeeFormComponent,
        ComingSoonComponent,
        ExpenseFormComponent,
        LeaveFormComponent,
        Page404Component,
        AbsenteeismFormComponent,
        LeaveViewComponent,
        ExpenseViewComponent,
        AbsenteeismViewComponent,
        AbsenteeismRecoveryComponent,
        AccountFormComponent,
        EmployeeFileEditComponent
    ]
})
export class SharedModule { }