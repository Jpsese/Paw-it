import { NgModule, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WaybillPage } from './waybill.page';
import { SignaturePadModule } from 'angular2-signaturepad';


const routes: Routes = [
  {
    path: '',
    component: WaybillPage
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
  declarations: [WaybillPage]
})
export class WaybillPageModule {}
