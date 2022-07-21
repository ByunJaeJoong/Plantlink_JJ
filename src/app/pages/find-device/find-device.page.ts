import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-find-device',
  templateUrl: './find-device.page.html',
  styleUrls: ['./find-device.page.scss'],
})
export class FindDevicePage implements OnInit {
  constructor(private navController: NavController, private alertService: AlertService) {}

  ngOnInit() {}

  //홈화면으로 가기
  goHome() {
    this.navController.navigateForward(['/connect-device']);
  }

  //장치 없을 때 뜨는 alert
  goSearch() {
    this.alertService.cancelOkBtn('two-btn', '1개의 장치를 연결했습니다:)<br>식물의 종류를 선택하시겠어요?', '', '취소', '확인').then(ok => {
      if (ok) {
        this.navController.navigateRoot(['/plant-search']);
      }
    });
  }
}
