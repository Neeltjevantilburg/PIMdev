import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Json } from 'src/app/shared/model/json';
import { AbsenteeismRecoveryComponent } from '../absenteeism-recovery/absenteeism-recovery.component';

@Component({
  selector: 'pim[absenteeism-view]',
  templateUrl: './absenteeism-view.component.html',
  styleUrls: ['./absenteeism-view.component.sass']
})
export class AbsenteeismViewComponent implements OnInit {
  absenteeism: Json | undefined;
  recoveryDialog?: MatDialogRef<AbsenteeismRecoveryComponent>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {absenteeism?: Json},
    private self: MatDialogRef<AbsenteeismViewComponent>,
    private dialog: MatDialog
  ) {
    this.absenteeism = this.data.absenteeism
  }
  
  ngOnInit(): void { }

  completed() {
    let complete = true;

    if (this.absenteeism!.Status_Ziekmelding__c === "Hersteld") {
      complete = false
    }

    return complete
  }

  recovered() {
    this.recoveryDialog = this.dialog.open(AbsenteeismRecoveryComponent, {
      data: { 
              absenteeism: this.absenteeism,
              edit: false
            },
      width: "20%",
      disableClose: true
    })
  }

  close() {
    this.self.close();
  }

}
