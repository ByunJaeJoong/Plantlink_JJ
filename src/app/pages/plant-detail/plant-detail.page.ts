import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-plant-detail',
  templateUrl: './plant-detail.page.html',
  styleUrls: ['./plant-detail.page.scss'],
})
export class PlantDetailPage implements OnInit {
  plantInfo: any;
  constructor(private navController: NavController, private route: ActivatedRoute, private db: DbService) {
    this.route.queryParams.subscribe(data => {
      this.plantInfo = data;
    });
  }
  slideOpts = {
    initialSlide: 0,
    speed: 1000,
    loop: true,
    zoom: false,
    spaceBetween: 0,
    slidesPerView: 1,
  };

  ngOnInit() {}

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
    this.navController.navigateForward(['/tabs/plant']);
  }
}
