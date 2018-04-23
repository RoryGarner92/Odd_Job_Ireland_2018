import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Job } from '../../models/job.model';
import { AngularFirestore } from 'angularfire2/firestore';



@IonicPage()
@Component({
  selector: 'page-update-job',
  templateUrl: 'update-job.html',
})
export class UpdateJobPage {

  price: string[];
  job: Job;
  allusers;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afs: AngularFirestore,

  ) { }


  ionViewWillLoad() {
    this.job = this.navParams.get('note');
    this.price = ['10','20','30','40','50','60','70','80','90','100'];

    this.getAllUsers().subscribe((users) => {
      this.allusers = users;
    })
  }


  update(){
    this.afs.doc(`job/${this.job.key}`).update(this.job)
    .then(() => this.navCtrl.parent.parent.setRoot('TabsPage'));
  }


  getAllUsers() {
    return this.afs.collection('profile', ref => ref.orderBy('firstName')).valueChanges();
  }


}
