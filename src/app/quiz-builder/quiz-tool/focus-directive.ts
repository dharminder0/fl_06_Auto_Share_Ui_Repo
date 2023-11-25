import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  OnInit
} from "@angular/core";
import { QuizzToolHelper } from "./quiz-tool-helper.service";

@Directive({
  selector: "[ccFocus]"
})
export class FocusDirective implements OnInit {
  public focusSubscription;
  public FOCUS_STYLE = `box-shadow: 0 0 10px 3px var(--primary-color);
    transition: 0.5s ease-out;`;

  @HostListener("mouseover", ["$event"])
  onmouseenter($event) {
    this.quizzToolHelper.focus(this.el.nativeElement.id);
  }
  @HostListener("mouseleave", ["$event"])
  onmouseleave($event) {
    this.quizzToolHelper.focus(null);
  }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private quizzToolHelper: QuizzToolHelper
  ) {}

  ngOnInit() {
    this.focusSubscription = this.quizzToolHelper.whenFocus().subscribe(id => {
      if (id == this.el.nativeElement.id) {
        this.renderer.setStyle(
          this.el.nativeElement,
          "box-shadow",
          "0 0 10px 3px var(--primary-color)"
        );
        this.renderer.setStyle(
          this.el.nativeElement,
          "transition",
          "0.5s ease-out"
        );
      } else {
        this.renderer.removeStyle(this.el.nativeElement, "box-shadow");
        this.renderer.removeStyle(this.el.nativeElement, "transition");
      }
    });
  }

  ngOnDestroy() {
    this.focusSubscription.unsubscribe();
  }
}
