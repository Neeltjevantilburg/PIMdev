// Company_Schedule__c //

export interface CompanySchedule {
    Name: string,
    For__c: string,
    Start_Date__c: string,
    End_Date__c: string,
    ma__c: string,
    tue__c: string,
    wed__c: string,
    thur__c: string,
    fri__c: string,
    sat__c: string,
    sun__c: string,
    Number_of_free_days_1_year_FTE__c: string,
    X1_day_leave_sick_in_hours__c: string,
    Number_ADV_FTE__c: string,
    Special_leave_of_1_day_leave__c: string,
    Transport_Remaining_Leave__c: string,
    Ignore_for_Transport__c: string, // multi-picklist
    Add_special_leave__c: string,
    Add_Overtime__c: string,
    Max_Negative_Balance_in_hours__c: string,
    OvertimeBalanceMin__c: string,
    Max_days_in_a_single_request__c: string,
    Saturday_hours__c: string,
    Account__c: string, // hidden
}