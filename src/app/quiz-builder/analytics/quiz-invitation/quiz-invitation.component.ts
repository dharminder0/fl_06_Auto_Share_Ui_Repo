import { Component, OnInit, OnDestroy } from "@angular/core";
import { AnalyticsSubjectService } from "../analytics-subject.service";
import { Subscription } from "rxjs/Subscription";
import { QuizBuilderApiService } from "../../quiz-builder-api.service";
import { NotificationsService } from "angular2-notifications";
import "rxjs/add/operator/skip";

@Component({
  selector: "app-quiz-invitation",
  templateUrl: "./quiz-invitation.component.html",
  styleUrls: ["./quiz-invitation.component.css"]
})
export class QuizInvitationComponent implements OnInit, OnDestroy {
  public version;
  public versionSubscription: Subscription;
  public analyticsViews;
  public showDataonType = true;

  constructor(
    private analyticsSubjectService: AnalyticsSubjectService,
    private quizBuilderApiService: QuizBuilderApiService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit() {
    /**
     * Get publishedId asynchronously
     */
    this.versionSubscription = this.analyticsSubjectService.versionSubject
      .filter(Boolean)
      .subscribe(data => {
        this.version = data;
        this.getQuizAnalyticsOverview(data);
      });
    this.getQuizAnalyticsOverview(
      this.analyticsSubjectService.getPublishedId()
    );
  }

  /**
   *
   * @param publishId number (publishedId)
   *Api integration: get Quiz Analytic overview against publishedId
   */
  getQuizAnalyticsOverview(publishId) {
    if (!publishId) {
      //this.notificationsService.error("Automation is not publish");
    } else {
      this.quizBuilderApiService.getQuizAnalyticsOverview(publishId).subscribe(
        data => {
          this.analyticsViews = data;
          this.dataSource = {
            chart: {
              caption: "",
              theme: "fusion"
            },
            data: [
              { label: "Views", value: this.analyticsViews.Views.toString() },
              {
                label: "Automation Starts",
                value: this.analyticsViews.QuizStarts.toString()
              },
              {
                label: "Completions",
                value: this.analyticsViews.Completion.toString()
              },
              { label: "Leads", value: this.analyticsViews.Leads.toString() }
            ]
          };
        },
        error => {
         // this.notificationsService.error("Error");
        }
      );
    }
  }

  /**
   * Unsubscribe all subscription on destroy component
   */
  ngOnDestroy() {
    this.versionSubscription.unsubscribe();
  }

  width = 600;
  height = 400;
  type = "mscombi2d";
  dataFormat = "json";
  dataSource: Object;
  title: string;
}