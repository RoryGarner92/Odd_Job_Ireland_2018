import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Profile } from '../../models/profile.model';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';


@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage implements OnInit {
  
  authId;
  docuementRef;
  profieData: AngularFirestoreDocument<Profile>;
  note: Observable<Profile>;
  profile = { } as Profile;
  balance:number = 0;


  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
  ) { }

ngOnInit(){
  this.afAuth.authState.subscribe(auth => {
    this.profieData = this.afs.doc(`profile/${auth.uid}`)
    this.note = this.profieData.valueChanges()
    this.authId = this.afAuth.auth.currentUser.uid.toString();

    this.profieData.valueChanges()
    .subscribe((balance)=>{
      this.balance = balance.oddDollarBalance;
      console.log(this.balance);
     })
    });

}

  createProfile(){
      this.afAuth.authState.subscribe(auth => {
        this.docuementRef = this.afs.doc(`profile/${auth.uid}`);
        this.docuementRef.update(this.profile);
        this.docuementRef.update({authId: this.authId})
          .then(() => this.navCtrl.parent.parent.setRoot('TabsPage'))
      });

      let toast = this.toastCtrl.create({
        message: `Profile Updated !`,
        duration: 3000,
        position: 'middle',
        showCloseButton: true,
        dismissOnPageChange: true,
  
      });
      toast.present();
  }
  
}