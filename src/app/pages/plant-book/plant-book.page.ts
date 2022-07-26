import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-plant-book',
  templateUrl: './plant-book.page.html',
  styleUrls: ['./plant-book.page.scss'],
})
export class PlantBookPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  //홈화면으로
  goHome() {
    this.navController.navigateForward(['/tabs/home']);
  }

  //식물 정보 디테일
  goPlantBookDetail() {
    this.navController.navigateForward(['/plant-book-detail']);
  }
}
