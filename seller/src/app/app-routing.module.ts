import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './seller-buyer/seller-buyer.module#SellerBuyerPageModule' },
  { path: 'menu', loadChildren: './seller-buyer/menu/menu.module#MenuPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'trackingpage', loadChildren: './seller-buyer/trackingpage/trackingpage.module#TrackingpagePageModule' },
  { path: 'pending-transaction', loadChildren: './seller-buyer/pending-transaction/pending-transaction.module#PendingTransactionPageModule' },
  { path: 'map-edit', loadChildren: './seller-buyer/map-edit/map-edit.module#MapEditPageModule' },
  { path: 'parcel-details', loadChildren: './seller-buyer/parcel-details/parcel-details.module#ParcelDetailsPageModule' },


  // { path: 'edit-request', loadChildren: './seller-buyer/edit-request/edit-request.module#EditRequestPageModule' },
  // { path: 'confirm-request', loadChildren: './seller-buyer/confirm-request/confirm-request.module#ConfirmRequestPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
