import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComingSoonComponent } from 'src/app/app-shared-module/dialogs/coming-soon/coming-soon.component';
import { LeaveViewComponent } from 'src/app/app-shared-module/dialogs/leave-view/leave-view.component';
import { Absence } from 'src/app/shared/model/absence';
import { Json } from 'src/app/shared/model/json';
import { LeaveService } from 'src/app/_services/api/leave.service';
import { DataService } from 'src/app/_services/data.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import { TokenService } from 'src/app/_services/token.service';

interface RowData {
  id: string;
  name: string;
  period: string;
  hours: number;
  status: string;
}

@Component({
  selector: 'pim-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.sass']
})
export class LeaveComponent implements OnInit, OnDestroy {
  pageSize = "8";
  default = "employed";
  subscriptions?: Subscription[];
  defaultDialog?: MatDialogRef<ComingSoonComponent>;
  leaveViewDialog?: MatDialogRef<LeaveViewComponent>;
  leaveColumns: string[] = ['Werknemer','Datum', 'Uren','Status','QuickActions'];
  absenceData$: Observable<RowData[]>;

  constructor(
    private dialog: MatDialog,
    private sub: SubscriptionService,
    private leaveService: LeaveService,
    private readonly tokenService: TokenService,
    private readonly dataService: DataService,
  ) { }   

  ngOnInit(): void {
    const accountId = this.tokenService.getAccount();

    // Get all absence/leave/verlof for a Leidinggevende
    //TODO get all absence/leave for a medewerker
    const result$ =  this.leaveService.getAllAbsence(
      this.dataService.leaveObj,
      'Id, Employee_Name__c, Day_Start__c, Day_End__c, EmployeeContactPerson__c, Status__c, Leave_Hours__c',
      undefined,
      `EmployeeContactPerson__r.Account.id = '${accountId}'`
    );

    this.absenceData$ = result$.pipe(
      map((data) => data.map((item: Absence) => this.mapToRowData(item)),
    ));
   
  }

  private mapToRowData(item: Absence): RowData {
    return {
      id: item.Id,
      name: item.Employee_Name__c,
      period: item.Day_Start__c === item.Day_End__c ? item.Day_Start__c : `${item.Day_Start__c} t/m ${item.Day_End__c}`,
      hours: item.Leave_Hours__c,
      status: item.Status__c
    }
  }

  
  check(id: string) {
    if (!this.subscriptions) {
      this.subscriptions = [];
    }
    let leave = this.leaveService.getLeaveById(id!);
    
    this.leaveViewDialog = this.dialog.open(LeaveViewComponent, {
      data: {leave},
      width: '35%',
      disableClose: true
    });

    this.subscriptions.push(this.leaveViewDialog.afterClosed().subscribe(
      (data: Json) => { }
    ));
  }

  approved(approved: boolean, id: string) {
    if (approved) {

    } else {

    }
  }

  completed(status: string) {
    let complete = true;

    if (status === "ingediend") {
      complete = false
    }

    return complete
  }

  ngOnDestroy() {
    this.sub.cleanUp(this.subscriptions);
  }

}


