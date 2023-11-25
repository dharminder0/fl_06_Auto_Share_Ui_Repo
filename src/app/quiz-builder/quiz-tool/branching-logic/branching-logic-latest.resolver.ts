import { Injectable } from "@angular/core";
import { Resolve, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { QuizBuilderApiService } from "../../quiz-builder-api.service";
import { NotificationsService } from "angular2-notifications";
import { Observable } from "rxjs/Observable";

@Injectable()

export class BranchingLogicLatestResolve implements Resolve<any>{
    constructor(private router:Router,
        private quizBuilderApiService: QuizBuilderApiService,
        private notificationsService: NotificationsService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        return this.quizBuilderApiService.getBranchingLogicDetails(route.params.id)
        .catch(error => {
            this.notificationsService.error('Branching-Logic', `${error.json().message}`)
            this.router.navigate(['../']);
            return Observable.of(null);
        })
    }
}