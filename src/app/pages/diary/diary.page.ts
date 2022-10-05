import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { localeKo, MbscCalendarEvent, MbscEventcalendarOptions } from '@mobiscroll/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DbService } from 'src/app/services/db.service';
import { DiaryWritePage } from '../diary-write/diary-write.page';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.page.html',
  styleUrls: ['./diary.page.scss'],
})
export class DiaryPage implements OnInit {
  userId: string = localStorage.getItem('userId');
  date: Date = new Date();
  postDate: string = '';
  diaryData$: Observable<any>;

  myEvents: MbscCalendarEvent[] = [];

  eventSettings: MbscEventcalendarOptions = {
    locale: localeKo,
    theme: 'ios',
    themeVariant: 'light',
    clickToCreate: false,
    dragToCreate: false,
    dragToMove: false,
    dragToResize: false,
    dateFormatLong: '',
    noEventsText: ``,
    view: {
      calendar: { type: 'month' },
      agenda: { type: 'day' },
    },
    // 캘린더에서 클릭한 날에 대한 정보
    onSelectedDateChange: (args, inst) => {
      let date = new Date(args.date + '');
      // 영국시간으로 맞춰진 시간을 한국시간과 동일하게 계산
      date.setHours(date.getHours() + 9);
      this.postDate = date.toISOString();
    },
  };

  constructor(private navController: NavController, private modalController: ModalController, private db: DbService) {
    // diary 페이지에 오면 당일에 표시
    this.postDate = new Date().toISOString();
    this.getData();
  }

  async ngOnInit() {}

  async getData() {
    const defaultColor: string = '#ff6d42';

    // 데이터 삭제 하지 않은 일기장 내용
    this.diaryData$ = this.db
      .collection$(`diary`, (ref: any) => ref.where('userId', '==', this.userId).where('deleteSwitch', '==', false).orderBy('dateCreated', 'desc'))
      .pipe(
        map(diarys => {
          diarys.map((diary: any) => {
            (diary.color = defaultColor),
              (diary.end = diary.postDate), // 클릭한날짜
              (diary.start = diary.postDate), // 당일
              (diary.id = diary.diaryId),
              (diary.title = diary.content),
              (diary.image = diary.images?.[0]);
          });
          return diarys;
        })
      );
  }

  test(ev: any) {
    this.date = ev.month;
  }

  order(event) {
    return true;
  }

  //일기디테일
  goDiaryDetail(diaryId: string) {
    this.navController.navigateForward(['/diary-detail'], {
      queryParams: {
        diaryId: diaryId,
      },
    });
  }

  // 일기 삭제
  delete(id) {
    this.db.updateAt(`diary/${id}`, {
      deleteSwitch: true,
    });
  }

  //홈으로
  goHome() {
    this.navController.navigateBack(['/tabs/home']);
  }

  //일기쓰러가기
  async goWrite() {
    const modal = await this.modalController.create({
      component: DiaryWritePage,
      componentProps: {
        postDate: this.postDate,
      },
    });
    return await modal.present();
  }

  //줄 쩜쩜쩜
  ionViewWillEnter() {
    this.textStyling();
  }
  textStyling() {
    const cont = document.querySelectorAll<HTMLElement>('.rows-ellipsis');

    cont.forEach(ele => {
      if (ele.clientHeight > 20) {
        ele.style.display = '-webkit-box';
        ele.style.webkitLineClamp = '4';
        ele.style.webkitBoxOrient = 'vertical';
      }
    });
  }
}
