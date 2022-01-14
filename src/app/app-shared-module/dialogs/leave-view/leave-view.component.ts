import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Json } from 'src/app/shared/model/json';

@Component({
  selector: 'pim[leave-view]',
  templateUrl: './leave-view.component.html',
  styleUrls: ['./leave-view.component.sass']
})
export class LeaveViewComponent implements OnInit {
  leave: Json | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {leave?: Json},
    private self: MatDialogRef<LeaveViewComponent>
  ) {
    this.leave = this.data.leave
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

    if (this.leave!.status === "ingediend") {
      complete = false
    }

    return complete
  }

  close() {
    this.self.close();
  }

}
