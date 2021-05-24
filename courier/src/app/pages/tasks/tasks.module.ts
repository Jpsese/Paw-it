import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TasksPage } from './tasks.page';
import { ParcelDetailsPage } from '../parcel-details/parcel-details.page';
import { WaybillPage } from '../waybill/waybill.page';
import { ReportModalPage } from '../report-modal/report-modal.page';
import { SignaturePadModule } from 'angular2-signaturepad';

const routes: Routes = [
  {
    path: '',
    component: TasksPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SignaturePadModule
  ],
  declarations: [TasksPage, ParcelDetailsPage, WaybillPage, ReportModalPage],
  entryComponents: [ParcelDetailsPage, WaybillPage, ReportModalPage]
})
export class TasksPageModule {}
