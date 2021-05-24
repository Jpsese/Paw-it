import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private af: AngularFireAuth, private db: AngularFireDatabase) { }


  getPendingTrans(){
    return this.db.list(`postedParcels/`, ref => ref.orderByChild('details/status').equalTo('pending')).snapshotChanges();
  }
  
  getUnsuccessfulTrans(){
    return this.db.list(`postedParcels/`, ref => ref.orderByChild('details/status').equalTo('undelivered')).snapshotChanges();
  }

  getRejectedTrans(){
    return this.db.list(`postedParcels/`, ref => ref.orderByChild(`details/status`).equalTo('rejected')).snapshotChanges();
  }

  getOnGoingTrans(){
    return this.db.list(`postedParcels/`, ref => ref.orderByChild('details/status').equalTo('assigned')).snapshotChanges();
  }

  getCompletedTrans(){
    return this.db.list(`postedParcels/`, ref => ref.orderByChild('details/status').equalTo('completed')).snapshotChanges();
  }

}
