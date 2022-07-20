import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { DiaryWriteCameraPage } from '../diary-write-camera/diary-write-camera.page';

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

  //앨범으로 가기
  async goAlbum() {
    const modal = await this.modalController.create({
      component: DiaryWriteCameraPage,
    });
    return await modal.present();
  }
}
