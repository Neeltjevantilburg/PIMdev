import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  accountDataString = localStorage.getItem('AccountData');
  accountData = JSON.parse(this.accountDataString!)
  
  getCompanyUrl() {
    const website = this.accountData.Website
    let companyUrl = '#'

    if (website !== null) {
        companyUrl = `https://${website}`;
    }

    return companyUrl;
  }

  getCompanyLogo() {
    return "/assets/images/OAK.png";
  }
}
