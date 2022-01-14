import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Json } from 'src/app/shared/model/json';
import { ApiService } from 'src/app/_services/api.service';
import { NavigateService } from 'src/app/_services/navigate.service';
import { StyleService } from 'src/app/_services/style.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';

@Component({
  selector: 'pim-wachtwoord-vergeten',
  templateUrl: './wachtwoord-vergeten.component.html',
  styleUrls: ['./wachtwoord-vergeten.component.sass']
})
export class WachtwoordVergetenComponent implements OnInit, OnDestroy {
  myHeight!: Json
  resetForm!: FormGroup;
  subscriptions!: Subscription[]

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private navigate: NavigateService,
    private sub: SubscriptionService,
    private style: StyleService
  ) { }

  ngOnInit(): void {
    this.myHeight = this.style.loginContentHeight();

    this.resetForm = this.formBuilder.group({
      Username: ['', [Validators.required]]
    })
  }

  resetPass() {
    this.subscriptions = [];

    let userName = this.resetForm.controls['Username'].value;

    this.subscriptions.push(this.api.resetPassword(userName).subscribe(
      (response: any) => {

       },
      (error: any) => {

      },
      () => {
        this.navigate.to('/login');
      })
    );
  }

  ngOnDestroy() {
    this.sub.cleanUp(this.subscriptions);
  }

}
