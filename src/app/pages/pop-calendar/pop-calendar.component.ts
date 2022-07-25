import { Component, OnInit } from '@angular/core';
import { localeKo, MbscEventcalendarOptions } from '@mobiscroll/angular';

@Component({
  selector: 'app-pop-calendar',
  templateUrl: './pop-calendar.component.html',
  styleUrls: ['./pop-calendar.component.scss'],
})
export class PopCalendarComponent implements OnInit {
  constructor() {}

  eventSettings: MbscEventcalendarOptions = {
    locale: localeKo,
  };

  ngOnInit() {}
}
