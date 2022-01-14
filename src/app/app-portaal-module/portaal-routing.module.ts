import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Routes Components:
import { CompanyComponent } from './portaal-pages/company/company.component';
import { DashboardComponent } from './portaal-pages/dashboard/dashboard.component';
import { EmployeeOverviewComponent } from './portaal-pages/employee-overview/employee-overview.component';
import { FaqComponent } from './portaal-pages/faq/faq.component';
import { EmployeeFileComponent } from '../app-shared-module/employee-file/employee-file.component';
import { PayrollComponent } from './portaal-pages/payroll/payroll.component';
import { ProfilePageComponent } from '../profile/profile-page/profile-page.component';
import { AbsenteeismComponent } from './portaal-pages/absenteeism/absenteeism.component';
import { ContractComponent } from './portaal-pages/contract/contract.component';
import { PageAbsenceViewComponent } from '../absence/page-absence-view/page-absence-view.component';
import { PageExpensesViewComponent } from '../expenses/page-expenses-view/page-expenses-view.component';
import { CompanyPageComponent } from '../company/company-page/company-page.component';
import { ViewContainerComponent } from '../employee-file/view-container/view-container.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: DashboardComponent
  },
  {
    path: 'werknemers',
    component: EmployeeOverviewComponent
  },
  {
    path: 'handleding',
    component: FaqComponent
  },
  {
    path: 'salarisadministratie',
    component: PayrollComponent
  },
  {
    path: 'mijn_profiel',
    component: ProfilePageComponent
  },
  {
    path: 'old_company',
    component: CompanyComponent
  },
  {
    path: 'mijn_bedrijf',
    component: CompanyPageComponent
  },
  {
    path: 'declaratie',
    component: PageExpensesViewComponent
  },
  {
    path: 'verzuim',
    component: AbsenteeismComponent
  },
  {
    path: 'verlof',
    component: PageAbsenceViewComponent
  },
  {
    path: 'contract',
    component: ContractComponent
  },
  {
    path: 'werknemer_dossier/:id',
    component: ViewContainerComponent
  },
  {
    path: 'mijn_dossier/:id',
    component: ViewContainerComponent
  },
  {
    path: 'werknemer_dossier_old/:active/:id',
    component: EmployeeFileComponent
  },
  {
    path: 'mijn_dossier_old/:tabIndex:/:id',
    component: EmployeeFileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortaalRoutingModule { }
