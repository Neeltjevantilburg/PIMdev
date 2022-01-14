import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ExpenseTableSource } from 'src/app/shared/model/expense-table-source';
import { ReloaderService } from 'src/app/shared/services/reloader.service';
import { ExpenseService } from 'src/app/_services/expense.service';
import { StyleService } from 'src/app/_services/style.service';
import { NewExpenseComponent } from '../new-expense/new-expense.component';
import { ViewExpenseComponent } from '../view-expense/view-expense.component';

@Component({
  selector: 'pim-expenses-table',
  templateUrl: './expenses-table.component.html',
  styleUrls: ['./expenses-table.component.sass']
})
export class ExpensesTableComponent implements OnInit, AfterViewInit, OnDestroy {
  tabStyle = {
    submitted : 'active',
    all : 'inactive'
  }
  view = 'submitted';  
  dataSource$: Observable<ExpenseTableSource[]>	
  dataSource = new MatTableDataSource<ExpenseTableSource>();
  tableColums: string[] = [];
  reloaderSubscription: Subscription;

  @Input()
    managerTable: boolean;

  @ViewChild(MatSort, { static: true }) 
    sort: MatSort;

  constructor(
    private expenseService: ExpenseService,
    private styleService: StyleService,
    private matDialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private reloaderService: ReloaderService
  ) { }

  ngOnInit(): void {
    this.setTableColumns();
    
    this.reloaderSubscription = this.reloaderService.reload$.subscribe(data => {
      this.dataSource$ = this.getExpenseDataSource();
      this.showExpenses();
      this.switchContent(this.view);
    });
  }
  
  ngAfterViewInit() {
    let sortState: Sort;
    if (this.managerTable) {
      sortState = {active: 'DateSubmitted__c', direction: 'asc'};
    } else {
      sortState = {active: 'CreatedDate', direction: 'desc'};    
    }
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.reloaderSubscription.unsubscribe();
  }

  getExpenseDataSource() {
      return this.expenseService.getTableSource(this.managerTable);
  }
  
  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  showSubmittedExpenses() {
    return this.dataSource$.pipe(
      take(1),
      map(expenses => expenses.filter(expense => expense.State__c === "Ingediend"))
    ).subscribe(expenses => {
        this.dataSource.data = expenses;
        this.dataSource.sort = this.sort;
    });
  }

  showAllExpenses() {
    return this.dataSource$.pipe(
      take(1)
    ).subscribe(expenses => {
      this.dataSource.data = expenses;
      this.dataSource.sort = this.sort;
    });
  }

  showExpenses() {
    if (this.managerTable) {
      this.showSubmittedExpenses();
    } else {
      this.showAllExpenses();
    }
  }

  setTableColumns() {
    if (this.managerTable) {
      this.tableColums = ['Employee_Contact__r.Name', 'Amount__c', 'DateSubmitted__c', 'State__c', 'managerMenu'];
    } else {
      this.tableColums = ['CreatedDate', 'Amount__c', 'State__c', 'dossierMenu'];
    }
  }

  switchContent(type: string) {
    this.styleService.setTabStyle(this.tabStyle, type);
    if (type === "all") {
      this.view = "all"
      this.showAllExpenses();
    } else {
      this.view = "submitted"
      this.showSubmittedExpenses();
    }
  }

  editExpense(id: string) {
    let dialog;
    dialog = this.matDialog.open(NewExpenseComponent, {
      data: {managerDialog: false, id},
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

  submitExpense(id: string) {
    this.expenseService.submitExpense(id).pipe(
      take(1)
    ).subscribe(data => {
      this.reloaderService.reloadData();
    });
  }

  viewExpense(id: string, managerDialog: boolean) {
    let dialog;

    dialog = this.matDialog.open(ViewExpenseComponent, {
      data: {managerDialog, id},
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

  approveExpense(approved: boolean, id: string) {
    this.expenseService.approveExpense(approved, id).pipe(
      take(1)
    ).subscribe(
      data => {
        if (data.success) {
          this.reloaderService.reloadData();
        }
      }
    )
  }

  deleteExpense(id: string) {
    this.expenseService.deleteExpense(id).pipe(
      take(1)
    ).subscribe(
      data => {
        if (data) {
          this.reloaderService.reloadData();
        }
      }
    )
  }
}
