import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(items: any, keyword: string) {
    if (keyword) {
      items = items.filter(ele => ele.name.indexOf(keyword) > -1);
    }
    // return items.sort(this.dynamicSort('nickname'));
    return items;
  }

  // dynamicSort(property) {
  //   var sortOrder = 1;
  //   if (property[0] === '-') {
  //     sortOrder = -1;
  //     property = property.substr(1);
  //   }
  //   return function (a, b) {
  //     var result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
  //     return result * sortOrder;
  //   };
  // }
}
