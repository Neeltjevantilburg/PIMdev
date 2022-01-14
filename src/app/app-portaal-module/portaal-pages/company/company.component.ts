
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ComingSoonComponent } from 'src/app/app-shared-module/dialogs/coming-soon/coming-soon.component';
import { Json } from 'src/app/shared/model/json';
import { DepartmentService } from 'src/app/_services/api/department.service';
import { FunctionService } from 'src/app/_services/api/function.service';
import { NavigateService } from 'src/app/_services/navigate.service';
import { ScheduleService } from 'src/app/_services/api/schedule.service';
import { StyleService } from 'src/app/_services/style.service';
import { AccountFormComponent } from 'src/app/app-shared-module/dialogs/account-form/account-form.component';

@Component({
  selector: 'pim-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.sass']
})
export class CompanyComponent implements OnInit, AfterViewInit {
  defaultDialog?: MatDialogRef<ComingSoonComponent>;
  accountDialog?: MatDialogRef<AccountFormComponent>;
  tabIndex = 0;
  viewBtn = false;
  colorPalette:Array<any> = [
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#00FFFF',
    '#808080',
    '#FFC0CB',
    '#E5732B',
    '#7E5FDA'
  ]
  colorBtn = true
  color = "#E5732B";
  volledigeNaam!: string;
  status!: string;
  bedrijfsnaam!: string;
  imgSource!: string;
  accountCompleet!: boolean;
  pimLicentie!: boolean;
  logoSource = "/assets/images/OAK.png";
  bedrijf!: any;
  roosters!: Json[];

  functies!: MatTableDataSource<Json>;
  functiesColumns: string[] = ['code','naam', 'options'];

  @ViewChild("functiePaginator", {static: true})
    functiePaginator!: MatPaginator;
  @ViewChild("functieSort", {static: true})
    functieSort!: MatSort;
    
  afdelingen!: MatTableDataSource<Json>;
  afdelingenColumns: string[] = ['code','naam', 'options'];

  @ViewChild("afdelingPaginator", {static: true})
    afdelingPaginator!: MatPaginator;
  @ViewChild("afdelingSort", {static: true})
    afdelingSort!: MatSort;

  @ViewChild("colorSelect") 
    colorSelect!: ElementRef<HTMLElement>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private style: StyleService,
    private navigate: NavigateService,
    private dialog: MatDialog,
    private schedule: ScheduleService,
    private func: FunctionService,
    private deparment: DepartmentService
  ) {
  }
  
  ngOnInit(): void {
    this.color = localStorage.getItem('customColor')!;
    this.status = "in dienst";
    this.bedrijfsnaam = "OAK HRM";
    this.imgSource = "/assets/images/OAK.png";
    this.accountCompleet = true;
    this.pimLicentie = false;
    this.roosters = this.schedule.getAllEmployeesSchedules();
    this.functies = new MatTableDataSource(this.func.getAllEmployeesFunctions());
    this.afdelingen = new MatTableDataSource(this.deparment.getAllEmployeesgetDeparmentsPicklist());
    this.bedrijf = JSON.parse(localStorage.getItem('AccountData')!);
  }

  ngAfterViewInit() { 
    this.functies.paginator = this.functiePaginator;
    this.functies.sort = this.functieSort;
  
    const functieSortState: Sort = {active: 'code', direction: 'asc'};
    this.functieSort.active = functieSortState.active;
    this.functieSort.direction = functieSortState.direction;
    this.functieSort.sortChange.emit(functieSortState);

    this.afdelingen.paginator = this.afdelingPaginator;
    this.afdelingen.sort = this.afdelingSort;
  
    const afdelingSortState: Sort = {active: 'code', direction: 'asc'};
    this.afdelingSort.active = afdelingSortState.active;
    this.afdelingSort.direction = afdelingSortState.direction;
    this.afdelingSort.sortChange.emit(afdelingSortState);
    this.changeDetectorRef.detectChanges();   
  }
  
  selectColor() {
    let colorSelector: HTMLElement = this.colorSelect.nativeElement;

    colorSelector?.click();
    this.colorBtn = false;
  }

  setColor() {
    this.style.setCustomColor(this.color);
  }

  functieFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.functies.filter = filterValue.trim().toLowerCase();
  }  

  afdelingFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.afdelingen.filter = filterValue.trim().toLowerCase();
  }
  
  setIconColor(icon: boolean) {
    if (icon) {
      return "#00FF00"
    }
    else {
      return "#FF0000"
    }
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.tabIndex = tabChangeEvent.index;
    if (this.tabIndex === 0) {
      this.viewBtn = false;
    } else {
      this.viewBtn = true;
    }
  }

  close() {
    this.navigate.to('dashboard');
  }

  create(type: string) {
    this.defaultDialog = this.dialog.open(ComingSoonComponent, {
      width: '80vw',
      height: '80vh',
      disableClose: true
    });
  }

  read(type: string, id: string | null) {
    this.defaultDialog = this.dialog.open(ComingSoonComponent, {
      width: '80vw',
      height: '80vh',
      disableClose: true
    });
  }

  update(type: string, id: string | null) {
    this.defaultDialog = this.dialog.open(ComingSoonComponent, {
      width: '80vw',
      height: '80vh',
      disableClose: true
    });
  }

  updateAccount() {
    this.accountDialog = this.dialog.open(AccountFormComponent, {
      width: '80vw',
      height: '80vh',
      disableClose: true
    });
  }

  delete(type: string, id: string | null) {
    this.defaultDialog = this.dialog.open(ComingSoonComponent, {
      width: '80vw',
      height: '80vh',
      disableClose: true
    });
  }

}
