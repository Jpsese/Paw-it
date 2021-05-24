import { Component, OnInit, ViewChild, TemplateRef, ElementRef, AfterViewInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as moment from 'moment';
import * as _ from 'lodash';
import { FirebaseService } from '../service/firebase.service';
import { Observable, forkJoin, from } from 'rxjs';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Http } from '@angular/http';



@Component({
  selector: 'app-couriers',
  templateUrl: './couriers.component.html',
  styleUrls: ['./couriers.component.scss']
})


export class CouriersComponent implements OnInit, AfterViewInit {
  displayForDispatch = true;
  isDisabled = false;
  couriers = [];
  route = [];
  fullItem = {};
  forDispatchBatches = [];
  incomingBatches = [];
  hours = [];
  date: any;
  courId: any;
  dlRun = '0';
  selectedDispatch = [];
  selectedIncoming = [];
  preDispatch = [];
  dateNow: any;
  totalIncoming: any;
  totalDispatch: any;
  selected = false;
  day: any;
  dispatchOptions = [];
  preselectOptions = [];
  drStatus: any;
  @ViewChild('dispatchDialog') dispatchDialog: TemplateRef<any>;
  @ViewChild('storeParcelDialog') storeParcelDialog: TemplateRef<any>;

  constructor(private db: AngularFireDatabase, private firebase: FirebaseService, private dialog: MatDialog, private _snackBar: MatSnackBar,
    private ngxService: NgxUiLoaderService, private http: Http) {

  }

  ngAfterViewInit() {
    this.ngxService.startLoader("loader-01");
    this.firebase.getCouriers().subscribe(value => {
      this.couriers = value.map(res => {
        let data: any;
        data = res.payload.val();
        data.key = res.payload.key;
        return data;
      })
      this.ngxService.stopLoader("loader-01");
    })
    this.firebase.deliveryRun().subscribe(value => {
      this.hours = value.map(res => {
        let data: any;
        data = res.payload.val()
        data.key = res.payload.key;
        return data;
      });
    })
  }
  ngOnInit() {
    // console.log(this.courierList.nativeElement);
    this.getDateNow();
    // this.options.forEach()
    // .subscribe(data => {
    //   for (let i = 0; i < data.length; i++) {
    //     hours[i] = data[i].payload.val();
    //     hours[i].key = data[i].key;
    //   } 
    // })
  }


  dispatch() {
    let dialogRef = this.dialog.open(this.dispatchDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === 'confirm') {
          // Insert dispatchParcel() method here.
          this.dispatchParcel();
          // Snackbar for user confirmation
          this.isDisabled = !this.isDisabled;
          this._snackBar.open('Parcels has been dispatched', "Close", {
            duration: 2000,
            horizontalPosition: 'end'
          });
        }
      }
    })
  }

  store() {
    let dialogRef = this.dialog.open(this.storeParcelDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === 'confirm') {
          // Insert storeParcel() method here.
          this.storeParcel();
          // Snackbar for user confirmation
          this._snackBar.open('Parcels has been stored', "Close", {
            duration: 2000,
            horizontalPosition: 'end'
          });
        }
      }
    })
  }

  getDateNow() {
    this.http.get('https://asia-east2-pawit-c3960.cloudfunctions.net/date').subscribe(res => {
      this.dateNow = res.json();
      this.day = moment(res.json()).format();
    });
  }




  parcelsAssign(id) {
    this.courId = id;
    var run = parseInt(this.dlRun) + 1
    console.log(`/couriers/${this.courId}/completed/${this.date}/${run}`);
    this.db.list(`/couriers/${this.courId}/completed/${this.date}/${run}`).snapshotChanges().subscribe(data => {
      try {
        this.drStatus = data[0].payload.val();
      } catch (e) {
        this.drStatus = false;
      }

    })
    this.db.list(`/couriers/${this.courId}/routes/${this.date}/`).snapshotChanges().subscribe(data => {
      this.fullItem = {};
      this.forDispatchBatches = [];
      this.incomingBatches = [];
      this.route = [];
      this.selectedDispatch = [];
      console.log(data);

      for (let i = 0; i < this.hours.length; i++) {
        console.log(this.hours[i]);
        this.route = [];
        let fromTime = moment(this.hours[i].from, 'HH:mm'),
          toTime = moment(this.hours[i].to, 'HH:mm'),
          lastHour = moment('17:00', 'HH:mm');
        for (let j = 0; j < data.length; j++) {
          console.log(this.route[j]);
          this.route[j] = data[j].payload.val();
          this.route[j].key = data[j].payload.key;
          const time = moment(this.route[j].time, 'HH:mm')

          if (time.isBetween(fromTime, toTime) || time.isSame(fromTime) || (time.isSame(lastHour) && this.hours.length - 1 === i)) {
            if (i === parseInt(this.dlRun)) {
              if ((this.route[j].status === 'delivery' && !this.route[j].COD) || this.route[j].status === 'remittance') {

                this.forDispatchBatches.push({
                  route: this.route[j],
                  batch: i
                })
                if (this.route[j].done === false) {
                  this.incomingBatches.push({
                    route: this.route[j],
                    batch: i
                  })
                  if (this.route[j].status === 'remittance') {

                    this.totalIncoming = this.route[j].cash + this.totalIncoming;
                  }
                }
                if (this.route[j].status === 'remittance') {
                  this.totalDispatch = this.route[j].cash + this.totalDispatch;

                }
                // this.selectedDispatch.push(this.route[j].parcelID);
              } else if (this.route[j].status === 'pickUp' || (this.route[j].status === 'delivery' && this.route[j].COD)) {
                if (this.route[j].status === 'pickUp' && this.route[j].done === false) {

                } else {
                  this.incomingBatches.push({
                    route: this.route[j],
                    batch: i
                  })
                }
                if ((this.route[j].status === 'delivery' && this.route[j].COD)) {
                  this.forDispatchBatches.push({
                    route: this.route[j],
                    batch: i
                  })
                  this.totalIncoming = this.route[j].cash;
                }
              }
            }
          }
        }
      }
      for (let i = 0; i < this.incomingBatches.length; i++) {
        this.firebase.getParcDetails(this.incomingBatches[i].route.parcelID).subscribe(value => {
          let details = [];
          details = value.map(res => {
            return res.payload.val()
          })
          this.incomingBatches[i].activity = details[0].status.activity;
        })
      }
      for (let i = 0; i < this.forDispatchBatches.length; i++) {
        this.firebase.getParcDetails(this.forDispatchBatches[i].route.parcelID).subscribe(value => {
          let details = [];
          details = value.map(res => {
            return res.payload.val()
          })
          this.forDispatchBatches[i].activity = details[0].status.activity
        })
      }
      // this.preDispatch = this.selectedDispatch
    })
  }


  parcelDetails(id) {
    this.firebase.getParcDetails(id).subscribe(value => {
      this.fullItem = value.map(res => {
        return res.payload.val()
      });
    })
  }


  changeDate(date) {
    this.selectedDispatch = [];
    this.selectedIncoming = []
    this.totalDispatch = 0;
    this.totalIncoming = 0;
    this.date = moment(date).format('MM-DD-YYYY');
    this.parcelsAssign(this.courId);

  }


  changeDR(run) {
    this.selectedDispatch = [];
    this.selectedIncoming = [];
    this.totalDispatch = 0;
    this.totalIncoming = 0;
    this.parcelsAssign(this.courId);
    this.dlRun = run;
  }


  selectIncomingParcels(event, key, id, status, cash) {
    if (event.option.selected) {
      this.selectedIncoming.push({
        id: id,
        key: key,
        status: status,
        cash: cash
      });
    } else {
      let index = this.selectedIncoming.indexOf(id);
      this.selectedIncoming.splice(index, 1);
    }
  }


  selectDispatchParcel(event, key, id, status, cash) {
    console.log(key);
    if (event.option.selected) {
      this.selectedDispatch.push({ id: id, key: key, status: status, cash: cash })
    } else {
      this.selectedDispatch = this.selectedDispatch.filter((obj) => {
        return obj.key !== key
      })
    }
  }


  storeParcel() {
    this.getDateNow();
    var updateData = {};
    var run = parseInt(this.dlRun) + 1;
    const timeDate = moment(this.dateNow).format('MM-DD-YYYY') + '_' + moment(this.dateNow).format('HH:mm');
    updateData[`couriers/${this.courId}/completed/${this.date}/${run}/status`] = true;

    for (let i = 0; i < this.selectedIncoming.length; i++) {
      updateData[`couriers/${this.courId}/routes/${this.date}/${this.selectedIncoming[i].key}/warehouse`] = true
      updateData[`postedParcels/${this.selectedIncoming[i].id}/status/activity`] = 'in-warehouse'
      updateData[`postedParcels/${this.selectedIncoming[i].id}/logs/${timeDate}`] = {
        remarks: 'parcel has been stored to warehouse'
      }
      updateData[`couriers/${this.courId}/routes/${this.date}/${this.selectedIncoming[i].key}/dispatched`] = false
      // console.log(this.selectedIncoming[i].status)
      // if (this.selectedIncoming[i].status === 'remittance' || (this.selectedIncoming[i].status === 'delivery')) {
      //   this.totalIncoming = this.totalIncoming - this.selectedIncoming[i].cash;
      // }
    }
    this.db.database.ref().update(updateData, (error) => {
      console.log(updateData);
      if (error) {
        console.log(error);
      }
    })
    this.selectedIncoming = []
  }


  dispatchParcel() {
    this.getDateNow();
    var updateData = {};
    var run = parseInt(this.dlRun) + 1;
    if (this.incomingBatches.length === 0) {
      updateData[`couriers/${this.courId}/completed/${this.date}/${run}/status`] = true;
    }
    const timeDate = moment(this.dateNow).format('MM-DD-YYYY') + '_' + moment(this.dateNow).format('HH:mm');
    for (let i = 0; i < this.selectedDispatch.length; i++) {
      updateData[`couriers/${this.courId}/routes/${this.date}/${this.selectedDispatch[i].key}/warehouse`] = false
      updateData[`postedParcels/${this.selectedDispatch[i].id}/status/activity`] = 'dispatched',
        updateData[`postedParcels/${this.selectedDispatch[i].id}/status/status`] = this.selectedDispatch[i].status
      updateData[`postedParcels/${this.selectedDispatch[i].id}/logs/${timeDate}`] = {
        remarks: 'parcel has been dispatch'
      }
      updateData[`couriers/${this.courId}/routes/${this.date}/${this.selectedDispatch[i].key}/dispatched`] = true
      // if(this.selectedDispatch[i].status === 'remittance'){
      //   this.totalDispatch = this.totalDispatch - this.selectedDispatch[i].cash;
      // }
    }
    this.db.database.ref().update(updateData, (error) => {
      if (error) {
        console.log(error);
      }
    })
    this.selectedDispatch = [];

  }
}
