import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular'
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { google } from "google-maps";
declare var google: google;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  public mapvisibility = false;
  public addressbar = false;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('placeRef') placeRef: GooglePlaceDirective;
  @Input("coords") coords;

  googlePlacesOptions = {
    types: [],
    componentRestrictions: { country: 'ph' }
  }
  map: any;
  formattedAddress: any;
  constructor(public modalController: ModalController) { }
  mark: any;
  address: any;
  mapi: any;
  ngOnInit() {
    //the default location of the marker is set to the center of baguio city
    this.mark = {
      "location": {
        "lat": 16.4023332,
        "lng": 120.59600709999995
      }
    }
    if (this.coords) {
      this.mark.location = this.coords.data.location;
    }
    this.initMap();
  }

  //dismiss modal
  dismiss() {
    this.modalController.dismiss(this.mark, this.address);
  }


  togglesearchbar() {
    this.mapvisibility = !this.mapvisibility;
  }
  toggleaddress() {
    this.addressbar = !this.addressbar;
  }


  //auto complete address
  autoComplete(address: any) {
    this.formattedAddress = address.formatted_address;
    this.mark = {
      "location": {
        "lat": address.geometry.location.lat(),
        "lng": address.geometry.location.lng()
      }
    }
    this.initMap();
  }

  //initialize map
  initMap() {
    const location = new google.maps.LatLng(this.mark.location.lat, this.mark.location.lng);
    const options = {
      center: location,
      zoom: 20
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, options);
    google.maps.event.addListener(this.map, 'idle', () => {
      this.marker();
    })

  }

  //getting location of the marker
  marker() {
    this.mark = {
      "location": {
        "lat": this.map.getCenter().lat(),
        "lng": this.map.getCenter().lng()
      }
    }
    this.getAddress();
  }

  //returns the address of the marker
  getAddress() {
    const geocoder = new google.maps.Geocoder;
    geocoder.geocode(this.mark, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          this.address = results[0].formatted_address;
        }
      }
    })
  }

}
