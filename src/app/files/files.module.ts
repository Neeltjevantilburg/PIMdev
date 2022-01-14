import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewFilesComponent } from './view-files/view-files.component';
import { MatIconModule } from '@angular/material/icon';
import { UploadFileDialogComponent } from './upload-file-dialog/upload-file-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FilesTableComponent } from './files-table/files-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { ViewFileDialogComponent } from './view-file-dialog/view-file-dialog.component';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog/confirm-delete-dialog.component';
import { UnknownFileTypeDialogComponent } from './unknown-file-type-dialog/unknown-file-type-dialog.component';
import { UploadErrorDialogComponent } from './upload-error-dialog/upload-error-dialog.component';

@NgModule({
  declarations: [
    ViewFilesComponent,
    UploadFileDialogComponent,
    FilesTableComponent,
    ProfileViewComponent,
    ViewFileDialogComponent,
    ConfirmDeleteDialogComponent,
    UnknownFileTypeDialogComponent,
    UploadErrorDialogComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTooltipModule,
    MatTableModule,
    MatFormFieldModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule
  ],
  exports: [
    ViewFilesComponent,
    ProfileViewComponent,
    UploadFileDialogComponent
  ]
})
export class FilesModule { }
