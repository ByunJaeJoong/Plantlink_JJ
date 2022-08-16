import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { DbService, docJoin, docListJoin, leftJoinDocument, listJoin } from 'src/app/services/db.service';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.page.html',
  styleUrls: ['./plant.page.scss'],
})
export class PlantPage implements OnInit {
  userId: any;
  userInfo$: Observable<any>;
  userInfo: any;
  userPlantList: any;
  constructor(private alertService: AlertService, private navController: NavController, private db: DbService) {
    this.userId = localStorage.getItem('userId');
  }
  panelOpenState = '';
  ngOnInit() {
    this.getData();
  }
  async getData() {
    // this.userInfo = await this.db.doc$(`users/${this.userId}`).pipe(docListJoin(this.db.afs, 'myPlant', 'plantBook')).pipe(first()).toPromise();
    // this.userPlantList = this.userInfo.myPlant;
    this.userInfo$ = await this.db.doc$(`users/${this.userId}`).pipe(docListJoin(this.db.afs, 'myPlant', 'plantBook'));
    this.userInfo = await this.userInfo$.pipe(first()).toPromise();
    console.log(this.userInfo);

    if (this.userInfo.myPlant?.length <= 0) {
      this.emptyAlert();
    }
  }
  //식물목록이 없을 때 뜨는 alert
  emptyAlert() {
    this.alertService
      .cancelOkBtn('two-btn', '현재 등록된 식물이 없습니다.<br>장치 연결을 통해 식물을 등록하시겠어요?', '', '취소', '확인')
      .then(ok => {
        if (ok) {
          this.navController.navigateForward(['/connect-device']);
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

  //홈으로
  goHome() {
    this.navController.navigateForward(['/tabs/home']);
  }

  //식물 현재 상태
  goPlantDetail(plantInfo) {
    this.navController.navigateForward(['/plant-detail'], {
      queryParams: plantInfo,
    });
  }
}
