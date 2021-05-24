import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EditRequestPage } from './edit-request.page';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { MapEditPage } from '../map-edit/map-edit.page';

const routes: Routes = [
  {
    path: '',
    component: EditRequestPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GooglePlaceModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditRequestPage,MapEditPage],
  entryComponents:[MapEditPage]
})
export class EditRequestPageModule {}
