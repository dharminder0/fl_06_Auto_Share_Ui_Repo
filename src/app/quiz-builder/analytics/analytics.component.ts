import { Component, OnInit } from '@angular/core';
import { IOption } from 'ng-select';
import { QuizBuilderApiService } from '../quiz-builder-api.service';
import { ActivatedRoute } from '@angular/router';
import { AnalyticsSubjectService } from './analytics-subject.service';
import * as moment from 'moment';
import { Moment } from 'moment';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  public versionList = [];
  public versionListData;
  public quizId;
  public quizDetails;
  selectedVersion;

  constructor(private quizBuilderApiService: QuizBuilderApiService,
    private route: ActivatedRoute,
    private analyticsSubjectService: AnalyticsSubjectService,
    private notificationsService: NotificationsService) { }

  ngOnInit() {
    var date1, date2, showDate1, showDate2, difference, time1, time2;

    this.route.parent.params
    .subscribe(data => {
      this.quizId = data['id'];
    });

    this.quizBuilderApiService.getQuizDetails(this.quizId)
    .subscribe((quiz) => {
      this.quizDetails = quiz;
    })
    /**
     * Get versionData from resolver
     */

    this.versionListData = this.route.snapshot.data['versionListData'];
    this.selectedVersion = this.versionListData.length ? this.versionListData[0].PublishedQuizId.toString() : null;
    this.analyticsSubjectService.setVersionData(this.selectedVersion);

    this.versionListData.forEach((data) => {

      var tempDate1 = data.PublishedOnDate.substr(0, 10) + ' ' + data.PublishedOnTime;
      showDate1 = moment(tempDate1).format('lll');
      showDate1 = showDate1.substr(0, showDate1.length - 3)

      var tempDate2 = data.UntilDate.substr(0, 10) + ' ' + data.UntilTime;
      showDate2 = moment(tempDate2).format('lll');
      showDate2 = showDate2.substr(0, showDate2.length - 3)

      date1 = moment(moment(tempDate1).toArray());
      date2 = moment(moment(tempDate2).toArray());
      var duration = moment.duration(date2.diff(date1))
      var days = Math.floor(duration.as('days'));
      var hours = Math.floor(duration.as('hours'));
      var minutes = Math.floor(duration.as('minutes'));

      if (days !== 0) {
        var showData = `V.${data.VersionNumber}   ${showDate1}   ${days} days   ${showDate2}`;
      } else if (hours !== 0) {
        var showData = `V.${data.VersionNumber}   ${showDate1}   ${hours} hours   ${showDate2}`;
      } else if (minutes !== 0) {
        var showData = `V.${data.VersionNumber}   ${showDate1}   ${minutes} minutes   ${showDate2}`;
      } else {
        var showData = `V.${data.VersionNumber}   ${showDate1}   few seconds   ${showDate2}`;
      }
      this.versionList.push({
        value: data.PublishedQuizId.toString(),
        label: showData
      });
    });
    
  }

  /**
   * 
   * @param e number (PublishedId)
   * function call on select version
   */
  onVersionChange(e) {
    this.analyticsSubjectService.setVersionData(e.value);
  }

}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            