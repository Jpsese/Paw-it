import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      { path: 'tasks', loadChildren: '../tasks/tasks.module#TasksPageModule' },
      { path: 'scheduled', loadChildren: '../scheduled/scheduled.module#ScheduledPageModule' },
      { path: 'records', loadChildren: '../records/records.module#RecordsPageModule' },
      { path: 'barcode', loadChildren: '../barcode/barcode.module#BarcodePageModule' },
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tasks',
    pathMatch: "full"
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
