import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/_services/api.service';
import { TokenService } from 'src/app/_services/token.service';

export interface CurrentUserRole {
  PIM_Rollen__c: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private isManager = new BehaviorSubject<boolean>(false);
  readonly isManager$ = this.isManager.asObservable();

  private isEmployee = new BehaviorSubject<boolean>(false);
  readonly isEmployee$ = this.isEmployee.asObservable();

  constructor(
    private readonly apiService: ApiService,
    private readonly tokenService: TokenService,
  ) { 
    this.getUserRoles();
  }

  getUserRoles() {
    this.apiService.getPortalData('Contact', 'PIM_Rollen__c', this.tokenService.getContact()).pipe(
      map((role: CurrentUserRole) => {
        if(role.PIM_Rollen__c === 'Medewerker')  return this.isEmployee.next(true);
        if(role.PIM_Rollen__c === 'Leidinggevende' || role.PIM_Rollen__c === 'HR medewerker') return this.isManager.next(true);
      }),
    ).subscribe();
  }

}
