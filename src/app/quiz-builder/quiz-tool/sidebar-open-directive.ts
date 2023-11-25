/**
 * @example
        <div>
            <h4 ccOpen id="cover"></h4>
        </div>
        <div class="toggle-box in">
        </div>
   @description  when ccOpen element is clicked the directive emits its id
    and it also listens to the id. If the directive element's emitted id 
    and the listening id is same, then the directive element is toggled 'open'
    class and the 'toggle-box'  is toggled display-block/display-none.
 */

import { Directive, ElementRef, HostListener, Renderer2, OnInit } from '@angular/core';
import { QuizzToolHelper } from './quiz-tool-helper.service';
import { Subscription } from 'rxjs/Subscription';

@Directive({
    selector: "[ccOpen]"
})
export class SidebarOpenDirective implements OnInit {
    public focusSubscription: Subscription;

    @HostListener('click', ['$event']) onClick($event) {
        this.quizzToolHelper.updateOptionClicked(this.el.nativeElement.id);
    }


    constructor(private el: ElementRef,
        private renderer: Renderer2,
        private quizzToolHelper: QuizzToolHelper) { }


    ngOnInit() {

        this.focusSubscription = this.quizzToolHelper.whenUpdateOptionClicked()
            .subscribe((id) => {
                if (id == this.el.nativeElement.id) {
                    if (this.el.nativeElement.classList.contains('open')) {
                        this.renderer.removeClass(this.el.nativeElement, 'open');
                        this.renderer.removeClass(this.el.nativeElement.parentElement.nextElementSibling, 'display-block')
                        this.renderer.addClass(this.el.nativeElement.parentElement.nextElementSibling, 'display-none')
                    } else {
                        this.renderer.addClass(this.el.nativeElement, 'open');
                        this.renderer.addClass(this.el.nativeElement.parentElement.nextElementSibling, 'display-block')
                        this.renderer.removeClass(this.el.nativeElement.parentElement.nextElementSibling, 'display-none')
                    }
                } else {
                    this.renderer.removeClass(this.el.nativeElement, 'open');
                    this.renderer.removeClass(this.el.nativeElement.parentElement.nextElementSibling, 'display-block')
                    this.renderer.addClass(this.el.nativeElement.parentElement.nextElementSibling, 'display-none')
                }
            })
    }

    ngOnDestroy() {
        this.focusSubscription.unsubscribe()
    }
}