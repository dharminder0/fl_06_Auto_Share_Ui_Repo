import { Injectable } from "@angular/core";
import { UserInfoService } from "../../shared/services/security.service";

@Injectable()
export class QuizToolData{
    private quizData:any;

    constructor(private userInfoService:UserInfoService){

    }

    public setQuizData(quizData){
        this.quizData = quizData
    }

    public getQuizData(){
        return this.quizData;
    }

    getCurrentOfficeName():any{
        let officeList:any[] = this.userInfoService.get().OfficeList;
        let officeid = this.quizData.OfficeId;
        if(officeid){
            if(officeList && officeList.length){
                for(var office = 0 ; office < officeList.length ; office++){
                    if(officeList[office].id == officeid){
                        return officeList[office].name;
                    }
                }
            }
        }else{
            return null;
        }
    }


}