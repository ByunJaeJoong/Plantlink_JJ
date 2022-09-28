import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-connect-device',
  templateUrl: './connect-device.page.html',
  styleUrls: ['./connect-device.page.scss'],
})
export class ConnectDevicePage implements OnInit {
  bluetooth$: Observable<any>;
  myPlant: any;
  connectPlant: any;
  userId: string = localStorage.getItem('userId');

  userInfo$: Observable<any>;

  constructor(private navController: NavController, private db: DbService, private alertService: AlertService) {
    this.getData();
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.userInfo$.pipe(first()).subscribe(async data => {
      if (data?.myPlant?.length <= 0) {
        await this.emptyAlert();
      }
    });
  }

  async getData() {
    this.userInfo$ = await this.db.doc$(`users/${this.userId}`);
    this.bluetooth$ = this.db.collection$(`bluetooth`, (ref: any) => ref.where('userId', '==', this.userId).where('deleteSwitch', '==', false));
  }

  //홈화면으로 가기
  goHome() {
    this.navController.navigateBack(['/tabs/home']);
  }

  //장치찾기로
  findDevice() {
    this.userInfo$.pipe(first()).subscribe(async data => {
      if (data?.myPlant?.length <= 0) {
        await this.emptyAlert();
      } else {
        this.navController.navigateForward(['/find-device']);
      }
    });
  }

  emptyAlert() {
    this.alertService
      .cancelOkBtn('two-btn', '현재 등록된 식물이 없습니다.<br>식물 추가를 통해 식물을 등록하시겠어요?', '', '취소', '확인')
      .then(ok => {
        if (ok) {
          this.navController.navigateForward(['/plant-book']);
        }
      });
  }
}
