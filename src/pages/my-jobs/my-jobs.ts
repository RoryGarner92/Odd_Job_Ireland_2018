import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/observable';
import { Job } from '../../models/job.model';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Profile } from '../../models/profile.model';
import { EmailComposer } from '@ionic-native/email-composer';


@IonicPage()
@Component({
  selector: 'page-my-jobs',
  templateUrl: 'my-jobs.html',
})
export class MyJobsPage implements OnInit {

  singleJob: any;
  savedJobEmail: any;
  userName: string;
  notesCollection: AngularFirestoreCollection<Job>;
  notes: Observable<Job[]>;
  jobEmail: string;
  segment: string;
  profileData: AngularFirestoreDocument<Profile>;


  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     private afAuth: AngularFireAuth,
     private afs: AngularFirestore,
     private emailComposer: EmailComposer,
    ) { }

    ngOnInit() {
      this.jobEmail = this.afAuth.auth.currentUser.email;
      

      this.afAuth.authState.subscribe(auth => {
        this.profileData = this.afs.doc(`profile/${auth.uid}`)
        this.profileData.valueChanges()
        .subscribe((profileData)=>{
          this.userName = profileData.userName.toString();
          console.log(this.userName);
        })
      })

      this.notesCollection = this.afs.collection(`job`, ref => {
        return ref.orderBy('dateCreated','desc').limit(100) 
      })
      this.notes = this.notesCollection.valueChanges()
      console.log(this.notes);
      this.segment = "posted";
    }

    ionicViewWillLoad(){
      this.singleJob = this.navParams.get('note');
      this.savedJobEmail = this.singleJob.email; 
      console.log(this.savedJobEmail);
    }

    delayJob(note){
    //  this.notesCollection.doc('job')
      console.log(this.savedJobEmail = note.email);
      let email = {
        to: this.savedJobEmail,
        subject: 'Odd Job Ireland ',
        body: 'Hi,  I might not be able to make it :(',
        isHtml: true
      };
      
      // Send a text message using default options
      this.emailComposer.open(email);
    }
  

}
