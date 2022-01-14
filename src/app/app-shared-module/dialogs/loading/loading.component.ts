import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'pim[loading]',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.sass']
})
export class LoadingComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public loadingData: any
  ) { }

  ngOnInit(): void {
    if (this.loadingData === null) {
      this.loadingData = {text: null}
    }
  }

}
