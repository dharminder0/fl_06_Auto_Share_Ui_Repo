import { Directive, NgModule, Renderer2, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appActive2]'
})
export class appActive2 {

  constructor(private renderer : Renderer2,
    private elRef : ElementRef) { }

    @HostListener("click",["event"])
  onclick(event)
  {
    let e =<MouseEvent>event;
    var data = this.elRef.nativeElement.parentNode.parentNode.children;

    if(this.elRef.nativeElement.classList.contains('backCol'))
    {
      this.renderer.addClass(this.elRef.nativeElement,'back');
      this.renderer.removeClass(this.elRef.nativeElement,'backCol')
    }
    else
    {
      this.renderer.addClass(this.elRef.nativeElement,'backCol');
      this.renderer.removeClass(this.elRef.nativeElement,'back')
    }
    
  }

}
@NgModule({
  declarations: [appActive2],
  exports: [appActive2]
})
export class appActive2Module {}
