import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AbsenteeismFormComponent } from 'src/app/app-shared-module/dialogs/absenteeism-form/absenteeism-form.component';
import { ComingSoonComponent } from 'src/app/app-shared-module/dialogs/coming-soon/coming-soon.component';
import { EmployeeFormComponent } from 'src/app/app-shared-module/dialogs/employee-form/employee-form.component';
import { ExpenseFormComponent } from 'src/app/app-shared-module/dialogs/expense-form/expense-form.component';
import { HttpErrorComponent } from 'src/app/app-shared-module/dialogs/httpError/http-error.component';
import { LeaveFormComponent } from 'src/app/app-shared-module/dialogs/leave-form/leave-form.component';

import { Json } from 'src/app/shared/model/json';
import { ApiService } from 'src/app/_services/api.service';
import { DataService } from 'src/app/_services/data.service';
import { NavigateService } from 'src/app/_services/navigate.service';
import { ObjectService } from 'src/app/_services/object.service';
import { PicklistService } from 'src/app/_services/picklist.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import { TokenService } from 'src/app/_services/token.service';

@Component({
  selector: 'pim-employee-overview',
  templateUrl: './employee-overview.component.html',
  styleUrls: ['./employee-overview.component.sass']
})
export class EmployeeOverviewComponent implements OnInit, AfterViewInit, OnDestroy {
  pageSize = "8";
  default = "employed";
  subscriptions: Subscription[] = [];
  defaultDialog?: MatDialogRef<ComingSoonComponent>;
  updateDialog?: MatDialogRef<EmployeeFormComponent>;
  newDialog?: MatDialogRef<EmployeeFormComponent>;
  expenseDialog?: MatDialogRef<ExpenseFormComponent>;
  leaveDialog?: MatDialogRef<LeaveFormComponent>;
  absenteeismDialog?: MatDialogRef<AbsenteeismFormComponent>;
  absenteeismSub?: Subscription;
  werknemersColumns: string[] = ['FirstName','tussenvoegsel','achternaam','email','telefoonnummer', 'mobiel', 'azure','view', 'edit', 'quickActions'];
  werknemers: MatTableDataSource<any> = new MatTableDataSource()
  werknemersArray!: Json[];
  uitDienst: Json[] = [];
  inDienst: Json[] = [];

  @ViewChild(MatPaginator)
    paginator!: MatPaginator;
  @ViewChild(MatSort)
    sort!: MatSort;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private sub: SubscriptionService,
    private object: ObjectService,
    public picklist: PicklistService,
    private api: ApiService,
    private data: DataService,
    private token: TokenService,
    private navigate: NavigateService
  ) { }   

  ngOnInit(): void {
    this.getData();
  }
  
  ngAfterViewInit() { 
    this.setSortAndPaginator();  
  }
  

  empFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.werknemers.filter = filterValue.trim().toLowerCase();
  }
    
  getData() {
    const fields = 'Id,FirstName,MiddleName,LastName,EmailHome__c,HomePhone,MobilePhone,Actief__c';
    this.subscriptions.push(this.api.getPortalData(this.data.contactObj, fields, undefined,`AccountId='${this.token.getAccount()}'`).subscribe(
      response => {
        this.werknemersArray = response
        console.log(response)
      },
      error => {
        this.dialog.open(HttpErrorComponent);
        this.data.errorText = 'Error: '+error.status+', '+error.statusText;
      },
      () => {
        this.werknemersArray.find(employee => {
          if (this.object.employeeActive(employee)) {
            this.inDienst.push(employee);
          } else {
            this.uitDienst.push(employee);
          }
        })
        this.werknemers = new MatTableDataSource(this.inDienst);
        this.setSortAndPaginator();
      }
    ));
  }

  setSortAndPaginator() {
    this.werknemers.paginator = this.paginator;
    this.werknemers.sort = this.sort;

    const sortState: Sort = {active: 'FirstName', direction: 'asc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
    this.changeDetectorRef.detectChanges();  
  }

  update(empId: any) {
    let obj = this.werknemers.filteredData
    let werknemer = this.object.findElementById(obj, empId)
    let formData = Object.assign({}, werknemer);
    this.object.removeNull(formData)

    this.subscriptions = [];

    this.updateDialog = this.dialog.open(EmployeeFormComponent, {
      data: { employee: formData },
      width: '80vw',
      height: '90vh',
      disableClose: true
    });

    this.subscriptions.push(this.updateDialog.afterClosed().subscribe(
      (data: Json) => { 
        if (data) {
          this.uitDienst = [];
          this.inDienst = [];
          this.getData();
        }
      }
    ));
  }

  read(id: string) {
    const myId = this.token.getContact();
    if (id === myId) {
      return this.navigate.to(`/mijn_dossier/${id}`);
    }
    return this.navigate.to(`/werknemer_dossier/${id}`);
  }

  new() {
    if (!this.subscriptions) {
      this.subscriptions = [];
    }

    this.newDialog = this.dialog.open(EmployeeFormComponent, {
      width: '80vw',
      height: '80vh',
      disableClose: true
    });

    this.subscriptions.push(this.newDialog.afterClosed().subscribe(
      (data: Json) => { }
    ));
  }

  show(filter: MatSelectChange) {
    let show: Json[] = []
    switch (filter.value) {
      case 'employed':
        show = this.inDienst;
        break;
      case 'notEmployed':
        show = this.uitDienst;
        break;            
      default:
        show = this.werknemersArray;
        break;     
    }

    this.werknemers = new MatTableDataSource(show);
    this.werknemers.paginator = this.paginator;
    this.werknemers.sort = this.sort;
  }
  
  openDialog(id: string) {    
    this.defaultDialog = this.dialog.open(ComingSoonComponent, {
      width: '80vw',
      height: '80vh',
      disableClose: true
    });
  }

  newExpense(id: string) {
    let emp: any
    let dialog = false;

    this.subscriptions.push(
      this.api.getPortalData(this.data.contactObj, this.data.contactFields, id).subscribe(
        response => {
          emp = response
        },
        error => {
          this.dialog.open(HttpErrorComponent);
          this.data.errorText = 'Error: '+error.status+', '+error.statusText;
        },
        () => {
          this.expenseDialog = this.dialog.open(ExpenseFormComponent, {
            data: {emp, dialog},
            width: '35%',
            disableClose: true
          });
      
          this.subscriptions.push(
            this.expenseDialog.afterClosed().subscribe(
              (data: Json) => { },
              
            )
          );  
        }  
      )
    )     
  }

  newLeave(id: string) {
    let emp: any
    let dialog = false;

    this.subscriptions.push(
      this.api.getPortalData(this.data.contactObj, this.data.contactFields, id).subscribe(
        response => {
          emp = response
        },
        error => {
          this.dialog.open(HttpErrorComponent);
          this.data.errorText = 'Error: '+error.status+', '+error.statusText;
        },
        () => {
          this.leaveDialog = this.dialog.open(LeaveFormComponent, {
            data: {emp, dialog},
            width: '35%',
            disableClose: true
          });
      
          this.subscriptions.push(
            this.leaveDialog.afterClosed().subscribe(
              (data: Json) => { },
              
            )
          );  
        }  
      )
    )  
  }

  newAbsenteeism(id: string) {
    let emp: any
    let dialog = false;

    this.subscriptions.push(
      this.api.getPortalData(this.data.contactObj, this.data.contactFields, id).subscribe(
        response => {
          emp = response
        },
        error => {
          this.dialog.open(HttpErrorComponent);
          this.data.errorText = 'Error: '+error.status+', '+error.statusText;
        },
        () => {
          this.absenteeismDialog = this.dialog.open(AbsenteeismFormComponent, {
            data: {emp, dialog},
            width: '35%',
            disableClose: true
          });
      
          this.subscriptions.push(
            this.absenteeismDialog.afterClosed().subscribe(
              (data: Json) => { },
              
            )
          );  
        }  
      )
    )     
  }

  ngOnDestroy() {
    this.sub.cleanUp(this.subscriptions);
  }

}
