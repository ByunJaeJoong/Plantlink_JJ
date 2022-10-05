import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Chats } from 'src/app/models/chat.model';
import { AlertService } from 'src/app/services/alert.service';
import { CommonService } from 'src/app/services/common.service';
import { DbService } from 'src/app/services/db.service';
import { ImageService } from 'src/app/services/image.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  userId: string = localStorage.getItem('userId');
  user$: Observable<any>;
  botId = 'oerqH5wAqIfOXH1VrGkI7r2PpJa2';

  chats: Chats = {
    bluetoothId: '',
    chatGroup: [],
    chatId: '',
    count: 0,
    createdAt: 0,
    deleteSwitch: false,
    exitSwitch: false,
    messages: [],
    plantId: '',
    userId: '',
  };
  constructor(
    private navController: NavController,
    private alertService: AlertService,
    private db: DbService,
    private actionSheetController: ActionSheetController,
    private image: ImageService,
    private common: CommonService,
    private loading: LoadingService
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

  //이용약관 페이지로
  goService() {
    this.navController.navigateForward(['/service']);
  }

  // 회원 탈퇴 페이지로
  async goExit() {
    this.navController.navigateForward(['/exit']);
  }

  //백버튼
  goSetting() {
    this.navController.navigateForward(['/setting']);
  }

  // 데이터 삭제 alert
  async deleteCashAlert() {
    const ok = await this.alertService.cancelOkBtn('two-btn', `데이터를 삭제하시겠어요?`, '', '취소', '확인');

    if (ok) {
      this.loading.lognLoad('데이터 삭제 중입니다.');
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

      const myBluetooth = await this.db
        .collection$(`bluetooth`, ref => ref.where('userId', '==', this.userId))
        .pipe(first())
        .toPromise();

      // // 로그인 사용자의 일기장 데이터 보이지 않도록
      if (myDiary.length > 0) {
        myDiary.forEach(async (data: any) => {
          await this.db.updateAt(`diary/${data.id}`, {
            deleteSwitch: true,
          });
        });
      }

      // // 로그인 사용자의 등록된 식물 데이터 보이지 않도록 처리
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

        // 데이터 삭제 후 채팅방이 남아있는지 체크
        const checkChat = await this.db
          .collection$(`chats`, ref => ref.where('userId', '==', this.userId).where('deleteSwitch', '==', false))
          .pipe(first())
          .toPromise();

        // 남아있는 채팅방이 없을 경우 새로운 채팅방 생성
        if (checkChat.length <= 0) {
          this.chats.chatId = this.common.generateFilename();
          this.chats.createdAt = Date.now();
          this.chats.chatGroup = [this.userId, this.botId];
          this.chats.messages = [{ chatContent: '모든게 다 잘될거야!', createdAt: Date.now(), uid: this.botId }];
          this.chats.userId = this.userId;
          this.db.updateAt(`chats/${this.chats.chatId}`, this.chats);
        }
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
      this.loading.hide();
    }
  }
}
