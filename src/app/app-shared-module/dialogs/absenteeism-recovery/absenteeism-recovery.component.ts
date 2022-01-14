import { AfterContentInit, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Json } from 'src/app/shared/model/json';
import { ApiService } from 'src/app/_services/api.service';
import { DataService } from 'src/app/_services/data.service';
import { FormService } from 'src/app/_services/form.service';
import { ObjectService } from 'src/app/_services/object.service';
import { PicklistService } from 'src/app/_services/picklist.service';
import { HttpErrorComponent } from '../httpError/http-error.component';

@Component({
  selector: 'pim[absenteeism-recovery]',
  templateUrl: './absenteeism-recovery.component.html',
  styleUrls: ['./absenteeism-recovery.component.sass']
})
export class AbsenteeismRecoveryComponent implements OnInit, AfterContentInit {
  subs?: Subscription[]
  selected: string | null = null;
  select?: { value: string, viewValue: string}[]
  absenteeismForm!: FormGroup;
  absenteeismData?: Json;
  employee: Json | undefined;
  employeeId?: string | null | undefined;
  managerId?: string | null | undefined;
  edit = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {emp?: Json, absenteeism?: Json, edit: boolean},
    private self: MatDialogRef<AbsenteeismRecoveryComponent>,
    private form: FormService,
    public picklist: PicklistService,
    private cdRef: ChangeDetectorRef,
    private api: ApiService,
    private dataService: DataService,
    private dialog: MatDialog
  ) {
    this.employee = this.data.emp
    this.employeeId = this.employee?.Id
    this.managerId = this.employee?.manager
    this.edit = this.data.edit
  }
  
  ngOnInit(): void {
    this.absenteeismForm = this.form.setRecoveryForm();
  }

  ngAfterContentInit() {
    if (this.data.absenteeism) {
      this.absenteeismData = this.data.absenteeism
      this.form.fillValues(this.absenteeismData!, this.absenteeismForm);
      this.cdRef.detectChanges();
    }
  }
  
  sendForm() {
    this.subs = []
    let formData = this.absenteeismForm.value;
    
    let id = this.absenteeismData!.Employee_Contact__c;

    this.subs!.push(
      this.api.updatePortalData(this.dataService.absenteeismObj, id, formData).subscribe(
        response => {},
        error => {
          this.dialog.open(HttpErrorComponent);
          this.dataService.errorText = 'Error: '+error.status+', '+error.statusText;
        },
        () => {
          this.self.close();      
        }
      )
    ) 
    
    this.self.close(formData);
  }

  close() {
    this.self.close();
  }

}
