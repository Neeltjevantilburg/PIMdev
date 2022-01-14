import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AbsenceFormDialogComponent } from 'src/app/absence/absence-form-dialog/absence-form-dialog.component';
import { AbsenceListRowData } from 'src/app/absence/page-absence-view/page-absence-view.component';
import { NewExpenseComponent } from 'src/app/expenses/new-expense/new-expense.component';
import { Absence } from 'src/app/shared/model/absence';
import { Contact } from 'src/app/shared/model/contact';
import { Json } from 'src/app/shared/model/json';
import { ReloaderService } from 'src/app/shared/services/reloader.service';
import { LeaveService } from 'src/app/_services/api/leave.service';
import { NavigateService } from 'src/app/_services/navigate.service';
import { StyleService } from 'src/app/_services/style.service';
import { EmployeeFileService } from '../employee-file.service';

@Component({
  selector: 'pim-view-container',
  templateUrl: './view-container.component.html',
  styleUrls: ['./view-container.component.sass']
})
export class ViewContainerComponent implements OnInit {
  customBackgroundColor: Json;
  tabStyle = {
    persoonlijk : 'active',
    contract : 'inactive',
    documenten : 'inactive',
    verlof : 'inactive',
    verzuim : 'inactive',
    declaratie : 'inactive',
    taken : 'inactive'
  }
  indicator: string;
  view = 'persoonlijk';
  employeeId: string;
  managerTable = true;
  contact$: Observable<Contact>;
  absenceData$: Observable<AbsenceListRowData[]>;
  absenceReload$ = new BehaviorSubject(false);
  @ViewChild('deactivateBtn')
    deactivateBtn: ElementRef;
  @ViewChild('activateBtn')
    activateBtn: ElementRef;

  constructor(
    private styleService: StyleService,
    private activatedRoute: ActivatedRoute,
    private employeeFileService: EmployeeFileService,
    private navigateService: NavigateService,
    private leaveService: LeaveService,
    private dialog: MatDialog,
    private reloaderService: ReloaderService
  ) { 
    this.customBackgroundColor = this.styleService.getCustomBackgroundColor();
  }

  ngOnInit(): void {
    this.employeeId = this.activatedRoute.snapshot.params.id;
    this.contact$ = this.employeeFileService.getEmployeeDataById(this.employeeId);
    this.contact$.pipe(map(data => data.AzureActive ? this.indicator = 'activeUser' : this.indicator = 'inactiveUser' )).toPromise();
    const allAbsenceResult$ = this.leaveService.getAllAbsence(
      'Absence_Request__c',
      'Id, Employee_Name__c, Day_Start__c, Day_End__c, EmployeeContactPerson__c, Status__c, Leave_Hours__c, RecordTypeId, Manager__c, Leave_Type__c',
      undefined,
      `EmployeeContactPerson__c = '${this.employeeId}'`
    );

    this.absenceData$ = allAbsenceResult$.pipe(
      tap(data => console.log(data)),
      map((items) => items.filter((absence: Absence) => absence.Status__c !== 'Niet ingediend' && absence.Status__c !== 'Geannuleerd')),
      map((data) => data.map((item: Absence) => this.mapToRowData(item)),
    ));

    this.activatedRoute.snapshot.url.forEach(segment => {
      if (segment.path.includes('mijn_dossier')) {
        this.managerTable = false;
      }
    });
  }

  switchContent(type: string) {
    this.styleService.setTabStyle(this.tabStyle, type);
    this.view = type;
  }

  toOverview() {
    this.navigateService.to('/werknemers')
  }

  activateUser(username: string, id: string) {
    this.activateBtn.nativeElement.disabled = true;
    this.employeeFileService.activateDeactivateUser(username, true, id).toPromise()
      .then(x => {
        console.log(x)
      });
  }

  deactivateUser(username: string, id: string) {
    this.deactivateBtn.nativeElement.disabled = true;
    this.employeeFileService.activateDeactivateUser(username, false, id).toPromise()
      .then(x => {
        console.log(x)
      });
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
    dialog = this.dialog.open(NewExpenseComponent, {
      data: {managerDialog: false},
      disableClose: true
    })

    dialog.afterClosed().pipe(
      take(1)
    ).subscribe(
      data => {
        if (data.success) {
          this.reloaderService.reloadData();
        }
      }
    )
  }
}
