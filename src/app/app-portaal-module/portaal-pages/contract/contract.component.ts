import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ComingSoonComponent } from 'src/app/app-shared-module/dialogs/coming-soon/coming-soon.component';
import { Json } from 'src/app/shared/model/json';
import { ContractService } from 'src/app/_services/api/contract.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';

@Component({
  selector: 'pim-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.sass']
})
export class ContractComponent implements OnInit, AfterViewInit, OnDestroy {
  pageSize = "8";
  default = "employed";
  subscriptions?: Subscription[];
  defaultDialog?: MatDialogRef<ComingSoonComponent>;
  contractColumns: string[] = ['naam','signaleringsDatum','datumEindeProeftijd','datumEindeContract','type','quickActions'];
  contract!: MatTableDataSource<any>;
  contractArray!: Json[];

  @ViewChild(MatPaginator)
    paginator!: MatPaginator;
  @ViewChild(MatSort)
    sort!: MatSort;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private sub: SubscriptionService,
    private contractService: ContractService
  ) { }   

  ngOnInit(): void {
    this.contractArray =  this.contractService.getAllContracts();
    
    this.contract = new MatTableDataSource(this.contractArray);
  }
  
  ngAfterViewInit() { 
    this.contract.paginator = this.paginator;
    this.contract.sort = this.sort;
  
    const sortState: Sort = {active: 'datum', direction: 'asc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
    this.changeDetectorRef.detectChanges();   
  }  

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.contract.filter = filterValue.trim().toLowerCase();
  } 
  
  openDialog(id: string) {
    this.defaultDialog = this.dialog.open(ComingSoonComponent, {
      width: '80vw',
      height: '80vh',
      disableClose: true
    });
  }  

  ngOnDestroy() {
    this.sub.cleanUp(this.subscriptions);
  }

}




