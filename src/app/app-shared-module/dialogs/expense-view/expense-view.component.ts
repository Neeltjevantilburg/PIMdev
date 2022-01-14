import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Json } from 'src/app/shared/model/json';

@Component({
  selector: 'pim[expense-view]',
  templateUrl: './expense-view.component.html',
  styleUrls: ['./expense-view.component.sass']
})
export class ExpenseViewComponent implements OnInit {
  expense: Json | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {expense?: Json},
    private self: MatDialogRef<ExpenseViewComponent>
  ) {
    this.expense = this.data.expense
  }
  
  ngOnInit(): void { }

  approved(approved: boolean) {
    if (approved) {

    } else {

    }
    this.self.close();
  }

  completed() {
    let complete = true;

    if (this.expense!.status === "ingediend") {
      complete = false
    }

    return complete
  }

  close() {
    this.self.close();
  }

}
