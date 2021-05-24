import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { google } from "google-maps";
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { NavController, ModalController, AlertController, ToastController } from '@ionic/angular';
import { MapPage } from '../map/map.page';
import { FcmService } from '../../service/fcm.service';
import * as moment from 'moment';
import { UserDetailsService } from '../../service/user-details.service';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
declare var google: google;

@Component({
  selector: 'app-post-parcel',
  templateUrl: './post-parcel.page.html',
  styleUrls: ['./post-parcel.page.scss'],
})

export class PostParcelPage implements OnInit, AfterViewInit {
  public COD = false;
  dateToday: any;
  minDate: any;
  maxDate: any;
  forms: FormGroup;
  image: any = null;
  pickCoords: any = null;
  delCoords: any = null;
  CODCoords: any = null;
  pickAddress: any;
  delAddress: any;
  CODAddress: any;
  coords: any;
  userDet: any;
  profile: any;
  constructor(private fcm: FcmService, private fb: FormBuilder, private af: AngularFireAuth,
    private camera: Camera, private db: AngularFireDatabase, private storage: AngularFireStorage,
    public navCtrl: NavController, public modalController: ModalController,
    private toastController: ToastController, public alertController: AlertController,
    private router: Router,
    private cdRef: ChangeDetectorRef, private accDetails: UserDetailsService, private http: Http) {

    this.forms = fb.group({
      'description': [null, Validators.required],
      'senderName': [null, Validators.required],
      'senderContact': [null, Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
      'itemSize': [null, Validators.required],
      'recepientName': [null, Validators.required],
      'recepientContact': [null, Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
      'pickUpTime': [null, Validators.required],
      'deliveryTime': [null, Validators.required],
      'CODName': [null],
      'itemVal': [null],
      'CODContact': [null],
      'CODLoc': [null],
      'CODTime': [null]
    })

  }


  ngOnInit() {

    this.getDate();
  }

  ngAfterViewInit() {
    this.af.authState.subscribe(user => {
      this.db.list(`sellerProfile`, ref => ref.orderByChild('email').equalTo(user.email)).snapshotChanges().subscribe(data => {
        this.profile = data.map(res => {
          return res.payload.val();
        })
        this.forms.get('senderName').setValue(`${this.profile[0].firstName} ${this.profile[0].lastName}`);
        this.forms.get('senderContact').setValue(this.profile[0].contactNumber)
      })
    })

  }

  getDate() {
    let minMax;
    this.http.get('https://asia-east2-pawit-c3960.cloudfunctions.net/date').subscribe(res => {
      this.dateToday = res.json();
      this.accDetails.minMaxDate().subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].payload.key === 'minMax') {
            minMax = data[i].payload.val();
          }
        }
        this.minDate = moment(res.json()).add(minMax.minAccept, 'days').format('YYYY-MM-DD');
        this.maxDate = moment(res.json()).add(minMax.maxAccept, 'days').format('YYYY-MM-DD');
      })
    })

  }

  //setting validators of the forms
  setRemittanceFormControl() {
    if (this.COD === true) {
      this.forms.get('CODName').setValue(`${this.profile[0].firstName} ${this.profile[0].lastName}`);
      this.forms.get('CODContact').setValue(this.profile[0].contactNumber)
      this.forms.get('CODContact').setValidators([Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])]);
      this.forms.get('CODName').setValidators([Validators.required]);
      this.forms.get('CODContact').setValidators([Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])]);
      this.forms.get('CODLoc').setValidators([Validators.required]);
      this.forms.get('CODTime').setValidators([Validators.required]);
      this.forms.get('itemVal').setValidators([Validators.required]);
    } else {
      this.forms.get('CODName').setValue(null);
      this.forms.get('CODContact').setValue(null);
      this.forms.get('CODName').clearValidators();
      this.forms.get('CODContact').clearValidators();
      this.forms.get('CODLoc').clearValidators();
      this.forms.get('CODTime').clearValidators();
      this.forms.get('itemVal').clearValidators();
      this.forms.get('CODName').updateValueAndValidity();
      this.forms.get('CODContact').updateValueAndValidity();
      this.forms.get('CODLoc').updateValueAndValidity();
      this.forms.get('CODTime').updateValueAndValidity();
      this.forms.get('itemVal').updateValueAndValidity();
    }
  }



  //opens the modal maps page
  async presentModal(type) {
    if (type === 'P') {
      this.coords = this.pickCoords;
    } else if (type === 'D') {
      this.coords = this.delCoords;
    } else if (type === 'C') {
      this.coords = this.CODCoords;
    }
    let modal = await this.modalController.create({
      component: MapPage,
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

  //take a photo of the parcel
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
      this.showErrorToast('An error has occured. Please try again');
    })
  }

  //toggling of COD checkbox
  toggleCOD() {
    this.COD = !this.COD;
    this.setRemittanceFormControl();
    this.cdRef.detectChanges();
  }



  //ERROR cannot upload unless fill up COD Forms
  //posting of parcels in the database
  async postPickup(value) {
    if (this.image === null) {
      this.showErrorToast('Please take a photo of your parcel');
    } else if (this.pickCoords === null) {
      this.showErrorToast('Please select a pickup location');
    } else if (this.delCoords === null) {
      this.showErrorToast('Please select a delivery location');
    } else if (this.CODCoords === null && this.COD === true) {
      this.showErrorToast('Please select a COD location');
    } else {
      const alert = await this.alertController.create({
        cssClass: 'confirmAlert',
        header: 'Confirmation',
        message: 'Do you want to submit your request?',
        buttons: [
          {
            text: 'NO',
            role: 'cancel',
            cssClass: 'secondary'
          }, {
            text: 'YES',
            handler: () => {
              this.http.get('https://asia-east2-pawit-c3960.cloudfunctions.net/date').subscribe(res => {
                this.af.authState.subscribe(data => {
                  let remittance = {};
                  let COD = 0;
                  if (this.COD === true) {
                    COD = 1;
                    remittance = {
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
                  let details = {};
                  details = {
                    'COD': COD,
                    'datePosted': moment(res.json()).format('MM-DD-YYYY'),
                    'timePosted': moment(res.json()).format('HH:mm'),
                    'description': value.description,
                    'status': 'pending',
                    'pouchSize': value.itemSize,
                    'sellerID': data.uid
                  }

                  let pickUp = {
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

                  let delivery = {
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
                  let timeStamp: string;
                  // this.db.database.ref(`/postedParcels/P06172019-2000384`).transaction(data => {
                  //   console.log(data);
                  //   let parcel = {};
                  //   if (data) {
                  //     console.log(data);
                  //     if (data === timeStamp) {

                  //     }
                  //   } else {
                  //     return data;
                  //   }
                  // })
                  this.db.database.ref(`/postedParcels/`).transaction(data => {
                    let parcel = {};
                    timeStamp = `P${moment(res.json()).format('MMDDYYYY-HHmmSSS')}`;
                    if (data) {
                      if (!data[timeStamp]) {
                        parcel = {
                          ...data,
                          [timeStamp]: { details, pickUp, delivery, remittance }
                        }
                        return parcel;
                      } else {
                        return undefined;
                      }
                    } else {
                      return 0;
                    }
                  }, (error, commit, snap) => {
                    if (error) {
                      this.showErrorToast('An error has occured. Please try again');
                    }

                    if (commit) {
                      this.uploadImage(timeStamp);
                    } else if (!commit) {
                      this.showErrorToast('An error has occured. Please try again');
                    }
                  }).catch((error) => {
                    this.showErrorToast('An error has occured. Please try again');
                  })


                  // try {
                  //   var key = this.db.database.ref(`/postedParcels`).push({
                  //     details, pickUp, delivery, remittance
                  //   }, () => {
                  //     this.uploadImage(key);
                  //   }).key
                  // } catch (error) {
                  //   this.showErrorToast('An error has occured. Please try again');

                  // }
                })
              })
            }
          }

        ]
      });

      await alert.present();
    }

  }


  //---> Not yet sure of the imagePath
  // uploading of image
  uploadImage(key) {
    const img = this.storage.ref(`${this.af.auth.currentUser.uid}/${key}/item`);
    img.putString(this.image, 'data_url').then(() => {
      img.getDownloadURL().subscribe(url => {
        if (url) {
          this.db.database.ref(`/postedParcels/${key}/details`).update({
            'imgPath': `${this.af.auth.currentUser.uid}/${key}/item`,
            'imgUrl': url,
            parcelID: key,
          })
        }
        this.showSuccessToast();
        this.router.navigateByUrl('menu/seller/pending-transaction')
      })
    }).catch(error => {
      this.db.database.ref(`/postedParcels/${key}`).remove();
      this.showErrorToast('An error has occured. Please try again');
    })
  }

  //this method shows error messages
  async showErrorToast(message) {
    const toast = await this.toastController.create({
      message: message,
      position: 'top',
      duration: 2000,
      color: 'warning',
      animated: true,
      cssClass: 'toastMessage'
    })
    return toast.present();
  }

  //shows that the parcel has been successfully posted
  async showSuccessToast() {
    const toast = await this.toastController.create({
      message: 'Parcel has been requested',
      position: 'top',
      duration: 2000,
      color: 'success',
      animated: true,
      cssClass: 'toastMessage'
    })
    return toast.present();
  }
}
