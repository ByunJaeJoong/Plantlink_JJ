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
    this.route.queryParams.subscribe(params => {
      this.diaryId = params.diaryId;
      this.getData();
    });
  }

  ngOnInit() {}

  async getData() {
    this.diaryData = await this.db.doc$(`diary/${this.diaryId}`).pipe(first()).toPromise();
  }

  //달력화면으로 !
  goDiary() {
    this.navController.navigateForward(['/diary']);
  }

  //일기수정하기
  async goDiaryWrite() {
    const modal = await this.modalController.create({
      component: DiaryWritePage,
      componentProps: {
        diaryData: this.diaryData,
      },
    });
    return await modal.present();
  }
}
