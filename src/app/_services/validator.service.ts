import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
/*
  Display Functie voor Component:
  displayErrorMessage(field: string) {
    return this.validate.getErrorMessage(
      this.FORMULIER,
      field,
      null, // password
      null, // postcode1
      null, // postcode2
      null, // vastNummer
      null, // mobielNummer
      null, // iban
      null, // bsn
      null, // docNummer
      null, // loonheffing
      null, // btwNummer
      null, // kvkNummer
    );
  }
*/

  postcodeRegEx = /^[1-9][0-9]{3}[\s]?[A-Za-z]{2}$/;
  telefoonRegEx = /^((0|\+31|0031)[0-57-9]{1}[0-9]{2}([-]|[\s]?)[0-9]{6})|((0|\+31|0031)[0-57-9]{1}[0-9]{1}([-]|[\s]?)[0-9]{7})|((0|\+31|0031)[0-57-9]{1}[0-9]{2}([-]|[\s]?)[0-9]{3}([-]|[\s]?)[0-9]{3})|((0|\+31|0031)[0-57-9]{1}[0-9]{1}([-]|[\s]?)[0-9]{3}([-]|[\s]?)[0-9]{4})|((0|\+31|0031)[0-57-9]{1}[0-9]{2}([-]|[\s]?)[0-9]{2}([-]|[\s]?)[0-9]{2}([-]|[\s]?)[0-9]{2})|((0|\+31|0031)[0-57-9]{1}[0-9]{1}([-]|[\s]?)[0-9]{2}([-]|[\s]?)[0-9]{2}([-]|[\s]?)[0-9]{2}([-]|[\s]?)[0-9]{1})$/;
  mobielRegEx = /^((0|\+31|0031)[6]{1}([-]|[\s]?)[0-9]{8})|((0|\+31|0031)[6]{1}([-]|[\s]?)[0-9]{2}([-]|[\s]?)[0-9]{2}([-]|[\s]?)[0-9]{2}([-]|[\s]?)[0-9]{2})|((0|\+31|0031)[6]{1}([-]|[\s]?)[0-9]{3}([-]|[\s]?)[0-9]{3}([-]|[\s]?)[0-9]{2})$/;
  ibanRegEx = /^[a-zA-Z]{2}[0-9]{2}[a-zA-Z]{4}[0-9]{10}$/;
  idDocNumRegEx = /^[a-zA-Z]{2}[a-nA-Np-zP-Z0-9]{6}[0-9]{1}$/;
  bsnRegEx = /^[0-9]{9}$/;
  kvkRegEx = /^[0-9]{8}$/;
  loonheffingenRegEx = /^[0-9]{9}[lL][0-9]{2}$/;
  btwNummerRegEx = /^[a-zA-Z]{2}[0-9]{9}[bB][0-9]{2}$/;
  passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;

  constructor() { }

  getErrorMessage(
    form: FormGroup,
    field: string,
    password?: string | null,
    postcode1?: string | null,
    postcode2?: string | null,
    vastNummer?: string | null,
    mobielNummer?: string | null,
    iban?: string | null,
    bsn?: string | null,
    docNummer?: string | null,
    loonheffing?: string | null,
    btwNummer?: string | null,
    kvkNummer?: string | null
  ) {
    let fieldName = form.get(field);

    if (fieldName!.hasError('required')) {
      return 'Verplicht veld';
    }
    if (fieldName!.hasError('email')) {
      return 'Ongeldig e-mailadres';
    }
    if (fieldName!.hasError('max')) {
      return 'Maximaal 250 medewerkers';
    }
    if (fieldName!.hasError('minlength')) {
      return null;
    }
    if (fieldName!.hasError('mustMatch')) {
      return 'Wachtwoorden komen niet overeen';
    }
    if (fieldName!.hasError('pattern')) {
      switch (field) {
        case password:
          return 'Uw wachtwoord is te zwak';
        case postcode1 || postcode2:
          return 'Ongeldige postcode';
        case vastNummer:
          return 'Ongeldig vast nummer';
        case mobielNummer:
          return 'ongeldig mobiel nummer in';
        case iban:
          return 'Ongeldig IBAN';
        case bsn:
          return 'Ongeldig BSN';
        case docNummer:
          return 'Ongeldig documentnummer';
        case loonheffing:
          return 'Ongeldig loonheffingennummer';
        case btwNummer:
          return 'Ongeldig BTW-nummer';
        case kvkNummer:
          return 'Ongeldig KVK-nummer';
      }
    }

    return 'Ehm... Niet zo...';
   }

}