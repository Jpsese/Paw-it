import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ParcelDetailsSchedulePage } from './parcel-details-schedule.page';

const routes: Routes = [
  {
    path: '',
    component: ParcelDetailsSchedulePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ParcelDetailsSchedulePage]
})
export class ParcelDetailsSchedulePageModule {}
