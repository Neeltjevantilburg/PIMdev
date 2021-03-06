// Absence_Request__c // Verlof

export interface Absence {
    Id: string,
    isDeleted: boolean,
    Name: string,
    RecordTypeId: string,
    CreatedDate: string,
    CreatedById: string,
    LastModifiedDate: string,
    LastModifiedById: string,
    SystemModstamp: string,
    LastActivityDate: string,
    LastViewedDate: string,
    LastReferencedDate: string,
    EmployeeContactPerson__c: string,
    Absence_End_Day__c: string,
    Absence_Start_Day__c: string,
    All_Day__c: boolean,
    Comments__c: string,
    date_Approved__c: string,
    date_Submitted__c: string,
    Day_End__c: string,
    Day_Start__c: string,
    day__c: string,
    Employee_Name__c: string,
    employee_Number__c: string,
    employee_is__c: string,
    end_Time__c: string,
    end__c: string,
    Goedkeurend_Persoon__c: string,
    klant__c: string,
    leave_Days_In_Hours__c: number,
    Leave_Hours__c: number,
    Leave_Type__c: string,
    legacy_Id__c: string,
    number_of_Hours__c: number,
    start_Time__c: string,
    start__c: string,
    Status__c: string,
    user__c: string,
    herberekenen__c: boolean,
    deviation_Hours__c: number,
    deviation_Special__c: number,
    deviation_ADV__c: number,
    deviation_Unpaid__c: number,
    deviation_Overtime__c: number,
    verlofStartJaar__c: string,
    Manager__c: string,
    origineel_aantal_uur__c: number,
    contactpersoon_HR__c: string,
    accountId__c: string,
    EmployeeContactPerson__r: EmployeeContactPerson
    }

interface EmployeeContactPerson {
    Name: string;
    Employee_Name__c: string;
    Id: string;
}