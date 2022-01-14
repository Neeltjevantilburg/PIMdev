import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Json } from 'src/app/shared/model/json';
import { ApiService } from 'src/app/_services/api.service';
import { DataService } from 'src/app/_services/data.service';
import { FormService } from 'src/app/_services/form.service';
import { ObjectService } from 'src/app/_services/object.service';
import { PicklistService } from 'src/app/_services/picklist.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import { TokenService } from 'src/app/_services/token.service';
import { HttpErrorComponent } from '../httpError/http-error.component';

@Component({
  selector: 'pim[expense-form]',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.sass']
})
export class ExpenseFormComponent implements OnInit, OnDestroy {
  loaded = false
  subs?: Subscription[]
  select?: { value: Json, viewValue: string}[]
  expenseForm!: FormGroup;
  employee: Json | undefined;
  employeeId?: string | null | undefined;
  managerId?: string | null | undefined;
  dialog: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {emp?: Json, dialog: boolean},
    private self: MatDialogRef<ExpenseFormComponent>,
    private form: FormService,
    private object: ObjectService,
    private picklist: PicklistService,
    private subService: SubscriptionService,
    private api: ApiService,
    private dataService: DataService,
    private matDialog: MatDialog,
    private token: TokenService
  ) {
    this.employee = this.data.emp
    this.employeeId = this.employee?.Id
    this.managerId = this.employee?.manager
    this.dialog = this.data.dialog
  }
  
  ngOnInit(): void {
    this.expenseForm = this.form.setExpenseForm();
    if (!this.employee) {
      this.subs = []
      let list: any
      
      this.subs.push(
        this.api.getPortalData(this.dataService.contactObj, this.dataService.contactFields, undefined, `PIM_rollen__c='Medewerker'and AccountId='${this.token.getAccount()}'`).subscribe(
          response => {
            list = response
          },
          error => {
            this.matDialog.open(HttpErrorComponent);
            this.dataService.errorText = 'Error: '+error.status+', '+error.statusText;
          },
          () => {
            this.select = this.picklist.quickActions(list);
            this.expenseForm.addControl('employees', new FormControl(''));
            this.loaded = true      
          }
        )
      )
    } else {
      this.loaded = true      
    }
  }

  empOrSelect() {
    let emp: boolean;

    if (!this.employee) {
      emp = false;
    } else {
      emp = true
    }

    return emp;
  }
  
  sendForm(save: boolean) {
    let quickMenu = false;
    let rawFormData = this.expenseForm.value;
    let formData = this.object.removeNull(rawFormData);
    let employeeId: string | null | undefined;
    let managerId: string | null | undefined;

    if (this.employee) {
      employeeId = this.employeeId;
      managerId = this.managerId;
    } else {
      employeeId = rawFormData.employees.employeeId;
      managerId =  rawFormData.employees.managerId;
      delete rawFormData.employees;
      quickMenu = true;
    }

    if (!save && ( this.dialog || quickMenu ) ) {
      rawFormData.State__c = 'Approved';
      rawFormData.DateSubmitted__c = new Date();
      rawFormData.DateApproved__c = new Date();
    } else if (!save) {
      rawFormData.State__c = 'Pending Approval';
      rawFormData.DateSubmitted__c = new Date();
    } else {
      rawFormData.State__c = 'Not Submitted';      
    }
    
    rawFormData.Employee_Contact__c = employeeId;
    rawFormData.Manager__c = managerId;

    this.subs!.push(
      this.api.postPortalData(this.dataService.expenseObj, formData).subscribe(
        response => {},
        error => {
          this.matDialog.open(HttpErrorComponent);
          this.dataService.errorText = 'Error: '+error.status+', '+error.statusText;
        },
        () => {
          this.self.close();      
        }
      )
    )
  }

  close() {
    this.self.close();
  }

  ngOnDestroy() {
    this.subService.cleanUp(this.subs!)
  }

}
