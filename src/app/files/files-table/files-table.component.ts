import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { FileModel } from 'src/app/shared/model/file-model';
import { Json } from 'src/app/shared/model/json';
import { ReloaderService } from 'src/app/shared/services/reloader.service';
import { FileService } from 'src/app/shared/services/file.service';
import { StyleService } from 'src/app/_services/style.service';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { ViewFileDialogComponent } from '../view-file-dialog/view-file-dialog.component';

@Component({
  selector: 'pim-files-table',
  templateUrl: './files-table.component.html',
  styleUrls: ['./files-table.component.sass']
})
export class FilesTableComponent implements AfterViewInit, OnInit, OnChanges {
  customBackgroundColor: Json;
  @Input()
    dataSource$: Observable<FileModel[]>;
  @ViewChild(MatSort, { static: true }) 
    sort: MatSort;
  dataSource = new MatTableDataSource<FileModel>();
  tableColums: string[] = ['Title', 'PathOnClient', 'CreatedDate', 'view', 'download', 'delete'];

  constructor(
    private fileService: FileService,
    private styleService: StyleService,
    private changeDetectorRef: ChangeDetectorRef,
    private matDialog: MatDialog,
    private reloaderService: ReloaderService
  ) { 
    this.customBackgroundColor = this.styleService.getTextColor();
  }
  
  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSource$) {
      this.dataSource$.pipe(
        take(1),
        map(files => files.filter(file => file.Title !== "PROFIEL_FOTO"))
      ).subscribe(files => {
        this.dataSource.data = files;
        this.dataSource.sort = this.sort;
      });
    }
  }

  ngAfterViewInit() {
    const sortState: Sort = {active: 'CreatedDate', direction: 'desc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
    this.changeDetectorRef.detectChanges();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  downloadFile(id: string, filename: string, fileType: string) {
    this.fileService.downloadOrViewFile(true, id, filename, fileType);
  }

  deleteFile(id: string, fileName: string) {
    this.matDialog.open(ConfirmDeleteDialogComponent, {  
      data: {id, fileName},
      disableClose: true
    }).afterClosed().pipe(take(1)).subscribe(
      data => {
        if (data) {
          this.fileService.deleteFile(id).pipe(take(1)).subscribe(
            data => {
              if (data) {
                this.reloaderService.reloadData();
              }
            }
          )
        }
      }
    )
  }


  viewFile(id: string, name: string, type: string) {
    this.matDialog.open(ViewFileDialogComponent, {
      data: { id, name, type },
      width: '30vw',
      disableClose: true
    })
  }
  
}
