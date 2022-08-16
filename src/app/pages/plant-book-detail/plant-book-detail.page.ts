import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-plant-book-detail',
  templateUrl: './plant-book-detail.page.html',
  styleUrls: ['./plant-book-detail.page.scss'],
})
export class PlantBookDetailPage implements OnInit {
  plant: any;
  plantBookId: any;
  userId: any;
  userInfo: any;
  userPlant: any;
  plantSwitch: boolean = false;
  constructor(private alertService: AlertService, private navController: NavController, private route: ActivatedRoute, private db: DbService) {
    this.plantBookId = this.route.snapshot.queryParams.plantBookId;
    this.userId = localStorage.getItem('userId');
  }

  async ngOnInit() {
    this.plant = await this.db.doc$(`plantBook/${this.plantBookId}`).pipe(first()).toPromise();
    this.userInfo = await this.db.doc$(`users/${this.userId}`).pipe(first()).toPromise();
    this.userPlant = this.userInfo.myPlant;
    await this.checkMyPlant();

    setTimeout(() => {
      this.addHitList();
    }, 200);
  }

  // 조회수
  addHitList(): void {
    const userId: string = localStorage.getItem('userId');
    const dateCreated = new Date().toISOString();
    this.db.updateAt(`plantBook/${this.plantBookId}`, {
      hitsList: firebase.default.firestore.FieldValue.arrayUnion({
        userId,
        dateCreated,
      }),
    });
  }
  checkMyPlant() {
    if (this.userPlant.includes(this.plantBookId)) {
      this.plantSwitch = true;
    } else {
      this.plantSwitch = false;
    }
  }

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
    if (this.userInfo.connectSwitch) {
      this.db
        .updateAt(`users/${this.userId}`, {
          myPlant: firebase.default.firestore.FieldValue.arrayUnion(this.plantBookId),
        })
        .then(() => {
          this.userPlant.push(this.plantBookId);
          this.checkMyPlant();
        });
      this.alertService.cancelOkBtn('two-btn', '나의 식물로 등록되었습니다:)<br>식물 메뉴로 가서 확인하시겠어요?', '', '취소', '확인').then(ok => {
        if (ok) {
          this.navController.navigateForward(['/tabs/plant']);
        }
      });
    } else {
      this.noDevice();
    }
  }

  //3.식물 해제하기
  disconnectAlert() {
    this.alertService.cancelOkBtn('two-btn', '나의 식물을 해제하면 장치 연결도 해제됩니다.<br>해제하시겠어요?', '', '취소', '확인').then(ok => {
      if (ok) {
        this.db
          .updateAt(`users/${this.userId}`, {
            myPlant: firebase.default.firestore.FieldValue.arrayRemove(this.plantBookId),
          })
          .then(() => {
            const index = this.userPlant.indexOf(this.plantBookId);
            this.userPlant.splice(index, 1);
            this.checkMyPlant();
          });
      }
    });
  }

  //홈화면으로
  goHome() {
    this.navController.navigateForward(['/plant-book']);
  }
}
