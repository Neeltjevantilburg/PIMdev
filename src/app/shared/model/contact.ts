// Contact //

export interface Contact {
    Id: string,
    Salutation: string,
    NameFirstLetters__c: string,
    FirstName: string,
    MiddleName: string,
    LastName: string,
    Name: string,
    HomePhone: string,
    MobilePhone: string,
    EmailHome__c: string,
    MailingStreet: string,
    MailingCity: string,
    MailingPostalCode: string,
    MailingCountry: string,
    OtherStreet: string,
    OtherCity: string,
    OtherPostalCode: string,
    OtherCountry: string,
    AccountId: string,
    EmployedSince__c: string,
    IBAN__c: string,
    Gender__c: string,
    Birthdate: string,
    BirthPlace__c: string,
    BirthCountry__c: string,
    Afdeling__c: string,
    BSN__c: string,
    IdentificationType__c: string,
    IdentificationTypeNumber__c: string,
    Nationality__c: string,
    IdentificationExpirationDate__c: string,
    Loonheffingskorting__c: string,
    Verloningsfrequentie__c: string,
    MaritalStatus__c: string,
    Children__c: string,
    EmergencyPrimName__c: string,
    EmergencyPrimNmbr__c: string,
    EmergencyPrimRel__c: string,
    EmergencySecName__c: string,
    EmergencySecNmbr__c: string,
    EmergencySecRel__c: string,
    Username__c: string,
    PIM_Rollen__c: string,
    Afdelinglookup__c: string,
    Contactpersoon_beheren__c: string,
    Actief__c: string,
    Phone: string,
    PhoneMobileHome__c: string,
    Email: string,
    Personal_ID__c: string,
    LogisalNR__c: string,
    Title: string,
    Contactpersoon_beheren__r: {
        attributes: {
            type: string,
            url: string
        },
        Name: string
    },
    Afdelinglookup__r: {
        attributes: {
            type: string,
            url: string
        },
        Name: string
    },
    Account: {
        attributes: {
            type: string,
            url: string
        },
        Name: string
    },
    AzureActive: boolean
}
