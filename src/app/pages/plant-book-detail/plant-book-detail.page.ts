import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { myPlant } from 'src/app/models/myPlant.model';
import { AlertService } from 'src/app/services/alert.service';
import { CommonService } from 'src/app/services/common.service';
import { DbService, docListJoin } from 'src/app/services/db.service';

@Component({
  selector: 'app-plant-book-detail',
  templateUrl: './plant-book-detail.page.html',
  styleUrls: ['./plant-book-detail.page.scss'],
})
export class PlantBookDetailPage implements OnInit {
  plant$: Observable<any>;
  plant: any;
  plantBookId: any;
  userId: any;
  currentPlant: any;
  currentPlant$: Observable<any>;
  plantSwitch: boolean = false;
  myPlant: myPlant = {
    myPlantId: '',
    dateCreated: new Date().toISOString(),
    name: '',
    temperature: 0,
    light: 0,
    soil: 0,
    plantBookId: '',
    userId: '',
    deleteSwitch: false,
    cancelSwitch: false,
    bluetoothSwitch: false,
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
    this.plant$ = await this.db.doc$(`plantBook/${this.plantBookId}`);
    this.plant = await this.plant$.pipe(first()).toPromise();
    this.currentPlant$ = await this.db.doc$(`users/${this.userId}`).pipe(docListJoin(this.db.afs, 'myPlant', 'myPlant'));
    this.checkMyPlant();

    setTimeout(() => {
      this.addHitList();
    }, 200);
  }
  // 현재 식물로 등록되어 있는 지 확인
  async checkMyPlant() {
    const connectCheck = await this.db
      .collection$(`myPlant`, ref =>
        ref
          .where('userId', '==', this.userId)
          .where('plantBookId', '==', this.plantBookId)
          .where('cancelSwitch', '==', true)
          .where('deleteSwitch', '==', false)
      )
      .pipe(first())
      .toPromise();
    if (connectCheck?.length > 0) {
      this.plantSwitch = true;
    } else {
      this.plantSwitch = false;
    }
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

  // 기존에 연결 되어있는 식물 해제.
  async checkOverlap() {
    const connectPlant = await this.db
      .collection$(`myPlant`, ref => ref.where('userId', '==', this.userId).where('deleteSwitch', '==', false).where('cancelSwitch', '==', false))
      .pipe(first())
      .toPromise();
    if (connectPlant?.length > 0) {
      this.db.updateAt(`myPlant/${connectPlant[0].myPlantId}`, {
        cancelSwitch: true,
      });
    }
  }
  //나의 식물 등록하기 - 해제하기
  //1. 연결된 장치가 없을 때
  // noDevice() {
  //   this.alertService.cancelOkBtn('two-btn', '현재 연결된 장치가 없습니다.<br>장치를 연결하러 가시겠어요?', '', '취소', '확인').then(ok => {
  //     if (ok) {
  //       this.navController.navigateForward(['/connect-device']);
  //     }
  //   });
  // }

  //2. 등록완료
  async completeAlert() {
    const plantOverlap = await this.db
      .collection$(`myPlant`, ref =>
        ref.where('userId', '==', this.userId).where('plantBookId', '==', this.plantBookId).where('deleteSwitch', '==', false)
      )
      .pipe(first())
      .toPromise();
    if (plantOverlap?.length > 0) {
      this.db.updateAt(`myPlant/${plantOverlap[0].myPlantId}`, {
        cancelSwitch: true,
        dateCreated: new Date().toISOString(),
      });
      this.checkMyPlant();
    } else {
      this.myPlant.myPlantId = this.common.generateFilename();
      this.myPlant.name = this.plant.name;
      this.myPlant.temperature = 0;
      this.myPlant.light = 0;
      this.myPlant.soil = 0;
      this.myPlant.plantBookId = this.plantBookId;
      this.myPlant.userId = this.userId;
      this.myPlant.cancelSwitch = true;
      this.db.updateAt(`myPlant/${this.myPlant.myPlantId}`, this.myPlant);
      this.db.updateAt(`users/${this.userId}`, {
        myPlant: firebase.default.firestore.FieldValue.arrayUnion(this.myPlant.myPlantId),
      });
      this.checkMyPlant();
    }
    this.alertService.cancelOkBtn('two-btn', '나의 식물로 등록되었습니다:)<br>식물 메뉴로 가서 확인하시겠어요?', '', '취소', '확인').then(ok => {
      if (ok) {
        this.navController.navigateForward(['/tabs/plant']);
      }
    });
  }
  // db 에서 삭제
  async deleteMyPlant() {}

  //3.식물 해제하기
  disconnectAlert() {
    this.alertService.cancelOkBtn('two-btn', '나의 식물을 해제하면 장치 연결도 해제됩니다.<br>해제하시겠어요?', '', '취소', '확인').then(async ok => {
      if (ok) {
        const deletePlant = await this.db
          .collection$(`myPlant`, ref =>
            ref
              .where('userId', '==', this.userId)
              .where('plantBookId', '==', this.plantBookId)
              .where('deleteSwitch', '==', false)
              .where('cancelSwitch', '==', true)
          )
          .pipe(first())
          .toPromise();
        const plantBookId = deletePlant[0].myPlantId;
        this.db.updateAt(`myPlant/${plantBookId}`, {
          cancelSwitch: false,
        });
        this.db.updateAt(`users/${this.userId}`, {
          myPlant: firebase.default.firestore.FieldValue.arrayRemove(plantBookId),
        });
      }
      this.checkMyPlant();
    });
  }

  //홈화면으로
  goHome() {
    this.navController.navigateBack(['/plant-book']);
  }
}
