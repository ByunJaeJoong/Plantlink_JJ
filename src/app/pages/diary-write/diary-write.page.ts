import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, NavController, NavParams } from '@ionic/angular';
import { Diary } from 'src/app/models/diary.model';
import { CommonService } from 'src/app/services/common.service';
import { DbService } from 'src/app/services/db.service';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-diary-write',
  templateUrl: './diary-write.page.html',
  styleUrls: ['./diary-write.page.scss'],
})
export class DiaryWritePage implements OnInit {
  userId: string = localStorage.getItem('userId');

  diary: Diary = {
    diaryId: '',
    dateCreated: '',
    content: '',
    images: [],
    postDate: '',
    userId: '',
    deleteSwitch: false,
  };

  diaryData: any = [];

  constructor(
    private modalController: ModalController,
    private navController: NavController,
    private navParams: NavParams,
    private db: DbService,
    private common: CommonService,
    private image: ImageService,
    private actionSheetController: ActionSheetController
  ) {
    this.diary.postDate = this.navParams.get('postDate');
    this.diaryData = this.navParams.get('diaryData');
    this.getData();
  }

  async getData() {
    if (this.diaryData) {
      this.diary.diaryId = this.diaryData.id;
      this.diary.content = this.diaryData.content;
      this.diary.images = this.diaryData.images;
      this.diary.dateCreated = this.diaryData.dateCreated;
      this.diary.postDate = this.diaryData.postDate;
      this.diary.userId = this.diaryData.userId;
      this.diary.deleteSwitch = this.diaryData.deleteSwitch;
    }
  }

  ngOnInit() {}

  // 일기장 등록
  async save() {
    // 데이터 수정 시, 수정된 데이터만 update
    if (this.diaryData) {
      this.updateDiary();
      this.navController.navigateForward(['/diary']);
    } else {
      this.diary.diaryId = this.common.generateFilename();
      this.diary.dateCreated = new Date().toISOString();
      this.diary.userId = this.userId;

      this.updateDiary();
    }
  }

  // 일기장등록 후 db에 저장
  async updateDiary() {
    await this.db.updateAt(`diary/${this.diary.diaryId}`, this.diary);
    this.close();
  }

  // 사진을 누를 때, 우클릭 방지
  onRightClick(e) {
    return false;
  }

  //모달 닫기
  close() {
    this.modalController.dismiss();
  }

  //뒤로가기버튼
  goHome() {
    this.navController.navigateBack(['/diary']);
    this.modalController.dismiss();
  }

  // 카메라 또는 갤러리 선택
  async goAlbum() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: '카메라',
          handler: async () => {
            const url = await this.image.getCamera('diaryImg');
            this.imageCheck();
            this.diary.images.push(url);
          },
        },
        {
          text: '갤러리',
          handler: async () => {
            const url = await this.image.getGallery('diaryImg');
            this.imageCheck();
            this.diary.images.push(url);
          },
        },
        {
          text: '취소',
          role: 'cancel',
          handler: () => {},
        },
      ],
    });

    await actionSheet.present();
  }

  imageCheck() {
    if (this.diary.images.length > 0) {
      this.diary.images = [];
    }
  }
}
