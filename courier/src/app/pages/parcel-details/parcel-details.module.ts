import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ParcelDetailsPage } from './parcel-details.page';
import { WaybillPage } from '../waybill/waybill.page';
import { ReportModalPage } from '../report-modal/report-modal.page';
import { SignaturePadModule } from 'angular2-signaturepad';

const routes: Routes = [
  {
    path: '',
    component: ParcelDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SignaturePadModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ParcelDetailsPage, WaybillPage, ReportModalPage],
  entryComponents: [WaybillPage, ReportModalPage]
})
export class ParcelDetailsPageModule {}
