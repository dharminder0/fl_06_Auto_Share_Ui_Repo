import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private translate: TranslateService,
    private titleService: Title,
    private router: Router) {
      translate.addLangs(['en-US', 'fr', 'ur', 'es', 'it', 'fa']);
      translate.setDefaultLang('en-US');
      const browserLang = translate.getBrowserLang();
      translate.use('en-US');
      localStorage.setItem('language', 'en-US');
  
      $('html').click(function (e) {
        // if (e.target.id == 'menu-options') {
        //   $('header').toggleClass('open')
        // }
        if(e.target.classList.contains('menu-toggler') || e.target.classList.contains('fa-line') || e.target.id == 'menu-options'){
          $('header').toggleClass('open');
          $('body').toggleClass('menu-toggler-body');
        }
      });
  }
  notificationsOptions = {
    animate: 'scale',
    clickToClose: true,
    timeOut: 2000,
    preventLastDuplicates: 'visible',
    pauseOnHover: true,
    showProgressBar: false,
    position: ['bottom', 'right'],
    closeButton: true
  };
}
