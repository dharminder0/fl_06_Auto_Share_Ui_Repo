import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import am4themes_frozen from "@amcharts/amcharts4/themes/frozen";
import { QuizBuilderApiService } from '../../quiz-builder/quiz-builder-api.service';
import { ShareConfigService } from '../../shared/services/shareConfig.service';
import { QuizDataService } from '../quiz-data.service';
import { UserInfoService } from '../../shared/services/security.service';
import { FreeTextQuestionComponent } from './free-text-question/free-text-question.component';
import { columnChartEnum } from './columnChartEnum';
import * as moment from 'moment-timezone';
import { RemoveallTagPipe } from '../../shared/pipes/search.pipe';
import { TranslateService } from '@ngx-translate/core';
import { answerTypeEnum } from '../../quiz-builder/quiz-tool/commonEnum';

am4core.addLicense("CH204852226");
am4core.useTheme(am4themes_frozen);
am4core.useTheme(am4themes_animated);
const filterPipe = new RemoveallTagPipe();

@Component({
  selector: 'app-automation-report',
  templateUrl: './automation-report.component.html',
  styleUrls: ['./automation-report.component.scss']
})
export class AutomationReportComponent implements OnInit {

  @ViewChild("freeTextTemplate", { read: ViewContainerRef, static: true })
  freeTextTemplate: ViewContainerRef;
  // Subscription
  private automationReportSuggestionFilteredDataSubscription: Subscription;
  private automationReportSelectedDated: Subscription;
  public reportDetails: any;
  public questionReport: any;
  public selectedDated: any;
  public quizId: any;
  public souceId: any;
  public quizName: any;
  public companyWise: any;
  public showOptionsForFilter: boolean = false;
  public selectedResult:any;
  public startDate: any;
  public endDate: any;
  public suggestionType = 3;
  public userInfo: any = {};
  public allOfficeIds: any = [];
  public ResultId: any;
  public isNoData: boolean = false;
  public quizTitle: any;
  public QuizTypeId: any;
  public npsScore:any;
  public detractorCount:any;
  public passiveCount:any;
  public promoterCount:any;
  public npsScoreDetails;
  public tab:any = 'tab_1';
  public chatView:any = 1;
  public language;
  public insightsTabList:any = [
    {
      id : 1,
      isActive : true,
      name : "SUMMARY",
    },
    {
      id : 2,
      isActive : false,
      name : "Lbl_Funnel"
    },
    {
      id : 3,
      isActive : false,
      name : "Lbl_Top_3"
    },
    {
      id : 4,
      isActive : false,
      name : "Lbl_NPSgraph"
    }
  ];
  public selectedInsightId = 1;
  public topRecordsDetails;
  public selectedResultTopThings;
  public isRatingType:boolean = true;
  public templateId;
  public templateName;
  public isApiError:boolean = false;
  public questionTypeEnum = answerTypeEnum;


  constructor(private quizBuilderApiService: QuizBuilderApiService,
    private _crf: ComponentFactoryResolver,
    private shareConfigService: ShareConfigService,
    private quizDataService: QuizDataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userInfoService: UserInfoService,
    private translate: TranslateService) { }

  ngOnInit() {
    this.souceId = this.activatedRoute.snapshot.queryParams["SourceId"];
    this.templateId = this.activatedRoute.snapshot.queryParams["templateId"];
    this.companyWise = this.activatedRoute.snapshot.queryParams["isCompanywise"];
    this.quizName = this.activatedRoute.snapshot.queryParams["QuizTitle"];
    this.quizId = this.activatedRoute.snapshot.queryParams["QuizId"];
    this.startDate = this.activatedRoute.snapshot.queryParams["StartDate"];
    this.endDate = this.activatedRoute.snapshot.queryParams["EndDate"];
    this.userInfo = this.userInfoService._info;
    if (this.userInfo) {
      this.language = this.userInfo.ActiveLanguage;
      this.translate.use(this.language);
      this.userInfo.OfficeList.map(function (item: any) {
        this.allOfficeIds.push(item.id);
      }, this);
    }
    this.selectedResult = this.language == 'en-US' ? 'All' : 'Alle';
    //call selected date Subscription
    this.automationReportSelectedDated = this.quizDataService.selectedDateInAutomationReportObservable
      .subscribe(data => {
        this.selectedDated = data;
        if (this.QuizTypeId) {
          this.getReportDetail(this.quizId,this.templateId);
        }
      });

    if(this.quizId){
      this.getQuizDetail(this.quizId);
    }
    if(this.templateId){
      this.getTemplateDetail(this.templateId);
    }
  }

  getReportDetail(quizId?,templateId?) {
    if (!quizId && !templateId) {
      return false;
    }
    this.isApiError = false;
    this.souceId = this.souceId ? this.souceId : '';
    if(this.templateId){
      this.router.navigate(['quiz/automation-report'], { queryParams: { templateId: templateId, StartDate: this.selectedDated.startDate, EndDate: this.selectedDated.endDate }, preserveQueryParams: false });
    }else if (this.souceId) {
      this.router.navigate(['quiz/automation-report'], { queryParams: { QuizId: quizId, SourceId: this.souceId, StartDate: this.selectedDated.startDate, EndDate: this.selectedDated.endDate }, preserveQueryParams: false });
    } else {
      this.router.navigate(['quiz/automation-report'], { queryParams: { QuizId: quizId, StartDate: this.selectedDated.startDate, EndDate: this.selectedDated.endDate }, preserveQueryParams: false });
    }
    this.reportDetails = {
      "Questions": [],
      "Results": [],
      "Stages": [],
      "TopRecordsDetails":[]
    };
    this.questionReport = [];
    this.npsScoreDetails = [];
    this.detractorCount = '';
    this.passiveCount = '';
    this.promoterCount = '';
    this.npsScore = '';
    this.isNoData = false;
    if(this.templateId){
      if(this.QuizTypeId && this.QuizTypeId > 1){
        this.quizBuilderApiService.getQuizTemplateReport(templateId, this.selectedDated.startDate ? this.selectedDated.startDate : null, this.selectedDated.endDate ? this.selectedDated.endDate : null , this.ResultId ? this.ResultId : null).subscribe((data) => {
          this.getResponse(data);
        },(error)=>{
          this.isApiError = true;
        });
      }
      if (this.QuizTypeId && this.QuizTypeId == 1) {
        this.quizBuilderApiService.getNPSTemplateReport(templateId, this.selectedDated.startDate ? this.selectedDated.startDate : null, this.selectedDated.endDate ? this.selectedDated.endDate : null , this.ResultId ? this.ResultId : null,this.chatView).subscribe((data) => {
          this.getResponse(data);
        },(error)=>{
          this.isApiError = true;
        });
      }
    }else{
      if (this.QuizTypeId && this.QuizTypeId > 1) {
        this.quizBuilderApiService.getQuizReport(quizId, this.souceId, this.selectedDated.startDate ? this.selectedDated.startDate : null, this.selectedDated.endDate ? this.selectedDated.endDate : null, this.ResultId ? this.ResultId : null).subscribe((data) => {
          this.getResponse(data);
        },(error)=>{
          this.isApiError = true;
        });
      }
      if (this.QuizTypeId && this.QuizTypeId == 1) {
        this.quizBuilderApiService.getNPSAutomationReport(quizId, this.souceId, this.selectedDated.startDate ? this.selectedDated.startDate : null, this.selectedDated.endDate ? this.selectedDated.endDate : null, this.ResultId ? this.ResultId : null,this.chatView).subscribe((data) => {
          this.getResponse(data);
        },(error)=>{
          this.isApiError = true;
        });
      }
    }
  }

  getResponse(data) {
    if (data && data.Stages.length > 0 && data.Stages[0].Value > 0) {
      this.reportDetails = data;
    } else {
      this.isNoData = true;
      this.reportDetails = {
        "Questions": [],
        "Results": [],
        "Stages": [],
        "TopRecordsDetails": []
      };
    }
    if (data && data.QuizTitle) {
      this.quizTitle = data.QuizTitle;
    }
    if (data && data.QuizType) {
      this.QuizTypeId = data.QuizType;
    }
    if (data && data.TemplateName) {
      this.templateName = data.TemplateName;
    }
    if (this.QuizTypeId && this.QuizTypeId == 1) {
      this.detractorCount = data.DetractorResultCount;
      this.passiveCount = data.PassiveResultCount;
      this.promoterCount = data.PromoterResultCount;
      this.npsScore = Math.round(data.NPSScore * 100) / 100;
      this.npsScoreDetails= data.NPSScoreDetails;
   }
    this.getColumnWithRoatedChart();
    this.getResultChart();
    this.questionReport = data.Questions;
    this.topRecordsDetails = data.TopRecordsDetails;
    if(this.topRecordsDetails && this.topRecordsDetails.length > 0){
      this.topRecordsDetails.map(topRecord => {
        topRecord.isActive = false;
      });
      this.topRecordsDetails[0].isActive = true;
    }
    if(data.TopRecordsDetails && data.TopRecordsDetails.length > 0){
      this.selectedResultTopThings = data.TopRecordsDetails[0];
    }
    this.getAnswerDate();
    this.getRatingPieChart();
  }

  getQuizDetail(quizId?) {
    this.quizBuilderApiService.getQuizDetails(quizId).subscribe((data) => {
      this.QuizTypeId = data.QuizTypeId;
      this.getReportDetail(quizId);
    },(error)=>{
      this.isApiError = true;
    });
  }

  getTemplateDetail(tempId?){
    this.quizBuilderApiService.getTemplateQuizDetails(tempId).subscribe((data) => {
      this.QuizTypeId = data.QuizType;
      this.getReportDetail('',this.templateId);
    },(error)=>{
      this.isApiError = true;
    });
  }

  getColumnWithRoatedChart() {
    if (this.reportDetails && this.reportDetails.Stages && this.reportDetails.Stages.length) {
      this.reportDetails.Stages.map(stageData => {
        if (stageData.Id == columnChartEnum.Sent) {
          if(this.language && this.language == 'en-US'){
            stageData.category = "Sent";
          }else{
            stageData.category = "Verzonden";
          }
          stageData.value = stageData.Value;
        } else if (stageData.Id == columnChartEnum.Views) {
          if(this.language && this.language == 'en-US'){
            stageData.category = "Views";
          }else{
            stageData.category = "Bekeken";
          }
          stageData.value = stageData.Value;
        } else if (stageData.Id == columnChartEnum.Starts) {
          if(this.language && this.language == 'en-US'){
            stageData.category = "Started";
          }else{
            stageData.category = "Gestart";
          }
          stageData.value = stageData.Value;
        } else if (stageData.Id == columnChartEnum.Result) {
          if(this.language && this.language == 'en-US'){
            stageData.category = "Completed";
          }else{
            stageData.category = "Afgerond";
          }
          stageData.value = stageData.Value;
        } else if (stageData.Id == columnChartEnum.Leads) {
          stageData.category = "Leads";
          stageData.value = stageData.Value;
        }
        if (stageData.Id == columnChartEnum.Leads && stageData.value == 0) {
          let index: number = this.reportDetails.Stages.indexOf(stageData.Id);
          this.reportDetails.Stages.splice(index, 1);
        }
      });
    }
  }

  getRatingPieChart(){
    if (this.questionReport && this.questionReport.length > 0) {
      this.questionReport.map(ques => {
        if(ques.QuestionType == this.questionTypeEnum.ratingEmoji || ques.QuestionType == this.questionTypeEnum.ratingStar){
          ques.Answers.map(ans => {
            if(ans.AnswerText == '1'){
              ans.AnswerText = ques.OptionTextforRatingTypeQuestions.OptionTextforRatingOne === null ? (this.language == 'en-US' ? 'Very dissatisfied' : 'Zeer ontevreden') : ques.OptionTextforRatingTypeQuestions.OptionTextforRatingOne;
            }else if(ans.AnswerText == '2'){
              ans.AnswerText = ques.OptionTextforRatingTypeQuestions.OptionTextforRatingTwo === null ? (this.language == 'en-US' ? 'Dissatisfied' : 'Ontevreden') : ques.OptionTextforRatingTypeQuestions.OptionTextforRatingTwo;
            }else if(ans.AnswerText == '3'){
              ans.AnswerText = ques.OptionTextforRatingTypeQuestions.OptionTextforRatingThree === null ? (this.language == 'en-US' ? 'Neutral' : 'Neutraal') : ques.OptionTextforRatingTypeQuestions.OptionTextforRatingThree;
            }else if(ans.AnswerText == '4'){
              ans.AnswerText = ques.OptionTextforRatingTypeQuestions.OptionTextforRatingFour === null ? (this.language == 'en-US' ? 'Satisfied': 'Tevreden') : ques.OptionTextforRatingTypeQuestions.OptionTextforRatingFour;
            }else if(ans.AnswerText == '5'){
              ans.AnswerText = ques.OptionTextforRatingTypeQuestions.OptionTextforRatingFive === null ? (this.language == 'en-US' ? 'Very satisfied': 'Zeer tevreden') : ques.OptionTextforRatingTypeQuestions.OptionTextforRatingFive;
            }
          });
        }else if(ques.QuestionType == this.questionTypeEnum.availability){
          ques.Answers.map(ans => {
            if(ans.AnswerText == '1'){
              ans.AnswerText = 'Immediately';
            }else if(ans.AnswerText == '2'){
              ans.AnswerText = 'Within 3 months';
            }else if(ans.AnswerText == '3'){
              ans.AnswerText = 'After 3 months';
            }
          });
        }
        if(ques.QuestionType == this.questionTypeEnum.ratingEmoji || ques.QuestionType == this.questionTypeEnum.ratingStar || ques.QuestionType == this.questionTypeEnum.availability){
          if(ques.Comments && ques.Comments.length > 0){
            ques.Comments.map(comment => {
              comment.CompletedOn = this.formatTimeSlotUtcToLocal(comment.CompletedOn.split("T")[0], comment.CompletedOn.split("T")[1]);
              if(ques.QuestionType == this.questionTypeEnum.availability){
                if(comment.AnswerText == '1'){
                  comment.AnswerText = 'Immediately';
                }else if(comment.AnswerText == '2'){
                  comment.AnswerText = 'Within 3 months';
                }else if(comment.AnswerText == '3'){
                  comment.AnswerText = 'After 3 months';
                }
                comment.Comment =  comment.Comment ? moment(comment.Comment).format('MM/DD/YYYY') : '';
              }else{
                comment.AnswerText = parseInt(comment.AnswerText);
              }
            });
          }
        }
      });
    }
  }

  getResultChart() {
    if (this.reportDetails && this.reportDetails.Results.length > 0) {
      this.reportDetails.Results.map(res => {
        if (res.ParentResultId == 0) {
          res.InternalResultTitle = 'No result.'
        }
        if (res.ParentResultId == 0 && res.Value == 0) {
          let index: number = this.reportDetails.Results.indexOf(res.ParentResultId);
          this.reportDetails.Results.splice(index, 1);
        }
      });
    }
  }

  getAnswerDate() {
    if (this.questionReport && this.questionReport.length > 0) {
      this.questionReport.map(ques => {
        if (ques.Answers && ques.Answers.length > 0) {
          ques.Answers.map(ans => {
            if (ans.AnswerText) {
              ans.AnswerText = filterPipe.transform(ans.AnswerText);
            }
            if (ans.CompletedOn) {
              ans.CompletedOn = this.formatTimeSlotUtcToLocal(ans.CompletedOn.split("T")[0], ans.CompletedOn.split("T")[1]);
            }
          });
        }
        if(ques.NPSScore){
          ques.NPSScore = Math.round(ques.NPSScore * 100) / 100;
        }
        if(ques.AVGScore){
          ques.AVGScore = Math.round(ques.AVGScore * 100) / 100;
        }
      });
    }
  }

  onFreeText(questionDetail) {
    this.freeTextTemplate.clear();
    var FREE_TEXTTemplate = this._crf.resolveComponentFactory(
      FreeTextQuestionComponent
    );
    var FREE_TEXTComponentRef = this.freeTextTemplate.createComponent(
      FREE_TEXTTemplate
    );
    FREE_TEXTComponentRef.instance.questionDetail = questionDetail;
  }

  startResultFilter() {
    this.showOptionsForFilter = true;
  }

  selectResultToFilter(list) {
    this.showOptionsForFilter = false;
    this.selectedResult = list.InternalResultTitle;
    this.ResultId = list.ParentResultId;
    this.getReportDetail(this.quizId,this.templateId);
  }
  allSelectResult() {
    this.showOptionsForFilter = false;
    this.selectedResult = this.language == 'en-US' ? 'All' : 'Alle';
    this.ResultId = '';
    this.getReportDetail(this.quizId,this.templateId);
  }

  onChangeNpsScoreDetail(tab){
    this.tab = tab;
    if(tab == 'tab_1'){
      this.chatView = 1;
    }else if(tab == 'tab_2'){
      this.chatView = 2;
    }else if(tab == 'tab_3'){
      this.chatView = 3;
    }else{
      this.chatView = 4;
    }
    this.getReportDetail(this.quizId,this.templateId);
  }

  scrollTo(className: string): void {
    const elementList = document.querySelector(className);
    const element = elementList as HTMLElement;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  formatTimeSlotUtcToLocal(date: string, time: string) {
    let userTimeZone: string = moment.tz.guess();
    let currUtcTime: string = `${date} ${time}Z`;
    let completeDate = date + 'T' + moment(currUtcTime).tz(userTimeZone).format('HH:mm:ss');
    return moment(completeDate).format('DD.MM.YYYY');
  }

  onSelectInsightTab(data){
    this.insightsTabList.map(list => {
      if(list.id == data.id){
        this.selectedInsightId = data.id;
        list.isActive = true;
      }else{
        list.isActive = false;
      }
    });
  }

  onSelectTopRecordsDetails(data){
  this.selectedResultTopThings = data;
  this.topRecordsDetails.map(topRecord => {
    if(data.ParentResultId == topRecord.ParentResultId){
      topRecord.isActive = true;
    }else{
      topRecord.isActive = false;
    }
  });
  }

  ngOnDestroy() {
    this.shareConfigService.automationReportSuggestionFilteredData = {};
    this.shareConfigService.changeAutomationReportSuggestionFilteredData();
    this.quizDataService.selectedDateInAutomationReport = {};
    this.quizDataService.changeSelectedDateInAutomationReport();
    if (this.automationReportSelectedDated) {
      this.automationReportSelectedDated.unsubscribe();
    }
    if (this.automationReportSuggestionFilteredDataSubscription) {
      this.automationReportSuggestionFilteredDataSubscription.unsubscribe();
    }
  }

}

