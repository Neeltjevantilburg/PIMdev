
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { delay, filter, map, share, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { Absence } from 'src/app/shared/model/absence';
import { TokenService } from 'src/app/_services/token.service';
import { RoleService } from 'src/app/shared/services/role.service';
import { AbsenceService } from '../absence.service';
import { Json } from 'src/app/shared/model/json';
import { StyleService } from 'src/app/_services/style.service';
import { AbsenceFormDialogComponent } from '../absence-form-dialog/absence-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoadChildren } from '@angular/router';
import { LoadingService } from 'src/app/shared/services/loading.service';

export interface AbsenceListRowData {
  id: string;
  employeeId: string;
  name: string;
  period: string;
  hours: number;
  status: string;
  absenceKind: string;
  absenceType: string;
  absenceStartDay: string;
  absenceEndDay: string;
  comments: string;
  manager: string;
}

@Component({
  selector: 'pim-page-absence-view',
  templateUrl: './page-absence-view.component.html',
  styleUrls: ['./page-absence-view.component.sass'],
})
export class PageAbsenceViewComponent implements OnInit {

  isManager$: Observable<boolean>;
  openAbsenceData$: Observable<AbsenceListRowData[]>;
  allAbsenceData$: Observable<AbsenceListRowData[]>;
  data$: Observable<Absence[]>;
  finishedAbsenceData$: Observable<AbsenceListRowData[]>;
  allAbsenceForManager$: Observable<AbsenceListRowData[]>;
  leaveColumns: string[] = ['Werknemer','Datum', 'Uren','Status'];
  absenceReload$ = new BehaviorSubject(false);
  allAbsenceResult$: Observable<Absence[]>;
  customColor: Json;


  constructor(
    private readonly dialog: MatDialog,
    private readonly tokenService: TokenService,
    private readonly absenceService: AbsenceService,
    private readonly roleService: RoleService,
    private readonly styleService: StyleService,
  ) {}

  ngOnInit(): void {
    const currentUserId = this.tokenService.getContact()
    this.isManager$ = this.roleService.isManager$;
    this.customColor = this.styleService.getCustomBackgroundColor();

    this.data$ = this.absenceService.reload$.pipe(
      delay(2000),
      switchMap(() => this.retrieveAllData(currentUserId)),
      shareReplay({refCount: true}),
    );

    this.allAbsenceData$ = this.data$.pipe(
      tap(() => console.log("All absenceData triggered")),
      map((items) => items.filter((absence: Absence) => absence.Status__c !== 'Niet ingediend' && absence.Status__c !== 'Geannuleerd')),
      map((data) => data.map((item: Absence) => this.mapToRowData(item)),
    ));

    this.openAbsenceData$ = this.data$.pipe(
      tap(() => console.log("All openAbsenceData triggered")),
      map((items) => items.filter((absence: Absence) => absence.Status__c === 'Ingediend')),
      tap((x) => console.log(x.length)),
      map((data) => data.map((item: Absence) => this.mapToRowData(item)),
    ));

    this.finishedAbsenceData$ = this.data$.pipe(
      tap(() => console.log("All finishedAbsenceData triggered")),
      map((items) => items.filter((absence: Absence) => 
        absence.Status__c === 'Afgekeurd' || 
        absence.Status__c === 'Goedgekeurd' ||
        absence.Status__c === 'Afgewezen' ||
        absence.Status__c === 'Geannuleerd'
      )),
      map((data) => data.map((item: Absence) => this.mapToRowData(item)),
    ));

    const managerData$ =  this.absenceService.getAllAbsence(
      'Absence_Request__c',
      'Id, Employee_Name__c, Day_Start__c, Day_End__c, EmployeeContactPerson__c, Status__c, Leave_Hours__c',
      undefined,
      `EmployeeContactPerson__c = '${currentUserId}'`
    );

    this.allAbsenceForManager$ = managerData$.pipe(
      map((data: Absence[]) => data.map((item: Absence) => this.mapToRowData(item)),
    ));
  }

  onFilterCriteriaChange(value: string) {
    console.log("onFilterCriteriaChange triggered in Page-absence:", value);
    let result =  this.allAbsenceData$ = this.data$.pipe(
        map((items: Absence[]) => items.filter((item) => item.Status__c === value)),
        map((data) => data.map((item: Absence) => this.mapToRowData(item))),
        tap((x) => console.log(x))
      );
    return result;
  }

  private retrieveAllData(currentUserId: string): Observable<Absence[]>{
    return this.absenceService.getAllAbsence(
        'Absence_Request__c',
        'Id, Employee_Name__c, Day_Start__c, Day_End__c, EmployeeContactPerson__c, Status__c, Leave_Hours__c, RecordTypeId, Manager__c, Leave_Type__c',
        undefined,
        `Manager__c = '${currentUserId}'`,
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
      absenceKind: item.RecordTypeId,
      absenceType: item.Leave_Type__c,
      absenceStartDay: item.Day_Start__c,
      absenceEndDay: item.Day_End__c ? item.Day_End__c : item.Day_Start__c,
      comments: item.Comments__c,
      manager: item.Manager__c,
    }
  }

  createAbsence(): void{
    // this.absenceService.openAbsenceFormDialog();
    const dialogRef$ = this.dialog.open(AbsenceFormDialogComponent, {
      width: '900px',
      });
      
       dialogRef$
        .afterClosed()
        .pipe(
          filter(confirmed => !!confirmed),
          map(() => this.absenceService.setReload(true)),
        ).subscribe();
  }



}
