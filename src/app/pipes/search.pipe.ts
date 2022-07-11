import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  pure: false,
})
export class SearchPipe implements PipeTransform {
  constructor() {}
  /** ngFor를 통한 구성 중 필터링 처리를 도와줄 파이프
   * items는 필터를 하게 될 리스트 Array를 보내고 filter값이 들어있는 값만 return
   */
  transform(items: any[], filter: string) {
    if (!items || items === undefined || !filter) {
      return items;
    } else {
      return items.filter(
        item => item.content.toUpperCase().indexOf(filter.toUpperCase()) !== -1 || item.name.toUpperCase().indexOf(filter.toUpperCase()) !== -1
      );
    }
  }
}
