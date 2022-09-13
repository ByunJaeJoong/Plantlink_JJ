import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonSlides, NavController } from '@ionic/angular';
import * as firebase from 'firebase';
import { combineLatest, Observable, of } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { DbService, docJoin, docListJoin, leftJoinDocument } from 'src/app/services/db.service';

@Component({
  selector: 'app-plant-detail',
  templateUrl: './plant-detail.page.html',
  styleUrls: ['./plant-detail.page.scss'],
})
export class PlantDetailPage implements OnInit {
  myPlantId: any;
  index: any;
  userId: any;
  plantInfo$: Observable<any>;
  plant$: Observable<any>;
  name: string;
  plant: any;
  plantInfo: any;
  userInfo$: Observable<any>;

  @ViewChild('slides', { static: false }) slides: IonSlides;
  constructor(private navController: NavController, private route: ActivatedRoute, private db: DbService, private alertController: AlertController) {
    this.myPlantId = this.route.snapshot.queryParams.plantId;
    this.index = this.route.snapshot.queryParams.index;
    this.userId = localStorage.getItem('userId');
  }
  slideOpts = {
    initialSlide: 0,
    speed: 1000,
    zoom: false,
    spaceBetween: 0,
    slidesPerView: 1,
  };

  slideChanged() {
    this.slides.slideTo(this.index);
    console.log(this.index);
  }

  ngOnInit() {
    this.getData();
  }

  async getData() {
    // if (this.myPlantId) {
    //   this.plantInfo$ = await this.db
    //     .collection$(`myPlant`, ref => ref.where('myPlantId', '==', this.myPlantId))
    //     .pipe(leftJoinDocument(this.db.afs, 'plantBookId', 'plantBook'));
    //   this.plantInfo = await this.plantInfo$.pipe(first()).toPromise();
    // } else {
    this.userInfo$ = await this.db.doc$(`users/${this.userId}`);
    this.plantInfo$ = this.userInfo$.pipe(
      switchMap(user => {
        let reads$ = [];
        console.log(user);

        user.myPlant.forEach(id => {
          console.log(id);

          const doc$ = this.db.doc$(`myPlant/${id}`).pipe(docJoin(this.db.afs, 'plantBookId', 'plantBook'));
          reads$.push(doc$);
        });
        if (reads$.length > 0) {
          return combineLatest(reads$);
        } else {
          return of([]);
        }
      })
    );
    this.plantInfo = await this.plantInfo$.pipe(first()).toPromise();
    // }
  }
  tempStatus(best, current) {
    const lowBest = Number(best.split('~')[0]);
    const hiBest = best.split('~')[1];
    const highBest = Number(hiBest.split('도')[0]);
    if (current >= lowBest && current <= highBest) {
      return false;
    } else if (current > highBest) {
      return true;
    } else if (current < lowBest) {
      return false;
    }
  }
  lightStatus(best, current) {
    let lowLight = 0;
    let highLight = 0;
    switch (best) {
      case '음지':
        lowLight = 0;
        highLight = 24;
        break;
      case '반음지':
        lowLight = 25;
        highLight = 49;
        break;
      case '반양지':
        lowLight = 50;
        highLight = 74;
        break;
      case '양지':
        lowLight = 75;
        highLight = 100;
        break;
    }
    if (current >= lowLight && current <= highLight) {
      return false;
    } else if (current > highLight) {
      return true;
    } else if (current < lowLight) {
      return false;
    }
  }
  soilStatus(best, current) {
    let lowSoil = 0;
    let highSoil = 0;
    if (best.indexOf('하')) {
      lowSoil = 0;
      highSoil = 10;
      return;
    } else if (best.indexOf('중')) {
      lowSoil = 11;
      highSoil = 50;
      return;
    } else if (best.indexOf('상')) {
      lowSoil = 51;
      highSoil = 100;
      return;
    }
    if (current >= lowSoil && current <= highSoil) {
      return false;
    } else if (current > highSoil) {
      return true;
    } else if (current < lowSoil) {
      return false;
    }
  }
  async changeName(myPlantId, name) {
    const alert = await this.alertController.create({
      cssClass: 'alert',
      message: '변경할 이름을 입력해주세요',
      inputs: [{ name: 'name', type: 'text', value: `${name}` }],
      buttons: [
        {
          text: '확인',
          handler: data => {
            this.db.updateAt(`myPlant/${myPlantId}`, {
              name: data.name,
            });
          },
        },
      ],
    });

    await alert.present();
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
    this.navController.navigateBack(['/tabs/plant']);
  }
}
