// Expence__c // declaratie

export interface Expense {
    Id: string;
    IsDeleted: boolean | null;
    Name: string;
    RecordTypeId: string;
    CreatedDate: string | null;
    CreatedById: string;
    LastModifiedDate: string | null;
    LastModifiedById: string;
    SystemModstamp: string | null;
    LastActivityDate: string | null;
    LastViewedDate: string | null;
    LastReferencedDate: string | null;
    Employee_Contact__c: string;
    Amount__c: number | null;
    Assignment__c: string;
    Business_Purpose__c: string;
    City__c: string;
    Comments__c: string;
    CopyReceipt__c: string;
    CreatedbyAccount__c: string;
    DateApproved__c: string | null;
    DateSubmitted__c: string | null;
    DateTransaction__c: string | null;
    DaysAwaitingApproval__c: number | null;
    Doorbelasten_aan_opdrachtgever__c: boolean | null;
    ExpenseCategory__c: string;
    Legacy_Id__c: string;
    Manager_User__c: string;
    Payment_Type__c: string;
    Projectnummer_Kostenplaatsnummer__c: string;
    Projectnummer__c: string;
    Refresh__c: boolean | null;
    State__c: string;
    Type__c: string;
    Uitbetaald__c: boolean | null;
    Manager__c: string;
    Contactpersoon_HR__c: string;
}
    