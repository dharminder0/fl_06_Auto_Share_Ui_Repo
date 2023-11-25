import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { QuizBuilderApiService } from "../../quiz-builder-api.service";

@Injectable()

export class CoverPageResolver implements Resolve<any>{


    constructor(private quizBuilderApiService: QuizBuilderApiService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        return  this.quizBuilderApiService.getQuizCoverDetails(route.parent.params.id);
    }

}