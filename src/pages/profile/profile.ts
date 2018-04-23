import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Profile } from '../../models/profile.model';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore,AngularFirestoreDocument }  from "angularfire2/firestore";
import 'rxjs/add/operator/map';
import { storage } from 'firebase';
import { Camera, CameraOptions } from "@ionic-native/camera";


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit {

url: any;
profieData: AngularFirestoreDocument<Profile>;
myProfile: Observable<Profile>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private camera: Camera,
    private alertCtrl: AlertController, 
  ) { }
  
  
  ngOnInit() {
    this.afAuth.authState.subscribe(auth => {
      this.profieData = this.afs.doc(`profile/${auth.uid}`)
      this.myProfile = this.profieData.valueChanges();
      this.profieData.valueChanges();
      });
  }

  async pictureFromCamera() {
    try{
    const options: CameraOptions = {
      quality: 100,
      targetHeight:800,
      targetWidth: 400,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    }
    
    const result = await this.camera.getPicture(options);
    const image = `data:image/jpg;base64,${result}`;
    this.afAuth.authState.subscribe(auth => {
    const pictures = storage().ref(`profilePic/${auth.uid}`);
    pictures.putString(image, 'data_url');
//update url
    pictures.getDownloadURL().then((url)=> {
      this.url = url;
      this.url.toString();
      this.profieData.update({profileUrl: this.url});
    })
});
  }
  catch(e){
    console.error(e);
  }
}

  // info toast about profiles
ionViewWillEnter(){
    let toast = this.toastCtrl.create({
      message: `It is important to keep your profile up to date, 
      this is what other users see when making their decision`,
      duration: 6000,
      position: 'top',
      showCloseButton: true,
      dismissOnPageChange: true,
    });
    toast.present();
  }

  // signout from app wrapped in an alert for confirmation
  signOut(){
    let alert = this.alertCtrl.create({
      title: 'Siging Out',
      message: 'Are you sure you want to be signed out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Sign Me Out',
          handler: () => {
            console.log('Buy clicked');
            
    this.afAuth.auth.signOut()
    .then(() => this.navCtrl.parent.parent.setRoot('SliderPage'));
          }
        }
      ]
    });
    alert.present();
  }

  editPage(){
    this.navCtrl.push('EditProfilePage');
  }

}