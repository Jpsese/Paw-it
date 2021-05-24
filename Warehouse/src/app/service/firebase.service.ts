import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private db: AngularFireDatabase) { }

  getParcels() {
    return this.db.list(`postedParcels`, ref => ref.orderByChild('details/status').equalTo('assigned')).snapshotChanges()

  }

  getParcDetails(id) {
    return this.db.list(`postedParcels/`, ref => ref.orderByChild('details/parcelID').equalTo(id)).snapshotChanges();
  }

  getCouriers() {
    return this.db.list('/couriers').snapshotChanges()
  }

  deliveryRun() {
    return this.db.list(`/sysConf/deliveryRun`).snapshotChanges()
  }

  storedParcels(){
    return this.db.list(`postedParcels/`, ref => ref.orderByChild('details/status')).snapshotChanges();
  }

  // ref => ref.orderByChild('status/activity').equalTo('warehouse')
}
