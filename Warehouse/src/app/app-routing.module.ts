import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonitorParcelsComponent } from './monitor-parcels/monitor-parcels.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CouriersComponent } from './couriers/couriers.component';
import { ParcelsComponent } from './parcels/parcels.component';
import { LoginComponent } from './login/login.component';
import { WarehouseAuthGuard } from './warehouse-auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [WarehouseAuthGuard]
  },
  {
    path: 'couriers',
    component: CouriersComponent,
    canActivate: [WarehouseAuthGuard]
  },
  {
    path: 'parcels',
    component: ParcelsComponent,
    canActivate: [WarehouseAuthGuard]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
