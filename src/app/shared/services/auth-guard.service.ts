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
    this.tempToken = route.queryParams.token;
    this.companycode = route.queryParams.companycode || this.sharedService.getCookie("clientCode");
    this.token = this.sharedService.getCookie("token");
    if(this.token){
      return this.fetchToken();
    }else{
      if(this.companycode){
        // localStorage.setItem("companycode", this.companycode);
        return this.validateCompanyCode(this.companycode);
      } else {
        this.router.navigate(['404']);
      }
    }
  }

  validateCompanyCode(companycode) {
    return this.getToken
      .fetchCompanyDetails(companycode)
      .map(companyDetails => {
        // localStorage.setItem('companycode', companyDetails.CompanyCode)
        // this.companyDetails = companyDetails;
        var baseURL = location.href.split("?");
        baseURL.forEach(url => {
          if (url.match("companycode")) {
            companycode = url;
          }
        });
        if (companycode) {
          window.location.replace(
            `${this.config.loginUrl}?companyCode=${this.companycode}&returnUrl=${
              baseURL[0]
            }?${companycode}`
          );
        } else {
          window.location.replace(
            `${this.config.loginUrl}?companyCode=${this.companycode}&returnUrl=${
              baseURL[0]
            }`
          );
        }
        return false;
      }).catch(() => {
        this.router.navigate(['404']);
        localStorage.clear();
        return Observable.of(false);
      });
  }

  fetchToken() {
    return this.getToken
      .fetchUserToken(this.token, this.companycode, this.previousCompanyCode)
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
            `${this.config.loginUrl}?companyCode=${this.companycode}&returnUrl=${
              baseURL[0]
            }?${companycode}`
          );
        } else {
          window.location.replace(
            `${this.config.loginUrl}?companyCode=${this.companycode}&returnUrl=${
              baseURL[0]
            }`
          );
        }
        return Observable.of(false);
      });
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
