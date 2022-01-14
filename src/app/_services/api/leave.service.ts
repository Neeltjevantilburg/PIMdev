import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Absence } from 'src/app/shared/model/absence';
import { ApiService } from '../api.service';
import { Json } from 'src/app/shared/model/json';
import { ObjectService } from '../object.service';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  leave = [
    {id: "001", naam: "testMedewerker 1", datumVerlofAanvraag: "2021-01-01", startDatum: "2021-10-04", eindDatum: "2021-10-17", status: "afgekeurd", verloftype: "regulier", opmerking: "test opmerking"},
    {id: "002", naam: "testMedewerker 1", datumVerlofAanvraag: "2021-01-01", startDatum: "2021-10-25", eindDatum: "2021-11-05", status: "goedgekeurd", verloftype: "regulier", opmerking: "test opmerking"},
    {id: "003", naam: "testMedewerker 2", datumVerlofAanvraag: "2021-01-01", startDatum: "2021-10-20", eindDatum: "2021-10-20", status: "ingediend", verloftype: "bijzonder verlof", opmerking: "test opmerking"},
    {id: "004", naam: "testMedewerker 3", datumVerlofAanvraag: "2021-01-01", startDatum: "2021-12-01", eindDatum: "2021-12-15", status: "ingediend", verloftype: "regulier", opmerking: "test opmerking"}
  ]

  constructor(
    private readonly apiService: ApiService,
    private object: ObjectService
  ) { }

  getAllLeave() {
    return this.leave
  }

  getAllAbsence(table: string, fields: string, id?: string | undefined, condition?: string | undefined): Observable<Absence[]> {
    console.log("leaveService");
    return this. apiService.getPortalData(table, fields, id, condition)
  }

  getLeaveById(id: string) {
    let obj: Json;
    let leave = this.leave.find(leave => leave.id === id);

    if (!leave) {  
      return {error: `employee with id ${id} not found`};
    };
    
    obj = this.object.ngConvert(leave!, false);
    
    return obj;
  }




}
