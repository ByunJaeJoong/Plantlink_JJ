import { HttpClient } from '@angular/common/http';
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
  date = new Date();

  constructor(private http: HttpClient, private navController: NavController, private modalController: ModalController) {}

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
    cssClass: 'asdlkfjal',
  };

  ngOnInit() {
    this.http.jsonp<MbscCalendarEvent[]>('https://trial.mobiscroll.com/events/?vers=5', 'callback').subscribe(resp => {
      this.myEvents = resp;
    });
  }

  test(ev) {
    console.log('ev', ev.month);
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
