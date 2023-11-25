import { CanActivate, Router, ActivatedRouteSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";

@Injectable()

export class QuizPermissionGaurd implements CanActivate {

    private isCreatedBy: boolean;
    private isViewOnly: boolean;

    constructor(private router: Router){

    }

    setPermissionData(quizData){
        this.isCreatedBy = quizData.IsCreatedByYou;
        this.isViewOnly = quizData.IsViewOnly;
    }

    canActivate(route: ActivatedRouteSnapshot){
        if(this.isCreatedBy){
            return true;
        }else if(!this.isViewOnly){
            return true;
        }
        this.router.navigate(['quiz-builder'])
        return false;
    }

}