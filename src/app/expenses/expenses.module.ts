import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageExpensesViewComponent } from './page-expenses-view/page-expenses-view.component';
import { ExpensesTableComponent } from './expenses-table/expenses-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ViewExpenseComponent } from './view-expense/view-expense.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NewExpenseComponent } from './new-expense/new-expense.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    PageExpensesViewComponent,
    ExpensesTableComponent,
    ViewExpenseComponent,
    NewExpenseComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSortModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  exports:[
    PageExpensesViewComponent,
    ExpensesTableComponent,
    NewExpenseComponent
  ]
})
export class ExpensesModule { }
