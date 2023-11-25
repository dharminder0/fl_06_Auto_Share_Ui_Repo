import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { QuizBuilderApiService } from "../../quiz-builder-api.service";

@Injectable()

export class BadgesResolver implements Resolve<any>{

    constructor(private quizBuilderApiService: QuizBuilderApiService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        return this.quizBuilderApiService.getQuizBadge(route.params['bId'],route.parent.parent.params.id);
    }

}