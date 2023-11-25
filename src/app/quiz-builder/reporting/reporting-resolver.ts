import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { QuizBuilderApiService } from '../quiz-builder-api.service';
import { UserInfoService } from '../../shared/services/security.service';

@Injectable()

export class ReportingResolve implements Resolve<any>{

    public officeId = "";
    public businessUsersId;
    public businessUsersEmail;
    public offsetValue;

    constructor(private quizBuilderApiService: QuizBuilderApiService,
        private userInfoService: UserInfoService){
            this.offsetValue = this.userInfoService.get().OffsetValue;
            this.businessUsersId = this.userInfoService.get().BusinessUserId;
            this.businessUsersEmail = this.userInfoService.get().UserName;
            this.userInfoService.get().OfficeList.forEach(office => {
                if(!this.officeId){
                    this.officeId = office.id;
                }else{
                    this.officeId = this.officeId + "," + office.id;
                }
            });
        }

    resolve(route: ActivatedRouteSnapshot,state: RouterStateSnapshot){
        return this.quizBuilderApiService.getQuizList(this.officeId, true, this.offsetValue, this.quizBuilderApiService.automationType.toString());
    }

}