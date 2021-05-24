import { Component, OnInit, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserDetailsService } from '../service/user-details.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-trackingmodal',
  templateUrl: './trackingmodal.page.html',
  styleUrls: ['./trackingmodal.page.scss'],
})
export class TrackingmodalPage implements OnInit {
  @Input() parcel: any;
  status: any;
  logs: any;
  filteredparcel: any;
  public null = false;
  constructor(private af: AngularFireAuth,
    private userService: UserDetailsService,
    private db: AngularFireDatabase, private modalController: ModalController) {
  }

  ngOnInit() {
    this.parcelDetails();
    this.parcelLogs();
  }
  parcelDetails() {
    console.log(this.parcel.currentStatus);
    this.parcel.currentStatus = 'hello'
    try {
      if (this.parcel.details.status === 'completed') {
        this.parcel.currentStatus = "Transaction has been completed";
      } else if (this.parcel.details.status === 'undelivered') {
        this.parcel.currentStatus = "Parcel was not delivered";
      } else if (this.parcel.status.activity === "pickUp") {

      } else if (this.parcel.status.activity === "delivery") {

      } else if (this.parcel.status.activity === "remittance") {

      } else if (this.parcel.status.activity === "in-warehouse") {
        this.parcel.currentStatus = "Parcel is currently stored inside the warehouse";
      } else if (this.parcel.status.activity === "dispatched" && this.parcel.status.status === 'delivery') {
        this.parcel.currentStatus = "Parcel is dispatched and ready to be delivered";
      } else if (this.parcel.status.activity === "dispatched" && this.parcel.status.status === 'remittance') {
        this.parcel.currentStatus = "Parcel's payment is being delivered";
      }
    } catch (error) {
      this.parcel.currentStatus = "Parcel is not yet picked up";
    }

  }
  parcelLogs() {
    return this.db.list(`postedParcels/${this.parcel.details.parcelID}/logs`).snapshotChanges().subscribe(data => {
      this.logs = data.map(res => {
        let tmp = {
          date: null,
          time: null,
          remarks: res.payload.val()
        }
        let date_time = res.payload.key.split('_')
        tmp.date = date_time[0]
        tmp.time = date_time[1]
        console.log(tmp);
        return tmp
      })
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
