import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { ApiService } from '../_services/api.service';
import { DataService } from '../_services/data.service';
import { TokenService } from '../_services/token.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeFileService {
  contactFieldsArray: string[] = [
    'Id',
    'Salutation',
    'NameFirstLetters__c',
    'FirstName',
    'MiddleName',
    'LastName',
    'Name',
    'HomePhone',
    'MobilePhone',
    'EmailHome__c',
    'MailingStreet',
    'MailingCity',
    'MailingPostalCode',
    'MailingCountry',
    'OtherStreet',
    'OtherCity',
    'OtherPostalCode',
    'OtherCountry',
    'AccountId',
    'EmployedSince__c',
    'IBAN__c',
    'Gender__c',
    'Birthdate',
    'BirthPlace__c',
    'BirthCountry__c',
    'Afdeling__c',
    'BSN__c',
    'IdentificationType__c',
    'IdentificationTypeNumber__c',
    'Nationality__c',
    'IdentificationExpirationDate__c',
    'Loonheffingskorting__c',
    'Verloningsfrequentie__c',
    'MaritalStatus__c',
    'Children__c',
    'EmergencyPrimName__c',
    'EmergencyPrimNmbr__c',
    'EmergencyPrimRel__c',
    'EmergencySecName__c',
    'EmergencySecNmbr__c',
    'EmergencySecRel__c',
    'Username__c',
    'PIM_Rollen__c',
    'Afdelinglookup__c',
    'Afdelinglookup__r.Name',
    'Contactpersoon_beheren__c',
    'Contactpersoon_beheren__r.Name',
    'Actief__c',
    'Phone',
    'PhoneMobileHome__c',
    'Email',
    'Personal_ID__c',
    'LogisalNR__c',
    'Title',
    'Account.Name'
  ]
  public contactObj = 'Contact';
  public contactFields = this.contactFieldsArray.toString();

  constructor(
    private apiService: ApiService,
    private tokenService: TokenService
  ) { }

  getEmployeeDataById(id: string) {
    return this.apiService.getPortalData(this.contactObj, this.contactFields, id);
  }

  getEmployeeUserState(id: string) {
    return this.apiService.getPortalData(this.contactObj, 'id', id);
  }

  activateDeactivateUser(username: string, activate: boolean, id: string) {
    return this.apiService.activateDeactivateUser(username, activate, id);
  }

  getManagerPicklistData() {
    const fields = "Id,Name";
    const accountId = this.tokenService.getAccount();
    let picklist: { value: string, viewValue: string }[] = [];
    let picklist$ = this.apiService.getPortalData('Contact', fields, undefined, `AccountId='${accountId}' AND (PIM_Rollen__c='Leidinggevende' OR PIM_Rollen__c='HR manager' OR PIM_Rollen__c='HR medewerker')`);

    picklist$.pipe(
      take(1)
    ).subscribe(managers => managers.forEach((employee: any) => {
      picklist.push({
        value: employee.Id,
        viewValue: employee.Name
      })
    }));

    return picklist
  }
}
