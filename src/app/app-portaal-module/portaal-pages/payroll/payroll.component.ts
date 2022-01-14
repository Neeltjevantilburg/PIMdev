import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pim-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.sass']
})
export class PayrollComponent implements OnInit {
  logiSal = "/assets/images/LogiSal.png"

  constructor() { }

  ngOnInit(): void {
  }

  mailTo() {
    var mail = document.createElement("a");
    mail.href = "mailto:a.abdoelbasier@oakhrm.nl?subject=Informatie aanvraag LogiSal";
    mail.click();
  }

}
