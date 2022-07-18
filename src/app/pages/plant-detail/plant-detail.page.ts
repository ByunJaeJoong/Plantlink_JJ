import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-plant-detail',
  templateUrl: './plant-detail.page.html',
  styleUrls: ['./plant-detail.page.scss'],
})
export class PlantDetailPage implements OnInit {
  constructor(private navController: NavController) {}
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
    this.navController.navigateForward(['/tabs/home']);
  }
}
