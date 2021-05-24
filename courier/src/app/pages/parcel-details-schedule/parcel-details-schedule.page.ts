import { AfterContentInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { ModalController } from '@ionic/angular';

declare var google;
@Component({
  selector: 'app-parcel-details-schedule',
  templateUrl: './parcel-details-schedule.page.html',
  styleUrls: ['./parcel-details-schedule.page.scss'],
})
export class ParcelDetailsSchedulePage implements OnInit {

  map;
  @ViewChild('mapElement') mapElement;
  @Input() route;
  routeDetails = [];
  constructor(private firebase: FirebaseService, private modalController: ModalController) {
  }

  ngOnInit(): void {
    this.routeDetails.push(this.route);
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

  addMarker() {
    let marker = new google.maps.Marker({
      position: { lat: this.routeDetails[0].activityDetails.location.lat, lng: this.routeDetails[0].activityDetails.location.lng },
      map: this.map
    })
  }

}
