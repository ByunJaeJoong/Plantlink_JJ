import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-plant-book-detail',
  templateUrl: './plant-book-detail.page.html',
  styleUrls: ['./plant-book-detail.page.scss'],
})
export class PlantBookDetailPage implements OnInit {
  constructor(private alertService: AlertService, private navController: NavController) {}

  ngOnInit() {}

  //나의 식물 등록하기 - 해제하기
  //1. 연결된 장치가 없을 때
  noDevice() {
    this.alertService.cancelOkBtn('two-btn', '현재 연결된 장치가 없습니다.<br>장치를 연결하러 가시겠어요?', '', '취소', '확인').then(ok => {
      if (ok) {
        this.navController.navigateForward(['/connect-device']);
      }
    });
  }

  //2. 등록완료
  completeAlert() {
    this.alertService.cancelOkBtn('two-btn', '나의 식물로 등록되었습니다:)<br>식물 메뉴로 가서 확인하시겠어요?', '', '취소', '확인').then(ok => {
      if (ok) {
        this.navController.navigateForward(['/plant']);
      }
    });
  }

  //3.식물 해제하기
  disconnectAlert() {
    this.alertService.cancelOkBtn('two-btn', '나의 식물을 해제하면 장치 연결도 해제됩니다.<br>해제하시겠어요?', '', '취소', '확인').then(ok => {
      if (ok) {
        this.navController.navigateForward(['/plant-book']);
      }
    });
  }

  //홈화면으로
  goHome() {
    this.navController.navigateForward(['/tabs/home']);
  }
}
