import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { AbsenceFormDialogComponent } from 'src/app/absence/absence-form-dialog/absence-form-dialog.component';
import { ComingSoonComponent } from 'src/app/app-shared-module/dialogs/coming-soon/coming-soon.component';
import { EmployeeFormComponent } from 'src/app/app-shared-module/dialogs/employee-form/employee-form.component';
import { Json } from 'src/app/shared/model/json';
import { RoleService } from 'src/app/shared/services/role.service';
import { PageService } from 'src/app/_services/page.service';
import { StyleService } from 'src/app/_services/style.service';
import { TokenService } from 'src/app/_services/token.service';

@Component({
  selector: 'pim-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.sass']
})
export class SideMenuComponent implements OnInit {
  @Input()
    customBackgroundColor: Json;
  btnStyleSubscription: Subscription;
  btnStyle = {
    home: { icon: {}, text: {} },
    werknemers: { icon: {}, text: {} },
    mijn_dossier: { icon: {}, text: {} },
    handleiding: { icon: {}, text: {}},
    salarisadministratie: { icon: {}, text: {} },
    faq: { icon: {}, text: {} }
  };
  myId: string
  isManager$: Observable<boolean>;
  
  constructor(
    private dialog: MatDialog,
    private styleService: StyleService,
    private pageService: PageService,
    private tokenService: TokenService,
    private roleService: RoleService
  ) { 
    this.myId = this.tokenService.getContact();
  }

  ngOnInit(): void {
    this.isManager$ = this.roleService.isManager$;

    this.styleService.setBtnStyle(this.btnStyle, this.pageService.url(true), this.customBackgroundColor);
    this.btnStyleSubscription = this.pageService.observable.subscribe(
      (page: any) => {        
        this.styleService.setBtnStyle(this.btnStyle, this.pageService.url(true, page.url), this.customBackgroundColor);
      }
    );
  }

  newEmployee() {
    this.dialog.open(EmployeeFormComponent, {
      width: '50vw',
      disableClose: true
    });
  }

  newContract() {
    this.dialog.open(ComingSoonComponent, {
      width: '80vw',
      height: '80vh',
      disableClose: true
    });
  }

  createAbsence() {
    this.dialog.open(AbsenceFormDialogComponent)
  }

}
