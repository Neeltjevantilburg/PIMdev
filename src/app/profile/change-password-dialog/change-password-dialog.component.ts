import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Json } from 'src/app/shared/model/json';
import { StyleService } from 'src/app/_services/style.service';

@Component({
  selector: 'pim-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.sass']
})
export class ChangePasswordDialogComponent implements OnInit {
  customBackgroundColor: Json;

  constructor(
    private styleService: StyleService,
    private self: MatDialogRef<ChangePasswordDialogComponent>
  ) {
    this.customBackgroundColor = this.styleService.getCustomBackgroundColor();
  }

  ngOnInit(): void {
  }

  confirmed() {
    this.self.close(true);
  }

}
