import { Component, OnInit } from '@angular/core';
import { localeKo, MbscEventcalendarOptions } from '@mobiscroll/angular';

@Component({
  selector: 'app-pop-calendar',
  templateUrl: './pop-calendar.component.html',
  styleUrls: ['./pop-calendar.component.scss'],
})
export class PopCalendarComponent implements OnInit {
  date = new Date();
  constructor() {}

  eventSettings: MbscEventcalendarOptions = {
    locale: localeKo,
    theme: 'ios',
    themeVariant: 'light',
    clickToCreate: false,
    dragToCreate: false,
    dragToMove: false,
    dragToResize: false,
  };

  ngOnInit() {}

  test(ev) {
    console.log('ev', ev.month);
    this.date = ev.month;
  }
}
