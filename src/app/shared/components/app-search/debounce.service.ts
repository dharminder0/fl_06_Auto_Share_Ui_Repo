import { Injectable } from '@angular/core';
@Injectable()
export class DebounceService {
    timeout = null;
    delay(search?, time?) {
        clearTimeout(this.timeout);
        time = time ? time : 500
        let promise = new Promise((resolve, reject) => {
            this.timeout = setTimeout(() => {
                resolve(search)
            }, 500);
        });
        return promise;
    } 
}