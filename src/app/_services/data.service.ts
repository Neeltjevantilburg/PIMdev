import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  /* Loading Dialog */
  public loadingText!: string;

  /* Error Dialog */
  public errorText!: string;

  /* Register Dialog */
  public registerFormData!: FormGroup;

  /* FunDep */
  public funDepId!: string;
  public funDepNaam!: string;
  public funDepCode!: string;
  public funDepType!: string;
  public updateFunDep!: boolean;

  /* EmpData */
  public username!: string;
  public employeeId!: string;
  public updateEmployee!: boolean;

  /* Account */
  private accountFieldsArray: string[] = [
    'Id', // hidden
    'Name',
    'Handelsnamen__c',
    'ParentId',
    'Parent.Name',
    'BillingStreet',
    'BillingCity',
    'BillingPostalCode',
    'BillingCountry',
    'ShippingStreet',
    'ShippingCity',
    'ShippingPostalCode',
    'ShippingCountry',
    'Phone',
    'Mailadres_OB__c',
    'Website',
    'Bedrijfsomschrijving__c',
    'KvK_nummer__c',
    'BTW_nummer__c',
    'IBAN__c',
    'Factuurwijze__c', // mulitpicklist
    'Betaalwijze__c', // picklist
    'Betalingstermijn__c', // picklist
    'cp_algemeen__c', // cp algemeen => get contact name & e-mail
    'cp_algemeen__r.Name', // cp algemeen => get contact name & e-mail
    'cp_algemeen__r.Email', // cp algemeen => get contact name & e-mail
    'Contactpersoon__c',// cp personeelszaken => get contact & e-mail
    'Contactpersoon__r.Name',// cp personeelszaken => get contact & e-mail
    'Contactpersoon__r.Email',// cp personeelszaken => get contact & e-mail
    'Cp_Verzuim__c',
    'Cp_Verzuim__r.Name',
    'Cp_Verzuim__r.Email',
    'CP_Salarisadministratie__c',// cp salad => get contact & e-mail
    'CP_Salarisadministratie__r.Name',// cp salad => get contact & e-mail
    'CP_Salarisadministratie__r.Email',// cp salad => get contact & e-mail
    'CP_voor_Facturatie__c',// cp crediteuren => get contact & e-mail
    'CP_voor_Facturatie__r.Name',// cp crediteuren => get contact & e-mail
    'CP_voor_Facturatie__r.Email',// cp crediteuren => get contact & e-mail
    'CP_Debiteurenadministratie__c', // cp debiteuren => get contact & e-mail
    'CP_Debiteurenadministratie__r.Name',
    'CP_Debiteurenadministratie__r.Email',
    'Definitie_1_FTE_in_uren__c',
    'Verlofdagen_per_jaar__c',
    'Verloningsfrequentie__c',
    'Vaksector__c',
    'CAO__c',
    'Pensioenfonds__c',
    'Pensioenfonds_aansluitnummer__c',
    'Loonheffingnummer__c',
    'Kleurcode__c',
    'Mailadres_OB_IM__c'
  ];
  public accountObj = 'Account';
  public accountsFields = this.accountFieldsArray.toString();

  /* Contact */
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
    'Contactpersoon_beheren__c', // Manager
    'Contactpersoon_beheren__r.Name', // Manager,
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

  /* Company_Schedule__c */
  private companyScheduleFieldsArray: string[] = [
    'Id',
    'Name',
    'For__c',
    'Start_Date__c',
    'End_Date__c',
    'ma__c',
    'tue__c',
    'wed__c',
    'thur__c',
    'fri__c',
    'sat__c',
    'sun__c',
    'Number_of_free_days_1_year_FTE__c',
    'X1_day_leave_sick_in_hours__c',
    'Number_ADV_FTE__c',
    'Special_leave_of_1_day_leave__c',
    'Transport_Remaining_Leave__c',
    'Ignore_for_Transport__c', // multi-picklist
    'Add_special_leave__c',
    'Add_Overtime__c',
    'Max_Negative_Balance_in_hours__c',
    'OvertimeBalanceMin__c',
    'Max_days_in_a_single_request__c',
    'Saturday_hours__c'
  ];
  public companyScheduleId!: string | undefined;
  public companyScheduleUpdate!: boolean;
  public companyScheduleLoad!: boolean;
  public companyScheduleFields = this.companyScheduleFieldsArray.toString();

  /* Employee_Schedule_Week__c */
  private vmWeekScheduleFieldsArray: string[] = [
    'Id',
    'Name',
    'ma__c',
    'tue__c',
    'wed__c',
    'thurs__c',
    'fri__c',
    'sat__c',
    'sun__c',
    'TotalHoursDecimal__c',
    'Employee_Schedule__c',
    'Week_Type__c',
    'Werkdagen__c'
  ];
  public vmWeekScheduleFields = this.vmWeekScheduleFieldsArray.toString();

  /* Employee_Schedule__c */
  private vmScheduleFieldsArray: string[] = [
    'Id',
    'Name',
    'Employee_Contact__c',
    'Schedule_Company__c',
    'Werkdagen__c',
    'FTE__c',
    'Average_hours_week__c',
    'Record_State__c'
  ];
  public vmSchedulefields = this.vmScheduleFieldsArray.toString();

  contractFieldsArray: string[] = [
    // 'Id',
    // 'Active__c',
    // 'Dagen_per_week__c',
    // 'DateEnd__c',
    // 'DateEndProbation__c',
    // 'DateStart__c',
    // 'DateStartVersion__c',
    // 'Description__c',
    // 'Employee_Contact__c',
    // 'Functie__c',
    // 'Functiecode__c',   
    // 'Functiegroep__c',
    // 'HoursContract__c',
    // 'Klant__c',
    // 'Name',
    // 'PeriodNoticeEmployee__c',
    // 'PeriodNoticeEmployer__c',
    // 'Reasonforchange__c',
    // 'RecordTypeId',
    // 'Reiskostenvergoeding__c',
    // 'Rooster__c',
    // 'Salaris_obv_FTE__c',
    // 'Salarisadministratie__c',
    // 'Salarisschaal__c',
    // 'Salary__c',
    // 'Sequence_number__c',
    // 'State__c',
    // 'State_Contract__c',
    // 'TermsSpecial__c' ,   
    // 'Trede__c',
    // 'Type__c',
    // 'Version_number__c' 
  ]
  public contractObj = 'HR_Contract__c'
  public contractFields = this.contractFieldsArray.toString();

  private leaveFieldsArray: string[] = [
    'Id',
    'EmployeeContactPerson__c',
    'Date_Submitted__c',
    'Day_Start__c',
    'Day_End__c',
    'Day__c',
    'All_Day__c',
    'Status__c',
    'Name',
    // 'State__c',
    'RecordTypeId',
    'Number_of_Hours__c',
    'Leave_Type__c',
    'Comments__c',
    'Goedkeurend_Persoon__c'
  ];
  public leaveObj = 'Absence_Request__c'
  public leaveFields = this.leaveFieldsArray.toString();

  private expenseFieldsArray: string[] = [
    'Id',
    'Employee_Contact__c',
    // 'Date_Submitted__c',
    // 'Day_Start__c',
    // 'Day_End__c',
    // 'Day__c',
    // 'All_Day__c',
    'State__c',
    'RecordTypeId',
    // 'Number_of_Hours__c',
    // 'Leave_Type__c',
    // 'Comments__c',
    // 'Goedkeurend_Persoon__c'
  ];
  public expenseObj = 'Expense__c'
  public expenseFields = this.expenseFieldsArray.toString();

  private absenteeismFieldsArray: string[] = [
    'Id',
    'Employee_Contact__c',
    // 'Date_Submitted__c',
    // 'Day_Start__c',
    // 'Day_End__c',
    // 'Day__c',
    // 'All_Day__c',
    'Status__c',
    'RecordTypeId',
    // 'Number_of_Hours__c',
    // 'Leave_Type__c',
    // 'Comments__c',
    // 'Goedkeurend_Persoon__c'
  ];
  public absenteeismObj = 'Sickness_Admin__c'
  public absenteeismFields = this.absenteeismFieldsArray.toString();

  private issuedArray: string[] = [
    'Id',
    'Name',
    'Medewerker__c',
    'Artikelsoort__c',
    'IMEI_nummer__c',
    'Kenteken__c',
    'Telefoonnummer__c',
    'Uitgiftedatum__c',
  ];
  public issuedObj = 'Uitgifte__c';
  public issuedFields = this.issuedArray.toString();
  
}