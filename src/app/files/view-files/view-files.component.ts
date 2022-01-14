import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Contact } from 'src/app/shared/model/contact';
import { FileModel } from 'src/app/shared/model/file-model';
import { Json } from 'src/app/shared/model/json';
import { ReloaderService } from 'src/app/shared/services/reloader.service';
import { FileService } from 'src/app/shared/services/file.service';
import { StyleService } from 'src/app/_services/style.service';
import { TokenService } from 'src/app/_services/token.service';
import { UploadFileDialogComponent } from '../upload-file-dialog/upload-file-dialog.component';

@Component({
  selector: 'pim-view-files',
  templateUrl: './view-files.component.html',
  styleUrls: ['./view-files.component.sass']
})
export class ViewFilesComponent implements OnInit, OnDestroy {
  @Input()
  contact$: Observable<Contact>;
  imgSource = "/assets/images/noUser.png";
  view = 'persoonlijk';
  viewName = 'Persoonlijk';
  btnStyle = {
    persoonlijk : 'active-button',
    pensioen : 'inactive-button',
    ziekteverzuim : 'inactive-button',
    salaris : 'inactive-button',
    functioneren_en_beoordelen : 'inactive-button'
  }
  employeeId: string;
  customBackgroundColor: Json;

  persoonlijkDirectoryFileList$: Observable<FileModel[]>
  pensioenDirectoryFileList$: Observable<FileModel[]>
  ziekteverzuimDirectoryFileList$: Observable<FileModel[]>
  salarisDirectoryFileList$: Observable<FileModel[]>
  functionerenEnBeoordelenDirectoryFileList$: Observable<FileModel[]>  
  contractenDirectoryFileList$: Observable<FileModel[]>
  reloaderSubscription: Subscription

  constructor(
    private styleService: StyleService,
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService,
    private matDialog: MatDialog,
    private fileService: FileService,
    private reloaderService: ReloaderService
  ) {
    this.customBackgroundColor = this.styleService.getCustomBackgroundColor();
  }

  ngOnInit(): void {
    this.employeeId = this.activatedRoute.snapshot.params.id
 
    if (!this.employeeId) {
      this.employeeId = this.tokenService.getContact()
    }

    this.reloaderSubscription = this.reloaderService.reload$.subscribe(() => {
      this.getFiles();
    });
   }

   ngOnDestroy(): void {
    this.reloaderSubscription.unsubscribe();
  }

   getFiles() {
     this.persoonlijkDirectoryFileList$ = this.fileService.getDirectoryFilesByEmployeeId(0, this.employeeId);
     this.pensioenDirectoryFileList$ = this.fileService.getDirectoryFilesByEmployeeId(1, this.employeeId);
     this.ziekteverzuimDirectoryFileList$ = this.fileService.getDirectoryFilesByEmployeeId(2, this.employeeId);
     this.salarisDirectoryFileList$ = this.fileService.getDirectoryFilesByEmployeeId(3, this.employeeId);
     this.functionerenEnBeoordelenDirectoryFileList$ = this.fileService.getDirectoryFilesByEmployeeId(4, this.employeeId);
     this.contractenDirectoryFileList$ = this.fileService.getDirectoryFilesByEmployeeId(5, this.employeeId);
   }

  addFile() {
    this.matDialog.open(UploadFileDialogComponent, {
      data: { id: this.employeeId, directoryname: this.viewName },
      width: '30vw',
      disableClose: true
    }).afterClosed().pipe(take(1)).subscribe(
      reload => {
        if (reload) {
          this.reloaderService.reloadData();
        }
      }
    )
  }

  switchContent(contentType: string) {
    this.styleService.setButtonStyle(this.btnStyle, contentType);
    this.viewName = this.styleService.setViewName(contentType);
    this.view = contentType;
  }

}
