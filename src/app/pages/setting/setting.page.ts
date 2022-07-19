import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  constructor(private navController: NavController, private alertService: AlertService) {}

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

  //백버튼
  goSetting() {
    this.navController.navigateForward(['/setting']);
  }

  //캐시 삭제 alert
  deleteCashAlert() {
    this.alertService.cancelOkBtn('two-btn-header', '크기 0.1M', '캐시를 삭제하시겠어요?', '취소', '확인');
  }
}
