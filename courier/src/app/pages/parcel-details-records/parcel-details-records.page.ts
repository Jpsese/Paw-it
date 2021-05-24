import { AfterContentInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { ModalController } from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-parcel-details-records',
  templateUrl: './parcel-details-records.page.html',
  styleUrls: ['./parcel-details-records.page.scss'],
})
export class ParcelDetailsRecordsPage implements OnInit {
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
        center: { lat: this.routeDetails[0].activityDetails.location.lat, lng: this.routeDetails[0].activityDetails.location.lng },
        zoom: 20
      });
    this.addMarker();
  }
  dismiss() {
    this.modalController.dismiss();
  }

  // async confirm() {
  //   let modal = await this.modalController.create({
  //     component: WaybillPage,
  //     componentProps: {
  //       route: this.route
  //     }
  //   })
  //   await modal.present();
  // }

  addMarker() {
    let marker = new google.maps.Marker({
      position: { lat: this.routeDetails[0].activityDetails.location.lat, lng: this.routeDetails[0].activityDetails.location.lng },
      map: this.map
    })
  }

  // async report() {
  //   let modal = await this.modalController.create({
  //     component: ReportModalPage,
  //     cssClass: "reportModal",
  //     componentProps: {
  //       route: this.route
  //     }
  //   })
  //   await modal.present();
  // }
}
