import { Injectable } from '@angular/core';
import { Json } from '../../shared/model/json';

@Injectable({
  providedIn: 'root'
})
export class FunctionService {
  functions: Json[] = [
    {id: "fun001", code: "Oak001", naam: 'Solution Manager'},
    {id: "fun002", code: "Oak002", naam: 'HR Manager'},
    {id: "fun003", code: "Oak003", naam: 'HR Medewerker'},
    {id: "fun004", code: "Oak004", naam: 'Angular Developer'},
    {id: "fun005", code: "Oak005", naam: '.Net Developer'},
    {id: "fun006", code: "Oak006", naam: 'SalesForce Developer'},
    {id: "fun007", code: "Oak007", naam: 'SalesForce Admin'},
    {id: "fun008", code: "Oak008", naam: 'Case Manager'},
    {id: "fun009", code: "Oak009", naam: 'Sales Manager'},
    {id: "fun010", code: "Oak010", naam: 'User Experience Designer'},
    {id: "fun011", code: "Oak011", naam: 'Online Marketeer'},
    {id: "fun012", code: "Oak012", naam: 'Finance Manager'},
    {id: "fun013", code: "Oak013", naam: 'Finance Medewerker'}
  ];

  constructor( ) { }

  getFunction(id?: string) {
    let obj: Json;
    let func = this.functions.find(func => func.id === id);

    if (!func) { 
      return {error: `function with id ${id} not found`};
    };
    
    obj = func;
    return obj;
  }

  getAllEmployeesFunctions() {
    return this.functions;
  }

}
