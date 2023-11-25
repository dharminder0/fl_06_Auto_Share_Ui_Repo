import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate, ActivatedRoute } from "@angular/router";
import { QuizApiService } from "./quiz-api.service";
import { Observable } from 'rxjs/Observable';
import { QuizDataService } from "./quiz-data.service";
import { SharedService } from "../shared/services/shared.service";
import { QuizBuilderApiService } from "../quiz-builder/quiz-builder-api.service";
import { EmptyObservable } from "rxjs/observable/EmptyObservable";
import { ShareConfigService } from "../shared/services/shareConfig.service";

@Injectable()

export class QuizResolve implements Resolve<any>{


    constructor(
        private quizApiService: QuizApiService,
        private quizDataService: QuizDataService,
        private sharedService: SharedService,
        private router: Router,
        private quizBuilderApiService: QuizBuilderApiService,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let params = route.queryParams;
        var quizCode;
        quizCode = route.queryParams.QuizCode;
        // let resultIds = window.location.search.split('ResultIds=')[1];
        // if(resultIds){
        //     this.quizApiService.isQuizResultIdsSubmission = resultIds.split('&ConfigurationId=')[0];
        // }
        // this.quizApiService.isPrivacyLink = decodeURIComponent(window.location.search.split('privacyLink=')[1]);
        // this.quizApiService.changeIsPrivacyLinkSubmission();
        // this.quizApiService.isQuizConfigurationIdsSubmission = window.location.search.split('ConfigurationId=')[1];

        // if(params && Object.keys(params).length > 0){
        //     if(params.resultIds){
        //         this.quizApiService.isQuizResultIdsSubmission = params.resultIds;
        //     }
        //     if(params.privacyLink){
        //         this.quizApiService.isPrivacyLink = decodeURIComponent(params.privacyLink);
        //         this.quizApiService.changeIsPrivacyLinkSubmission();
        //     }
        //     if(params.configurationId){
        //         this.quizApiService.isQuizConfigurationIdsSubmission = params.configurationId;
        //     }
        // }
        
        if (!quizCode) {
            quizCode = route.queryParams.QuizCodePreview;
            this.quizDataService.setQuizCode(quizCode);
                return this.quizApiService.getQuizAttemptQuiz(quizCode, 'PREVIEW')
                    .catch(e => {
                        this.sharedService.errorMessage.message = e ? e.message : 'Something went wrong'
                        this.router.navigate(["/error"]);
                        return new EmptyObservable<Response>();
                    })
        } else {
            this.quizDataService.setQuizCode(quizCode);
            return this.quizApiService.getQuizAttemptQuiz(quizCode)
            .catch(e => {
                this.sharedService.errorMessage.message = e ? e.message : 'Something went wrong'
                this.router.navigate(["/error"]);
                return new EmptyObservable<Response>();
            })
        }

    }

}

@Injectable()
export class GetQuizAttemptCode implements CanActivate {
    constructor(private router: Router,
        private sharedService: SharedService,
        private quizApiService: QuizApiService) {
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        var publishCode;
        publishCode = route.queryParams.code;
        // return this.quizApiService.getQuizAttemptCode(publishCode, 'AUDIT')
        //     .subscribe((data) => {
        //         this.router.navigate(["/proman"]);
        //         return true;
        //     }, error => {
        //         this.sharedService.errorMessage.message = error ? error : 'Something went wrong'
        //         this.router.navigate(["/error"]);
        //         return false
        //     })
        return true;

        //   return new Promise((resolve) => {
        //     this.quizApiService.getQuizAttemptCode(publishCode,'AUDIT')
        //       .subscribe((data) => {
        //         this.router.navigate(['/dashboard']);
        //         resolve(false);
        //       },(error)=>{
        //         resolve(true);
        //       })
        //     })

    }
}

@Injectable()

export class QuizPreviewResolve implements Resolve<any>{


    constructor(
        private quizApiService: QuizApiService,
        private quizDataService: QuizDataService,
        private sharedService: SharedService,
        private router: Router,
        private quizBuilderApiService: QuizBuilderApiService,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        
        var quizCode;
        quizCode = route.queryParams.QuizCode;
        if (!quizCode) {
            quizCode = route.queryParams.QuizCodePreview;
            this.quizDataService.setQuizCode(quizCode);
            if (route.queryParams.QuizId) {
               return this.quizBuilderApiService.getQuizDetails(route.queryParams.QuizId).catch(e => {
                this.sharedService.errorMessage.message = e ? e.message : 'Something went wrong'
                this.router.navigate(["/error"]);
                return new EmptyObservable<Response>();
            })
            }
            else{
                return this.quizApiService.getQuizAttemptQuiz(quizCode, 'PREVIEW')
                    .catch(e => {
                        this.sharedService.errorMessage.message = e ? e.message : 'Something went wrong'
                        this.router.navigate(["/error"]);
                        return new EmptyObservable<Response>();
                    })
                }
        } else {
            this.quizDataService.setQuizCode(quizCode);
            return this.quizApiService.getQuizAttemptQuiz(quizCode)
                .catch(e => {
                    this.sharedService.errorMessage.message = e ? e.message : 'Something went wrong'
                    this.router.navigate(["/error"]);
                    return new EmptyObservable<Response>();
                })
        }

    }

}


@Injectable()

export class CustomDomainResolve implements Resolve<any>{


    constructor(
        private quizApiService: QuizApiService,
        private sharedService: SharedService,
        private shareConfigService: ShareConfigService,
        private router: Router,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if(route && route.params && route.params.id && route.params.id == "error"){
            this.sharedService.errorMessage.message = 'Something went wrong';
            this.router.navigate(["/404"]);
            return new EmptyObservable<Response>();
        }
        if(route.queryParams["utm_id"] && route.queryParams["utm_id"] !== ""){
            //sessionStorage.setItem('utm_id', route.queryParams["utm_id"]);
            this.shareConfigService.setCookie('utm_id', route.queryParams["utm_id"]);
        }
        if(route.queryParams["utm_source"] && route.queryParams["utm_source"] !== ""){
            //sessionStorage.setItem('utm_source', route.queryParams["utm_source"]);
            this.shareConfigService.setCookie('utm_source', route.queryParams["utm_source"]);
        }
        if(route.queryParams["utm_medium"] && route.queryParams["utm_medium"] !== ""){
            //sessionStorage.setItem('utm_medium', route.queryParams["utm_medium"]);
            this.shareConfigService.setCookie('utm_medium', route.queryParams["utm_medium"]);
        }
        if(route.queryParams["utm_content"] && route.queryParams["utm_content"] !== ""){
            //sessionStorage.setItem('utm_content', route.queryParams["utm_content"]);
            this.shareConfigService.setCookie('utm_content', route.queryParams["utm_content"]);
        }
        if(route.queryParams["utm_campaign"] && route.queryParams["utm_campaign"] !== ""){
            //sessionStorage.setItem('utm_campaign', route.queryParams["utm_campaign"]);
            this.shareConfigService.setCookie('utm_campaign', route.queryParams["utm_campaign"]);
        }
        if(route.queryParams["utm_term"] && route.queryParams["utm_term"] !== ""){
            //sessionStorage.setItem('utm_term', route.queryParams["utm_term"]);
            this.shareConfigService.setCookie('utm_term', route.queryParams["utm_term"]);
        }
        if(route.queryParams["utm_channel"] && route.queryParams["utm_channel"] !== ""){
            //sessionStorage.setItem('utm_channel', route.queryParams["utm_channel"]);
            this.shareConfigService.setCookie('utm_channel', route.queryParams["utm_channel"]);
        }
        sessionStorage.setItem("isPublicPage", "true");
        return this.quizApiService.getUrlValueByKey(window.location.host,route.params.id)
        .catch(e => {
            this.sharedService.errorMessage.message = e ? e.message : 'Something went wrong'
            this.router.navigate(["/error"]);
            return new EmptyObservable<Response>();
        })

    }

}