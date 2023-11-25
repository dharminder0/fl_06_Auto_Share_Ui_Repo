import { Directive, OnInit, ElementRef, Renderer2, HostBinding, HostListener } from '@angular/core';

@Directive({
    selector: "[dropdownToggle]"
})
export class DropdownDirective implements OnInit {

    public isOpen: boolean = false;
    public className = 'open';
    toggleItemList = [];

    constructor(private ele: ElementRef,
    private renderer: Renderer2){}

    ngOnInit() {

    }

    @HostListener('click') onClick() {
        if(this.ele.nativeElement.className.match(this.className)){
            this.isOpen = true;
        }else{
            this.isOpen = false;
        }
        var length = this.ele.nativeElement.parentNode.parentNode.parentNode.children.length-1;
        this.toggleItemList = [];
        for(var i=1; i<length; i++){
            this.toggleItemList.push(this.ele.nativeElement.parentNode.parentNode.parentNode.children[i]);
        }
        this.toggleItemList.forEach(data => {
            this.renderer.setStyle(data.children[1], 'display', 'none');
            // this.renderer.setStyle(data.children[1], 'opacity', '0');
        });
        if(!this.isOpen){
            // this.renderer.setStyle(this.ele.nativeElement.parentNode.nextElementSibling, 'opacity', '1');
            this.renderer.setStyle(this.ele.nativeElement.parentNode.nextElementSibling, 'display', 'block');
            // this.renderer.setStyle(this.ele.nativeElement.parentNode.nextElementSibling, 'transition', "all 10s linear")            
            this.isOpen = true;
        }
    }
}