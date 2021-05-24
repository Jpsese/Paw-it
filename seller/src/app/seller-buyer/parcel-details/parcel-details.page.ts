import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-parcel-details',
  templateUrl: './parcel-details.page.html',
  styleUrls: ['./parcel-details.page.scss'],
})
export class ParcelDetailsPage implements OnInit {
  @Input() parcel: any
  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
