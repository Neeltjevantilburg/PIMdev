import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { FileDirectory } from 'src/app/shared/model/file-directory';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/_services/api.service';
import { Json } from 'src/app/shared/model/json';
import { StyleService } from 'src/app/_services/style.service';
import { FormControl, FormGroup } from '@angular/forms';
import { switchMap, take } from 'rxjs/operators';
import { ProfileService } from 'src/app/_services/profile.service';
import { FileService } from 'src/app/shared/services/file.service';
import { ReloaderService } from 'src/app/shared/services/reloader.service';
import { UploadErrorDialogComponent } from '../upload-error-dialog/upload-error-dialog.component';
import { TokenService } from 'src/app/_services/token.service';
import { CompanyService } from 'src/app/shared/services/company.service';

@Component({
  selector: 'pim-upload-file-dialog',
  templateUrl: './upload-file-dialog.component.html',
  styleUrls: ['./upload-file-dialog.component.sass']
})
export class UploadFileDialogComponent implements OnInit {
  customBackgroundColor: Json;
  directoryList$: Observable<FileDirectory[]>;
  fileUploadForm: FormGroup;
  fileToUpload: File | null;
  types = [
    {value: "", viewValue: "n.v.t."},
    {value: "Legitimatiebewijs_voorkant", viewValue: "Legitimatiebewijs voorkant"},
    {value: "Legitimatiebewijs_acherkant", viewValue: "Legitimatiebewijs achterkant"},
    {value: "Bankpas_voorkant", viewValue: "Bankpas voorkant"},
    {value: "Bankpas_acherkant", viewValue: "Bankpas achterkant"},
  ];

  @ViewChild('fileInput')
    fileInput: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {id: string, directoryname: string, profilePicture?: boolean, companyLogo?: boolean},
    private apiService: ApiService,
    private styleService: StyleService,
    private self: MatDialogRef<UploadFileDialogComponent>,
    private profileService: ProfileService,
    private fileService: FileService,
    private reloaderService: ReloaderService,
    private matDialog: MatDialog,
    private tokenService: TokenService,
    private companyService: CompanyService
  ) { 
    this.customBackgroundColor = this.styleService.getCustomBackgroundColor();
  }
  
  ngOnInit(): void {
    this.fileUploadForm = new FormGroup({
      fileName: new FormControl(null, [])
    });
  }

  handleFileInput(files: FileList) {
    const fileNameSplit = files[0].name.split('.');
    const fileType = fileNameSplit[fileNameSplit.length- 1];
    const MimeType = this.fileService.getMimeType(fileType);
    const maxFileSize = this.fileService.maxFileSize(files[0]);

    if (MimeType && !maxFileSize) {
      return this.fileToUpload = files[0];
    } else {
      this.fileToUpload = null;
      this.fileInput.nativeElement.value = null
      if (!MimeType) {
        return this.matDialog.open(UploadErrorDialogComponent, {
          data: 'type',
          disableClose: true
        })
      }
      if (maxFileSize) {
        return this.matDialog.open(UploadErrorDialogComponent, {
          data: 'size',
          disableClose: true
        })
      }
    }
    return
  }

  getFileName(name: string) {
    let fileName: string;

    if (name === '') {
      fileName = this.fileToUpload!.name
    } else {
      let split = this.fileToUpload!.name.split('.');
      
      fileName = `${name}.${split[split.length-1]}`;
    }

    return fileName;
  }

  uploadFile(){
    const formData = new FormData();
    let formFileName = this.fileUploadForm.get('fileName')!.value    
    let fileName = this.getFileName(formFileName);
    if (this.data.profilePicture) {
      fileName = `PROFIEL_FOTO.${this.fileToUpload!.name.split('.')[1]}`;
    }

    formData.append('contact', this.data.id);
    formData.append('directoryname', this.data.directoryname);
    formData.append('file', this.fileToUpload!, fileName);

    this.profileService.getCurrentProfilePictureId().pipe(
      take(1),
      switchMap(fileId => {
        if (fileId !== '' && this.data.profilePicture) {
          return this.fileService.deleteFile(fileId!).pipe(
            take(1),
            switchMap(data => {
              return this.apiService.createContactFile(formData).pipe(
                take(1)
              )
            })
          )
        }
        return this.apiService.createContactFile(formData).pipe(
          take(1)
        )
      })
    ).subscribe(
      data => {
        if (this.data.profilePicture) {
          this.reloaderService.reloadProfileImg();          
        } else {
          this.reloaderService.reloadData();
        }
        this.self.close(true);
      }
    )
  }

  uploadLogo(){
    const formData = new FormData();
    const accountId = this.tokenService.getAccount();
    let formFileName = this.fileUploadForm.get('fileName')!.value    
    let fileName = this.getFileName(formFileName);
    if (this.data.profilePicture) {
      fileName = `LOGO.${this.fileToUpload!.name.split('.')[1]}`;
    }

    formData.append('account', accountId);
    formData.append('directoryname', 'Logo');
    formData.append('file', this.fileToUpload!, fileName);

    this.companyService.getCurrentLogo().pipe(
      take(1),
      switchMap(fileId => {
        if (fileId !== '' && this.data.profilePicture) {
          return this.fileService.deleteFile(fileId!).pipe(
            take(1),
            switchMap(data => {
              return this.apiService.createContactFile(formData).pipe(
                take(1)
              )
            })
          )
        }
        return this.apiService.createContactFile(formData).pipe(
          take(1)
        )
      })
    ).subscribe(
      data => {
        console.log(data)
        if (this.data.profilePicture) {
          this.reloaderService.reloadProfileImg();          
        } else if (this.data.companyLogo) {
          this.reloaderService.reloadLogoImg();
        } else {
          this.reloaderService.reloadData();
        }
        this.self.close(true);
      }
    )
  }

}
