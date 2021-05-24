import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Router } from '@angular/router';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireDatabase } from 'angularfire2/database';
import { ModalController, NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import * as moment from 'moment';
import { UserServiceService } from '../../service/user-service.service';
import { Http } from '@angular/http';

@Component({
  selector: 'app-waybill',
  templateUrl: './waybill.page.html',
  styleUrls: ['./waybill.page.scss'],
})
export class WaybillPage implements OnInit, AfterViewInit {
  @ViewChild(SignaturePad) public sp: SignaturePad;
  @Input() route;
  page: any;
  constructor(
    private storage: AngularFireStorage, private db: AngularFireDatabase,
    private router: Router, private modalController: ModalController, private af: AngularFireAuth,
    private userService: UserServiceService, private http: Http) { }

  ngOnInit() {
    console.log(this.route);
  }

  private signaturePadOptions: Object = {
    'minWidth': 5,
    'canvasWidth': 380,
    'canvasHeight': 550
  };

  ngAfterViewInit() {
    this.sp.set('minWidth', 1);
  }

  confirmation() {
    this.userService.loadingSpinner(`Data is being process ...`).then(res => {
      this.http.get('https://asia-east2-pawit-c3960.cloudfunctions.net/date').subscribe(data => {

        let dateNow = moment(data.json()).format('MM-DD-YYYY');
        res.present();
        let signatureImage = this.sp.toDataURL();

        /**
        //READ BEFORE CODE
         1.Temporary pushing of data need ID of seller and parcel.
         2.Image path need ID of seller and parcel
        */
        var updateData = {};
        let timeStamp = dateNow + '_' + moment(data.json()).format('HH:mm');
        this.af.authState.subscribe(user => {
          const img = this.storage.ref(`${this.route.parcel.parcelDetails.sellerID}/${this.route.parcel.parcelID}/${this.route.parcel.status}Signature`);
          img.putString(signatureImage, 'data_url').then(() => {
            img.getDownloadURL().subscribe(url => {
              if (url) {
                this.db.list(`postedParcels/`, ref => ref.orderByChild('details/parcelID').equalTo(this.route.parcel.parcelID)).snapshotChanges().subscribe(val => {
                  this.db.list(`couriers/`, ref => ref.orderByChild('email').equalTo(user.email)).snapshotChanges().subscribe(profile => {
                    let courProfile: any;
                    courProfile = profile.map(res => {
                      return res.payload.val();
                    })
                    updateData[`/postedParcels/${this.route.parcel.parcelID}/${this.route.parcel.status}/signUrl`] = url
                    updateData[`/postedParcels/${this.route.parcel.parcelID}/${this.route.parcel.status}/done`] = true;
                    updateData[`/postedParcels/${this.route.parcel.parcelID}/status/activity`] = this.route.parcel.status;
                    if (this.route.parcel.status === 'pickUp') {
                      updateData[`/postedParcels/${this.route.parcel.parcelID}/logs/${timeStamp}/remarks`] = `Parcel has been picked up by ${courProfile[0].firstName} ${courProfile[0].lastName}`;
                    } else if (this.route.parcel.status === 'delivery') {
                      updateData[`/postedParcels/${this.route.parcel.parcelID}/logs/${timeStamp}/remarks`] = `Parcel has been delivered by ${courProfile[0].firstName} ${courProfile[0].lastName}`;
                    } else {
                      updateData[`/postedParcels/${this.route.parcel.parcelID}/logs/${timeStamp}/remarks`] = `Cash has been remmitted by ${courProfile[0].firstName} ${courProfile[0].lastName}`;
                    }
                    updateData[`/couriers/${user.uid}/routes/${dateNow}/${this.route.parcel.key}/done`] = true;
                    let parcel: any;
                    let updateStatus: any;
                    parcel = val.map(data => {
                      return data.payload.val()
                    })
                    if ((parcel[0].details.COD === 1 && parcel[0].remittance.done === true) || (parcel[0].details.COD === 0 && parcel[0].delivery.done === true)) {
                      updateData[`postedParcels/${this.route.parcel.parcelID}/details/status`] = 'completed'
                    }

                    this.db.database.ref().update(updateData, (error) => {
                      if (error) {
                        img.delete();
                        this.userService.showMessage(error, 'danger');
                        res.dismiss();
                      } else {
                        res.dismiss();
                        this.userService.showMessage('Done', 'success');
                        this.modalController.dismiss();

                      }
                    })


                    // this.db.database.ref(`/postedParcels/${this.route.parcel.parcelID}/${this.route.parcel.status}`).update({
                    //   'signUrl': url,
                    //   'done': true
                    // })

                    // let updateRoute = this.db.list(`couriers/${user.uid}/routes/06-08-2019/`);
                    // updateRoute.snapshotChanges().subscribe(data => {
                    //   updateRoute.update(this.route.parcel.key, {
                    //     'done': true
                    //   })
                    // })
                  })
                })
              }
            })
          })
        })
      })
    })



  }

  clear() {
    this.sp.clear();
  }

  cancel() {
    this.modalController.dismiss();
  }
}
