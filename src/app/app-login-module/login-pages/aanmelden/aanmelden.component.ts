import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PicklistService } from 'src/app/_services/picklist.service';
import { ValidatorService } from 'src/app/_services/validator.service';
import { NavigateService } from 'src/app/_services/navigate.service';
import { Subscription } from 'rxjs';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import { LoadingComponent } from 'src/app/app-shared-module/dialogs/loading/loading.component';
import { ConfirmComponent } from 'src/app/app-shared-module/dialogs/confirm/confirm.component';
import { Json } from 'src/app/shared/model/json';
import { StyleService } from 'src/app/_services/style.service';
import { RedirectComponent } from 'src/app/app-shared-module/dialogs/redirect/redirect.component';
import { FormService } from 'src/app/_services/form.service';
import { ApiService } from 'src/app/_services/api.service';
import { HttpErrorComponent } from 'src/app/app-shared-module/dialogs/httpError/http-error.component';


@Component({
  selector: 'pim-aanmelden',
  templateUrl: './aanmelden.component.html',
  styleUrls: ['./aanmelden.component.sass']
})
export class AanmeldenComponent implements OnInit, OnDestroy {
  myHeight!: Json;
  registryForm!: FormGroup;
  loadingDialog?: MatDialogRef<LoadingComponent>;
  redirectDialog?: MatDialogRef<RedirectComponent>;
  sub!: Subscription[]

  MockData = {
    Company: 'Explore Company',
    Street: 'Tijdelijkestraat 12',
    PostalCode: '4000 AA',
    City: 'Fictiedorp',
    Salutation: 'Dhr.',
    FirstName: 'Aron',
    MiddleName: "'s",
    LastName: 'Kelk',
    Email: 'Aronskelk@explore.nu',
    Phone: '0123 456 789',
    MobilePhone: '06 123 456 78'
  }

  constructor(
    public picklist: PicklistService,
    public navigate: NavigateService,
    private validate: ValidatorService,
    private dialog: MatDialog,
    private subscription: SubscriptionService,
    private style: StyleService,
    private form: FormService,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.myHeight = this.style.loginContentHeight();
    this.registryForm = this.form.setRegistryForm();
    // temp data
    // this.registryForm.patchValue(this.MockData)
    // temp data
  }

  displayErrorMessage(field: string) {
    return this.validate.getErrorMessage(
      this.registryForm,
      field,
      null,
      'PostalCode',
      null,
      'Phone',
      'MobilePhone'
    );
  }

  confirmRegistry() {
    this.sub = [];
    let confirmDialog = this.dialog.open(
      ConfirmComponent, {
        data: this.registryForm.value,
        width: '30%',
        height: '48%',
        disableClose: true
      }
    );
    
    this.sub.push(
      confirmDialog.afterClosed().subscribe(
        result => {
          if (result === 'confirm') {
            this.loadingDialog = this.dialog.open(LoadingComponent, { disableClose: true, data: {text: "Uw gegevens worden verwerkt"} })
            this.sendForm();
          }
        }
      )
    );
  }

  sendForm() {
    this.registryForm.value.RecordTypeId = '0122o0000007iZ9AAI';
    this.registryForm.value.Status = 'Nieuw';
    this.registryForm.value.Country = 'Nederland';

    let body: any = this.registryForm.value;

    this.sub.push(
      this.api.postRegistration(body).subscribe(
        (response: any) => {
          this.loadingDialog!.close();
        },
        (error: any) => {
          this.dialog.open(HttpErrorComponent, {data: {text: `code: ${error.status}, text: ${error.statusText}`}});
        },
        () => {
          this.navigate.to('/login');
        }
      )
    );
    // setTimeout(() => {
    //   this.loadingDialog!.close();
    //   this.redirectDialog = this.dialog.open(
    //     RedirectComponent, {
    //       disableClose: true
    //     }
    //   );
    //   setTimeout(() => {
    //     this.redirectDialog!.close();
    //     this.navigate.to('login')
    //   }, 2500);
    // }, 1500);
  }

  ngOnDestroy() {
    this.subscription.cleanUp(this.sub);
  }

}
