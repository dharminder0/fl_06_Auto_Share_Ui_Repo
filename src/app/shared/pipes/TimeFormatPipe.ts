import { Pipe, PipeTransform, NgModule } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';

@Pipe({ name: 'timeformat' })
export class TimeFormatPipe implements PipeTransform {
    transform(value, fromFormat, toFormat): any {
        if (!value) return value;
        if (fromFormat == 'date') {
            return moment(value).format(toFormat);
        } else {
            return moment(value, fromFormat).format(toFormat);
        }

    }
}
@Pipe({ name: 'defaultImage' })
export class DefaultImagePipe implements PipeTransform {
    transform(value: string, fallback: string): string {
        let image = "";
        if (value) {
          image = value;
        } else {
          image = fallback;
        }
         return image;
      }
}

@NgModule({
    imports: [
        // dep modules
    ],
    declarations: [
        DefaultImagePipe,
        TimeFormatPipe
    ],
    exports: [
        DefaultImagePipe,
        TimeFormatPipe
    ]
})
export class ApplicationPipes { }
