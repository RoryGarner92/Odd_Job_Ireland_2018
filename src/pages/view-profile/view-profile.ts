import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Profile } from '../../models/profile.model';
import { AngularFirestoreDocument, AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Review } from '../../models/review.model';
import { Observable } from 'rxjs';
import { EmailComposer } from '@ionic-native/email-composer';


@IonicPage()
@Component({
  selector: 'page-view-profile',
  templateUrl: 'view-profile.html',
})
export class ViewProfilePage {

  numberPrice: number;
  price: any;
  userEmail: string;
  otherUserUpdatedBalance: number;
  otherUserBalance: number;
  transfer: number;
  myUpdatedBalance: number;
  myBalance: number;
  data: any;
  p1: any;
  profile: Profile;

  myProfile: AngularFirestoreDocument<Profile>;
  otherUserProfile: AngularFirestoreDocument<Profile>;
  reviewDataRef: AngularFirestoreCollection<Review>;
  reviewData: Observable<Review[]>

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private emailComposer: EmailComposer,
  ) { }

  ionViewWillLoad() {
    this.profile = this.navParams.get('u');
    this.otherUserProfile = this.afs.doc(`profile/${this.profile.authId}`);
    this.userEmail = this.profile.email;

    this.reviewDataRef = this.afs.collection(`review`, ref => {
      return ref.where('name', '==' ,`${this.profile.userName}`); //did I fix this?
    });
    this.reviewData = this.reviewDataRef.valueChanges();
    
//getting my oddDollar balance when the page enters 
  this.afAuth.authState.subscribe(auth => {
    this.myProfile = this.afs.doc(`profile/${auth.uid}`); 
    this.p1 = this.myProfile.valueChanges();
    this.p1.subscribe((data)=>{
    this.data = data;
   // console.log(this.data);
  })
})
}

//*****************************************Transfer Payment Block***************************************************/

payment(){
this.numberPrice = parseInt(this.price);
this.transfer = this.numberPrice;
this.myBalance = parseInt(this.data.oddDollarBalance);
this.myUpdatedBalance = this.myBalance - this.transfer;
this.otherUserBalance = this.profile.oddDollarBalance;
this.otherUserUpdatedBalance = this.otherUserBalance + this.transfer;

if(this.myBalance >= this.transfer){
  this.myProfile.update({oddDollarBalance: this.myUpdatedBalance});
  this.otherUserProfile.update({oddDollarBalance: this.otherUserUpdatedBalance}); 

console.log('data from payment', this.myUpdatedBalance);

this.navCtrl.parent.parent.setRoot('TabsPage');
console.log("other bal", this.otherUserUpdatedBalance);
}else{
  alert("It seems like something has gone wrong :( are you trying to transfer an amount that is greater than you balance, Try doing some jobs to increase you balance. ");
}
  console.log("Payment Complete!");
}

//*********************************************************************************************

contact(){
  let email = {
    to: this.userEmail,
    subject: 'Report an Issue',
    body: 'How are you? What seems to be the issue ?',
    isHtml: true
  };
  
  // Send a text message using default options
  this.emailComposer.open(email);

}


//*********************************************************************************************

}
