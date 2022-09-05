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
