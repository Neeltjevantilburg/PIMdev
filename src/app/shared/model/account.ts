// Account //

export interface Account {
    Id: string, // hidden
    Name: string,
    BillingStreet: string,
    BillingCity: string,
    BillingPostalCode: string,
    BillingCountry: string,
    ShippingStreet: string,
    ShippingCity: string,
    ShippingPostalCode: string,
    ShippingCountry: string,
    Phone: string,
    KvK_nummer__c: string,
    IBAN__c: string,
    BTW_nummer__c: string,
    RecordTypeId: string, // hidden
    Type: string, // hidden
    Status__c: string, // hidden
    Website: string,
    Bedrijfsomschrijving__c: string,
    CAO__c: string,
    Loonheffingnummer__c: string,
    Definitie_1_FTE_in_uren__c: any,
    Aantal_actieve_medewerker__c: string,
    Pensioenfonds__c: string,
    Pensioenfonds_aansluitnummer__c: string,
    AccountType__c: string, // picklist
    Handelsnamen__c: string,
    ParentId: string,
    Intermediair__c: string,
    Kleurcode__c: string,
    Mailadres_OB_IM__c: string,
    Vaksector__c: string, // picklist
    Factuurwijze__c: string, // mulitpicklist
    Betaalwijze__c: string, // picklist
    Betalingstermijn__c: string, // picklist
    Contactpersoon__c: string, // CP HR
    //Contactpersoon_2__c: string, // CP Verzuim
    Cp_Verzuim__c: string,
    CP_voor_Facturatie__c: string,
    CP_Salarisadministratie__c: string,
    CP_voor_opdrachtbevestigingen__c: string,
    CP_voor_Urenregistratie__c: string
}