import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Review } from '../../models/review.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Profile } from '../../models/profile.model';



@IonicPage()
@Component({
  selector: 'page-add-review',
  templateUrl: 'add-review.html',
})
export class AddReviewPage {

  userName: string;
  profileData: any;
  //profile: any;
  allusers: {}[];
  key = this.afs.createId();
  reviewDate = new Date().toLocaleString();

  review = {
    key: this.key,
    reviewDate: this.reviewDate,
    rating : '',
    comment: '',
    name:'',
    reviewer:'',
  } as Review;

  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     private afAuth: AngularFireAuth,
     private afs: AngularFirestore,
     public toastCtrl: ToastController) {
  }
  ionViewWillLoad() {
    this.getAllUsers().subscribe((users) => {
      this.allusers = users;
    })


    this.afAuth.authState.subscribe(auth => {
      this.profileData = this.afs.doc(`profile/${auth.uid}`)
      this.profileData.valueChanges()
      .subscribe((profileData)=>{
        this.userName = profileData.userName.toString();
        this.review.reviewer = this.userName;
        console.log(this.userName);
      })
    })
  }
  

postReview(){
 return this.afs.doc(`review/${this.key}`).set(this.review).then(()=>{
  let toast = this.toastCtrl.create({
    message: `Review Added !`,
    duration: 5000,
    position: 'middle',
    showCloseButton: true,
    dismissOnPageChange: true,
  
  });
  toast.present();
 }).then(()=>{
  this.navCtrl.parent.parent.setRoot('TabsPage');
 })
}


getAllUsers() {
  return this.afs.collection('profile', ref => ref.orderBy('firstName')).valueChanges();
}

}

