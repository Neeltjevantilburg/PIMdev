import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ExpenseTableSource } from 'src/app/shared/model/expense-table-source';
import { ReloaderService } from 'src/app/shared/services/reloader.service';
import { ApiService } from 'src/app/_services/api.service';
import { TokenService } from 'src/app/_services/token.service';

@Component({
  selector: 'pim-task-overview',
  templateUrl: './task-overview.component.html',
  styleUrls: ['./task-overview.component.sass']
})
export class TaskOverviewComponent implements OnInit {
  reloaderSubscription: Subscription;
  dataSource$: Observable<ExpenseTableSource[]>	
  dataSource = new MatTableDataSource<ExpenseTableSource>();
  displayedColumns: string[] = ['complete','actie'];
  
  constructor(
    private api: ApiService,
    private token: TokenService,
    private reloaderService: ReloaderService
  ) { }
    
  ngOnInit(): void {
    this.reloaderSubscription = this.reloaderService.reload$.subscribe(data => {
      this.dataSource$ = this.getTasks();
      this.dataSource$.pipe(
        take(1)
      ).subscribe(tasks => {
        this.dataSource.data = tasks;
      });
    });
  }

  getTasks() {
    return this.api.getPortalData(
      'Task',
      'Id, WhatId, Status, Subject, what.type, who.name',
      undefined,
      `whoid= '${this.token.getContact()}'`
    )
  }

  completeTask(id: string, isChecked: any) {
    if (isChecked) {
      const body = { Status : 'Completed' }

      this.api.updatePortalData(
        'Task',
        id,
        body
      ).pipe(
        take(1)
      ).subscribe(
        data => {
          if (data.success) {
            this.reloaderService.reloadData();
          }          
        }
      )
    }
  }

}
