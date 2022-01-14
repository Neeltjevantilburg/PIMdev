import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Json } from 'src/app/shared/model/json';
import { StyleService } from 'src/app/_services/style.service';

@Component({
  selector: 'pim-unknown-file-type-dialog',
  templateUrl: './unknown-file-type-dialog.component.html',
  styleUrls: ['./unknown-file-type-dialog.component.sass']
})
export class UnknownFileTypeDialogComponent implements OnInit {
  customBackgroundColor: Json;
  mail: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
      public data: {fileName: string, fileType: string},
    private styleService: StyleService
  ) { 
    this.customBackgroundColor = this.styleService.getCustomBackgroundColor();
    this.mail = `mailto:info@oakpim.nl?subject=Bestandstype .${data.fileType} niet ondersteund`;
  }

  ngOnInit(): void { }

}
