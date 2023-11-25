import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { QuizBuilderApiService } from "../../quiz-builder-api.service";
import { Injectable } from "@angular/core";
import { UserInfoService } from "../../../shared/services/security.service";
@Injectable()
export class ActionResolver implements Resolve<any> {
  constructor(private quizBuilderApiService: QuizBuilderApiService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.quizBuilderApiService.getQuizAction(route.params.aId);
  }
}

@Injectable()
export class AppointmentResolver implements Resolve<any> {
  public offSetValue;
  public officeIds = [];
  constructor(
    private quizBuilderApiService: QuizBuilderApiService,
    private userInfoService: UserInfoService
  ) {
    this.offSetValue = this.userInfoService.get().OffsetValue;
    this.officeIds = [];
    for (var i = 0; i < this.userInfoService.get().OfficeList.length; i++) {
      this.officeIds.push(this.userInfoService.get().OfficeList[i].id);
    }
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.quizBuilderApiService.getAppointmentType(
      this.officeIds.toString(),
      this.offSetValue
    );
  }
}


@Injectable()
export class AutomationResolver implements Resolve<any> {
  public officeId: string = "";
  public officeListArray = [];
  public businessUsersId;
  public businessUsersEmail;
  public offsetValue;

  constructor(
    private quizBuilderApiService: QuizBuilderApiService,
    private userInfoService: UserInfoService
  ) {
    this.offsetValue = this.userInfoService.get().OffsetValue;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.businessUsersId = this.userInfoService.get().BusinessUserId;
    this.businessUsersEmail = this.userInfoService.get().UserName;
    if (this.quizBuilderApiService.getOfficeIds()) {
      this.officeId = this.quizBuilderApiService.getOfficeIds();
    } else {
      // this.userInfoService.get().OfficeList.forEach(office => {
      //   if (office.id == 133) {
      //     this.officeId = office.id.toString();
      //   }
      // });
      if (!this.officeId) {
        if(this.userInfoService.get().officesParentChildList.length > 0){
          this.userInfoService.get().officesParentChildList.forEach(office => {
            this.officeListArray.push({
                id: office.id.toString(),
                name: office.name,
                type : 'Parent'
            })
            if(office.children && office.children.length > 0){
              office.children.forEach(child => {
                this.officeListArray.push({
                  id :  child.id.toString(),
                  name :  child.name,
                  type  :  'Child'
                }) 
              })
          }
          })
        }
        this.officeListArray.forEach(office => {
          if (!this.officeId) {
            this.officeId = office.id;
          } else {
            this.officeId = this.officeId + "," + office.id;
          }
        });
      }
      this.quizBuilderApiService.setOfficeIds(this.officeId);
    }
    return this.quizBuilderApiService.getQuizList(
      this.quizBuilderApiService.officeIds,
      true,
      this.offsetValue,
      this.quizBuilderApiService.automationType.toString()
    );
  }
}


