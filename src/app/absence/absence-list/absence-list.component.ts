import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { AbsenceService } from '../absence.service';
import { ManageAbsenceDialogComponent } from '../manage-absence-dialog/manage-absence-dialog.component';
import { AbsenceListRowData } from '../page-absence-view/page-absence-view.component';


@Component({
  selector: 'pim-absence-list',
  templateUrl: './absence-list.component.html',
  styleUrls: ['./absence-list.component.sass']
})
export class AbsenceListComponent implements OnInit, OnChanges {
  dataSource: MatTableDataSource<AbsenceListRowData>;
  private paginator: MatPaginator;
  loading$ = this.loadingService.loading$;

  private readonly destroy$ = new Subject();

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  }

  pageSize$: Observable<number>;
  pageIndex$ = new BehaviorSubject(0);
  total$: Observable<number>;

  @Input() absenceData: AbsenceListRowData[];

  leaveColumns: string[] = ['Werknemer','Datum', 'Uren','Status', 'QuickActions'];

  constructor(
    private dialog: MatDialog,
    private readonly absenceService: AbsenceService,
    private readonly loadingService: LoadingService,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.absenceData);
    this.total$ = of(this.absenceData.length);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource(changes.absenceData.currentValue);
  }

  checkAbcenseDetails(selectedRow: any): void{
    const dialogRef = this.dialog.open(ManageAbsenceDialogComponent, {
      width: '900px',
      data: selectedRow,
    });

    dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$),
      filter((x) => !!x),
      map(() => this.absenceService.setReload(true)),
    ).subscribe();
  }

}
