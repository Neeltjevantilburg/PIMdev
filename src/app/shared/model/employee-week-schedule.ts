// Employee_Schedule_Week__c //

export interface EmployeeWeekSchedule {
    Id: string,
    Week_Type__c?: string,
    ma__c?: number,
    tue__c?: number,
    wed__c?: number,
    thurs__c?: number,
    fri__c?: number,
    sat__c?: number,
    sun__c?: number,
    Werkdagen__c: number,
    TotalHoursDecimal__c: number,
    Employee_Schedule__r: {
        Employee_Contact__r: {
            Name: string
        }
    }
}
