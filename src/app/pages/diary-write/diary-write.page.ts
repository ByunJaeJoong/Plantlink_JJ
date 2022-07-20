import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-diary-write',
  templateUrl: './diary-write.page.html',
  styleUrls: ['./diary-write.page.scss'],
})
export class DiaryWritePage implements OnInit {
  constructor(private modalController: ModalController, private navController: NavController) {}

  ngOnInit() {}

  //모달 닫기
  close() {
    this.modalController.dismiss();
  }

  //뒤로가기버튼
  goHome() {
    this.navController.navigateForward(['/diary']);
    this.modalController.dismiss();
  }
}
