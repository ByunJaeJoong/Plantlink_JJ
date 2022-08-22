import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase';
import { first } from 'rxjs/operators';
import { myPlant } from 'src/app/models/myPlant.model';
import { AlertService } from 'src/app/services/alert.service';
import { CommonService } from 'src/app/services/common.service';
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
  myPlant: myPlant = {
    myPlantId: '',
    dateCreated: new Date().toISOString(),
    name: '',
    temperature: '',
    light: '',
    soil: '',
    plantBookId: '',
    userId: '',
    deleteSwitch: false,
    cancelSwitch: false,
  };
  constructor(
    private alertService: AlertService,
    private navController: NavController,
    private route: ActivatedRoute,
    private db: DbService,
    private common: CommonService
  ) {
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
  async checkMyPlant() {
    const connectCheck = await this.db
      .collection$(`myPlant`, ref =>
        ref.where('plantBookId', '==', this.plantBookId).where('cancelSwitch', '==', false).where('deleteSwitch', '==', false)
      )
      .pipe(first())
      .toPromise();
    if (connectCheck?.length > 0) {
      this.plantSwitch = true;
    } else {
      this.plantSwitch = false;
    }
  }

  async checkOverlap() {
    const connectCheck = await this.db
      .collection$(`myPlant`, ref => ref.where('userId', '==', this.userId).where('cancelSwitch', '==', false).where('deleteSwitch', '==', false))
      .pipe(first())
      .toPromise();
    if (connectCheck?.length > 0) {
      this.db.updateAt(`myPlant/${connectCheck[0].myPlantId}`, {
        cancelSwitch: true,
      });
      console.log(connectCheck);
    } else {
      console.log(connectCheck);
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
  async completeAlert() {
    if (this.userInfo.connectSwitch) {
      this.checkOverlap().then(() => {
        this.myPlant.myPlantId = this.common.generateFilename();
        this.myPlant.name = this.plant.name;
        this.myPlant.temperature = this.plant.temperature;
        this.myPlant.light = this.plant.light;
        this.myPlant.soil = this.plant.soil;
        this.myPlant.plantBookId = this.plantBookId;
        this.myPlant.userId = this.userId;
        this.myPlant.cancelSwitch = false;
        this.db.updateAt(`myPlant/${this.myPlant.myPlantId}`, this.myPlant);
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
      });
    } else {
      this.noDevice();
    }
  }

  // myPlant 컬렉션에서 삭제
  async deleteMyPlant() {
    const deletePlant = await this.db
      .collection$(`myPlant`, ref => ref.where('plantBookId', '==', this.plantBookId))
      .pipe(first())
      .toPromise();
    const plantBookId = deletePlant[0].myPlantId;
    this.db.updateAt(`myPlant/${plantBookId}`, {
      cancelSwitch: true,
    });
  }

  //3.식물 해제하기
  disconnectAlert() {
    this.alertService.cancelOkBtn('two-btn', '나의 식물을 해제하면 장치 연결도 해제됩니다.<br>해제하시겠어요?', '', '취소', '확인').then(ok => {
      if (ok) {
        this.deleteMyPlant().then(() => {
          const index = this.userPlant.indexOf(this.plantBookId);
          this.userPlant.splice(index, 1);
          this.checkMyPlant();
        });
      }
    });
  }

  //홈화면으로
  goHome() {
    this.navController.navigateBack(['/plant-book']);
  }
}
