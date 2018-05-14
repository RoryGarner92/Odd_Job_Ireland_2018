import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Job } from '../../models/job.model';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Profile } from '../../models/profile.model';
import { Observable } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-add-job',
  templateUrl: 'add-job.html',
})
export class AddJobPage implements OnInit {
  x: string;
  thePrice;
  numberPrice: number;
  numberBalance: number;
  balance: string;
  jobEmail = this.afAuth.auth.currentUser.email;
  startDate = new Date().toLocaleString();
  profileData: AngularFirestoreDocument<Profile>;
  jo: string;
  key = this.afs.createId();
  image: any;
  county:Array<string>;
  category:Array<string>;
  price:Array<string>;
  auth: any = this.afAuth.auth.currentUser.emailVerified.toString();

  
  job = {
    key: this.key,
    dateCreated: this.startDate,
    email: this.jobEmail,
    status : 'Open',
    description: '',
    price: undefined,
    requiredDate: '',
    assignedTo: '',
    county: '',
    jobImage: 'assets/img/icon.png'

  } as Job;



  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
  ) { }


ngOnInit(){
  console.log(this.auth);
  this.county = ['Antrim','Armagh','Carlow','Cavan','Clare','Cork','Derry',
  'Donegal','Down','Dublin','Fermanagh','Galway','Kerry','Kildare','Kilkenny',
  'Laois','Leitrim','Limerick','Longford','Louth','Mayo','Meath','Monaghan',
  'Offaly','Roscommon','Sligo','Tipperary','Tyrone','Waterford','Westmeath',
  'Wexford','Wicklow' ];
  this.category = ['Repairs','Events','Painting','Cleaning','Carpentry','Gardening',
    'Child-Care','Shopping'];
  this.price = ['10','20','30','40','50','60','70','80','90','100'];
  this.afAuth.authState.subscribe(auth => {
    this.profileData = this.afs.doc(`profile/${auth.uid}`)
    this.profileData.valueChanges()
    .subscribe((profileData)=>{
      this.balance = profileData.oddDollarBalance.toString();
    })
    this.x = this.jo;
    console.log('jobOwner', this.jo, this.x, this.balance);
  })

}

   // add a job the toast a message 
  addJob(){
    this.thePrice = this.job.price.toString();
    this.numberPrice = parseInt(this.thePrice);
    this.numberBalance = parseInt(this.balance);
  //  this.owner = this.jo;
   if(this.numberBalance >  this.numberPrice && this.auth ==='true'){
    this.afs.collection('job').doc(this.key).set(this.job)
    .then(()=>{
      this.afAuth.authState.subscribe(auth => {
        this.profileData = this.afs.doc(`profile/${auth.uid}`)
        this.profileData.valueChanges()
        .subscribe((profileData)=>{
          this.image = profileData.profileUrl.toString();
          this.jo = profileData.userName.toString();
         // this.job.owner = this.jo;
          this.afs.collection('job').doc(this.key).update({userImage: this.image});
          this.afs.collection('job').doc(this.key).update({owner: this.jo});

        })
      })
    })

    .then(() => {
      this.navCtrl.parent.parent.setRoot('TabsPage');
    })
    let toast = this.toastCtrl.create({
      message: `Your Job has been added! `,
      duration: 3000,
      position: 'middle',
      showCloseButton: true,
      dismissOnPageChange: true,

    });
    toast.present();
  }else{
    alert('Looks Like something has gone wrong... Have you verifyed your email ? Check your inputs or your balance and try again ');
  }


    
  }
}
