import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapPage } from '../map/map.page';
import { UserDetailsService } from '../../service/user-details.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseService } from '../../service/firebase.service';
import { google } from "google-maps";
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from 'angularfire2/storage';
import { takeWhile } from 'rxjs/operators';
import { MapEditPage } from '../map-edit/map-edit.page';

declare var google: google;

@Component({
    selector: 'app-edit-request',
    templateUrl: './edit-request.page.html',
    styleUrls: ['./edit-request.page.scss'],
})
export class EditRequestPage implements OnInit {
    @Input() parcel: any
    dateToday: any;
    minDate: any;
    maxDate: any;
    pickCoords: any = null;
    delCoords: any = null;
    CODCoords: any = null;
    pickAddress: any;
    delAddress: any;
    CODAddress: any;
    coords: any;
    image: any = null;
    forms: FormGroup;
    constructor(public modalController: ModalController,
        private fb: FormBuilder, private db: AngularFireDatabase,
        private af: AngularFireAuth, private firebase: FirebaseService,
        private userDetails: UserDetailsService, private camera: Camera,
        private storage: AngularFireStorage, private userService: UserDetailsService) {
    }

    ngOnInit() {

        this.pickCoords = {
            role: this.parcel.pickUp.location.address,
            data: {
                location: {
                    lat: this.parcel.pickUp.location.lat,
                    lng: this.parcel.pickUp.location.lng
                }
            }
        };
        this.delCoords = {
            role: this.parcel.delivery.location.address,
            data: {
                location: {
                    lat: this.parcel.delivery.location.lat,
                    lng: this.parcel.delivery.location.lng
                }
            }
        };
        if (this.parcel.details.COD === 1) {

            this.forms = this.fb.group({
                itemSize: [this.parcel.details.pouchSize, Validators.required],
                description: [this.parcel.details.description, Validators.required],
                senderName: [this.parcel.pickUp.name, Validators.required],
                senderContact: [this.parcel.pickUp.contact, Validators.required],
                recepientName: [this.parcel.delivery.name, Validators.required],
                recepientContact: [this.parcel.delivery.contact, Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
                pickUpTime: [`${this.parcel.pickUp.date} ,${this.parcel.pickUp.time}`, Validators.required],
                deliveryTime: [`${this.parcel.delivery.date} ,${this.parcel.delivery.time}`, Validators.required],
                CODName: [this.parcel.remittance.name, Validators.required],
                itemVal: [this.parcel.remittance.cash, Validators.required],
                CODContact: [this.parcel.remittance.contact, Validators.required],
                CODTime: [`${this.parcel.remittance.date} ,${this.parcel.remittance.time}`, Validators.required]
            })
            this.CODCoords = {
                role: this.parcel.remittance.location.address,
                data: {
                    location: {
                        lat: this.parcel.remittance.location.lat,
                        lng: this.parcel.remittance.location.lng
                    }
                }
            };
        } else {
            this.forms = this.fb.group({
                itemSize: [this.parcel.details.pouchSize, Validators.required],
                description: [this.parcel.details.description, Validators.required],
                senderName: [this.parcel.pickUp.name, Validators.required],
                senderContact: [this.parcel.pickUp.contact, Validators.required],
                recepientName: [this.parcel.delivery.name, Validators.required],
                recepientContact: [this.parcel.delivery.contact, Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
                pickUpTime: [`${this.parcel.pickUp.date} ,${this.parcel.pickUp.time}`, Validators.required],
                deliveryTime: [`${this.parcel.delivery.date} ,${this.parcel.delivery.time}`, Validators.required],
                CODName: [null],
                itemVal: [null],
                CODContact: [null],
                CODTime: [null]
            })
        }
        this.getDate();
    }
    dismiss() {
        this.modalController.dismiss();
    }

    async takePhoto() {
        const option: CameraOptions = {
            quality: 50,
            targetHeight: 600,
            targetWidth: 600,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        }

        await this.camera.getPicture(option).then((imageData) => {
            this.image = `data:image/jpeg;base64,${imageData}`;

        }).catch((error) => {
            this.userService.showMessage('An error has occured. Please try again', 'danger')
        })
    }

    getDate() {
        let minMax;
        this.userDetails.minMaxDate().subscribe(data => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].payload.key === 'minMax') {
                    minMax = data[i].payload.val();
                }
            }
            this.minDate = moment().add(minMax.minAccept, 'days').format('YYYY-MM-DD');
            this.maxDate = moment().add(minMax.maxAccept, 'days').format('YYYY-MM-DD');
        })
    }
    async presentModal(type) {
        if (type === 'P') {
            this.coords = this.pickCoords;
        } else if (type === 'D') {
            this.coords = this.delCoords;
        } else if (type === 'C') {
            this.coords = this.CODCoords;
        }
        let modal = await this.modalController.create({
            component: MapEditPage,
            componentProps: {
                coords: this.coords
            }
        });
        modal.onDidDismiss().then((data) => {
            if (type === 'P') {
                this.pickCoords = data;
                this.pickAddress = data.role
            } else if (type === 'D') {
                this.delCoords = data;
                this.delAddress = data.role
            } else if (type === 'C') {
                this.CODCoords = data;
                this.CODAddress = data.role;
            }
        })
        await modal.present();
    }

    postPickup(value) {
        var updateData = {};
        if (this.parcel.details.COD === 1) {
            updateData[`postedParcels/${this.parcel.details.parcelID}/remittance`] = {
                'cash': value.itemVal,
                'name': value.CODName,
                'contact': value.CODContact,
                'date': moment(value.CODTime).format('MM-DD-YYYY'),
                'time': moment(value.CODTime).format('HH:mm'),
                'location': {
                    'address': this.CODCoords.role,
                    'lat': this.CODCoords.data.location.lat,
                    'lng': this.CODCoords.data.location.lng
                }
            }
        }
        if (this.image === null) {
            updateData[`postedParcels/${this.parcel.details.parcelID}/details`] = {
                'COD': this.parcel.details.COD,
                'datePosted': moment().format('MM-DD-YYYY'),
                'timePosted': moment().format('HH:mm'),
                'status': 'pending',
                'pouchSize': value.itemSize,
                'imgPath': this.parcel.details.imgPath,
                'imgUrl': this.parcel.details.imgUrl,
                'parcelID': this.parcel.details.parcelID,
                'description': value.description,
                'sellerID': this.parcel.details.sellerID
            }
        } else {
            updateData[`postedParcels/${this.parcel.details.parcelID}/details`] = {
                'COD': this.parcel.details.COD,
                'datePosted': moment().format('MM-DD-YYYY'),
                'timePosted': moment().format('HH:mm'),
                'status': 'pending',
                'pouchSize': value.itemSize,
                'description': value.description,
                'sellerID': this.parcel.details.sellerID
            }
        }


        updateData[`postedParcels/${this.parcel.details.parcelID}/pickUp`] = {
            'name': value.senderName,
            'contact': value.senderContact,
            'date': moment(value.pickUpTime).format('MM-DD-YYYY'),
            'time': moment(value.pickUpTime).format('HH:mm'),
            'location': {
                'address': this.pickCoords.role,
                'lat': this.pickCoords.data.location.lat,
                'lng': this.pickCoords.data.location.lng
            }
        }

        updateData[`postedParcels/${this.parcel.details.parcelID}/delivery`] = {
            'name': value.recepientName,
            'contact': value.recepientContact,
            'date': moment(value.deliveryTime).format('MM-DD-YYYY'),
            'time': moment(value.deliveryTime).format('HH:mm'),
            'location': {
                'address': this.delCoords.role,
                'lat': this.delCoords.data.location.lat,
                'lng': this.delCoords.data.location.lng
            }
        }


        // this.db.database.ref('/testing').transaction(data => {
        //   ctr = ctr + 1;
        //   console.log('a');
        //   let item = {}
        //   let key = `${date}_${ctr}`;
        //   if (data[key] === null) {
        //     console.log('b');
        //     item[key] = { value: key }
        //     return item;

        //   } else {
        //     console.log('a');
        //     return;
        //   }
        // })
        // console.log(updateData);

        this.db.database.ref().update(updateData, (error) => {
            if (error) {
                this.userService.showMessage(error, 'danger');
            } else {
                console.log(updateData);
                if (this.image !== null) {

                    this.uploadImage(this.parcel.details.parcelID)
                } else {
                    this.userService.showMessage('Request has been edited', 'success');
                    this.modalController.dismiss();
                }
            }
        })

        // let key = this.db.database.ref('/count').transaction(count => {
        //   return count + 1;
        // })
        // this.db.database.ref(`/countSample/${key}`).transaction(data => {
        //   if (data === null) {
        //     return { sample: key }
        //   } else {
        //     return
        //   }
        // })


    }

    uploadImage(key) {
        const img = this.storage.ref(`${this.af.auth.currentUser.uid}/${key}/item`);
        img.putString(this.image, 'data_url').then(() => {
            img.getDownloadURL().subscribe(url => {
                if (url) {
                    this.db.database.ref(`/postedParcels/${key}/details`).update({
                        'imgPath': `${this.af.auth.currentUser.uid}/${key}/item`,
                        'imgUrl': url,
                        parcelID: key,
                    }).then(data => {
                        this.userService.showMessage('Request has been edited', 'success');
                        this.modalController.dismiss();
                    })
                }
            })
        }).catch(error => {
            this.userService.showMessage('An error has occured. Please try again', 'danger')
        })
    }
}