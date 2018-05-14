import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/observable';
import { Job } from '../../models/job.model';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { EmailComposer } from '@ionic-native/email-composer';
import * as _ from 'lodash';
import { Profile } from '../../models/profile.model';
import { Content } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage implements OnInit {


  balance: string;
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


  reportToEmail: string = 'oddjobadmin@gmail.com';
  reqEmail: string;
  loadedUserList: any[];
  userList: any[];
  searchterm: string;
  
  constructor(
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private emailComposer: EmailComposer,

  ) {}
    

  openMenu() {
    this.menuCtrl.open();
  }
  closeMenu() {
    this.menuCtrl.close();
  }
 
  toggleMenu() {
    this.menuCtrl.toggle();
  }
  

  ngOnInit() {
    this.jobCollection = this.afs.collection(`job`, ref => {
      return ref.orderBy('status').orderBy('dateCreated','desc').limit(100)       
    });
    this.jobs = this.jobCollection.valueChanges();
    this.jobs.subscribe( theJobs => {
      this.theJobs = theJobs;
      this.reqEmail = this.theJobs.email;
      this.applyFilters();
     });

    
     
  //getting the ballence of the job owner
  this.afAuth.authState.subscribe(auth => {
    this.profileData = this.afs.doc(`profile/${auth.uid}`)
    this.profileData.valueChanges()
    .subscribe((profileData)=>{
      this.userName = profileData.userName.toString();
      this.userImage = profileData.profileUrl.toString();
      this.userEmail = profileData.email;
      this.balance = profileData.oddDollarBalance.toString();
    })
  })

  this.getAllUsers().subscribe(cord=>{
    let users = []; 
    cord.forEach(function(snap) {
      users.push(snap);
      return false;
    });
    //console.log(users);
    this.userList = users;
    this.loadedUserList = users;
  });

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

initializeItems(): void {
  this.userList = this.loadedUserList;
}

getItems(searchbar) {
  // Reset items back to all of the items
  this.initializeItems();

  // set q to the value of the searchbar
  var q = searchbar.srcElement.value;


  // if the value is an empty string don't filter the items
  if (!q) {
    return;
  }

  this.userList = this.userList.filter((v) => {
    if(v.firstName && q) {
      if (v.firstName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    }
  });
}

private applyFilters() {
  this.filteredJobs = _.filter(this.theJobs, _.conforms(this.filters) )
}

  /// removes filter
  removeFilter(property) {
    delete this.filters[property]
    this[property] = null;
    this.applyFilters();
  }

/// filter property by equality to rule
filterExact(property: string, rule: any) {
  this.filters[property] = val => val == rule;
  this.applyFilters();
}


// access db and get all users order by firstname
getAllUsers() { 
  return this.afs.collection('profile', ref => ref.orderBy('firstName')).valueChanges();
}



}
