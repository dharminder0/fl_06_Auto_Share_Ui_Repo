import { Component, OnInit, Renderer2, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { QuizApiService } from '../quiz-api.service';
import { SharedService } from '../../shared/services/shared.service';
import { Location, DOCUMENT } from "@angular/common";
import { QuizDataService } from '../quiz-data.service';
import { LoaderService } from '../../shared/loader-spinner';
import { CssVarsService } from '../../shared/services/cssVarsService.service';
import { UserInfoService } from '../../shared/services/security.service';
import { Config } from "../../../config";
import { Meta, Title } from '@angular/platform-browser';
import { ShareConfigService } from '../../shared/services/shareConfig.service';

@Component({
  selector: 'app-publish-code-redirect',
  templateUrl: './publish-code-redirect.component.html',
  styleUrls: ['./publish-code-redirect.component.css']
})
export class PublishCodeRedirectComponent implements OnInit {

  public hostURL;
  public bodyTemplate;
  public configurationId;
  private config = new Config();

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private quizApiService: QuizApiService,
    private location: Location,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private quizDataService: QuizDataService,
    private loaderService: LoaderService,
    private cssVarsService: CssVarsService,
    private shareConfigService: ShareConfigService,
    private meta: Meta,
    private titleService: Title,
    private userInfoService: UserInfoService){
      // cssVarsService.setVariables({
      //   '--primary-color': this.quizDataService.getCompanyColor().primaryColor,
      //   '--secondary-color': this.quizDataService.getCompanyColor().secondaryColor
      //   //   "--primary-color": "#00b7ab",
      //   // "--secondary-color": "#00b7ab"
      // });
    }

  ngOnInit() {
    let customDomainData = this.activatedRoute.snapshot.data["customDomainData"];
    let paramsObj:any = {};
    if(customDomainData && customDomainData !== ""){
      // let urlToOpen:string = window.location.origin + customDomainData.replace(/^(https?|ftp):\/\//g,"").replace(this.config.WebUrl,"");

      
      // this.activatedRoute.queryParams.subscribe(params => {
      //   paramsObj = JSON.parse(JSON.stringify(params));
      // });
      // if(paramsObj && Object.keys(paramsObj).length > 0){
      //   if(urlToOpen.indexOf("?") < 0){
      //     urlToOpen += "?";
      //   }
      //   else{
      //     urlToOpen += "&";
      //   }

      //   for (let key in paramsObj) {
      //     urlToOpen += key + "=" + paramsObj[key] + "&";
      //   }
      //   urlToOpen = urlToOpen.replace(/&$/g,"");
      // }
      // window.open(urlToOpen,"_self");

                // this.quizApiService.addMetaTag('Description', "htTest description", true);
                // this.quizApiService.addMetaTag('PageTitle', "Ht test", true);
                // this.meta.addTag({ property: 'og:description', content: "htTest description" });
                // this.meta.addTag({ property: 'og:title', content: "Ht og test" });
                // this.meta.addTag({property : "og:type" ,content:"website" });
                // this.meta.addTag({ name: 'twitter:card', content: "summary_large_image" });
                // this.meta.addTag({ name: 'twitter:title',property: 'twitter:title', content: "Ht twitter test" });
                // this.meta.addTag({ name: 'title', content: "Ht title test" });

      let queryParamsToAdd:any = {};
      let urlToNavigate:string = customDomainData.split("?")[0].replace(/^(https?|ftp):\/\//g,"").replace(this.config.WebUrl,"");
      let newQueryParam:Array<any> = [];

      this.activatedRoute.queryParams.subscribe(params => {
        queryParamsToAdd = JSON.parse(JSON.stringify(params));
      });

      if(customDomainData.split("?")[1]){
        let paramsToAdd:string = decodeURIComponent(customDomainData.split("?")[1]);
        // this.titleService.setTitle( customDomainData.split("?")[1] );
        paramsToAdd.split("&").map((item:string)=> {
          queryParamsToAdd[item.split("=")[0]] = item.split("=")[1];
        });
      }

      console.log("htTest");
      this.router.navigate([urlToNavigate], {queryParams: queryParamsToAdd})

      return false;
    }

    this.configurationId = window.location.search.split('ConfigurationId=')[1];
    this.hostURL = this.location['_platformStrategy']['_platformLocation']['location'].href
    this.quizDataService.setSharedQuizURL(this.hostURL);

    let publishCode = this.activatedRoute.snapshot.queryParams["Code"]
    let UserTypeId = this.activatedRoute.snapshot.queryParams["UserTypeId"]
    let UserId = this.activatedRoute.snapshot.queryParams["UserId"]
    let WorkPackageInfoId = this.activatedRoute.snapshot.queryParams["WorkPackageInfoId"]
    let configurationId;
    let queryParamsObj:any = {};
    queryParamsObj["QuizCode"] = "";

    if(this.activatedRoute.snapshot.queryParams["ConfigurationId"]){
      configurationId = this.activatedRoute.snapshot.queryParams["ConfigurationId"];
      this.quizApiService.isQuizConfigurationIdsSubmission = this.activatedRoute.snapshot.queryParams["ConfigurationId"];
    }

    // Query params for UTM should always be at last for GTM script to work.
    // When adding any new query params, they should be added before them in the list
    let possibleParamsList = ["ResultIds","Vacature","Campaign","Social_Campaign","Event","Partnerships","Open_Application","utm_id","utm_source","utm_medium","utm_content","utm_campaign","utm_term","utm_channel"];
    
    possibleParamsList.map((item:string) => {
      if(this.activatedRoute.snapshot.queryParams[item]){
        queryParamsObj[item] = this.activatedRoute.snapshot.queryParams[item];
        if(!customDomainData && (item === "utm_id" || item === "utm_source" || item === "utm_medium" || item === "utm_content" || item === "utm_campaign" || item === "utm_term" || item === "utm_channel")){
          //sessionStorage.setItem(item, queryParamsObj[item]);
          this.shareConfigService.setCookie(item, queryParamsObj[item]);
        }
      }
    });
    
    publishCode = typeof (publishCode) == 'string' && publishCode.length > 0 ? publishCode : false;
    UserTypeId = typeof (UserTypeId) == 'string' && UserTypeId.length > 0 ? UserTypeId : false;
    UserId = typeof (UserId) == 'string' && UserId.length > 0 ? UserId : false;
    WorkPackageInfoId = typeof (WorkPackageInfoId) == 'string' && WorkPackageInfoId.length > 0 ? WorkPackageInfoId : false;
    if(UserTypeId){
      this.quizDataService.setUserTypeId(UserTypeId);
    }
    // publishCode = 'c386ff46-e858-4a4f-abfe-e043492b4b98';
    if (publishCode) {
      this.loaderService.show();
      this.quizApiService.getQuizAttemptCode(publishCode, 'AUDIT', UserTypeId, UserId, WorkPackageInfoId,configurationId)
      // this.quizApiService.getQuizAtte  mptCode(publishCode, 'PREVIEW')
        .subscribe((data) => {
          this.loaderService.hide();
          
          queryParamsObj["QuizCode"] = data;
          this.router.navigate(["attempt-quiz"], { queryParams: queryParamsObj, relativeTo: this.activatedRoute });
        }, error => {
          this.loaderService.hide();
          this.sharedService.errorMessage.message = error ? error : 'Something went wrong'
          this.router.navigate(["/error"]);
        })
    } 
    else if(configurationId){
      this.loaderService.show();
      this.quizApiService.getQuizAttemptCodeForConfigurationId(configurationId, 'AUDIT')
        .subscribe((data) => {
          this.loaderService.hide();
            queryParamsObj["QuizCode"] = data;
            this.router.navigate(["attempt-quiz"], { queryParams: queryParamsObj, relativeTo: this.activatedRoute });
        }, error => {
          this.loaderService.hide();
          this.sharedService.errorMessage.message = error ? error : 'Something went wrong'
          this.router.navigate(["/error"]);
        })
    }
    // else {
    //   this.sharedService.errorMessage.message = 'Please provide a publish code!'
    //   this.router.navigate(["/error"])
    // }
    // this.changeBodyStyle()
  }
  

  changeBodyStyle() {
    this.bodyTemplate = this.document.body;
    this.renderer.setStyle(this.bodyTemplate, "overflow", "hidden");
  }

}

@Component({
  selector: 'app-publish-code-redirect',
  templateUrl: './publish-code-redirect.component.html',
})

export class PreviewComonent implements OnInit, OnDestroy{

  public bodyTemplate;

  constructor(@Inject(DOCUMENT) private document: Document,
  private renderer: Renderer2){}

  ngOnInit(){
    this.changeBodyStyle()
  }


  changeBodyStyle() {
    this.bodyTemplate = this.document.body;
    this.renderer.setStyle(this.bodyTemplate, "overflow-y", "visible");
  }

  ngOnDestroy(){
    this.renderer.setStyle(this.bodyTemplate, "overflow", "unset");
  }
}

