import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(items: any, keyword: string) {
    if (keyword) {
      items = items.filter(ele => ele.name.indexOf(keyword) > -1);
    }

    return items;
  }
}
