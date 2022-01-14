import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { Json } from 'src/app/shared/model/json';
import { ApiService } from 'src/app/_services/api.service';
import { DataService } from 'src/app/_services/data.service';
import { FormService } from 'src/app/_services/form.service';
import { ObjectService } from 'src/app/_services/object.service';
import { PicklistService } from 'src/app/_services/picklist.service';
import { TokenService } from 'src/app/_services/token.service';
import { HttpErrorComponent } from '../httpError/http-error.component';

@Component({
  selector: 'pim[leave-form]',
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.sass']
})
export class LeaveFormComponent implements OnInit {
  loaded = false
  subs?: Subscription[]
  select?: { value: Json, viewValue: string}[]
  leaveForm!: FormGroup;
  employee: Json | undefined;
  employeeId?: string | null | undefined;
  managerId?: string | null | undefined;
  dialog: boolean;
  fewHours = false;
  allDay = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {emp?: Json, dialog: boolean},
    private self: MatDialogRef<LeaveFormComponent>,
    private form: FormService,
    private object: ObjectService,
    public picklist: PicklistService,
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
    this.leaveForm = this.form.setLeaveForm();
    if (!this.employee) {
      this.subs = []
      let list: any
      
      this.subs.push(
        this.api.getPortalData(this.dataService.contactObj, this.dataService.contactFields, undefined, `PIM_rollen__c='Medewerker' and AccountId='${this.token.getAccount()}'`).subscribe(
          response => {
            list = response
          },
          error => {
            this.matDialog.open(HttpErrorComponent);
            this.dataService.errorText = 'Error: '+error.status+', '+error.statusText;
          },
          () => {
            this.select = this.picklist.quickActions(list);
            this.leaveForm.addControl('employees', new FormControl(''));
            this.loaded = true
          }
        )
      )
    } else {
      this.loaded = true
    }
  }

  leaveType(event: MatSelectChange) {
    let form = this.leaveForm

    switch (event.value) {
      case "0122o0000007iY0AAI":
        this.allDay = true
        this.fewHours = false;
        form.addControl('Day_Start__c', new FormControl(''));
        form.addControl('Day_End__c', new FormControl(''));
        if (form.contains('Day__c')) {
          form.removeControl('Day__c');
        }        
        break;
      case "0122o0000007iY2AAI":
        this.fewHours = true;
        this.allDay = false;
        form.addControl('Day__c', new FormControl(''));
        if (form.contains('Day_Start__c')) {
          form.removeControl('Day_Start__c');
        }
        if (form.contains('Day_End__c')) {
          form.removeControl('Day_End__c');
        }
        break;        
      default:
        this.allDay = false
        this.fewHours = true;
        form.addControl('Day__c', new FormControl(''));
        if (form.contains('Day_Start__c')) {
          form.removeControl('Day_Start__c');
        }
        if (form.contains('Day_End__c')) {
          form.removeControl('Day_End__c');
        }
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
    let rawFormData = this.leaveForm.value;
    let formData = this.object.removeNull(rawFormData);
    let employeeId: string | null | undefined;
    let managerId: string | null | undefined;
    
    if (rawFormData.RecordTypeId === "0122o0000007iY0AAI" || rawFormData.RecordTypeId === "default" ) {
      rawFormData.All_Day__c = true
    }

    if (rawFormData.RecordTypeId === "0122o0000007iY2AAI" || rawFormData.RecordTypeId === "default" ) {
      rawFormData.Day_Start__c = rawFormData.Day__c;
      rawFormData.Day_End__c = rawFormData.Day__c;
    }

    if (rawFormData.RecordTypeId === "default") {
      delete rawFormData.Day__c
    }

    if (this.employee) {
      employeeId = this.employeeId
      managerId = this.managerId
    } else {
      employeeId = rawFormData.employees.employeeId
      managerId =  rawFormData.employees.managerId
      delete rawFormData.employees
      quickMenu = true
    }

    if (!save && ( this.dialog || quickMenu ) ) {
      rawFormData.State__c = 'Approved';
      // rawFormData.DateSubmitted__c = new Date();
      // rawFormData.DateApproved__c = new Date();
    } else if (!save) {
      rawFormData.State__c = 'Pending Approval';
      // rawFormData.DateSubmitted__c = new Date();
    } else {
      rawFormData.State__c = 'Not Submitted';      
    }
    
    rawFormData.EmployeeContactPerson__c = employeeId;
    rawFormData.Goedkeurend_Persoon__c = managerId;
    
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

}
