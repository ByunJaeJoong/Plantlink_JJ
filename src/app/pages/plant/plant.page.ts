import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase';
import { combineLatest, Observable, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { DbService, docJoin, docListJoin, leftJoinDocument } from 'src/app/services/db.service';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.page.html',
  styleUrls: ['./plant.page.scss'],
})
export class PlantPage implements OnInit {
  userId: any;
  userInfo$: Observable<any>;
  myPlant$: Observable<any>;

  test: any;

  // plantInfo: any;
  plantInfo$: Observable<any>;
  constructor(private alertService: AlertService, private navController: NavController, private db: DbService) {
    this.userId = localStorage.getItem('userId');
    this.getData();
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.userInfo$.pipe(first()).subscribe(async data => {
      if (data.myPlant.length <= 0) {
        await this.emptyAlert();
      }
    });
  }
  async getData() {
    this.userInfo$ = await this.db.doc$(`users/${this.userId}`);
    // //this.plantInfo$ = await this.userInfo$.pipe(docListJoin(this.db.afs, 'myPlant', 'myPlant'));
    // this.plantInfo$ = this.userInfo$.pipe(
    //   switchMap(user => {
    //     let reads$ = [];
    //     console.log(user);

    //     user.myPlant.forEach(id => {
    //       const doc$ = this.db.doc$(`myPlant/${id}`);
    //       reads$.push(doc$);
    //     });

    //     if (reads$.length > 0) {
    //       return combineLatest(reads$);
    //     } else {
    //       return of([]);
    //     }
    //   })
    // );
    this.plantInfo$ = this.db.collection$(`myPlant`, ref =>
      ref.where('userId', '==', this.userId).where('deleteSwitch', '==', false).where('cancelSwitch', '==', true).orderBy('dateCreated', 'desc')
    );
  }
  goDelete(myPlantId) {
    this.alertService.cancelOkBtn('two-btn', '나의 식물에서 해지하시겠어요?', '', '취소').then(ok => {
      if (ok) {
        this.db.updateAt(`users/${this.userId}`, {
          myPlant: firebase.default.firestore.FieldValue.arrayRemove(myPlantId),
        });
        this.db.updateAt(`myPlant/${myPlantId}`, {
          cancelSwitch: true,
        });
        console.log(myPlantId);
      }
    });
  }

  //식물목록이 없을 때 뜨는 alert
  emptyAlert() {
    this.alertService
      .cancelOkBtn('two-btn', '현재 등록된 식물이 없습니다.<br>식물 추가를 통해 식물을 등록하시겠어요?', '', '취소', '확인')
      .then(ok => {
        if (ok) {
          this.navController.navigateForward(['/plant-book']);
        }
      });
  }

  //헤더 스크롤 할 때 색 변하게
  headerBackSwitch = false;
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
  goPlantDetail(plantId, index) {
    this.navController.navigateForward(['/plant-detail'], {
      queryParams: {
        plantId: plantId,
        index: index,
      },
    });
  }
}
