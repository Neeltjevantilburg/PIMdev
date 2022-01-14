import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmployeeFileEditComponent } from 'src/app/app-shared-module/dialogs/employee-file-edit/employee-file-edit.component';
import { Contact } from 'src/app/shared/model/contact';
import { EditEmployee } from 'src/app/shared/model/edit-employee';
import { EmployeeWeekSchedule } from 'src/app/shared/model/employee-week-schedule';
import { Issued } from 'src/app/shared/model/issued';
import { ApiService } from 'src/app/_services/api.service';
import { DataService } from 'src/app/_services/data.service';
import { StyleService } from 'src/app/_services/style.service';

@Component({
  selector: 'pim-personal-tab',
  templateUrl: './personal-tab.component.html',
  styleUrls: ['./personal-tab.component.sass']
})
export class PersonalTabComponent implements OnInit {
  @Input()
    contact$: Observable<Contact>;
  issued$!: Observable<Issued[]>
  employeeWeekSchedulesFields = 'Id,Week_Type__c,ma__c,tue__c,wed__c,thurs__c,fri__c,sat__c,sun__c,Werkdagen__c,TotalHoursDecimal__c,Employee_Schedule__r.Employee_Contact__r.Name';
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
    
  constructor(
    private apiService: ApiService,
    private dataService: DataService,
    private matDialog: MatDialog,
    private styleService: StyleService
  ) {
  }
  
  ngOnInit(): void {
    this.getData(); 
  }

  getData() {
    this.contact$.toPromise().then(contact => {
      const id = contact.Id
      const employeeWeekScheduleCondition = `Employee_Schedule__r.Employee_Contact__c= '${id}'`;
      
      this.issued$ = this.apiService.getPortalData(this.dataService.issuedObj, this.dataService.issuedFields, undefined, `Medewerker__c='${id}'`);
      this.companyCar$ = this.issued$.pipe(
        map(type =>
          type.find((car: Issued) => car.Artikelsoort__c === 'Auto van de Zaak')));
      this.companyPhone$ = this.issued$.pipe(
        map(type =>
          type.find((phone: Issued) => phone.Artikelsoort__c === 'Telefoon')));
      
      this.employeeWeekSchedules$ = this.apiService.getPortalData('Employee_Schedule_Week__c', this.employeeWeekSchedulesFields, undefined, employeeWeekScheduleCondition);
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
    })
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
      disableClose: true
    })
    
    let sub = dialog.afterClosed().subscribe(
      (view: any) => { 
        if (view) {
          this.getData();
        }
      },
      () => {sub.unsubscribe()}
    )
  }

}
