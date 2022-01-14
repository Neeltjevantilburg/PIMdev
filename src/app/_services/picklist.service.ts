import { Injectable } from '@angular/core';
import { Json } from '../shared/model/json';
import { PicklistItem } from '../shared/model/picklistItem';
import { ApiService } from './api.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class PicklistService {
  type = {
    aanheffen: [
      {value: 'Dhr.', viewValue: 'Dhr.'},
      {value: 'Mevr.', viewValue: 'Mevr.'}
    ],    
    verloningsFrequeties : [
      {value: 'Wekelijks', viewValue: 'Wekelijks'},
      {value: 'Maandelijks', viewValue: 'Maandelijks'}
    ],    
    geslachten : [
      {value: 'Man', viewValue: 'Man'},
      {value: 'Vrouw', viewValue: 'Vrouw'}
    ],    
    idBewijsSoorten : [
      {value: 'Paspoort', viewValue: 'Paspoort'},
      {value: 'Identiteitskaart', viewValue: 'Identiteitskaart'}
    ],    
    nationaliteiten : [
      {value: 'Nederlandse', viewValue: 'Nederlandse'},
      {value: 'Belgische', viewValue: 'Belgische'}
    ],    
    landen : [
      {value: 'Nederland', viewValue: 'Nederland'},
      {value: 'België', viewValue: 'België'},
      {value: 'Luxemburg', viewValue: 'Luxemburg'},
      {value: 'Duitsland', viewValue: 'Duitsland'},
    ],
    jaNee : [
      {value: 'Ja', viewValue: 'Ja'},
      {value: 'Nee', viewValue: 'Nee'}
    ],  
    trueFalse : [
      {value: true, viewValue: 'Ja'},
      {value: false, viewValue: 'Nee'}
    ],    
    burgerlijkeStaten : [
      {value: 'Alleenstaand', viewValue: 'Alleenstaand'},
      {value: 'Gehuwd', viewValue: 'Gehuwd'},
      {value: 'Samenwonend', viewValue: 'Samenwonend'},
      {value: 'Gereg. partnerschap', viewValue: 'Gereg. partnerschap'},
      {value: 'Gescheiden', viewValue: 'Gescheiden'},
      {value: 'Weduwe', viewValue: 'Weduwe'}
    ],    
    pimRollen : [
      {value: 'Medewerker', viewValue: 'Medewerker'},
      {value: 'Leidinggevende', viewValue: 'Leidinggevende'},
      {value: 'HR medewerker', viewValue: 'HR medewerker'},
      {value: 'HR manager', viewValue: 'HR manager'},
      {value: 'Directeur', viewValue: 'Directeur'},
      {value: 'Salarisadministratie', viewValue: 'Salarisadministratie'}
    ],    
    actief : [
      {value: true, viewValue: 'In dienst'},
      {value: false, viewValue: 'Uit dienst'}
    ],
    contractTypes : [
      {value: 'FixedTermEmployment', viewValue: 'Bepaalde tijd'},
      {value: 'PermanentEmployment', viewValue: 'Onbepaalde tijd'}
    ],
    leaveKinds : [
      {value: '0122o0000007iY0AAI', viewValue: 'Aantal dagen'},
      {value: 'default', viewValue: 'Volledige dag'},
      {value: '0122o0000007iY2AAI', viewValue: 'Aantal uur'}
    ],
    leaveTypes : [
      {value: 'Regular', viewValue: 'Regulier'},
      {value: 'Special', viewValue: 'Bijzonder'},
      {value: 'ADV', viewValue: 'ADV'},
      {value: 'Unpaid', viewValue: 'Onbetaald'},
      {value: 'Overtime', viewValue: 'Overtijd'}
    ],
    toonMedewerkers : [
      {value: 'employed', viewValue: 'Medewerkers in dienst'},
      {value: 'notEmployed', viewValue: 'Medewerkers uit dienst'},
      {value: 'all', viewValue: 'Alle medewerkers'}
    ],
    statusZiekmelding : [
      {value: 'Ziek', viewValue: 'Ziek'},
      {value: 'Hersteld', viewValue: 'Hersteld'},
      {value: 'Gedeeltelijk ziek', viewValue: 'Gedeeltelijk ziek'},
      {value: 'Ziek uit dienst', viewValue: 'Ziek uit dienst'}
    ],
    typeZiekmelding : [
      {value: 'Ziek', viewValue: 'Ziek'},
      {value: 'Gedeeltelijk ziek', viewValue: 'Gedeeltelijk ziek'},
      {value: 'Zwanger', viewValue: 'Zwanger'}
    ],
    ziekmeldingGerelateerdTot : [
      {value: 'Privé', viewValue: 'Privé'},
      {value: 'Werk', viewValue: 'Werk'},
      {value: 'Beide', viewValue: 'Beide'},
      {value: 'Onbekend', viewValue: 'Onbekend'}
    ],
    verwachteDuurZiekte : [
      {value: '1 dag', viewValue: '1 dag'},
      {value: '2 dagen', viewValue: '2 dagen'},
      {value: '3 dagen', viewValue: '3 dagen'},
      {value: '4 dagen', viewValue: '4 dagen'},
      {value: '5 dagen', viewValue: '5 dagen'},
      {value: '2 weken', viewValue: '2 weken'},
      {value: '1 maand', viewValue: '1 maand'},
      {value: 'Langdurig', viewValue: 'Langdurig'}
    ],
    evenOneven : [
      {value: 'Even', viewValue: 'Even'},
      {value: 'Odd', viewValue: 'Oneven'}
    ]
  }
  
  constructor(
    private apiService: ApiService,
    private tokenService: TokenService
  ) { }

  quickActions(list: Json[]) {
    let quickActions: { value: Json, viewValue: string }[] = []
    let item: { value: Json, viewValue: string }

    list.forEach( employee => {
      item = {
        value: { employeeId: `${employee.Id}`, managerId: `${employee.Contactpersoon_beheren__c}`},
        viewValue: `${employee.Name}`
      }

      quickActions.push(item)
    })

    return quickActions
  }

  absenteeismEmployee(list: Json[]) {
    let quickActions: PicklistItem[] = [];
    let item: PicklistItem;

    list.forEach( employee => {
      item = {
        value: `${employee.Id}`,
        viewValue: `${employee.Name}`
      }

      quickActions.push(item)
    })

    return quickActions
  }

  getDeparmentsPicklist() {
    let accountId = this.tokenService.getAccount();
    let departmentList: PicklistItem[] = [];
    let departmentsArray$ = this.apiService.getPortalData('Afdeling__c', 'Id,Name', undefined, `Bedrijf__c='${accountId}'`);

    departmentsArray$.forEach(departments => departments.forEach(
      (department: any) => {
        departmentList.push({ value: department.Id, viewValue: department.Name })
      }
    ));

    return departmentList;
  }

  getManagersPicklist() {
    let accountId = this.tokenService.getAccount();
    let managerList: PicklistItem[] = [];
    let managerArray$ = this.apiService.getPortalData('Contact', 'Id,Name', undefined, `AccountId='${accountId}' and PIM_Rollen__c='Leidinggevende'`);

    managerArray$.forEach(managers => managers.forEach(
      (manager: any) => {
        managerList.push({ value: manager.Id, viewValue: manager.Name })
      }
    ));

    return managerList;
  }


}
