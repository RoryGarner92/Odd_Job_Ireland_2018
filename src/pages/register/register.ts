import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { User } from '../../models/user.model';
import { Profile } from '../../models/profile.model';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage implements OnInit {

  profieData: AngularFirestoreDocument<Profile>;
  user = {} as User;
  startDate = new Date().toLocaleString();
  authId;
 // randId = Math.random();
  initPic = 'https://firebasestorage.googleapis.com/v0/b/oddjob-e3dd5.appspot.com/o/pictures%2FOddjob_(Harold_Sakata)_-_Profile.jpg?alt=media&token=e26db948-4e9a-4c3b-a227-05b9c55f2b1d';


  
  profile = {
    //count: true,
    //userId: this.randId,
    userName: '',
    firstName: '',
    lastName: '',
    dateOfBirth : '',
    oddDollarBalance: 100,
    skills: [],
    userRating: '',
    primarySkill: '',
    profileUrl: this.initPic ,
    regDate: this.startDate.toString() ,
    authId : '',
    email: ''
    
  } as Profile;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController, 
    private afAuth: AngularFireAuth,
    private afs : AngularFirestore,
  ){ }

  ngOnInit(){
   //this.startDate = new Date().toLocaleString();

  }
  
   registerAccount(){

    try{
     // this.startDate = new Date().toLocaleString();
      if(this.user.password === this.user.confirmPassword){
      this.afAuth.auth.createUserWithEmailAndPassword(this.user.email, this.user.password)
      .then(result => {
        let user = firebase.auth().currentUser;
        user.sendEmailVerification();
          this.afAuth.authState.subscribe(auth => {
            this.profieData = this.afs.doc(`profile/${auth.uid}`)
              this.afs.doc(`profile/${auth.uid}`).set(this.profile);
            });
          });
        //   .then(()=>{
        //    this.navCtrl.setRoot('ProfilePage');
        //  })
        //  this.afAuth.auth.signOut();   
        this.navCtrl.setRoot('ProfilePage');

      }else{
        let toast = this.toastCtrl.create({
          message: `Woops!!!!!!!!!!! 
          Something has gone wrong, Try entering the information again?`,
          duration: 6000,
          position: 'middle',
          showCloseButton: true,
          dismissOnPageChange: true,
        });
        toast.present();
      }     
  }
    catch(error){
     // console.error(error);
    }
 }
}
