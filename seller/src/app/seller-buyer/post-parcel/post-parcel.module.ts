import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PostParcelPage } from './post-parcel.page';
import { MapPage } from '../map/map.page';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

const routes: Routes = [
  {
    path: '',
    component: PostParcelPage
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
  declarations: [PostParcelPage,MapPage],
  entryComponents:[MapPage]


})
export class PostParcelPageModule {}
