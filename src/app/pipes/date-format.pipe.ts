import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/ko';
moment.locale('ko');

@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
  transform(date: any, args?: any): any {
    let now = moment(new Date(date)).fromNow();

    if (now == '몇 초 후') {
      now = '몇 초 전';
    }
    return now;
  }
}
