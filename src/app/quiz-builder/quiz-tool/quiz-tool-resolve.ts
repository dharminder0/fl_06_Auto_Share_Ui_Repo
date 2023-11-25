import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { QuizBuilderApiService } from "../quiz-builder-api.service";

@Injectable()

export class QuizToolResolver implements Resolve<any>{


    constructor(private quizBuilderApiService: QuizBuilderApiService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.quizBuilderApiService.getQuizDetails(route.params.id);
    }

}
@Injectable()

export class QuizCategoriesResolve implements Resolve<any>{


    constructor(private quizBuilderApiService: QuizBuilderApiService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        {
            return this.quizBuilderApiService.getQuizCategories();
        }
    }

}

@Injectable()

export class BrandingAndStylingResolver implements Resolve<any>{


    constructor(private quizBuilderApiService: QuizBuilderApiService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        return  this.quizBuilderApiService.getBranding(route.parent.params.id);
    }

}