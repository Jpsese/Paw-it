import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SellerBuyerAuthGuard } from '../Guard/seller-buyer-auth.guard';
import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/menu',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'seller/post-parcel',
        loadChildren: '../post-parcel/post-parcel.module#PostParcelPageModule',
        canActivate: [SellerBuyerAuthGuard]
      },
      {
        path: 'seller/pending-transaction',
        loadChildren: '../pending-transaction/pending-transaction.module#PendingTransactionPageModule',
        canActivate: [SellerBuyerAuthGuard]
      },
      {
        path: 'seller/profile',
        loadChildren: '../profile/profile.module#ProfilePageModule',
        canActivate: [SellerBuyerAuthGuard]
      },
      {
        path: 'seller/trackingpage',
        loadChildren: '../trackingpage/trackingpage.module#TrackingpagePageModule',
        canActivate: [SellerBuyerAuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule { }
