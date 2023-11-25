import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { QuizBuilderApiService } from "../../quiz-builder-api.service";
import { ActivatedRoute } from "@angular/router";
import { QuizzToolHelper } from "../quiz-tool-helper.service";
import { NotificationsService } from "angular2-notifications";

@Component({
  selector: "app-multiple-result-setting",
  templateUrl: "./multiple-result-setting.component.html",
  styleUrls: ["./multiple-result-setting.component.css"]
})
export class MultipleResultSettingComponent implements OnInit {
  public max;
  public quizId;
  public curResults;
  public showLeadForm;
  

  constructor(
    private quizbuilderApi: QuizBuilderApiService,
    private route: ActivatedRoute,
    private quizBuilderApiService: QuizBuilderApiService,
    private quizTool: QuizzToolHelper,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit() {
    this.quizId = this.route.parent.snapshot.params.id;
  }

  decrement() {
    this.max--;
  }
  increment() {
    this.max++;
  }

  onSave() {
    this.quizbuilderApi
      .updatePersonalityMaxResult(this.max, this.quizId, this.showLeadForm)
      .subscribe(data => {

        // this.notificationsService.success('Maximum Resuls and Lead Form details have been updated')
      }, (error) => {
        // this.notificationsService.error('Error');
      });
    var ar = {
      maxScore: "",
      CurrentRes: "",
      showLead:true
    };
    ar.maxScore = this.max;
    ar.CurrentRes = this.curResults;
    ar.showLead= this.showLeadForm;
    this.quizTool.maxScore.next(ar);
   
  }

  

  ngOnDestroy() {}
}
