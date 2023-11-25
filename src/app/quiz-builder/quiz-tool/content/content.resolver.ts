import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { QuizBuilderApiService } from "../../quiz-builder-api.service";

@Injectable()

export class ContentResolver implements Resolve<any>{

    constructor(private quizBuilderApiService: QuizBuilderApiService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        return this.quizBuilderApiService.getQuizContent(route.params.cId,route.parent.parent.params.id);
    }
}