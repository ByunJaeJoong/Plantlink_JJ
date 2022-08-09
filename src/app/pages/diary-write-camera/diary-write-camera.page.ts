import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-diary-write-camera',
  templateUrl: './diary-write-camera.page.html',
  styleUrls: ['./diary-write-camera.page.scss'],
})
export class DiaryWriteCameraPage implements OnInit {
  images: Array<string> = [];

  constructor(private modalController: ModalController, private image: ImageService, private db: DbService, private navParams: NavParams) {
    this.images = this.navParams.get('images');
  }

  async ngOnInit() {
    //await this.image.getGallery('diaryImg');
  }

  async camera() {
    const url = await this.image.getCamera('diaryImg');
    this.images.push(url);
  }

  imageClick() {
    console.log('클릭');
  }
  //모달 닫기
  done() {
    this.modalController.dismiss();
  }

  //취소하기
  cancel() {
    this.modalController.dismiss();
  }
}
