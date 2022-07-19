import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { localeKo, MbscCalendarEvent, MbscEventcalendarOptions } from '@mobiscroll/angular';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.page.html',
  styleUrls: ['./diary.page.scss'],
})
export class DiaryPage implements OnInit {
  constructor(private http: HttpClient) {}

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
    // dateFormatLong: 'YYYY/mm',
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
}
