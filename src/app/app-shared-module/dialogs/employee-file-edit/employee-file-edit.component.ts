import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { Contact } from 'src/app/shared/model/contact';
import { EditEmployee } from 'src/app/shared/model/edit-employee';
import { EmployeeWeekSchedule } from 'src/app/shared/model/employee-week-schedule';
import { Issued } from 'src/app/shared/model/issued';
import { Json } from 'src/app/shared/model/json';
import { PicklistItem } from 'src/app/shared/model/picklistItem';
import { ApiService } from 'src/app/_services/api.service';
import { PicklistService } from 'src/app/_services/picklist.service';
import { StyleService } from 'src/app/_services/style.service';

@Component({
  selector: 'pim[employee-file-edit]',
  templateUrl: './employee-file-edit.component.html',
  styleUrls: ['./employee-file-edit.component.sass']
})
export class EmployeeFileEditComponent implements OnInit, OnDestroy {
  customBackgroundColor: Json;
  view: string;
  editName!: string;
  employeeId!: string;
  weekScheduleId!: string;
  evenWeekScheduleId!: string;
  unevenWeekScheduleId!: string;
  employee$!: Observable<Contact>;
  companyCar$?: Observable<Issued | undefined>;
  companyPhone$?: Observable<Issued | undefined>;
  weekSchedule$?: Observable<EmployeeWeekSchedule | undefined>;
  evenWeekSchedule$?: Observable<EmployeeWeekSchedule | undefined>;
  unevenWeekSchedule$?: Observable<EmployeeWeekSchedule | undefined>;
  employeeEditForm!: FormGroup;
  carEditForm!: FormGroup;
  phoneEditForm!: FormGroup;
  weekScheduleEditForm!: FormGroup;
  unevenWeekScheduleEditForm!: FormGroup;
  evenWeekScheduleEditForm!: FormGroup;
  subscriptions: Subscription[] = [];
  departments: PicklistItem[] = [];
  managers: PicklistItem[] = [];
  newCar = false;
  newPhone = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: EditEmployee,
    private self: MatDialogRef<EmployeeFileEditComponent>,
    private styleService: StyleService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    public picklistService: PicklistService
  ) {
    this.view = data.view;
    this.customBackgroundColor = this.styleService.getCustomBackgroundColor();
   }
  
  ngOnInit() {
    this.employee$ = this.data.employee$;
    if (this.data.companyPhone$) {
      this.companyPhone$ = this.data.companyPhone$;
    }
    if (this.data.companyCar$) {
      this.companyCar$ = this.data.companyCar$;
    }
    if (this.data.weekSchedule$) {
      this.weekSchedule$ = this.data.weekSchedule$;
    }
    if (this.data.evenWeekSchedule$) {
      this.evenWeekSchedule$ = this.data.evenWeekSchedule$;
    }
    if (this.data.unevenWeekSchedule$) {
      this.unevenWeekSchedule$ = this.data.unevenWeekSchedule$;
    }
    if (this.view === 'werkgeversinformatie') {
      this.departments = this.picklistService.getDeparmentsPicklist();
      this.managers = this.picklistService.getManagersPicklist();
    }
    if (this.view === 'financiele_gegevens') {
      this.editName = 'financiële gegevens';
    } else {
      this.editName = this.view
    }

    switch (this.view) {
      case 'persoonsgegevens':
        this.employeeEditForm = this.formBuilder.group({
          NameFirstLetters__c: [''],
          FirstName: [''],
          MiddleName: [''],
          LastName: [''],
          Gender__c: [''],
          Birthdate: [''],
          BirthPlace__c: [''],
          BirthCountry__c: [''],
          IdentificationType__c: [''],
          IdentificationTypeNumber__c: [''],
          IdentificationExpirationDate__c: [''],
          BSN__c: [''],
          Nationality__c: [''],
          MaritalStatus__c: ['']
        });
        break;
      case 'contactgegevens':
        this.employeeEditForm = this.formBuilder.group({
          OtherStreet: [''],
          OtherPostalCode: [''],
          OtherCity: [''],
          OtherCountry: [''],
          HomePhone: [''],
          Phone: [''],
          MobilePhone: [''],
          PhoneMobileHome__c: [''],
          Email: [''],
          EmailHome__c: [''],
          EmergencyPrimName__c: [''],
          EmergencySecName__c: [''],
          EmergencyPrimNmbr__c: [''],
          EmergencySecNmbr__c: [''],
          EmergencyPrimRel__c: [''],
          EmergencySecRel__c: ['']
        });
        break;
      case 'financiele_gegevens':
        this.employeeEditForm = this.formBuilder.group({
          IBAN__c: [''],
          Personal_ID__c: [''],
          LogisalNR__c: [''],
          Verloningsfrequentie__c: [''],
          Loonheffingskorting__c: ['']
        });
        this.carEditForm = this.formBuilder.group({
          Kenteken__c: [''],
          Uitgiftedatum__c: ['']
        });
        this.subscriptions.push(
          this.companyCar$!.subscribe(
            data => {
              this.carEditForm!.patchValue(data!);
            }
          )
        )
        this.phoneEditForm = this.formBuilder.group({
          Telefoonnummer__c: [''],
          IMEI_nummer__c: ['']
        });
        this.subscriptions.push(
          this.companyPhone$!.subscribe(
            data => {
              this.phoneEditForm!.patchValue(data!);
            }
          )
        )
        break;
      case 'werkgeversinformatie':
        this.employeeEditForm = this.formBuilder.group({
          MailingStreet: [''],
          MailingPostalCode: [''],
          MailingCity: [''],
          MailingCountry: [''],
          // Actief__c: [''],
          Afdelinglookup__c: [''],
          PIM_Rollen__c: [''],
          Contactpersoon_beheren__c: [''],
          AccountId: ['']
        });        
        break;
      case 'werknemersrooster':
        this.weekScheduleEditForm = this.formBuilder.group({
          ma__c: [''],
          tue__c: [''],
          wed__c: [''],
          thurs__c: [''],
          fri__c: [''],
          sat__c: [''],
          sun__c: ['']
        });
        this.subscriptions.push(
          this.weekSchedule$!.subscribe(
            data => {
              this.weekScheduleEditForm.patchValue(data!);
            }
          )
        )
        this.evenWeekScheduleEditForm = this.formBuilder.group({
          Week_Type__c: [''],
          ma__c: [''],
          tue__c: [''],
          wed__c: [''],
          thurs__c: [''],
          fri__c: [''],
          sat__c: [''],
          sun__c: ['']
        });
        this.subscriptions.push(
          this.evenWeekSchedule$!.subscribe(
            data => {
              this.evenWeekScheduleEditForm.patchValue(data!);
            }
          )
        )      
        this.unevenWeekScheduleEditForm = this.formBuilder.group({
          Week_Type__c: [''],
          ma__c: [''],
          tue__c: [''],
          wed__c: [''],
          thurs__c: [''],
          fri__c: [''],
          sat__c: [''],
          sun__c: ['']
        });
        this.subscriptions.push(
          this.unevenWeekSchedule$!.subscribe(
            data => {
              this.unevenWeekScheduleEditForm.patchValue(data!);
            }
          )
        )   
      break;
    }
    if (this.view !== 'werknemersrooster') {
      this.subscriptions.push(
        this.employee$.subscribe(
          data => {
            this.employeeEditForm.patchValue(data);
            this.employeeId = data.Id!
          }
        )
      )
    }
  }

  add(type: string) {
    switch (type) {
      case 'car':
        this.newCar = true;
        break;
      case 'phone':
        this.newPhone = true;
        break;
    }
  }

  sendForm() {
    let employeeEditForm = this.employeeEditForm;
    let carEditForm = this.carEditForm;
    let phoneEditForm = this.phoneEditForm;
    let weekForm = this.weekScheduleEditForm;
    let evenWeekForm = this.evenWeekScheduleEditForm;
    let unevenWeekForm = this.unevenWeekScheduleEditForm;
    let updateContact$: Observable<any>;
    let newCar$: Observable<any>;
    let newPhone$: Observable<any>;
    let updateCar$: Observable<any>;
    let updatePhone$: Observable<any>;
    let updateWeekSchedule$: Observable<any>;
    let updateEvenWeekSchedule$: Observable<any>;
    let updateUnevenWeekSchedule$: Observable<any>;
    let apiCalls: Observable<any>[] = [];
    let phoneId = '';     
    let carId = '';
    let scheduleId = '';
    
    if (this.view === "financiele_gegevens") {
      if (this.carEditForm.dirty) {
        carEditForm.value.Medewerker__c = this.employeeId;
        carEditForm.value.Artikelsoort__c = 'Auto van de Zaak';
        if (this.newCar) {
          newCar$ = this.apiService.postPortalData('uitgifte__c', carEditForm.value);
          apiCalls.push(newCar$);
        } else {
          this.companyCar$!.forEach(element => {
            carId = element!.Id!;
            updateCar$ = this.apiService.updatePortalData('uitgifte__c', carId, carEditForm.value);
            apiCalls.push(updateCar$!);
          });
        }
      }
      if (this.phoneEditForm.dirty) {
        phoneEditForm.value.Medewerker__c = this.employeeId;
        phoneEditForm.value.Artikelsoort__c = 'Telefoon';
        if (this.newPhone) {
          newPhone$ = this.apiService.postPortalData('uitgifte__c', phoneEditForm.value);
          apiCalls.push(newPhone$);
        } else {
          this.companyPhone$!.forEach(element => {
            phoneId = element!.Id!;
            updatePhone$ = this.apiService.updatePortalData('uitgifte__c', phoneId, phoneEditForm.value);
            apiCalls.push(updatePhone$!);
          });
        }
      }
    }
    if (this.view === "werknemersrooster") {
      if (this.weekScheduleEditForm.dirty) {
        this.weekSchedule$!.forEach(element => {
          scheduleId = element!.Id!;
          updateWeekSchedule$ = this.apiService.updatePortalData('Employee_Schedule_Week__c', scheduleId, weekForm.value);
          apiCalls.push(updateWeekSchedule$);
        });
      }
      if (this.evenWeekScheduleEditForm.dirty) {
        this.evenWeekSchedule$!.forEach(element => {
          scheduleId = element!.Id!;
          updateEvenWeekSchedule$ = this.apiService.updatePortalData('Employee_Schedule_Week__c', scheduleId, evenWeekForm.value);
          apiCalls.push(updateEvenWeekSchedule$);
        });
      }
      if (this.unevenWeekScheduleEditForm.dirty) {
        this.unevenWeekSchedule$!.forEach(element => {
          scheduleId = element!.Id!;
          updateUnevenWeekSchedule$ = this.apiService.updatePortalData('Employee_Schedule_Week__c', scheduleId, unevenWeekForm.value);
          apiCalls.push(updateUnevenWeekSchedule$);
        });
      }
    } else {
      updateContact$ = this.apiService.updatePortalData('Contact', this.employeeId, employeeEditForm.value);
      apiCalls.push(updateContact$);
    }

    setTimeout(() => {
      this.subscriptions.push(forkJoin(apiCalls)
      .subscribe(
        () => this.self.close(this.view)
      ))    
    }, 1000);
  }



  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
