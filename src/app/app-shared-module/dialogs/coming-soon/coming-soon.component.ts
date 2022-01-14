import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'pim-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.sass']
})
export class ComingSoonComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public formData: any
  ) { }

  ngOnInit(): void { }

}
