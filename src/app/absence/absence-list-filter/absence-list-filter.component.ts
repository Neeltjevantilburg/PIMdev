import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, tap, take } from 'rxjs/operators';

type ShowModeType = "Alles" | "Goedgekeurd" | "Afgewezen" | "Ingediend";

@Component({
  selector: 'pim-absence-list-filter',
  templateUrl: './absence-list-filter.component.html',
  styleUrls: ['./absence-list-filter.component.sass']
})
export class AbsenceListFilterComponent implements OnInit {

  showModeCtrl = new FormControl(<ShowModeType>'Alles');

  filter$: Observable<string>;

  @Output() filterCriteriaChanged = new EventEmitter<string>();

  showModeOptions: string[] = [
    'Alles',
    'Goedgekeurd',
    'Afgewezen',
    'Ingediend'
  ];

  constructor() { }

  ngOnInit() {
    this.filter$ = this.showModeCtrl.valueChanges.pipe(
      startWith(this.showModeCtrl.value),
      map(x => x as ShowModeType),
    )
  }

  onSelectionChange(){
    this.filter$.pipe(
      take(1),
      map((filterValue) => this.filterCriteriaChanged.emit(filterValue))
    ).subscribe();
  }

  
      

}
