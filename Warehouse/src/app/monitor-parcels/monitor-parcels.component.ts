import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../service/firebase.service';
export interface SampleData {
  parcelID: string;
  parcelDesc: String;
  service: number;
  status: string;
  courier: String;
  remarks: String

}
export interface SampleCash {
  parcelID: string;
  amount: number;
  courier: string;
  remarks: string;
}
const Parcel_Mock_Data: SampleData[] = [
  { parcelID: '0007', parcelDesc: 'Lacoste T-Shirt', service: 50.00, status: 'For Delivery', courier: 'Barry Allen', remarks: 'Dispatched' },
];
@Component({
  selector: 'app-monitor-parcels',
  templateUrl: './monitor-parcels.component.html',
  styleUrls: ['./monitor-parcels.component.scss']
})
export class MonitorParcelsComponent implements OnInit {
  displayedColumns: string[] = ['parcelID', 'parcelDesc', 'service', 'status', 'courier', 'remarks'];
  dataSource = Parcel_Mock_Data;
  parcels: any;
  constructor(private firbase: FirebaseService) { }

  ngOnInit() {
    this.firbase.storedParcels().subscribe(value => {
      this.parcels = value.map(res => {
        return res.payload.val();
      })
      console.log(this.parcels);
    })
  }

} 
