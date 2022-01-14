import { Injectable } from '@angular/core';
import { Json } from '../../shared/model/json';
import { ObjectService } from '../object.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  departments: Json[] = [
    {id: "dep001", code: "Dep001", naam: 'HRM'},
    {id: "dep002", code: "Dep002", naam: 'Marketing'},
    {id: "dep003", code: "Dep003", naam: 'Sales'},
    {id: "dep004", code: "Dep004", naam: 'Software solutions'},
    {id: "dep005", code: "Dep005", naam: 'Secretariaat'},
    {id: "dep006", code: "Dep006", naam: 'Directie'}
  ];

  constructor(
    private object: ObjectService
  ) { }

  getDepartment(id?: string) {
    let obj: Json;
    let department = this.departments.find(department => department.id === id);

    if (!department) {  
      return {error: `function with id ${id} not found`};
    };
    
    obj = department;
    return obj;
  }

  getAllEmployeesgetDeparmentsPicklist() {
    return this.departments;
  }

  getDeparmentPicklist() {
    return this.object.getPicklist(this.getAllEmployeesgetDeparmentsPicklist())
  }

}
