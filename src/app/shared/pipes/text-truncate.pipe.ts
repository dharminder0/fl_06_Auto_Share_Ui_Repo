import { Pipe, PipeTransform, NgModule } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';

@Pipe({
    name: 'truncate',
    pure: false
})
export class TextTruncatePipe implements PipeTransform {
    transform(value, truncateLength): any {
        if (value == '' || !value) {
            return ''
        }

        else {
            if (value.trim().length > 35)
                return value.trim().substr(0, truncateLength) + '...'
            else return value.trim();
        }

    }
}

@NgModule({
    imports: [
    ],
    declarations: [
        TextTruncatePipe,

    ],
    exports: [
        TextTruncatePipe,
    ]
})
export class TextTruncatePipeModule { }
