import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalController, NavController } from '@ionic/angular';
import { localeKo, MbscCalendarEvent, MbscEventcalendarOptions } from '@mobiscroll/angular';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
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
  selectDate: string = '';
  diaryData$: Observable<any>;

  myEvents: MbscCalendarEvent[] = [];
  diaryDetail: any;
  diaryData: any;
  a: any = [];
  b: any = [];

  eventSettings: MbscEventcalendarOptions = {
    locale: localeKo,
    theme: 'ios',
    themeVariant: 'light',
    clickToCreate: false,
    dragToCreate: false,
    dragToMove: false,
    dragToResize: false,
    dateFormatLong: 'YYYY.mm',
    noEventsText: ``,
    view: {
      calendar: { type: 'month' },
      agenda: { type: 'month' },
    },
    // 일기디테일을 클릭하였을 때, 그 안에 데이터
    onEventClick: (event, isnst) => {
      console.log(event.event);
    },
    // 캘린더에서 클릭한 날에 대한 정보
    onSelectedDateChange: (args, inst) => {
      let date = new Date(args.date + '');
      date.setHours(date.getHours() + 9);
      this.selectDate = date.toISOString();
      // this.diaryDetail = this.diaryData$.pipe(map(data: any)=> {})
      // this.diaryData = this.diaryData$.
      this.diaryDetail = this.diaryData.filter(data => data.selectDate?.indexOf(this.selectDate) > -1);
      console.log(this.diaryDetail);
    },
  };
  constructor(private http: HttpClient, private navController: NavController, private modalController: ModalController, private db: DbService) {
    // diary 페이지에 오면 당일에 표시
    this.selectDate = new Date().toISOString();
    this.getData();
  }

  async ngOnInit() {
    this.a = await this.db.collection$(`diary`).pipe(first()).toPromise();
    console.log(this.a);
  }

  async getData() {
    const defaultColor: string = '#ff6d42';

    this.diaryData$ = this.db.collection$(`diary`).pipe(
      map(diarys => {
        diarys.map((diary: any) => {
          (diary.color = defaultColor),
            (diary.end = diary.selectDate),
            (diary.id = diary.diaryId),
            (diary.start = diary.selectDate),
            (diary.title = diary.content),
            (diary.image = diary.images[0]);
        });
        return diarys;
      })
    );
    this.diaryData = await this.diaryData$.pipe(first()).toPromise();
  }

  test(ev: any) {
    this.date = ev.month;
  }

  //홈으로
  goDiaryDetail() {
    this.navController.navigateForward(['/diary-detail']);
  }

  //일기디테일
  goHome() {
    this.navController.navigateForward(['/tabs/home']);
  }

  //일기쓰러가기
  async goWrite() {
    const modal = await this.modalController.create({
      component: DiaryWritePage,
      componentProps: {
        selectDate: this.selectDate,
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
