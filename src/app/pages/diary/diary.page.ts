import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { localeKo, MbscCalendarEvent, MbscEventcalendarOptions } from '@mobiscroll/angular';
import { DiaryWritePage } from '../diary-write/diary-write.page';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.page.html',
  styleUrls: ['./diary.page.scss'],
})
export class DiaryPage implements OnInit {
  date: Date = new Date();
  selectDate: string = '';

  myEvents: MbscCalendarEvent[] = [];

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
    },
  };
  constructor(private navController: NavController, private modalController: ModalController) {
    // diary 페이지에 오면 당일에 표시
    this.selectDate = new Date().toISOString();
  }

  ngOnInit() {}

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
