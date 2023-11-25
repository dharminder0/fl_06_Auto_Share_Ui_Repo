/**
 * !Depricated : Use Header-App instead for header
 */
import { Component, OnInit } from '@angular/core';
import { UserInfoService, SecurityService } from '../../shared/services/security.service';
import { Router } from '@angular/router';
import { QuizBuilderApiService } from '../quiz-builder-api.service';
import { TranslateService } from '@ngx-translate/core';
declare var $:any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public userInfo;
  public firstName: string = "";
  public lastName: string = "";
  public nickName: string = "";
  public headerMenu;
  public profilepic;
  public currentLang = 'nl-NL';
  public language;
  public open:boolean = false;
  public logoURL: string = "";

  languages = [{
    name: 'English',
    value: 'en-US'
  }, {
    name: 'Nederlands',
    value: 'nl-NL'
  }]

  constructor(private userInfoService: UserInfoService,
    private translate : TranslateService,
    private router: Router,
    private securityService: SecurityService,
    private quizBuilderApiService:QuizBuilderApiService) { }

  ngOnInit() {
    if(this.language == 'en-US' || this.language == 'nl-NL'){
      this.onlangChange(this.language);
      this.currentLang = this.language
    }else{
      this.onlangChange('nl-NL')
      this.currentLang = 'nl-NL'
    }
    this.userInfo = this.userInfoService.get();
    this.profilepic = this.userInfo.Logo;
    this.logoURL = this.userInfo.LogoUrl;
    this.setHeaderMenu(this.userInfo.ActiveLanguage);
    this.firstName = this.userInfo.FirstName;
    this.lastName = this.userInfo.LastName;
    if(this.userInfo.NickName) {
      this.nickName = this.userInfo.NickName;
    }
    $('ul.nav li.dropdown').hover(function () {
      $(this).find('.dropdown-menu').stop(false, false).delay(0).fadeIn(0);
    }, function () {
      $(this).find('.dropdown-menu').stop(false, false).delay(0).fadeOut(0);
    });


    // $('.pull-right > li').hover(function () {
    //   $('.check').addClass('hover-icon');
    // }, function () {
    //   $('.check').removeClass('hover-icon');
    // });
  }

  onlangChange(ln) {
    this.translate.use(ln);
    localStorage.setItem('language', ln);
    // this.slotsService.setLanguage(ln)
  }

  setHeaderMenu(activeLanguage: string) {
    this.onlangChange(activeLanguage);
    this.language = activeLanguage;
    localStorage.setItem("language",activeLanguage)
    // this.quizBuilderApiService.setLanguage(this.language)
    // this.translate.use(activeLanguage);
    var newHeaderMenu = {};

    this.userInfo.HeaderMenus.forEach(element => {
      if (activeLanguage == element.Culture) {
        element.Menus.forEach(item => {
          if (newHeaderMenu.hasOwnProperty(item.Level)) {
            newHeaderMenu[item.Level].push(item);
          } else {
            newHeaderMenu[item.Level] = [];
            newHeaderMenu[item.Level].push(item);
          }
        });
      }
    });
    this.headerMenu = newHeaderMenu;
    if(this.headerMenu[2]){
      this.headerMenu[2].splice(this.headerMenu[2].length - 1, 0, {
        Level: 2,
        MenuText: "Appointments",
        MenueUrl: "/appointment"
      });
    }
    
  }

  onLogout() {
    this.securityService.logout();
    this.router.navigate(['/']);
  }

  ngAfterViewInit() {
    $('ul.nav li.dropdown div.custom-menu').hover(function () {
      $(this).find('.dropdown-menu').stop(false, false).delay(0).fadeIn(0);
    }, function () {
      $(this).find('.dropdown-menu').stop(false, false).delay(0).fadeOut(0);
    });
  }
}

