import { Injectable } from "@angular/core";
import "rxjs";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { Config } from "../../../config";
import { HttpClient } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { SharedService } from "./shared.service";
import { of } from "rxjs/observable/of";
import { GenericClass } from "../extClasses/genericMethod";

let config = new Config();

@Injectable()
export class UserInfoService {
  _info: any = null;
  userPermissions:any = {};

  get() {
    return this._info || {};
  }
  set(info) {
    this._info = info;
    this.setUserPermissions();
  }
  reset() {
    this._info = null;
    this.authToken.clear();
  }

  setUserPermissions(){
    if(this._info.Permissions && this._info.Permissions.length > 0){
      let currPermission:string = "";
      let userAllowedPermissionsList:string = this._info.Permissions.join().toLowerCase().split(",");
      
      for(let key in GenericClass.permissionObj){
        currPermission = GenericClass.permissionObj[key].toLowerCase();
        this.userPermissions[key] = false;

        if(userAllowedPermissionsList.includes(currPermission)){
          this.userPermissions[key] = true;
        }
      }
    }
  }

  authToken = {
    _token: null,
    set: function(token: string) {
      this._token = localStorage.setItem("id_token", token);
    },
    get: function() {
      if (localStorage.getItem("id_token") && !this._token) {
        this._token = localStorage.getItem("id_token");
      }
      return localStorage.getItem("id_token");
    },
    clear: function() {
      localStorage.removeItem("id_token");
      this._token = null;
    },
    isSet: function() {
      return this.get() ? true : false;
    }
  };
}

@Injectable()
export class SecurityService {
  constructor(
    private userInfoService: UserInfoService,
    private router: Router,
    private HTTP: HttpClient,
    private translate: TranslateService
  ) {}
  _fetched: boolean = false;
  requiredAuthorizedUser(): Observable<boolean> {
    if (!this._fetched) {
      return this.HTTP.get("Account/Me").map(response => {
        this.userInfoService.set(response["data"]);
        this._fetched = true;
        return true;
      });
    } else {
      return Observable.of(true);
    }
  }

  logout() {
    this.userInfoService.authToken.clear();
    localStorage.clear();
    this._fetched = false;
  }
}

@Injectable()
export class GetToken {
  public redirectURL;
  public officeListArray = [];
  public config = new Config();
  constructor(
    private HTTP: HttpClient,
    private userInfoService: UserInfoService,
    private router: Router,
    private sharedService: SharedService
  ) {}
  fetchUserToken(token, companycode, previousCompanyCode): Observable<boolean> {
    return this.HTTP.get(
     
        "v1/Account/ValidateJwtToken?Module=automatisering&JwtToken=" +
        token +
        "&CompanyCode=" +
        companycode
    )
      .map(response => {
        var officeIdArray = [];
        if(response["data"].officesParentChildList.length >= 1){
          response["data"].officesParentChildList.forEach(office => {
            this.officeListArray.push({
                id: office.id.toString(),
                name: office.name,
                type : 'Parent'
            })
            if(office.children && office.children.length > 0){
              office.children.forEach(child => {
                this.officeListArray.push({
                  id :  child.id.toString(),
                  name :  child.name,
                  type  :  'Child'
                }) 
              })
          }
          })
          this.officeListArray.forEach(office => {
            officeIdArray.push(office.id) 
          });
        }
        this.sharedService.setProjectTitle(response["data"].CompanyName);
        this.userInfoService.set(response["data"]);
        // localStorage.setItem("id_token", token);
        if(!previousCompanyCode || previousCompanyCode != companycode){
          if(companycode){
            // localStorage.setItem("companycode", companycode);
          }
          if(this.officeListArray.length >= 1){
            localStorage.setItem("officeId", this.officeListArray[0].id);
          } else {
            localStorage.setItem("officeId", '');
           }
          if(officeIdArray.length >= 1){
            localStorage.setItem("officeIds", officeIdArray.toString());
          } else {
            localStorage.setItem("officeIds", '');
          }
        }
        localStorage.setItem("primaryColor", response["data"].PrimaryBrandingColor);
        localStorage.setItem("secondaryColor", response["data"].SecondaryBrandingColor);
        return response['data'];
      })
      .catch(err => {
        let data = err.error;
        if(err.status == 501 && data.message == 'Not allowed')
        {
          data.message = 'this is not a dead end. Looks like you tried to open a page which is not shared with you by company admin.'
          data['message1']='Please get the required access from company admin and try again.'
          this.sharedService.setErrorMessage(data);
          this.router.navigate(['error']);
          return of(false);
        }
        // this.redirectURL = err.json().data;
        return Observable.throw(data.message);
      });

  }


  /**
   * Get company details like (companyCode, JobRocketApiUrl, JobRocketApiAuthorizationBearer, JobRocketClientUrl)
   */
  fetchCompanyDetails(companycode){
    return this.HTTP.get("v1/Account/ValidateCompanyToken?CompanyCode=" + companycode)
  }
   
}