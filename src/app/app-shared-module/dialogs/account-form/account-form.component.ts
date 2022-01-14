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
  selector: 'pim[account-form]',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.sass']
})
export class AccountFormComponent implements OnInit, AfterContentInit, OnDestroy {
  subs?: Subscription[]
  selected: string | null = null;
  select?: { value: string, viewValue: string}[]
  accountForm!: FormGroup;
  accountData?: Json;
  edit = false;

  constructor(
    private self: MatDialogRef<AccountFormComponent>,
    private form: FormService,
    private object: ObjectService,
    public picklist: PicklistService,
    private cdRef: ChangeDetectorRef,
    private api: ApiService,
    private dataService: DataService,
    private dialog: MatDialog,
    private subService: SubscriptionService,
    private token: TokenService
  ) { }
  
  ngOnInit(): void {
    this.accountForm = this.form.setAccountForm();
  }

  ngAfterContentInit() {
      this.accountData = JSON.parse(localStorage.getItem('AccountData')!)
      this.object.removeNull(this.accountData)

      this.form.fillValues(this.accountData!, this.accountForm);
      this.cdRef.detectChanges();
  }
  
  sendForm() {
    this.subs = [];
    let rawFormData = this.accountForm.value;
    let formData = this.object.removeNull(rawFormData);
    delete formData.Id

    this.subs!.push(
      this.api.updatePortalData(this.dataService.accountObj, this.token.getAccount(),formData).subscribe(
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
