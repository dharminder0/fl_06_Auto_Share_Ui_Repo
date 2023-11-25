import { Component, OnInit } from '@angular/core';
import { QuizBuilderApiService } from '../../quiz-builder/quiz-builder-api.service';
import * as moment from 'moment-timezone';
import { ActivatedRoute } from '@angular/router';
import { QuizDataService } from '../quiz-data.service';
import { UserInfoService } from '../../shared/services/security.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../shared/services/common.service';

@Component({
    selector: 'app-individual-automation-report',
    templateUrl: './individual-automation-report.component.html',
    styleUrls: ['./individual-automation-report.component.scss']
  })
  export class IndividualAutomationReportComponent implements OnInit {

    public leadUserInfoDetails;
    public leadReportDetails;
    public getLeadDetails;
    public leadResults;
    public leadQuestions;
    public leadId;
    public quizId;
    public timeOfComplete:any = {};
    public tab = 0;
    public allLeadReport;
    public sentDate;
    public startDate;
    public complateDate;
    public getCompanyPrimaryColor;
    public userInfo: any = {};
    public language;
    public availabilityType = ['Immediately', 'Within 3 months', 'After 3 months'];

      constructor(private quizBuilderApiService: QuizBuilderApiService,
        private quizDataService: QuizDataService,
        private userInfoService: UserInfoService,
        private activatedRoute: ActivatedRoute,
        private translate: TranslateService,
        private commonService:CommonService){}
      ngOnInit(){
        this.leadId = this.activatedRoute.snapshot.queryParams["leadId"];
        if(this.activatedRoute.snapshot.queryParams["quizId"] && this.activatedRoute.snapshot.queryParams["quizId"].indexOf('$') > -1){
          if(this.activatedRoute.snapshot.queryParams["quizId"].split('$')[0]){
            this.quizId = this.activatedRoute.snapshot.queryParams["quizId"].split('$')[0];
          }
        }else{
          this.quizId = this.activatedRoute.snapshot.queryParams["quizId"];
        }
        this.userInfo = this.userInfoService._info;
        if (this.userInfo) {
          this.language = this.userInfo.ActiveLanguage;
          this.translate.use(this.language);
        }
        this.getIndividualReport();
        let getCompanyColor = this.quizDataService.getCompanyColor();
        this.getCompanyPrimaryColor = getCompanyColor.primaryColor;
      }

      scrollTo(className: string):void {
        const elementList = document.querySelector(className);
        const element = elementList as HTMLElement;
        if(element){
        element.scrollIntoView({ behavior: 'smooth' });
        }
      }

      getIndividualReport(){
        if(!this.quizId || !this.leadId){
            return false;
          }
        this.quizBuilderApiService.getQuizLeadReport(this.quizId,this.leadId).subscribe(data => {
            this.getLeadDetails = data;
            this.leadUserInfoDetails = this.getLeadDetails.LeadUserInfo;
            this.allLeadReport = this.getLeadDetails.leadReports;
            if( this.allLeadReport && this.allLeadReport && this.allLeadReport.length > 0){
              this.onChangeReport(this.tab);
            }
        });
      }

      getOptionImageAndVideo(){
        if(this.leadQuestions && this.leadQuestions.length > 0){
            this.leadQuestions.map(ques => {
                if((ques.QuestionType == 1 || ques.QuestionType == 2) && ques.Answers && ques.Answers.length > 0){
                    ques.Answers.map(ans => {
                        if(ans.OptionImage){
                          ans.imageORvideo = this.commonService.getImageOrVideo(ans.OptionImage);
                        }else{
                            ans.imageORvideo = '';
                        }
                    });
                }else if(ques.QuestionType == 13){
                  if(ques.Comments && ques.Comments.length > 0){
                    ques.Comments[0].Comment = ques.Comments[0].Comment ? moment(ques.Comments[0].Comment).format('MM/DD/YYYY') : '';
                  }
                }
            });
          }
      }

      formatTimeSlotUtcToLocal(date:string,time:string){
        let userTimeZone:string = moment.tz.guess();
        let currUtcTime:string = `${date} ${time}Z`;
        return date + 'T' + moment(currUtcTime).tz(userTimeZone).format('HH:mm:ss');
    }

    complateQuiztime(startTime,endTime){
      let result;
        if(startTime && endTime){
          result = moment(endTime).diff(startTime, 'seconds');
          this.timeOfComplete = {
            "day" : Math.floor(result / (24 * 3600)),
            "hour" : Math.floor(result / 3600),
            "min" : Math.floor(result / 60),
            "sec" : Math.floor(result % 60)
          }
        }

    }

    onChangeReport(tab){
      this.tab = tab;
      this.complateDate = '';
      this.sentDate = '';
      this.startDate = '';
      this.timeOfComplete = {};
      this.leadReportDetails = this.getLeadDetails.leadReports[tab];
      this.complateQuiztime(this.leadReportDetails.StartDate,this.leadReportDetails.CompleteDate);
      if(this.leadReportDetails.CompleteDate){
      let completeDate = this.formatTimeSlotUtcToLocal(this.leadReportDetails.CompleteDate.split("T")[0],this.leadReportDetails.CompleteDate.split("T")[1]);
      this.complateDate = completeDate ? moment(completeDate).format('DD.MM.YYYY'):'';
      }
      if(this.leadReportDetails.SentDate){
      let sentDate = this.formatTimeSlotUtcToLocal(this.leadReportDetails.SentDate.split("T")[0],this.leadReportDetails.SentDate.split("T")[1]);
      this.sentDate = sentDate ? moment(sentDate).format('DD.MM.YYYY'):'';
      }
      if(this.leadReportDetails.StartDate){
      let startDate = this.formatTimeSlotUtcToLocal(this.leadReportDetails.StartDate.split("T")[0],this.leadReportDetails.StartDate.split("T")[1]);
      this.startDate = startDate ? moment(startDate).format('DD.MM.YYYY'):'';
      }
      this.leadResults = this.leadReportDetails.Results;
      this.leadQuestions = this.leadReportDetails.Questions;
      if(this.leadQuestions && this.leadQuestions.length > 0){
        this.leadQuestions.map(ques => {
          if(ques.QuestionType == 12){
            ques.Answers.map(ans => {
              ans.AnswerText = parseInt(ans.AnswerText)
            });
          }
        });
      }
      this.getOptionImageAndVideo();
    }

    colorLuminance(hex, lum) {

      // validate hex string
      hex = String(hex).replace(/[^0-9a-f]/gi, '');
      if (hex.length < 6) {
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
      }
      lum = lum || 0;
    
      // convert to decimal and change luminosity
      var rgb = "#", c, i;
      for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i*2,2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00"+c).substr(c.length);
      }
    
      return rgb;
    }

    onStatistic(){
        let startDate = moment().subtract(1, 'months').format('L');
        let endDate = moment().format('L');
        if(this.getLeadDetails.LeadUserInfo.SourceId){
            window.open(`quiz/automation-report?QuizId=${this.getLeadDetails.QuizId}&StartDate=${startDate}&EndDate=${endDate}&SourceId=${this.getLeadDetails.LeadUserInfo.SourceId}`,"_blank");
        }else{
            window.open(`quiz/automation-report?QuizId=${this.getLeadDetails.QuizId}&StartDate=${startDate}&EndDate=${endDate}`,"_blank");
        }
    }
  }