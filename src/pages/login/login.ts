import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { User } from '../../models/user.model';

import { AngularFireAuth } from 'angularfire2/auth';
import { NgZone } from '@angular/core';
import { Profile } from '../../models/profile.model';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loggedIn;
  displayName: string;
  currentUser: User;
  user = {} as User;
  profile = {} as Profile;
 // cu: any;
  //fail = this.navCtrl.getActive();


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private zone: NgZone,
     ) {  }
    

login(user: User){
  this.afAuth.auth.signInWithEmailAndPassword(user.email.valueOf(), user.password.valueOf())
  .then( () => {
    console.log( 'Success');
    console.log('Found You');
    this.zone.run(() => {
      this.navCtrl.setRoot('TabsPage');
    })
    //success
  }, (err) => {
    // Do something with error
    console.log(err.message, 'failed');
    console.log('Nobodys here');
    let toast = this.toastCtrl.create({
      message: `Woops!!!!!!!!!!! 
      Something has gone wrong, Try entering the information again?`,
      duration: 6000,
      position: 'bottom',
      showCloseButton: true,
      dismissOnPageChange: true,
    });
    toast.present();
  })
}

googleLogin(){
  //fix      
  console.log('Nobodys here');
      let toast = this.toastCtrl.create({
        message: `COMING SOON`,
        duration: 6000,
        position: 'bottom',
        showCloseButton: true,
        dismissOnPageChange: true,
      });
      toast.present();
}

facebookLogin(){
  console.log('Nobodys here');
      let toast = this.toastCtrl.create({
        message: `COMING SOON`,
        duration: 6000,
        position: 'bottom',
        showCloseButton: true,
        dismissOnPageChange: true,
      });
      toast.present();}

      register(){
        this.navCtrl.push('RegisterPage');
      }
 
}
