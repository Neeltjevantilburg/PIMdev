import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { FileModel } from 'src/app/shared/model/file-model';
import { ExpenseService } from 'src/app/_services/expense.service';
import { FileService } from 'src/app/shared/services/file.service';

@Component({
  selector: 'pim-view-expense',
  templateUrl: './view-expense.component.html',
  styleUrls: ['./view-expense.component.sass']
})
export class ViewExpenseComponent implements OnInit {
  expenseData$: Observable<any>
  attachedFile?: FileModel
  myFile = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: {managerDialog: boolean, id: string},
    private self: MatDialogRef<ViewExpenseComponent>,
    private expenseService: ExpenseService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.expenseData$ = this.expenseService.getExpenseData(this.data.id);
    this.checkForFile(this.data.id);
  }

  handleExpense(approved: boolean) {
    this.expenseService.approveExpense(approved, this.data.id).pipe(
      take(1)
    ).subscribe(
      data => this.self.close(data)
    );
  }

  viewFile(id: string) {
    let splitArray = this.attachedFile!.Title.split('.');
    let name = splitArray[0];
    let type = splitArray[1];

    this.fileService.downloadOrViewFile(false, id, name, type);
  }

  checkForFile(id: string) {
    this.expenseService.checkForAndGetExpenseFiles(id).pipe(
      take(1)
    ).subscribe(
      data => this.attachedFile = data[0],
      error => this.attachedFile = undefined
    );
  }

}
