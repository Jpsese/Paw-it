import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseService } from '../service/firebase.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
// import { AngularFireDatabase , AngularFireList } from 'angularfire2/database';
// import { FirebaseService } from './../service/firebase.service';

@Component({
  selector: 'app-parcels',
  templateUrl: './parcels.component.html',
  styleUrls: ['./parcels.component.scss']
})
export class ParcelsComponent implements OnInit {
  parcels: any;
  parcelDetails: any;
  logs: any;
  filter: any;
  packages: any;

  constructor(private db: AngularFireDatabase, private firebase: FirebaseService, private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    let a = "06-06-2019_22:24";
    let b = a.split('_');
    console.log(b);
    this.ngxService.startLoader("loader-02");
    this.getAllParcels();

  }

  parcelDet(id) {
    this.firebase.getParcDetails(id).subscribe(value => {
      this.parcelDetails = value.map(res => {
        return res.payload.val();
      });

      console.log(this.parcelDetails);
    })
  }

  getAllParcels() {
    this.packages = [];
    this.firebase.getParcels().subscribe(value => {
      this.parcels = value.map(res => {
        return res.payload.val();
      });
      this.ngxService.stopLoader("loader-02");
      let temp = [];
      for (let i = 0; i < this.parcels.length; i++) {
        if (this.parcels[i].details.status !== 'pending') {
          temp.push(this.parcels[i]);
        }
      }
      this.parcels = temp;
      this.packages = temp;
    });
  }

  getHistoryParcel(id) {
    return this.db.list(`postedParcels/${id}/logs`).snapshotChanges().subscribe(data => {
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

  filterWarehouse() {
    this.packages = [];
    for (let i = 0; i < this.parcels.length; i++) {
      if (this.parcels[i].status.activity === 'in-warehouse') {
        this.packages.push(this.parcels[i]);
      }
    }
  }

  filterStatus(filterMessage) {
    this.packages = [];
    for (let i = 0; i < this.parcels.length; i++) {
      if (this.parcels[i].details.status === filterMessage) {
        this.packages.push(this.parcels[i]);
      }
    }
  }
  changeFilter(filter) {
    if (filter === 'warehouse') {
      this.filterWarehouse();
    } else if (filter === 'completed') {
      this.filterStatus('completed');
    } else if (filter === 'current') {
      this.filterStatus('assigned');
    } else {
      this.getAllParcels();
    }
  }


}
