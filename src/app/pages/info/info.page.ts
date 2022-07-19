import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  constructor(private alertService: AlertService, private navController: NavController) {}

  ngOnInit() {}

  //로그아웃 alert
  goLogout() {
    this.alertService.cancelOkBtn('two-btn', '정말 로그아웃 하시겠어요?', '', '취소', '확인').then(ok => {
      if (ok) {
        this.navController.navigateRoot(['/login-join']);
      }
    });
  }

  //식물 현재 상태
  goSetting() {
    this.navController.navigateForward(['/setting']);
  }
}
