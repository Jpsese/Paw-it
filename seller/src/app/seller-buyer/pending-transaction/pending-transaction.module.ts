import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PendingTransactionPage } from './pending-transaction.page';
import { EditRequestPage } from '../edit-request/edit-request.page';

import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { MapEditPage } from '../map-edit/map-edit.page';
import { TrackingmodalPage } from '../../trackingmodal/trackingmodal.page';
import { ParcelDetailsPage } from '../parcel-details/parcel-details.page';

const routes: Routes = [
  {
    path: '',
    component: PendingTransactionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    GooglePlaceModule
  ],
  declarations: [PendingTransactionPage, EditRequestPage, MapEditPage, TrackingmodalPage, ParcelDetailsPage],
  entryComponents: [EditRequestPage, MapEditPage, TrackingmodalPage, ParcelDetailsPage]
})
export class PendingTransactionPageModule { }
