import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Json } from 'src/app/shared/model/json';
import { StyleService } from 'src/app/_services/style.service';

@Component({
  selector: 'pim-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.sass']
})
export class ConfirmDeleteDialogComponent implements OnInit {
  customBackgroundColor: Json

  constructor(
    @Inject(MAT_DIALOG_DATA)
      public data: {id: string, fileName: string},
    private styleService: StyleService
  ) { 
    this.customBackgroundColor = this.styleService.getCustomBackgroundColor();
  }

  ngOnInit(): void { }

}
