import { FormsModule } from '@angular/forms';
import { MbscModule } from '@mobiscroll/angular';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { AppComponent } from './app.component';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from "./app-routing.module";
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FetchToken,IsOtherDomain, AuthGuard } from './shared/services/auth-guard.service';
import { UserInfoService, GetToken, SecurityService } from './shared/services/security.service';
import { HttpInterceptorService } from './shared/services/http.interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderSpinnerModule } from './shared/loader-spinner/index';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { RouterModule, Router } from '@angular/router';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { QuizModule } from './quiz/quiz.module';
import { CustomDomainResolve } from './quiz/quiz-resolve';

export function HttpLoaderFactory(http: HttpClient) {
  // for development
  // return new TranslateHttpLoader(http, '/start-angular/SB-Admin-BS4-Angular-4/master/dist/assets/i18n/', '.json');
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    UnauthorizedComponent,
    NotFoundComponent
  ],
  imports: [ 
    FormsModule,  
    MbscModule.forRoot({ angularRouter: Router }), 
    QuizModule,
    BrowserModule,
    SharedModule,
    BrowserAnimationsModule,
   
    AppRoutingModule,
    LoaderSpinnerModule,
    HttpClientModule,
    SimpleNotificationsModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    FetchToken,
    IsOtherDomain,
    CustomDomainResolve,
    Title,
    UserInfoService,
    GetToken,
    AuthGuard,
    SecurityService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
