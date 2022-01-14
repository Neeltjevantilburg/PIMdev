
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators, } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { Json } from 'src/app/shared/model/json';
import { RoleService } from 'src/app/shared/services/role.service';
import { ApiService } from 'src/app/_services/api.service';
import { StyleService } from 'src/app/_services/style.service';
import { TokenService } from 'src/app/_services/token.service';
import { AbsenceListRowData } from '../page-absence-view/page-absence-view.component';

interface EmployeeContactPerson {
  Contactpersoon_beheren__c: string;
}

interface Employee {
  Id: string;
  FirstName: string;
  LastName: string;
}

interface EmployeeCreatesAbsence {
  employeeCreateAbsence: boolean;
}

@Component({
  selector: 'pim-absence-form-dialog',
  templateUrl: './absence-form-dialog.component.html',
  styleUrls: ['./absence-form-dialog.component.sass']
})
export class AbsenceFormDialogComponent implements OnInit {
  customColor: Json;

  absenceForm: FormGroup;
  showHours$: Observable<boolean>;
  showDays$: Observable<boolean>;
  employees$: Observable<Employee[]>;
  isManager$: Observable<boolean>;
  currentUserId: string;
  employeeAbsenceCreate: boolean;

  absenceType: string[] = [
    'Regulier',
    'ADV',
    'Bijzonder',
    'Onbetaald',
    'Overwerk'
  ];

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: AbsenceListRowData,
    private readonly apiService: ApiService,
    private readonly tokenService: TokenService,
    private readonly styleService: StyleService,
    private readonly roleService: RoleService,
  ) { }

  

  ngOnInit() {
    this.currentUserId = this.tokenService.getContact();
    this.isManager$ = this.roleService.isManager$;
    this.customColor = this.styleService.getCustomBackgroundColor();
    const accountId = this.tokenService.getAccount();

    this.employees$ = this.apiService.getPortalData(
      'Contact', 
      'Id,FirstName,LastName,Contactpersoon_beheren__c', 
      undefined, 
      `PIM_rollen__c='Medewerker' and AccountId='${accountId}'`
      );

    this.absenceForm = new FormGroup({
      employeeId: new FormControl('', []),
      absenceType: new FormControl('', [Validators.required]),
      absenceKind: new FormControl('hours', [Validators.required]),
      numberOfHours: new FormControl('', []),
      absenceDay: new FormControl('', []),
      absenceFirstDay: new FormControl('', []),
      absenceLastDay: new FormControl('', []),
      comments: new FormControl('')
    });

    this.showHours$ = this.absenceForm.controls.absenceKind.valueChanges.pipe(
      startWith(this.absenceForm.controls.absenceKind.value),
      map((x) => x === 'hours'),
    )

    this.showDays$ = this.absenceForm.controls.absenceKind.valueChanges.pipe(
      startWith(this.absenceForm.controls.absenceKind.value),
      map((x) => x === 'days'),
    )
  }

  async onSubmitClick(absenceState: string): Promise<void> {
    if (!this.absenceForm.valid) return;
    const formData = this.absenceForm.value;
    const managerId = await this.getManagerId(formData.employeeId)
    
    const createAbsenceData = this.apiService.postPortalData('Absence_Request__c', {
      EmployeeContactPerson__c: formData.employeeId ? formData.employeeId : this.currentUserId,
      Leave_Type__c: formData.absenceType,
      RecordTypeId: formData.absenceKind === 'days' ? '0122o0000007iY0AAI' : '0122o0000007iY2AAI',
      Number_of_Hours__c: formData.numberOfHours,
      Day_Start__c: formData.absenceFirstDay || undefined,
      Day_End__c: formData.absenceLastDay || undefined,
      Comments__c: formData.comments,
      Status__c: absenceState,
      Manager__c: managerId[0].Contactpersoon_beheren__c,
    });

    await createAbsenceData.pipe(
      take(1), 
    ).toPromise(); 
  }


  private getManagerId(employeeId: string): Promise<EmployeeContactPerson[]> {
    const Id = employeeId ? employeeId : this.currentUserId;
    return this.apiService.getPortalData(
      'Contact',
      'Contactpersoon_beheren__c',
      undefined,
      `Id='${Id}'`
    ).pipe(take(1)).toPromise();
  }

}
