import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-plant-detail',
  templateUrl: './plant-detail.page.html',
  styleUrls: ['./plant-detail.page.scss'],
})
export class PlantDetailPage implements OnInit {
  myPlantId: any;
  plantInfo: any;
  constructor(private navController: NavController, private route: ActivatedRoute, private db: DbService) {
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
    this.plantInfo = await this.db.doc$(`myPlant/${this.myPlantId}`).pipe(first()).toPromise();
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
