import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Json } from 'src/app/shared/model/json';
import { RoleService } from 'src/app/shared/services/role.service';
import { ApiService } from 'src/app/_services/api.service';
import { StyleService } from 'src/app/_services/style.service';
import { AbsenceFormDialogComponent } from '../absence-form-dialog/absence-form-dialog.component';
import { AbsenceListRowData } from '../page-absence-view/page-absence-view.component';

interface RowData {
  employee: string;
  absenceType: string;
  absenceStartDay: string;
  absenceEndDay: string;
  comments: string;
  status: string;
}

interface AbsenceDTO {
  EmployeeContactPerson__c: string;
  Leave_Type__c: string;
  RecordTypeId: string;
  Number_of_Hours__c: number;
  Day_Start__c: string;
  Day_End__c: string;
  Comments__c: string;
  Status__c: string;
  Manager__c: string;
}

@Component({
  selector: 'pim-manage-absence-dialog',
  templateUrl: './manage-absence-dialog.component.html',
  styleUrls: ['./manage-absence-dialog.component.sass']
})
export class ManageAbsenceDialogComponent implements OnInit, OnDestroy {

  customColor: Json;
  absence: AbsenceDTO;
  dialogData: RowData;
  isEmployee$: Observable<boolean>;
  isManager$: Observable<boolean>;
  private readonly destroy$ = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AbsenceListRowData,
    private dialog: MatDialog,
    private readonly styleService: StyleService,
    private readonly roleService: RoleService,
    private readonly apiService: ApiService,
  ) { }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.dialogData = this.mapToRowData(this.data)
    this.absence = this.mapToDTO(this.data);
    this.customColor = this.styleService.getCustomBackgroundColor();

    this.isEmployee$ = this.roleService.isEmployee$;
    this.isManager$ = this.roleService.isManager$;
  }

  rejectAbsence(): void{
    const rejectionData = {
      Status__c: 'Afgewezen',
    }

    this.apiService.updatePortalData(
      'Absence_Request__c',
      `${this.data.id}`,
      rejectionData,
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe();

  }

  removeAbsence(): void{
    this.apiService.updatePortalData(
      'Absence_Request__c', 
      `${this.data.id}`,
      {Status__c: 'Geannuleerd'},
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe();
    
  }


  revokeSubmittedAbsence(): void {
    const revokeSubmitData = {
      Status__c: 'Geannuleerd'
    }

    this.apiService.updatePortalData(
      'Absence_Request__c',
      `${this.data.id}`,
      revokeSubmitData,
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe();
  }

  modifyAbsence(): void{
    this.dialog.open(AbsenceFormDialogComponent, {
      data: this.dialogData,
    })
  }

  async approveAbsence(): Promise<void>{
    const approvalData = {
      Status__c: 'Goedgekeurd',
    }

    await this.apiService.updatePortalData(
      'Absence_Request__c',
      `${this.data.id}`,
      approvalData,
    ).toPromise();
  }

  private mapToDTO(data: AbsenceListRowData): AbsenceDTO {
    return { 
      EmployeeContactPerson__c: data.employeeId,
      Leave_Type__c: data.absenceType,
      RecordTypeId: data.absenceKind,
      Number_of_Hours__c: data.hours,
      Day_Start__c: data.absenceStartDay,
      Day_End__c: data.absenceEndDay,
      Comments__c: data.comments,
      Status__c: data.status,
      Manager__c: data.manager,
    }

  }

  private mapToRowData(data: AbsenceListRowData): RowData {
    return {
      employee: data.name,
      absenceType: data.absenceType,
      absenceStartDay: data.absenceStartDay,
      absenceEndDay: data.absenceEndDay,
      comments: data.comments,
      status: data.status,
    }
  }

  private deleteAbsence(id: string): Observable<void>{
     return this.apiService.updatePortalData(
            'Absence_Request__c', 
            id,
            {Status__c: 'Geannuleerd'},
          )
  }
  

}
