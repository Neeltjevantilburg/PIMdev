import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { switchMap, map, take } from 'rxjs/operators';
import { UnknownFileTypeDialogComponent } from '../../files/unknown-file-type-dialog/unknown-file-type-dialog.component';
import { FileModel } from '../model/file-model';
import { ApiService } from '../../_services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private apiService: ApiService,
    private matDialog: MatDialog
  ) { }

  getDirectorylist(id: string) {
    return this.apiService.getFileDirectoriesByEmployeeId(id);
  }

  getDirectoryFilesByEmployeeId(directoryIndex: number, id: string) {
    /*
     * directoryIndexes:
     * 0 = Persoonlijk
     * 1 = Pensioen
     * 2 = Ziekteverzuim
     * 3 = Salaris
     * 4 = Functioneren en beoordelen
     * 5 = Contracten
     */    
    return this.getDirectorylist(id).pipe(
      switchMap(directories => {
        let id = directories[directoryIndex].Id

        return this.apiService.getFilesByDirectoryId(id).pipe(
          map(files => {
            let FileArray: FileModel[] = []
            files.forEach(file => {          
              let splitPathOnClient = file.PathOnClient.split(".");            
              
              let modifiedFile = {
                Title: splitPathOnClient[0],
                PathOnClient: splitPathOnClient[splitPathOnClient.length-1],
                ContentDocumentId: file.ContentDocumentId,
                CreatedDate: file.CreatedDate                
              }
              FileArray.push(modifiedFile);
            })
            
            return FileArray
          })
        )
      })
    )
  }

  downloadOrViewFile(download: boolean, id: string, fileName: string, fileType: string) {
    const MIME_TYPE = this.getMimeType(fileType)
 
    if (!MIME_TYPE) {
      return this.matDialog.open(UnknownFileTypeDialogComponent, {
        data: {fileName, fileType}
      })
    }

    return this.apiService.getFileById(id).pipe(take(1))
      .subscribe(
        (response: any) => {
          let file = new Blob([response], { type: MIME_TYPE });
          let fileUrl = (window.URL ? URL : webkitURL).createObjectURL(file);

          if (download) {
            let downloadLink = document.createElement('a');
            
            downloadLink.href = fileUrl
            downloadLink.setAttribute('download', fileName);
            document.body.appendChild(downloadLink);
            downloadLink.click();
          } else {
            window.open(fileUrl, '_blank');
          }
        }
      )
  }

  deleteFile(id: string) {
    return this.apiService.deleteFileById(id)
  }

  getMimeType(fileType: string) {
    fileType.toLocaleLowerCase();
    let mimeType: string | null;

    switch (fileType) {
      // images
      case 'png':
        mimeType = 'image/png';
        break;
      case 'bmp':
        mimeType = 'image/bmp';
        break;
      case 'jpeg':
        mimeType = 'image/jpeg';
        break;
      case 'jpg':
        mimeType = 'image/jpeg';
        break;
      // files
      case 'csv':
        mimeType = 'text/csv';
        break;   
      case 'doc':
        mimeType = 'application/msword';
        break;   
      case 'docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;       
      case 'pdf':
        mimeType = 'application/pdf';
        break;   
      case 'ppt':
        mimeType = 'application/vnd.ms-powerpoint';
        break;
      case 'pptx':
        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        break;
      case 'txt':
        mimeType = 'text/plain';
        break;
      case 'xls':
        mimeType = 'application/vnd.ms-excel';
        break;
      case 'xlsx':
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.t';
        break;
      default:
        mimeType = null;
    };

    return mimeType;
  }

  maxFileSize(file: File) {
    if (file.size > 5000000) {
      return true;
    }

    return false;
  }

}
