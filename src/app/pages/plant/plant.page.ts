import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.page.html',
  styleUrls: ['./plant.page.scss'],
})
export class PlantPage implements OnInit {
  constructor(private alertService: AlertService, private navController: NavController) {}
  isOpen = false;
  ngOnInit() {}

  // 이미지 영역 보기
  inputArea() {
    this.isOpen = !this.isOpen;
  }

  //식물목록이 없을 뜨는 alert
  alert() {
    this.alertService
      .cancelOkBtn('two-btn', '현재 등록된 식물이 없습니다.<br>장치 연결을 통해 식물을 등록하시겠어요?', '', '취소', '확인')
      .then(ok => {
        if (ok) {
          this.navController.navigateForward(['/plant-search']);
        }
      });
  }

  headerBackSwitch = false;
  //헤더 스크롤 할 때 색 변하게
  logScrolling(event) {
    let scroll = event.detail.scrollTop;
    console.log(event);

    if (scroll > 56) {
      this.headerBackSwitch = true;
    } else {
      this.headerBackSwitch = false;
    }
  }
}
