import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { FileService } from '../shared/services/file.service';
import { ApiService } from './api.service';
import { DataService } from './data.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  companyId: string

  constructor(
    private apiService: ApiService,
    private dataService: DataService,
    private tokenService: TokenService,
    private fileService: FileService,
    private domSanitizer: DomSanitizer
  ) { 
    this.companyId = this.tokenService.getAccount();
  }

  getCompanyDetails() {
    const fields = this.dataService.accountsFields;

    return this.apiService.getPortalData('Account', fields, this.companyId);
  }
  
  getCompanyWebsiteUrl() {    
    return this.apiService.getPortalData('Account', 'Website', this.companyId);
  }

  getCompanyLogo() {
    return this.apiService.getFileDirectoriesByAccountId(this.companyId).pipe(
      take(1),
      map(directories => directories.filter(directory => directory.Name.includes("logo"))),
      switchMap(directories => {
        return this.apiService.getFilesByDirectoryId(directories[0].Id).pipe(
          take(1),
          map(files => files.filter(file => file.Title.includes('LOGO'))),
          switchMap(files => { 
            if (files[0]) {
              const FILE_TYPE = files[0].PathOnClient.split(".")[1].toLowerCase();
              const MIME_TYPE = this.fileService.getMimeType(FILE_TYPE);

              return this.apiService.getFileById(files[0].ContentDocumentId).pipe(
                map(data => {
                  const file = new Blob([data], { type: MIME_TYPE! });
                  const fileUrl = (window.URL ? URL : webkitURL).createObjectURL(file);
                  const safeFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(fileUrl);

                  return safeFileUrl;
                })
              );
            }
            const fileUrl = of("/assets/images/noLogo.jpg");
            return fileUrl;
          })
        );
      })
    );
  }

  changeLogo() {
    const id = this.tokenService.getAccount();

    console.log(id);

    // this.matDialog.open(UploadFileDialogComponent, {
    //   data: { id, directoryname: 'logo', profilePicture: true },
    //   width: '30vw',
    //   disableClose: true
    // })
  }

}
