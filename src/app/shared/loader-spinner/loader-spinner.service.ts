import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

/**
 * Injectable service
 * @export
 * @class LoaderService
 */
@Injectable()
export class LoaderService {

    /**
     * @description spinners BehaviorSubject
     * @type {BehaviorSubject<any>}
     * @memberof LoaderService
     */
    public spinnerSubject: BehaviorSubject<any> = new BehaviorSubject<any>(false);

    /**
     * Creates an instance of LoaderService.
     * @memberof LoaderService
     */
    constructor() {

    }

    /**
     * To show spinner
     * @memberof LoaderService
     */
    show() {
        this.spinnerSubject.next(true);
    }

    /**
     * To hide spinner
     * @memberof LoaderService
     */
    hide() {
        this.spinnerSubject.next(false);
    }

    getMessage(): Observable<any> {
        return this.spinnerSubject.asObservable();
    }
}
