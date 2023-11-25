import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  ActivatedRoute
} from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  UserInfoService,
  SecurityService,
  GetToken
} from "../services/security.service";
import { Observable } from "rxjs";
import { Config } from "../../../config";
import { debounceTime } from "rxjs/operators";
import { SharedService } from "./shared.service";

@Injectable()
export class IsLoggedIn implements CanActivate {
  constructor(
    private router: Router,
    private userInfoService: UserInfoService,
    private route: ActivatedRoute
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.userInfoService.authToken.get()) {
      this.router.navigate(["settings"]);
      return false;
    }
    return true;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userInfoService: UserInfoService,
    private securityService: SecurityService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.securityService
      .requiredAuthorizedUser()
      .map(e => {
        if (e) {
          return true;
        }
      })
      .catch(() => {
        this.router.navigate(["/auth/login"]);
        return Observable.of(false);
      });
  }
}

@Injectable()
export class AllowTemplate implements CanActivate {
public CreateTemplate;
public CreateTemplateEnabled;
  constructor( private userInfoService : UserInfoService,
              private router : Router){}

  canActivate(route : ActivatedRouteSnapshot, state : RouterStateSnapshot)
  {
    this.CreateTemplate = this.userInfoService._info.CreateTemplate;
    this.CreateTemplateEnabled = this.userInfoService._info.CreateTemplateEnabled;
    if(this.CreateTemplate && this.CreateTemplateEnabled)
    {
      return true;
    }
    else{
      this.router.navigate(['404']);
    }
  }
}

@Injectable()
export class FetchToken implements CanActivate {
  public token;
  public companycode;
  public previousCompanyCode;
  public tempToken;
  private externalUserId: string = "";
  private logintype: string = "";
  private externalUrl: string = "";
  private isMultiBranding: string = "";
  private selectedBrand: string = "";
  // public companyDetails;
  public config = new Config();
  constructor(
    private router: Router,
    private userInfoService: UserInfoService,
    private getToken: GetToken,
    private route1: ActivatedRoute,
    private httpClient: HttpClient,
    private sharedService: SharedService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let skipValidation:boolean = false;
    if(route.queryParams.skipValidation === true || route.queryParams.skipValidation === "true"){
      return true;
    }
    let referrer:string = document.referrer ? document.referrer.toLowerCase() : "";
    let isRedirectedFromSF = referrer.includes("force.com") ? true : false;

    let urlQueryParamsObj = JSON.parse(JSON.stringify(route.queryParams));
    if(urlQueryParamsObj && Object.keys(urlQueryParamsObj).length > 0){
      let paramKeyToCompare: string = "";
      for (let key in urlQueryParamsObj) {
        paramKeyToCompare = key.replace(/amp;/g, "").toLowerCase();

        if (paramKeyToCompare === "externaluserid") {
          this.externalUserId = urlQueryParamsObj[key];
        }
        else if (paramKeyToCompare === "logintype") {
          this.logintype = urlQueryParamsObj[key];
        }
        else if (paramKeyToCompare === "url") {
          this.externalUrl = urlQueryParamsObj[key];
        }
        else if(paramKeyToCompare === "ismultibrand"){
          this.isMultiBranding = urlQueryParamsObj[key];
        }
        else if(paramKeyToCompare === "selectedbrand"){
          this.selectedBrand = urlQueryParamsObj[key];
        }
      }
      urlQueryParamsObj = JSON.parse(JSON.stringify(urlQueryParamsObj).replace(/&amp;/g, "&").replace(/amp;/g, ""));
    }

    this.tempToken = urlQueryParamsObj.token;
    this.companycode = urlQueryParamsObj.companycode || this.sharedService.getCookie("clientCode");
    this.token = this.sharedService.getCookie("token");

    if (this.token) {
      if(isRedirectedFromSF && !this.isMultiBranding && !this.logintype && !this.externalUserId && urlQueryParamsObj.companycode){
        let tempBaseURL = `${location.href}&logintype=SF`;
        window.location.replace(
          `${this.config.loginUrl}?companyCode=${urlQueryParamsObj.companycode}&logintype=SF&returnUrl=${encodeURIComponent(tempBaseURL)}`
        );
      }
      else if(this.isMultiBranding && (this.isMultiBranding == '1' || this.isMultiBranding.toLowerCase() == 'true')) {
        let cookieClienCode = this.sharedService.getCookie("clientCode");
        let returnToUrl:string = window.location.origin + window.location.pathname + encodeURIComponent(window.location.search.replace(/&amp;/g, "&").replace(/amp;/g, ""));

        if(this.selectedBrand){
          if(cookieClienCode && cookieClienCode.toLowerCase() === this.selectedBrand.toLowerCase()){
            return this.fetchToken(this.selectedBrand);
          }
          else{
            this.switchUserBrand(this.selectedBrand,returnToUrl);
            return false;
          }
        }
        else{
          let brandPageUrl:string = `${this.config.hubUrl}/brand?returnToUrl=${encodeURIComponent(returnToUrl)}&selectedBrand=${this.companycode}`;
          window.open(brandPageUrl,"_self");
          return false;
        }
      }
      else{
        return this.fetchToken();
      }
    } 
    else {
      let conpanyCodeToSend = this.companycode;
      if(this.isMultiBranding && (this.isMultiBranding == '1' || this.isMultiBranding.toLowerCase() == 'true') && this.selectedBrand){
        conpanyCodeToSend = this.selectedBrand;
      }

      if (conpanyCodeToSend) {
        return this.validateCompanyCode(conpanyCodeToSend);
      } 
      else {
        //this.router.navigate(['error']);
        var baseURL = location.href;
        window.location.replace(
          `${this.config.loginUrl}?returnUrl=${encodeURIComponent(baseURL)}`
        );
      }
    }
  }

  validateCompanyCode(companycode:string) {
    var baseURL = location.href.split("?");
    let encodedUrl = baseURL[0];

    if(baseURL.length > 1){
      baseURL[1].split("&").map((item:string, index:number) => {
        if(item.toLowerCase().indexOf("companycode") >= 0){
          item = `companycode=${companycode}`;
        }

        if(index === 0){
          encodedUrl = `${encodedUrl}?${item}`;
        }
        else{
          encodedUrl = `${encodedUrl}&${item}`;
        }
      });
    }
    encodedUrl = encodeURIComponent(encodedUrl);
    
    let completeLoginUrl:string = `${this.config.loginUrl}?companyCode=${companycode}`;
    if(this.externalUserId){
      completeLoginUrl += `&userId=${this.externalUserId}`;
    }
    if(this.logintype){
      completeLoginUrl += `&loginType=${this.logintype}`;
    }
    completeLoginUrl = `${completeLoginUrl}&returnUrl=${encodedUrl}`;

    window.location.replace(completeLoginUrl);
           return false;
  }

  fetchToken(clientcode?:string) {
    let companycode = clientcode ? clientcode : this.companycode;

    return this.getToken
      .fetchUserToken(this.token, companycode, this.previousCompanyCode)
      .map(e => {
        if (e) {
          return true;
        }
      })
      .catch(() => {
        var baseURL = location.href.split("?");
        var companycode;
        localStorage.clear();
        baseURL.forEach(url => {
          if (url.match("companycode")) {
            companycode = url;
          }
        });
        if (companycode) {
          window.location.replace(
            `${this.config.loginUrl}?companyCode=${this.companycode}&returnUrl=${encodeURIComponent(baseURL[0])}?${companycode}`
          );
        } else {
          window.location.replace(
            `${this.config.loginUrl}?companyCode=${this.companycode}&returnUrl=${encodeURIComponent(baseURL[0])}`
          );
        }
        return Observable.of(false);
      });
  }

  switchUserBrand(selectBrand:string, currUrl:string){
    let currUrlSplitList:Array<string> = decodeURIComponent(currUrl).split("?");
    let returnUrl:string = currUrlSplitList[0];

    if(currUrlSplitList.length > 1){
      let temp:Array<string> = currUrlSplitList[1].split("&");

      temp.map((item:string,index:number) => {
        if(item.toLowerCase().indexOf("selectedbrand=") >= 0){
          item = `selectedbrand=${selectBrand}`;
        }
        else if(item.toLowerCase().indexOf("companycode=") >= 0){
          item = `companycode=${selectBrand}`;
        }

        if(index === 0){
          returnUrl = `${returnUrl}?${item}`;
        }
        else{
          returnUrl = `${returnUrl}&${item}`;
        }
      });
    }

    let url = `${this.config.loginUrl}account/switch?companyCode=${selectBrand}&returnUrl=${encodeURIComponent(returnUrl)}`;
    window.location.href = url;
  }
}

@Injectable()
export class IsOtherDomain implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let hostName = window.location.host;
    let domainName = require("../../../config.json");
    if (hostName != domainName.WebUrl) {
      if(!(route && route.params && route.params.id && (route.params.id == "error" || route.params.id == "404"))){
        return true;
      }
    }
  }
}

class EncryptDecrypt {
  static key = "OLY!@#$%^&*";
  static encrypt(string) {
    return window.btoa(string + this.key);
  }

  static decrypt(string) {
    return window
      .atob(string)
      .substring(0, window.atob(string).indexOf(this.key));
  }
}
