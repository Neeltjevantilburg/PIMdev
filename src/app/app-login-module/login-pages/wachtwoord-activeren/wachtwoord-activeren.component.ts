import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Subscription } from 'rxjs';
import { Json } from 'src/app/shared/model/json';
import { NavigateService } from 'src/app/_services/navigate.service';
import { StyleService } from 'src/app/_services/style.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import { ValidatorService } from 'src/app/_services/validator.service';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'pim-wachtwoord-activeren',
  templateUrl: './wachtwoord-activeren.component.html',
  styleUrls: ['./wachtwoord-activeren.component.sass']
})
export class WachtwoordActiverenComponent implements OnInit, OnDestroy {
  myHeight!: Json
  subscriptions!: Subscription[]
  snapshot: ActivatedRouteSnapshot;
  passwordForm!: FormGroup;
  userName!: string;
  forget!: string;
  set: boolean = true;
  hide = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private validate: ValidatorService,
    private navigate: NavigateService,
    private sub: SubscriptionService,
    private style: StyleService,
    private api: ApiService
  ) { 
    this.snapshot = this.activatedRoute.snapshot;
  }

  ngOnInit(): void {
    this.myHeight = this.style.loginContentHeight();

    this.userName = this.snapshot.queryParams.email || 'user@company.test';
    this.forget = this.snapshot.queryParams.forget;
    if (this.forget != undefined) {
      this.set = false;
    }
    localStorage.setItem('code', this.snapshot.queryParams.code || null);

    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.validate.passwordRegex)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validator: this.MustMatch('password', 'confirmPassword')
    })
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
  }

  displayErrorMessage(field: string) {
    return this.validate.getErrorMessage(
      this.passwordForm,
      field,
      'password'
    );
  }

  sendForm() {
    this.subscriptions = [];
    let pass: string = this.passwordForm.controls['password'].value;
    let codeParam: string | null = localStorage.getItem('code');
    let forgetParam: string | null = localStorage.getItem('forget');
    let body: any = { Password: `${pass}`};

    if (codeParam != null) {
      localStorage.removeItem('code');
      if (forgetParam != null) {
        this.set = false;
      }
      return this.subscriptions.push(this.api.setPassword(body, codeParam, this.set).subscribe(
        (response: any) => {},
        (error: any) => {
          console.log(error)
        },
        () => {
          this.navigate.to('/login');
        })
      );
    }
    localStorage.removeItem('code');
    return
  }

  ngOnDestroy() {
    this.sub.cleanUp(this.subscriptions);
  }

}
