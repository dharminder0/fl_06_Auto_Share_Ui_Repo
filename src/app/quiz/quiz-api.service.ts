import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders } from "@angular/common/http";
// import { HttpResponse, HttpParams, HttpRequest } from '@angular/common/http';
import 'rxjs';

import { Config } from "../../config";
import { SharedService } from '../shared/services/shared.service';
import { Router } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { Meta, Title } from "@angular/platform-browser";
import { RemoveallTagPipe } from "../shared/pipes/search.pipe";
import { TranslateService } from "@ngx-translate/core";
import { languageEnum } from "../shared/Enum/languageEnum";
import { QuizDataService } from "./quiz-data.service";
// import { Subject, BehaviorSubject } from "rxjs";
// import { HttpInterceptorService } from "../shared/services/http.interceptor.service";

var config = new Config();
const filterPipe = new RemoveallTagPipe();

@Injectable()
export class QuizApiService {
    public options: any;

    constructor(private http: HttpClient,
        private sharedService: SharedService,
        private router : Router,
        private titleService: Title,
        private translate: TranslateService,
        private quizDataService: QuizDataService,
        private meta: Meta) {
        // const headers = new HttpHeaders();
        // headers.append('Content-Type', 'application/json');
        // headers.append('ApiSecret', config.ApiSecret)
        // this.options = new RequestOptions({ headers: headers });

        this.options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'ApiSecret': config.ApiSecret
            })
        };
    }

    public isQuizResultIdsSubmission: string = '';
    public isPrivacyLink: string = '';
    public isLeadFormTitle: string = '';
    public privacyJson: any = {};
    public isPrivacyLinkSubmissionObservable = new BehaviorSubject(this.isPrivacyLink);
    public sourceId: string = '';
    public sourceType: string = '';

    public isQuizConfigurationIdsSubmission: string = '';
    private hasAddedGtmCode:boolean = false;
    public isFormId: string = '';
    public isFormIdSubmissionObservable = new BehaviorSubject(this.isFormId);
    public attemptQuizSetting: any = {};

    changeIsPrivacyLinkSubmission() {
        this.isPrivacyLinkSubmissionObservable.next(this.isPrivacyLink);
    }
    addMetaTag(contentName, contentData, isAdded) {
        if (isAdded) {
            var metaTag = document.createElement("meta");
            metaTag.name = contentName || '';
            metaTag.content = contentData || '';
            document.getElementsByTagName('head')[0].appendChild(metaTag);
        }
      }
    setAppFavicon(faviconUrl){
        // accessing favicon link tag
        let favIcon: HTMLLinkElement = document.querySelector('#appFavicon');

        let findUpdateIndex = faviconUrl.indexOf( "upload/");
        let findVersionIndex = faviconUrl.indexOf( "/v");
        if(findUpdateIndex != -1 && findVersionIndex != -1){
            let subArrfavUpload = faviconUrl.substring(0,(findUpdateIndex+7));
            let subArrfavVersion = faviconUrl.substring(findVersionIndex);
            faviconUrl = subArrfavUpload + "c_scale,w_32" + subArrfavVersion;
        }

        if(favIcon){
            favIcon.href = faviconUrl;
        }
    }
    /**
   * Function to get available appointments slots
   */
    getQuizAttemptQuiz(QuizCode, mode?, Type?, QuestionId?, AnswerId?, UserTypeId?, QuestionType?, obj?): Observable<any> {
        var body;
        if (typeof obj == 'undefined') {
            body = [];
        } else {
            body = obj;
        }

        var queryParam = `QuizCode=${QuizCode}`
        if (mode) {
            queryParam += `&Mode=PREVIEW`
        } else {
            queryParam += `&Mode=AUDIT`
        }

        if (Type) {
            queryParam += `&Type=${Type}`
        }
        if (QuestionId) {
            queryParam += `&QuestionId=${QuestionId}`
        }
        if (AnswerId) {
            queryParam += `&AnswerId=${AnswerId}`
        }
        if (UserTypeId) {
            queryParam += `&UserTypeId=${UserTypeId}`
        }
        if (QuestionType) {
            queryParam += `&QuestionType=${QuestionType}`
        }
        if (this.isQuizResultIdsSubmission){
            queryParam += `&ResultIds=${this.isQuizResultIdsSubmission}`
        }

        if(this.isQuizConfigurationIdsSubmission){
            queryParam += `&ConfigurationId=${this.isQuizConfigurationIdsSubmission}`
        }

        return this.http.post('v1/Quiz/AttemptQuiz?' + queryParam, body, this.options).map((response:any) => {
            return response["data"];
        })
            .catch(err => {

                let data = err.error;
                if (data.message == `Quiz not found for the QuizCode ${ QuizCode}`) {

                    data.message = ' this is not a dead end. Looks like you tried to open incorrect page URL.'
                    data['message1'] = 'Please get the correct one and try again.'
                    this.sharedService.setErrorMessage(data);
                      this.router.navigate(['error']);
                      return of(false);
                }
                else if (data.message == `Quiz has already been completed.`) {
                    this.sharedService.setErrorMessage(data);
                    this.router.navigate(['complete-quiz']);
                    return of(false);
                }
                else{
                    this.sharedService.setErrorFromBackendMessage(data);
                      this.router.navigate(['error']);
                      return of(false);
                }
            })
    }


    /**
     *
     * @param PublishedCode : Code against a quizId used to generate quizCode
     * @param Mode : AUDIT / PREVIEW
     */
    getQuizAttemptCode(PublishedCode, Mode, UserTypeId?, UserId?, WorkPackageInfoId?,ConfigurationId?): Observable<any> {
        if (UserTypeId === "2") {
            var queryParam = `PublishedCode=${PublishedCode}&Mode=${Mode}`;
            if(UserTypeId){
                queryParam += `&UserTypeId=${UserTypeId}`;
            }
            if(UserId){
                queryParam += `&UserId=${UserId}`;
            }
            if(WorkPackageInfoId){
                queryParam += `&WorkPackageInfoId=${WorkPackageInfoId}`;
            }
            if(ConfigurationId){
                queryParam += `&ConfigurationId=${ConfigurationId}`;
            }

            return this.http.get('v1/Quiz/GetQuizAttemptCode?' + queryParam, this.options).map(response => {
                return response["data"];
            }) .catch(err=>{

                let data = err.error
                if(err.status == 501 && data.message == "Quiz not Permitted to Public ")
                {

                  data.message = 'this is not a dead end. Looks like you tried to open incorrect page URL.'
                  data['message1']=' Please get the correct one and try again.'
                  this.sharedService.setErrorMessage(data);
                  this.router.navigate(['error']);
                  return of(false);
                }
                else if (data.message == `Quiz not found for the Code ${ PublishedCode}`) {

                    data.message = ' this is not a dead end. Looks like you tried to open incorrect page URL.'
                    data['message1'] = 'Please get the correct one and try again.'
                    this.sharedService.setErrorMessage(data);
                      this.router.navigate(['error']);
                      return of(false);
                }
                else{
                    this.sharedService.setErrorFromBackendMessage(data);
                      this.router.navigate(['error']);
                      return of(false);
                }

              });
        } else {
            var queryParam = `PublishedCode=${PublishedCode}&Mode=${Mode}&ConfigurationId=${ConfigurationId}`;
            return this.http.get('v1/Quiz/GetQuizAttemptCode?' + queryParam, this.options).map(response => {
                return response["data"];
            })
            .catch(err=>{

                let data = err.error
                if(err.status == 501 && data.message == "Quiz not Permitted to Public ")
                {

                  data.message = 'this is not a dead end. Looks like you tried to open incorrect page URL.'
                  data['message1']=' Please get the correct one and try again.'
                  this.sharedService.setErrorMessage(data);
                  this.router.navigate(['error']);
                  return of(false);
                }
                else if (data.message == `Quiz not found for the Code ${ PublishedCode}`) {

                    data.message = ' this is not a dead end. Looks like you tried to open incorrect page URL.'
                    data['message1'] = 'Please get the correct one and try again.'
                    this.sharedService.setErrorMessage(data);
                      this.router.navigate(['error']);
                      return of(false);
                }
                else{
                    this.sharedService.setErrorFromBackendMessage(data);
                      this.router.navigate(['error']);
                      return of(false);
                }

              });

        }
    }


    getQuizAttemptCodeForConfigurationId(ConfigurationId, Mode): Observable<any> {
            var queryParam = `ConfigurationId=${ConfigurationId}&Mode=${Mode}`;
            return this.http.get('v1/Quiz/GetQuizAttemptCode?' + queryParam, this.options).map(response => {
                return response["data"];
            }) .catch(err=>{

                let data = err.error
                if(err.status == 501 && data.message == "Quiz not Permitted to Public ")
                {

                  data.message = 'this is not a dead end. Looks like you tried to open incorrect page URL.'
                  data['message1']=' Please get the correct one and try again.'
                  this.sharedService.setErrorMessage(data);
                  this.router.navigate(['error']);
                  return of(false);
                }
                else{
                    this.sharedService.setErrorFromBackendMessage(data);
                      this.router.navigate(['error']);
                      return of(false);
                }

              });
    }

    /**
     * @description Save Lead User Info when the quiz is attempted
     */
    saveLeadUserInfo(body): Observable<any> {
        return this.http.post('v1/Quiz/SaveLeadUserInfo', body, this.options).map(response => {
            return response["data"];
        })

    }

    getUrlValueByKey(domain:string,key:string): Observable<any> {
        let queryParamsList = `DomainName=${domain}&Key=${key}`;
            return this.http.get('v1/Quiz/GetUrlValueByKey?' + queryParamsList, this.options).map(response => {
                return response["data"];
            }) .catch(err=>{

                let data = err.error
                this.sharedService.setErrorFromBackendMessage(data);
                      this.router.navigate(['error']);
                      return of(false);

              });

    }

    // addGtmScript(gtmCode:string){
    //     $("head").prepend(
    //       $("<script />", {
    //         html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push(
    
    //             {'gtm.start': new Date().getTime(),event:'gtm.js'}
    //             );var f=d.getElementsByTagName(s)[0],
    //             j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    //             'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    //             })(window,document,'script','dataLayer','${gtmCode}');`
    //       })
    //     );
        
    //     document.getElementById("gtmBodyScript").append(
    //       `<iframe
    //           src="https://www.googletagmanager.com/ns.html?id=${gtmCode}"
    //           height="0"
    //           width="0"
    //           style="display:none;visibility:hidden"
    //         ></iframe>`
    //     );

    //     // this.hasAddedGtmCode = true;
    //   }
      addGtmScript(data:any) {
        //Add google tagmanager
        var scriptEle = document.createElement('script');
        scriptEle.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push(
    
            {'gtm.start': new Date().getTime(),event:'gtm.js'}
            );var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${data.GtmCode}');`;
        document.head.insertBefore(scriptEle, document.head.childNodes[0]);
        //Set Datalayer value
        var jobRockScriptEle = document.createElement('script');
        jobRockScriptEle.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push(
                { 
                    "event": "JobrockEvent",
                    "jrCategory": "jr_Automation_View",
                    "jrObjectId": ${data.QuizBrandingAndStyle.QuizId ? data.QuizBrandingAndStyle.QuizId : ''},
                    "jrObjectType": "Automation",
                    "jrObjectTitle": "${data.QuizCoverDetails.QuizTitle ? data.QuizCoverDetails.QuizTitle : ''}",
                    "jrTags": "${data.Tag ? data.Tag.toString() : ''}",
                    "jrResult": "",
                    "jrCaseId": "${data.SourceId ? data.SourceId : ''}",
                    "jrCaseTitle": "${data.SourceName ? data.SourceName : ''}",
                    "jrCaseTeam": "${data.OfficeId ? data.OfficeId : ''}",
                    "jrSalesPhase":""
                }
            );`
        document.head.insertBefore(jobRockScriptEle, document.head.childNodes[0]);
        //Add noscript
        var noscriptEle = document.createElement('noscript');
        noscriptEle.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${data.GtmCode}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
        document.body.insertBefore(noscriptEle, document.body.childNodes[0]);
    }

      //get attempt quiz setting
      getQuizAttemptSetting(quizCode:string){
        return this.http.post('v1/QuizAttempt/AttemptQuizSettings?QuizCode=' + quizCode, {}, this.options).map((response:any) => {
            this.getAttemptQuizDetails(response);
            return response["data"];
        }).catch(err => {
            let data = err.error;
            if (data.message == `Quiz not found for the QuizCode ${ quizCode}`) {
                data.message = ' this is not a dead end. Looks like you tried to open incorrect page URL.'
                data['message1'] = 'Please get the correct one and try again.'
                this.sharedService.setErrorMessage(data);
                  this.router.navigate(['error']);
                  return of(false);
            }
            else if (data.message == `Quiz has already been completed.`) {
                this.sharedService.setErrorMessage(data);
                this.router.navigate(['complete-quiz']);
                return of(false);
            }
            else{
                this.sharedService.setErrorFromBackendMessage(data);
                  this.router.navigate(['error']);
                  return of(false);
            }
        })
      }

    getAttemptQuizDetails(response){
        if(response.data && response.data.SourceName){
            this.quizDataService.setQuizSourceTitle(response.data.SourceName);
        }
        if(response.data && response.data.SourceId){
            this.quizDataService.setQuizSourceId(response.data.SourceId);
        }
        if(response && response.data && response.data.QuizBrandingAndStyle && response.data.QuizBrandingAndStyle.Language){
            if(response.data.QuizBrandingAndStyle.Language == languageEnum.Dutch){
                this.translate.use('nl-NL');
            }else if(response.data.QuizBrandingAndStyle.Language == languageEnum.English){
                this.translate.use('en-US');
            }else if(response.data.QuizBrandingAndStyle.Language == languageEnum.Polish){
                this.translate.use('pl-PL');
            }
        }
        if(response && response.data && response.data.QuizCoverDetails && response.data.QuizCoverDetails.QuizCoverTitle){
            const filterSelectedQuestion = filterPipe.transform(response.data.QuizCoverDetails.QuizCoverTitle);
            this.titleService.setTitle( filterSelectedQuestion); 

            if(response.data.QuizCoverDetails.QuizTitle){
                let quizTitleToSet = filterPipe.transform(response.data.QuizCoverDetails.QuizTitle);
                this.meta.addTag({ property: 'og:title', content: quizTitleToSet });
                this.meta.addTag({ name: 'twitter:title',property: 'twitter:title', content: quizTitleToSet });
            }
            if(response.data.QuizCoverDetails.QuizDescription){
                let quizDescToSet = filterPipe.transform(response.data.QuizCoverDetails.QuizDescription);
                this.meta.addTag({ property: 'og:description', content: quizDescToSet });
                this.meta.addTag({ name: 'twitter:description',property: 'twitter:description', content: quizDescToSet });
            }
            if(response.data.QuizCoverDetails.QuizCoverImage){
                let quizMediaToSet = response.data.QuizCoverDetails.QuizCoverImage;
                let quizMediaExtension = quizMediaToSet.match(/(\.)([a-zA-Z0-9]+)$/g);

                if(quizMediaExtension){
                    if(quizMediaExtension.includes(".jpg") || quizMediaExtension.includes(".jpeg") || quizMediaExtension.includes(".png") || quizMediaExtension.includes(".gif")
                        || quizMediaExtension.includes(".tiff") || quizMediaExtension.includes(".svg") || quizMediaExtension.includes(".webp")
                    ){
                        this.meta.addTag({ property: 'og:image', content: quizMediaToSet });
                        this.meta.addTag({ property: 'twitter:image', content: quizMediaToSet });
                    }
                    else if(quizMediaExtension.includes(".mp4") || quizMediaExtension.includes(".webm") || quizMediaExtension.includes(".mkv")){
                        this.meta.addTag({ property: 'og:video', content: quizMediaToSet });
                        this.meta.addTag({ property: 'og:video:type', content: "video/mp4" });
                        this.meta.addTag({ property: 'og:video:width', content: "400" });
                        this.meta.addTag({ property: 'og:video:height', content: "250" });
                    }
                }
            }
            this.meta.addTag({property : "og:type" ,content:"website" });
            let quizTitleToShow = filterPipe.transform(response.data.QuizCoverDetails.QuizCoverTitle);
            if(quizTitleToShow) this.addMetaTag('PageTitle', quizTitleToShow, true)
        }
        if(response && response.data && response.data.FavoriteIconUrl){
            this.setAppFavicon(response.data.FavoriteIconUrl);
        } 
        if(response && response.data && response.data.GtmCode && !this.hasAddedGtmCode){
            this.hasAddedGtmCode = true;
            setTimeout(() => {
                this.addGtmScript(response.data);
                }, 200);
        }
    }

}