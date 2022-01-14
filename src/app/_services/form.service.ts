import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Json } from '../shared/model/json';
import { ObjectService } from './object.service';
import { ValidatorService } from './validator.service';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(
    private object: ObjectService,
    private formBuilder: FormBuilder,
    private validate: ValidatorService
  ) { }

  setAccountForm() {
    return this.formBuilder.group({
       Id: [''],
       Name: [''],
       Handelsnamen__c: [''],
       ParentId: [''],
       BillingStreet: [''],
       BillingCity: [''],
       BillingPostalCode: [''],
       BillingCountry: [''],
       ShippingStreet: [''],
       ShippingCity: [''],
       ShippingPostalCode: [''],
       ShippingCountry: [''],
       Phone: [''],
       Mailadres_OB__c: [''],
       Website: [''],
       Bedrijfsomschrijving__c: [''],
       KvK_nummer__c: [''],
       BTW_nummer__c: [''],
       IBAN__c: [''],
       Factuurwijze__c: [''],
       Betaalwijze__c: [''],
       Betalingstermijn__c: [''],
       cp_algemeen__c: [''], 
       Contactpersoon__c: [''],
      // Contactpersoon_2__c: [''],
       Cp_Verzuim__c: [''],
       CP_Salarisadministratie__c: [''],
       CP_voor_Facturatie__c: [''],
       CP_Debiteurenadministratie__c: [''],
       Definitie_1_FTE_in_uren__c: [''],
       Verlofdagen_per_jaar__c: [''],
       Verloningsfrequentie__c: [''],
       Vaksector__c: [''],
       CAO__c: [''],
       Pensioenfonds__c: [''],
       Pensioenfonds_aansluitnummer__c: [''],
       Loonheffingnummer__c: [''],
       Kleurcode__c: ['']
    });
  }

  setRecoveryForm() {
    return this.formBuilder.group({
      Date_Full_Recovery__c: ['']
    });
  }

  setAbsenteeismForm() {
    return this.formBuilder.group({
      Employee_Contact__c: [''],
      Status_Ziekmelding__c: [''],
      First_Day_of_Sickness__c: [''],
      Date_Full_Recovery__c: [''],
      Employee_is__c: [''],
      Worked_Hours_First_day_of_sickness__c: [''],
      Expected_duration_of_Absense__c: [''],
      Related_To__c: ['']
    });
  }

  setExpenseForm() {
    return this.formBuilder.group({
      DateTransaction__c: [''],
      Amount__c: [''],
      Comments__c: [''],
      ExpenseCategory__c: [''],
      Type__c: ['']
    });
  }

  setLeaveForm() {
    return this.formBuilder.group({
      RecordTypeId: [''],
      Number_of_Hours__c: [''],
      Leave_Type__c: [''],
      Comments__c: [''],
    });
  }

  setRegistryForm(): FormGroup {
    return this.formBuilder.group({
      Company: ['', [Validators.required]],
      Street: ['', [Validators.required]],
      PostalCode: ['', [Validators.required, Validators.pattern(this.validate.postcodeRegEx)]],
      City: ['', [Validators.required]],
      Salutation: ['', [Validators.required]],
      FirstName: ['', [Validators.required]],
      MiddleName: [''],
      LastName: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.email]],
      Phone: ['', [Validators.pattern(this.validate.telefoonRegEx)]],
      MobilePhone: ['', [Validators.pattern(this.validate.mobielRegEx)]]
    });
  }

  setEmployeeForm(): FormGroup {
    return this.formBuilder.group({
      Salutation: [''], 
      NameFirstLetters__c: [''],
      FirstName: [''],
      MiddleName: [''],
      LastName: [''],
      HomePhone: [''],
      PhoneMobileHome__c: [''],
      EmailHome__c: [''],
      MailingStreet: [''],
      MailingPostalCode: [''],
      MailingCity: [''],
      MailingCountry: [''],
      // IBAN__c: [''],
      // Gender__c: [''],
      // Birthdate: [''],
      // BirthPlace__c: [''],
      // BirthCountry__c: [''],
      // MaritalStatus__c: [''],
      // IdentificationType__c: [''],
      // IdentificationTypeNumber__c: [''],
      // IdentificationExpirationDate__c: [''],
      // BSN__c: [''],
      // Nationality__c: [''],
      // EmergencyPrimName__c: [''],
      // EmergencyPrimNmbr__c: [''],
      // EmergencyPrimRel__c: [''],
      // EmergencySecName__c: [''],
      // EmergencySecNmbr__c: [''],
      // EmergencySecRel__c: [''],
      // Personal_ID__c: [''],
      // LogisalNR__c: [''],
      // OtherStreet: [''],
      // OtherPostalCode: [''],
      // OtherCity: [''],
      // OtherCountry: [''],
      // Phone: [''],
      // MobilePhone: [''],
      // Email: [''],
      // Title: [''],
      EmployedSince__c: [''],
      // datUitDienst: [''],
      Contactpersoon_beheren__c: [''],
      // hrRegisseur: [''],
      // Verloningsfrequentie__c: [''],
      // Loonheffingskorting__c: [''],
      // Afdeling__c: [''],
      PIM_Rollen__c: [''],
      
    }); 
  }

  fillValues(formData: Json, formName: FormGroup): void {    
    formName.patchValue(formData);
  }
}
