import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { EmployeeFileService } from 'src/app/employee-file/employee-file.service';
import { Json } from 'src/app/shared/model/json';
import { ApiService } from 'src/app/_services/api.service';
import { DataService } from 'src/app/_services/data.service';
import { FormService } from 'src/app/_services/form.service';
import { ObjectService } from 'src/app/_services/object.service';
import { PicklistService } from 'src/app/_services/picklist.service';
import { StyleService } from 'src/app/_services/style.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import { TokenService } from 'src/app/_services/token.service';
import { HttpErrorComponent } from '../httpError/http-error.component';

@Component({
  selector: 'pim[employee-form]',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.sass']
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  customBackgroundColor: Json;
  sub!: Subscription[]
  employeeForm!: FormGroup;
  employee?: Json;
  fullName?: string;
  afdelingen!: Json[];
  managerIdPicklist: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {employee?: Json},
    private self: MatDialogRef<EmployeeFormComponent>,
    private form: FormService,
    private object: ObjectService,
    public picklist: PicklistService,
    private api: ApiService,
    private dataService: DataService,
    private dialog: MatDialog,
    private subService: SubscriptionService,
    private styleService: StyleService,
    private employeeFileService: EmployeeFileService,
    private tokenService: TokenService
  ) { }
  
  ngOnInit(): void {
    this.employeeForm = this.form.setEmployeeForm();
    if (this.data) {
      this.employee = this.data.employee;
      this.form.fillValues(this.employee!, this.employeeForm);
    }
    this.managerIdPicklist = this.employeeFileService.getManagerPicklistData();
    this.customBackgroundColor = this.styleService.getCustomBackgroundColor();
  }
   
  save() {
    this.sub = []

    let rawFormData = this.employeeForm.value;
    let formData = this.object.removeNull(rawFormData);

    if (this.data) {
      this.sub.push(
        this.api.updatePortalData(this.dataService.contactObj, this.data.employee!.Id, formData).subscribe(
          response => {},
          error => {
            this.dialog.open(HttpErrorComponent);
            this.dataService.errorText = 'Error: '+error.status+', '+error.statusText;
          },
          () => {
            this.self.close('update');
          }
        )
      )
    } else {
      const userName = this.employeeForm.get('EmailHome__c')!.value;
      this.employeeForm.value.Username__c = userName;
      this.employeeForm.value.RecordTypeId = '0122o0000007iYfAAI';
      this.employeeForm.value.AccountId = this.tokenService.getAccount();

      console.log(formData);

      this.sub.push(
        this.api.postPortalData(this.dataService.contactObj, formData).subscribe(
          response => {},
          error => {
            console.log(error)
            this.dialog.open(HttpErrorComponent);
            this.dataService.errorText = 'Error: '+error.status+', '+error.statusText;
          },
          () => {
            this.self.close();
          }
        )
      )
    }
  }

  ngOnDestroy() {
    this.subService.cleanUp(this.sub)
  }

}
