import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from '@angular/fire/auth';
import * as moment from 'moment';
import { Subject, Observable } from 'rxjs';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private routeDet = new Subject<any>();
  dateNow: any;
  constructor(private db: AngularFireDatabase, private af: AngularFireAuth, private http: Http) {
    this.dateNow = moment().format('MM-DD-YYYY');

  }


  getParcelDet(id) {
    return this.db.list(`postedParcels/`, ref => ref.orderByChild('details/parcelID').equalTo(id)).snapshotChanges();
  }

  getRoute(id, date) {
    return this.db.list(`/couriers/${id}/routes/${date}`).snapshotChanges();
  }

  deliveryRun() {
    return this.db.list(`/sysConf/deliveryRun`).snapshotChanges();
  }

  updateRouteData(data) {
    this.routeDet.next(data);
  }


}
