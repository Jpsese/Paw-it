import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FirebaseService } from '../../service/firebase.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ModalController } from '@ionic/angular';
import { ParcelDetailsRecordsPage } from '../parcel-details-records/parcel-details-records.page';
import { ParcelDetailsSchedulePage } from '../parcel-details-schedule/parcel-details-schedule.page';
import { Http } from '@angular/http';

@Component({
  selector: 'app-scheduled',
  templateUrl: './scheduled.page.html',
  styleUrls: ['./scheduled.page.scss'],
})
export class ScheduledPage implements OnInit {
  maxDay: any;
  minYear: any;
  date: any;
  routes: any;
  constructor(private firebase: FirebaseService, private af: AngularFireAuth, private modalController: ModalController,
    private http: Http) { }

  ngOnInit() {
    this.http.get('https://asia-east2-pawit-c3960.cloudfunctions.net/date').subscribe(res => {
      this.maxDay = moment(res.json()).add(30, 'days').format('YYYY-MM-DD')
      this.minYear = moment(res.json()).add(1, 'days').format('YYYY-MM-DD');
      this.date = moment(res.json()).add(1, 'days').format('MM-DD-YYYY')
      this.getSchedule();
    })
  }



  getSchedule() {
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
          this.routes[i] = parcel[i]
        }
      })
    })
  }
  changeDate(date) {
    this.date = moment(date).format('MM-DD-YYYY');
    this.getSchedule();
  }
  async sendData(data) {
    let modal = await this.modalController.create({
      component: ParcelDetailsSchedulePage,
      componentProps: {
        route: data
      }
    })
    await modal.present();
  }
}
