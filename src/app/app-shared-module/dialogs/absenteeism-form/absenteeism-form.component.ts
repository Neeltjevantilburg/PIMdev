import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
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
  selector: 'pim[absenteeism-form]',
  templateUrl: './absenteeism-form.component.html',
  styleUrls: ['./absenteeism-form.component.sass']
})
export class AbsenteeismFormComponent implements OnInit, AfterContentInit, OnDestroy {
  loaded = false
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
    private self: MatDialogRef<AbsenteeismFormComponent>,
    private form: FormService,
    private object: ObjectService,
    public picklist: PicklistService,
    private cdRef: ChangeDetectorRef,
    private api: ApiService,
    private dataService: DataService,
    private dialog: MatDialog,
    private subService: SubscriptionService,
    private token: TokenService
  ) {
    this.employee = this.data.emp
    this.employeeId = this.employee?.Id
    this.managerId = this.employee?.manager
    this.edit = this.data.edit
  }
  
  ngOnInit(): void {
    this.absenteeismForm = this.form.setAbsenteeismForm();
    if (!this.employee) {
      this.subs = []
      let list: any
      
      this.subs.push(
        this.api.getPortalData(this.dataService.contactObj, this.dataService.contactFields, undefined, `PIM_rollen__c='Medewerker'and AccountId='${this.token.getAccount()}'`).subscribe(
          response => {
            list = response
          },
          error => {
            this.dialog.open(HttpErrorComponent);
            this.dataService.errorText = 'Error: '+error.status+', '+error.statusText;
          },
          () => {
            this.select = this.picklist.absenteeismEmployee(list);
            this.absenteeismForm.addControl('employees', new FormControl(''));
            this.loaded = true   
          }
        )
      )      
    } else {
      this.loaded = true
    }
  }

  ngAfterContentInit() {
    if (this.data.absenteeism) {
      this.absenteeismData = this.data.absenteeism
      this.selected = this.absenteeismData.Employee_Contact__c
      this.form.fillValues(this.absenteeismData!, this.absenteeismForm);
      this.absenteeismForm.get('employees')!.setValue(this.absenteeismData.Employee_Contact__c);
      this.cdRef.detectChanges();
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
  
  sendForm() {
    let rawFormData = this.absenteeismForm.value;
    let formData = this.object.removeNull(rawFormData);
    let employeeId: string | null | undefined;

    if (this.employee) {
      employeeId = this.employeeId;
    } else {
      employeeId = rawFormData.employees;
      delete rawFormData.employees;
    }
    
    rawFormData.Employee_Contact__c = employeeId;

    this.subs!.push(
      this.api.postPortalData(this.dataService.absenteeismObj, formData).subscribe(
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
  }

  close() {
    this.self.close();
  }

  ngOnDestroy() {
    this.subService.cleanUp(this.subs!)
  }

}
