import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { CommonService } from 'src/app/services/common.service';
import { DbService } from 'src/app/services/db.service';
import { DiaryWriteCameraPage } from '../diary-write-camera/diary-write-camera.page';

@Component({
  selector: 'app-diary-write',
  templateUrl: './diary-write.page.html',
  styleUrls: ['./diary-write.page.scss'],
})
export class DiaryWritePage implements OnInit {
  diary: any = {
    diaryId: '',
    dateCreated: '',
    content: '',
    images: [],
    selectDate: '',
  };

  constructor(
    private modalController: ModalController,
    private navController: NavController,
    private navParams: NavParams,
    private db: DbService,
    private common: CommonService,
    private alert: AlertService
  ) {
    this.diary.selectDate = this.navParams.get('selectDate');
  }

  ngOnInit() {}

  // 일기장 등록
  async save() {
    this.diary.diaryId = this.common.generateFilename();
    this.diary.dateCreated = new Date().toISOString();

    await this.db.updateAt(`diary`, this.diary);
    this.alert.okBtn('', '일기장 등록이 완료되었습니다.');
    this.close();
  }

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
