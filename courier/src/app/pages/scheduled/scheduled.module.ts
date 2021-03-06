import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ScheduledPage } from './scheduled.page';
import { ParcelDetailsSchedulePage } from '../parcel-details-schedule/parcel-details-schedule.page';
import { ParcelDetailsSchedulePageModule } from '../parcel-details-schedule/parcel-details-schedule.module';

const routes: Routes = [
  {
    path: '',
    component: ScheduledPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ScheduledPage, ParcelDetailsSchedulePage],
  entryComponents: [ParcelDetailsSchedulePage]
})
export class ScheduledPageModule { }
