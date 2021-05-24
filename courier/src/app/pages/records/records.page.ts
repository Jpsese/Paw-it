import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseService } from '../../service/firebase.service';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';
import { ParcelDetailsRecordsPage } from '../parcel-details-records/parcel-details-records.page';
import { Http } from '@angular/http';

@Component({
  selector: 'app-records',
  templateUrl: './records.page.html',
  styleUrls: ['./records.page.scss'],
})
export class RecordsPage implements OnInit, AfterViewInit {
  date: any;
  routes: any;
  maxDay: any;
  minYear: any;
  constructor(private db: AngularFireDatabase, private af: AngularFireAuth,
    private firebase: FirebaseService, private modalController: ModalController, private http: Http) { }

  ngOnInit() {
    this.http.get('https://asia-east2-pawit-c3960.cloudfunctions.net/date').subscribe(res => {
      this.maxDay = moment(res.json()).subtract(1, 'days').format('YYYY-MM-DD')
      this.minYear = moment(res.json()).subtract(1, 'years').format('YYYY');
      this.date = moment(res.json()).subtract(1, 'days').format('MM-DD-YYYY');
    })
  }

  ngAfterViewInit() {
    this.getRecords();
  }

  changeDate(date) {
    this.date = moment(date).format('MM-DD-YYYY');
    this.getRecords();
  }

  getRecords() {
    this.af.authState.subscribe(user => {
      this.firebase.getRoute(user.uid, this.date).subscribe(value => {
        let parcel = [];
        this.routes = []
        parcel = value.map(res => {
          let data: any;
          data = res.payload.val();
          data.key = res.payload.key;
          return data;
        })
        for (let i = 0; i < parcel.length; i++) {
          let details = [];
          this.firebase.getParcelDet(parcel[i].parcelID).subscribe(value => {
            details = value.map(res => {
              return res.payload.val()
            })
            const activity = parcel[i].status
            parcel[i].parcelDetails = details[0].details;
            if (activity === 'pickUp') {
              parcel[i].activityDetails = details[0].pickUp
              parcel[i].activity = 'Pick up'
            } else if (activity === 'delivery') {
              parcel[i].activityDetails = details[0].delivery
              parcel[i].activity = 'Delivery'
            } else if (activity === 'remittance') {
              parcel[i].activityDetails = details[0].remittance
              parcel[i].activity = 'Remittance'
            }
          })
          this.routes[i] = parcel[i];
          console.log(this.routes[i]);
        }
        console.log(this.routes);
      })
    })
  }

  async sendData(data) {
    let modal = await this.modalController.create({
      component: ParcelDetailsRecordsPage,
      componentProps: {
        route: data
      }
    })
    await modal.present();
  }
}
