import { Pipe, PipeTransform, NgModule } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})

export class FilterPipe implements PipeTransform {
  tagBool:boolean = false
  transform(value: any,
    filterString: string) {
    if (!value) return true;
    if (value.length === 0 || !filterString) {
      return value;
    }
    const filterArray = [];
    for (let item of value) {
      if(filterString){
        filterString = filterString.replace(new RegExp("\\\\", "g"), "\\\\");
      }
      if(filterString == "*"){
        filterString = ""
      }
      var regEx = new RegExp(filterString, 'ig')
      if(item.TagDetails.length > 0){
        item.TagDetails.forEach((element)=>{
          if (item['QuizTitle'].match(regEx) || item['createdOnFormat'].match(regEx) || element['LabelText'].match(regEx)) {
            this.tagBool = true;
          }
        })
        if(this.tagBool){
          filterArray.push(item)};
          this.tagBool = false;
      }else{
      if (item['QuizTitle'].match(regEx) || item['createdOnFormat'].match(regEx)) {
        filterArray.push(item);
      }
    }
    }
    return filterArray;
  }

}

@NgModule({
    declarations: [FilterPipe],
    exports: [FilterPipe]
})

export class FilterPipeModule{}
