import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Json } from '../shared/model/json';

@Injectable({
  providedIn: 'root'
})
export class ObjectService {

  constructor(
    private datePipe: DatePipe
  ) { }

  removeNull(obj: any) {
    delete obj['id'];

    Object.keys(obj).forEach((key) => {
      if ((obj[key] === null || obj[key].length === 0 || obj[key] === 'null' || obj[key] === '-')) {
        delete obj[key];
      }
    });
    
    return obj;
  }

  formReady(obj: Json) {
    Object.keys(obj).forEach((key) => {
      if ((obj[key] === null || obj[key] === 'null' || obj[key] === '-')) {
        obj[key] = '';
      }
    });
    return obj;
  }
  
  ngConvert(obj: Json, convertDate: boolean) {
    // replace null values
    Object.keys(obj).forEach((key) => {
      if ((obj[key] === null || obj[key] === '' || obj[key] === 'null')) {
        obj[key] = '-';
      }
    });

    return obj;
  }

  ngConvertArray(obj: Json[], convertDate: boolean) {
    obj.forEach(
      element => this.ngConvert(element, convertDate)
    )

    return obj;
  }

  merge(componentObj: Json, DialogObj: Json) {
    let obj: Json = {};

    Object.keys(componentObj).forEach((key) => {
      obj[key] = componentObj[key];
    });

    Object.keys(DialogObj).forEach((key) => {
      obj[key] = DialogObj[key];
    });
    return obj;
  }

  convertToPicklist(obj: Json) {    
    Object.keys(obj).forEach((key) => {
      if (key === 'code') {
        delete obj[key];
      }
      if (key === 'id') {
        delete obj[key];
      }
      if (key === 'naam') {
        obj.viewValue = obj[key];
        obj.value = obj[key];
        delete obj[key];
      }
    });
    
    return obj;
  }
  
  getPicklist(obj: Json[]) {
    let picklist = Object.assign([], obj);

    picklist.forEach(
      element => this.convertToPicklist(element)
    )

    return picklist;
  }

  employeeActive(obj: Json): boolean {
    let returnValue = false

    Object.keys(obj).forEach((key) => {
      if (key === 'Actief__c'){
        returnValue = obj[key];
      }
    });

    return returnValue;
  }

  findElementById(data: Array<any>, id: string) {
    let elementData : any

    data.forEach(element => {
      Object.keys(element).forEach((key) => {
        if (key === 'Id' && element[key] === id){
          elementData = element
        }
      });
    });
    return elementData
  }

  openLeave(obj: any) {
    let value: number = 0

    // obj.forEach((element: any) => {
    //   if (element.status === 'ingediend') {
    //       value = value + 1
    //   }
    // });

    return value
  }
  openExpense(obj: any) {
    let value: number = 0

    // obj.forEach((element: any) => {
    //   if (element.status === 'ingediend') {
    //       value = value + 1
    //   }
    // });

    return value
  }
  openAbsenteeism(obj: any) {
    let value: number = 0

    // obj.forEach((element: any) => {
    //   if (element.Status_Ziekmelding__c === 'Ziek') {
    //       value = value + 1
    //   }
    // });

    return value
  }
  openContract(obj: any) {
    let value: number = 0

    // obj.forEach((element: any) => {
    //   if (element.type === 'einde proeftijd' || element.type === 'einde contract') {
    //       value = value + 1
    //   }
    // });

    return value
  }

  convertToTable(obj: any) {
    let tableSource: any = [];

    Object.keys(obj).forEach(key => {
      switch (key) {
        case "leave":
          obj[key].forEach((element: any) => {
            if (element.status === "ingediend") {
              tableSource.push(
                {id: `${element.id}`, soort: "Verlofaanvraag", naam: `${element.naam}`, datum: `${element.datumVerlofAanvraag}`}
              )
            }
          });
          break;
        case "expense":
          obj[key].forEach((element: any) => {
            if (element.status === "ingediend") {
              tableSource.push(
                {id: `${element.id}`, soort: "Declaratie", naam: `${element.naam}`, datum: `${element.datum}`}
              )
            }
          });
          break;
        case "absenteeism":
          obj[key].forEach((element: any) => {
            if (element.status === "ziek") {
              tableSource.push(
                {id: `${element.id}`, soort: "Verzuimmelding", naam: `${element.naam}`, datum: `${element.datumZiekmelding}`}
              )
              }
          });
          break;
        case "contract":
          obj[key].forEach((element: any) => {
            tableSource.push(
              {id: `${element.id}`, soort: "Contract signalering", naam: `${element.naam}`, datum: `${element.signaleringsDatum}`}
            )
          });
          break;
      }
    });

    return tableSource;
  }

}
