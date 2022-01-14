import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  contracts = [
    {id: "010", naam: "testMedewerker 3", signaleringsDatum: "2021-10-14", datumEindeProeftijd: "2021-10-31", datumEindeContract: "2022--05-31", type: "einde proeftijd"},
    {id: "011", naam: "testMedewerker 4", signaleringsDatum: "2021-10-14", datumEindeProeftijd: "2021-05-01", datumEindeContract: "2021-10-31", type: "einde contract"},
  ]

  constructor( ) { }

  getAllContracts() {
    return this.contracts
  }

}
