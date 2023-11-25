import { Injectable, Inject, PLATFORM_ID, InjectionToken } from "@angular/core";
import 'rxjs';

import { Subject } from "rxjs";
import { Title, DomSanitizer } from "@angular/platform-browser";
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable()
export class SharedService {
    private readonly documentIsAccessible: boolean;
    public quizTypeId;

    public companyTitle: string = ""
    private loading = new Subject<any>();

    constructor(
            // The type `Document` may not be used here. Although a fix is on its way,
    // we will go with `any` for now to support Angular 2.4.x projects.
    // Issue: https://github.com/angular/angular/issues/12631
    // Fix: https://github.com/angular/angular/pull/14894
    @Inject( DOCUMENT ) private document: any,
    // Get the `PLATFORM_ID` so we can check if we're in a browser.
    @Inject( PLATFORM_ID ) private platformId: InjectionToken<Object>,
    private titleService: Title,
     private sanitizer : DomSanitizer) {
        this.documentIsAccessible = isPlatformBrowser( this.platformId );
    }

    setProjectTitle(companyName: string){
        // if(companyName){
        //     this.companyTitle = companyName
        //     this.titleService.setTitle(this.companyTitle + " " + this.titleService.getTitle());
        // }
        this.titleService.setTitle( "Automation | Jobrock");
    }

    getProjectTitle(){
        return this.companyTitle;
    }

    loader(data: any) {
        this.loading.next(data);
    }

    isloading() {
        return this.loading.asObservable();
    }


    public errorMessage = { status: '', message: '' };
    public errorMessage1 = {status:'', message: ''}
    setErrorMessage(msg) {
        this.errorMessage = msg;
    }

    getErrorMessage() {
        return this.errorMessage;
    }

      setErrorFromBackendMessage(msg) {
        this.errorMessage1 = msg;
    }
      getErrorFromBackendMessage1() {
        return this.errorMessage1;
    }

 /**
   * @param name Cookie name
   * @returns {any}
   */
  getCookie( name: string ): string {
    if ( this.documentIsAccessible && this.check( name ) ) {
      name = encodeURIComponent( name );

      const regExp: RegExp = this.getCookieRegExp( name );
      const result: RegExpExecArray = regExp.exec( this.document.cookie );

      return decodeURIComponent( result[ 1 ] );
    } else {
      return '';
    }
  }

  /**
   * @param name Cookie name
   * @returns {boolean}
   */
  check( name: string ): boolean {
    if ( !this.documentIsAccessible ) {
      return false;
    }

    name = encodeURIComponent( name );

    const regExp: RegExp = this.getCookieRegExp( name );
    const exists: boolean = regExp.test( this.document.cookie );

    return exists;
  }

 /**
   * @param name Cookie name
   * @returns {RegExp}
   */
  private getCookieRegExp( name: string ): RegExp {
    const escapedName: string = name.replace( /([\[\]\{\}\(\)\|\=\;\+\?\,\.\*\^\$])/ig, '\\$1' );

    return new RegExp( '(?:^' + escapedName + '|;\\s*' + escapedName + ')=(.*?)(?:;|$)', 'g' );
  }

  sanitizeData(data){
    if(data){
    var y = this.sanitizer.bypassSecurityTrustHtml(data)['changingThisBreaksApplicationSecurity'].toString();
    return this.stripHtml(y)  ;
    }
  }

  stripHtml(data){
    var tmp = document.createElement("DIV");
    tmp.innerHTML = data;
    return tmp.innerText  ;
  }
}


