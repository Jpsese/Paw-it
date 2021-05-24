import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../service/firebase.service';
import { AngularFireAuth } from '@angular/fire/auth';
import * as moment from 'moment';
import { ModalController, LoadingController } from '@ionic/angular';
import { ParcelDetailsPage } from '../parcel-details/parcel-details.page';
import * as _ from 'lodash';
import { Http } from '@angular/http';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit, AfterViewInit {
  loading = null;
  hours: any;
  routes = [];
  dateNow: any;
  constructor(private router: Router, private firebase: FirebaseService, private af: AngularFireAuth,
    private modalController: ModalController, public loadingController: LoadingController, private http: Http) { }

  ngAfterViewInit() {

    this.getRoutes();
  }

  getRoutes() {
    let date: any;
    this.http.get('https://asia-east2-pawit-c3960.cloudfunctions.net/date').subscribe(res => {
      date = moment(res.json()).format('MM-DD-YYYY');

      let parcel: any;
      this.firebase.deliveryRun().subscribe(value => {

        this.hours = value.map(res => {
          let data: any;
          data = res.payload.val();
          data.key = res.payload.key;
          return data;
        })
        this.af.authState.subscribe(user => {
          this.firebase.getRoute(user.uid, date).subscribe(value => {
            this.presentLoading().then(() => {
              this.routes = [];

              parcel = value.map(res => {
                let data: any;
                data = res.payload.val();
                data.key = res.payload.key;
                return data;
              })
              console.log(parcel);

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
              }

              for (let i = 0; i < this.hours.length; i++) {
                let status = false;
                let fromTime = moment(this.hours[i].from, 'HH:mm'),
                  toTime = moment(this.hours[i].to, 'HH:mm'),
                  lastHour = moment('17:00', 'HH:mm')
                for (let j = 0; j < parcel.length; j++) {

                  const time = moment(parcel[j].time, 'HH:mm');

                  if (time.isBetween(fromTime, toTime) || time.isSame(fromTime) || (time.isSame(lastHour) && this.hours.length - 1 === i)) {
                    status = true;
                    this.hours[i].status = status;
                    this.routes.push({
                      parcel: parcel[j],
                      batch: i
                    })
                  }
                }
              }
              console.log(this.routes);
              this.routes = _.sortBy(this.routes, (a) => a.parcel.key)
              this.stopLoading();
            })
          })
        })
      })
    })
  }
  ngOnInit() {

    this.dateNow = moment().format('LL')

  }


  async presentLoading() {
    this.loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Loading tasks',
      cssClass: 'custom-spinner'
    });
    await this.loading.present();
  }

  async stopLoading() {
    await this.loading.dismiss();
  }

  async sendData(data) {
    let modal = await this.modalController.create({
      component: ParcelDetailsPage,
      componentProps: {
        route: data
      }
    })
    await modal.present();
  }

}
