import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Json } from 'src/app/shared/model/json';
import { FileService } from 'src/app/shared/services/file.service';
import { StyleService } from 'src/app/_services/style.service';

@Component({
  selector: 'pim-view-file-dialog',
  templateUrl: './view-file-dialog.component.html',
  styleUrls: ['./view-file-dialog.component.sass']
})
export class ViewFileDialogComponent implements OnInit {
  customTextColor: Json
  fileName: string

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {id: string, name: string, type: string},
    private styleService: StyleService,
    private fileService: FileService
  ) { 
    this.customTextColor = this.styleService.getTextColor();
    this.fileName = `${this.data.name}.${this.data.type}`
  }

  ngOnInit(): void { }

  viewFile() {
    this.fileService.downloadOrViewFile(false, this.data.id, this.data.name, this.data.type);
  }

}
