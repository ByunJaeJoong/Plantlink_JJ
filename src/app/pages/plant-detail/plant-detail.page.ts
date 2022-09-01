import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { DbService, docJoin, docListJoin, leftJoinDocument } from 'src/app/services/db.service';

@Component({
  selector: 'app-plant-detail',
  templateUrl: './plant-detail.page.html',
  styleUrls: ['./plant-detail.page.scss'],
})
export class PlantDetailPage implements OnInit {
  myPlantId: any;
  plantInfo$: Observable<any>;
  plant$: Observable<any>;
  name: string;
  plant: any;
  plantInfo: any;
  constructor(private navController: NavController, private route: ActivatedRoute, private db: DbService, private alertController: AlertController) {
    this.myPlantId = this.route.snapshot.queryParams.plantId;
  }
  slideOpts = {
    initialSlide: 0,
    speed: 1000,
    loop: true,
    zoom: false,
    spaceBetween: 0,
    slidesPerView: 1,
  };

  ngOnInit() {
    this.getData();
  }

  async getData() {
    this.plantInfo$ = await this.db.doc$(`myPlant/${this.myPlantId}`).pipe(docJoin(this.db.afs, 'plantBookId', 'plantBook'));
    this.plantInfo = await this.plantInfo$.pipe(first()).toPromise();
    console.log(this.plantInfo);
  }

  async changeName() {
    const alert = await this.alertController.create({
      cssClass: 'alert',
      message: '변경할 이름을 입력해주세요',
      inputs: [{ name: 'name', type: 'text', value: `${this.plantInfo.name}` }],
      buttons: [
        {
          text: '확인',
          handler: data => {
            this.db.updateAt(`myPlant/${this.myPlantId}`, {
              name: data.name,
            });
            this.plantInfo.name = data.name;
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
