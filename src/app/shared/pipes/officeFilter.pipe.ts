import { Pipe, PipeTransform, NgModule } from '@angular/core';

@Pipe({
  name: 'filterOffice',
  pure: false
})

export class FilterOfficePipe implements PipeTransform {

  transform(value: any,
    filterString: string) {
    if (!value) return true;
    if (value.length === 0 || filterString === '') {
      return value;
    }
    const filterArray = [];
    for (let item of value) {
      if(!item['name']){
        item['name'] = ''
      }
      if(filterString){
        filterString = filterString.replace(new RegExp("\\\\", "g"), "\\\\");
      }
      if(filterString == "*"){
        filterString = ""
      }
      var regEx = new RegExp(filterString, 'ig')
      if (item['name'].match(regEx)) {
        filterArray.push(item);
      }
    }
    return filterArray;
  }

}

@NgModule({
    declarations: [FilterOfficePipe],
    exports: [FilterOfficePipe]
})

export class FilterOfficePipeModule{}
