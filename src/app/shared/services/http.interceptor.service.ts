import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { Config } from '../../../config';
import { LoaderService } from '../loader-spinner';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  public config = new Config();
  public companyDetails;
  public companycode
  // = localStorage.getItem('companycode');

  constructor(private loaderService: LoaderService) {
    this.companycode = this.getCookie('clientCode');
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var urlRegEx = new RegExp('i18n', 'ig');
    var appointmentURLRegEx = new RegExp('appointment', 'ig')
    var getAttemptCodeRegExp = new RegExp('GetQuizAttemptCode', 'ig');
    var attemptQuizRegExp = new RegExp('AttemptQuiz', 'ig');
    var urlValueByKeyRegExp = new RegExp('GetUrlValueByKey', 'ig');
    var ssoURLRegEx = new RegExp('owc-dev.jobrocket', 'ig');
    var saveLeadUserInfoRegExp = new RegExp('SaveLeadUserInfo', 'ig');
    if (request.headers['lazyUpdate'] && request.headers['lazyUpdate'][1].name == "Authorization") {
    } else if (request.url.match(urlRegEx)) {
      request = request.clone({
        url: request.url
      });
    } else if (request.url.match(appointmentURLRegEx)) {
      this.loaderService.show();
      let token = this.getCookie('token');
      request = request.clone({
        url: this.config.appointmentApiUrl + request.url,
        setHeaders: {
          'JwtToken': token,
          'Content-Type': 'application/json',
          'ApiSecret': this.config.AppointmentApiSecret,
          'CompanyCode': this.companycode
        }
      });
    }
    else if (request.url.match(getAttemptCodeRegExp) || request.url.match(attemptQuizRegExp) || request.url.match(saveLeadUserInfoRegExp) || request.url.match(urlValueByKeyRegExp)) {
      this.loaderService.show();
      request = request.clone({
        // url: this.config.apiUrl + request.url,
        url: this.config.automationApiUrl + request.url,
        setHeaders: {
          'Content-Type': 'application/json',
          'ApiSecret': this.config.ApiSecret,
        }
      });
    }
    else {
      let apiUrl;
      this.loaderService.show();
      let token = this.getCookie('token');
      // if(request.url.match('v3')){
      //   let v3Url = this.config.apiUrl.replace('v1/', "");
      //   apiUrl = v3Url + request.url
      // }else{
      //   apiUrl = this.config.apiUrl + request.url
      // }
      apiUrl = this.config.automationApiUrl + request.url
      request = request.clone({
        url: apiUrl,
        setHeaders: {
          'JwtToken': token,
          'Content-Type': 'application/json',
          'ApiSecret': this.config.ApiSecret,
          'CompanyCode': this.companycode
        }
      });
    }

    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        this.loaderService.hide();
      }
    }, (err: any) => {
      if (err.status == 500 || err.status == 501 || err.status == 404 || err.status == 400 || err.status == 0 || (sessionStorage.getItem('isPublicPage') && sessionStorage.getItem('isPublicPage') === "true")) { }
      else {
        var baseURL = location.href.split('?');
        var companycode;
        baseURL.forEach((url) => {
          if (url.match("companycode")) {
            companycode = url;
          }
        });
        // if (companycode) {
        //   debugger;
        //   window.location.replace(
        //     `${this.config.loginUrl}?companyCode=${this.companycode}&returnUrl=${baseURL[0]
        //     }?${companycode}`
        //   );
        // } else {
        //   debugger;
        //   window.location.replace(
        //     `${this.config.loginUrl}?companyCode=${this.companycode}&returnUrl=${baseURL[0]
        //     }`
        //   );
        // }
      }
      this.loaderService.hide();
    });
  }


  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
}
