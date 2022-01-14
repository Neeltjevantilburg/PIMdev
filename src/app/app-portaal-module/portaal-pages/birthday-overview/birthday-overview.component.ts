import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Birthday } from 'src/app/shared/model/birthday';
import { ApiService } from 'src/app/_services/api.service';
import { TokenService } from 'src/app/_services/token.service';

@Component({
  selector: 'pim-birthday-overview',
  templateUrl: './birthday-overview.component.html',
  styleUrls: ['./birthday-overview.component.sass']
})
export class BirthdayOverviewComponent implements OnInit, AfterViewInit {
  birthdays$: Observable<Birthday[]> = from([]);
  dataSource = new MatTableDataSource<Birthday>();
  displayedColumns: string[] = ['naam','datum'];
  
  constructor(
    private api: ApiService,
    private token: TokenService
  ) { }

    
  ngOnInit(): void {
    this.birthdays$ = this.api.getPortalData(
      'Contact',
      'id,name,birthdate',
      undefined,
      `AccountId='${this.token.getAccount()}'`
    )  
  }
  
  ngAfterViewInit(): void {
    this.birthdays$ = this.birthdays$.pipe(map((data) => {
      data.sort((a, b) => {
          return a.Birthdate < b.Birthdate ? -1 : 1;
       });
      return data;
      }));
    
    this.birthdays$.forEach(element => this.dataSource.data = element);
  }

}
