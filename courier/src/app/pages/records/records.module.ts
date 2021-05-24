import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RecordsPage } from './records.page';
import { ParcelDetailsPage } from '../parcel-details/parcel-details.page';
import { ParcelDetailsRecordsPage } from '../parcel-details-records/parcel-details-records.page';
import { ParcelDetailsRecordsPageModule } from '../parcel-details-records/parcel-details-records.module';

const routes: Routes = [
  {
    path: '',
    component: RecordsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [RecordsPage, ParcelDetailsRecordsPage],
  entryComponents: [ParcelDetailsRecordsPage]
})
export class RecordsPageModule {}
