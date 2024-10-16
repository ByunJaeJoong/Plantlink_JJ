import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { DbService } from 'src/app/services/db.service';
import { DiaryWritePage } from '../diary-write/diary-write.page';

@Component({
  selector: 'app-diary-detail',
  templateUrl: './diary-detail.page.html',
  styleUrls: ['./diary-detail.page.scss'],
})
export class DiaryDetailPage implements OnInit {
  diaryId: string = '';
  diaryData: any = [];

  constructor(private navController: NavController, private route: ActivatedRoute, private db: DbService, private modalController: ModalController) {
    // 클릭한 일기장 id값을 파라미터로 전달
    this.route.queryParams.subscribe(params => {
      this.diaryId = params.diaryId;
      this.getData();
    });
  }

  ngOnInit() {}

  async getData() {
    // 데이터를 수정할 때, 클릭한 일기장 정보를 불러옴
    this.diaryData = await this.db.doc$(`diary/${this.diaryId}`).pipe(first()).toPromise();
  }

  onRightClick(e) {
    return false;
  }
  //달력화면으로 !
  goDiary() {
    this.navController.navigateBack(['/diary']);
  }

  //일기수정하기
  async goDiaryWrite() {
    const modal = await this.modalController.create({
      component: DiaryWritePage,
      componentProps: {
        // 클릭한 일기장 정보를 modal창에 넘겨줌
        diaryData: this.diaryData,
      },
    });
    return await modal.present();
  }
}
