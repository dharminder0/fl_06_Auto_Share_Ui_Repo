import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuizBuilderApiService } from '../../quiz-builder-api.service';
import { AnalyticsSubjectService } from '../analytics-subject.service';
import { Subscription } from 'rxjs';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-quiz-result',
  templateUrl: './quiz-result.component.html',
  styleUrls: ['./quiz-result.component.css']
})
export class QuizResultComponent implements OnInit, OnDestroy {

  public version;
  public versionSubscription: Subscription;
  public analyticsOverview;
  public analyticsStats;
  public progressBarValues = [];
  public leadProgressBarValue = 0;
  public isApiHitted: boolean = false;

  constructor(private quizBuilderApiService: QuizBuilderApiService,
    private analyticsSubjectService: AnalyticsSubjectService,
    private notificationsService: NotificationsService) { }

  ngOnInit() {

    /**
     * Get publishedId asynchronously
     */
    this.versionSubscription = this.analyticsSubjectService.versionSubject
      .subscribe((data) => {
        this.version = data;
        this.getQuizResultStats(this.version);
      });

    this.getQuizResultStats(this.analyticsSubjectService.getPublishedId());
  }

  /**
   * 
   * @param publishedId number (publishedId)
   * get quiz analytics Statistics against publishedId
   */
  getQuizResultStats(publishedId) {
    var total = 0;
    this.quizBuilderApiService.getQuizAnalyticsOverview(publishedId)
      .subscribe((data) => {
        this.analyticsOverview = data;
      }, (error) => {
        this.notificationsService.error('Error');
      })

    this.quizBuilderApiService.getQuizAnalyticsStats(publishedId)
      .subscribe((data) => {
        this.isApiHitted = true;
        this.progressBarValues = [];
        this.analyticsStats = data;
        if(this.analyticsStats.VisitorsCount){
          this.leadProgressBarValue = ((this.analyticsStats.LeadsCount /this.analyticsStats.VisitorsCount)*100);
        }else{
          this.leadProgressBarValue = 0;
        }
        this.analyticsStats.Results.forEach((res) => {
          total = total + res.LeadsInResult;
        });
        this.analyticsStats.Results.forEach((res) => {
          if (total) {
            this.progressBarValues.push((res.LeadsInResult / total) * 100)
          } else {
            this.progressBarValues.push(0);
          }
        })
      }, (error) => {
        this.notificationsService.error('Error');
      });
  }

  /** 
   * Unsubscribe all subscription on destroy component
  */
  ngOnDestroy() {
    this.versionSubscription.unsubscribe();
  }
}
