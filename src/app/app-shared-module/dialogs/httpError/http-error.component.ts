import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'pim-[http-error]',
  templateUrl: './http-error.component.html',
  styleUrls: ['./http-error.component.sass']
})
export class HttpErrorComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public errorData: any
  ) { }

  ngOnInit(): void {
    if (this.errorData === null) {
      this.errorData = {text: null}
    }
  }

}
