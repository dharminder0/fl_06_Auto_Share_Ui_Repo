import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuizBuilderApiService } from '../../quiz-builder-api.service';
import { AnalyticsSubjectService } from '../analytics-subject.service';
import { Subscription } from 'rxjs/Subscription';
import { NotificationsService } from 'angular2-notifications';
import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
  selector: 'app-quiz-reminder',
  templateUrl: './quiz-reminder.component.html',
  styleUrls: ['./quiz-reminder.component.css']
})
export class QuizReminderComponent implements OnInit, OnDestroy {

  public quizLeadsCollection;
  public versionSubscription: Subscription;

  constructor(private quizBuilderApiService: QuizBuilderApiService,
    private analyticsSubjectService: AnalyticsSubjectService,
    private notificationsService: NotificationsService) { }

  ngOnInit() {
    this.getQuizLeadCollectionStats(this.analyticsSubjectService.getPublishedId());

    /**
     * Get Version details using versionSubject & Api Integration
     */

    this.versionSubscription = this.analyticsSubjectService.versionSubject
      .subscribe((version) => {
        this.getQuizLeadCollectionStats(version);
      })
  }

  /**
   * 
   * @param publishedId Integer (VersionId)
   * Api Integration: get quiz leads collection leads details
   */
  getQuizLeadCollectionStats(publishedId) {
    this.quizBuilderApiService.getQuizLeadStatsData(publishedId)
      .subscribe((data) => {
        this.quizLeadsCollection = data;
        if(this.quizLeadsCollection){
          this.quizLeadsCollection.forEach(collectData => {
            collectData.AddedOn = moment(collectData.AddedOn).format('ll');
          });
          this.quizLeadsCollection
        }
      }, (error) => {
        this.notificationsService.error('Error');
      });
  }

  /** Unsubscribe all the subscription */
  ngOnDestroy() {
    this.versionSubscription.unsubscribe();
  }

}
