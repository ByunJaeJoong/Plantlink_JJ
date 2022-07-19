import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  //faq로
  goFaq() {
    this.navController.navigateForward(['/faq']);
  }

  //정보페이지
  goInfo() {
    this.navController.navigateForward(['/info']);
  }

  //사용자 계약 페이지로
  goContract() {
    this.navController.navigateForward(['/contract']);
  }

  goSetting() {
    this.navController.navigateForward(['/setting']);
  }
}
