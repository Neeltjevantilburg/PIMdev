import { Component, OnInit } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Absence } from 'src/app/shared/model/absence';
import { Expense } from 'src/app/shared/model/expense';
import { Sickness } from 'src/app/shared/model/sickness';
import { RoleService } from 'src/app/shared/services/role.service';
import { ApiService } from 'src/app/_services/api.service';
import { DataService } from 'src/app/_services/data.service';
import { ExpenseService } from 'src/app/_services/expense.service';
import { TokenService } from 'src/app/_services/token.service';

@Component({
  selector: 'pim-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  button = { 'position': 'absolute',  'z-index' : '1', 'border' : 'none', 'background-color' : '#00000000'};
  absence$: Observable<Absence[]> = from([]);
  expense$: Observable<Expense[]> = from([]);
  sickness$: Observable<Sickness[]> = from([]);
  contract: Observable<number> = of(0);

  absenceTotal$: Observable<number> = of(0);
  sicknessTotal$: Observable<number> = of(0)
  expenseTotal$: Observable<number> = of(0);

  isEmployee$: Observable<boolean>;
  isManager$: Observable<boolean>;

  public readonly currentUserId: string;

  constructor(
    private readonly api: ApiService,
    private readonly dataService: DataService,
    private readonly tokenService: TokenService,
    private readonly roleService: RoleService,
    private expenseService: ExpenseService
  ) { 
    this.currentUserId = this.tokenService.getContact();
  }

  async ngOnInit(): Promise<void> {
    const accountId = this.tokenService.getAccount();
    this.isEmployee$ = this.roleService.isEmployee$;
    this.isManager$ = this.roleService.isManager$;

    // TODO: Query op basis van user role: 
    // medewerker: `EmployeeContactPerson__r.AccountId='${accountId}' and EmployeeContactPerson__c='${currentUserId}'`,
    // Ledinggevende: `EmployeeContactPerson__r.AccountId='${accountId}' and EmployeeContactPerson__r.contactPersoon_beheren__c='${currentUserId}'`,
    //HR medewerker: `EmployeeContactPerson__r.AccountId='${accountId}'`,

    this.absence$ = this.api.getPortalData(
      this.dataService.leaveObj, 
      this.dataService.leaveFields,
      undefined,
      // `EmployeeContactPerson__r.AccountId='${accountId}' and EmployeeContactPerson__c='${currentUserId}'`,
      `EmployeeContactPerson__r.AccountId='${accountId}'`
    );

    this.absenceTotal$ = this.absence$.pipe(
      map(x => x.length)
    );

    this.sickness$ = this.api.getPortalData(
      this.dataService.absenteeismObj,
      this.dataService.absenteeismFields,
      undefined,
      // `Manager__r.AccountId='${accountId}' and EmployeeContactPerson__c='${currentUserId}'`,
      `Manager__r.AccountId='${accountId}'`
    );

    this.sicknessTotal$ = this.sickness$.pipe(
      map(x => x.length)
    );

    // this.expense$ = this.api.getPortalData(
    //   this.dataService.expenseObj, 
    //   this.dataService.expenseFields,
    //   undefined,
    //   // `EmployeeContactPerson__r.AccountId='${accountId}' and EmployeeContactPerson__c='${currentUserId}'`,
    //   `Manager__r.AccountId='${accountId}'`
    // );    
    
    this.expenseTotal$ = this.expenseService.getExpenseTotal()
  }

}
