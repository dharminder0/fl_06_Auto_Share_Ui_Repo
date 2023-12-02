import { Component, OnInit } from "@angular/core";
import {
  UserInfoService,
  SecurityService
} from "../../shared/services/security.service";
import { Router } from "@angular/router";
import { Config } from "../../../config";
import { TranslateService } from "@ngx-translate/core";
declare var $: any;

@Component({
  selector: "app-header-app",
  templateUrl: "./header-app.component.html",
  styleUrls: ["./header-app.component.css"]
})
export class HeaderAppComponent implements OnInit {
  public logoutURL: string = "";
  public config = new Config();
  public companyCode;
  public isOpen: boolean = false;
  public style = {};
  public styleImg = {};
  public padBottom = {};
  public sizeHeight_AT = {};
  public newFontFamily_AT = {};
  userContainer_AT: {}
  //  = localStorage.getItem("companycode");
  constructor(
    private userInfoService: UserInfoService,
    private router: Router,
    private securityService: SecurityService,
    private translate: TranslateService
  ) {
    this.companyCode = this.getCookie("clientCode")
    this.logoutURL = `${this.config.logoutUrl}?companyCode=${this.companyCode}`;
  }

  public user;
  public header;
  public jQueryManager;
  ngOnInit() {

    this.user = new User(this.userInfoService.get());
    this.header = new HeaderMenu(this.userInfoService.get());
    this.jQueryManager = new JqueryManager();

    //Initialize Jquery Dropdown
    this.translate.use(this.header.ActiveLanguage);
    this.jQueryManager.dropdownInitializer();

    this.header.initializeMenu();
    if (this.companyCode == 'usg' || this.companyCode == 'USG') {
      return this.style = { 'max-width': '342px' }, this.styleImg = { 'width': '90%' }, this.padBottom = { 'padding-bottom': '12px', 'height': '88px' };
    } else if (this.companyCode.toLowerCase() === "hema") {
      return this.style = { 'max-width': '342px', 'display': 'inline-block' }, this.styleImg = { 'width': 'auto', 'height': 'auto' }, this.padBottom = { 'height': '91px' }
    } else if (this.companyCode.toLowerCase() === "at") {
      return this.padBottom = { 'height': '75px' }, this.sizeHeight_AT = { 'top': '1px', 'margin': '0 6px' }, this.newFontFamily_AT = { 'top': '3px' }, this.userContainer_AT = { 'top': '3px', 'margin-right': '10px' }
    } else {
      this.style = {};
      this.styleImg = {};
    }
  }

  changeLanguage(lang) {
    this.translate.use(lang);
    localStorage.setItem("language", lang);
    this.header.updateLanguage(lang);
  }
  // check for ipad and reset header properties 
  // done beacause  header dropdown is not closing completely in Ipad view (previous code issue) 
  checkForIpad() {
    var isiPad = navigator.userAgent.match(/iPad/i) != null;
    if (isiPad) {
      document.getElementsByClassName('setWidth')[0]['style'].backgroundColor = "#ffffff";
      document.getElementsByClassName('setWidth')[0]['style'].width = "0px"
    }
  }

  // toggle header  properties on button click 
  // check for ipad and reset header properties 
  // done beacause  header dropdown issue due to previous code 
  changeBackColor() {
    this.isOpen = !this.isOpen
    var isiPad = navigator.userAgent.match(/iPad/i) != null;

    if (isiPad && this.isOpen) {
      document.getElementsByClassName('setWidth')[0]['style'].backgroundColor = "#494949";
      document.getElementsByClassName('setWidth')[0]['style'].width = "230px"
    } else if (isiPad && !this.isOpen) {
      document.getElementsByClassName('setWidth')[0]['style'].backgroundColor = "#ffffff";
      document.getElementsByClassName('setWidth')[0]['style'].width = "0px"
    }
  }
  onLogout() {
    this.securityService.logout();
    this.router.navigate(["/"]);
  }

  ngAfterViewInit() {
    this.checkForIpad()
    this.jQueryManager.customMenuInitializer();
  }

  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  /**
   * Function call on when logout option clicked
   */
  logOutUser() {
    localStorage.clear();
    let baseURL = location.href.split("?");
    let companycode;
    baseURL.forEach(url => {
      if (url.match("companycode")) {
        companycode = url;
      }
    });

    if (companycode) {
      window.location.replace(
        `${this.logoutURL}&returnUrl=${baseURL[0]}?${companycode}`
      );
    } else {
      window.location.replace(`${this.logoutURL}&returnUrl=${baseURL[0]}`);
    }
  }
}

/**
 * * User Class
 */
class User {
  readonly DEFAULT_PROFILE_PIC = `../assets/layouts/img/JobRock - Default profile image.jpg`;
  private FirstName;
  private LastName;
  private Logo; //profile pic
  private LogoUrl; //logo url
  private NickName;

  constructor(userInfo) {
    for (let key in userInfo) {
      this[key] = userInfo[key];
    }

    if (!this.Logo) {
      this.Logo = this.DEFAULT_PROFILE_PIC;
    }
  }

  public getFullName(): String {
    return this.FirstName + " " + this.LastName;
  }
}

/**
 * * HeaderMenu Class
 *
 */
class HeaderMenu {
  private profileMenu = [];
  private headerMenu = [];
  private ActiveLanguage;
  private HeaderMenus = [];

  constructor(userInfo) {
    this.ActiveLanguage = userInfo.ActiveLanguage || "en-US";
    this.HeaderMenus = userInfo.HeaderMenusNew || [];
    this.initializeMenu();
  }

  public initializeMenu(): void {
    for (let i = 0; i < this.HeaderMenus.length; i++) {
      let foundActiveLanguageMenu: boolean =
        this.HeaderMenus[i].Culture == this.ActiveLanguage;
      if (foundActiveLanguageMenu) {
        let menu = this.HeaderMenus[i].Menus;
        this.profileMenu = menu.filter(item => item.placement == "header");
        this.headerMenu = menu.filter(item => item.placement == "menu");
      }
    }
  }

  public updateLanguage(lang: string): void {
    if (lang.length == 0) {
      throw new Error("Language is required");
    }
    this.ActiveLanguage = lang;
    this.initializeMenu();
  }
}

/**
 * * JQuery Initializer Class
 */
class JqueryManager {
  public customMenuInitializer(): void {
    $("ul.nav li.dropdown div.custom-menu").hover(
      function () {
        $(this)
          .find(".dropdown-menu")
          .stop(false, false)
          .delay(0)
          .fadeIn(0);
      },
      function () {
        $(this)
          .find(".dropdown-menu")
          .stop(false, false)
          .delay(0)
          .fadeOut(0);
      }
    );
  }

  public dropdownInitializer(): void {
    $("ul.nav li.dropdown").hover(
      function () {
        $(this)
          .find(".dropdown-menu")
          .stop(false, false)
          .delay(0)
          .fadeIn(0);
      },
      function () {
        $(this)
          .find(".dropdown-menu")
          .stop(false, false)
          .delay(0)
          .fadeOut(0);
      }
    );
  }
}
