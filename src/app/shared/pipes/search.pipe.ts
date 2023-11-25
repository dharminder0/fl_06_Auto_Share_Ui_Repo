import { Pipe, PipeTransform, NgModule, Injectable } from '@angular/core';

@Pipe({
  name: 'searchPipe'
})
@Injectable()
export class SearchPipe implements PipeTransform {

  transform(items: any[], field: string, value: string): any[] {
    if (!value) return items;
    let tempVal:string = "";
    let output:boolean = false;
 
    return items.filter(function(it){
     output = false;
     tempVal = "";
     tempVal = it[field];
 
     if(tempVal.toLowerCase().indexOf(value.toLowerCase()) >= 0){
       return it;
     }
     else if(it.children){
       it.children.map(function(currChild){
         if(currChild.name.toLowerCase().indexOf(value.toLowerCase()) >= 0){
           output = true;
         }
       });
 
       if(output){
         return it;
       }
     }
    });
  }

}

@Pipe({
  name: 'searchArrayPipe'
})

@Injectable()
export class SearchArrayPipe implements PipeTransform {
  transform(items: any[], field: string, value: string): any[] {
    if (!value) return items;

    let tempVal:string = "";
    let output:boolean = false;
 
    return items.filter(function(it){
     output = false;
     tempVal = "";
     tempVal = it[field];
 
     if(tempVal.toLowerCase().indexOf(value.toLowerCase()) >= 0){
       return it;
     }
     else{
       if(output){
         return it;
       }
     }
    });
  }
}


@Pipe({
  name: 'removeTagPipe'
})

@Injectable()
export class RemoveTagPipe implements PipeTransform {
  transform(value: any) {
    let regex = /(<([^>]+)>)/ig
    return value.replace(regex,"");
  }
 }

 @Pipe({
  name: 'removeallTagPipe'
})

@Injectable()
export class RemoveallTagPipe implements PipeTransform {
  transform(value: any) {
    if(!value){
      return value;
    }
    return value.replace(/<[^>]*>/g,"").replace(/(\&(\w)+\;)/g," ").replace(/\s+/g, ' ');
  }
 }

@NgModule({
  imports: [],
  declarations: [ 
    SearchPipe,
    RemoveTagPipe,
    RemoveallTagPipe,
    SearchArrayPipe
  ],
  exports: [
    SearchPipe,
    RemoveTagPipe,
    RemoveallTagPipe,
    SearchArrayPipe
  ]
})
export class SearchPipes {}
