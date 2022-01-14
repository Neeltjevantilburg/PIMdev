//Sickness_Admin__c // Verzuim

export interface Sickness {
    id: string,
    isDeleted: boolean | null,
    name: string,
    recordTypeId: string,
    createdDate: string | null,
    createdById: string,
    lastModifiedDate: string | null,
    lastModifiedById: string,
    systemModstamp: string | null,
    lastActivityDate: string | null,
    lastViewedDate: string | null,
    lastReferencedDate: string | null,
    employee_Contact__c: string,
    aantal_be_indigde__c: number | null,
    aantal_verzuimmeldingen__c: number | null,
    absense_Reason__c: string,
    accountID__c: string,
    account__c: string,
    address__c: string,
    bSN__c: string,
    bedrijf__c: string,
    bedrijfsongeval__c: boolean | null,
    birth_Date__c: string | null,
    case_Manager__c: string,
    case_of_accident__c: boolean | null,
    dagloon2__c: number | null,
    date_Full_Recovery__c: string | null,
    datum_Probleemanalyse__c: string | null,
    datum_ziek_uit_dienst__c: string | null,
    days_of_Sickness__c: number | null,
    dekking__c: number | null,
    duur_be_indigde_ziektegevallen__c: number | null,
    eerste_werkdag_na_zwangerschapsverlof__c: string | null,
    email_HR_regisseur_update__c: string,
    email__c: string,
    email_manager__c: string,
    employee_Name__c: string,
    employee_is__c: string,
    endDate__c: string | null,
    expected_duration_of_Absense__c: string,
    explanation__c: string,
    fTE__c: number | null,
    first_Day_of_Sickness__c: string | null,
    flexfase__c: string,
    geslacht__c: string,
    in_behandeling_gennomen__c: string,
    lang_Verzuim__c: string,
    legacy_Id__c: string,
    mail_medewerker__c: string,
    mailadres_verzuimcoordinator__c: string,
    meetdag__c: string | null,
    melding__c: string,
    partly_Recovered__c: string,
    patient_in_hospital__c: boolean | null,
    percentage_Recovered__c: number | null,
    percentage_Sick_after_Partly_Recovery__c: number | null,
    percentage_sickness__c: number | null,
    percentage_ziek_na_herstel__c: number | null,
    personeelsnummer__c: string,
    phone_Home__c: string,
    phone_Mobile__c: string,
    probleemanalyse__c: string,
    record_State__c: string,
    related_To__c: string,
    reporting_Day__c: string | null,
    risicoprofiel__c: string,
    samengesteld__c: boolean | null,
    schadelast__c: number | null,
    sick_DaysForm__c: number | null,
    signaal__c: string,
    status_Ziekmelding__c: string,
    status__c: string,
    structaral_Functionality_Limited__c: boolean | null,
    type_Medewerker__c: string,
    vanaf_Datum_herstelpercentage__c: string | null,
    vangnet__c: string,
    verpleegadres__c: string,
    verwacht_einddatum_zwangerschapsverlof__c: string | null,
    verwachte_datum_geboorte_kind__c: string | null,
    verwachte_startdatum_zwangerschapsverlof__c: string | null,
    verwachtte_Bevallingsdatum__c: string | null,
    voornaam_mdw__c: string,
    worked_Hours_First_day_of_sickness__c: number | null,
    ziekteverzuimdagen__c: number | null,
    hours_is__c: number | null,
    uren__c: number | null,
    vandaag__c: string | null,
    manager__c: string,
    contactpersoon_Verzuim__c: string,
}
