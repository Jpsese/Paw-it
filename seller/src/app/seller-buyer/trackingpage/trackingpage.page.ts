import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserDetailsService } from '../../service/user-details.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
@Component({
  selector: 'app-trackingpage',
  templateUrl: './trackingpage.page.html',
  styleUrls: ['./trackingpage.page.scss'],
})
export class TrackingpagePage implements OnInit {
  status: any;
  logs: any;
  forms: FormGroup;
  filteredparcel: any;
  public null = false;
  constructor(private af: AngularFireAuth,
    private userService: UserDetailsService,
    private fb: FormBuilder,
    private db: AngularFireDatabase, ) {
    this.forms = fb.group({
      'trackingId': [null, Validators.required]
    })
  }

  ngOnInit() {
  }
  parcelDetails(post) {
    return this.db.list(`postedParcels/`, ref => ref.orderByChild('details/parcelID').equalTo(post.trackingId)).snapshotChanges().subscribe(data => {
      if (data != null) {
        this.status = data.map(res => {
          let tmp = {
            stat: null,
            id: null,
          }
          const parcel = res.payload.val();
          try {
            if(parcel[0].details.status === 'completed'){
              tmp.stat = 'Transaction has been completed';
            }else if (parcel[0].status.activity == "in-warehouse") {
              tmp.stat = "Parcel is currently stored inside the warehouse";
            } else if (parcel[0].status.activity == "dispatched" && parcel[0].status.status === 'delivery') {
              tmp.stat = "Parcel is dispatched and ready to be delivered";
            } else if (parcel[0].status.activity == "dispatched" && parcel[0].status.status === 'remittance') {
              tmp.stat = "Parcel's payment is being delivered";
            }
          } catch (error) {
            tmp.stat = "Parcel is not yet picked up";
          }
          tmp.id = post.trackingId;
          return tmp
        })
      } else if (data == null) {
        this.null = true;
      }
    });
  }
  parcelLogs(post) {
    return this.db.list(`postedParcels/${post.trackingId}/logs`).snapshotChanges().subscribe(data => {
      this.logs = data.map(res => {
        let tmp = {
          date: null,
          time: null,
          remarks: res.payload.val()
        }
        let date_time = res.payload.key.split('_')
        tmp.date = date_time[0]
        tmp.time = date_time[1]
        return tmp
      })
    });
  }

}

