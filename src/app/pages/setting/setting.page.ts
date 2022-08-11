import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { DbService } from 'src/app/services/db.service';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  userId: string = localStorage.getItem('userId');

  user$: Observable<any>;
  constructor(
    private navController: NavController,
    private alertService: AlertService,
    private db: DbService,
    private actionSheetController: ActionSheetController,
    private image: ImageService
  ) {
    this.getData();
  }

  ngOnInit() {}

  // 사용자의 프로필 사진이 계속 변경될 수 있기 때문에 옵저버로 확인
  async getData() {
    this.user$ = this.db.doc$(`users/${this.userId}`);
    this.user$.subscribe(data => {
      console.log(data);
    });
  }

  // 카메라 또는 갤러리 선택
  async changeImage() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: '카메라',
          handler: async () => {
            const url = await this.image.getCamera('userProfile');
            // this.diary.images.push(url);
          },
        },
        {
          text: '갤러리',
          handler: async () => {
            const url = await this.image.getGallery('userProfile');
            // this.diary.images.push(url);
          },
        },
        {
          text: '취소',
          role: 'cancel',
          handler: () => {},
        },
      ],
    });

    await actionSheet.present();
  }

  //홈으로
  goHome() {
    this.navController.navigateForward(['/tabs/home']);
  }
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
    const ok = this.alertService.cancelOkBtn('two-btn-header', '크기 0.1M', '캐시를 삭제하시겠어요?', '취소', '확인');

    if (ok) {
    }
  }
}
