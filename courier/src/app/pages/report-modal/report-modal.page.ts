import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { UserServiceService } from '../../service/user-service.service';
import { Http } from '@angular/http';

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.page.html',
  styleUrls: ['./report-modal.page.scss'],
})
export class ReportModalPage implements OnInit {
  @Input() route
  others = null;
  constructor(private db: AngularFireDatabase, private af: AngularFireAuth, private modalController: ModalController,
    private userService: UserServiceService, private http: Http) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }

  sendError() {
    this.http.get('https://asia-east2-pawit-c3960.cloudfunctions.net/date').subscribe(data => {
      this.userService.loadingSpinner('Report is being submitted ...').then(res => {
        res.present();
        let dateNow = moment(data.json()).format('MM-DD-YYYY')
        let timeStamp = dateNow + '_' + moment(data.json()).format('HH:mm');
        let updateData = {};
        this.af.authState.subscribe(user => {
          updateData[`/postedParcels/${this.route.parcel.parcelID}/${this.route.parcel.status}/done`] = false;
          updateData[`/couriers/${user.uid}/routes/${dateNow}/${this.route.parcel.key}/done`] = false;
          updateData[`/postedParcels/${this.route.parcel.parcelID}/${this.route.parcel.status}/reason`] = this.others
          updateData[`/couriers/${user.uid}/routes/${dateNow}/${this.route.parcel.key}/reason`] = this.others;
          updateData[`/postedParcels/${this.route.parcel.parcelID}/details/status`] = 'undelivered';
          updateData[`/postedParcels/${this.route.parcel.parcelID}/logs/${timeStamp}/remarks`] = this.others
          this.db.database.ref().update(updateData, (error) => {
            if (error) {
              res.dismiss()
            } else {
              res.dismiss();
              this.userService.showMessage(`Report has been submitted`, 'success');
              this.modalController.dismiss();
            }
          })
        })
      })
    })
  }

}
