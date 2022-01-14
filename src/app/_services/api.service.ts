import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ObjectService } from 'src/app/_services/object.service';
import { NavigateService } from './navigate.service';
import { Observable } from 'rxjs';
import { Register } from '../shared/model/register';
import { FileDirectory } from '../shared/model/file-directory';
import { FileModel } from '../shared/model/file-model';
import { Json } from '../shared/model/json';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private deletePortalDataUrl = *****;
  private portalDataUrl = *****;
  private portalTokenUrl = *****;
  private registerUrl = *****;
  private requestPasswordResetUrl = *****;
  private resetPasswordUrl = *****;
  private setPasswordUrl = *****;
  private getFileDirectoriesByEmployeeIdUrl = *****;
  private getFileDirectoriesByAccountIdUrl = *****;
  private getFilesByDirectoryIdUrl = *****;
  private createContactFileUrl = *****;
  private getFileByIdUrl = *****;
  private createAttachmentFileUrl = *****;
  private ActivateDeactivateUrl = *****;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private object: ObjectService,
    private navigate: NavigateService
  ) { }

  getPortalData(table: string, fields: string, id?: string | undefined, condition?: string | undefined): Observable<any> {
    let params: any = {
        table,
        fields
    }

    if (id) {
      params.id = id
    } else if (condition) {
      params.condition = condition
    }

    return this.http.get<any>(this.portalDataUrl, {params});
  }

  deletePortalData(table: string, id: string): Observable<any>{
    return this.http.get<any>(`${this.deletePortalDataUrl}?table=${table}&id=${id}`);
  }

  postPortalData(table: string, body: any) {
    let params: any = {
      table
    }

    return this.http.post<any>(this.portalDataUrl, body, {params});
  }

  updatePortalData(table: string, id: string, body: any) {
    let params: any = {
      table,
      id
    }

    return this.http.post<any>(this.portalDataUrl, body, {params});
  }

  postRegistration(body: Register) {
    this.object.removeNull(body);

    return this.http.post<Register>(this.registerUrl, body);
  }

  setPassword(body: string, code: string, set: boolean) {
    let url: string;
    let params: any = {
      code,
    }

    if (set) {
      url = this.setPasswordUrl;
    } else {
      url = this.resetPasswordUrl;
    }

    return this.http.post(url, body, {params});
  }

  resetPassword(Username: string) {
    let params: any = {
      Username: Username,
    }

    return this.http.get(this.requestPasswordResetUrl, {params});
  }

  login(username: string, password: string) {
    const ApiUn = this.auth.api(true);
    const ApiPw = this.auth.api(false);
    const body: any = {
      "username":`${ApiUn}`,
      "password":`${ApiPw}`,
      "portalusername": `${username}`,
      "portalpassword": `${password}`
     };

    return this.http.post<any>(this.portalTokenUrl, body);
  }

  logout() {
    localStorage.clear();
    this.navigate.to('login');
  }

  getFileDirectoriesByAccountId(id: string) {
    let params: any = {
      account: id
    };

    return this.http.get<FileDirectory[]>(this.getFileDirectoriesByAccountIdUrl, {params});
  }

  getFileDirectoriesByEmployeeId(id: string) {
    let params: any = {
      contact: id
    };

    return this.http.get<FileDirectory[]>(this.getFileDirectoriesByEmployeeIdUrl, {params});
  }

  getFilesByDirectoryId(id: string) {
    let params: any = {
      id
    };

    return this.http.get<FileModel[]>(this.getFilesByDirectoryIdUrl, {params});
  }

  getFileById(id: string) {
    let params: any = {
      id
    };

    return this.http.get(this.getFileByIdUrl, { params, responseType: 'arraybuffer' });
  }

  deleteFileById(id: string) {
    let params: any = {
      table: 'contentdocument',
      id
    };

    return this.http.get(this.deletePortalDataUrl, { params });
  }

  createContactFile(formData: FormData) {
    return this.http.post(this.createContactFileUrl, formData);
  }

  createAttachmentFile(formData: FormData) {
    return this.http.post(this.createAttachmentFileUrl, formData);
  }

  activateDeactivateUser(username: string, activate: boolean, id: string) {
    let params: any = {
      username,
      activate,
      id
    };

    return this.http.post(this.ActivateDeactivateUrl, {}, { params })
  }

}
