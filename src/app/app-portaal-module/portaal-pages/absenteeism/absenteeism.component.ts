import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AbsenteeismFormComponent } from 'src/app/app-shared-module/dialogs/absenteeism-form/absenteeism-form.component';
import { AbsenteeismRecoveryComponent } from 'src/app/app-shared-module/dialogs/absenteeism-recovery/absenteeism-recovery.component';
import { AbsenteeismViewComponent } from 'src/app/app-shared-module/dialogs/absenteeism-view/absenteeism-view.component';
import { ComingSoonComponent } from 'src/app/app-shared-module/dialogs/coming-soon/coming-soon.component';
import { Json } from 'src/app/shared/model/json';
import { AbsenteeismService } from 'src/app/_services/api/absenteeism.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';

@Component({
  selector: 'pim-absenteeism',
  templateUrl: './absenteeism.component.html',
  styleUrls: ['./absenteeism.component.sass']
})
export class AbsenteeismComponent implements OnInit, AfterViewInit, OnDestroy {
  pageSize = "8";
  default = "employed";
  subscriptions?: Subscription[];
  absenteeismViewDialog?: MatDialogRef<AbsenteeismViewComponent>;
  absenteeismFormDialog?: MatDialogRef<AbsenteeismFormComponent>;
  recoveryDialog?: MatDialogRef<AbsenteeismRecoveryComponent>;
  absenteeismColumns: string[] = ['naam','eersteZiektedag','herstelDatum','status','quickActions'];
  absenteeism!: MatTableDataSource<any>;
  absenteeismArray!: Json[];

  @ViewChild(MatPaginator)
    paginator!: MatPaginator;
  @ViewChild(MatSort)
    sort!: MatSort;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private sub: SubscriptionService,
    private absenteeismService: AbsenteeismService
  ) { }   

  ngOnInit(): void {
    this.absenteeismArray =  this.absenteeismService.getAllAbsenteeism();
    
    this.absenteeism = new MatTableDataSource(this.absenteeismArray);
  }
  
  ngAfterViewInit() { 
    this.absenteeism.paginator = this.paginator;
    this.absenteeism.sort = this.sort;
  
    const sortState: Sort = {active: 'datum', direction: 'asc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
    this.changeDetectorRef.detectChanges();   
  }  

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.absenteeism.filter = filterValue.trim().toLowerCase();
  } 

  check(id: string) {
    if (!this.subscriptions) {
      this.subscriptions = [];
    }
    let absenteeism = this.absenteeismService.getAbsenteeismById(id!);
    
    this.absenteeismViewDialog = this.dialog.open(AbsenteeismViewComponent, {
      data: {absenteeism},
      width: '40%',
      disableClose: true
    });

    this.subscriptions.push(this.absenteeismViewDialog.afterClosed().subscribe(
      (data: Json) => { }
    ));
  }

  edit(id: string) {
    if (!this.subscriptions) {
      this.subscriptions = [];
    }
    let absenteeism = this.absenteeismService.getAbsenteeismById(id!);
    
    this.absenteeismFormDialog = this.dialog.open(AbsenteeismFormComponent, {
      data: {absenteeism: absenteeism, edit: true},
      width: '40%',
      disableClose: true
    });

    this.subscriptions.push(this.absenteeismFormDialog.afterClosed().subscribe(
      (data: Json) => { }
    ));
  }
  
  recovered(id: string) {
    let absenteeism = this.absenteeism.data.find(absenteeism => absenteeism.id === id);

    this.recoveryDialog = this.dialog.open(AbsenteeismRecoveryComponent, {
      data: { 
              absenteeism: absenteeism,
              edit: false
            },
      width: "20%",
      disableClose: true
    })
  }
  completed(status: string) {
    let complete = false;

    if (status === "Hersteld") {
      complete = true
    }

    return complete
  }

  ngOnDestroy() {
    this.sub.cleanUp(this.subscriptions);
  }

}



