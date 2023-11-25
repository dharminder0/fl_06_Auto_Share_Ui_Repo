import { NgModule, Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[OnlyTime]'
})
export class OnlyTime {

    constructor(private el: ElementRef) { }

    @Input() OnlyTime: boolean;

    @HostListener('keydown', ['$event']) onKeyDown(event) {
        let e = <KeyboardEvent>event;
        if (this.OnlyTime) {
            if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
                // Allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) ||
                // Allow: Ctrl+C
                (e.keyCode == 67 && e.ctrlKey === true) ||
                // Allow: Ctrl+X
                (e.keyCode == 86 && e.ctrlKey === true) ||
                (e.keyCode == 88 && e.ctrlKey === true) ||
                (e.keyCode == 186 && e.shiftKey == true) ||
                (e.keyCode == 189) ||
                (e.keyCode == 188) ||
                (e.keyCode == 65) ||
                (e.keyCode == 77) ||
                (e.keyCode == 80) ||
                (e.keyCode == 32) ||

                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            else if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        }
    }
}
@NgModule({
    declarations: [
        OnlyTime
    ],
    exports: [OnlyTime]
})
export class OnlyTimeModule { }