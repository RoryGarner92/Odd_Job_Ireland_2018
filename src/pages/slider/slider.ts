import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { NgZone } from '@angular/core';


@IonicPage()
@Component({
  selector: 'page-slider',
  templateUrl: 'slider.html',
})
export class SliderPage {
 
  slides;
  loggedIn;
  
  constructor (
    public navCtrl: NavController, 
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private zone: NgZone,
  ) { }

// skip  logging in 
  ngOnInit() {
    this.loggedIn = this.afAuth.authState.subscribe((data)=>{
      if(data) {
        // User is signed in.
        console.log('is user');
        this.zone.run(() => {
          this.navCtrl.setRoot('TabsPage');
        })
      }else{
        console.log('is not user');
        // No user is signed in.
      }
    });
  }
  
  continue() {
    this.navCtrl.setRoot('LoginPage');
  }
}
