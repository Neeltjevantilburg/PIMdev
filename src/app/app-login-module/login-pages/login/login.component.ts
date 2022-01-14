import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HttpErrorComponent } from 'src/app/app-shared-module/dialogs/httpError/http-error.component';
import { Json } from 'src/app/shared/model/json';
import { NavigateService } from 'src/app/_services/navigate.service';
import { StyleService } from 'src/app/_services/style.service';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'pim-dashboard',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit, OnDestroy {
  myHeight!: Json
  public hide = true;
  public loginForm!: FormGroup;
  private sub: Subscription;

  constructor(
    public navigate: NavigateService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private style: StyleService,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.myHeight = this.style.loginContentHeight();

    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  };

  login() {
    const userName = this.loginForm.controls['userName'].value;
    const password = this.loginForm.controls['password'].value;

    this.sub = this.api.login(userName, password).subscribe(
      ( response: any ) => {
        localStorage.setItem('connection', response.token);
      },
      ( error: any ) => {
        console.log(error)
        if (error.error) {
          this.dialog.open(HttpErrorComponent, {data: {text: "Onbekend wachtwoord en/of gebruiksernaam"}});
        } else {
          this.dialog.open(HttpErrorComponent, {data: {text: `code: ${error.status}, tekst: ${error.statusText}`}});
        }
      },
      () => {   
        this.navigate.to('/home');
      }
      );
  };

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  };

}