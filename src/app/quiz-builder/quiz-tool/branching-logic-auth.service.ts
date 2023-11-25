import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { QuizBuilderApiService } from "../quiz-builder-api.service";

export class BranchingLogicAuthService implements CanActivate {
  public data = true;

  constructor() {}

  setBranchingLogicEnable(data) {
    this.data = data;
  }

  getBranchingLogicEnable(){
    return this.data;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.data;
  }
}
