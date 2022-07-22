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
    // dateFormat: 'YYYY/mm',
    dateFormatLong: 'YYYY.mm',
    noEventsText: ``,
    view: {
      calendar: { type: 'month' },
      agenda: { type: 'month' },
    },
  };

  ngOnInit() {
    this.http.jsonp<MbscCalendarEvent[]>('https://trial.mobiscroll.com/events/?vers=5', 'callback').subscribe(resp => {
      this.myEvents = resp;
    });
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
}
