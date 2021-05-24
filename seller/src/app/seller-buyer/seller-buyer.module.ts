import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SellerBuyerPage } from './seller-buyer.page';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { SellerBuyerAuthGuard } from './Guard/seller-buyer-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: SellerBuyerPage
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,  
    IonicModule,
    RouterModule.forChild(routes),
    AngularFireAuthModule,
    ReactiveFormsModule,
    
  ],
  providers: [
    SellerBuyerAuthGuard
  ],
  declarations: [SellerBuyerPage,]
})
export class SellerBuyerPageModule {}
