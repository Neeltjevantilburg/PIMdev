import { Injectable } from '@angular/core';
import { Json } from 'src/app/shared/model/json';
import { ObjectService } from '../object.service';

@Injectable({
  providedIn: 'root'
})
export class AbsenteeismService {
  absenteeism = [
    {id: "008", Employee_Contact__c: "Medewerker_1", Employee_is__c: "Ziek", First_Day_of_Sickness__c: "2021-10-01", Date_Full_Recovery__c: "", Related_To__c: "Beide", Status_Ziekmelding__c: "Ziek", Worked_Hours_First_day_of_sickness__c: "1", Expected_duration_of_Absense__c: "Langdurig"},
    {id: "009", Employee_Contact__c: "Medewerker_2", Employee_is__c: "Zwanger", First_Day_of_Sickness__c: "2021-09-01", Date_Full_Recovery__c: "2021-09-07", Related_To__c: "Beide", Status_Ziekmelding__c: "Hersteld", Worked_Hours_First_day_of_sickness__c: "0", Expected_duration_of_Absense__c: "Langdurig"}
  ]

  constructor( ) { }

  getAllAbsenteeism() {
    return this.absenteeism
  }

  getAbsenteeismById(id: string) {
    let obj: Json;
    let absenteeism = this.absenteeism.find(absenteeism => absenteeism.id === id);

    if (!absenteeism) {
      return {error: `employee with id ${id} not found`};
    };
    
    obj = absenteeism!
    
    return obj;
  }

}
