import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { Job } from '../../models/job.model';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Observable } from 'rxjs/Rx';
import { EmailComposer } from '@ionic-native/email-composer';
import * as _ from 'lodash';



@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage implements OnInit {

  reportToEmail: string = 'oddjobadmin@gmail.com';
  reqEmail: string;
  loadedUserList: any[];
  userList: any[];
  searchterm: string;
  
  jobCollection: AngularFirestoreCollection<Job>;
  jobs: Observable<Job[]>;
  theJobs;
  filteredJobs;
  segment:string;
  category:string;
  status:string;
  filters = {}


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private emailComposer: EmailComposer,
  ) { }


  ngOnInit() {
    // set initial value for timeline 
    this.segment = "jobs";
    //getting the users 
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


    // getting the jobs ordering by date
    this.jobCollection = this.afs.collection(`job`, ref => {
      return ref.orderBy('status').orderBy('dateCreated','desc').limit(100)       
    });
    this.jobs = this.jobCollection.valueChanges();
    this.jobs.subscribe( theJobs => {
      this.theJobs = theJobs;
      this.reqEmail = this.theJobs.email;
      this.applyFilters();
    });
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


  /// filter property by equality to rule
  filterExact(property: string, rule: any) {
    this.filters[property] = val => val == rule;
    this.applyFilters();
  }
  
  /// removes filter
  removeFilter(property) {
    delete this.filters[property]
    this[property] = null;
    this.applyFilters();
  }

  reportIssue(){
  let email = {
    to: this.reportToEmail,
    subject: 'Report an Issue',
    body: 'How are you? What seems to be the issue ?',
    isHtml: true
  };
  
  // Send a text message using default options
  this.emailComposer.open(email);
}

requestJob(){
  console.log(this.reqEmail);
  let email = {
    to: this.reqEmail,
    subject: 'Odd Job',
    body: 'I wannt this job',
    isHtml: true
  };
  
  // Send a text message using default options
  this.emailComposer.open(email);
}

requestMoreDetails(){
  // request review of work quality
  let email = {
    to: 'max@mustermann.de',
    subject: 'More Info - Odd Job',
    body: 'I wannt mor information can you help',
    isHtml: true
  };
  
  // Send a text message using default options
  this.emailComposer.open(email);

 }
 
// access db and get all users order by firstname
  getAllUsers() { 
    return this.afs.collection('profile', ref => ref.orderBy('firstName')).valueChanges();
  }


}
