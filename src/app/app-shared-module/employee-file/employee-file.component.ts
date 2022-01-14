import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AbsenceFormDialogComponent } from 'src/app/absence/absence-form-dialog/absence-form-dialog.component';
import { AbsenceListRowData } from 'src/app/absence/page-absence-view/page-absence-view.component';
import { NewExpenseComponent } from 'src/app/expenses/new-expense/new-expense.component';
import { Absence } from 'src/app/shared/model/absence';
import { Contact } from 'src/app/shared/model/contact';
import { EditEmployee } from 'src/app/shared/model/edit-employee';
import { EmployeeWeekSchedule } from 'src/app/shared/model/employee-week-schedule';
import { Issued } from 'src/app/shared/model/issued';
import { Json } from 'src/app/shared/model/json';
import { ReloaderService } from 'src/app/shared/services/reloader.service';
import { ApiService } from 'src/app/_services/api.service';
import { LeaveService } from 'src/app/_services/api/leave.service';
import { DataService } from 'src/app/_services/data.service';
import { StyleService } from 'src/app/_services/style.service';
import { TokenService } from 'src/app/_services/token.service';
import { EmployeeFileEditComponent } from '../dialogs/employee-file-edit/employee-file-edit.component';

@Component({
  selector: 'pim-employee-file',
  templateUrl: './employee-file.component.html',
  styleUrls: ['./employee-file.component.sass']
})
export class EmployeeFileComponent implements OnInit {
  customBackgroundColor: Json
  routeSnapshot: ActivatedRouteSnapshot;
  issued$!: Observable<Issued[]>
  contact$!: Observable<Contact>;
  employeeWeekSchedulesFields = 'Id,Week_Type__c,ma__c,tue__c,wed__c,thurs__c,fri__c,sat__c,sun__c,Werkdagen__c,TotalHoursDecimal__c,Employee_Schedule__r.Employee_Contact__r.Name';
  employeeWeekScheduleWhere!: string;
  employeeWeekSchedules$!: Observable<EmployeeWeekSchedule[]>;
  weekSchedule$!: Observable<EmployeeWeekSchedule | undefined>;
  evenWeekSchedule$!: Observable<EmployeeWeekSchedule | undefined>;
  unevenWeekSchedule$!: Observable<EmployeeWeekSchedule | undefined>;
  companyCar$!: Observable<Issued | undefined>;
  companyPhone$!: Observable<Issued | undefined>;
  btnStyle = {
    persoonsgegevens : 'active-button',
    contactgegevens : 'inactive-button',
    financiele_gegevens : 'inactive-button',
    werkgeversinformatie : 'inactive-button',
    werknemersrooster : 'inactive-button'
  }
  view = 'persoonsgegevens';
  viewName = 'Persoonsgegevens';
  managerTable = true;
  dossierTable?: string;

  absenceData$: Observable<AbsenceListRowData[]>;
  absenceReload$ = new BehaviorSubject(false);
  customColor: Json;
  tabIndex: number;

  //@TODO AZUREACTIVE FIELD
    
  constructor(
    private apiService: ApiService,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private matDialog: MatDialog,
    private styleService: StyleService,
    private readonly leaveService: LeaveService,
    private readonly tokenService: TokenService,
    private readonly dialog: MatDialog,
    private reloaderService: ReloaderService
  ) {
    this.routeSnapshot = this.activatedRoute.snapshot;
  }
  
  ngOnInit(): void {
    this.customColor = this.styleService.getCustomBackgroundColor();
    const currentUserId = this.tokenService.getContact();

    this.customBackgroundColor = this.styleService.getCustomBackgroundColor();
    this.getData();
    
    const allAbsenceResult$ = this.leaveService.getAllAbsence(
      'Absence_Request__c',
      'Id, Employee_Name__c, Day_Start__c, Day_End__c, EmployeeContactPerson__c, Status__c, Leave_Hours__c, RecordTypeId, Manager__c, Leave_Type__c',
      undefined,
      `EmployeeContactPerson__c = '${currentUserId}'`
    );

    this.absenceData$ = allAbsenceResult$.pipe(
      map((items) => items.filter((absence: Absence) => absence.Status__c !== 'Niet ingediend' && absence.Status__c !== 'Geannuleerd')),
      map((data) => data.map((item: Absence) => this.mapToRowData(item)),
    ));
  }

  getData() {
    let id = this.routeSnapshot.params.id;
    this.tabIndex = this.routeSnapshot.params.tabIndex;
    
    this.dossierTable = id;

    this.routeSnapshot.url.forEach(segment => {
      if (segment.path.includes('mijn_dossier')) {
        this.managerTable = false;
      }
    });
    
    this.employeeWeekScheduleWhere = `Employee_Schedule__r.Employee_Contact__c= '${id}'`;
    this.contact$ = this.apiService.getPortalData(this.dataService.contactObj, this.dataService.contactFields, id);

    console.log(this.contact$.toPromise().then(x => console.log(x)))
    
    this.issued$ = this.apiService.getPortalData(this.dataService.issuedObj, this.dataService.issuedFields, undefined, `Medewerker__c='${id}'`);
    this.companyCar$ = this.issued$.pipe(
      map(type =>
        type.find((car: Issued) => car.Artikelsoort__c === 'Auto van de Zaak')));
    this.companyPhone$ = this.issued$.pipe(
      map(type =>
        type.find((phone: Issued) => phone.Artikelsoort__c === 'Telefoon')));
    
    this.employeeWeekSchedules$ = this.apiService.getPortalData('Employee_Schedule_Week__c', this.employeeWeekSchedulesFields, undefined, this.employeeWeekScheduleWhere);
    this.weekSchedule$ = this.employeeWeekSchedules$.pipe(
      map(array =>
        array.find((evenSchedule: EmployeeWeekSchedule) => evenSchedule.Week_Type__c === null)
      )
    );
    this.evenWeekSchedule$ = this.employeeWeekSchedules$.pipe(
      map(array =>
        array.find((evenSchedule: EmployeeWeekSchedule) => evenSchedule.Week_Type__c === 'Even')
      )
    );
    this.unevenWeekSchedule$ = this.employeeWeekSchedules$.pipe(
      map(array =>
        array.find((unevenSchedule: EmployeeWeekSchedule) => unevenSchedule.Week_Type__c === 'Odd')
      )
    );
  }

  switchContent(contentType: string) {
    this.styleService.setButtonStyle(this.btnStyle, contentType);
    this.viewName = this.styleService.setViewName(contentType);
    this.view = contentType;
  }

  edit() {
    let editData: EditEmployee
    
    editData = {
      employee$: this.contact$,
      view: this.view
    }

    if (this.view === 'financiele_gegevens') {
      editData.companyPhone$ = this.companyPhone$;
      editData.companyCar$ = this.companyCar$;
    }

    if (this.view === 'werknemersrooster') {
      editData.weekSchedule$ = this.weekSchedule$;
      editData.evenWeekSchedule$ = this.evenWeekSchedule$;
      editData.unevenWeekSchedule$ = this.unevenWeekSchedule$;
    }   

    let dialog = this.matDialog.open(EmployeeFileEditComponent, {
      data: editData,
      width: '50%',
      height: '70%',
      panelClass: 'editDialog',
      disableClose: true,
    })
    
    let sub = dialog.afterClosed().subscribe(
      (view: any) => { 
        if (view) {
          this.getData();
        }
      },
      error => {},
      () => {sub.unsubscribe()}
    )
  }

  createAbsence(): void{
    this.dialog.open(AbsenceFormDialogComponent, {
      width: '900px',
      data: {employeeCreateAbsence: true},
    }).afterClosed().pipe(
      tap(() => this.absenceReload$.next(true))
    );
  }

  private mapToRowData(item: Absence): AbsenceListRowData {
    return {
      id: item.Id,
      employeeId: item.EmployeeContactPerson__c,
      name: item.Employee_Name__c,
      period: item.Day_Start__c === item.Day_End__c ? item.Day_Start__c : `${item.Day_Start__c} t/m ${item.Day_End__c}`,
      hours: item.Leave_Hours__c,
      status: item.Status__c,

      // extra data for the manage absence dialog
      absenceKind: item.RecordTypeId,
      absenceType: item.Leave_Type__c,
      absenceStartDay: item.Day_Start__c,
      absenceEndDay: item.Day_End__c ? item.Day_End__c : item.Day_Start__c,
      comments: item.Comments__c,
      manager: item.Manager__c,
    }
  }
  
  newExpense() {
    let dialog;
    dialog = this.matDialog.open(NewExpenseComponent, {
      data: {managerDialog: false},
      disableClose: true
    })

    dialog.afterClosed().pipe(take(1)).subscribe(
      data => {
        if (data.success) { 
          this.reloaderService.reloadData();
        }
      }
    )
  }

}
