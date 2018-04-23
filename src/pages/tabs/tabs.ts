import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root:string = 'HomePage';
  tab4Root:string = 'ProfilePage';
  tab5Root:string = 'MyJobsPage';
  tab7Root:string = 'SearchPage'; 
  tab9Root:string = 'AddJobPage';



  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
  ) { }

}
