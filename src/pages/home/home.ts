import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/observable';
import { Job } from '../../models/job.model';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { EmailComposer } from '@ionic-native/email-composer';
import * as _ from 'lodash';
import { Profile } from '../../models/profile.model';



@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage implements OnInit {

  userEmail: string;
  adminEmail: string = 'oddjobireland2018@gmail.com';
  userImage: string;
  userName: string;
  startDate = new Date().toLocaleString();
  profileData: AngularFirestoreDocument<Profile>;
  jobCollection: AngularFirestoreCollection<Job>;
  jobs: Observable<Job[]>;
  theJobs;
  filteredJobs;
  segment:string;

  category:     string;
  filters = {}

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private emailComposer: EmailComposer,

  ) {}
    

  ngOnInit() {
    this.jobCollection = this.afs.collection(`job`, ref => {
      return ref.orderBy('status').orderBy('dateCreated','desc').limit(100)       
    });
    this.jobs = this.jobCollection.valueChanges();
    this.jobs.subscribe( theJobs => {
      this.theJobs = theJobs;
      console.log(this.theJobs);

  //  //   this.applyFilters();
     });

    
  //getting the ballence of the job owner
  this.afAuth.authState.subscribe(auth => {
    this.profileData = this.afs.doc(`profile/${auth.uid}`)
    this.profileData.valueChanges()
    .subscribe((profileData)=>{
      this.userName = profileData.userName.toString();
      this.userImage = profileData.profileUrl.toString();
      this.userEmail = profileData.email;

    })
  })

  }

  reportIssue(f){
  let badJobKey = f.key;
  let badJobName = f.userName;
  let email = {
    to: this.adminEmail,
    subject: 'Report an Issue',
    body: `How are you? I have an issue with this user, ${badJobKey} theit job key ${badJobKey}`,
    isHtml: true
  };
  
  // Send a text message using default options
  this.emailComposer.open(email);
}

requestJob(f){
  let reqJobKey = f.key;
  let email = {
    to: this.userEmail,
    subject: 'Request Odd Job ',
    body: `I wannt this job ${reqJobKey} `,
    isHtml: true
  };
  
  // Send a text message using default options
  this.emailComposer.open(email);
}


}
