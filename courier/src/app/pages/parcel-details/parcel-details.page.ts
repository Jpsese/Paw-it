import { AfterContentInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { ModalController } from '@ionic/angular';
import { WaybillPage } from '../waybill/waybill.page';

import { ReportModalPage } from '../report-modal/report-modal.page';


declare var google;

@Component({
  selector: 'app-parcel-details',
  templateUrl: './parcel-details.page.html',
  styleUrls: ['./parcel-details.page.scss'],
})
export class ParcelDetailsPage implements OnInit, AfterContentInit {
  map;
  @ViewChild('mapElement') mapElement;
  @Input() route;
  routeDetails = [];
  constructor(private firebase: FirebaseService, private modalController: ModalController) {
  }

  ngOnInit(): void {
    this.routeDetails.push(this.route);
    console.log(this.routeDetails)
  }

  ngAfterContentInit(): void {
    this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      {
        center: { lat: this.routeDetails[0].parcel.activityDetails.location.lat, lng: this.routeDetails[0].parcel.activityDetails.location.lng },
        zoom: 20
      });
    this.addMarker();
  }
  dismiss() {
    this.modalController.dismiss();
  }

  async confirm() {
    let modal = await this.modalController.create({
      component: WaybillPage,
      componentProps: {
        route: this.route
      }
    })
    await modal.present();
  }

  addMarker() {
    let marker = new google.maps.Marker({
      position: { lat: this.routeDetails[0].parcel.activityDetails.location.lat, lng: this.routeDetails[0].parcel.activityDetails.location.lng },
      map: this.map
    })
  }

  async report() {
    let modal = await this.modalController.create({
      component: ReportModalPage,
      cssClass: "reportModal",
      componentProps: {
        route: this.route
      }
    })
    await modal.present();
  }
}