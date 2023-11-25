import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  Inject,
  Renderer2,
  OnDestroy
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { QuizzToolHelper } from "./quiz-tool-helper.service";
import { ReorderQuestionsComponent } from "./reorder-questions/reorder-questions.component";
import { QuizBuilderApiService } from "../quiz-builder-api.service";
import { RedirectResultsComponent } from "./redirect-results/redirect-results.component";
import { BranchingLogicAuthService } from "./branching-logic-auth.service";
import { NotificationsService } from "angular2-notifications";
import "rxjs/add/operator/skip";
import { DOCUMENT } from "@angular/common";
import { Subscription } from "rxjs/Subscription";
import { ResultRangeDataFactory } from "./quiz-data-factory";
import { QuizToolData } from "./quiz-tool.data";
import { SharedService } from "../../shared/services/shared.service";
import { QuizBuilderDataService } from '../quiz-builder-data.service';
import { OfficeCompanyComponent } from '../edit-quiz/office-company/office-company.component';
import { BrandingComponent } from './branding/branding.component';
import { PreviousQuestionComponent } from './previous-question/previous-question.component';
import { AttachmentsComponent } from './attachments/attachments.component';
import { DynamicMediaReplaceMentsService } from './dynamic-media-replacement';
import { ShareQuizComponent } from '../share-quiz/share-quiz.component';
import { UserInfoService } from "../../shared/services/security.service";
import { DetectBranchingLogicAuthService } from "./detect-branching-logic-auth.service";
import { BranchingLogicEnum, quizTypeEnum } from "./commonEnum";

@Component({
  selector: "app-quiz-tool",
  templateUrl: "./quiz-tool.component.html",
  styleUrls: ["./quiz-tool.component.css"],
  providers: [ResultRangeDataFactory]
})
export class QuizToolComponent implements OnInit, OnDestroy {
  @ViewChild("questionReorderTemplate", { read: ViewContainerRef, static: true })
  questionReorderTemplate: ViewContainerRef;
  @ViewChild("resultRedirectTemplate", { read: ViewContainerRef, static: true })
  resultRedirectTemplate: ViewContainerRef;
  @ViewChild("quizAccessibility", { read: ViewContainerRef, static: true })
  quizAccessibility: ViewContainerRef;
  @ViewChild("quizStyle", { read: ViewContainerRef, static: true })
  quizStyle: ViewContainerRef;
  @ViewChild("quizAttemptsSettings", { read: ViewContainerRef, static: true })
  quizAttemptsSettings: ViewContainerRef;
  @ViewChild("quizAttachments", { read: ViewContainerRef, static: true })
  quizAttachments: ViewContainerRef;
  @ViewChild("shareQuizTemplate", { read: ViewContainerRef, static:true })
  shareQuizTemplate: ViewContainerRef;
  // @ViewChild("result") result :ViewContainerRef;
  public questionDivisionArray = [];
  public quizId: number;
  public quizData: any = {};
  public sub;
  public answerAddedToListSubscription;
  public answerRemovedToListSubscription;
  public questionTitleChangeSubscription;
  public resultTitleChangeSubscription;
  public coverTitleChangeSubscription;
  private bodyTemplate;
  public MaxScoreSubscription;
  public minimum;
  public maximum;
  public updatedRange;
  public quizID;
  public highest;
  public lowest;
  public open: number;
  public checked: boolean = false;
  public count: number = 0;
  public status: number = 0;
  public defaltImage:any="assets/layouts/img/default-image.png";
  public alfaLatter:any="assets/layouts/img/A-letter.png";
  public quizSettingIcon:any="assets/layouts/img/quizsetting-icon.png";
  public activeTab:any;
  public hoverOnTitle: any = {};
  public isQuizConfigrationSubscription: Subscription;
  public isSidebarOpen:boolean;
  private isOpenDynamicMediaSubscription: Subscription;
  public questionCount:number = 0;
  public contentCount:number = 0;
  public isQuesAndContentInSameTable:boolean;
  private isQuestionUpdateSubscription: Subscription;
  public userInfo: any= {};
  public language;
  public isELearningPermission :boolean = false;
  public isEnabled: boolean = false;
  public isWhatsappEnable: boolean = false;
  private isWhatsappEnableSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private quizBuilderApiService: QuizBuilderApiService,
    private quizzToolHelper: QuizzToolHelper,
    private _crf: ComponentFactoryResolver,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private branchingLogicAuthService: BranchingLogicAuthService,
    private detectBranchingLogicAuthService: DetectBranchingLogicAuthService,
    private notificationsService: NotificationsService,
    private router: Router,
    private resultRangeDataFactory: ResultRangeDataFactory,
    private quizToolData: QuizToolData,
    private sharedService: SharedService,
    private quizBuilderDataService:QuizBuilderDataService,
    private dynamicMediaReplaceService:DynamicMediaReplaceMentsService,
    private userInfoService: UserInfoService
  ) {
    this.userInfo =  this.userInfoService._info;
    this.quizBuilderDataService.changeQuizHeader("QuizHeader");
    this.quizData = this.route.snapshot.data["quizData"];
    this.getQuizUsageType();
    this.dataToSanitize()
    this.branchingLogicAuthService.setBranchingLogicEnable(
      this.quizData.IsBranchingLogicEnabled
    );
    this.detectBranchingLogicAuthService.setDetectBranchingLogicAuthService(this.quizData.IsBranchingLogicEnabled);
    this.setQuizTypeId();
    /**
     * to get the QuizId via routing params
     */
    this.sub = this.route.params.subscribe(params => {
      this.quizId = +params["id"];
    });

    this.saveQuizDataToService();
  }

  getQuizUsageType(){
    if(this.quizData && this.userInfo && this.userInfo.IsWebChatbotPermission){
      if(this.quizData.usageType && this.quizData.usageType.includes(3)){
        this.isWhatsappEnable = true;
        if(this.quizData.QuizTypeId == quizTypeEnum.Nps){
          if(window.location.href.includes('cover')){
            this.reDirectPage();
          }
        }else{
          if(!this.quizData.IsBranchingLogicEnabled){
            this.onClickedEnable();
          }else{
            this.router.navigate(['/quiz-builder/quiz-tool',this.quizData.QuizId,'branching-logic'])
          }
        }
      }else{
        this.isWhatsappEnable = false;
      }
    }
  }

  dataToSanitize() {
    this.quizData.QuizTitle = this.sharedService.sanitizeData(this.quizData.QuizTitle);
    if(this.quizData.QuestionAndContent)
    {
    this.quizData.QuestionAndContent.forEach(element => {
      if(element.QuestionTitle){
      element.QuestionTitle = this.sharedService.sanitizeData(element.QuestionTitle);
      }
      element.isquestion = false;
    });
  }
    if(this.quizData.Results)
    {
    this.quizData.Results.forEach(element => {
      if(element.InternalTitle){
      element.InternalTitle = this.sharedService.sanitizeData(element.InternalTitle);     
     }
    });
  }
    if(this.quizData.QuestionAndContent)
    {
    this.quizData.QuestionAndContent.forEach(element => {
      if(element.ContentTitle){
      element.ContentTitle = this.sharedService.sanitizeData(element.ContentTitle);
      }
    });
  }
  if(this.quizData.Badge)
  {
    this.quizData.Badge.forEach(element => {
      if(element.Title){
      element.Title = this.sharedService.sanitizeData(element.Title);
      }
    });
    }
    if(this.quizData.Action)
    {
    this.quizData.Action.forEach(element => {
      if(element.Title){
      element.Title = this.sharedService.sanitizeData(element.Title);
      }
    });
  }
  }
  /** Save Quiz Data to Service */
  saveQuizDataToService() {
    let quizData = this.route.snapshot.data["quizData"]
    this.quizToolData.setQuizData(quizData);
  }

  /**
   * settin Quiz TypID For Set Correct Answer
   */
  setQuizTypeId() {
    this.quizzToolHelper.quizTypeId = this.quizData.QuizTypeId;
  }

  /**
   * Create Question/Answer reorder template
   *
   */
  dynamicTemplateReorder() {
    this.questionReorderTemplate.clear();
    var QA_reorderTemplate = this._crf.resolveComponentFactory(
      ReorderQuestionsComponent
    );
    var QA_reorderComponentRef = this.questionReorderTemplate.createComponent(
      QA_reorderTemplate
    );
    QA_reorderComponentRef.instance.quizData = this.quizData;
  }

  /**
   * Create Results Redirect Template
   */
  dynamicTemplateRedirect() {
    this.resultRedirectTemplate.clear();
    var RES_redirectTemplate = this._crf.resolveComponentFactory(
      RedirectResultsComponent
    );
    var RES_redirectComponentRef = this.resultRedirectTemplate.createComponent(
      RES_redirectTemplate
    );
    RES_redirectComponentRef.instance.quizData = this.quizData;
  }

  ngOnInit() {
    this.getWhatsappUsage();
    this.listenAnswerTypeChangeAndUpdate();
    this.changeStyle();
    this.addAnswerToAnswerListSubscription();
    this.removeAnswerToAnswerListSubscription();
    this.listenQuestionTitleChangeAndUpdateSubscription();
    this.listenResultTitleChangeAndUpdateSubscription();
    this.listenCoverTitleChangeAndUpdateSubscription();
    this.listenActionTitleChangeAndUpdateSubscription();
    this.listenContentTitleChangeAndUpdateSubscription();
    this.listenBadgeTitleChangeAndUpdateSubscription();
    this.listenOptionDataSubjectChange();
    this.getQuizConfigrationTab();
    // this.resultRangeDataFactory.updateResultRangedata();
    this.resultRangeDataFactory.setQuizData();
    this.setUpdatedQuizData(this.quizData);
    if (this.quizData.Results[0]) {
      this.minimum = this.quizData.Results[0].MinScore;
    }
    if (this.quizData.Results[this.quizData.Results.length - 1]) {
      this.maximum = this.quizData.Results[
        this.quizData.Results.length - 1
      ].MaxScore;
    }
    this.MaxScoreSubscription = this.quizzToolHelper.updatedMaxScore.subscribe(
      data => {
        this.maximum = data[0];
        this.minimum = data[1];
      }
    );
    // this.gettingQuizDetails();
    //Experiment
    if (this.quizData.QuizTypeId == quizTypeEnum.Score || this.quizData.QuizTypeId == 6) {
      this.updatedRange = this.quizzToolHelper.updatedResultRange
        .skip(1)
        .subscribe(data => {
          this.quizBuilderApiService
            .getQuizDetails(this.route.snapshot.params.id)
            .subscribe(data => {
              this.quizID = [];
              if(data.QuestionAndContent && data.QuestionAndContent.length > 0){
                data.QuestionAndContent.map(quesContant => {
                  if(quesContant.Type == 2){
                    this.quizID.push(quesContant);
                  }
                });
              }
              this.settingResultRange();
            });
        });
    }
    this.open = this.quizData.MultipleResultEnabled;
    this.openMultiple();
    this.quizzToolHelper.setBrandingAndStyling(this.route.snapshot.data["brandingAndStyling"]);
    this.getOpenDynamicMediaSetting();
    this.getQuestionAndContentCount();
    this.isQuesAndContentInSameTable = this.quizData.IsQuesAndContentInSameTable;
    if(this.isQuesAndContentInSameTable){
       this.getUpdateQuestion();
    }
    if(this.userInfo)
    {
      this.language = this.userInfo.ActiveLanguage;
    }
    this.isELearningPermission = this.userInfo.IsManageElearningPermission;
  }

  getUpdateQuestion(){
    this.isQuestionUpdateSubscription = this.dynamicMediaReplaceService.isSelectedQuesAndContentObservable.subscribe(text => {
      if(text && Object.keys(text).length != 0 && this.isQuesAndContentInSameTable){
        if(this.quizData.QuestionAndContent && this.quizData.QuestionAndContent.length > 0){
          this.quizData.QuestionAndContent.map(data => {
            if(data.QuestionId == text.questionId){
              if(text.type == 2){
                if(data.Type != 2){
                  data.Type = 2;
                  this.questionCount = this.questionCount + 1;
                  if (this.quizData.QuizTypeId == quizTypeEnum.Assessment || this.quizData.QuizTypeId == 5) {
                    this.quizzToolHelper.updateSidebarResultRange.next("Add-Question");
                  }else if(this.quizData.QuizTypeId == quizTypeEnum.Score || this.quizData.QuizTypeId == 6) {
                    this.quizzToolHelper.updatedResultRange.next("");
                  }                
                }
              }else{
                if(data.Type != 6){
                  data.Type = 6;
                  if(this.questionCount > 0){
                    this.questionCount = this.questionCount - 1;
                  }
                  if (this.quizData.QuizTypeId == quizTypeEnum.Assessment || this.quizData.QuizTypeId == 5) {
                    this.quizzToolHelper.updateSidebarResultRange.next("Remove-Question");
                  }else if (this.quizData.QuizTypeId == quizTypeEnum.Score || this.quizData.QuizTypeId == 6) {
                    this.quizzToolHelper.updatedResultRange.next("");
                  }            
                }
              }
            }
          });
        }
      }
    });
  }

  getOpenDynamicMediaSetting(){
    this.isOpenDynamicMediaSubscription = this.dynamicMediaReplaceService.isOpenEnableMediaSetiingObservable.subscribe(data=>{
     this.isSidebarOpen = data.isOpen;
    });
 }

  getQuizConfigrationTab(){
    this.isQuizConfigrationSubscription = this.quizBuilderDataService.isQuizConfigurationMenuSubmissionObservable.subscribe((item: any) => {
      this.activeTab = item?item:"Slides";
      if(this.activeTab=="Styles"){
        this.onStyleing();
      }
    });
  }

  // open Multiple Result Component Accordingly
  openMultiple() {
    if (this.open > 0) {
      this.status = 0;
      this.count++;
      if (this.open == 1) {
        this.status = 1;
        this.checked = true;
        this.open = 3;
      } else {
        this.status = 3;
        this.checked = false;
        this.open = 1;
        if (this.count > 1) {
          this.router.navigate(["cover"], { relativeTo: this.route });
        }
      }
      if (this.count != 1) {
        this.quizBuilderApiService
          .updatePersonalityResultStatus(this.quizId, this.status)
          .subscribe(data => {
            this.notificationsService.success(
              "Multiple-Result",
              "Multiple result enable option has been changed"
            )
            if (this.status == 1) {
              this.router.navigate(["show-multiple-results"], {
                relativeTo: this.route
              });
            }
          }, (error) => {
            this.notificationsService.error('Error');
          });
      }
    }
  }

  settingResultRange() {
    // this.highest = this.quizID[0].Answers[0].AssociatedScore;
    // this.lowest = this.quizID[0].Answers[0].AssociatedScore;
    // var high = this.quizID[0].Answers[0].AssociatedScore;
    // var low =  this.quizID[0].Answers[0].AssociatedScore;
    this.highest = 0;
    this.lowest = 0;
    for (var i = 0; i < this.quizID.length; i++) {
      var high = 0;
      var low = 0;
      var previousHigh:any = 0;
      var previousLow = 0;
      var array = this.quizID[i].Answers;
      array.sort(function (a, b) {
        return a.AssociatedScore - b.AssociatedScore;
      });
      var MaxiAnswer = this.quizID[i].MaxAnswer;
      var MiniAnswer = this.quizID[i].MinAnswer;

      var len = array.length;
      for (var k = 0; k < MaxiAnswer; k++) {
        len = len - 1;
        if(len >= 0){
          previousHigh = previousHigh + array[len].AssociatedScore;
          if (k >= MiniAnswer) {
            if (previousHigh > high) {
              high = previousHigh;
            }
            else {
              break;
            }
          }
          else {
            high = previousHigh;
          }
        }
      }

      for (var k = 0; k < MaxiAnswer; k++) {
        previousLow = previousLow + array[k].AssociatedScore;
        if (k >= MiniAnswer) {
          if (previousLow < low) {
            low = previousLow;
          }
          else {
            break;
          }
        }
        else {
          low = previousLow;
        }
      }


      this.highest = this.highest + high;
      this.lowest = this.lowest + low;
    }
    var ar = [this.highest, this.lowest];

    //Used For disabling Add Another Result Button
    this.quizzToolHelper.updatedMaxScore.next(ar);
    if (this.quizData.Results.length <= this.highest - this.lowest + 1) {
      this.quizData.Results[0].MinScore = this.lowest;
      this.quizData.Results[0].MaxScore =
        this.highest - (this.quizData.Results.length - 1);
      // this.quizData.Results[this.quizData.Results.length-1].MaxScore = this.highest;
      for (var j = this.quizData.Results.length - 1; j > 0; j--) {
        this.quizData.Results[j].MaxScore = this.quizData.Results[
          j
        ].MinScore = this.highest;
        this.highest--;
      }
    } else {
      this.adjustResultRangeWhenMoreResultExist(
        this.quizData.Results,
        this.highest,
        this.lowest
      );
    }
    let resultRangeBody = {
      QuizId: this.quizData.QuizId,
      Results: this.quizData.Results
    };

    this.quizBuilderApiService
      .updateResultRangeData(resultRangeBody)
      .subscribe(data => { });
    //   let reCreatedResultRange=[];
    //  let curResultRange = {
    //     MinScore: +this.lowest,
    //     MaxScore: +this.highest
    //   };
    //   reCreatedResultRange.push(curResultRange);
    //   this.datachange.emit(reCreatedResultRange);
  }

  adjustResultRangeWhenMoreResultExist(resultData, highest, lowest) {
    var scoreCount = highest - lowest + 1;
    for (let i = 0; i < scoreCount; i++) {
      this.quizData.Results[i].MaxScore = this.quizData.Results[
        i
      ].MinScore = lowest;
      lowest++;
    }
    for (let j = scoreCount; j < resultData.length; j++) {
      this.quizData.Results[j].MaxScore = this.quizData.Results[
        j
      ].MinScore = null;
    }
  }
  // subscribing new

  changeStyle() {
    this.bodyTemplate = this.document.body;
    this.renderer.setStyle(this.bodyTemplate, "overflow", "hidden");
  }

  /**
   * Function to listen to title change in question component. When user changes
   * the title it should update the options in the sidebar dynamically
   */
  listenQuestionTitleChangeAndUpdateSubscription() {
    this.questionTitleChangeSubscription = this.quizzToolHelper.updateSidebarOptionsQuestionTitle
      .skip(1)
      .subscribe(
        quesTitleObject => {
          if (quesTitleObject && quesTitleObject.QuestionTitle) {
            quesTitleObject.QuestionTitle = this.sharedService.sanitizeData(quesTitleObject.QuestionTitle);
          }
          if (quesTitleObject && quesTitleObject["QuestionId"]) {

            var questionList =
              typeof this.quizData.QuestionAndContent == "object"
                ? this.quizData.QuestionAndContent
                : false;
            if (questionList) {
              questionList.find(
                question =>
                  question.QuestionId === quesTitleObject["QuestionId"]
              ).QuestionTitle = quesTitleObject["QuestionTitle"];
            } else {
              console.warn("Error! Received a non array object for questions");
            }
          }
        },
        error => { }
      );
  }

  /**
   * Function to listen to title change in result component. When user changes
   * the title it should update the options in the sidebar dynamically
   */
  listenResultTitleChangeAndUpdateSubscription() {
    this.resultTitleChangeSubscription = this.quizzToolHelper.updateSidebarOptionsResultTitle
      .skip(1)
      .subscribe(resultTitleObject => {

        if (resultTitleObject && resultTitleObject.Title) {
          resultTitleObject.Title = this.sharedService.sanitizeData(resultTitleObject.Title)
        }
        if (resultTitleObject && resultTitleObject.ResultId) {
          var resultList =
            typeof this.quizData.Results == "object"
              ? this.quizData.Results
              : false;
          if (resultList) {
            resultList.find(
              result => result.ResultId === resultTitleObject.ResultId
            ).InternalTitle = resultTitleObject.Title;
          } else {
            console.warn("Error! Received a non array object for results");
          }
        }
      });
  }

  /**
   * Function to listen to title change in cover component. When user changes
   * the title it should update the options in the sidebar dynamically
   */
  listenCoverTitleChangeAndUpdateSubscription() {
    this.coverTitleChangeSubscription = this.quizzToolHelper.updateSidebarOptionsCoverTitle
      .skip(1)
      .subscribe(coverTitle => {
        this.quizData.QuizTitle = this.sharedService.sanitizeData(coverTitle);
      });
  }

  public actionTitleChangeSubscription: Subscription;
  /**
   * Function to listen to title change in action component. When user changes
   * the title it should update the options in the sidebar dynamically
   */
  listenActionTitleChangeAndUpdateSubscription() {
    this.actionTitleChangeSubscription = this.quizzToolHelper.updateSidebarOptionsActionTitle
      .skip(1)
      .subscribe(actionObject => {
        if (actionObject && actionObject.Id) {
          var actionList =
            typeof this.quizData.Action == "object"
              ? this.quizData.Action
              : false;
          if (actionList) {
            actionList.find(action => action.Id === actionObject.Id).Title =
              actionObject.Title;
          } else {
            console.warn("Error! Received a non array object for results");
          }
        }
      });
  }

  public contentTitleChangeSubscription: Subscription;
  /**
   * Function to listen to title change in content component. When user changes
   * the title it should update the options in the sidebar dynamically
   */
  listenContentTitleChangeAndUpdateSubscription() {
    this.contentTitleChangeSubscription = this.quizzToolHelper.updateSidebarOptionsContentTitle
      .skip(1)
      .subscribe(contentObject => {
        if (contentObject && contentObject.Title) {
          contentObject.Title = this.sharedService.sanitizeData(contentObject.Title);
        }
        if (contentObject && contentObject.Id) {
          var contentList =
            typeof this.quizData.QuestionAndContent == "object"
              ? this.quizData.QuestionAndContent
              : false;
          if (contentList) {
            contentList.find(
              action => action.Id === contentObject.Id
            ).ContentTitle = contentObject.Title;
          } else {
            console.warn("Error! Received a non array object for results");
          }
        }
      });
  }

  public BadgeTitleChangeSubscription: Subscription;
  /**
   * Function to listen to title change in Badge component. When user changes
   * the title it should update the options in the sidebar dynamically
   */
  listenBadgeTitleChangeAndUpdateSubscription() {
    this.BadgeTitleChangeSubscription = this.quizzToolHelper.updateSidebarOptionsBadgeTitle
      .skip(1)
      .subscribe(BadgeObject => {
        if (BadgeObject && BadgeObject.Title) {
          BadgeObject.Title = this.sharedService.sanitizeData(BadgeObject.Title);
        }
        if (BadgeObject && BadgeObject.Id) {
          var BadgeList =
            typeof this.quizData.Badge == "object"
              ? this.quizData.Badge
              : false;
          if (BadgeList && BadgeList.length > 0) {
            BadgeList.find(Badge => Badge.Id === BadgeObject.Id).Title =
              BadgeObject.Title;
          } else {
            console.warn("Error! Received a non array object for results");
          }
        }
      });
  }

  // public isDataLive: boolean = false;
  public selectedQuestion: object = {};
  public selectedAnswerTypeSubscription: Subscription;
  /**
   * Function call when answer type has been changed.
   */
  listenAnswerTypeChangeAndUpdate() {
    this.selectedAnswerTypeSubscription = this.quizzToolHelper.selectedAnswerType
      .skip(1)
      .debounceTime(1)
      .subscribe(data => {
        if (data) {
          this.selectedQuestion = data;
        }
      });
  }

  /**
   * Subscription when user Adds a answer
   * the answer is pushed to the respective Question Array
   */
  private addAnswerToAnswerListSubscription() {
    this.answerAddedToListSubscription = this.quizzToolHelper
      .whenUpdateAnswerAdded()
      .subscribe((data: { answer: any; questionId: any }) => {
        this.pushAnswerToQuestion(data);
      });
  }

  /**
   * Subscription when user removes an answer
   * the answer is removed from the respective Question Array
   */
  private removeAnswerToAnswerListSubscription() {
    this.answerRemovedToListSubscription = this.quizzToolHelper
      .whenUpdateAnswerRemoved()
      .subscribe((data: { questionId: any; answerIndex: any }) => {
        this.removeAnswerFromQuestion(data);
      });
  }

  /**
   * Function to push answer to the answer
   * @param data {answer:any, questionId:any}
   */
  private pushAnswerToQuestion(data: { answer: any; questionId: any }) {
    var questionId = data.questionId,
      answer = data.answer;
    for (var ques = 0; ques < this.quizData.QuestionAndContent.length; ques++) {
      var question = this.quizData.QuestionAndContent[ques],
        index = ques;
      if (question.QuestionId == questionId) {
        this.quizData.QuestionAndContent[ques].Answers.push(answer);
      }
    }
  }

  /**
   * @Called when
   * @param data {questionId:any,answerIndex:any}
   */
  private removeAnswerFromQuestion(data: {
    questionId: any;
    answerIndex: any;
  }) {
    var questionId = data.questionId,
      answerIndex = data.answerIndex;

    for (var ans = 0; ans < this.quizData.QuestionAndContent.length; ans++) {
      var question = this.quizData.QuestionAndContent[ans],
        index = ans;
      if (question.QuestionId == questionId) {
        this.quizData.QuestionAndContent[ans].Answers.splice(answerIndex, 1);
      }
    }
  }

  public optionDataChangeSubscription: Subscription;
  /**
   * listen and update dom acccording to data change when answerType change
   */
  listenOptionDataSubjectChange() {
    this.optionDataChangeSubscription = this.quizzToolHelper.optionDataSubject.subscribe(
      data => {
        var questionIndex = this.quizData.QuestionAndContent.findIndex(
          question => {
            return question.QuestionId == data.QuestionId;
          }
        );
        this.quizData.QuestionAndContent[questionIndex].Answers = data.AnswerList;
        this.quizData.QuestionAndContent[questionIndex].AnswerType = data.AnswerType;
      }
    );
  }

  /**
   * Function to Add Question to Quiz
   *
   */
  addQuestion(text:any) {
    let type = (text && text == 'content') ? 6 : 2;
    this.quizBuilderApiService.addQuestionQuiz(this.quizId,type,this.isWhatsappEnable).subscribe(
      data => {
        this.createQuestion(type,data);
      },
      error => { }
    );
  }

  duplicateQuestion(questionId){
    this.quizBuilderApiService.addDuplicateQuestionQuiz(this.quizId,questionId).subscribe(data => {
      if(data){
        this.createQuestion(data.Type,data);
        if (this.quizData.QuizTypeId == quizTypeEnum.Score) {
          this.quizBuilderApiService.getQuizDetails(this.route.snapshot.params.id)
            .subscribe(data => {
              this.quizID = [];
              if(data.QuestionAndContent && data.QuestionAndContent.length > 0){
                data.QuestionAndContent.map(quesContant => {
                  if(quesContant.Type == 2){
                    this.quizID.push(quesContant);
                  }
                });
              }
            this.settingResultRange();
          });
        }
      }
    });
  }

  createQuestion(type,data){
    if(type == 2){
      this.quizData.QuestionAndContent.push({
        Answers: data.AnswerList,
        DisplayOrder: data.DisplayOrder,
        QuestionId: data.QuestionId,
        QuestionTitle: data.QuestionTitle,
        ShowAnswerImage: data.ShowAnswerImage,
        Type : 2,
        isquestion:false,
        AnswerType : data.AnswerType
      });
      this.questionCount = this.questionCount + 1;
      // this.divideQuestionInResult(this.quizData);
      this.setUpdatedQuizData(this.quizData);
      if (this.quizData.QuizTypeId == quizTypeEnum.Assessment || this.quizData.QuizTypeId == 5) {
        this.quizzToolHelper.updateSidebarResultRange.next("Add-Question");
      }
    }else{
      this.quizData.QuestionAndContent.push({
        Answers: data.AnswerList,
        DisplayOrder: data.DisplayOrder,
        QuestionId: data.QuestionId,
        QuestionTitle: data.QuestionTitle,
        ShowAnswerImage: data.ShowAnswerImage,
        Type : 6,
        isquestion:false,
        AnswerType : data.AnswerType
      });
      this.contentCount = this.contentCount + 1;
    }
     this.router.navigate(['quiz-builder', 'quiz-tool', this.quizId, 'question', data.QuestionId]);
  }
  

  /**
   * Function to remove Question against questionId
   */
  removeQuestion(questionId, index, type?) {
    this.quizData.QuestionAndContent.splice(index, 1);
    if(this.questionCount > 0){
      this.questionCount = this.questionCount - 1;
    }
    this.setUpdatedQuizData(this.quizData);
    this.removeItemRedirectPage();

    this.quizBuilderApiService.removeQuestion(questionId).subscribe(
      data => {
        // if(this.quizData.QuizTypeId == 2 )
        if(!type || type != 6){
          if (this.quizData.QuizTypeId == quizTypeEnum.Assessment || this.quizData.QuizTypeId == 5) {
            this.quizzToolHelper.updateSidebarResultRange.next("Remove-Question");
          }
          if (this.quizData.QuizTypeId == quizTypeEnum.Score || this.quizData.QuizTypeId == 6) {
            this.quizzToolHelper.updatedResultRange.next("");
          }
        }
        // this.quizzToolHelper.updatedAnswerScoredData.next("");
      },
      error => { }
    );
  }

  /**
   * to Change Branching Logic enable option
   * Api Integration: UPdate Branching Logic enable State
   */
  onClickedEnable() {
    this.quizData.IsBranchingLogicEnabled = !this.quizData
      .IsBranchingLogicEnabled;
    this.quizBuilderApiService
      .updateBranchingLogicState(
        this.quizData.QuizId,
        this.quizData.IsBranchingLogicEnabled
      )
      .subscribe(
        data => {
          if(this.quizData.IsBranchingLogicEnabled){
            this.router.navigate(['/quiz-builder/quiz-tool',this.quizId,'branching-logic'])
          }
          this.branchingLogicAuthService.setBranchingLogicEnable(
            this.quizData.IsBranchingLogicEnabled
          );
          this.detectBranchingLogicAuthService.setDetectBranchingLogicAuthService(this.quizData.IsBranchingLogicEnabled);
            let branchingLogicNotification = this.language == 'en-US' ? "Branching logic" : "Boomstructuur";
            let branchingLogicNotification1 = this.language == 'en-US' ? "The branching logic setting has been changed." : "De boomstructuur optie is aangepast.";
          this.notificationsService.success(
            branchingLogicNotification,
            branchingLogicNotification1
          );
        },
        error => {
          this.notificationsService.error("Error");
        }
      );
  }

  /**
   * Function to Add Result against Quiz
   */
  addResults() {
    this.quizBuilderApiService.addResultToQuiz(this.quizId).subscribe(
      data => {
        this.createResult(data);
      },
      error => {
        this.notificationsService.error("Error");
      }
    );
  }

  onDuplicateResult(resultId){
    this.quizBuilderApiService.addDuplicateResultQuiz(this.quizId,resultId).subscribe(data => {
      if(data){
        this.createResult(data);
      }
    });
  }

  createResult(data){
    //pushing new result id to Quiz Results
    this.quizData.Results.push({
      ResultId: data.ResultId,
      InternalTitle: data.InternalTitle
    });
    // this.divideQuestionInResult(this.quizData);
    this.setUpdatedQuizData(this.quizData);
    this.quizzToolHelper.updateSidebarResultRange.next("Add-Result");
    this.quizzToolHelper.updateMultipleData.next("");
    this.router.navigate(['quiz-builder', 'quiz-tool', this.quizId, 'result', data.ResultId]);
  }

  addNewAction() {
    this.quizBuilderApiService.addNewAction(this.quizId).subscribe(
      data => {
        this.notificationsService.success("Success");
        this.quizData.Action.push({
          Id: data.Id,
          Title: data.Title
        });
      },
      error => {
        this.notificationsService.error("Error");
      }
    );
  }

  removeAction(id, index) {
    this.quizBuilderApiService.removeQuizAction(id).subscribe(
      data => {
        this.notificationsService.success("Success");
        this.quizData.Action.splice(index, 1);
      },
      error => {
        this.notificationsService.error("Error");
      }
    );
  }

  addContent() {
    this.quizBuilderApiService.addNewContent(this.quizId).subscribe(
      data => {
        this.notificationsService.success("Success");
        this.quizData.QuestionAndContent.push({
          Id: data.Id,
          ContentTitle: data.ContentTitle,
          Type : 6
        });
        this.contentCount = this.contentCount + 1;
        this.router.navigate(['quiz-builder', 'quiz-tool', this.quizId, 'content', data.Id]);
      },
      error => {
        this.notificationsService.error("Error");
      }
    );
  }
  removeContent(id, index) {
    this.quizBuilderApiService.removeQuizContent(id).subscribe(
      data => {
        this.notificationsService.success("Success");
        this.quizData.QuestionAndContent.splice(index, 1);
        if(this.contentCount > 0){
          this.contentCount = this.contentCount - 1;
        }
        this.removeItemRedirectPage();
      },
      error => {
        this.notificationsService.error("Error");
      }
    );
  }

  getQuestionAndContentCount(){
    this.questionCount = 0;
    this.contentCount = 0;
    if(this.quizData.QuestionAndContent && this.quizData.QuestionAndContent.length > 0){
      this.quizData.QuestionAndContent.map(quesContent => {
        if(quesContent.Type == 2){
          this.questionCount = this.questionCount + 1;
        }else{
          this.contentCount = this.contentCount + 1; 
        }
      });
    }
  }

  addBadge() {
    this.quizBuilderApiService.createNewBadge(this.quizId).subscribe(
      data => {
        this.notificationsService.success("Success");
        this.quizData.Badge.push({
          Id: data.Id,
          Title: data.Title
        });
        this.router.navigate(['quiz-builder', 'quiz-tool', this.quizId, 'badge', data.Id]);
      },
      error => {
        this.notificationsService.error("Error");
      }
    );
  }

  removeBadge(id, index) {
    this.removeItemRedirectPage();
    this.quizBuilderApiService.removeBadge(id).subscribe(
      data => {
        this.notificationsService.success("Success");
        this.quizData.Badge.splice(index, 1);
      },
      error => {
        this.notificationsService.error("Error");
      }
    );
  }

  /**
   * Function to Remove Result Against ResultId
   */
  removeResult(resultId, index) {
    this.removeItemRedirectPage();
    this.quizBuilderApiService.removeResultQuiz(resultId).subscribe(
      data => {
        this.resultRangeDataFactory.deletedResultIndex = index;
        this.quizzToolHelper.updateSidebarResultRange.next("Remove-Result");
        this.quizData.Results.splice(index, 1);
        // this.divideQuestionInResult(this.quizData);
        this.setUpdatedQuizData(this.quizData);
        this.quizzToolHelper.updateMultipleData.next("");
      },
      error => { }
    );
  }

  public questionLength;
  public resultLength;
  divideQuestionInResult(quizData) {
    // if(quizData.QuizTypeId === 2){
    this.questionDivisionArray = [];
    var questionStartCount = 0;
    var questionEndCount = -1;
    this.resultLength = quizData.Results.length;
    this.questionLength = this.questionCount + 1;
    for (var i = this.resultLength; i >= 1; i--) {
      if (this.questionLength > 0) {
        var tempQuestionCount = Math.ceil(this.questionLength / i);
        questionStartCount = questionEndCount + 1;
        questionEndCount = questionStartCount + tempQuestionCount - 1;
        if (questionStartCount == questionEndCount) {
          this.questionDivisionArray.push(`${questionEndCount}`);
        } else {
          this.questionDivisionArray.push(
            `${questionStartCount} to ${questionEndCount}`
          );
        }
        this.questionLength = this.questionLength - tempQuestionCount;
      }
    }
    // }
  }

  setUpdatedQuizData(quizData) {
    this.quizzToolHelper.updatedQuizData.next(quizData);
  }

  datachange(e) {
    this.quizData.Results.forEach((result, index) => {
      if(e[index]){
        result.MinScore = e[index].MinScore;
        result.MaxScore = e[index].MaxScore;
      }
    });
    this.resultRangeDataFactory.updateResultRangeApi(this.quizData.Results);
  }

  onAccessibility(){
    this.quizAccessibility.clear();
    var QUIZ_accessibility = this._crf.resolveComponentFactory(
      OfficeCompanyComponent
    );
    var QUIZ_accessibilityComponentRef = this.quizAccessibility.createComponent(
      QUIZ_accessibility
    );
  }

  onStyleing(){
    this.quizStyle.clear();
    var QUIZ_style = this._crf.resolveComponentFactory(
      BrandingComponent
    );
    var QUIZ_styleComponentRef = this.quizStyle.createComponent(
      QUIZ_style
    );
  }

  onAttemptsSetting(){
    this.quizAttemptsSettings.clear();
    var QUIZ_attemptsSetting = this._crf.resolveComponentFactory(
      PreviousQuestionComponent
    );
    var QUIZ_attemptsSettingComponentRef = this.quizAttemptsSettings.createComponent(
      QUIZ_attemptsSetting
    );
  }

  onAttachments(){
    this.quizAttachments.clear();
    var QUIZ_attachment = this._crf.resolveComponentFactory(
      AttachmentsComponent
    );
    var QUIZ_attachmentComponentRef = this.quizAttachments.createComponent(
      QUIZ_attachment
    );
  }

  dynamicTemplateShare() {
    this.shareQuizTemplate.clear();
    this.quizBuilderApiService.getQuizDetails(this.quizId).subscribe(quiz => {
      var SHARE_QuizTemplate = this._crf.resolveComponentFactory(
        ShareQuizComponent
      );
      var SHARE_QuizComponentRef = this.shareQuizTemplate.createComponent(
        SHARE_QuizTemplate
      );
      SHARE_QuizComponentRef.instance.quizData = quiz;
    });
  }

  ngOnDestroy() {
    this.renderer.removeStyle(this.bodyTemplate, "overflow");
    this.quizBuilderDataService.changeQuizHeader(undefined);
    this.answerAddedToListSubscription.unsubscribe();
    this.answerRemovedToListSubscription.unsubscribe();
    this.questionTitleChangeSubscription.unsubscribe();
    this.resultTitleChangeSubscription.unsubscribe();
    this.coverTitleChangeSubscription.unsubscribe();
    this.contentTitleChangeSubscription.unsubscribe();
    this.actionTitleChangeSubscription.unsubscribe();
    this.selectedAnswerTypeSubscription.unsubscribe();
    this.optionDataChangeSubscription.unsubscribe();
    this.resultRangeDataFactory.removeSubscriptionEvent();
    this.MaxScoreSubscription.unsubscribe();
    if (this.updatedRange) {
      this.updatedRange.unsubscribe();
    }
    this.isQuizConfigrationSubscription.unsubscribe();
    this.isOpenDynamicMediaSubscription.unsubscribe();
    if(this.isQuestionUpdateSubscription){
      this.isQuestionUpdateSubscription.unsubscribe();
    }
    this.isWhatsappEnableSubscription.unsubscribe();
  }

  getWhatsappUsage(){
    this.isWhatsappEnableSubscription = this.dynamicMediaReplaceService.isUsageTypeWhatsAppObservable.subscribe(res =>{
      this.isWhatsappEnable = res;
      if(this.isWhatsappEnable && this.quizData && ((!this.quizData.usageType || this.quizData.usageType.length == 0) || (this.quizData.usageType && !this.quizData.usageType.includes(3)))){
        if(this.quizData.QuizTypeId == quizTypeEnum.Nps){
          this.reDirectPage();
        }else{
          let isBranchingLogicEnable = this.branchingLogicAuthService.getBranchingLogicEnable();
          if(!isBranchingLogicEnable){
            this.onClickedEnable();
          }
        }
      }
    });
  }

  reDirectPage(){
    let firstQuestionDetail = this.quizData.QuestionAndContent[0];
    if(this.quizData.IsQuesAndContentInSameTable){
      this.router.navigate(['quiz-builder', 'quiz-tool', this.quizData.QuizId, 'question', firstQuestionDetail.QuestionId]);
    }else{
      if(firstQuestionDetail.Type == BranchingLogicEnum.QUESTION){
        this.router.navigate(['quiz-builder', 'quiz-tool', this.quizData.QuizId, 'question', firstQuestionDetail.QuestionId]);
      }else if(firstQuestionDetail.Type == BranchingLogicEnum.CONTENT){
        this.router.navigate(['quiz-builder', 'quiz-tool', this.quizData.QuizId, 'content', firstQuestionDetail.Id]);
      }
    }
  }

  removeItemRedirectPage(){
    if(this.isWhatsappEnable){
      this.reDirectPage();
    }else{
      this.router.navigate(['/quiz-builder/quiz-tool',this.quizData.QuizId])
    }
  }

}
