import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { Json } from 'src/app/shared/model/json';
import { ReloaderService } from 'src/app/shared/services/reloader.service';
import { StyleService } from 'src/app/_services/style.service';
import { NewExpenseComponent } from '../new-expense/new-expense.component';

@Component({
  selector: 'pim-page-expenses-view',
  templateUrl: './page-expenses-view.component.html',
  styleUrls: ['./page-expenses-view.component.sass']
})
export class PageExpensesViewComponent implements OnInit {
  managerTable = true;
  customBackgroundColor: Json;

  constructor(
    private styleService: StyleService,
    private matDialog: MatDialog,
    private reloaderService: ReloaderService
  ) { 
    this.customBackgroundColor = this.styleService.getCustomBackgroundColor();
  }

  ngOnInit(): void { }

  newExpense() {
    let dialog;
    dialog = this.matDialog.open(NewExpenseComponent, {
      data: {managerDialog: true},
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
