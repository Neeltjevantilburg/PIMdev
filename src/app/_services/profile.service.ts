import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { TokenService } from './token.service';
import { map, switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { UploadFileDialogComponent } from '../files/upload-file-dialog/upload-file-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from '../profile/change-password-dialog/change-password-dialog.component';
import { FileService } from '../shared/services/file.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  id: string
  currentProfilePictureId: string;

  constructor(
    private tokenService: TokenService,
    private apiService: ApiService,
    private domSanitizer: DomSanitizer,
    private fileService: FileService,
    private matDialog: MatDialog
  ) { 
    this.id = this.tokenService.getContact();
  }

  getUserData() {
    const fields = 'Name,Birthdate,PIM_Rollen__c,Functienaam__r.Name,Phone';
    
    return this.apiService.getPortalData('Contact', fields, this.id);
  }
  
  getUserAge() {    
    return this.apiService.getPortalData('Contact', 'Birthdate', this.id).pipe(
      take(1),
      map(
        data => {
          const date = new Date();
          const today = new Date(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`);
          const birthdate = new Date(data.Birthdate);
  
          let calculatedAge = new Date(today.getTime() - birthdate.getTime()).getFullYear() - 1970;
  
          if (today.getMonth() < birthdate.getMonth()) {
            calculatedAge--;
          } else if (today.getMonth() === birthdate.getMonth()) {
            if (today.getDate() < birthdate.getDate()) {
              calculatedAge--;
            }
          }
          return calculatedAge;
        }
      )
    );
  }

  getProfilePicture(employeeId?: string) {
    let id = this.id

    if (employeeId) {
      id = employeeId;
    }
    
    return this.apiService.getFileDirectoriesByEmployeeId(id).pipe(
      take(1),
      map(directories => directories.filter(directory => directory.Name.includes("Persoonlijk"))),
      switchMap(directories => {
        return this.apiService.getFilesByDirectoryId(directories[0].Id).pipe(
          take(1),
          map(files => files.filter(file => file.Title.includes('PROFIEL_FOTO'))),
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
            const fileUrl = of("/assets/images/noUser.png");
            return fileUrl;
          })
        );
      })
    );
  }

  getCurrentProfilePictureId() {
    const id = this.id
    
    return this.apiService.getFileDirectoriesByEmployeeId(id).pipe(
      take(1),
      map(directories => directories.filter(directory => directory.Name.includes("Persoonlijk"))),
      switchMap(directories => {
        return this.apiService.getFilesByDirectoryId(directories[0].Id).pipe(
          take(1),
          map(files => files.filter(file => file.Title.includes('PROFIEL_FOTO'))),
          switchMap(files => { 
            let documentId = of('');
            if (files[0]) {
              documentId = of(files[0].ContentDocumentId);
            };
            return documentId;
          })
        );
      })
    );
  }

  resetPassword() {
    this.matDialog.open(ChangePasswordDialogComponent, {
      disableClose: true
    }).afterClosed().pipe(take(1)).subscribe(
      (confirm: Boolean) => {
        if (confirm) {
          this.apiService.resetPassword(this.tokenService.getUser()).pipe(
            take(1)
          ).subscribe(response => {
            this.apiService.logout();
          });
        }
      }
    )
  }

  changeProfilePicture() {
    this.matDialog.open(UploadFileDialogComponent, {
      data: { id: this.id, directoryname: 'Persoonlijk', profilePicture: true },
      width: '30vw',
      disableClose: true
    })
  }
}
