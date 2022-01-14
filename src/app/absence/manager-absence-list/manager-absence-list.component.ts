import { Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { ManageAbsenceDialogComponent } from '../manage-absence-dialog/manage-absence-dialog.component';
import { AbsenceListRowData } from '../page-absence-view/page-absence-view.component';

@Component({
  selector: 'pim-manager-absence-list',
  templateUrl: './manager-absence-list.component.html',
  styleUrls: ['./manager-absence-list.component.sass']
})
export class ManagerAbsenceListComponent implements OnDestroy, OnChanges{

  dataSource: MatTableDataSource<AbsenceListRowData>;
  private paginator: MatPaginator;

  @Input() absenceData: AbsenceListRowData[];
  leaveColumns: string[] = ['Datum', 'Uren','Status', 'QuickActions'];

  private readonly destroy$ = new Subject();
  pageSize$: Observable<number>;
  pageIndex$ = new BehaviorSubject(0);
  total$: Observable<number>;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private readonly dialog: MatDialog,
  ) { }

  ngOnDestroy(): void{
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource(changes.absenceData.currentValue);
  }

  checkAbsenceDetails(row: any): void{
      const dialogRef = this.dialog.open(ManageAbsenceDialogComponent, {
        width: '900px',
        data: row,
      });
  
      dialogRef.afterClosed().pipe(
        takeUntil(this.destroy$),
        filter((x) => !!x),
      ).subscribe();
    }
  
}
