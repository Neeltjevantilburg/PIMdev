export interface ExpenseTableSource {
    Id: string,
    Employee_Contact__r: {
        attributes: {
            type: string,
            url: string
        },
        Name: string        
    },
    Amount__c: number,
    DateSubmitted__c: string,
    State__c: string
}