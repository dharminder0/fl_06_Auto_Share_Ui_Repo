import { Directive, HostListener, NgModule, Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[appActive]'
})
export class appActive {

  constructor(private renderer : Renderer2,
    private elRef : ElementRef) { }
   
  @HostListener("click",["event"])
  onclick(event)
  {
    let e =<MouseEvent>event;
    var data = this.elRef.nativeElement.parentNode.parentNode.children;

    for(var i=0 ; i< data.length ; i++)
    {
      data[i].children[0].setAttribute('class','back');
    }

    if(this.elRef.nativeElement.getAttribute('class') == 'backCol')
    {
      this.elRef.nativeElement.setAttribute('class','back');
    }
    else
    {
      this.elRef.nativeElement.setAttribute('class','backCol');
    }

  }
}

@NgModule({
  declarations: [appActive],
  exports: [appActive]
})
export class appActiveModule {}

