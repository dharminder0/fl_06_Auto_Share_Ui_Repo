import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { QuizBuilderApiService } from '../quiz-builder-api.service';
import { UserInfoService } from '../../shared/services/security.service';

@Injectable()
export class AnalyticsResolver implements Resolve<any> {
    public offsetValue; 
    constructor(private quizBuilderApiService: QuizBuilderApiService,
        private userInfoService: UserInfoService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.offsetValue = this.userInfoService.get().OffsetValue;
     return this.quizBuilderApiService.getQuizVersionList(+route.parent.params.id, this.offsetValue);
    }
}