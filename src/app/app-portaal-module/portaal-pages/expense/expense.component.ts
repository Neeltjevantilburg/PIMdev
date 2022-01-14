import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ComingSoonComponent } from 'src/app/app-shared-module/dialogs/coming-soon/coming-soon.component';
import { ExpenseViewComponent } from 'src/app/app-shared-module/dialogs/expense-view/expense-view.component';
import { Json } from 'src/app/shared/model/json';
import { ExpenseService } from 'src/app/_services/api/expense.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';

@Component({
  selector: 'pim-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.sass']
})
export class ExpenseComponent implements OnInit, AfterViewInit, OnDestroy {
  pageSize = "8";
  default = "employed";
  subscriptions?: Subscription[];
  defaultDialog?: MatDialogRef<ComingSoonComponent>;
  expenseViewDialog?: MatDialogRef<ExpenseViewComponent>;
  expensesColumns: string[] = ['naam','datum','bedrag','status','quickActions'];
  expenses!: MatTableDataSource<any>;
  expenseArray!: Json[];

  @ViewChild(MatPaginator)
    paginator!: MatPaginator;
  @ViewChild(MatSort)
    sort!: MatSort;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private sub: SubscriptionService,
    private expense: ExpenseService
  ) { }   

  ngOnInit(): void {
    this.expenseArray =  this.expense.getAllExpenses();
    this.expenses = new MatTableDataSource(this.expenseArray);
  }
  
  ngAfterViewInit() { 
    this.expenses.paginator = this.paginator;
    this.expenses.sort = this.sort;
  
    const sortState: Sort = {active: 'datum', direction: 'asc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
    this.changeDetectorRef.detectChanges();   
  }  

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.expenses.filter = filterValue.trim().toLowerCase();
  } 
  
  openDialog(id: string) {    
    this.defaultDialog = this.dialog.open(ComingSoonComponent, {
      width: '80vw',
      height: '80vh',
      disableClose: true
    });
  }

  check(id: string) {
    if (!this.subscriptions) {
      this.subscriptions = [];
    }
    let expense = this.expense.getExpenseById(id!);
    
    this.expenseViewDialog = this.dialog.open(ExpenseViewComponent, {
      data: {expense},
      width: '35%',
      disableClose: true
    });

    this.subscriptions.push(this.expenseViewDialog.afterClosed().subscribe(
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

