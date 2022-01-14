import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { NewExpenseComponent } from '../expenses/new-expense/new-expense.component';
import { ApiService } from './api.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  expenseObj = 'Expense__c';
  
  constructor(
    private apiService: ApiService,
    private tokenService: TokenService,
    private dataPipe: DatePipe
    ) { }
    
  getTableSource(manager: boolean, id?: string) {
    const tableFields = "Id,Employee_Contact__r.Name,Amount__c,DateSubmitted__c,CreatedDate,State__c";
    let contactId: string;
    let condition: string;

    if (id) {
      contactId = id;
    } else {
      contactId = this.tokenService.getContact();
    }
    if (manager) {
      condition = `Manager__c='${contactId}' and State__c NOT IN('Niet ingediend')`;
    } else {
      condition = `Employee_Contact__c='${contactId}'`;
    }
    
    return this.apiService.getPortalData(this.expenseObj, tableFields, undefined, condition);
  }

  approveExpense(approved: boolean, id: string) {
    let body: {State__c: string, DateApproved__c?: string | null};
    let date = this.dataPipe.transform(new Date(), 'yyyy-MM-dd');

    if (approved) {
      body = {
        State__c: 'Goedgekeurd',
        DateApproved__c: date
      };
    } else {
      body = {
        State__c: 'Afgewezen'
      };
    }

    return this.apiService.updatePortalData(this.expenseObj, id, body);
  }

  getExpenseData(id: string) {
    const expenseViewFields = "Id,Employee_Contact__r.Name,DateSubmitted__c,Amount__c,DateTransaction__c,Business_Purpose__c,Payment_Type__c,Projectnummer_Kostenplaatsnummer__c,ExpenseCategory__c,Type__c,Comments__c,State__c,DateApproved__c";

    return this.apiService.getPortalData(this.expenseObj, expenseViewFields, id);
  }

  getEmployeePicklistData() {
    const employeeFields = "Id,Name";    
    let picklist: { value: string, viewValue: string }[] = [];
    let picklist$ = this.apiService.getPortalData('Contact', employeeFields, undefined, `Contactpersoon_beheren__c='${this.tokenService.getContact()}'`);

    picklist$.pipe(
      take(1)
    ).subscribe(employees => employees.forEach((employee: any) => {
      picklist.push({
        value: employee.Id,
        viewValue: employee.Name
      })
    }));

    return picklist
  }

  postNewExpense(form: FormGroup, dialog: MatDialogRef<NewExpenseComponent>, file: File | null) {    
    const body = form.value
    let call: Observable<any>

    if (file) {
      call = this.apiService.postPortalData(this.expenseObj, body).pipe(
        take(1),
        switchMap((data: any) => {
          const formData = new FormData();
          formData.append('linkid', data.id);
          formData.append('file', file!, file!.name);
  
          return this.apiService.createAttachmentFile(formData).pipe(take(1))
        })
      )
    } else {
      call = this.apiService.postPortalData(this.expenseObj, body).pipe(take(1))
    }

    return call.subscribe(
        data => dialog.close(data)
      )    
  }

  updateExpense(id: string, form: FormGroup, dialog: MatDialogRef<NewExpenseComponent>, file: File | null) {    
    const body = form.value
    let call: Observable<any>

    if (file) {
      call = this.apiService.updatePortalData(this.expenseObj, id, body).pipe(
        take(1),
        switchMap((data: any) => {
          const formData = new FormData();
          formData.append('linkid', data.id);
          formData.append('file', file!, file!.name);
  
          return this.apiService.createAttachmentFile(formData).pipe(take(1))
        })
      )
    } else {
      call = this.apiService.updatePortalData(this.expenseObj, id, body).pipe(take(1))
    }

    return call.subscribe(
        data => dialog.close(data)
      )    
  }

  checkForAndGetExpenseFiles(id: string) {
    return this.apiService.getFilesByDirectoryId(id);
  }

  submitExpense(id: string) {
    const body = { State__c: "Ingediend" }

    return this.apiService.updatePortalData(this.expenseObj, id, body)
  }

  getExpenseEditData(id: string) {
    const fields = "Id,Employee_Contact__c,Amount__c,DateTransaction__c,Business_Purpose__c,ExpenseCategory__c,Payment_Type__c,Type__c,Projectnummer_Kostenplaatsnummer__c,Comments__c,Manager__c";

    return this.apiService.getPortalData(this.expenseObj, fields, id)
  }

  deleteExpense(id: string) {
    return this.apiService.deletePortalData(this.expenseObj, id)
  }

  getExpenseTotal() {
    const contactId = this.tokenService.getContact();

    return this.apiService.getPortalData('Contact', 'PIM_Rollen__c', contactId).pipe(
      map(response => response.PIM_Rollen__c),
      switchMap(response => {
        if (response !== "Medewerker") {
          return this.apiService.getPortalData( this.expenseObj, "Id", undefined, `Manager__c='${contactId}' and State__c='Ingediend'`).pipe(
            switchMap(response =>{
              return of(response.length);
            })
          )
        } else {
          return this.apiService.getPortalData( this.expenseObj, "Id", undefined, `Employee_Contact__c='${contactId}'`).pipe(
            switchMap(response =>{
              console.log(response)
              return of(response.length);
            })
          )
        }
      })
    );
    
  }

}
