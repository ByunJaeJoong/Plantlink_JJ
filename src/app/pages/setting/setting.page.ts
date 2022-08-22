import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
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
  }

  // 카메라 또는 갤러리 선택
  async changeImage() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: '카메라',
          handler: async () => {
            const url = await this.image.getCamera('userProfile');
            await this.db.updateAt(`users/${this.userId}`, {
              profileImage: url,
            });
          },
        },
        {
          text: '갤러리',
          handler: async () => {
            const url = await this.image.getGallery('userProfile');
            await this.db.updateAt(`users/${this.userId}`, {
              profileImage: url,
            });
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
    this.navController.navigateBack(['/tabs/home']);
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
  async deleteCashAlert() {
    const ok = await this.alertService.cancelOkBtn('two-btn-header', '크기 0.1M', '캐시를 삭제하시겠어요?', '취소', '확인');

    if (ok) {
      const myDiary = await this.db
        .collection$(`diary`, ref => ref.where('userId', '==', this.userId))
        .pipe(first())
        .toPromise();

      const myPlantData = await this.db
        .collection$(`myPlant`, ref => ref.where('userId', '==', this.userId))
        .pipe(first())
        .toPromise();

      const myChat = await this.db
        .collection$(`chats`, ref => ref.where('userId', '==', this.userId))
        .pipe(first())
        .toPromise();
      console.log(myChat);

      const myBluetooth = await this.db
        .collection$(`bluetooth`, ref => ref.where('userId', '==', this.userId))
        .pipe(first())
        .toPromise();

      // 로그인 사용자의 일기장 데이터 보이지 않도록
      if (myDiary.length > 0) {
        myDiary.forEach(async (data: any) => {
          await this.db.updateAt(`diary/${data.id}`, {
            deleteSwitch: true,
          });
        });
      }

      // 로그인 사용자의 등록된 식물 데이터 보이지 않도록 처리
      if (myPlantData.length > 0) {
        await this.db.updateAt(`users/${this.userId}`, {
          plantSwitch: false,
          myPlant: [],
        });

        myPlantData.forEach(async (data: any) => {
          await this.db.updateAt(`myPlant/${data.id}`, {
            deleteSwitch: true,
          });
        });
      }

      // 로그인 사용자의 채팅 데이터 보이지 않도록
      if (myChat.length > 0) {
        myChat.forEach(async (data: any) => {
          await this.db.updateAt(`chats/${data.id}`, {
            deleteSwitch: true,
          });
        });
      }

      // 로그인 사용자의 블루투스 연동 데이터 보이지 않도록
      if (myBluetooth.length > 0) {
        await this.db.updateAt(`users/${this.userId}`, {
          connectSwitch: false,
          bluetooth: [],
        });

        myBluetooth.forEach(async (data: any) => {
          await this.db.updateAt(`bluetooth/${data.id}`, {
            deleteSwitch: true,
          });
        });
      }
    }
  }
}
