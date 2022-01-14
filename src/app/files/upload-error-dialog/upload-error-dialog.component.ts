import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Json } from 'src/app/shared/model/json';
import { StyleService } from 'src/app/_services/style.service';

@Component({
  selector: 'pim-upload-error-dialog',
  templateUrl: './upload-error-dialog.component.html',
  styleUrls: ['./upload-error-dialog.component.sass']
})
export class UploadErrorDialogComponent implements OnInit {
  customBackgroundColor: Json

  constructor(
    @Inject(MAT_DIALOG_DATA)
      public error: string,
    private styleService: StyleService
  ) { 
    this.customBackgroundColor = this.styleService.getCustomBackgroundColor();
  }

  ngOnInit(): void {
  }

}
