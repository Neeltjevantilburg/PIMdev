import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { Absence } from '../shared/model/absence';
import { ApiService } from '../_services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AbsenceService {
  private reload = new BehaviorSubject<boolean>(false);
  public readonly reload$ = this.reload.asObservable();

  constructor(
    private readonly apiService: ApiService,
  ) { }

  setReload(x: boolean){
    this.reload.next(x);
  }

  getAllAbsence(table: string, fields: string, id?: string | undefined, condition?: string | undefined): Observable<Absence[]> {
    return this.apiService.getPortalData(table, fields, id, condition)
  }
}
