import { Pipe, PipeTransform, NgModule, Injectable } from '@angular/core';

@Pipe({
  name: 'templateSearchPipe'
})

@Injectable()
export class TemplateSearchPipe implements PipeTransform {
 transform(items: any[], value: string): any[] {
   if (!value) return items;

   return items.filter(function(it){
    if(!it.TemplateTitle && it.templates.toLowerCase().indexOf(value.toLowerCase()) >= 0){
      return it;
    }else{
      if(!!it.TemplateTitle && it.TemplateTitle.toLowerCase().indexOf(value.toLowerCase())>= 0){
        return it;
      }
    } 
   });
 }
}


@NgModule({
  imports: [],
  declarations: [ 
    TemplateSearchPipe
  ],
  exports: [
    TemplateSearchPipe
  ]
})
export class templateSearchPipes {}
