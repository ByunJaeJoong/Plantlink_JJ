import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { localeKo, MbscEventcalendarOptions } from '@mobiscroll/angular';

@Component({
  selector: 'app-pop-calendar',
  templateUrl: './pop-calendar.component.html',
  styleUrls: ['./pop-calendar.component.scss'],
})
export class PopCalendarComponent implements OnInit {
  date = new Date();
  selectedDate: string = '';

  constructor(private navController: NavController) {}

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

  // 식물 보고서 달력에서 클릭한 날짜를 파라미터에 보냄
  selectedClickDate() {
    this.navController.navigateForward(['/plant-report'], {
      queryParams: {
        selectedDate: this.selectedDate,
      },
    });
  }

  test(ev: any) {
    this.date = ev.month;
  }
}
