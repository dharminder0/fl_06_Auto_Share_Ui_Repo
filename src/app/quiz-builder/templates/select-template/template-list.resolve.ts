import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { QuizBuilderApiService } from "../../quiz-builder-api.service";

@Injectable()

export class TemplateListResolver implements Resolve<any>{


    constructor(
        private quizBuilderApiService: QuizBuilderApiService,
        private router:Router
        ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const PAGE_NO:number = 1;
        // let quizType = 
        let QuizType = route.queryParams['QuizType'];
        let CategoryId = route.queryParams['CategoryId']
        if(!QuizType || !CategoryId){
            this.router.navigate(['quiz-builder/add-automation/industry'])
        }
        return this.quizBuilderApiService.getTemplates(QuizType,CategoryId);
        // console.table(CATEGORY_LIST)
        // return Observable.of(CATEGORY_LIST).map(o => JSON.stringify(o));
    }
}