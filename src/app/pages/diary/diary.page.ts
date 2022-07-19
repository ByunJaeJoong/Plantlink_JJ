import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { localeKo, MbscEventcalendarOptions } from '@mobiscroll/angular';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.page.html',
  styleUrls: ['./diary.page.scss'],
})
export class DiaryPage implements OnInit {
  constructor(private http: HttpClient) {}

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

  ngOnInit() {}
}
