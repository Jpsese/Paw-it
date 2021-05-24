import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EditRequestPage } from '../edit-request/edit-request.page';
import { FirebaseService } from '../../service/firebase.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActionSheetController } from '@ionic/angular';
import { TrackingmodalPage } from '../../trackingmodal/trackingmodal.page';
import { ParcelDetailsPage } from '../parcel-details/parcel-details.page';

@Component({
  selector: 'app-pending-transaction',
  templateUrl: './pending-transaction.page.html',
  styleUrls: ['./pending-transaction.page.scss'],
})
export class PendingTransactionPage implements OnInit {
  transactionStatus = 'PENDING';
  transactionList: any;
  constructor(public modalController: ModalController, private firebase: FirebaseService,
    private af: AngularFireAuth,
    public actionSheetController: ActionSheetController) { }

  ngOnInit() {
    this.getPending();
  }

  getPending() {
    this.firebase.getPendingTrans().subscribe(value => {
      this.transactionList = value.map(res => {
        return res.payload.val();
      })
      this.sellerTransaction();
    })
  }

  getRejected() {
    this.firebase.getRejectedTrans().subscribe(value => {
      this.transactionList = value.map(res => {
        return res.payload.val();
      })
      this.sellerTransaction();
    })
  }

  getOnGoing() {
    this.firebase.getOnGoingTrans().subscribe(value => {
      this.transactionList = value.map(res => {
        return res.payload.val();
      })
      this.sellerTransaction();
    })
  }

  getUndelivered() {
    this.firebase.getUnsuccessfulTrans().subscribe(value => {
      this.transactionList = value.map(res => {
        return res.payload.val();
      })
      console.log(this.transactionList);
      this.sellerTransaction();
    })
  }

  getCompleted() {
    this.firebase.getCompletedTrans().subscribe(value => {
      this.transactionList = value.map(res => {
        return res.payload.val();
      })
      this.sellerTransaction();
    })
  }
  async presentModal(parcel) {
    let modal = await this.modalController.create({
      component: EditRequestPage,
      componentProps: {
        parcel: parcel
      }
    });
    await modal.present();
  }

  async parcelDetails(parcel) {
    let modal = await this.modalController.create({
      component: ParcelDetailsPage,
      componentProps: {
        parcel: parcel
      }
    })
    await modal.present();
  }

  async trackingModal(parcel) {
    let modal = await this.modalController.create({
      component: TrackingmodalPage,
      componentProps: {
        parcel: parcel
      }
    })
    await modal.present();
  }

  sellerTransaction() {
    let temp = [];
    this.af.authState.subscribe(data => {
      for (let i = 0; i < this.transactionList.length; i++) {
        if (this.transactionList[i].details.sellerID === data.uid) {
          temp.push(this.transactionList[i]);
        }
      }
      this.transactionList = temp;
    })
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Apply Filter',

      buttons: [{
        text: 'Pending Transaction',
        cssClass: 'alertDanger',
        handler: () => {
          this.transactionStatus = 'PENDING'
          this.transactionList = [];
          this.getPending();
        }

      }, {
        text: 'On-going Transactions',
        handler: () => {
          this.transactionStatus = 'ON-GOING';
          this.transactionList = [];
          this.getOnGoing();
        }
      }, {
        text: 'Completed Transactions',
        handler: () => {
          this.transactionStatus = 'COMPLETED';
          this.transactionList = [];
          this.getCompleted();
        }
      }, {
        text: 'Rejected Transactions',
        handler: () => {
          this.transactionStatus = 'REJECTED';
          this.transactionList = [];
          this.getRejected();
        }
      },
      {
        text: 'Undelivered Transactions',
        handler: () => {
          this.transactionStatus = 'UNDELIVERED';
          this.transactionList = [];
          this.getUndelivered();
        }
      },]
    });
    await actionSheet.present();
  }
}
