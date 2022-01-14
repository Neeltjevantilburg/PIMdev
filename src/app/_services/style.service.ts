import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Json } from '../shared/model/json';
import { ReloaderService } from '../shared/services/reloader.service';
import { ApiService } from './api.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class StyleService {
  public customBackgroundColor: Json = { 'background-color': '#E5732B' };
  public customTextColor: Json = { 'color': '#E5732B' };

  constructor(
    private api: ApiService,
    private token: TokenService,
    private reloaderService: ReloaderService
  ) { }

  setContent(headerHeight: number) {
    let viewportHeight: number = window.innerHeight;
    let contentHeight: number;
    
    contentHeight = viewportHeight - headerHeight - 9;

    return { 'height': `${contentHeight}px` };
  }

  loginContentHeight() {
    let layoutHeight = window.innerHeight*0.4;
    let contentHeight = window.innerHeight - layoutHeight;

    return { 'height': `${contentHeight}px` };
  }

  setCompanyLogo(logoWidth: number) {
    let width: number = logoWidth*0.9;

    return {
      'position': 'absolute',
      'width': `${width}px`,
      'margin': '0.4%'
    };
  }

  setPimLogo(logoWidth: number) {
    return {
      'z-index': '1',
      'max-height': '85%'
    };
  }

  setBtnStyle(obj: any, name: string, style: Json) {
    let color = localStorage.getItem('customColor');

    Object.keys(obj).forEach((key) => {
      if (key === name) {
        obj[key].button = style;
        obj[key].icon = {'color': `${color}`};
        obj[key].text = {'color': `${color}`};
      } else {
        obj[key].button = {};
        obj[key].icon = {'color': '#808080'};
        obj[key].text = {'color': '#808080'};
      }
    })
  }

  async setCustomColor(color: string) {
    localStorage.setItem('customColor', color);
    this.reloaderService.reloadData();
    await this.api.updatePortalData('Account', this.token.getAccount(), { 'Kleurcode__c' : `${color}` }).toPromise();
  }

  getCustomBackgroundColor(): Json{
    let customBackgroundColor: Json = { 'background-color': '#E5732B' };
    let customColor = localStorage.getItem('customColor');

    if (customColor) {
      customBackgroundColor['background-color'] = customColor
    }
    
    return customBackgroundColor;
  }

  async getAccountCustomColor() {
    const accountId = this.token.getAccount()

    await this.api.getPortalData('Account', 'Kleurcode__c', accountId).pipe(
      map(account => localStorage.setItem('customColor', account.Kleurcode__c))
    ).toPromise();
  }

  getTextColor(): Json{
    let color = localStorage.getItem('customColor');

    if (color) {
      this.customTextColor['color'] = color
    }
    
    return this.customTextColor;
  }

  setButtonStyle(styleObj: any, contentType: string) {
    let obj: any = styleObj;

    return Object.keys(obj).forEach((key) => {
      if (key === contentType && obj[key] !== 'active-button') {
        obj[key] = 'active-button';
      }
      if (key !== contentType && obj[key] === 'active-button') {
        obj[key] = 'inactive-button';
      }
    })
  }

  setTabStyle(styleObj: any, contentType: string) {
    let obj: any = styleObj;

    return Object.keys(obj).forEach((key) => {
      if (key === contentType && obj[key] !== 'active') {
        obj[key] = 'active';
      }
      if (key !== contentType && obj[key] === 'active') {
        obj[key] = 'inactive';
      }
    })
  }

  setViewName(contentType: string) {
    let viewName = '';
    
    if (contentType === 'financiele_gegevens') {
      viewName = 'financiële gegevens';
    } else if (contentType === 'functioneren_en_beoordelen') {
      viewName = 'functioneren en beoordelen';
    } else {
      viewName = contentType
    }
    viewName = viewName[0].toUpperCase() + viewName.slice(1);

    return viewName;
  }

}
