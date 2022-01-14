import { Injectable } from '@angular/core';
import { Json } from 'src/app/shared/model/json';
import { ObjectService } from '../object.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  expenses = [
    {id: "005", naam: "testMedewerker 1", datum: "2021-10-01", bedrag: "5,95", categorie: "reiskosten", type: "woon-werk", opmerking: "test opmerking", status: "ingediend"},
    {id: "006", naam: "testMedewerker 2", datum: "2021-10-01", bedrag: "14,95", categorie: "reiskosten", type: "woon-werk", opmerking: "test opmerking", status: "goedgekeurd"},
    {id: "007", naam: "testMedewerker 2", datum: "2021-10-01", bedrag: "1495,00", categorie: "reiskosten", type: "woon-werk", opmerking: "test opmerking", status: "afgekeurd"}
  ]

  constructor(
    private object: ObjectService
  ) { }

  getAllExpenses() {
    return this.expenses
  }

  getExpenseById(id: string) {
    let obj: Json;
    let expense = this.expenses.find(expense => expense.id === id);

    if (!expense) {   
      return {error: `employee with id ${id} not found`};
    };
    
    obj = this.object.ngConvert(expense!, false);
    
    return obj;
  }

}
