import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { FileModel } from 'src/app/shared/model/file-model';
import { Json } from 'src/app/shared/model/json';
import { ExpenseService } from 'src/app/_services/expense.service';
import { FileService } from 'src/app/shared/services/file.service';
import { StyleService } from 'src/app/_services/style.service';
import { TokenService } from 'src/app/_services/token.service';
import { UploadErrorDialogComponent } from 'src/app/files/upload-error-dialog/upload-error-dialog.component';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'pim-new-expense',
  templateUrl: './new-expense.component.html',
  styleUrls: ['./new-expense.component.sass']
})
export class NewExpenseComponent implements OnInit {
  customBackgroundColor: Json;
  employeeIdPicklist: any;
  category = "";
  expenseCategoryPicklist = [
    { value: 'Communicatie' },
    { value: 'Kantinekosten' },
    { value: 'Kantoorartikelen' },
    { value: 'Maaltijden' },
    { value: 'Overnachtingen' },
    { value: 'Parkeerkosten' },
    { value: 'Reiskosten' },
    { value: 'Representatiekosten' },
    { value: 'Overig' }
  ]
  communicatiePicklist = [
    { value: 'Mobiele telefoon' }
  ]
  kantinekostenPicklist = [
    { value: 'Persoonlijk' },
    { value: 'Kantoor' },
    { value: 'Borrel' },
    { value: 'Evenement' },
    { value: 'Algemene Lunchkosten' }
  ]
  kantoorartikelenPicklist = [
    { value: 'Persoonlijk' },
    { value: 'Kantoor' }
  ]
  maaltijdenPicklist = [
    { value: 'Diner' },
    { value: 'Lunch' },
    { value: 'Ontbijt' }
  ]
  overnachtingenPicklist = [
    { value: 'Hotelkamer' }    
  ]
  reiskostenPicklist = [
    { value: 'Woon-Werk' },
    { value: 'Werk-Werk' },    
    { value: 'Vuchten' }
  ]
  representatiekostenPicklist = [
    { value: 'Promotionele artikelen' }    
  ]
  overigPicklist = [
    { value: 'VOG' },
    { value: 'Werkkleding' }
  ]
  paymentTypePicklist = [
    { value: 'Contant' },
    { value: 'Op rekening' },
    { value: 'Eigen pinpas' },
    { value: 'Overschrijving' },
    { value: 'Overig' }
  ]
  newExpenseForm: FormGroup;
  fileToUpload: File | null;
  expenseEditData$: Observable<any>;
  attachedFile?: FileModel;
  defaultManagerId: string;

  @ViewChild('fileInput')
    fileInput: ElementRef

  constructor(
    @Inject(MAT_DIALOG_DATA)
      public data: {managerDialog: boolean, id?: string},
    private styleService: StyleService,
    private expenseService: ExpenseService,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    private datePipe: DatePipe,
    private self: MatDialogRef<NewExpenseComponent>,
    private fileService: FileService,
    private matDialog: MatDialog,
    private apiService: ApiService
  ) {
    this.customBackgroundColor = this.styleService.getCustomBackgroundColor();
   }

  ngOnInit(): void {
    this.newExpenseForm = this.setExpenseForm();
    if (this.data.managerDialog) {
      this.employeeIdPicklist = this.expenseService.getEmployeePicklistData();
    }
    if (this.data.id) {
      this.checkForFile(this.data.id);
      this.expenseEditData$ = this.expenseService.getExpenseEditData(this.data.id)
      this.expenseEditData$.pipe(take(1)).subscribe(data => {
        this.category = data.ExpenseCategory__c;
        this.newExpenseForm.patchValue(data);
      })
    }
    this.apiService.getPortalData('Contact', 'Contactpersoon_beheren__c', this.tokenService.getContact()).pipe(
      map(data => { this.defaultManagerId = data.Contactpersoon_beheren__c, console.log(data.Contactpersoon_beheren__c) })
    ).toPromise();
  }

  setExpenseForm(): FormGroup {
    return this.formBuilder.group({
      Employee_Contact__c: new FormControl(null, []),
      Amount__c: new FormControl(null, []),
      DateTransaction__c: new FormControl(null, []),
      Business_Purpose__c: new FormControl(null, []),
      ExpenseCategory__c: new FormControl(null, []),
      Payment_Type__c: new FormControl(null, []),
      Type__c: new FormControl(null, []),
      Projectnummer_Kostenplaatsnummer__c: new FormControl(null, []),
      Comments__c: new FormControl(null, [])
    });
  }

  handleFileInput(files: FileList) {
    const fileNameSplit = files[0].name.split('.');
    const fileType = fileNameSplit[fileNameSplit.length- 1];
    const MimeType = this.fileService.getMimeType(fileType);
    const maxFileSize = this.fileService.maxFileSize(files[0]);

    if (MimeType && !maxFileSize) {
      return this.fileToUpload = files[0];
    } else {
      this.fileToUpload = null;
      this.fileInput.nativeElement.value = null
      if (!MimeType) {
        return this.matDialog.open(UploadErrorDialogComponent, {
          data: 'type',
          disableClose: true
        })
      }
      if (maxFileSize) {
        return this.matDialog.open(UploadErrorDialogComponent, {
          data: 'size',
          disableClose: true
        })
      }
    }
    return
  }

  categorySelected(category: string) {
    this.category = category;
  }

  postExpense(save: boolean) {
    let managerId: string
    const today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    
    if (this.data.managerDialog) {
      managerId = this.tokenService.getContact();      
    } else {
      const userID = this.tokenService.getContact();;

      this.newExpenseForm.value.Employee_Contact__c = userID;
    }
    this.newExpenseForm.value.Manager__c = this.defaultManagerId;
    
    if (save) {
      this.newExpenseForm.value.State__c = 'Niet ingediend';
    } else {
      this.newExpenseForm.value.State__c = 'Ingediend';
      this.newExpenseForm.value.DateSubmitted__c = today;
    }

      this.expenseService.postNewExpense(this.newExpenseForm, this.self, this.fileToUpload);
  }

  updateExpense(id: string, save: boolean) {
    const today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    delete this.newExpenseForm.value.Employee_Contact__c    
    
    if (!save) {      
      let managerId = this.defaultManagerId;

      this.newExpenseForm.value.State__c = 'Ingediend';
      this.newExpenseForm.value.DateSubmitted__c = today;
      this.newExpenseForm.value.Manager__c = managerId;
    }
    
    this.expenseService.updateExpense(id, this.newExpenseForm, this.self, this.fileToUpload);
  }

  viewFile(id: string) {
    let splitArray = this.attachedFile!.PathOnClient.split('.');
    let name = splitArray[0];
    let type = splitArray[1];

    this.fileService.downloadOrViewFile(false, id, name, type);
  }

  checkForFile(id: string) {
    this.expenseService.checkForAndGetExpenseFiles(id).pipe(
      take(1)
    ).subscribe(
      data => {
        this.attachedFile = data[0]
      }
    );
  }

  deleteFile(id: string) {
    this.fileService.deleteFile(id).pipe(take(1)).subscribe(
      data => {
        if (data) {
          this.checkForFile(this.data.id!)
        }
      }
    )
  }

}
