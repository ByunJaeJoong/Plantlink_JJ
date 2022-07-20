import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-diary-write-camera',
  templateUrl: './diary-write-camera.page.html',
  styleUrls: ['./diary-write-camera.page.scss'],
})
export class DiaryWriteCameraPage implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  //모달 닫기
  done() {
    this.modalController.dismiss();
  }

  //취소하기
  cancel() {
    this.modalController.dismiss();
  }
}
