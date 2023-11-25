import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { Injectable } from "@angular/core";
import { QuizBuilderApiService } from "../../quiz-builder-api.service";

@Injectable()
export class AttachmentsResolve implements Resolve<any> {
  constructor(private quizBuilderApiService: QuizBuilderApiService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.quizBuilderApiService.getAttachments(route.parent.params.id);
  }
}
