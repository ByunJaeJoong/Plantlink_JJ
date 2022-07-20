import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-diary-detail',
  templateUrl: './diary-detail.page.html',
  styleUrls: ['./diary-detail.page.scss'],
})
export class DiaryDetailPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  //달력화면으로 !
  goDiary() {
    this.navController.navigateForward(['/diary']);
  }

  //일기수정하기
  goDiaryWrite() {
    this.navController.navigateForward(['/diary-write']);
  }
}
