import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, ComponentFactoryResolver, TemplateRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { QuizBuilderApiService } from "../../quiz-builder-api.service";
import { NotificationsService } from "angular2-notifications";
import { DragulaService } from "ng2-dragula";
import { Subscription, from } from "rxjs";
import { SharedService } from "../../../shared/services/shared.service";
import { QuizBuilderDataService } from '../../quiz-builder-data.service';
import { BrandingComponent } from '../branding/branding.component';
import { EditQuizOverLayComponent } from "../edit-quiz-overLay/edit-quiz-overLay.component";
import { QuizzToolHelper } from "../quiz-tool-helper.service";
import { ResultRangeDataFactory } from "../quiz-data-factory";
import { RemoveallTagPipe } from "../../../shared/pipes/search.pipe";
import { DynamicMediaReplaceMentsService } from "../dynamic-media-replacement";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { UserInfoService } from "../../../shared/services/security.service";
import { BranchingLogicAuthService } from "../branching-logic-auth.service";
import { AttachmentsComponent } from "../attachments/attachments.component";
import { PreviousQuestionComponent } from "../previous-question/previous-question.component";
import { ShareQuizComponent } from "../../share-quiz/share-quiz.component";
import { OfficeCompanyComponent } from "../../edit-quiz/office-company/office-company.component";
import { DetectBranchingLogicAuthService } from "../detect-branching-logic-auth.service";
import { CommonService } from "../../../shared/services/common.service";
import { answerTypeEnum, BranchingLogicEnum, BrandingLanguage, quizTypeEnum, usageTypeEnum } from "../commonEnum";
import { WhatsappTemplateNewVersionService } from "../../../shared/services/whatsapp-template-new-version";
// import { startWith } from "rxjs/operators";
declare var Snap: any;
declare var $: any;

namespace SIZE {
  export const DEFAULT_WIDTH = 1100;
  export const DEFAULT_HEIGHT = 1100;
}
var branchingLogicData = [];
var branchingLogicDataList = [];
var updatedBranchingLogicData;

var componentReference;
var updatedWidth = SIZE.DEFAULT_WIDTH;
var updatedHeight = SIZE.DEFAULT_HEIGHT;
var updatedBranchingLogicLinksData = [];
var deleteOptionGroup;
var editToBuilderOptionGroup;
var unlinkOptionGroup;
var uniqueMoreOptionsId;
var duplicateOptionGroup;

var clickedCircleDetails;
var shadowPath;
var clickOnACircle;

var removedQuestionDetails;
var removedResultDetails;
var removedContentDetails;
var removedBadgeDetails;

var s;
var corX = 10,
  corY = 10;
var oneLineDetails = [];
var pathDetails = [];
var questionDetails = [];
var resultDetails = [];
var contentDetails = [];
var badgeDetails = [];
var startContentDetails;
var updatedStartContentData;
var updatedQuestionData = [];
var updatedResultData = [];
var updatedActionData = [];
var updatedContentData = [];
var updatedBadgeData = [];

var selectedQuestionPosition = [],
  selectedQuestionWidth;
var selectedResultposition = [];
var selectedContentPosition = [];
var selectedBadgePosition = [];
const filterPipe = new RemoveallTagPipe();
var TOIDLOOPINGCHECK;
var pathGroup;
var maxQuestionWidth = 0;
var isMoveCount = 0;
var basedOnCoreleationResultId;

//template
var demoTemplateContentDetails;
var updatedDemoTemplateContentData;
var selectedQuestionType;

@Component({
  selector: "app-branching-logic-latest",
  templateUrl: "./branching-logic-latest.component.html",
  styleUrls: ["./branching-logic-latest.component.css"],
  providers: [ResultRangeDataFactory]
})
export class BranchingLogicLatestComponent implements OnInit, OnDestroy {
  @ViewChild("quizStyle", { read: ViewContainerRef, static: true })
  quizStyle: ViewContainerRef;
  @ViewChild("editQuiz", { read: ViewContainerRef, static: true })
  editQuiz: ViewContainerRef;
  @ViewChild("quizAccessibility", { read: ViewContainerRef, static: true })
  quizAccessibility: ViewContainerRef;
  @ViewChild("quizAttemptsSettings", { read: ViewContainerRef, static: true })
  quizAttemptsSettings: ViewContainerRef;
  @ViewChild("quizAttachments", { read: ViewContainerRef, static: true })
  quizAttachments: ViewContainerRef;
  @ViewChild("shareQuizTemplate", { read: ViewContainerRef, static:true })
  shareQuizTemplate: ViewContainerRef;
  public branchingData;
  public quizId;
  public correctAnswerORNot;
  public selectedData;
  public answerData;
  public selectedStartsWithData = "1";
  public resultQuestionOption = [];
  public questionId;
  public resultId;
  public dragulaServiceOutSubscription: Subscription;
  public quizDetails;
  public contentId;
  public questionData;
  public resultData;
  public contentData;
  public badgeId;
  public badgeData;
  private sidebar;
  public svgWidth;
  public svgHeight;
  public isBranchingLogicSubscription: Subscription;
  public isShowMenuQuestion:boolean;
  public isShowMenuContent:boolean;
  public isQuizConfigrationSubscription: Subscription;
  public activeTab:any;
  public updateBranching:boolean=true;
  public quizData;
  public hoverOnTitle: any = {};
  public questionCount:number = 0;
  public resultCount:number = 0;
  public status: number = 0;
  public checked: boolean = false;
  public branchingLogicSide:boolean = true;
  public minimum;
  public maximum;
  public MaxScoreSubscription;
  public quizID;
  public highest;
  public lowest;
  public updatedRange;
  private isQuestionUpdateSubscription: Subscription;
  public modalRef: BsModalRef;
  public removeData;
  public userInfo:any= {};
  public language;
  public isELearningPermission :boolean = false;
  public isWhatsappEnable = false;
  private isWhatsappEnableSubscription: Subscription;
  public isEnabled: boolean = true;
  public quizSettingIcon:any="assets/layouts/img/quizsetting-icon.png";
  private isSuccessSubmissionSubscription: Subscription;
  public isBranchingLogicVaild:boolean = false;
  public defaultImage:any="https://res.cloudinary.com/dbbkqtyqn/image/upload/c_fill,w_40,h_40,g_auto,q_auto:best,f_auto/v1588680596/Jobrock/automation-place-holder-corner.png";
  public isBrsnchingLogic:boolean = true;
  public firstQuesAndContentObj:any = {};
  public selectedTemplate:any;
  public isTemplateList:boolean = false;
  public oldWhatsappFlow:boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizBuilderApiService: QuizBuilderApiService,
    private notificationsService: NotificationsService,
    private dragulaService: DragulaService,
    private sharedService: SharedService,
    private _crf: ComponentFactoryResolver,
    private quizBuilderDataService:QuizBuilderDataService,
    private quizzToolHelper: QuizzToolHelper,
    private resultRangeDataFactory: ResultRangeDataFactory,
    private dynamicMediaReplaceService:DynamicMediaReplaceMentsService,
    private modalService: BsModalService,
    private userInfoService: UserInfoService,
    private branchingLogicAuthService: BranchingLogicAuthService,
    private detectBranchingLogicAuthService: DetectBranchingLogicAuthService,
    private commonService:CommonService,
    private whatsappTemplateService: WhatsappTemplateNewVersionService
  ) {
    this.quizBuilderDataService.changeQuizHeader("QuizHeader");
    const bag: any = this.dragulaService.find("parent-bag");
    if (bag !== undefined) this.dragulaService.destroy("parent-bag");
    setTimeout(() => {
      updatedWidth = $(".logic-data").width();
      updatedHeight = $(".logic-data").height();
      this.svgHeight = updatedHeight;
      this.svgWidth = updatedWidth;
    });
  }

  ngOnInit() {
    this.userInfo = this.userInfoService._info;
    if(this.userInfo){
      this.language = this.userInfo.ActiveLanguage;
    }
    this.isELearningPermission = this.userInfo.IsManageElearningPermission;
    this.sidebar = $(".app-side-menu");
    this.sidebar[0].style.display = "none";
    componentReference = this;
    s = Snap("#svgout");
    pathGroup = s.group();
    /**
     * Get QuizId via routing parameter
     */
    this.route.parent.params.subscribe(params => {
      this.quizId = +params["id"];
    });

    this.branchingData = this.route.snapshot.data["branchingData"];
    this.quizData = this.route.snapshot.data["quizData"];
    this.oldWhatsappFlow = this.quizData.IsWhatsAppChatBotOldVersion;
    if(this.quizData && this.quizData.usageType && this.quizData.usageType.includes(usageTypeEnum.WhatsApp_Chatbot) && !this.oldWhatsappFlow){
      this.getHsmTemplateByModule();
      this.whatsappTemplateService.getAllLanguageList();
    }
    this.dataToSanitize();
    branchingLogicDataList = JSON.parse(JSON.stringify(this.branchingData));

    this.branchingData.QuestionAndContentList.forEach(questionData => {
      if(questionData.Type == BranchingLogicEnum.QUESTION){
        if (questionData.AnswerList.length * 100 > maxQuestionWidth) {
          maxQuestionWidth = questionData.AnswerList.length * 100;
        }
      }
    });

    this.onQuizDetails();
    this.getBranchingLogicData();
    this.questionData = this.branchingData["QuestionAndContentList"];
    this.resultData = this.branchingData["ResultList"];
    this.contentData = this.branchingData["QuestionAndContentList"];
    this.badgeData = this.branchingData["BadgeList"];
    /**
     * Get QuizId via routing parameter
     */
    this.route.parent.params.subscribe(params => {
      this.quizId = +params["id"];
    });

    this.dragulaService.setOptions("parent-bag", {
      moves: function(el, container, handle) {
        if (container.id != "svgout" && handle.className === "move move-icon") {
          // handle.className = ''
          return handle.className === "move move-icon";
        }
      },
      accepts: (el, target, source, sibling) => {
        if (target.id == "svgout") {
          return true;
        } else {
          return false;
        }
      }
    });

    this.dragulaServiceOutSubscription = this.dragulaService.drop.subscribe(
      data => {
        let [bag, el, target, source, nextSibling] = data;

        if (source.id === "Question") {
          this.questionId = data[1].firstElementChild.id;
          /**
           * Question svg creation Init
           */
          createDataforSVG(this.questionId, this.questionData, BranchingLogicEnum.QUESTION);

          this.removeDataOnDrop(el.children[0].id, BranchingLogicEnum.QUESTION);
        } else if (source.id === "Result") {
          this.resultId = data[1].firstElementChild.id;
          /**
           * Result svg creation Init
           */
          createDataforSVG(this.resultId, this.resultData, BranchingLogicEnum.RESULT);

          this.removeDataOnDrop(el.children[0].id, BranchingLogicEnum.RESULT);
        }else if (source.id === "Content") {
          this.contentId = data[1].firstElementChild.id;
          /**
           * Content svg creation Init
           */
          createDataforSVG(this.contentId, this.contentData, BranchingLogicEnum.CONTENT);

          this.removeDataOnDrop(el.children[0].id, BranchingLogicEnum.CONTENT);
        } else if (source.id === "Badge") {
          this.badgeId = data[1].firstElementChild.id;
          /**
           * Result svg creation Init
           */
          createDataforSVG(this.badgeId, this.badgeData, BranchingLogicEnum.BADGE);

          this.removeDataOnDrop(el.children[0].id, BranchingLogicEnum.BADGE);
        } else if (source.id === "QuestionAndContent") {
            if(data[1].firstElementChild && data[1].firstElementChild.firstElementChild && data[1].firstElementChild.firstElementChild.id){
            this.questionId = data[1].firstElementChild.firstElementChild.id;
            }
          /**
           * Question svg creation Init
           */
            let questionContentType = 2
           if(this.questionData && this.questionData.length > 0 && this.questionId){
            this.questionData.map(quesData => {
              if(quesData.ContentId == this.questionId){
                questionContentType = quesData.Type;
              }
            });
           }

           if(questionContentType == 2){
            createDataforSVG(this.questionId, this.questionData, 2);
            this.removeDataOnDrop(el.children[0].firstElementChild.id, 2);
           }

           if(questionContentType == 6){
            createDataforSVG(this.questionId, this.contentData, 6);
            this.removeDataOnDrop(el.children[0].firstElementChild.id, 6);
           }
        }
        this.getEditEvent();
      }
    );
    this.branchingLogicSave();
    this.getQuizConfigrationTab();
    this.getWhatsappUsage();
  }

  onQuizDetails(){
    this.quizzToolHelper.quizTypeId = this.quizData.QuizTypeId;
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

    if (this.quizData && this.quizData.QuizTypeId && (this.quizData.QuizTypeId == 4 || this.quizData.QuizTypeId == 6)) {
      this.updatedRange = this.quizzToolHelper.updatedResultRange
        .skip(1)
        .subscribe(data => {
          this.quizBuilderApiService
            .getQuizDetails(this.route.snapshot.params.id)
            .subscribe(data => {
              this.quizID = [];
              if(data.QuestionAndContent && data.QuestionAndContent.length > 0){
                data.QuestionAndContent.map(quesContant => {
                  if(quesContant.Type == BranchingLogicEnum.QUESTION){
                    this.quizID.push(quesContant);
                  }
                });
              }
              this.settingResultRange();
            });
        });
    }

    this.status = this.quizData.MultipleResultEnabled;
    if(this.status == 1){
      this.checked = true;
    }
    if(this.quizData && this.quizData.QuestionAndContent && this.quizData.QuestionAndContent.length > 0){
      this.quizData.QuestionAndContent.map(quesContent => {
        if(quesContent.Type == BranchingLogicEnum.QUESTION){
          this.questionCount = this.questionCount + 1;
        }
      });
    }
    this.resultCount = this.quizData.Results.length;
    this.quizzToolHelper.setBrandingAndStyling(this.quizData.QuizBrandingAndStyle);
    if(this.quizData.IsQuesAndContentInSameTable){
      this.getUpdateQuestion();
    }
  }

  getWhatsappUsage(){
    this.isWhatsappEnableSubscription = this.dynamicMediaReplaceService.isUsageTypeWhatsAppObservable.subscribe(res => this.isWhatsappEnable = res);
  }

  getBranchingLogicData(){
    branchingLogicData = [];
    this.quizBuilderApiService
    .getBranchingLogic(this.quizId)
    .subscribe(data => {
      branchingLogicData = data.QuizBranchingLogic;
      if(this.oldWhatsappFlow){
        this.setFirstQuestionInWhatsappCase();
      }else{
        this.getIsTemplateList();
      }
      updateWidthHeight(branchingLogicData, maxQuestionWidth);
      createSvgAnimation(branchingLogicData);
      this.updatedBranchingDataList(branchingLogicData);
      this.getEditEvent();
    });
  }

  setFirstQuestionInWhatsappCase(){
    if(this.quizData && this.quizData.usageType && this.quizData.usageType.includes(usageTypeEnum.WhatsApp_Chatbot)){
      let firstQuesAndContent = this.branchingData["QuestionAndContentList"][0];
      this.firstQuesAndContentObj = {
        Id : firstQuesAndContent.Type == BranchingLogicEnum.QUESTION ? firstQuesAndContent.QuestionId : firstQuesAndContent.ContentId,
        Type : firstQuesAndContent.Type
      }
      if(branchingLogicData.length <= 1){
        branchingLogicData[0].Links[0].FromId = "start";
        branchingLogicData[0].Links[0].FromType = BranchingLogicEnum.START;
        branchingLogicData[0].Links[0].ToType = this.firstQuesAndContentObj.Type;
        branchingLogicData[0].Links[0].ToId = this.firstQuesAndContentObj.Type == BranchingLogicEnum.QUESTION ? `q_${this.firstQuesAndContentObj.Id}` : `c_${this.firstQuesAndContentObj.Id}`;
        let windowWidth = window.innerWidth;
        let firstQuesAndContentBranchingLogicDataObj = {
          Id: this.firstQuesAndContentObj.Id,
          Type: this.firstQuesAndContentObj.Type,
          Links: [{
            FromId : '',
            FromType : BranchingLogicEnum.NONE,
            ToType : BranchingLogicEnum.NONE,
            IsCorrect : false,
            ToId : ''
          }],
          Position:[(windowWidth/2) - 430,'20']
        }
        branchingLogicData.push(firstQuesAndContentBranchingLogicDataObj);
        let updatedData = {
          QuizId: this.quizData.QuizId,
          QuizBranchingLogic: JSON.parse(JSON.stringify(branchingLogicData))
        };
        updatedData.QuizBranchingLogic[0].Links[0].ToId = this.firstQuesAndContentObj.Id;
        this.quizBuilderApiService.updateBranchingLogicDetails(updatedData).subscribe();
      }
    }
  }

  getHsmTemplateByModule(){
    this.whatsappTemplateService.clientWhatsappTemplates["automation"] = {};
    this.whatsappTemplateService.clientLanguageListByType["automation"] = [];
    this.quizBuilderApiService.getWhatsAppHSMTemplatesAutomation('chatbot').subscribe((updatedResponse:any) => {
        if(updatedResponse && updatedResponse.length > 0){
          this.isTemplateList = true;
          this.getIsTemplateList();
            let templateListByCode = {};
            updatedResponse.map((currentObj) => {
                if(!templateListByCode[currentObj.templateLanguage]){
                   templateListByCode[currentObj.templateLanguage] = [];
                }
                templateListByCode[currentObj.templateLanguage].push(currentObj);
            });
            this.whatsappTemplateService.clientLanguageListByType["automation"] = Object.keys(templateListByCode).length > 0 ? Object.keys(templateListByCode) : [];
            this.whatsappTemplateService.clientWhatsappTemplates["automation"] = templateListByCode;
        }else{
          createDefaultTemplateSvgAnimation();
          this.getEditEvent();
        }
    });
  }

  getIsTemplateList(){
    if(this.quizData && this.quizData.usageType && this.quizData.usageType.includes(usageTypeEnum.WhatsApp_Chatbot)){
      if(this.quizData.QuizTypeId != quizTypeEnum.Personality && this.isTemplateList && branchingLogicData && branchingLogicData.length > 0){
        let isSelectedTemplate = false;
        for(let i=0; i<branchingLogicData.length; i++){
          if(branchingLogicData[i].Type == BranchingLogicEnum.WHATSAPPTEMPLATE){
            isSelectedTemplate = true;
            break;
          }
        }
        if(!isSelectedTemplate){
          createDefaultTemplateSvgAnimation();
          this.getEditEvent();
        }
      }
    }
  }

  getEditEvent(){
    let self = this;
    $('.start').click(function(event) {
      if(event.target.closest('.start')){
        if(!event.target.closest('.drag-item')){
          self.onEditQuiz(1,self.quizData.QuizId,false);
        }
      }else if($(event.target).hasClass('start')){
        if(!event.target.closest('.drag-item')){
          self.onEditQuiz(1,self.quizData.QuizId,false);
        }
      }
    });
    $('.start').mouseover(function(event) {
      if(event.target.closest('.start')){
        $(`.start`).css("box-shadow", `0 0 5px 1px var(--primary-color) inset`);
      }else if($(event.target).hasClass('start')){
        $(`.start`).css("box-shadow", `0 0 5px 1px var(--primary-color) inset`);
      }
    });
    $('.start').mouseleave(function(event) {
      if(event.target.closest('.start')){
        $(`.start`).css("box-shadow", "none");
      }else if($(event.target).hasClass('start')){
        $(`.start`).css("box-shadow", "none");
      }
    });
    $('.quest-gutter').click(function(event) {
      if(event.target.closest('.quest-gutter')){
        if(!event.target.closest('.drag')){
          console.log("questionclick");
          let tragetDiv = event.target.closest('.quest-gutter');
          self.onEditQuiz(2,tragetDiv.id,false);
        }
      }else if($(event.target).hasClass('quest-gutter')){
        if(!event.target.closest('.drag')){
          console.log("questionclick");
          self.onEditQuiz(2,event.target.id,false);
        }
      }
    });
    $('.box-gutter').click(function(event) {
      if(event.target.closest('.box-gutter')){
        if(!event.target.closest('.drag-item')){
          let tragetDiv = event.target.closest('.box-gutter');
          console.log("questionclick");
          self.onEditQuiz(2,tragetDiv.id.split("_")[1],false);
        }
      }else if($(event.target).hasClass('box-gutter')){
        if(!event.target.closest('.drag-item')){
          console.log("questionclick");
          self.onEditQuiz(2,event.target.id.split("_")[1],false);
        }
      }
    });
    $('.quest-gutter').mouseover(function(event) {
      if(event.target.closest('.quest-gutter')){
        let tragetDiv = event.target.closest('.quest-gutter');
        let id = '#Q_'+ tragetDiv.id;
        $(`${id} .box-gutter`).css("box-shadow", `0 0 5px 1px var(--primary-color) inset`);
      }else if($(event.target).hasClass('quest-gutter')){
        let id = '#Q_'+ event.target.id;
        $(`${id} .box-gutter`).css("box-shadow", `0 0 5px 1px var(--primary-color) inset`);
      }
    });
    $('.quest-gutter').mouseleave(function(event) {
      if(event.target.closest('.quest-gutter')){
        let tragetDiv = event.target.closest('.quest-gutter');
        let id = '#Q_'+ tragetDiv.id;
        $(`${id} .box-gutter`).css("box-shadow", "none");
      }else if($(event.target).hasClass('quest-gutter')){
        let id = '#Q_'+ event.target.id;
        $(`${id} .box-gutter`).css("box-shadow", "none");
      }
    });
    $('.temp-gutter').click(function(event) {
      if(event.target.closest('.temp-gutter')){
        if(!event.target.closest('.drag')){
          console.log("templateclick");
          let tragetDiv = event.target.closest('.temp-gutter');
          self.onEditQuiz(15,tragetDiv.id,false);
        }
      }else if($(event.target).hasClass('temp-gutter')){
        if(!event.target.closest('.drag')){
          console.log("templateclick");
          self.onEditQuiz(15,event.target.id,false);
        }
      }
    });
    $('.tempbox-gutter').click(function(event) {
      if(event.target.closest('.tempbox-gutter')){
        if(!event.target.closest('.drag-item')){
          let tragetDiv = event.target.closest('.tempbox-gutter');
          console.log("templateclick");
          self.onEditQuiz(15,tragetDiv.id.split("_")[1],false);
        }
      }else if($(event.target).hasClass('tempbox-gutter')){
        if(!event.target.closest('.drag-item')){
          console.log("templateclick");
          self.onEditQuiz(15,event.target.id.split("_")[1],false);
        }
      }
    });
    $('.temp-gutter').mouseover(function(event) {
      if(event.target.closest('.temp-gutter')){
        let tragetDiv = event.target.closest('.temp-gutter');
        let id = '#T_'+ tragetDiv.id;
        $(`${id} .tempbox-gutter`).css("box-shadow", `0 0 5px 1px var(--primary-color) inset`);
      }else if($(event.target).hasClass('temp-gutter')){
        let id = '#T_'+ event.target.id;
        $(`${id} .tempbox-gutter`).css("box-shadow", `0 0 5px 1px var(--primary-color) inset`);
      }
    });
    $('.temp-gutter').mouseleave(function(event) {
      if(event.target.closest('.temp-gutter')){
        let tragetDiv = event.target.closest('.temp-gutter');
        let id = '#T_'+ tragetDiv.id;
        $(`${id} .tempbox-gutter`).css("box-shadow", "none");
      }else if($(event.target).hasClass('temp-gutter')){
        let id = '#T_'+ event.target.id;
        $(`${id} .tempbox-gutter`).css("box-shadow", "none");
      }
    });
    $('.content-gutter').click(function(event) {
      if(event.target.closest('.content-gutter')){
        if(!event.target.closest('.drag')){
          let tragetDiv = event.target.closest('.content-gutter');
          self.onEditQuiz(6,tragetDiv.id,false);
        }
      }else if($(event.target).hasClass('content-gutter')){
        if(!event.target.closest('.drag')){
          self.onEditQuiz(6,event.target.id,false);
        }
      }
    });
    $('.box-content-gutter').click(function(event) {
      if(event.target.closest('.box-content-gutter')){
        if(!event.target.closest('.drag-item')){
          let tragetDiv = event.target.closest('.box-content-gutter');
          self.onEditQuiz(6,tragetDiv.id.split("_")[1],false);
        }
      }else if($(event.target).hasClass('box-content-gutter')){
        if(!event.target.closest('.drag-item')){
          self.onEditQuiz(6,event.target.id.split("_")[1],false);
        }
      }
    });
    $('.content-gutter').mouseover(function(event) {
      if(event.target.closest('.content-gutter')){
        let tragetDiv = event.target.closest('.content-gutter');
        let id = '#C_'+ tragetDiv.id;
        $(`${id} .box-content-gutter`).css("box-shadow", `0 0 5px 1px var(--primary-color) inset`);
      }else if($(event.target).hasClass('content-gutter')){
        let id = '#C_'+ event.target.id;
        $(`${id} .box-content-gutter`).css("box-shadow", `0 0 5px 1px var(--primary-color) inset`);
      }
    });
    $('.content-gutter').mouseleave(function(event) {
      if(event.target.closest('.content-gutter')){
        let tragetDiv = event.target.closest('.content-gutter');
        let id = '#C_'+ tragetDiv.id;
        $(`${id} .box-content-gutter`).css("box-shadow", "none");
      }else if($(event.target).hasClass('content-gutter')){
        let id = '#C_'+ event.target.id;
        $(`${id} .box-content-gutter`).css("box-shadow", "none");
      }
    });
    $('.result-gutter').click(function(event) {
      let isBasedOnResult = false;
      if(event.target.closest('.result-gutter')){
        let tragetDiv = event.target.closest('.result-gutter');
        if(self.quizData && self.quizData.QuizTypeId == 3 && !event.target.closest('.drag')){
         isBasedOnResult = self.getBasedOnCorealtion(tragetDiv.id);
        }
        if(self.quizData && (self.quizData.QuizTypeId != 3 || (self.quizData.QuizTypeId == 3 && !isBasedOnResult)) && !event.target.closest('.drag')){
          self.onEditQuiz(4,tragetDiv.id,false);
        }
      }else if($(event.target).hasClass('result-gutter')){
        if(self.quizData && self.quizData.QuizTypeId == 3  && !event.target.closest('.drag')){
          isBasedOnResult = self.getBasedOnCorealtion(event.target.id);
        }
        if(self.quizData && (self.quizData.QuizTypeId != 3 || (self.quizData.QuizTypeId == 3 && !isBasedOnResult)) && !event.target.closest('.drag')){
          self.onEditQuiz(4,event.target.id,false);
        }
      }
    });
    $('.box-result-gutter').click(function(event) {
      let isBasedOnResult = false;
      if(event.target.closest('.box-result-gutter')){
        let tragetDiv = event.target.closest('.box-result-gutter');
        if(self.quizData && self.quizData.QuizTypeId == 3 && !event.target.closest('.drag-item')){
         isBasedOnResult = self.getBasedOnCorealtion(tragetDiv.id.split("_")[1]);
        }
        if(self.quizData && (self.quizData.QuizTypeId != 3 || (self.quizData.QuizTypeId == 3 && !isBasedOnResult)) && !event.target.closest('.drag-item')){
          self.onEditQuiz(4,tragetDiv.id.split("_")[1],false);
        }
      }else if($(event.target).hasClass('box-result-gutter')){
        if(self.quizData && self.quizData.QuizTypeId == 3 && !event.target.closest('.drag-item')){
          isBasedOnResult = self.getBasedOnCorealtion(event.target.id.split("_")[1]);
        }
        if(self.quizData && (self.quizData.QuizTypeId != 3 || (self.quizData.QuizTypeId == 3 && !isBasedOnResult)) && !event.target.closest('.drag-item')){
          self.onEditQuiz(4,event.target.id.split("_")[1],false);
        }
      }
    });
    $('.result-gutter').mouseover(function(event) {
      let isBasedOnResult = false;
      if(event.target.closest('.result-gutter')){
        let tragetDiv = event.target.closest('.result-gutter');
        if(self.quizData && self.quizData.QuizTypeId == 3){
          isBasedOnResult = self.getBasedOnCorealtion(tragetDiv.id);
        }
        if(self.quizData && (self.quizData.QuizTypeId != 3 || (self.quizData.QuizTypeId == 3 && !isBasedOnResult))){
        let id = '#R_'+ tragetDiv.id;
        $(`${id} .box-result-gutter`).css("box-shadow", `0 0 5px 1px var(--primary-color) inset`);
        }
      }else if($(event.target).hasClass('result-gutter')){
        if(self.quizData && self.quizData.QuizTypeId == 3){
          isBasedOnResult = self.getBasedOnCorealtion(event.target.id);
        }
        if(self.quizData && (self.quizData.QuizTypeId != 3 || (self.quizData.QuizTypeId == 3 && !isBasedOnResult))){
        let id = '#R_'+ event.target.id;
        $(`${id} .box-result-gutter`).css("box-shadow", `0 0 5px 1px var(--primary-color) inset`);
        }
      }
    });
    $('.result-gutter').mouseleave(function(event) {
      let isBasedOnResult = false;
      if(event.target.closest('.result-gutter')){
        let tragetDiv = event.target.closest('.result-gutter');
        if(self.quizData && self.quizData.QuizTypeId == 3){
          isBasedOnResult = self.getBasedOnCorealtion(tragetDiv.id);
        }
        if(self.quizData && (self.quizData.QuizTypeId != 3 || (self.quizData.QuizTypeId == 3 && !isBasedOnResult))){
        let id = '#R_'+ tragetDiv.id;
        $(`${id} .box-result-gutter`).css("box-shadow", "none");
        }
      }else if($(event.target).hasClass('result-gutter')){
        if(self.quizData && self.quizData.QuizTypeId == 3){
          isBasedOnResult = self.getBasedOnCorealtion(event.target.id);
        }
        if(self.quizData && (self.quizData.QuizTypeId != 3 || (self.quizData.QuizTypeId == 3 && !isBasedOnResult))){
        let id = '#R_'+ event.target.id;
        $(`${id} .box-result-gutter`).css("box-shadow", "none");
        }
      }
    });
    $('.badge-container').click(function(event) {
      if(event.target.closest('.badge-container')){
        if(!event.target.closest('.drag')){
          let tragetDiv = event.target.closest('.badge-container');
          self.onEditQuiz(11,tragetDiv.id,false);
        }
      }else if($(event.target).hasClass('badge-container')){
        if(!event.target.closest('.drag')){
          self.onEditQuiz(11,event.target.id,false);
        }
      }
    });
    $('.badge-container-gutter').click(function(event) {
      if(event.target.closest('.badge-container-gutter')){
        if(!event.target.closest('.drag-item')){
          let tragetDiv = event.target.closest('.badge-container-gutter');
          self.onEditQuiz(11,tragetDiv.id.split("_")[1],false);
        }
      }else if($(event.target).hasClass('badge-container-gutter')){
        if(!event.target.closest('.drag-item')){
          self.onEditQuiz(11,event.target.id.split("_")[1],false);
        }
      }
    });
    $('.badge-container').mouseover(function(event) {
      if(event.target.closest('.badge-container')){
        let tragetDiv = event.target.closest('.badge-container');
        let id = '#B_'+ tragetDiv.id;
        $(`${id} .badge-container-gutter`).css("box-shadow", `0 0 5px 1px var(--primary-color) inset`);
      }else if($(event.target).hasClass('badge-container')){
        let id = '#B_'+ event.target.id;
        $(`${id} .badge-container-gutter`).css("box-shadow", `0 0 5px 1px var(--primary-color) inset`);
      }
    });
    $('.badge-container').mouseleave(function(event) {
      if(event.target.closest('.badge-container')){
        let tragetDiv = event.target.closest('.badge-container');
        let id = '#B_'+ tragetDiv.id;
        $(`${id} .badge-container-gutter`).css("box-shadow", "none");
      }else if($(event.target).hasClass('badge-container')){
        let id = '#B_'+ event.target.id;
        $(`${id} .badge-container-gutter`).css("box-shadow", "none");
      }
    });
    $('.temp-btn').click(function(event) {
      if(event.target.closest('.temp-btn')){
        if(!event.target.closest('.drag-item')){
          let tragetDiv = event.target.closest('.temp-btn');
          self.onEditQuiz(BranchingLogicEnum.WHATSAPPTEMPLATE,tragetDiv.id.split("_")[1],false);
        }
      }else if($(event.target).hasClass('temp-btn')){
        if(!event.target.closest('.drag-item')){
          self.onEditQuiz(BranchingLogicEnum.WHATSAPPTEMPLATE,event.target.id.split("_")[1],false);
        }
      }
    });
    $('.temp').mouseover(function(event) {
      if(event.target.closest('.temp')){
        $(`.temp`).css("box-shadow", `0 0 5px 1px var(--primary-color) inset`);
      }else if($(event.target).hasClass('temp')){
        $(`.temp`).css("box-shadow", `0 0 5px 1px var(--primary-color) inset`);
      }
    });
    $('.temp').mouseleave(function(event) {
      if(event.target.closest('.temp')){
        $(`.temp`).css("box-shadow", "none");
      }else if($(event.target).hasClass('temp')){
        $(`.temp`).css("box-shadow", "none");
      }
    });
  }

  getBasedOnCorealtion(id){
    let resultIndex = branchingLogicDataList['ResultList'].findIndex((resultData) => {
      return resultData.ResultId == id;
    });
    if(resultIndex >= 0){
     return branchingLogicDataList['ResultList'][resultIndex].IsPersonalityCorrelatedResult;
    }
  }

  onStyleing(){
    this.quizStyle.clear();
    if(this.editQuiz){
      this.editQuiz.clear();
    }
    var QUIZ_style = this._crf.resolveComponentFactory(
      BrandingComponent
    );
    var QUIZ_styleComponentRef = this.quizStyle.createComponent(
      QUIZ_style
    );
  }

  onEditQuiz(editType,id,isLeftSide,data?){
    this.editQuiz.clear();
    var EDIT_quiz = this._crf.resolveComponentFactory(
      EditQuizOverLayComponent
    );
    var EDIT_quizComponentRef = this.editQuiz.createComponent(
      EDIT_quiz
    );
    EDIT_quizComponentRef.instance.editType = editType;
    EDIT_quizComponentRef.instance.editTypeId = id;
    EDIT_quizComponentRef.instance.quizData = this.quizData;
    this.whatsappTemplateService.quizId = this.quizId;
    if(editType == BranchingLogicEnum.WHATSAPPTEMPLATE && id != 'Template'){
      this.whatsappTemplateService.addedHsmTemplateId = this.selectedTemplate.TemplateId;
      this.whatsappTemplateService.defualtLanguageCode = this.selectedTemplate.LanguageCode;
      this.whatsappTemplateService.addedTemplateParameters = [];
      this.whatsappTemplateService.selectedTemplateObj.TemplateId = this.selectedTemplate.TemplateId;
      this.whatsappTemplateService.selectedTemplateObj.LanguageCode = this.selectedTemplate.LanguageCode;
    }
    EDIT_quizComponentRef.instance.sameTableContentAndQuestion = this.branchingData.IsQuesAndContentInSameTable;
     //subscribe to child output event
    EDIT_quizComponentRef.instance.branchingData.subscribe(res => {
        this.questionCount = 0;
        if(res && res.QuestionAndContentList && res.QuestionAndContentList.length > 0){
          res.QuestionAndContentList.map(quesContent => {
            if(quesContent.Type == 2){
              this.questionCount = this.questionCount + 1;
            }
          });
        }
        if(isLeftSide){
          this.editLeftSideMode(editType,id,res,data);
        }else{
          this.editRightSideMode(editType,id,res);
        }
    });
    EDIT_quizComponentRef.instance.templateData.subscribe(res => {
      this.selectedTemplate = res;
      this.editWhatsappTemplate(id,res);
    });
  }

  editWhatsappTemplate(id,res){
    let parentId;
    if(id == 'Template'){
      parentId = id;
    }else{
      parentId = "T_"+id;
    }
    let parentNode = document.getElementById(parentId);
    //getPostion
    let parentTransfrom = parentNode.getAttribute("transform");
    let parentElementPosition;
    let xParentPosition = 0;
    let yParentPosition = 0;
    let currentNodePathDetail = [];
    if(parentTransfrom){
      parentElementPosition = parentTransfrom.replace("matrix(", "").replace(")", "").split(",");
      xParentPosition = +parentElementPosition[parentElementPosition.length - 2];
      yParentPosition = +parentElementPosition[parentElementPosition.length - 1];
    }
    let transfrom;
    let elementPosition;
    if(parentNode.children && parentNode.children.length > 0){
      transfrom = parentNode.children[0].getAttribute("transform");
      elementPosition =  transfrom.replace("matrix(", "").replace(")", "").split(",");
    }
    let xPosition;
    let yPosition;
    if(elementPosition && elementPosition.length > 0){
      xPosition = +elementPosition[elementPosition.length - 2] + 20 + xParentPosition;
      yPosition = +elementPosition[elementPosition.length - 1] + yParentPosition;
    }

    //branching logic path
    let branchingLogicInSelectedNode = [];
    let selectedNodeLink = [];
    let branchingLogicObj = {
      Id : '',
      Links : [],
      Position : [],
      Type : 0
    };
    let LinksObj = {
      FromId : '',
      FromType : 0,
      IsCorrect : false,
      ToId : ``,
      ToType : 0
    }

    if(id != 'Template'){
      var pathIndex = [];
      pathDetails.forEach(path => {
        if (
          path.fromParentID === parentId ||
          path.toParentID === parentId
        ) {
          pathIndex.push(
            pathDetails.findIndex(removedpath => {
              return removedpath === path;
            })
          );
          if(path.fromParentID == 'Start'){
            currentNodePathDetail.push(path);
          }
          path.pathBetween.remove();
        }
      });
    
      for (var i = pathIndex.length - 1; i >= 0; i--) {
        pathDetails.splice(pathIndex[i], 1);
      }

      if(currentNodePathDetail && currentNodePathDetail.length > 0){
        currentNodePathDetail.map(path => {
          LinksObj.FromId = path.fromId;
          LinksObj.FromType = path.fromType;
          LinksObj.IsCorrect = path.IsCorrect ? path.IsCorrect : false;
          LinksObj.ToId = `t_${res.QuestionId}`;
          LinksObj.ToType = path.toType;
        });
      }
      let questionAndContentIndexDelete = branchingLogicDataList['QuestionAndContentList'].findIndex((questionAndContentData) => {
        if(questionAndContentData.Type == 15){
          return questionAndContentData.QuestionId == id;
        }
      });
      branchingLogicDataList['QuestionAndContentList'].splice(questionAndContentIndexDelete, 1);
      branchingLogicDataList['QuestionAndContentList'].push(res);
    }else{
      LinksObj.FromId = 'start';
      LinksObj.FromType = BranchingLogicEnum.START;
      LinksObj.ToId = `t_${res.QuestionId}`;
      LinksObj.ToType = BranchingLogicEnum.WHATSAPPTEMPLATE;
      branchingLogicDataList['QuestionAndContentList'].push(res);
    }
    let yPositionTemp = +yPosition > 0 ? +yPosition + 20 : 20;
    selectedNodeLink.push(JSON.parse(JSON.stringify(LinksObj)));
    branchingLogicObj.Id = "start";
    branchingLogicObj.Links = selectedNodeLink;
    branchingLogicObj.Position = [+xPosition, +yPositionTemp];
    branchingLogicObj.Type = BranchingLogicEnum.START;
    branchingLogicInSelectedNode.push(branchingLogicObj);

    if(parentNode){
      parentNode.remove();
    }

    let item = {
      Id: res.QuestionId,
      Type: BranchingLogicEnum.WHATSAPPTEMPLATE,
      uid: `t_${res.QuestionId}`,
      Position: [+xPosition, +yPositionTemp]
    };
    let selectedQuestionTemplate=[];
    selectedQuestionTemplate.push(res);
    questionSvgAnimation(item, selectedQuestionTemplate);
    if(branchingLogicInSelectedNode && branchingLogicInSelectedNode.length > 0){
      createPlottedPath(branchingLogicInSelectedNode);
    }
    this.getEditEvent();
    if(id == 'Template'){
      this.updateBranchingLogic("cover", 0);
    }
  }

  editLeftSideMode(editType,id,res,data){
    if((editType == 2 || editType == 6) && res && res.QuestionAndContentList && res.QuestionAndContentList.length > 0){
      res.QuestionAndContentList.map(queContent => {
        if((queContent.Type == 2 && queContent.QuestionId == id) || (queContent.Type == 6 && queContent.ContentId == id)){
          let questionAndContentIndex = this.branchingData['QuestionAndContentList'].findIndex((questionAndContentData) => {
            if(questionAndContentData.Type == 2){
              return questionAndContentData.QuestionId == id;
            }else{
              return questionAndContentData.ContentId == id;
            }
          });
          this.branchingData['QuestionAndContentList'][questionAndContentIndex] = queContent;

          //delete
          let questionAndContentIndexDelete = branchingLogicDataList['QuestionAndContentList'].findIndex((questionAndContentData) => {
            if(questionAndContentData.Type == 2){
              return questionAndContentData.QuestionId == id;
            }else{
              return questionAndContentData.ContentId == id;
            }
          });
          branchingLogicDataList['QuestionAndContentList'].splice(questionAndContentIndexDelete, 1);
          branchingLogicDataList['QuestionAndContentList'].push(queContent);
        }
      });
    }else if(editType == 4 && res && res.ResultList && res.ResultList.length > 0){
      res.ResultList.map(result => {
        if(result.ResultId == id){
        let resultIndex = this.branchingData['ResultList'].findIndex((resultData) => {
          return resultData.ResultId == data.ResultId;
        });
        this.branchingData['ResultList'][resultIndex] = result;

        //delete
        let resultIndexDelete = branchingLogicDataList['ResultList'].findIndex((resultData) => {
          return resultData.ResultId == data.ResultId;
        });
        branchingLogicDataList['ResultList'].splice(resultIndexDelete, 1);
        branchingLogicDataList['ResultList'].push(result);
      }
      });
    }else if(editType == 11 && res && res.BadgeList && res.BadgeList.length > 0){
      res.BadgeList.map(badget => {
        if(badget.BadgetId == id){
        let badgetIndex = this.branchingData['BadgeList'].findIndex((badgetData) => {
          return badgetData.BadgetId == data.BadgetId;
        });
        this.branchingData['BadgeList'][badgetIndex] = badget;

        //delete
        let badgetIndexDelete = branchingLogicDataList['BadgeList'].findIndex((badgetData) => {
          return badgetData.BadgetId == data.BadgetId;
        });
        branchingLogicDataList['BadgeList'].splice(badgetIndexDelete, 1);
        branchingLogicDataList['BadgeList'].push(badget);
      }
      });
    }
    else if(editType == 1 && res){
      let startNode = document.getElementsByClassName('start');
      if(startNode && startNode.length > 0){
        const filterSelectedCoverDes = filterPipe.transform(res.QuizDescription && res.QuizDescription ? res.QuizDescription : 'Description');
        startNode[0].lastElementChild.lastElementChild.innerHTML = filterSelectedCoverDes;
        startNode[0].lastElementChild.lastElementChild.setAttribute("title", filterSelectedCoverDes);
      }
    }
  }


  editRightSideMode(editType,id,res){
      if(res){
        let branchingDetails = res;
        let selectedQuestion = [];
        let selectedResult = [];
        let selectedBadge = [];
        let currentNodePathDetail = [];
        if(branchingDetails){
          if((editType == 2 || editType == 6) && branchingDetails.QuestionAndContentList && branchingDetails.QuestionAndContentList.length > 0){
            branchingDetails.QuestionAndContentList.map(queContent => {
              if((queContent.Type == 2 && queContent.QuestionId == id) || (queContent.Type == 6 && queContent.ContentId == id)){
                selectedQuestion.push(queContent);
                //delete
                let questionAndContentIndexDelete = branchingLogicDataList['QuestionAndContentList'].findIndex((questionAndContentData) => {
                  if(questionAndContentData.Type == 2){
                    return questionAndContentData.QuestionId == id;
                  }else{
                    return questionAndContentData.ContentId == id;
                  }
                });
                branchingLogicDataList['QuestionAndContentList'].splice(questionAndContentIndexDelete, 1);
                branchingLogicDataList['QuestionAndContentList'].push(queContent);
                if(this.firstQuesAndContentObj.Id == id && this.oldWhatsappFlow){
                  this.firstQuesAndContentObj.Type = queContent.Type;
                }
              }
            });
          }else if(editType == 4 && branchingDetails.ResultList && branchingDetails.ResultList.length > 0){
            branchingDetails.ResultList.map(result => {
              if(result.ResultId == id){
                selectedResult.push(result);
                //delete
                let resultIndexDelete = branchingLogicDataList['ResultList'].findIndex((resultData) => {
                return resultData.ResultId == result.ResultId;
                });
                branchingLogicDataList['ResultList'].splice(resultIndexDelete, 1);
                branchingLogicDataList['ResultList'].push(result);
              }
            });
          }else if(editType == 11 && branchingDetails.BadgeList && branchingDetails.BadgeList.length > 0){
            branchingDetails.BadgeList.map(badget => {
              if(badget.BadgetId == id){
                selectedBadge.push(badget);
                //delete
                let badgetIndexDelete = branchingLogicDataList['BadgeList'].findIndex((badgetData) => {
                  return badgetData.BadgetId == badget.BadgetId;
                });
                branchingLogicDataList['BadgeList'].splice(badgetIndexDelete, 1);
                branchingLogicDataList['BadgeList'].push(badget);
              }
            });
          }else if(editType == 1){
            let startNode = document.getElementsByClassName('start');
            if(startNode && startNode.length > 0){
              const filterSelectedCoverDes = filterPipe.transform(branchingDetails.ShowDescription ? branchingDetails.QuizDescription && branchingDetails.QuizDescription ? branchingDetails.QuizDescription : 'Description' : '');
              const filterSelectedtitle = filterPipe.transform(branchingDetails.QuizCoverTitle ? branchingDetails.QuizCoverTitle : 'Untitled Cover');
              startNode[0].lastElementChild.firstElementChild.innerHTML = filterSelectedtitle;
              startNode[0].lastElementChild.firstElementChild.setAttribute("title", filterSelectedtitle);
              startNode[0].lastElementChild.lastElementChild.innerHTML = filterSelectedCoverDes;
              startNode[0].lastElementChild.lastElementChild.setAttribute("title", filterSelectedCoverDes);
            }
          }
        }
        if(editType != 1){
        let parentId;
        if(editType == 2){
          parentId = "Q_"+id;
          var parentNode = document.getElementById(parentId);
          if(parentNode == null){
            parentId = "C_"+id;
            var parentNode = document.getElementById(parentId);
            if(parentNode){
              editType = 6;
            }
          }
        }else if(editType == 6){
          parentId = "C_"+id;
          var parentNode = document.getElementById(parentId);
          if(parentNode == null){
            parentId = "Q_"+id;
            var parentNode = document.getElementById(parentId);
            if(parentNode){
              editType = 2;
            }
          }
        }else if(editType == 4){
          parentId = "R_"+id;
          var parentNode = document.getElementById(parentId);
        }else if(editType == 11){
          parentId = "B_"+id;
          var parentNode = document.getElementById(parentId);
        }

        //getPostion
        let parentTransfrom = parentNode.getAttribute("transform");
        let parentElementPosition;
        let xParentPosition = 0;
        let yParentPosition = 0;
        if(parentTransfrom){
          parentElementPosition = parentTransfrom.replace("matrix(", "").replace(")", "").split(",");
          xParentPosition = +parentElementPosition[parentElementPosition.length - 2];
          yParentPosition = +parentElementPosition[parentElementPosition.length - 1];
        }

        let transfrom;
        let elementPosition;
        if(parentNode.children && parentNode.children.length > 0){
          transfrom = parentNode.children[0].getAttribute("transform");
          elementPosition =  transfrom.replace("matrix(", "").replace(")", "").split(",");
        }
        let xPosition;
        let yPosition;
        if(elementPosition && elementPosition.length > 0){
          xPosition = +elementPosition[elementPosition.length - 2] + 20 + xParentPosition;
          yPosition = +elementPosition[elementPosition.length - 1] + 20 + yParentPosition;
        }

        if(editType == 2){
          let questionIndex = questionDetails.findIndex(removeQuestion => {
            return removeQuestion.ID === parentId;
          });
          questionDetails.splice(questionIndex, 1);
        }else if(editType == 6){
          let contentIndex = contentDetails.findIndex(removeContent => {
            return removeContent.ID === parentId;
          });
          contentDetails.splice(contentIndex, 1);
        }else if(editType == 4){
          let resultIndex = resultDetails.findIndex(removeResult => {
            return removeResult.ID === parentId;
          });
          resultDetails.splice(resultIndex, 1);
        }else if(editType == 11){
          let badgetIndex = badgeDetails.findIndex(removeBadge => {
            return removeBadge.ID === parentId;
          });
          badgeDetails.splice(badgetIndex, 1);
        }

        var pathIndex = [];
        pathDetails.forEach(path => {
          if (
            path.fromParentID === parentId ||
            path.toParentID === parentId
          ) {
            pathIndex.push(
              pathDetails.findIndex(removedpath => {
                return removedpath === path;
              })
            );
            currentNodePathDetail.push(path);
            path.pathBetween.remove();
          }
        });
      
        for (var i = pathIndex.length - 1; i >= 0; i--) {
          pathDetails.splice(pathIndex[i], 1);
        }

        if(parentNode){
          parentNode.remove();
        }

        //branchingLogicData link start
        var branchingLogicInSelectedNode = [];
        var selectedNodeLink = [];
        var branchingLogicObj = {
          Id : '',
          Links : [],
          Position : [],
          Type : 0
        };

        var LinksObj = {
          FromId : '',
          FromType : 0,
          IsCorrect : false,
          ToId : '',
          ToType : 0
        }
        
        if(currentNodePathDetail && currentNodePathDetail.length > 0){
          //result
          if(editType == 4 || editType == 11 || (editType == 6 && selectedQuestion && selectedQuestion.length > 0 && selectedQuestion[0].Type == 6)){
            currentNodePathDetail.map(path => {
              LinksObj.FromId = path.fromId;
              LinksObj.FromType = path.fromType;
              LinksObj.IsCorrect = path.IsCorrect ? path.IsCorrect : false;
              LinksObj.ToId = path.toId;
              LinksObj.ToType = path.toType;
              selectedNodeLink.push(JSON.parse(JSON.stringify(LinksObj)));
            });
            branchingLogicObj.Type = editType;
          }else if(editType == 2 && selectedQuestion && selectedQuestion.length > 0 && selectedQuestion[0].Type == 6){
            //question to content
            currentNodePathDetail.map(path => {
              if(path.fromId == `q_${id}` || path.toId == `q_${id}`){
                LinksObj.FromId = path.fromId == `q_${id}` ?  `c_${id}` : path.fromId;
                LinksObj.FromType = path.fromType == 2 ? 6 : path.fromType;
                LinksObj.IsCorrect = path.IsCorrect ? path.IsCorrect : false;
                LinksObj.ToId = path.toId == `q_${id}` ?  `c_${id}` : path.toId;
                LinksObj.ToType = path.toType == 2 ? 6 : path.toType;
                selectedNodeLink.push(JSON.parse(JSON.stringify(LinksObj)));
              }
            });
            branchingLogicObj.Type = 6;
          }else if(editType == 6 && selectedQuestion && selectedQuestion.length > 0 && selectedQuestion[0].Type == 2){
            //content to question
            currentNodePathDetail.map(path => {
              if(path.fromId == `c_${id}` || path.toId == `c_${id}`){
                LinksObj.FromId = path.fromId == `c_${id}` ?  `q_${id}` : path.fromId;
                LinksObj.FromType = path.fromType == 6 ? 2 : path.fromType;
                LinksObj.IsCorrect = path.IsCorrect ? path.IsCorrect : false;
                LinksObj.ToId = path.toId == `c_${id}` ?  `q_${id}` : path.toId;
                LinksObj.ToType = path.toType == 6 ? 2 : path.toType;
                selectedNodeLink.push(JSON.parse(JSON.stringify(LinksObj)));
              }
            });
            branchingLogicObj.Type = 2;
          }else if(editType == 2 && selectedQuestion && selectedQuestion.length > 0 && selectedQuestion[0].Type == 2){
            //change anwser type and add / remove anwser 
            let selectedAnwserIds = [];
            if(selectedQuestion[0].AnswerList && selectedQuestion[0].AnswerList.length > 0 && (selectedQuestion[0].AnswerType == 1 || selectedQuestion[0].AnswerType == 9
              || (selectedQuestion[0].IsMultiRating && (selectedQuestion[0].AnswerType == 11 || selectedQuestion[0].AnswerType == 12)))){
              selectedQuestion[0].AnswerList.map(answer => {selectedAnwserIds.push(`a_${answer.AnswerId}`)});
            }
            currentNodePathDetail.map(path => {
              if(path.fromId == `q_${id}` || path.toId == `q_${id}` || 
              (selectedQuestion[0].AnswerType != 1 && selectedQuestion[0].AnswerType != 9 && selectedQuestion[0].AnswerType != 11 && selectedQuestion[0].AnswerType != 12 && (path.fromId == `qn_${id}` || path.toId == `qn_${id}`)) || 
              ((selectedQuestion[0].AnswerType == 1 || selectedQuestion[0].AnswerType == 9 || (selectedQuestion[0].IsMultiRating && (selectedQuestion[0].AnswerType == 11 || selectedQuestion[0].AnswerType == 12))) && 
              (selectedAnwserIds.includes(path.fromId) || selectedAnwserIds.includes(path.toId)))){
                LinksObj.FromId = path.fromId;
                LinksObj.FromType = path.fromType;
                LinksObj.IsCorrect = path.IsCorrect ? path.IsCorrect : false;
                LinksObj.ToId = path.toId;
                LinksObj.ToType = path.toType;
                selectedNodeLink.push(JSON.parse(JSON.stringify(LinksObj)));
              }
            });
            branchingLogicObj.Type = editType;
          }
          branchingLogicObj.Id = id;
          branchingLogicObj.Links = selectedNodeLink;
          branchingLogicObj.Position = [+xPosition, +yPosition];
          branchingLogicInSelectedNode.push(branchingLogicObj);
        }
    //branchingLogicData link end

        // create node
        var item = {
          Id: id,
          Type: 0,
          uid: '',
          Position: [+xPosition, +yPosition]
        };

        if(selectedQuestion && selectedQuestion.length > 0){
          if(selectedQuestion[0].Type == BranchingLogicEnum.QUESTION){
            item.Type = 2;
            item.uid = `q_${id}`;
            questionSvgAnimation(item, selectedQuestion);
          }else{
            item.Type = 6;
            item.uid = `c_${id}`;
            contentSvgAnimation(item, selectedQuestion);
          }
        }else if(selectedResult && selectedResult.length > 0){
          item.Type = 4;
          item.uid = `r_${id}`;
          resultSvgAnimation(item, selectedResult);
        }else if(selectedBadge && selectedBadge.length > 0){
          item.Type = 11;
          item.uid = `bd_${id}`;
          badgeSvgAnimation(item, selectedBadge);
        }
        if(currentNodePathDetail && currentNodePathDetail.length > 0){
          createPlottedPath(branchingLogicInSelectedNode);
        }
         this.getEditEvent();
        }
      }
  }

  branchingLogicSave(){
    let self=this;
    this.isBranchingLogicSubscription = this.quizBuilderDataService.isBranchingLogicSubmissionObservable.subscribe((item: any) => {
      if(item){
        self.updateBranchingLogic("cover", 0);
        self.quizBuilderDataService.isBranchingLogicSubmission='';
        self.quizBuilderDataService.changeBranchingLogicSubmission();
      }
    });
  }

  dataToSanitize(){
    if(this.branchingData.QuestionAndContentList){
    this.branchingData.QuestionAndContentList.forEach(element => {
      if(element.Type == 2){
        if(element.QuestionTxt){
        element.QuestionTxt = this.sharedService.sanitizeData(element.QuestionTxt);
        }
      }
      if(element.Type == 6){
        if(element.ContentTitle){
        element.ContentTitle =  this.sharedService.sanitizeData(element.ContentTitle);
        }
      }
    });
  }
  if(this.branchingData.ResultList){
    this.branchingData.ResultList.forEach(element => {
      if(element.ResultInternalTitle){
      element.ResultInternalTitle = this.sharedService.sanitizeData(element.ResultInternalTitle);
      }
    });
  }
  if(this.branchingData.BadgeList){
    this.branchingData.BadgeList.forEach(element => {
      if(element.BadgetTitle){
      element.BadgetTitle =  this.sharedService.sanitizeData(element.BadgetTitle);
      }
    });
  }
  }

  removeDataOnDrop(dataId, dataType) {
    var dataIndex;
    if (dataType == 2) {
      dataIndex = this.branchingData["QuestionAndContentList"].findIndex(removeData => {
        return removeData.QuestionId == dataId;
      });
      this.branchingData["QuestionAndContentList"].splice(dataIndex, 1);
    } else if (dataType == 4) {
      dataIndex = this.branchingData["ResultList"].findIndex(removeData => {
        return removeData.ResultId == dataId;
      });
      this.branchingData["ResultList"].splice(dataIndex, 1);
    } else if (dataType == 6) {
      dataIndex = this.branchingData["QuestionAndContentList"].findIndex(removeData => {
        return removeData.ContentId == dataId;
      });
      this.branchingData["QuestionAndContentList"].splice(dataIndex, 1);
    } else if (dataType == 11) {
      dataIndex = this.branchingData["BadgeList"].findIndex(removeData => {
        return removeData.BadgetId == dataId;
      });
      this.branchingData["BadgeList"].splice(dataIndex, 1);
    }
  }

  updatedBranchingDataList(branchingDataList) {
    var badgeIndex = [];
    var questionIndex = [];
    var resultIndex = [];
    branchingLogicData.forEach(data => {
      if (data.Type == 2 || data.Type == 6 || data.Type == 15) {
        this.branchingData["QuestionAndContentList"].forEach(questionData => {
          if(questionData.Type == 2 || data.Type == 15){
            if (questionData.QuestionId == data.Id) {
              questionIndex.push(
                this.branchingData["QuestionAndContentList"].findIndex(removeData => {
                  return removeData === questionData;
                })
              );
            }
          }
          if(questionData.Type == 6){
            if (questionData.ContentId == data.Id) {
              questionIndex.push(
                this.branchingData["QuestionAndContentList"].findIndex(removeData => {
                  return removeData === questionData;
                })
              );
            }
          }
        });
      } 
      if (data.Type == 4) {
        this.branchingData["ResultList"].forEach(resultData => {
          if (resultData.ResultId == data.Id) {
            resultIndex.push(
              this.branchingData["ResultList"].findIndex(removeData => {
                return removeData === resultData;
              })
            );
          }
        });
      } else if (data.Type == 11) {
        this.branchingData["BadgeList"].forEach(badgeData => {
          if (badgeData.BadgetId == data.Id) {
            badgeIndex.push(
              this.branchingData["BadgeList"].findIndex(removeData => {
                return removeData === badgeData;
              })
            );
          }
        });
      }
    });
    var dataArray = this.removeDataFromList(
      questionIndex,
      this.branchingData["QuestionAndContentList"],
      2
    );
    var dataArray = this.removeDataFromList(
      resultIndex,
      this.branchingData["ResultList"],
      4
    );
    var dataArray = this.removeDataFromList(
      badgeIndex,
      this.branchingData["BadgeList"],
      11
    );
  }

  removeDataFromList(indexArray, dataArray, Type) {
    indexArray.sort((a, b) => {
      if(+a > +b){
        return 1;
      }else{
        return -1;
      }
    });
    for (var i = indexArray.length - 1; i >= 0; i--) {
      dataArray.splice(indexArray[i], 1);
    }
    return dataArray;
  }

  updateBranchingLogic(element, Id) {
    if(this.updateBranching){
      this.updateBranching = false;
    updatedBranchingLogicLinksData = [];
    var link;
    var countStart = 0;
    this.dataChangeAccordingToNextBtn(pathDetails)
    pathDetails.forEach((path, index) => {
      link = [];
      if (path.fromType == 1) {
        var presentedLinkData = this.isDataPresent(path.fromParentID, 1);
        if (!presentedLinkData) {
          link = [
            {
              FromId: path.fromId,
              ToId: path.toId.split("_")[1],
              FromType: 1,
              ToType: path.toType
            }
          ];
          updatedBranchingLogicLinksData.push({
            Id: "start",
            Type: 1,
            // uid: "start",
            Position: [
              path.fromTypePosition[0].toString(),
              path.fromTypePosition[1].toString()
            ],
            Links: link.slice(0)
          });
        } else {
          link = [
            {
              FromId: path.fromId,
              ToId: path.toId,
              FromType: 1,
              ToType: path.toType
            }
          ];
          presentedLinkData.Links.push(link[0]);
        }
      } else if (path.fromType == 2 || path.fromType == 3 || path.fromType == 13) {
      
        var presentedLinkData = this.isDataPresent(path.fromParentID, 2);
        if (!presentedLinkData) {
          link = [
            {
              FromId: path.fromId.split("_")[1],
              ToId: path.toId == "start" ? path.toId : path.toId.split("_")[1],
              FromType: path.fromType,
              ToType: path.toType
            }
          ];
          // link = [{ fromId: path.fromId, toId: path.toId, fromType: path.fromType, toType: path.toType }];
          updatedBranchingLogicLinksData.push({
            Id: path.fromParentID.split("_")[1],
            Type: 2,
            // uid: path.fromParentID.split('_')[1],
            Position: [
              path.fromTypePosition[0].toString(),
              path.fromTypePosition[1].toString()
            ],
            Links: link.slice(0)
          });
        } else {
          link = [
            {
              FromId: path.fromId.split("_")[1],
              ToId: path.toId == "start" ? path.toId : path.toId.split("_")[1],
              FromType: path.fromType,
              ToType: path.toType
            }
          ];
          presentedLinkData.Links.push(link[0]);
        }
      } else if (path.fromType == 4 || path.fromType == 5) {
        var presentedLinkData = this.isDataPresent(path.fromParentID, 4);
        if (!presentedLinkData) {
          link = [
            {
              FromId: path.fromId.split("_")[1],
              ToId: path.toId == "start" ? path.toId : path.toId.split("_")[1],
              FromType: path.fromType,
              ToType: path.toType
            }
          ];
          updatedBranchingLogicLinksData.push({
            Id: path.fromParentID.split("_")[1],
            Type: 4,
            // uid: path.fromParentID.split('_')[1],
            Position: [
              path.fromTypePosition[0].toString(),
              path.fromTypePosition[1].toString()
            ],
            Links: link.slice(0)
          });
        } else {
          link = [
            {
              FromId: path.fromId.split("_")[1],
              ToId: path.toId == "start" ? path.toId : path.toId.split("_")[1],
              FromType: path.fromType,
              ToType: path.toType
            }
          ];
          presentedLinkData.Links.push(link[0]);
        }
      } else if (path.fromType == 6 || path.fromType == 7) {
        var presentedLinkData = this.isDataPresent(path.fromParentID, 6);
        if (!presentedLinkData) {
          link = [
            {
              FromId: path.fromId.split("_")[1],
              ToId: path.toId == "start" ? path.toId : path.toId.split("_")[1],
              FromType: path.fromType,
              ToType: path.toType
            }
          ];
          updatedBranchingLogicLinksData.push({
            Id: path.fromParentID.split("_")[1],
            Type: 6,
            // uid: path.fromParentID.split('_')[1],
            Position: [
              path.fromTypePosition[0].toString(),
              path.fromTypePosition[1].toString()
            ],
            Links: link.slice(0)
          });
        } else {
          link = [
            {
              FromId: path.fromId.split("_")[1],
              ToId: path.toId == "start" ? path.toId : path.toId.split("_")[1],
              FromType: path.fromType,
              ToType: path.toType
            }
          ];
          presentedLinkData.Links.push(link[0]);
        }
      } else if (path.fromType == 8) {
        var presentedLinkData = this.isDataPresent(path.fromParentID, 8);
        if (!this.isDataPresent(path.fromParentID, 8)) {
          link = [
            {
              FromId: path.fromId.split("_")[1],
              ToId: path.toId == "start" ? path.toId : path.toId.split("_")[1],
              FromType: path.fromType,
              ToType: path.toType
            }
          ];
          updatedBranchingLogicLinksData.push({
            Id: path.fromParentID.split("_")[1],
            Type: 8,
            // uid: path.fromParentID.split('_')[1],
            Position: [
              path.fromTypePosition[0].toString(),
              path.fromTypePosition[1].toString()
            ],
            Links: link.slice(0)
          });
        } else {
          link = [
            {
              FromId: path.fromId.split("_")[1],
              ToId: path.toId == "start" ? path.toId : path.toId.split("_")[1],
              FromType: path.fromType,
              ToType: path.toType
            }
          ];
          presentedLinkData.Links.push(link[0]);
        }
      } else if (path.fromType == 11) {
        var presentedLinkData = this.isDataPresent(path.fromParentID, 11);
        if (!this.isDataPresent(path.fromParentID, 11)) {
          link = [
            {
              FromId: path.fromId.split("_")[1],
              ToId: path.toId == "start" ? path.toId : path.toId.split("_")[1],
              FromType: path.fromType,
              ToType: path.toType
            }
          ];
          updatedBranchingLogicLinksData.push({
            Id: path.fromParentID.split("_")[1],
            Type: 11,
            // uid: path.fromParentID.split('_')[1],
            Position: [
              path.fromTypePosition[0].toString(),
              path.fromTypePosition[1].toString()
            ],
            Links: link.slice(0)
          });
        } else {
          link = [
            {
              FromId: path.fromId.split("_")[1],
              ToId: path.toId == "start" ? path.toId : path.toId.split("_")[1],
              FromType: path.fromType,
              ToType: path.toType
            }
          ];
          presentedLinkData.Links.push(link[0]);
        }
      } else if (path.fromType == 15 || path.fromType == 16) {
        var presentedLinkData = this.isDataPresent(path.fromParentID, 15);
        if (!presentedLinkData) {
          link = [
            {
              FromId: path.fromId.split("_")[1],
              ToId: path.toId == "start" ? path.toId : path.toId.split("_")[1],
              FromType: path.fromType,
              ToType: path.toType
            }
          ];
          updatedBranchingLogicLinksData.push({
            Id: path.fromParentID.split("_")[1],
            Type: 15,
            Position: [
              path.fromTypePosition[0].toString(),
              path.fromTypePosition[1].toString()
            ],
            Links: link.slice(0)
          });
        } else {
          link = [
            {
              FromId: path.fromId.split("_")[1],
              ToId: path.toId == "start" ? path.toId : path.toId.split("_")[1],
              FromType: path.fromType,
              ToType: path.toType
            }
          ];
          presentedLinkData.Links.push(link[0]);
        }
      }
    });
    pathDetails.forEach((path, index) => {
      if (path.toType == 1) {
        if (!this.isDataPresent(path.toParentID, 1)) {
          updatedBranchingLogicLinksData.push({
            Id: "start",
            Type: 1,
            // uid: "start",
            Position: [
              path.toTypePosition[0].toString(),
              path.toTypePosition[1].toString()
            ],
            Links: [{ FromId: "", ToId: "", FromType: 10, ToType: 10 }]
          });
        }
      } else if (path.toType == 2 || path.toType == 3 || path.toType == 13) {
        var presentedLinkData = this.isDataPresent(path.toParentID, 2);
        if (!presentedLinkData) {
          updatedBranchingLogicLinksData.push({
            Id: path.toParentID.split("_")[1],
            Type: 2,
            // uid: path.toParentID.split('_')[1],
            Position: [
              path.toTypePosition[0].toString(),
              path.toTypePosition[1].toString()
            ],
            Links: [{ FromId: "", ToId: "", FromType: 10, ToType: 10 }]
          });
        }
      } else if (path.toType == 4 || path.toType == 5) {
        var presentedLinkData = this.isDataPresent(path.toParentID, 4);
        if (!presentedLinkData) {
          updatedBranchingLogicLinksData.push({
            Id: path.toParentID.split("_")[1],
            Type: 4,
            // uid: path.toParentID.split('_')[1],
            Position: [
              path.toTypePosition[0].toString(),
              path.toTypePosition[1].toString()
            ],
            Links: [{ FromId: "", ToId: "", FromType: 10, ToType: 10 }]
          });
        }
      } else if (path.toType == 6 || path.toType == 7) {
        var presentedLinkData = this.isDataPresent(path.toParentID, 6);
        if (!presentedLinkData) {
          updatedBranchingLogicLinksData.push({
            Id: path.toParentID.split("_")[1],
            Type: 6,
            // uid: path.toParentID.split('_')[1],
            Position: [
              path.toTypePosition[0].toString(),
              path.toTypePosition[1].toString()
            ],
            Links: [{ FromId: "", ToId: "", FromType: 10, ToType: 10 }]
          });
        }
      } else if (path.toType == 8) {
        var presentedLinkData = this.isDataPresent(path.toParentID, 8);
        if (!presentedLinkData) {
          updatedBranchingLogicLinksData.push({
            Id: path.toParentID.split("_")[1],
            Type: path.toType,
            // uid: path.toParentID.split('_')[1],
            Position: [
              path.toTypePosition[0].toString(),
              path.toTypePosition[1].toString()
            ],
            Links: [{ FromId: "", ToId: "", FromType: 10, ToType: 10 }]
          });
        }
      } else if (path.toType == 11) {
        var presentedLinkData = this.isDataPresent(path.toParentID, 11);
        if (!presentedLinkData) {
          updatedBranchingLogicLinksData.push({
            Id: path.toParentID.split("_")[1],
            Type: path.toType,
            // uid: path.toParentID.split('_')[1],
            Position: [
              path.toTypePosition[0].toString(),
              path.toTypePosition[1].toString()
            ],
            Links: [{ FromId: "", ToId: "", FromType: 10, ToType: 10 }]
          });
        }
      } else if(path.toType == 15 || path.toType == 16){
        var presentedLinkData = this.isDataPresent(path.toParentID, 15);
        if (!presentedLinkData) {
          updatedBranchingLogicLinksData.push({
            Id: path.toParentID.split("_")[1],
            Type: 15,
            Position: [
              path.toTypePosition[0].toString(),
              path.toTypePosition[1].toString()
            ],
            Links: [{ FromId: "", ToId: "", FromType: 10, ToType: 10 }]
          });
        }
      }
    });
    updatedBranchingLogicLinksData.forEach(data => {
      if (data.Type != 1) {
        countStart++;
      }
    });
    if (countStart === updatedBranchingLogicLinksData.length) {
      updatedBranchingLogicLinksData.push({
        Id: "start",
        Type: 1,
        // uid: "start",
        Position: [
          startContentDetails.position[0].toString(),
          startContentDetails.position[1].toString()
        ],
        Links: [{ FromId: "", ToId: "", FromType: 10, ToType: 10 }]
      });
    }
    // branchingLogicData = updatedBranchingLogicLinksData.slice(0);
    var updatedData = {
      QuizId: this.quizId,
      QuizBranchingLogic: updatedBranchingLogicLinksData.slice(0)
    };
    let isLinkedNode =  this.getUnlinkNode(updatedBranchingLogicLinksData);
    this.isBranchingLogicVaild = isLinkedNode;
    if(isLinkedNode){
      this.quizBuilderApiService
      .updateBranchingLogicDetails(updatedData)
      .subscribe(
        data => {
          this.dataChangeAccordingUnLinkingIssue(pathDetails);
          // this.notificationsService.success("Updated Successfully");
        },
        error => {
          // this.notificationsService.error("Error");
        }
      );
      this.quizBuilderDataService.isBranchingLogicLinkSubmission="Save";
      this.quizBuilderDataService.changeBranchingLogicLinkSubmission();
      // if (element === "cover") {
      //   this.router.navigate(["../cover"], { relativeTo: this.route });
      // } else {
      //   if(this.quizData.IsQuesAndContentInSameTable && element === 'content'){
      //     this.router.navigate([`../question/${Id}`], { relativeTo: this.route });
      //   }else{
      //     this.router.navigate([`../${element}/${Id}`], { relativeTo: this.route });
      //   }
      // }
      this.updateBranching = true;
      this.quizBuilderDataService.isQuizConfigurationMenuSubmission='Slides';
      this.quizBuilderDataService.changeQuizConfigurationMenuSubmission();
    }else{
      this.dataChangeAccordingUnLinkingIssue(pathDetails);
      this.updateBranching = true;
      this.quizBuilderDataService.isBranchingLogicLinkSubmission="unlinked";
      this.quizBuilderDataService.changeBranchingLogicLinkSubmission();
    }
  }
  }

  getUnlinkNode(updatedBranchingLogicLinksData){
    let questionAndContentInRightSide = 0;
    let resultInRightSide = 0;
    let badgeInRightSide = 0;
    if(branchingLogicDataList["QuestionAndContentList"].length > 0 && branchingLogicDataList["QuestionAndContentList"].length > this.branchingData.QuestionAndContentList.length){
      questionAndContentInRightSide = branchingLogicDataList["QuestionAndContentList"].length - this.branchingData.QuestionAndContentList.length;
    }
    if(branchingLogicDataList["ResultList"].length > 0 && branchingLogicDataList["ResultList"].length > this.branchingData.ResultList.length){
      resultInRightSide = branchingLogicDataList["ResultList"].length - this.branchingData.ResultList.length;
    }
    if(branchingLogicDataList["BadgeList"].length > 0 && branchingLogicDataList["BadgeList"].length > this.branchingData.BadgeList.length){
      badgeInRightSide = branchingLogicDataList["BadgeList"].length - this.branchingData.BadgeList.length;
    }
    let notLinked =  this.language == 'en-US'? "is not linked." : "is niet gekoppeld";
    if((questionAndContentInRightSide + resultInRightSide + badgeInRightSide + 1) > updatedBranchingLogicLinksData.length){
      if(((questionAndContentInRightSide + resultInRightSide + badgeInRightSide + 1) - updatedBranchingLogicLinksData.length) > 1){
        this.notificationsService.error(this.language == 'en-US'? "The branching logic is not correctly linked." : "De boomstructuur is niet correct gekoppeld.");
        return false;
      }else{
       let linkStart = this.onCheckStartIsLinked(updatedBranchingLogicLinksData,false);
       if(!linkStart){
        return false;
       }else{
        let questionContentInBranchingLogic = [];
        let resultInBranchingLogic = [];
        let badgetInBranchingLogic = [];
         questionContentInBranchingLogic = JSON.parse(JSON.stringify(this.branchingData.QuestionAndContentList));
         resultInBranchingLogic = JSON.parse(JSON.stringify(this.branchingData.ResultList));
         badgetInBranchingLogic = JSON.parse(JSON.stringify(this.branchingData.BadgeList));
        let questionContentList = [];
        let resultList = [];
        let badgeList = [];
        updatedBranchingLogicLinksData.map(logicData => {
          if(logicData.Type == 2){
            questionContentInBranchingLogic.push({QuestionId:logicData.Id,Type:2});
            questionContentList.push({QuestionId:logicData.Id,Type:2});
          }else if(logicData.Type == 6){
            questionContentInBranchingLogic.push({ContentId:logicData.Id,Type:6});
            questionContentList.push({ContentId:logicData.Id,Type:6});
          }else if(logicData.Type == 15){
            questionContentInBranchingLogic.push({QuestionId:logicData.Id,Type:15});
            questionContentList.push({QuestionId:logicData.Id,Type:15});
          }else if(logicData.Type == 4){
            resultInBranchingLogic.push({ResultId:logicData.Id});
            resultList.push({ResultId:logicData.Id});
          }else if(logicData.Type == 11){
            badgetInBranchingLogic.push({BadgetId:logicData.Id});
            badgeList.push({BadgetId:logicData.Id});
          }
        });
        //question and content check
        if(questionAndContentInRightSide > questionContentList.length){
          for(let i=0; i<branchingLogicDataList["QuestionAndContentList"].length; i++){
            let unlinkNode = true;
            for(let j=0; j<questionContentInBranchingLogic.length; j++){
              if(branchingLogicDataList["QuestionAndContentList"][i].Type == 2 && branchingLogicDataList["QuestionAndContentList"][i].QuestionId == questionContentInBranchingLogic[j].QuestionId){
                unlinkNode = false;
              }else if(branchingLogicDataList["QuestionAndContentList"][i].Type == 6 && branchingLogicDataList["QuestionAndContentList"][i].ContentId == questionContentInBranchingLogic[j].ContentId){
                unlinkNode = false;
              }
            }
            if(unlinkNode){
              if(branchingLogicDataList["QuestionAndContentList"][i].Type == 2){
                const fiteredTitle = filterPipe.transform(branchingLogicDataList["QuestionAndContentList"][i].QuestionTxt ? branchingLogicDataList["QuestionAndContentList"][i].QuestionTxt : 'Question');
                this.notificationsService.error(`${fiteredTitle.length >= 20 ? fiteredTitle.substring(0, 20) + '...' : fiteredTitle} ${notLinked}`);
                return false;
              }else if(branchingLogicDataList["QuestionAndContentList"][i].Type == 6){
                const fiteredTitle = filterPipe.transform(branchingLogicDataList["QuestionAndContentList"][i].ContentTitle ? branchingLogicDataList["QuestionAndContentList"][i].ContentTitle : 'Content');
                this.notificationsService.error(`${fiteredTitle.length >= 20 ? fiteredTitle.substring(0, 20) + '...' : fiteredTitle} ${notLinked}`);
                return false;
              }
            }
          }
          //result check
        }else if(resultInRightSide > resultList.length){
          for(let i=0; i<branchingLogicDataList["ResultList"].length; i++){
            let unlinkNode = true;
            for(let j=0; j<resultInBranchingLogic.length; j++){
              if(branchingLogicDataList["ResultList"][i].ResultId == resultInBranchingLogic[j].ResultId){
                unlinkNode = false;
              }
            }
            if(unlinkNode){
                const fiteredTitle = filterPipe.transform(branchingLogicDataList["ResultList"][i].ResultInternalTitle ? branchingLogicDataList["ResultList"][i].ResultInternalTitle : 'Result');
                this.notificationsService.error(`${fiteredTitle.length >= 20 ? fiteredTitle.substring(0, 20) + '...' : fiteredTitle} ${notLinked}`);
                return false;
            }
          }
          //badget check
        }else if(badgeInRightSide > badgeList.length){
          for(let i=0; i<branchingLogicDataList["BadgeList"].length; i++){
            let unlinkNode = true;
            for(let j=0; j<badgetInBranchingLogic.length; j++){
              if(branchingLogicDataList["BadgeList"][i].BadgetId == badgetInBranchingLogic[j].BadgetId){
                unlinkNode = false;
              }
            }
            if(unlinkNode){
                const fiteredTitle = filterPipe.transform(branchingLogicDataList["BadgeList"][i].BadgetTitle ? branchingLogicDataList["BadgeList"][i].BadgetTitle : 'Badge');
                this.notificationsService.error(`${fiteredTitle.length >= 20 ? fiteredTitle.substring(0, 20) + '...' : fiteredTitle} ${notLinked}`);
                return false;
            }
          }
        }
       }
      }
    }else if(updatedBranchingLogicLinksData.length > 1){
      let linkStart = this.onCheckStartIsLinked(updatedBranchingLogicLinksData,true);
      return linkStart;
    }else{
      return true;
    }

  }

  onCheckStartIsLinked(updatedBranchingLogicLinksData,allNodeLink){
      //start node link
      let startIndex = updatedBranchingLogicLinksData.findIndex(linkData => {
        return linkData.Id === "start";
      });
      if(startIndex >= 0){
        if(updatedBranchingLogicLinksData[startIndex].Links[0].FromId === "start"){
          return true;
        }else{
          for(let i=0; i<updatedBranchingLogicLinksData.length; i++){
            if(i != startIndex && updatedBranchingLogicLinksData[i].Links.length > 0){
              for(let j=0; j<updatedBranchingLogicLinksData[i].Links.length; j++){
                if(updatedBranchingLogicLinksData[i].Links[j].ToId === "start"){
                  return true;
                }
              }
            }
          }
        }
        let notLinked =  this.language == 'en-US'? "The cover is not yet linked" : "Het voorblad is nog niet gekoppeld";
        if(allNodeLink){
          this.notificationsService.error(notLinked);
        }else{
          this.notificationsService.error(this.language == 'en-US'? "The branching logic is not correctly linked." : "De boomstructuur is niet correct gekoppeld.");
        }
        return false;   
      }
  }

  /**
   * change type of node when any next button is present
   * @param pathDetails Path details
   */
  dataChangeAccordingToNextBtn(pathDetails){
    pathDetails.forEach((path) => {
      if(path.fromType == 3){
        if(path.fromId.match('qn')){
          path.fromType = 13
        }
      }else if(path.toType == 3){
        if(path.toId.match('qn')){
          path.toType = 13
        }
      }
    })
  }


  dataChangeAccordingUnLinkingIssue(pathDetails){
    pathDetails.forEach((path) => {
      if(path.fromType == 13){
        if(path.fromId.match('qn')){
          path.fromType = 3
        }
      }else if(path.toType == 13){
        if(path.toId.match('qn')){
         path.toType = 3
        }
      }
    })
  }

  addDeletedData(deletedData, Type) {
    if (Type == 2) {
      this.branchingData["QuestionAndContentList"].push(deletedData);
    } else if (Type == 4) {
      this.branchingData["ResultList"].push(deletedData);
    } else if (Type == 6) {
      this.branchingData["QuestionAndContentList"].push(deletedData);
    } else if (Type == 11) {
      this.branchingData["BadgeList"].push(deletedData);
    }
  }

  isDataPresent(ID, type) {
    var dataPresent = false;
    var uniqueId;
    var linkData;
    if (!updatedBranchingLogicLinksData.length) {
      dataPresent = false;
    } else {
      updatedBranchingLogicLinksData.forEach(data => {
        if (type === data.Type && data.Id == "start") {
          dataPresent = true;
          linkData = data;
        } else if (type === data.Type && data.Id == ID.split("_")[1]) {
          dataPresent = true;
          linkData = data;
        }
      });
    }
    return linkData;
  }

  // public svgWidth = updatedWidth;
  // public svgHeight = updatedHeight;
  addWidth(width) {
    this.svgWidth += width;
    updatedWidth = this.svgWidth;
    $(".expend-map-width").css("left", `${updatedWidth}px`);
  }

  addHeight(height) {
    this.svgHeight += height;
    updatedHeight = this.svgHeight;
    $(".expend-map-height").css("top", `${updatedHeight}px`);
  }


  //left side changes
  // add question
  onAddQuestion(type){
    this.quizBuilderApiService.addQuestionQuiz(this.quizId,type,this.isWhatsappEnable).subscribe(data => {
      if(data){
        this.createQuestion(type,data);
      }
    });
  }

  onDuplicateQuestion(questionId){
    this.quizBuilderApiService.addDuplicateQuestionQuiz(this.quizId,questionId).subscribe(data => {
      if(data){
        this.createQuestion(data.Type,data);
      }
    });
  }

  createQuestion(type,data){
    data.QuestionTxt = data.QuestionTitle;
    data.ContentTitle = data.QuestionTitle;
    data.ContentId = data.QuestionId;
    data.ContentDescription = data.Description;
    if(data.AnswerList && data.AnswerList.length > 0){
      data.AnswerList.map(answer => {
        answer.AnswerTxt = answer.AnswerText;
        answer.IsCorrect = answer.IsCorrectAnswer;
      });
    }
    if(type == 2){
      this.questionCount = this.questionCount + 1;
    }
    this.branchingData['QuestionAndContentList'].push(data);
    branchingLogicDataList["QuestionAndContentList"].push(data);
    this.quizData.QuestionAndContent.push(data);
    this.notificationsService.success("Success");
    if(type == 2){
      this.onEditQuiz(2,data.QuestionId,true);
      this.setUpdatedQuizData(this.quizData);
      //update result range
      if (this.quizData.QuizTypeId == 2 || this.quizData.QuizTypeId == 5) {
        this.quizzToolHelper.updateSidebarResultRange.next("Add-Question");
        if(this.quizData.Results && this.quizData.Results.length > 0 && this.branchingData['ResultList'] && this.branchingData['ResultList'].length > 0){
          let updatedResultRange = this.quizData.Results[this.quizData.Results.length - 1];
            let resultIndex = this.branchingData['ResultList'].findIndex(result => {
              return updatedResultRange.ResultId == result.ResultId;
            });
            if(resultIndex >= 0){
              this.branchingData['ResultList'][resultIndex].MinScore = updatedResultRange.MinScore;
              this.branchingData['ResultList'][resultIndex].MaxScore = updatedResultRange.MaxScore;
            }
        }
      }
    }else{
      this.onEditQuiz(6,data.QuestionId,true);
    }
  } 

  //add result
  onAddResult(){
    this.quizBuilderApiService.addResultToQuiz(this.quizId).subscribe(
      data => {
        if(data){
          this.createResult(data);
        }
      });
  }

  onDuplicateResult(resultId){
    this.quizBuilderApiService.addDuplicateResultQuiz(this.quizId,resultId).subscribe(data => {
      if(data){
        this.createResult(data);
      }
    });
  }

  createResult(data){
    data.ResultInternalTitle = data.InternalTitle;
    data.IsPersonalityCorrelatedResult = false;
    this.resultCount = this.resultCount + 1;
    this.branchingData['ResultList'].push(data);
    branchingLogicDataList["ResultList"].push(data);
    this.quizData.Results.push(data);
    this.notificationsService.success("Success");
    this.onEditQuiz(4,data.ResultId,true,data);
    this.setUpdatedQuizData(this.quizData);
    if (this.quizData.QuizTypeId == 2 || this.quizData.QuizTypeId == 5 || this.quizData.QuizTypeId == 4 || this.quizData.QuizTypeId == 6) {
    this.quizzToolHelper.updateSidebarResultRange.next("Add-Result");
    this.updateResultRange();
    }else if(this.quizData.QuizTypeId == 3 || this.quizData.QuizTypeId == 7) {
    this.quizzToolHelper.updateMultipleData.next("");
    }
  }

  //add badges
  onAddBadges(){
    this.quizBuilderApiService.createNewBadge(this.quizId).subscribe(
      data => {
        if(data){
          data.BadgetId = data.Id;
          data.BadgetTitle = data.Title;
          this.branchingData['BadgeList'].push(data);
          branchingLogicDataList["BadgeList"].push(data);
          this.notificationsService.success("Success");
          this.onEditQuiz(11,data.Id,true,data);
        }
      });
  }

  //add content
  onAddContent(){
    this.quizBuilderApiService.addNewContent(this.quizId).subscribe(
      data => {
        if(data){
          data.ContentId = data.Id;
          data.Type = 6;
          this.branchingData['QuestionAndContentList'].push(data);
          branchingLogicDataList["QuestionAndContentList"].push(data);
          this.quizData.QuestionAndContent.push(data);
          this.notificationsService.success("Success");
          this.onEditQuiz(6,data.Id,true);
        }
      });
  }


  onRemovedPopup(template: TemplateRef<any>,id,index,type) {
    this.removeData = {
      id:id,
      index:index,
      type:type
    };
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  //Modal decline
  cancel(): void {
    this.modalRef.hide();
  }

  onRemove(){
    if(this.removeData.type == 2){
      this.removeQuestion(this.removeData.id, this.removeData.index, this.removeData.type);
    }else if(this.removeData.type == 6){
      if(this.quizData.IsQuesAndContentInSameTable){
        this.removeQuestion(this.removeData.id, this.removeData.index, this.removeData.type);
      }else{
        this.removeContent(this.removeData.id, this.removeData.index);
      }
    }else if(this.removeData.type == 4){
      this.removeResult(this.removeData.id, this.removeData.index);
    }else if(this.removeData.type == 11){
      this.removeBadge(this.removeData.id, this.removeData.index);
    }
    this.modalRef.hide();
  }

    /**
   * Function to remove Question against questionId
   */
     removeQuestion(questionId, index, type) {
      this.branchingData['QuestionAndContentList'].splice(index, 1);
      if(this.questionCount > 0 && type == 2){
        this.questionCount = this.questionCount - 1;
      }

      let questionIndex = branchingLogicDataList["QuestionAndContentList"].findIndex(removeQuestion => {
        if(type == 2){
          return removeQuestion.Type == type && questionId == removeQuestion.QuestionId;
        }else{
          return removeQuestion.Type == type && questionId == removeQuestion.ContentId;
        }
      });

      if(questionIndex >= 0){
        branchingLogicDataList["QuestionAndContentList"].splice(questionIndex, 1);
      }

      let quesIndex = this.quizData.QuestionAndContent.findIndex(removeQuestion => {
        if(type == 2){
          return removeQuestion.Type == type && questionId == removeQuestion.QuestionId;
        }else{
          return removeQuestion.Type == type && questionId == removeQuestion.QuestionId;
        }
      });

      if(quesIndex >= 0){
        this.quizData.QuestionAndContent.splice(quesIndex, 1);
      }

      this.setUpdatedQuizData(this.quizData);
      this.quizBuilderApiService.removeQuestion(questionId).subscribe(
        data => {
          this.notificationsService.success("Success");
          //update result range
          if(type == 2 && (this.quizData.QuizTypeId == 2 || this.quizData.QuizTypeId == 5)){
            this.quizzToolHelper.updateSidebarResultRange.next("Remove-Question");
            this.updateResultRange();
          }
          if (type == 2 && (this.quizData.QuizTypeId == 4 || this.quizData.QuizTypeId == 6)) {
            this.quizzToolHelper.updatedResultRange.next("");
          }
        },
        error => { }
      );
    }

    removeContent(id, index) {
      this.branchingData['QuestionAndContentList'].splice(index, 1);

      let questionIndex = branchingLogicDataList["QuestionAndContentList"].findIndex(removeQuestion => {
        return removeQuestion.Type == 6 && id == removeQuestion.ContentId;
      });

      if(questionIndex >= 0){
        branchingLogicDataList["QuestionAndContentList"].splice(questionIndex, 1);
      }

      let quesIndex = this.quizData.QuestionAndContent.findIndex(removeQuestion => {
        return removeQuestion.Type == 6 && id == removeQuestion.Id;
      });

      if(quesIndex >= 0){
        this.quizData.QuestionAndContent.splice(quesIndex, 1);
      }

      this.quizBuilderApiService.removeQuizContent(id).subscribe(
        data => {
          this.notificationsService.success("Success");
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
    this.branchingData['ResultList'].splice(index, 1);

    let resultIndex = branchingLogicDataList["ResultList"].findIndex(removeResult => {
      return resultId == removeResult.ResultId;
    });

    if(resultIndex >= 0){
      branchingLogicDataList["ResultList"].splice(resultIndex, 1);
    }

    let resIndex = this.quizData.Results.findIndex(removeRes => {
      return resultId == removeRes.ResultId;
    });

    if(this.resultCount > 0){
      this.resultCount = this.resultCount - 1;
    }
    this.quizBuilderApiService.removeResultQuiz(resultId).subscribe(
      data => {
        this.notificationsService.success("Success");
        if (this.quizData.QuizTypeId == 2 || this.quizData.QuizTypeId == 5) {
          this.resultRangeDataFactory.deletedResultIndex = resIndex;
          this.quizzToolHelper.updateSidebarResultRange.next("Remove-Result");
          if(resIndex >= 0){
            this.quizData.Results.splice(resIndex, 1);
          }
          this.setUpdatedQuizData(this.quizData);
          if(this.quizData.Results && this.quizData.Results.length > 0 && this.branchingData['ResultList'] && this.branchingData['ResultList'].length > 0){
            let updatedResultRange = this.quizData.Results[this.quizData.Results.length - 1];
              let resultIndex = this.branchingData['ResultList'].findIndex(result => {
                return updatedResultRange.ResultId == result.ResultId;
              });
              if(resultIndex >= 0){
                this.branchingData['ResultList'][resultIndex].MinScore = updatedResultRange.MinScore;
                this.branchingData['ResultList'][resultIndex].MaxScore = updatedResultRange.MaxScore;
              }
          }
        }else if(this.quizData.QuizTypeId == 3 || this.quizData.QuizTypeId == 7) {
          this.quizzToolHelper.updateMultipleData.next("");
        }
      },
      error => {}
    );
  }

  /**
   * Function to Badge Badge Against BadgeId
   */
  removeBadge(id, index) {
    this.branchingData['BadgeList'].splice(index, 1);

    let badgeIndex = branchingLogicDataList["BadgeList"].findIndex(removeBadge => {
      return id == removeBadge.BadgetId;
    });

    if(badgeIndex >= 0){
      branchingLogicDataList["BadgeList"].splice(badgeIndex, 1);
    }

    this.quizBuilderApiService.removeBadge(id).subscribe(
      data => {
        this.notificationsService.success("Success");
      },
      error => {
        this.notificationsService.error("Error");
      }
    );
  }

  // open Multiple Result Component Accordingly
  openMultiple() {
    if(this.checked){
      this.status = 1;
    }else{
      this.status = 3;
    }
    this.quizBuilderApiService
    .updatePersonalityResultStatus(this.quizId, this.status)
    .subscribe(data => {
      this.notificationsService.success(
        "Multiple-Result",
        "Multiple result enable option has been changed"
      )
    }, (error) => {
      this.notificationsService.error('Error');
    });
  }

  //result range
  datachange(e) {
    this.quizData.Results.forEach((result, index) => {
      if(e[index]){
        result.MinScore = e[index].MinScore;
        result.MaxScore = e[index].MaxScore;
        let resultIndex = this.branchingData['ResultList'].findIndex(resultData => {
          return result.ResultId == resultData.ResultId;
        });
        if(resultIndex >= 0){
          this.branchingData['ResultList'][resultIndex].MinScore = e[index].MinScore;
          this.branchingData['ResultList'][resultIndex].MaxScore = e[index].MaxScore;
        }
      }
    });
    this.resultRangeDataFactory.updateResultRangeApi(this.quizData.Results);
  }

  setUpdatedQuizData(quizData) {
    this.quizzToolHelper.updatedQuizData.next(quizData);
  }

  updateResultRange(){
    if(this.quizData.Results && this.quizData.Results.length > 0 && this.branchingData['ResultList'] && this.branchingData['ResultList'].length > 0){
      this.branchingData['ResultList'].map(result => {
        this.quizData.Results.map(res => {
          if(res.ResultId == result.ResultId){
            result.MinScore = res.MinScore;
            result.MaxScore = res.MaxScore;
          }
        });
      });
    }
  }

  settingResultRange() {
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

    //update result range in edit question result mapping
    this.updateResultRange();

    this.quizBuilderApiService
      .updateResultRangeData(resultRangeBody)
      .subscribe(data => { });
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

  //change question to content and vice vasha
  getUpdateQuestion(){
    this.isQuestionUpdateSubscription = this.dynamicMediaReplaceService.isSelectedQuesAndContentObservable.subscribe(text => {
      if(text && Object.keys(text).length != 0 && this.quizData.IsQuesAndContentInSameTable){
        if(this.quizData.QuestionAndContent && this.quizData && this.quizData.QuestionAndContent.length > 0){
          this.quizData.QuestionAndContent.map(data => {
            if(data.QuestionId == text.questionId){
              if(text.type == 2){
                if(data.Type != 2){
                  data.Type = 2;
                  if (this.quizData.QuizTypeId == 2 || this.quizData.QuizTypeId == 5) {
                    this.quizzToolHelper.updateSidebarResultRange.next("Add-Question");
                    if(this.quizData.Results && this.quizData.Results.length > 0 && this.branchingData['ResultList'] && this.branchingData['ResultList'].length > 0){
                      let updatedResultRange = this.quizData.Results[this.quizData.Results.length - 1];
                        let resultIndex = this.branchingData['ResultList'].findIndex(result => {
                          return updatedResultRange.ResultId == result.ResultId;
                        });
                        if(resultIndex >= 0){
                          this.branchingData['ResultList'][resultIndex].MinScore = updatedResultRange.MinScore;
                          this.branchingData['ResultList'][resultIndex].MaxScore = updatedResultRange.MaxScore;
                        }
                    }
                  }else if(this.quizData.QuizTypeId == 4 || this.quizData.QuizTypeId == 6) {
                    this.quizzToolHelper.updatedResultRange.next("");
                  }              
                }
              }else{
                if(data.Type != 6){
                  data.Type = 6;
                  if (this.quizData.QuizTypeId == 2 || this.quizData.QuizTypeId == 5) {
                    this.quizzToolHelper.updateSidebarResultRange.next("Remove-Question");
                    this.updateResultRange();
                  }else if (this.quizData.QuizTypeId == 4 || this.quizData.QuizTypeId == 6) {
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

  getQuizConfigrationTab(){
    this.isQuizConfigrationSubscription = this.quizBuilderDataService.isQuizConfigurationMenuSubmissionObservable.subscribe((item: any) => {
      this.activeTab = item?item:"Slides";
      if(this.activeTab=="Styles"){
        this.onStyleing();
      }
    });
  }

  onClickedEnable(){
    this.updateBranchingLogic("cover", 0);
    if(this.isBranchingLogicVaild){
    this.quizData.IsBranchingLogicEnabled = !this.quizData
      .IsBranchingLogicEnabled;
    setTimeout(() => {
    this.quizBuilderApiService
      .updateBranchingLogicState(
        this.quizId,
        this.quizData.IsBranchingLogicEnabled
      )
      .subscribe(
        data => {
          if(!this.quizData.IsBranchingLogicEnabled){
            this.router.navigate(['/quiz-builder/quiz-tool',this.quizId,'cover']);
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
    }, 1000);
    }else{
       $("#enableBranching").prop("checked", true);
    }
  }

  onAccessibility(){
    this.quizAccessibility.clear();
    if(this.editQuiz){
      this.editQuiz.clear();
    }
    var QUIZ_accessibility = this._crf.resolveComponentFactory(
      OfficeCompanyComponent
    );
    var QUIZ_accessibilityComponentRef = this.quizAccessibility.createComponent(
      QUIZ_accessibility
    );
  }

  onAttachments(){
    this.quizAttachments.clear();
    if(this.editQuiz){
      this.editQuiz.clear();
    }
    var QUIZ_attachment = this._crf.resolveComponentFactory(
      AttachmentsComponent
    );
    var QUIZ_attachmentComponentRef = this.quizAttachments.createComponent(
      QUIZ_attachment
    );
  }

  onAttemptsSetting(){
    this.quizAttemptsSettings.clear();
    if(this.editQuiz){
      this.editQuiz.clear();
    }
    var QUIZ_attemptsSetting = this._crf.resolveComponentFactory(
      PreviousQuestionComponent
    );
    var QUIZ_attemptsSettingComponentRef = this.quizAttemptsSettings.createComponent(
      QUIZ_attemptsSetting
    );
  }

  dynamicTemplateShare() {
    this.shareQuizTemplate.clear();
    if(this.editQuiz){
      this.editQuiz.clear();
    }
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
    this.quizBuilderDataService.changeQuizHeader(undefined);
    this.isBranchingLogicSubscription.unsubscribe();
    updatedBranchingLogicLinksData = [];
    oneLineDetails = [];
    pathDetails = [];
    questionDetails = [];
    resultDetails = [];
    contentDetails = [];
    badgeDetails = [];
    updatedQuestionData = [];
    updatedResultData = [];
    updatedActionData = [];
    updatedContentData = [];
    updatedBadgeData = [];
    scrollPageX = 0;
    scrollPageY = 0;
    if (this.dragulaServiceOutSubscription) {
      this.dragulaServiceOutSubscription.unsubscribe();
      corX = 10;
      corY = 10;
    }
    this.sidebar[0].style.display = "block";
    this.isQuizConfigrationSubscription.unsubscribe();
    this.resultRangeDataFactory.removeSubscriptionEvent();
    this.MaxScoreSubscription.unsubscribe();
    if (this.updatedRange) {
      this.updatedRange.unsubscribe();
    }
    if(this.isQuestionUpdateSubscription){
      this.isQuestionUpdateSubscription.unsubscribe();
    }
    if(this.isWhatsappEnableSubscription){
      this.isWhatsappEnableSubscription.unsubscribe();
    }
    if(this.isSuccessSubmissionSubscription){
      this.isSuccessSubmissionSubscription.unsubscribe();
    }
  }
}

var pageX, pageY;
var scrollPageX = 0,
  scrollPageY = 0;
$("body").mousemove(function(e) {
  pageX = e.pageX - 310 + +scrollPageX;
  pageY = e.pageY - 55 + +scrollPageY;
  if (clickOnACircle) {
    createAShadowPath("Dragged");
  }
});

$("body").click(function(e) {
  if (
    e.target.id === "svgout" &&
    deleteOptionGroup &&
    editToBuilderOptionGroup &&
    unlinkOptionGroup &&
    duplicateOptionGroup
  ) {
    deleteOptionGroup.remove();
    editToBuilderOptionGroup.remove();
    unlinkOptionGroup.remove();
    duplicateOptionGroup.remove();
    uniqueMoreOptionsId = "";
  }
  createAShadowPath(`Clicked_${e.target.id}`);
});

document.addEventListener(
  "scroll",
  function(event) {
    if (event.target["className"] === "logic-data") {
      scrollPageX = event.target['scrollLeft'];
      scrollPageY = event.target['scrollTop'];
      var leftScrollData = event.target['scrollLeft'];
      var topScrollData = event.target['scrollTop'];
      // var margin_top_Data = +event.srcElement.scrollTop - updatedWidth - 5;
      $(".expend-map-width")
        .css("top", `${topScrollData}px`)
        .css("left", `${updatedWidth}px`);
      $(".expend-map-height")
        .css("left", `${leftScrollData}px`)
        .css("top", `${updatedHeight}px`);
    }
  },
  true /*Capture event*/
);

function createDataforSVG(Id, Data, Type) {
  if (Type === BranchingLogicEnum.QUESTION) {
    var data = {
      Id: Id,
      Type: Type,
      uid: `q_${Id}`,
      Position: [+pageX, +pageY]
    };
    questionSvgAnimation(data, Data);
  } else if (Type === BranchingLogicEnum.RESULT) {
    var data = {
      Id: Id,
      Type: Type,
      uid: `r_${Id}`,
      Position: [+pageX, +pageY]
    };
    resultSvgAnimation(data, Data);
  }else if (Type === BranchingLogicEnum.CONTENT) {
    var data = {
      Id: Id,
      Type: Type,
      uid: `c_${Id}`,
      Position: [+pageX, +pageY]
    };
    contentSvgAnimation(data, Data);
  } else if (Type === BranchingLogicEnum.BADGE) {
    var data = {
      Id: Id,
      Type: Type,
      uid: `bd_${Id}`,
      Position: [+pageX, +pageY]
    };
    badgeSvgAnimation(data, Data);
  }
}

function createSvgAnimation(branchingLogicData) {
  branchingLogicData.forEach(data => {
    if (data.Type == BranchingLogicEnum.START) {
      startSvgAnimation(data,branchingLogicDataList);
    } else if (data.Type == BranchingLogicEnum.QUESTION) {
      questionSvgAnimation(data, branchingLogicDataList["QuestionAndContentList"]);
    } else if (data.Type == BranchingLogicEnum.RESULT) {
      resultSvgAnimation(data, branchingLogicDataList["ResultList"]);
    } else if (data.Type == BranchingLogicEnum.CONTENT) {
      contentSvgAnimation(data, branchingLogicDataList["QuestionAndContentList"]);
    } else if (data.Type == BranchingLogicEnum.BADGE) {
      badgeSvgAnimation(data, branchingLogicDataList["BadgeList"]);
    } else if (data.Type == BranchingLogicEnum.WHATSAPPTEMPLATE) {
      let selectedTemplateData:any;
      if(branchingLogicDataList["QuestionAndContentList"] &&  branchingLogicDataList["QuestionAndContentList"].length > 0){
        for(let i=0; i<branchingLogicDataList["QuestionAndContentList"].length; i++){
          if(branchingLogicDataList["QuestionAndContentList"][i].Type == BranchingLogicEnum.WHATSAPPTEMPLATE){
            branchingLogicDataList["QuestionAndContentList"][i].QuestionTitle = branchingLogicDataList["QuestionAndContentList"][i].QuestionTxt;
            selectedTemplateData = branchingLogicDataList["QuestionAndContentList"][i];
            componentReference.selectedTemplate = branchingLogicDataList["QuestionAndContentList"][i];
            break;
          }
        }
      }
     questionSvgAnimation(data, branchingLogicDataList["QuestionAndContentList"]);
    }
  });
  createPlottedPath(branchingLogicData);
}

function createPlottedPath(branchingLogicData) {
  for (var i = 0; i < branchingLogicData.length; i++) {
    for (var j = 0; j < branchingLogicData[i].Links.length; j++) {
      var branchingLogicDataFormTypeparm =branchingLogicData[i].Links[j].FromType;
      var branchingLogicDataToTypeparm =branchingLogicData[i].Links[j].ToType;
      if (branchingLogicDataFormTypeparm == BranchingLogicEnum.START) {
        updateOneLineArrayDetail(
          startContentDetails.Scx,
          startContentDetails.Scy,
          startContentDetails.SgroupId,
          startContentDetails.ID,
          1,
          startContentDetails.position.slice(0)
        );
      } else if (
        branchingLogicDataFormTypeparm == BranchingLogicEnum.QUESTION ||
        branchingLogicDataFormTypeparm == BranchingLogicEnum.ANSWER || 
        branchingLogicDataFormTypeparm == BranchingLogicEnum.QUESTIONNEXT ||
        branchingLogicDataFormTypeparm == BranchingLogicEnum.WHATSAPPTEMPLATE ||
        branchingLogicDataFormTypeparm == BranchingLogicEnum.WHATSAPPTEMPLATEACTION
      ) {
        questionDetails.forEach(questionData => {
          if (questionData.QgroupId === branchingLogicData[i].Links[j].FromId) {
            updateOneLineArrayDetail(
              questionData.Qcx,
              questionData.Qcy,
              questionData.QgroupId,
              questionData.ID,
              branchingLogicDataFormTypeparm == 13 ? 3 : branchingLogicDataFormTypeparm,
              questionData.position.slice(0)
            );
          } else {
            questionData.AnswerDetails.forEach(answerData => {
              if (
                answerData.AgroupId === branchingLogicData[i].Links[j].FromId
              ) {
                updateOneLineArrayDetail(
                  answerData.Acx,
                  answerData.Acy,
                  answerData.AgroupId,
                  questionData.ID,
                  branchingLogicDataFormTypeparm == 13 ? 3 : branchingLogicDataFormTypeparm,
                  questionData.position.slice(0),
                  answerData.IsCorrect
                );
              }
            });
          }
        });
      } else if (
        branchingLogicDataFormTypeparm == BranchingLogicEnum.RESULT ||
        branchingLogicDataFormTypeparm == BranchingLogicEnum.RESULTNEXT
      ) {
        resultDetails.forEach(resultData => {
          if (resultData.RgroupId === branchingLogicData[i].Links[j].FromId) {
            updateOneLineArrayDetail(
              resultData.Rcx,
              resultData.Rcy,
              resultData.RgroupId,
              resultData.ID,
              4,
              resultData.position.slice(0)
            );
          } else if (
            resultData.BgroupId === branchingLogicData[i].Links[j].FromId
          ) {
            updateOneLineArrayDetail(
              resultData.Bcx,
              resultData.Bcy,
              resultData.BgroupId,
              resultData.ID,
              5,
              resultData.position.slice(0)
            );
          }
        });
      } else if (
        branchingLogicDataFormTypeparm == BranchingLogicEnum.CONTENT ||
        branchingLogicDataFormTypeparm == BranchingLogicEnum.CONTENTNEXT
      ) {
        contentDetails.forEach(contentData => {
          if (contentData.CgroupId === branchingLogicData[i].Links[j].FromId) {
            updateOneLineArrayDetail(
              contentData.Ccx,
              contentData.Ccy,
              contentData.CgroupId,
              contentData.ID,
              branchingLogicDataFormTypeparm,
              contentData.position.slice(0)
            );
          } else if (
            contentData.CBgroupId === branchingLogicData[i].Links[j].FromId
          ) {
            updateOneLineArrayDetail(
              contentData.CBcx,
              contentData.CBcy,
              contentData.CBgroupId,
              contentData.ID,
              branchingLogicDataFormTypeparm,
              contentData.position.slice(0)
            );
          }
        });
      } else if (branchingLogicDataFormTypeparm == BranchingLogicEnum.BADGE) {
        badgeDetails.forEach(badgeData => {
          if (badgeData.BDgroupId === branchingLogicData[i].Links[j].FromId) {
            updateOneLineArrayDetail(
              badgeData.BDcx,
              badgeData.BDcy,
              badgeData.BDgroupId,
              badgeData.ID,
              branchingLogicDataFormTypeparm,
              badgeData.position.slice(0)
            );
          }
        });
      }
      if (branchingLogicDataToTypeparm == BranchingLogicEnum.START) {
        updateOneLineArrayDetail(
          startContentDetails.Scx,
          startContentDetails.Scy,
          startContentDetails.SgroupId,
          startContentDetails.Scx.ID,
          branchingLogicDataToTypeparm,
          startContentDetails.position.slice(0)
        );
      } else if (
        branchingLogicDataToTypeparm === BranchingLogicEnum.QUESTION ||
        branchingLogicDataToTypeparm == BranchingLogicEnum.ANSWER ||
        branchingLogicDataToTypeparm === BranchingLogicEnum.WHATSAPPTEMPLATE ||
        branchingLogicDataToTypeparm === BranchingLogicEnum.WHATSAPPTEMPLATEACTION
      ) {
        questionDetails.forEach(questionData => {
          if (questionData.QgroupId === branchingLogicData[i].Links[j].ToId) {
            updateOneLineArrayDetail(
              questionData.Qcx,
              questionData.Qcy,
              questionData.QgroupId,
              questionData.ID,
              branchingLogicDataToTypeparm,
              questionData.position.slice(0)
            );
          } else {
            questionData.AnswerDetails.forEach(answerData => {
              if (answerData.AgroupId === branchingLogicData[i].Links[j].ToId) {
                updateOneLineArrayDetail(
                  answerData.Acx,
                  answerData.Acy,
                  answerData.AgroupId,
                  questionData.ID,
                  branchingLogicDataToTypeparm,
                  questionData.position.slice(0),
                  answerData.IsCorrect
                );
              }
            });
          }
        });
      } else if (
        branchingLogicDataToTypeparm == BranchingLogicEnum.RESULT ||
        branchingLogicDataToTypeparm == BranchingLogicEnum.RESULTNEXT
      ) {
        resultDetails.forEach(resultData => {
          if (resultData.RgroupId === branchingLogicData[i].Links[j].ToId) {
            updateOneLineArrayDetail(
              resultData.Rcx,
              resultData.Rcy,
              resultData.RgroupId,
              resultData.ID,
              branchingLogicDataToTypeparm,
              resultData.position.slice(0)
            );
          } else if (
            resultData.BgroupId === branchingLogicData[i].Links[j].ToId
          ) {
            updateOneLineArrayDetail(
              resultData.Bcx,
              resultData.Bcy,
              resultData.BgroupId,
              resultData.Id,
              branchingLogicDataToTypeparm,
              resultData.position.slice(0)
            );
          }
        });
      } else if (
        branchingLogicDataToTypeparm == BranchingLogicEnum.CONTENT ||
        branchingLogicDataToTypeparm == BranchingLogicEnum.CONTENTNEXT
      ) {
        contentDetails.forEach(contentData => {
          if (contentData.CgroupId === branchingLogicData[i].Links[j].ToId) {
            updateOneLineArrayDetail(
              contentData.Ccx,
              contentData.Ccy,
              contentData.CgroupId,
              contentData.ID,
              branchingLogicDataToTypeparm,
              contentData.position.slice(0)
            );
          } else if (
            contentData.CBgroupId === branchingLogicData[i].Links[j].ToId
          ) {
            updateOneLineArrayDetail(
              contentData.CBcx,
              contentData.CBcy,
              contentData.CBgroupId,
              contentData.ID,
              branchingLogicDataToTypeparm,
              contentData.position.slice(0)
            );
          }
        });
      } else if (branchingLogicDataToTypeparm == BranchingLogicEnum.BADGE) {
        badgeDetails.forEach(badgeData => {
          if (badgeData.BDgroupId === branchingLogicData[i].Links[j].ToId) {
            updateOneLineArrayDetail(
              badgeData.BDcx,
              badgeData.BDcy,
              badgeData.BDgroupId,
              badgeData.ID,
              branchingLogicDataToTypeparm,
              badgeData.position.slice(0)
            );
          }
        });
      }
      drowOneLineDetails();
    }
  }
}

function createDefaultTemplateSvgAnimation(){
  let windowWidth = window.innerWidth;
  let templateXPosition = (windowWidth/2) - 430;
  let fobjectSVG = `<svg>
    <foreignObject width="240" height="75">
      <body>
        <div class="temp">
          <div class="temp-btn-block">
            <button class="temp-btn app-data" id='tb_Template' app-data="edit-quiz">Select template</button>
          </div>
        </div>
      </body>
    </foreignObject>
  </svg>`;
  let div1 = Snap.parse(fobjectSVG);
  let g2 = s.group().attr({ id: "Template" });
  let g1 = g2
    .group()
    .append(div1)
    .transform(`t${+templateXPosition}, ${0}`);
    demoTemplateContentDetails = {
      ID: "Template",
      SgroupId: "template",
      Scx: +templateXPosition + 120,
      Scy: 75,
      position: [+templateXPosition, 0]
    };
    g2.drag(demoTemplateDragMove, demoTemplateDragStart, demoTemplateOnmove);
}

function demoTemplateDragMove(dx, dy) {
  if (
    demoTemplateContentDetails.position[0] + dx >= 0 &&
    demoTemplateContentDetails.position[0] + dx <= updatedWidth - 115
  ) {
    updatedDemoTemplateContentData = {
      ID: demoTemplateContentDetails.ID,
      SgroupId: demoTemplateContentDetails.SgroupId,
      Scx: demoTemplateContentDetails.Scx + dx,
      Scy: demoTemplateContentDetails.Scy + 0,
      position: [
        demoTemplateContentDetails.position[0] + dx,
        demoTemplateContentDetails.position[1] + 0
      ]
    };
    this.attr({
      transform:
        this.data("origTransform") +
        (this.data("origTransform") ? "T" : "t") +
        [dx, 0]
    });
    var draggedStart = $(`#Template`).find(
      ".template"
    )[0];
    isMoveCount = isMoveCount + 1;
    if(isMoveCount > 1){
      $(draggedStart).addClass("drag-item");
      $(draggedStart).removeClass("app-data");
    }
  }
}

function demoTemplateDragStart() {
  this.data("origTransform", this.transform().local);
}

function demoTemplateOnmove() {
  if (updatedDemoTemplateContentData) {
    var draggedStart = $(`#Template`).find(
      ".template "
    )[0];
    demoTemplateContentDetails = Object.assign({}, updatedDemoTemplateContentData);
    setTimeout(() => {
      if(isMoveCount > 1){
        $(draggedStart).removeClass("drag-item");
        $(draggedStart).addClass("app-data");
      }
      isMoveCount = 0;
    }, 200);
  }
}

function startSvgAnimation(startData,data) {
  let windowWidth = window.innerWidth;
  startData.Position[0] = (windowWidth/2) - 430;
  /**
   * create a Start details div
   */

   const filterSelectedCover = filterPipe.transform(data && data.QuizCoverTitle ? data.QuizCoverTitle : 'Untitled Cover');
   const filterSelectedCoverDes = filterPipe.transform(data && data.ShowDescription ? (data && data.QuizDescription) ? data.QuizDescription : 'Description' : '');
  var fobjectSVG = `<svg>
    <foreignObject width="240" height="75">
    <body>
    <div class="start app-data pointer" app-data="edit-quiz">
    <div class="title-gutter">Voorblad</div>
      <div class="cover-gutter">
        <span title="${filterSelectedCover}">
        ${filterSelectedCover}
        </span>
        <small title="${filterSelectedCoverDes}">
        ${filterSelectedCoverDes}
        </small>
      </div>
    </div>
    </body>
    </foreignObject>
    </svg>`;

  var div1 = Snap.parse(fobjectSVG);
  var c1 = s
    .circle(120, 75, 10)
    .attr({ fill: "#fff", stroke: "#ccc", cursor: "pointer" })
    .addClass("join");
  var g2;
  if(componentReference.quizData.usageType && componentReference.quizData.usageType.includes(usageTypeEnum.WhatsApp_Chatbot)){
    g2 = s.group().attr({ id: "Start" , class:'display-none' });
  }else{
    g2 = s.group().attr({ id: "Start" });
  }
  var g1 = g2
    .group()
    .append(div1)
    .append(c1)
    .transform(`t${+startData.Position[0]}, ${+startData.Position[1]}`);
  startContentDetails = {
    ID: "Start",
    SgroupId: "start",
    Scx: +startData.Position[0] + 120,
    Scy: +startData.Position[1] + 75,
    position: [+startData.Position[0], +startData.Position[1]]
  };
  g2.drag(startDragMove, startDragStart, startOnmove);
  c1.click(clickStartButton, g1);
  c1.click(updateCircleDetails, c1);
}

function startOnmove(x) {
  if (updatedStartContentData) {
    var draggedStart = $(`#Start`).find(
      ".start "
    )[0];
    startContentDetails = Object.assign({}, updatedStartContentData);
    setTimeout(() => {
      if(isMoveCount > 1){
        $(draggedStart).removeClass("drag-item");
        $(draggedStart).addClass("app-data");
      }
      isMoveCount = 0;
    }, 200);
  }

  // updatedStartContentData = {};
}

function startDragMove(dx, dy) {
  if (
    startContentDetails.position[0] + dx >= 0 &&
    startContentDetails.position[0] + dx <= updatedWidth - 115
  ) {
    updatedStartContentData = {
      ID: startContentDetails.ID,
      SgroupId: startContentDetails.SgroupId,
      Scx: startContentDetails.Scx + dx,
      Scy: startContentDetails.Scy + 0,
      position: [
        startContentDetails.position[0] + dx,
        startContentDetails.position[1] + 0
      ]
    };

    if (oneLineDetails.length) {
      if (oneLineDetails[0].groupId === updatedStartContentData.SgroupId) {
        oneLineDetails[0].x1 = updatedStartContentData.Scx;
        oneLineDetails[0].y1 = updatedStartContentData.Scy;
      }
    }
    this.attr({
      transform:
        this.data("origTransform") +
        (this.data("origTransform") ? "T" : "t") +
        [dx, 0]
    });
    var draggedStart = $(`#Start`).find(
      ".start "
    )[0];
    isMoveCount = isMoveCount + 1;
    if(isMoveCount > 1){
      $(draggedStart).addClass("drag-item");
      $(draggedStart).removeClass("app-data");
    }
    dragLineDrawWithStart(updatedStartContentData);
  }
}

function startDragStart() {
  this.data("origTransform", this.transform().local);
}

function dragLineDrawWithStart(updatedStartContentData) {
  pathDetails.forEach(path => {
    if (path.fromId === updatedStartContentData.SgroupId) {
      path.pathBetween.remove();
      drawLine(
        updatedStartContentData.SgroupId,
        path.toId,
        updatedStartContentData.Scx,
        updatedStartContentData.Scy,
        path.x2,
        path.y2,
        updatedStartContentData.ID,
        path.toParentID,
        BranchingLogicEnum.START,
        path.toType,
        updatedStartContentData.position.slice(0),
        path.toTypePosition.slice(0),
        "Drag"
      );
    } else if (path.toId === updatedStartContentData.SgroupId) {
      path.pathBetween.remove();
      drawLine(
        path.fromId,
        updatedStartContentData.SgroupId,
        path.x1,
        path.y1,
        updatedStartContentData.Scx,
        updatedStartContentData.Scy,
        path.fromParentID,
        updatedStartContentData.ID,
        path.fromType,
        BranchingLogicEnum.START,
        path.fromTypePosition.slice(0),
        updatedStartContentData.position.slice(0),
        "Drag"
      );
    }
  });
}

function clickStartButton() {
  updateOneLineArrayDetail(
    startContentDetails.Scx,
    startContentDetails.Scy,
    startContentDetails.SgroupId,
    startContentDetails.ID,
    1,
    startContentDetails.position.slice(0)
  );
  drowOneLineDetails();
}

/**
 * Question Svg creation
 */

 var questionSvgObj = {
  selectedQuestion : '',
  selectedQuestionAnswerType : 1,
  selectedQuizType: 2,
  selectedAnswerList: [],
  answerListData: [],
  w:100,
  parentFObjSVG: '',
  fobjectSVG: '',
  selectedQuestionShowAnswerImage: false,
  selectedQuestionDescription:'',
  isWhatsappTemplate: false,
  showTitle: false,
  showDescription: false,
  h:110,
  enableMultiRatingType: false
};

function questionSvgAnimation(questionData, QuestionData) {
  questionSvgObj.selectedQuestion = '';
  questionSvgObj.selectedQuestionAnswerType = 1;
  questionSvgObj.selectedQuizType = 2;
  questionSvgObj.selectedAnswerList = [];
  questionSvgObj.answerListData = [];
  questionSvgObj.w = 100;
  questionSvgObj.parentFObjSVG = '';
  questionSvgObj.fobjectSVG = '';
  questionSvgObj.selectedQuestionShowAnswerImage = false;
  questionSvgObj.selectedQuestionDescription = '';
  questionSvgObj.isWhatsappTemplate = false;
  questionSvgObj.showTitle = false;
  questionSvgObj.showDescription = false;
  questionSvgObj.h = 110;
  questionSvgObj.enableMultiRatingType = false;

  // find slected question
  getSelectedQuestion(questionData,QuestionData);
  // create question head
  createQuestionSvgHeadAnimation(questionData);
  let hideClass = '';
  let joinClass = 'join';
  if((componentReference.oldWhatsappFlow && componentReference.firstQuesAndContentObj.Type == BranchingLogicEnum.QUESTION && questionData.Id == componentReference.firstQuesAndContentObj.Id) || questionData.Type == BranchingLogicEnum.WHATSAPPTEMPLATE){
    hideClass = 'display-none';
    joinClass = 'join display-none'
  }
  var circleRect = s.rect(questionSvgObj.w, -20, 20, 30).attr({ fill: "transparent" });
  var optionC1 = s
    .circle(questionSvgObj.w + 10, -10, 2)
    .attr({ fill: "black" })
    .addClass("join");
  var optionC2 = s
    .circle(questionSvgObj.w + 10, -5, 2)
    .attr({ fill: "black" })
    .addClass("join");
  var optionC3 = s
    .circle(questionSvgObj.w + 10, 0, 2)
    .attr({ fill: "black" })
    .addClass("join");
  var groupOption = s
    .group()
    .append(circleRect)
    .append(optionC1)
    .append(optionC2)
    .append(optionC3)
    .attr({ cursor: "pointer", class: hideClass });
  var parentDiv = Snap.parse(questionSvgObj.parentFObjSVG);
  var div1 = Snap.parse(questionSvgObj.fobjectSVG);
  var c1 = s
    .circle(questionSvgObj.w / 2, -20, 10)
    .attr({ fill: "#fff", stroke: "#ccc", cursor: "pointer" })
    .addClass(joinClass);
  let contentId = questionData.Type == BranchingLogicEnum.WHATSAPPTEMPLATE ? `T_${questionData.Id}` : `Q_${questionData.Id}`;
  var g2 = s.group().attr({ id: contentId });
  var g3 = g2
    .group()
    .append(parentDiv)
    .transform(
      `t${+questionData.Position[0] - 20},${+questionData.Position[1] - 20}`
    );
  let subContentId = questionData.Type == BranchingLogicEnum.WHATSAPPTEMPLATE ? `t_${questionData.Id}` :`q_${questionData.Id}`;
  var g1 = g2
    .group()
    .append(div1)
    .append(groupOption)
    .append(c1)
    .attr({ id: subContentId })
    .transform(`t${+questionData.Position[0]},${+questionData.Position[1]}`);

  /**
   * create AnswerList Details div corresponding to above question
   */
  createQuestionAnswerListSvgAnimation(questionData,g2);

  if (!isDuplicate(contentId, questionDetails)) {
    questionDetails.push({
      ID: contentId,
      QgroupId: subContentId,
      Qcx: +questionData.Position[0] + questionSvgObj.w / 2,
      Qcy: +questionData.Position[1] - 20,
      position: [+questionData.Position[0], +questionData.Position[1]],
      AnswerDetails: questionSvgObj.answerListData.splice(0),
      width: questionSvgObj.w,
      Type: questionData.Type
    });
  }

  g2.drag(questionDragMove, questionDragStart, questionOnmove);
  groupOption.click(openMoreOption, g1);
  c1.click(clickOnCircle, g1);
  c1.click(updateCircleDetails, c1);
}

function getSelectedQuestion(questionData,QuestionData){
  for(let i=0; i<QuestionData.length; i++){
    if(QuestionData[i].Type == 2 || QuestionData[i].Type == 15){
      if (QuestionData[i].QuestionId == questionData.Id) {
        questionSvgObj.selectedQuestion = QuestionData[i].QuestionTitle ? QuestionData[i].QuestionTitle : QuestionData[i].QuestionTxt ? QuestionData[i].QuestionTxt : '';
        questionSvgObj.selectedQuestionAnswerType = QuestionData[i].AnswerType;
        questionSvgObj.selectedAnswerList = QuestionData[i].AnswerList;
        questionSvgObj.selectedQuizType = componentReference.quizData.QuizTypeId;
        questionSvgObj.selectedQuestionShowAnswerImage = QuestionData[i].ShowAnswerImage;
        questionSvgObj.enableMultiRatingType = QuestionData[i].IsMultiRating;
        if(questionSvgObj.enableMultiRatingType && (questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.ratingEmoji || questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.ratingStar)){
          questionSvgObj.w = QuestionData[i].AnswerList.length > 0 ? 5 * 150 : 150;
        }else{
          questionSvgObj.w = QuestionData[i].AnswerList.length > 0 ? QuestionData[i].AnswerList.length * 150 : 150;
        }
        questionSvgObj.selectedQuestionDescription = QuestionData[i].ContentDescription;
        questionSvgObj.showTitle = QuestionData[i].ShowTitle;
        questionSvgObj.showDescription = QuestionData[i].ShowDescription;
        break;
      }
    }
  }

  if(questionSvgObj.selectedQuestionShowAnswerImage){
    questionSvgObj.selectedAnswerList.forEach(item => {
      item.AnswerOptionImage = item.AnswerImage ? item.AnswerImage : item.AnswerOptionImage;
      if (item.AnswerOptionImage) {
        item.imageORvideo = componentReference.commonService.getImageOrVideo(item.AnswerOptionImage);
      }
    });
  }
}

function createQuestionSvgHeadAnimation(questionData){
  if(questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.smallText || questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.largeText) {
    questionSvgObj.w = questionSvgObj.w + 100;
  }else if(questionSvgObj.enableMultiRatingType && questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.ratingEmoji){
    questionSvgObj.h = 165;
  }else if(questionSvgObj.enableMultiRatingType && questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.ratingStar){
    questionSvgObj.h = 145;
  }
  questionSvgObj.parentFObjSVG = `<svg>
  <foreignObject width=${questionSvgObj.w + 40} height=${questionSvgObj.h}>
  <body>
  <div class="#$quesBoxDivClass$# app-data pointer" id=qb_${questionData.Id} app-data="edit-quiz">
  #$tempQuesDiv$#
  </div>
  </body>
  </foreignObject>
  </svg>`;

  if(questionData.Type == BranchingLogicEnum.WHATSAPPTEMPLATE){
    let tempQuesDiv = `<div style="padding-top: 6px;text-align: center;font-weight: 700;">whatsapp template:</div>`;
    questionSvgObj.parentFObjSVG = questionSvgObj.parentFObjSVG.replace("#$tempQuesDiv$#", tempQuesDiv);
    questionSvgObj.parentFObjSVG = questionSvgObj.parentFObjSVG.replace("#$quesBoxDivClass$#", 'tempbox-gutter');
  }else{
    let tempQuesDiv = `<div class="title-gutter">Vragen</div>`;
    questionSvgObj.parentFObjSVG = questionSvgObj.parentFObjSVG.replace("#$tempQuesDiv$#", tempQuesDiv);
    questionSvgObj.parentFObjSVG = questionSvgObj.parentFObjSVG.replace("#$quesBoxDivClass$#", 'box-gutter');
  }

  //create a Question details div
  const fiteredesc = filterPipe.transform(questionSvgObj.selectedQuestionDescription ? questionSvgObj.selectedQuestionDescription : '');
  const filterSelectedQuestion = filterPipe.transform(questionSvgObj.selectedQuestion ? questionSvgObj.selectedQuestion : '');

  questionSvgObj.fobjectSVG = `<svg>
  <foreignObject width=${questionSvgObj.w} height="38">
  <body>
    <div class="#$quesDivClass$# app-data pointer" app-data="edit-quiz" id=${
      questionData.Id
    } #$tempQuesDivStyle$#>#$questionTitle$#
    #$questionDesc$#
    </div>
  </body>
  </foreignObject>
  </svg>`;

  let quesTitleDiv = `<span title="${filterSelectedQuestion}">${filterSelectedQuestion}</span>`;
  if(questionData.Type == BranchingLogicEnum.WHATSAPPTEMPLATE){
    let tempQuesDiv = `style="padding-top: 10px;"`;
    questionSvgObj.fobjectSVG = questionSvgObj.fobjectSVG.replace("#$tempQuesDivStyle$#", tempQuesDiv);
    questionSvgObj.fobjectSVG = questionSvgObj.fobjectSVG.replace("#$quesDivClass$#", 'temp-gutter');
    questionSvgObj.fobjectSVG = questionSvgObj.fobjectSVG.replace("#$questionTitle$#", quesTitleDiv);
    questionSvgObj.fobjectSVG = questionSvgObj.fobjectSVG.replace("#$questionDesc$#", '');
  }else{
    questionSvgObj.fobjectSVG = questionSvgObj.fobjectSVG.replace("#$tempQuesDivStyle$#", '');
    questionSvgObj.fobjectSVG = questionSvgObj.fobjectSVG.replace("#$quesDivClass$#", 'quest-gutter');
    let quesDescDiv = questionSvgObj.showDescription ? `<small title="${fiteredesc}">${fiteredesc}</small>` : '';
    questionSvgObj.fobjectSVG = questionSvgObj.fobjectSVG.replace("#$questionDesc$#", quesDescDiv);
    if(componentReference.quizData && componentReference.quizData.usageType && componentReference.quizData.usageType.includes(usageTypeEnum.WebFlow)){
      questionSvgObj.fobjectSVG = questionSvgObj.fobjectSVG.replace("#$questionTitle$#", quesTitleDiv);
    }else{
      questionSvgObj.fobjectSVG = questionSvgObj.fobjectSVG.replace("#$questionTitle$#", questionSvgObj.showTitle ? quesTitleDiv : '');
    }
  }
}

function createQuestionAnswerListSvgAnimation(questionData,g2){
  for (var i = 0; i < questionSvgObj.selectedAnswerList.length; i++) {
    if(questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.singleSelect || questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.lookingForJob  || questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.availability){
        if(questionData.Type == BranchingLogicEnum.WHATSAPPTEMPLATE){
          questionSvgObj.isWhatsappTemplate = true;
          questionSvgObj.selectedAnswerList[i].IsCorrect = false;
          questionSvgObj.selectedAnswerList[i].AnswerTxt = questionSvgObj.selectedAnswerList[i].AnswerText ? questionSvgObj.selectedAnswerList[i].AnswerText : questionSvgObj.selectedAnswerList[i].AnswerTxt;
        }
      createSingleSelectQuestionSvgAnimation(i,questionData,g2);
    }else if((questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.multiSelect  || (questionSvgObj.selectedQuestionAnswerType > answerTypeEnum.largeText && questionSvgObj.selectedQuestionAnswerType <= answerTypeEnum.postCode)) 
    || (!questionSvgObj.enableMultiRatingType && ( questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.ratingEmoji || questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.ratingStar))){
      createMultiSelectQuestionSvgAnimation(i,questionData,g2);
    }else if(questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.smallText || questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.largeText){
      createFreeTextQuestionSvgAnimation(i,questionData,g2);
    }else if(questionSvgObj.enableMultiRatingType && (questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.ratingEmoji || questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.ratingStar)){
      createRatingSelectQuestionSvgAnimation(i,questionData,g2);
    }
  }
}

function createSingleSelectQuestionSvgAnimation(i,questionData,g2){
  var answerCircle;
  var fobjectSVGans;
  if(questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.availability){
    questionSvgObj.selectedAnswerList[i].AnswerTxt = (i == 0) ? componentReference.quizData.QuizBrandingAndStyle.Language == BrandingLanguage.English ? 'Immediately' : 'Per direct' : (i == 1) ? componentReference.quizData.QuizBrandingAndStyle.Language == BrandingLanguage.English  ? 'Within 3 months' : 'Binnen 3 maanden' : 
    componentReference.quizData.QuizBrandingAndStyle.Language == BrandingLanguage.English  ? 'After 3 months' : 'Na 3 maanden';
  }
  const fiteredAnwserText = filterPipe.transform(questionSvgObj.selectedAnswerList[i].AnswerTxt ? questionSvgObj.selectedAnswerList[i].AnswerTxt : '');
    fobjectSVGans = `<svg>
    <foreignObject width="140" height="50">
    <body>
    <div class="option-container" [id]=${questionSvgObj.selectedAnswerList[i].AnswerId}>
    <div class="option-image-con tainer">#$answerImage$#</div>
    <div class="option-gutter" title="${fiteredAnwserText}">${fiteredAnwserText}</div>
    #$associatedScoreDiv$#
    <div class="correct-option">
      <i class="fa fa-check" aria-hidden="true"></i>
    </div>
    <div class="link-to-block">Link to Block</div>
    </div>
    </body>
    </foreignObject>
    </svg>`;

    // if answer type image and video
    if(questionSvgObj.selectedQuestionShowAnswerImage){
      if(questionSvgObj.selectedAnswerList[i].imageORvideo == 'image'){
        let answerImage = `<img class="option-image" src=${questionSvgObj.selectedAnswerList[i].AnswerOptionImage}></img>`;
        fobjectSVGans = fobjectSVGans.replace("#$answerImage$#", answerImage);
      }else if(questionSvgObj.selectedAnswerList[i].imageORvideo == 'video'){
        let answerVideo = `<video class="option-image" width="40" height="40" controls> <source src=${ questionSvgObj.selectedAnswerList[i].AnswerOptionImage }> </video>`;
        fobjectSVGans = fobjectSVGans.replace("#$answerImage$#", answerVideo);
      }else{
        let answerImage = `<img class="option-image" src=${componentReference.defaultImage}></img>`;
        fobjectSVGans = fobjectSVGans.replace("#$answerImage$#", answerImage);
      }
    }else{
      fobjectSVGans = fobjectSVGans.replace("#$answerImage$#", '');
    }

    //score type quiz
    if(questionSvgObj.selectedQuizType === quizTypeEnum.Score && questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.singleSelect && !questionSvgObj.isWhatsappTemplate){
      let associatedScore = `<div class="option-associated-score"><b>${questionSvgObj.selectedAnswerList[i].AssociatedScore ? questionSvgObj.selectedAnswerList[i].AssociatedScore : 0}</b>pt</div>`;
      fobjectSVGans = fobjectSVGans.replace("#$associatedScoreDiv$#", associatedScore);
    }else{
      fobjectSVGans = fobjectSVGans.replace("#$associatedScoreDiv$#", '');
    }

    let fillColor = questionSvgObj.selectedAnswerList[i].IsCorrect ? "transparent" : "#fff";

    answerCircle = s
    .circle(70, 45, 10)
    .attr({ fill: fillColor, stroke: "#fff", "stroke-width": 4,cursor: "pointer" })
    .addClass("join");

    var divANS = Snap.parse(fobjectSVGans);
    let answerId = questionData.Type == BranchingLogicEnum.WHATSAPPTEMPLATE ? `ta_${questionSvgObj.selectedAnswerList[i].AnswerId}` : `a_${questionSvgObj.selectedAnswerList[i].AnswerId}`;
    var answergroup = g2
      .group()
      .append(divANS)
      .append(answerCircle)
      .attr({ id: answerId })
      .transform(
        `t${+questionData.Position[0] + i * 150},${+questionData.Position[1] +
          40}`
      );
    answerCircle.click(clickOnCircle, answergroup);
    answerCircle.click(updateCircleDetails, answerCircle);
    questionSvgObj.answerListData.push({
      AgroupId: answerId,
      Acx: +questionData.Position[0] + 70 + i * 150,
      Acy: +questionData.Position[1] + 85,
      IsCorrect: questionSvgObj.selectedAnswerList[i].IsCorrect
    });
}

function createFreeTextQuestionSvgAnimation(i,questionData,g2){
  var answerCircle;
    const fiteredAnwserText = filterPipe.transform(questionSvgObj.selectedAnswerList[i].AnswerTxt ? questionSvgObj.selectedAnswerList[i].AnswerTxt : '');
    var fobjectSVGans = `<svg>
          <foreignObject width="240" height="50">
            <body>
              <div class="text-type-option">
                <div class="option-gutter" [id]=${questionSvgObj.selectedAnswerList[i].AnswerId} title="${fiteredAnwserText}">${fiteredAnwserText}</div>
              </div>
            </body>
          </foreignObject>
        </svg>`;
    var divANS = Snap.parse(fobjectSVGans);
    var answergroup = g2
      .group()
      .append(divANS)
      .attr({ id: `a_${questionSvgObj.selectedAnswerList[i].AnswerId}` })
      .transform(
        `t${+questionData.Position[0] + i * 150},${+questionData.Position[1] +
          40}`
      );
      if(i == 0){
        var fobjectSVGansNextBtn = `<svg></svg>`;
        answerCircle = s
        .circle(50, 0, 10)
        .attr({ fill: "#fff", stroke: "#fff", "stroke-width": 4, cursor: "pointer" })
        .addClass("join");

        var divANSNextBtn = Snap.parse(fobjectSVGansNextBtn);
        var answerNextBtngroup = g2
          .group()
          .append(divANSNextBtn)
          .append(answerCircle)
          .attr({ id: `qn_${questionData.Id}` })
          .transform(
            `t${+questionData.Position[0] + questionSvgObj.w/2 - 50},${+questionData.Position[1] + 90}`
          );
        answerCircle.click(clickOnCircle, answerNextBtngroup);
        answerCircle.click(updateCircleDetails, answerCircle);
        questionSvgObj.answerListData.push({
          AgroupId: `qn_${questionData.Id}`,
          Acx: +questionData.Position[0] + 70 + questionSvgObj.w/2 - 70,
          Acy: +questionData.Position[1] + 90,
          IsCorrect: false
        });
      }
}

function createMultiSelectQuestionSvgAnimation(i,questionData,g2){
  var answerCircle;
  var fobjectSVGans;
    if(questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.dateOfBirth){
      questionSvgObj.selectedAnswerList[i].AnswerTxt = "Date of birth";
    }else if(questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.postCode){
      questionSvgObj.selectedAnswerList[i].AnswerTxt = "Postal code";
    }else if(questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.ratingEmoji){
      questionSvgObj.selectedAnswerList[i].AnswerTxt = "Rating for emoji";
    }else if(questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.ratingStar){
      questionSvgObj.selectedAnswerList[i].AnswerTxt = "Rating for star";
    }
    const fiteredAnwserText = filterPipe.transform(questionSvgObj.selectedAnswerList[i].AnswerTxt ? questionSvgObj.selectedAnswerList[i].AnswerTxt : '');
    
    fobjectSVGans = `<svg>
    <foreignObject width="140" height="50">
    <body>
    <div class="option-container">
    <div class="option-image-con tainer">#$answerImage$#</div>
    <div class="option-gutter" [id]=${questionSvgObj.selectedAnswerList[i].AnswerId} title="${fiteredAnwserText}">${
      fiteredAnwserText
    }</div>
    #$associatedScoreDiv$#
    </div>
    </body>
    </foreignObject>
    </svg>`;

    if(questionSvgObj.selectedQuestionShowAnswerImage){
      if(questionSvgObj.selectedAnswerList[i].AnswerOptionImage) {
        if(questionSvgObj.selectedAnswerList[i].imageORvideo == 'image'){
          let answerImage = `<img class="option-image" src=${questionSvgObj.selectedAnswerList[i].AnswerOptionImage}></img>`;
          fobjectSVGans = fobjectSVGans.replace("#$answerImage$#", answerImage);
        }else if(questionSvgObj.selectedAnswerList[i].imageORvideo == 'video'){
          let answerVideo = `<video class="option-image" width="40" height="40" controls> <source src=${ questionSvgObj.selectedAnswerList[i].AnswerOptionImage }> </video>`;
          fobjectSVGans = fobjectSVGans.replace("#$answerImage$#", answerVideo);
        }
      }else{
        let answerImage = `<img class="option-image" src=${componentReference.defaultImage}></img>`;
        fobjectSVGans = fobjectSVGans.replace("#$answerImage$#", answerImage);
      }
    }else{
      fobjectSVGans = fobjectSVGans.replace("#$answerImage$#", '');
    }

    //score type quiz
    if(questionSvgObj.selectedQuizType === quizTypeEnum.Score && questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.multiSelect){
      let associatedScore = `<div class="option-associated-score"><b>${questionSvgObj.selectedAnswerList[i].AssociatedScore ? questionSvgObj.selectedAnswerList[i].AssociatedScore : 0}</b>pt</div>`;
      fobjectSVGans = fobjectSVGans.replace("#$associatedScoreDiv$#", associatedScore);
    }else{
      fobjectSVGans = fobjectSVGans.replace("#$associatedScoreDiv$#", '');
    }

    var divANS = Snap.parse(fobjectSVGans);
    var answergroup = g2
      .group()
      .append(divANS)
      .attr({ id: `a_${questionSvgObj.selectedAnswerList[i].AnswerId}` })
      .transform(
        `t${+questionData.Position[0] + i * 150},${+questionData.Position[1] +
          40}`
      );
      if(i == 0){
        var fobjectSVGansNextBtn = `<svg></svg>`;
        answerCircle = s
        .circle(50, 0, 10)
        .attr({ fill: "#fff", stroke: "#fff", "stroke-width": 4, cursor: "pointer" })
        .addClass("join");

        var divANSNextBtn = Snap.parse(fobjectSVGansNextBtn);
        var answerNextBtngroup = g2
          .group()
          .append(divANSNextBtn)
          .append(answerCircle)
          .attr({ id: `qn_${questionData.Id}` })
          .transform(`t${+questionData.Position[0] + questionSvgObj.w/2 - 50},${+questionData.Position[1] + 90}`);
        answerCircle.click(clickOnCircle, answerNextBtngroup);
        answerCircle.click(updateCircleDetails, answerCircle);
        questionSvgObj.answerListData.push({
          AgroupId: `qn_${questionData.Id}`,
          Acx: +questionData.Position[0] + 70 + questionSvgObj.w/2 - 70,
          Acy: +questionData.Position[1] + 90,
          IsCorrect: false
        });
      }
}

function createRatingSelectQuestionSvgAnimation(i,questionData,g2){
  var answerCircle;
  var fobjectSVGans;
  let answerImage = '';
  if(questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.ratingEmoji){
    if(i == 0){
      questionSvgObj.selectedAnswerList[i].AnswerTxt = questionSvgObj.selectedAnswerList[i].AnswerTxt ? questionSvgObj.selectedAnswerList[i].AnswerTxt : 
      componentReference.language == 'en-US' ? 'Very dissatisfied' :componentReference.language == 'nl-NL' ? 'Zeer ontevreden' : 'Bardzo niezadowalająca';
    answerImage = `<svg _ngcontent-gfo-c28="" fill="none" height="50" viewBox="0 0 50 50" width="50" xmlns="http://www.w3.org/2000/svg">
      <path _ngcontent-gfo-c28="" d="M25 50C11.2153 50 0 38.7847 0 25C0 11.2153 11.2153 0 25 0C38.7847 0 50 11.2153 50 25C50 38.7847 38.7847 50 25 50ZM25 1.7662C12.1875 1.7662 1.7662 12.1875 1.7662 25C1.7662 37.8125 12.1898 48.2338 25.0023 48.2338C37.8148 48.2338 48.2338 37.8125 48.2338 25C48.2338 12.1875 37.8125 1.7662 25 1.7662Z" fill="#111111"></path><path _ngcontent-gfo-c28="" d="M15.5011 36.3319C15.2164 36.3319 14.9478 36.1953 14.7835 35.9638C14.6469 35.7717 14.5914 35.5379 14.6284 35.3064C14.6654 35.0749 14.7927 34.8689 14.9849 34.7324C15.1608 34.605 19.3714 31.6328 24.9988 31.6328C30.633 31.6328 34.8367 34.605 35.015 34.7324C35.4108 35.0171 35.5011 35.568 35.2164 35.9638C35.052 36.1953 34.7835 36.3319 34.4988 36.3319C34.3136 36.3319 34.1353 36.274 33.9849 36.1652C33.9455 36.1374 30.0543 33.3967 24.9988 33.3967C19.9108 33.3967 16.052 36.1374 16.0127 36.1652C15.8645 36.274 15.6863 36.3319 15.5011 36.3319Z" fill="#111111"></path><path _ngcontent-gfo-c28="" d="M16.866 14.3886C15.6114 14.3886 14.292 14.046 12.9447 13.3701C12.7341 13.2636 12.5767 13.083 12.5026 12.8585C12.4285 12.634 12.4447 12.3955 12.5512 12.1849C12.7017 11.884 13.0049 11.6988 13.3406 11.6988C13.4772 11.6988 13.6114 11.7312 13.7364 11.7937C14.8244 12.34 15.8753 12.6155 16.8614 12.6155C18.3359 12.6155 19.6785 12.0067 20.8498 10.8053C21.0165 10.634 21.241 10.5391 21.4818 10.5391C21.7133 10.5391 21.9332 10.6293 22.0975 10.7891C22.4447 11.1293 22.4517 11.6895 22.1137 12.0367C21.0674 13.1085 19.3082 14.3886 16.866 14.3886Z" fill="#111111"></path><path _ngcontent-gfo-c28="" d="M18.9993 23.5548C17.8835 23.5548 16.9414 21.9692 16.9414 20.0919C16.9414 18.2146 17.8835 16.6289 18.9993 16.6289C20.115 16.6289 21.0571 18.2146 21.0571 20.0919C21.0571 21.9692 20.115 23.5548 18.9993 23.5548Z" fill="#111111"></path><path _ngcontent-gfo-c28="" d="M33.1329 14.3886C30.6907 14.3886 28.9315 13.1108 27.8852 12.0367C27.7208 11.8678 27.6305 11.6455 27.6329 11.4094C27.6352 11.1733 27.7301 10.9534 27.8991 10.7891C28.0657 10.627 28.2833 10.5391 28.5171 10.5391C28.7579 10.5391 28.9801 10.634 29.1467 10.8053C30.318 12.0067 31.6606 12.6155 33.1352 12.6155C34.1213 12.6155 35.1745 12.3377 36.2602 11.7937C36.3852 11.7312 36.5171 11.6988 36.656 11.6988C36.994 11.6988 37.2949 11.8863 37.4454 12.1849C37.5518 12.3955 37.568 12.634 37.494 12.8585C37.4199 13.083 37.2625 13.2636 37.0518 13.3701C35.7069 14.0437 34.3875 14.3886 33.1329 14.3886Z" fill="#111111"></path><path _ngcontent-gfo-c28="" d="M30.9993 23.5548C29.8835 23.5548 28.9414 21.9692 28.9414 20.0919C28.9414 18.2146 29.8835 16.6289 30.9993 16.6289C32.115 16.6289 33.0571 18.2146 33.0571 20.0919C33.0571 21.9692 32.1127 23.5548 30.9993 23.5548Z" fill="#111111"></path>
    </svg>`;
    }else if(i == 1){
      questionSvgObj.selectedAnswerList[i].AnswerTxt = questionSvgObj.selectedAnswerList[i].AnswerTxt ? questionSvgObj.selectedAnswerList[i].AnswerTxt : 
      componentReference.language == 'en-US' ? 'Dissatisfied' : componentReference.language == 'nl-NL' ?  'Ontevreden': 'Niezadowalająca';
      answerImage = `<svg _ngcontent-rvx-c28="" fill="none" height="50" viewBox="0 0 50 50" width="50" xmlns="http://www.w3.org/2000/svg"><path _ngcontent-rvx-c28="" d="M25 50C11.2153 50 0 38.7847 0 25C0 11.2153 11.2153 0 25 0C38.7847 0 50 11.2153 50 25C50 38.7847 38.7847 50 25 50ZM25 1.7662C12.1875 1.7662 1.7662 12.1875 1.7662 25C1.7662 37.8125 12.1898 48.2338 25 48.2338C37.8125 48.2338 48.2361 37.8102 48.2361 25C48.2338 12.1875 37.8125 1.7662 25 1.7662Z" fill="#111111"></path><path _ngcontent-rvx-c28="" d="M12.4046 37.5394C12.2333 37.5394 12.0667 37.4884 11.9208 37.3935C11.5157 37.1273 11.4 36.5787 11.6685 36.1713C14.143 32.4028 19.2518 30.0625 24.9995 30.0625C30.7472 30.0625 35.856 32.4028 38.3329 36.1713C38.5991 36.5787 38.4856 37.1273 38.0805 37.3935C37.937 37.4884 37.768 37.5394 37.5967 37.5394C37.2981 37.5394 37.0227 37.3912 36.8583 37.1412C34.7379 33.9144 30.0829 31.8287 25.0018 31.8287C19.9208 31.8287 15.2657 33.9144 13.1454 37.1412C12.9787 37.3889 12.7032 37.5394 12.4046 37.5394Z" fill="#111111"></path><path _ngcontent-rvx-c28="" d="M18.9915 21.5958C17.8757 21.5958 16.9336 20.0102 16.9336 18.1329C16.9336 16.2556 17.8757 14.6699 18.9915 14.6699C20.1072 14.6699 21.0493 16.2556 21.0493 18.1329C21.0493 20.0102 20.1072 21.5958 18.9915 21.5958Z" fill="#111111"></path><path _ngcontent-rvx-c28="" d="M31.0071 21.5958C29.8913 21.5958 28.9492 20.0102 28.9492 18.1329C28.9492 16.2556 29.8913 14.6699 31.0071 14.6699C32.1228 14.6699 33.065 16.2556 33.065 18.1329C33.065 20.0102 32.1228 21.5958 31.0071 21.5958Z" fill="#111111"></path></svg>`;
    }else if(i == 2){
      questionSvgObj.selectedAnswerList[i].AnswerTxt = questionSvgObj.selectedAnswerList[i].AnswerTxt ? questionSvgObj.selectedAnswerList[i].AnswerTxt : 
      componentReference.language == 'en-US' ? 'Neutral' : componentReference.language == 'nl-NL' ?  'Neutraal': 'Neutralna';
      answerImage = `<svg _ngcontent-rvx-c28="" fill="none" height="50" viewBox="0 0 50 50" width="50" xmlns="http://www.w3.org/2000/svg"><path _ngcontent-rvx-c28="" d="M25 50C11.2153 50 0 38.7847 0 25C0 11.2153 11.2153 0 25 0C38.7847 0 50 11.2153 50 25C50 38.7847 38.7847 50 25 50ZM25 1.76389C12.1875 1.76389 1.76389 12.1875 1.76389 25C1.76389 37.8125 12.1875 48.2361 25 48.2361C37.8125 48.2361 48.2361 37.8125 48.2361 25C48.2361 12.1875 37.8125 1.76389 25 1.76389Z" fill="#111111"></path><path _ngcontent-rvx-c28="" d="M14.8976 34.7479C14.4115 34.7479 14.0156 34.3521 14.0156 33.8683C14.0156 33.3822 14.4115 32.9863 14.8976 32.9863H35.1036C35.5897 32.9863 35.9855 33.3822 35.9855 33.8683C35.9855 34.3544 35.5897 34.7479 35.1036 34.7479H14.8976Z" fill="#111111"></path><path _ngcontent-rvx-c28="" d="M18.9915 21.5958C17.8757 21.5958 16.9336 20.0102 16.9336 18.1329C16.9336 16.2556 17.8757 14.6699 18.9915 14.6699C20.1072 14.6699 21.0493 16.2556 21.0493 18.1329C21.0493 20.0102 20.1072 21.5958 18.9915 21.5958Z" fill="#111111"></path><path _ngcontent-rvx-c28="" d="M31.011 21.5958C29.8953 21.5958 28.9531 20.0102 28.9531 18.1329C28.9531 16.2556 29.8953 14.6699 31.011 14.6699C32.1267 14.6699 33.0689 16.2556 33.0689 18.1329C33.0689 20.0102 32.1267 21.5958 31.011 21.5958Z" fill="#111111"></path></svg>`;
    }else if(i == 3){
      questionSvgObj.selectedAnswerList[i].AnswerTxt = questionSvgObj.selectedAnswerList[i].AnswerTxt ? questionSvgObj.selectedAnswerList[i].AnswerTxt : 
      componentReference.language == 'en-US' ? 'Satisfied' : componentReference.language == 'nl-NL' ?  'Tevreden': 'Zadowalająca';
      answerImage = `<svg _ngcontent-rvx-c28="" fill="none" height="50" viewBox="0 0 50 50" width="50" xmlns="http://www.w3.org/2000/svg"><path _ngcontent-rvx-c28="" d="M25 50C11.2153 50 0 38.7847 0 25C0 11.2153 11.2153 0 25 0C38.7847 0 50 11.2153 50 25C50 38.7847 38.7847 50 25 50ZM25 1.7662C12.1875 1.7662 1.7662 12.1875 1.7662 25C1.7662 37.8125 12.1898 48.2338 25 48.2338C37.8125 48.2338 48.2338 37.8102 48.2338 25C48.2338 12.1875 37.8125 1.7662 25 1.7662Z" fill="#111111"></path><path _ngcontent-rvx-c28="" d="M25.0002 39.002C19.2895 39.002 14.0302 35.6594 11.6066 30.4835C11.4006 30.0437 11.5904 29.5159 12.0302 29.3099C12.1483 29.2543 12.2756 29.2266 12.4029 29.2266C12.7432 29.2266 13.058 29.4256 13.2039 29.7358C15.3404 34.2937 19.9701 37.2381 25.0002 37.2381C30.0302 37.2381 34.6599 34.2937 36.7964 29.7358C36.9423 29.4256 37.2548 29.2266 37.5974 29.2266C37.727 29.2266 37.852 29.2543 37.9701 29.3099C38.4122 29.5159 38.602 30.0437 38.396 30.4835C35.9701 35.6571 30.7131 39.002 25.0002 39.002Z" fill="#111111"></path><path _ngcontent-rvx-c28="" d="M18.9915 21.5958C17.8757 21.5958 16.9336 20.0102 16.9336 18.1329C16.9336 16.2556 17.8757 14.6699 18.9915 14.6699C20.1072 14.6699 21.0493 16.2556 21.0493 18.1329C21.0493 20.0102 20.1072 21.5958 18.9915 21.5958Z" fill="#111111"></path><path _ngcontent-rvx-c28="" d="M31.011 21.5958C29.8953 21.5958 28.9531 20.0102 28.9531 18.1329C28.9531 16.2556 29.8953 14.6699 31.011 14.6699C32.1267 14.6699 33.0689 16.2556 33.0689 18.1329C33.0689 20.0102 32.1244 21.5958 31.011 21.5958Z" fill="#111111"></path></svg>`;
    }else if(i == 4){
      questionSvgObj.selectedAnswerList[i].AnswerTxt = questionSvgObj.selectedAnswerList[i].AnswerTxt ? questionSvgObj.selectedAnswerList[i].AnswerTxt : 
      componentReference.language == 'en-US' ? 'Very satisfied' : componentReference.language == 'nl-NL' ?  'Zeer tevreden': 'Bardzo zadowalająca';
      answerImage = `<svg _ngcontent-rvx-c28="" fill="none" height="50" viewBox="0 0 50 50" width="50" xmlns="http://www.w3.org/2000/svg"><path _ngcontent-rvx-c28="" d="M25 50C11.2153 50 0 38.7847 0 25C0 11.2153 11.2153 0 25 0C38.7847 0 50 11.2153 50 25C50 38.7847 38.7847 50 25 50ZM25 1.7662C12.1875 1.7662 1.76389 12.1875 1.76389 25C1.76389 37.8125 12.1875 48.2338 25 48.2338C37.8125 48.2338 48.2338 37.8125 48.2338 25C48.2338 12.1875 37.8125 1.7662 25 1.7662Z" fill="#111111"></path><path _ngcontent-rvx-c28="" d="M13.0893 19.5844C12.9597 19.5844 12.8347 19.5566 12.7166 19.5011C12.5036 19.4016 12.3416 19.2233 12.2606 19.0034C12.1796 18.7835 12.1911 18.5428 12.2907 18.3275C13.2212 16.3414 15.2374 15.0566 17.4319 15.0566C19.624 15.0566 21.6425 16.339 22.5731 18.3252C22.6726 18.5381 22.6842 18.7789 22.6032 18.9988C22.5222 19.221 22.3601 19.3969 22.1472 19.4988C22.0291 19.5543 21.9018 19.5821 21.7745 19.5821C21.4342 19.5821 21.1194 19.383 20.9736 19.0728C20.3323 17.7048 18.9411 16.8205 17.4319 16.8205C15.9226 16.8205 14.5314 17.7071 13.8902 19.0752C13.7444 19.3853 13.4296 19.5844 13.0893 19.5844Z" fill="#111111"></path><path _ngcontent-rvx-c28="" d="M28.226 19.586C28.0964 19.586 27.9714 19.5582 27.8533 19.5027C27.6404 19.4031 27.4783 19.2249 27.3973 19.005C27.3163 18.7828 27.3279 18.5443 27.4274 18.3314C28.358 16.3453 30.3742 15.0605 32.5686 15.0605C34.7607 15.0605 36.7792 16.343 37.7098 18.3291C37.9158 18.7689 37.726 19.2967 37.2839 19.5027C37.1658 19.5582 37.0408 19.586 36.9112 19.586C36.5709 19.586 36.2561 19.3869 36.1103 19.0767C35.4691 17.7087 34.0779 16.8244 32.5663 16.8244C31.057 16.8244 29.6658 17.7087 29.0246 19.0767C28.8811 19.3869 28.5663 19.586 28.226 19.586Z" fill="#111111"></path><path _ngcontent-rvx-c28="" d="M24.9987 38.9565C19.3027 38.9565 14.0613 35.6213 11.6436 30.4622C11.4618 30.0701 11.6294 29.6042 12.0215 29.4196C12.1266 29.3713 12.2374 29.3457 12.3539 29.3457C12.6578 29.3457 12.9363 29.5218 13.0641 29.7974C15.226 34.411 19.9107 37.3912 25.0016 37.3912C30.0925 37.3912 34.7772 34.411 36.9391 29.7974C37.0669 29.5218 37.3453 29.3457 37.6493 29.3457C37.763 29.3457 37.8737 29.3713 37.9789 29.4196C38.3709 29.6042 38.5385 30.0701 38.3567 30.4622C35.9362 35.6213 30.6948 38.9565 24.9987 38.9565Z" fill="#111111"></path></svg>`;
    }
  }else{
    for(let j=0; j<i+1; j++){
      answerImage += `<svg width="20" height="20" viewBox="0 0 40 38" fill="none" style="margin: 3px;" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.65742 38C8.311 38 7.97796 37.8919 7.69314 37.6881C7.15832 37.3035 6.90653 36.6407 7.05296 36L9.69492 24.4493C9.73867 24.2588 9.6735 24.0603 9.52528 23.9318L0.564568 16.1311C0.0663535 15.6996 -0.122932 15.0182 0.0806391 14.3934C0.284211 13.7705 0.841353 13.3292 1.4976 13.2689L13.353 12.2012C13.5494 12.1834 13.7199 12.0603 13.7976 11.8804L18.4851 0.993354C18.7458 0.389898 19.3405 0 20.0003 0C20.6592 0 21.2539 0.389898 21.5155 0.992468L26.2306 11.9291C26.3637 12.1772 26.4878 12.2127 26.7476 12.2304C26.7922 12.2331 38.5012 13.2689 38.5012 13.2689C39.1583 13.3274 39.7146 13.7687 39.919 14.3934C40.1235 15.0182 39.9351 15.6996 39.4378 16.1303L30.4762 23.9282C30.328 24.0567 30.2637 24.2552 30.3065 24.4457L32.9485 35.9965C33.0949 36.638 32.844 37.3008 32.3083 37.6845C32.0253 37.8883 31.6914 37.9956 31.3431 37.9956C31.0458 37.9956 30.7538 37.9149 30.4994 37.7634L20.2744 31.6996C20.1896 31.6491 20.0949 31.6243 19.9994 31.6243C19.9039 31.6243 19.8092 31.6491 19.7244 31.6996L9.50117 37.7669C9.24403 37.9194 8.95207 38 8.65742 38ZM20.0003 30.0762C20.2949 30.0762 20.5878 30.1568 20.8458 30.3093L30.4931 36.0354C30.578 36.086 30.6735 36.1108 30.7681 36.1108C30.8789 36.1108 30.9896 36.0771 31.0824 36.0097C31.2556 35.8848 31.3378 35.6695 31.2905 35.4612L28.7967 24.5583C28.6619 23.9716 28.8619 23.362 29.319 22.965L37.7806 15.6004C37.9414 15.4603 38.003 15.2379 37.9369 15.0359C37.8708 14.8338 37.6896 14.6903 37.4762 14.6708L26.2824 13.6624C25.6753 13.6074 25.1512 13.2273 24.9128 12.6717L20.4931 2.39699C20.4092 2.20115 20.2155 2.07443 20.0003 2.07443C19.786 2.07443 19.5922 2.20115 19.5074 2.39699L15.0833 12.6717C14.8476 13.2264 14.3244 13.6039 13.7181 13.6588L2.5235 14.6681C2.3101 14.6876 2.12885 14.8312 2.06278 15.0332C1.99671 15.2353 2.05742 15.4577 2.21903 15.5977L10.6797 22.9623C11.1378 23.3602 11.3378 23.9708 11.2021 24.5565L8.7101 35.4603C8.66278 35.6677 8.74492 35.883 8.91814 36.008C9.01189 36.0753 9.12171 36.109 9.23242 36.109C9.32707 36.109 9.4226 36.0842 9.50742 36.0337L19.1556 30.3084C19.4128 30.1568 19.7047 30.0762 20.0003 30.0762Z" fill="#111111"/>
      </svg>`;
    }
    if(i == 0){
      questionSvgObj.selectedAnswerList[i].AnswerTxt = componentReference.language == 'en-US' ? 'Very dissatisfied' : componentReference.language == 'nl-NL' ? 'Zeer ontevreden' : 'Bardzo niezadowalająca';
    }else if(i == 1){
      questionSvgObj.selectedAnswerList[i].AnswerTxt = componentReference.language == 'en-US' ? 'Somewhat unsatisfied' : componentReference.language == 'nl-NL' ? 'Enigszins ontevreden' : 'Nieco niezadowalający';
    }else if(i == 2){
      questionSvgObj.selectedAnswerList[i].AnswerTxt = componentReference.language == 'en-US' ? 'Not unsatisfied and not satisfied' : componentReference.language == 'nl-NL' ? 'Niet tevreden en niet ontevreden' : 'Oceń nas';
    }else if(i == 3){
      questionSvgObj.selectedAnswerList[i].AnswerTxt = componentReference.language == 'en-US' ? 'Somewhat satisfied' : componentReference.language == 'nl-NL' ? 'Enigszins tevreden' : 'Nieco zadowolony';
    }else if(i == 4){
      questionSvgObj.selectedAnswerList[i].AnswerTxt = componentReference.language == 'en-US' ? 'Very satisfied' : componentReference.language == 'nl-NL' ? 'Zeer tevreden': 'Bardzo zadowalająca';
    }
  }


  const fiteredAnwserText = filterPipe.transform(questionSvgObj.selectedAnswerList[i].AnswerTxt ? questionSvgObj.selectedAnswerList[i].AnswerTxt : '');
  fobjectSVGans = `<svg>
    <foreignObject width="140" height="100">
      <body>
        <div class="option-container" [id]=${questionSvgObj.selectedAnswerList[i].AnswerId}>
        <div class="option-rating" #$ratingStyle$#>#$answerOptionImage$#</div>
        <div class="option-gutter" title="${fiteredAnwserText}">${fiteredAnwserText}</div>
        <div class="correct-option">
        <i class="fa fa-check" aria-hidden="true"></i>
        </div>
      </body>
    </foreignObject>
  </svg>`;

    fobjectSVGans = fobjectSVGans.replace("#$answerOptionImage$#", answerImage);
    let circlePosition;
    let circleYPosition;
    if(questionSvgObj.selectedQuestionAnswerType == answerTypeEnum.ratingEmoji){
      fobjectSVGans = fobjectSVGans.replace("#$ratingStyle$#", `style='height:60px;'`);
      circlePosition = 100;
      circleYPosition = 140;
    }else{
      fobjectSVGans = fobjectSVGans.replace("#$ratingStyle$#", `style='height:35px;'`);
      circlePosition = 80;
      circleYPosition = 120;
    }

    let fillColor = questionSvgObj.selectedAnswerList[i].IsCorrect ? "transparent" : "#fff";

    answerCircle = s
    .circle(70, circlePosition, 10)
    .attr({ fill: fillColor, stroke: "#fff", "stroke-width": 4,cursor: "pointer" })
    .addClass("join");

    var divANS = Snap.parse(fobjectSVGans);
    let answerId = questionData.Type == BranchingLogicEnum.WHATSAPPTEMPLATE ? `ta_${questionSvgObj.selectedAnswerList[i].AnswerId}` : `a_${questionSvgObj.selectedAnswerList[i].AnswerId}`;
    var answergroup = g2
      .group()
      .append(divANS)
      .append(answerCircle)
      .attr({ id: answerId })
      .transform(
        `t${+questionData.Position[0] + i * 150},${+questionData.Position[1] +
          40}`
      );
    answerCircle.click(clickOnCircle, answergroup);
    answerCircle.click(updateCircleDetails, answerCircle);
    questionSvgObj.answerListData.push({
      AgroupId: answerId,
      Acx: +questionData.Position[0] + 70 + i * 150,
      Acy: +questionData.Position[1] + circleYPosition,
      IsCorrect: questionSvgObj.selectedAnswerList[i].IsCorrect
    });
}

/**
 * Function call when a question moved successfully
 */
function questionOnmove(x) {
  if (updatedQuestionData.length) {
    var draggedQuestion = $(`#${updatedQuestionData[0].ID}`).find(
      selectedQuestionType == BranchingLogicEnum.WHATSAPPTEMPLATE ? ".tempbox-gutter" : ".box-gutter"
    )[0];
    var draggedQuestionTitle = $(`#${updatedQuestionData[0].ID}`).find(
      selectedQuestionType == BranchingLogicEnum.WHATSAPPTEMPLATE ? ".temp-gutter" : ".quest-gutter"
    )[0];
    questionDetails.forEach((questionData, id1) => {
      if (questionData.ID === this.node.id && updatedQuestionData.length) {
        questionDetails[id1] = Object.assign({}, updatedQuestionData[0]);
        updatedQuestionData = [];
        setTimeout(() => {
          if(isMoveCount > 1){
            $(draggedQuestion).removeClass("drag-item");
            $(draggedQuestionTitle).removeClass("drag");
            $(draggedQuestion).addClass("app-data");
            $(draggedQuestionTitle).addClass("app-data");
          }
          isMoveCount = 0;
        }, 200);
      }
    });
  }
}

/**
 * Function call on dragging Question div
 */
function questionDragMove(dx, dy) {
  if (updatedQuestionData.length) {
    dx =
      selectedQuestionPosition[0] + dx >= 0 &&
      selectedQuestionPosition[0] + dx <=
        updatedWidth - (selectedQuestionWidth + 15)
        ? dx
        : updatedQuestionData[0].position[0] - selectedQuestionPosition[0];
    dy =
      selectedQuestionPosition[1] + dy >= 0 &&
      selectedQuestionPosition[1] + dy <= updatedHeight - 220
        ? dy
        : updatedQuestionData[0].position[1] - selectedQuestionPosition[1];
  }

  if((componentReference.oldWhatsappFlow && componentReference.firstQuesAndContentObj.Type == BranchingLogicEnum.QUESTION && this.node.id == 'Q_'+componentReference.firstQuesAndContentObj.Id) || selectedQuestionType == BranchingLogicEnum.WHATSAPPTEMPLATE){
    dy = 0
  }

  this.attr({
    transform:
      this.data("origTransform") +
      (this.data("origTransform") ? "T" : "t") +
      [dx, dy]
  });
  // if (selectedQuestionPosition[0]+dx >= 0 && selectedQuestionPosition[0]+dx <= updatedWidth-(selectedQuestionWidth+15) &&
  //     selectedQuestionPosition[1]+dy >= 0 && selectedQuestionPosition[1]+dy <= updatedHeight-(220)) {
  updatedQuestionData = [];
  questionDetails.forEach(questionData => {
    if (questionData.ID === this.node.id) {
      if (questionData.Qcx) {
        updatedQuestionData.push({
          ID: questionData.ID,
          QgroupId: questionData.QgroupId,
          Qcx: questionData.Qcx + dx,
          Qcy: questionData.Qcy + dy,
          position: [
            questionData.position[0] + dx,
            questionData.position[1] + dy
          ],
          AnswerDetails: [],
          width: questionData.width,
          Type: questionData.Type
        });
        if (oneLineDetails.length) {
          if (oneLineDetails[0].groupId === questionData.QgroupId) {
            oneLineDetails[0].x1 = updatedQuestionData[0].Qcx;
            oneLineDetails[0].y1 = updatedQuestionData[0].Qcy;
            oneLineDetails[0].position = updatedQuestionData[0].position.slice(0);
          }
        }
      } else {
        updatedQuestionData.push({
          ID: questionData.ID,
          QgroupId: questionData.QgroupId,
          position: [
            questionData.position[0] + dx,
            questionData.position[1] + dy
          ],
          AnswerDetails: [],
          width: questionData.width,
          Type: questionData.Type
        });
      }
      questionData.AnswerDetails.forEach(answerData => {
        if (answerData.Acx) {
          updatedQuestionData[0].AnswerDetails.push({
            AgroupId: answerData.AgroupId,
            Acx: answerData.Acx + dx,
            Acy: answerData.Acy + dy,
            IsCorrect: answerData.IsCorrect
          });
          if (oneLineDetails.length) {
            if (oneLineDetails[0].groupId === answerData.AgroupId) {
              oneLineDetails[0].x1 = answerData.Acx + dx;
              oneLineDetails[0].y1 = answerData.Acy + dy;
              oneLineDetails[0].position = updatedQuestionData[0].position.slice(0);
              oneLineDetails[0].IsCorrect = answerData.IsCorrect
            }
          }
        } else {
          updatedQuestionData[0].AnswerDetails.push({
            AgroupId: answerData.AgroupId
          });
        }
      });
    }
  });
  var draggedQuestion = $(`#${updatedQuestionData[0].ID}`).find(
    selectedQuestionType == BranchingLogicEnum.WHATSAPPTEMPLATE ? ".tempbox-gutter" : ".box-gutter"
  )[0];
  var draggedQuestionTitle = $(`#${updatedQuestionData[0].ID}`).find(
    selectedQuestionType == BranchingLogicEnum.WHATSAPPTEMPLATE ? ".temp-gutter" : ".quest-gutter"
  )[0];
  isMoveCount = isMoveCount + 1;
  if(isMoveCount > 1){
    $(draggedQuestion).addClass("drag-item");
    $(draggedQuestionTitle).addClass("drag");
    $(draggedQuestion).removeClass("app-data");
    $(draggedQuestionTitle).removeClass("app-data");
  }
  dragLineDrawWithQuestion(updatedQuestionData);

  // this.attr({ transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy] });
  // }
}

/**
 * Function call when question is start dragging
 */
function questionDragStart() {
  questionDetails.forEach(questionData => {
    if (questionData.ID === this.node.id) {
      selectedQuestionPosition = questionData.position;
      selectedQuestionWidth = questionData.width;
      selectedQuestionType = questionData.Type;
    }
  });
  this.data("origTransform", this.transform().local);
}

/**
 * To find duplicate element in coresponding array
 */
function isDuplicate(groupId, arrayOfDetails) {
  var duplicate;
  var count = 0;
  if (!arrayOfDetails.length) {
    duplicate = false;
  } else {
    arrayOfDetails.forEach(details => {
      if (details.ID === groupId) {
      } else {
        count++;
      }
    });
    if (count === arrayOfDetails.length) {
      duplicate = false;
    } else {
      duplicate = true;
    }
  }
  return duplicate;
}

/**
 * to get the value when click on a circle
 */
function clickOnCircle(eventClicked, specificGroup) {
  var selectedQuestion;
  var selectedType;
  questionDetails.forEach(questionData => {
    if (questionData.QgroupId === this.node.id) {
      selectedQuestion = Object.assign({}, questionData);
      selectedType = questionData.Type == BranchingLogicEnum.WHATSAPPTEMPLATE ? 15 : 2;
      updateOneLineArrayDetail(
        questionData.Qcx,
        questionData.Qcy,
        questionData.QgroupId,
        questionData.ID,
        selectedType,
        questionData.position.slice(0)
      );
    } else {
      questionData.AnswerDetails.forEach(answerData => {
        if (answerData.AgroupId === this.node.id) {
          selectedQuestion = Object.assign({}, questionData);
          selectedType = questionData.Type == BranchingLogicEnum.WHATSAPPTEMPLATE ? 16 : 3;
          updateOneLineArrayDetail(
            answerData.Acx,
            answerData.Acy,
            answerData.AgroupId,
            questionData.ID,
            selectedType,
            questionData.position.slice(0),
            answerData.IsCorrect
          );
        }
      });
    }
  });

  /**
   * Old code
   */

   drowOneLineDetails();
}

/**
 * UPdate OneLineDetails Array
 */
function updateOneLineArrayDetail(
  x,
  y,
  groupId,
  parentId,
  selectedType,
  position,
  IsCorrect?
) {
  if (!oneLineDetails.length) {
    oneLineDetails.push({
      x1: x,
      y1: y,
      groupId: groupId,
      ID: parentId,
      Type: selectedType,
      position: position,
      IsCorrect: IsCorrect
    });
  } else if (oneLineDetails[0].groupId != groupId) {
    if (!isDuplicate(parentId, oneLineDetails)) {
      oneLineDetails.push({
        x1: x,
        y1: y,
        groupId: groupId,
        ID: parentId,
        Type: selectedType,
        position: position,
        IsCorrect: IsCorrect
      });
    } else {
      oneLineDetails[0].x1 = x;
      oneLineDetails[0].y1 = y;
      oneLineDetails[0].groupId = groupId;
      oneLineDetails[0].Type = selectedType;
      oneLineDetails[0].position = position;
      oneLineDetails[0].IsCorrect = IsCorrect;
    }
  }
}

/**
 *Creating a Path or not
 */
function isCreateAPath(fromType, toType) {
  var createAPath = false;

  let questionMapping = [BranchingLogicEnum.ANSWER,BranchingLogicEnum.START,BranchingLogicEnum.CONTENTNEXT,BranchingLogicEnum.WHATSAPPTEMPLATEACTION];
  let answerMapping = [BranchingLogicEnum.QUESTION,BranchingLogicEnum.RESULT,BranchingLogicEnum.CONTENT];
  let resultMapping = [BranchingLogicEnum.ANSWER,BranchingLogicEnum.CONTENTNEXT,BranchingLogicEnum.START,BranchingLogicEnum.WHATSAPPTEMPLATEACTION];
  let resultNextMapping = [BranchingLogicEnum.ACTION,BranchingLogicEnum.BADGE];
  let actionMapping = [BranchingLogicEnum.RESULTNEXT,BranchingLogicEnum.CONTENTNEXT];
  let contentMapping = [BranchingLogicEnum.ANSWER,BranchingLogicEnum.CONTENTNEXT,BranchingLogicEnum.START,BranchingLogicEnum.WHATSAPPTEMPLATEACTION];
  let contentNextMapping = [BranchingLogicEnum.ACTION,BranchingLogicEnum.RESULT,BranchingLogicEnum.CONTENT,BranchingLogicEnum.QUESTION];
  let startMapping = [BranchingLogicEnum.QUESTION,BranchingLogicEnum.RESULT,BranchingLogicEnum.CONTENT,BranchingLogicEnum.WHATSAPPTEMPLATE];
  let badgeMapping = [BranchingLogicEnum.RESULTNEXT,BranchingLogicEnum.WHATSAPPTEMPLATEACTION];
  let templateMapping = [BranchingLogicEnum.START];
  let templateActionMapping = [BranchingLogicEnum.QUESTION,BranchingLogicEnum.CONTENT,BranchingLogicEnum.RESULT,BranchingLogicEnum.BADGE]

  if(
    (fromType === BranchingLogicEnum.QUESTION  && questionMapping.includes(toType)) ||
    (fromType === BranchingLogicEnum.ANSWER  && answerMapping.includes(toType)) ||
    (fromType === BranchingLogicEnum.RESULT  && resultMapping.includes(toType)) ||
    (fromType === BranchingLogicEnum.RESULTNEXT  && resultNextMapping.includes(toType)) ||
    (fromType === BranchingLogicEnum.ACTION  && actionMapping.includes(toType)) ||
    (fromType === BranchingLogicEnum.CONTENT  && contentMapping.includes(toType)) ||
    (fromType === BranchingLogicEnum.CONTENTNEXT  && contentNextMapping.includes(toType)) ||
    (fromType === BranchingLogicEnum.START  && startMapping.includes(toType)) ||
    (fromType === BranchingLogicEnum.BADGE  && badgeMapping.includes(toType)) ||
    (fromType === BranchingLogicEnum.WHATSAPPTEMPLATE  && templateMapping.includes(toType)) ||
    (fromType === BranchingLogicEnum.WHATSAPPTEMPLATEACTION  && templateActionMapping.includes(toType))
  ){
    createAPath = true;
  }
  return createAPath;
}

function checkLoopCase(
  pathType,
  fromId,
  toId,
  fromParentID,
  toParentID,
  fromType,
  toType,
  calledTime
) {
  var loopBoolean = false;
  var correspondingToId;
  var upperPathDetails;
  if (pathType == "New") {
    if (
      ((fromType === 2 && toType === 3) ||
        (fromType === 3 && toType === 2) ||
        (fromType === 3 && toType === 6) ||
        (fromType === 6 && toType === 3) ||
        (fromType === 7 && toType === 6) ||
        (fromType === 6 && toType === 7)) &&
      pathDetails.length
    ) {
      if (fromType === 3) {
        correspondingToId = `q_${fromParentID.split("_")[1]}`;
        TOIDLOOPINGCHECK = calledTime == "Init" ? toId : TOIDLOOPINGCHECK;
        upperPathDetails = getConnectedPathDetails(correspondingToId);
      } else if (fromType === 7) {
        correspondingToId = `c_${fromParentID.split("_")[1]}`;
        TOIDLOOPINGCHECK = calledTime == "Init" ? toId : TOIDLOOPINGCHECK;
        upperPathDetails = getConnectedPathDetails(correspondingToId);
      } else if (toType === 3) {
        correspondingToId = `q_${toParentID.split("_")[1]}`;
        TOIDLOOPINGCHECK = calledTime == "Init" ? fromId : TOIDLOOPINGCHECK;
        upperPathDetails = getConnectedPathDetails(correspondingToId);
      } else if (toType === 7) {
        correspondingToId = `c_${toParentID.split("_")[1]}`;
        TOIDLOOPINGCHECK = calledTime == "Init" ? fromId : TOIDLOOPINGCHECK;
        upperPathDetails = getConnectedPathDetails(correspondingToId);
      }
    }
  }

  if (!upperPathDetails) {
    return false;
  } else {
    return true;
  }
}

function getConnectedPathDetails(toId) {
  var returnedData;
  if (toId == TOIDLOOPINGCHECK) {
    return true;
  }
  var connectedPathDetails = [];
  pathDetails.forEach(path => {
    if (toId == path.fromId || toId == path.toId) {
      connectedPathDetails.push(path);
    }
  });
  connectedPathDetails.forEach(path => {
    if (!returnedData) {
      returnedData = checkLoopCase(
        "New",
        path.fromId,
        path.toId,
        path.fromParentID,
        path.toParentID,
        path.fromType,
        path.toType,
        "Again"
      );
    }
  });
  if (returnedData) {
    return true;
  } else if (!connectedPathDetails.length || !returnedData) {
    return false;
  }
  if (connectedPathDetails.length == 1) {
    if (
      connectedPathDetails[0].toType == 1 ||
      connectedPathDetails[0].fromType == 1
    ) {
      return false;
    }
  }
}

function deletePreviousPath(pathType, fromId, toId, fromType, toType) {
  var pathIndex;
  if (pathType == "New") {
    if (fromType == 1 || fromType == 3 || fromType == 5 || fromType == 7 || fromType == 16) {
      pathIndex = pathDetails.findIndex(path => {
        return path.fromId == fromId || path.toId == fromId;
      });
    } else if (toType == 1 || toType == 3 || toType == 5 || toType == 7 || toType == 16) {
      pathIndex = pathDetails.findIndex(path => {
        return path.toId == toId || path.fromId == toId;
      });
    }
    if (pathIndex != -1) {
      pathDetails[pathIndex].pathBetween.remove();
      pathDetails.splice(pathIndex, 1);
    }
  }
  var fromLinktoBlock = $(`#${fromId}`).find(".link-to-block")[0];
  var toLinktoBlock = $(`#${toId}`).find(".link-to-block")[0];
  if (
    (fromType == 1 || fromType == 3 || fromType == 5 || fromType == 7 || fromType == 16) &&
    fromLinktoBlock
  ) {
    fromLinktoBlock.style.display = "none";
  } else if (
    (toType == 1 || toType == 3 || toType == 5 || toType == 7 || toType == 16) &&
    toLinktoBlock
  ) {
    toLinktoBlock.style.display = "none";
  }
}

/**
 * Function Call when a line draw
 */
function drawLine(
  fromId,
  toId,
  x1,
  y1,
  x2,
  y2,
  fromParentID,
  toParentID,
  fromType,
  toType,
  fromTypePosition,
  toTypePosition,
  createdPathType,
  IsCorrect?
) {
  var calledTime = createdPathType == "New" ? "Init" : "Again";
  if (
    isCreateAPath(fromType, toType) 
    // && !checkLoopCase(
    //   createdPathType,
    //   fromId,
    //   toId,
    //   fromParentID,
    //   toParentID,
    //   fromType,
    //   toType,
    //   calledTime
    // )
  ) {
    deletePreviousPath(createdPathType, fromId, toId, fromType, toType);
    // var pathIndex;
    // if (fromType == 1 || toType == 1) {
    //   pathIndex = pathDetails.findIndex((path) => { return (path.fromType == 1) || (path.toType == 1) });
    //   if (pathIndex != -1) {
    //     pathDetails[pathIndex].pathBetween.remove();
    //     pathDetails.splice(pathIndex, 1);
    //   }
    // }
    var newPath;
    var countPath = 0;
    var midY = (y1 + y2) / 2;
    var linePath = `M ${x1} ${y1} C ${x1} ${midY} ${x2} ${midY} ${x2} ${y2}`;
    // var lineLength = Snap.path.getTotalLength(linePath);
    var lineDraw = s.path(linePath);
    let strokeColor = '#888';
    if(fromId == 'start' && componentReference.quizData.usageType && componentReference.quizData.usageType.includes(usageTypeEnum.WhatsApp_Chatbot)){
      strokeColor = 'none';
    }
    if(IsCorrect){
      lineDraw.attr({ fill: "none", stroke: "#32cd32", "stroke-width": 2 });
    }else{
      lineDraw.attr({ fill: "none", stroke: strokeColor, "stroke-width": 2 });
      //lineDraw.attr({ fill: "none", stroke: "#888", "stroke-width": 2 });
    }
    lineDraw.animate({ strokeDashoffset: 0 });
    pathGroup.append(lineDraw);
    if (!pathDetails.length) {
      pathDetails.push({
        fromId: fromId,
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        toId: toId,
        pathBetween: lineDraw,
        fromParentID: fromParentID,
        toParentID: toParentID,
        fromType: fromType,
        toType: toType,
        fromTypePosition: fromTypePosition,
        toTypePosition: toTypePosition,
        IsCorrect: IsCorrect
      });
    } else {
      pathDetails.forEach(path => {
        if (path.fromId === fromId && path.toId === toId) {
          path.x1 = x1;
          path.y1 = y1;
          path.x2 = x2;
          path.y2 = y2;
          path.pathBetween = lineDraw;
          path.fromTypePosition = fromTypePosition;
          path.toTypePosition = toTypePosition;
        } else {
          countPath++;
        }
      });
      if (countPath === pathDetails.length) {
        pathDetails.push({
          fromId: fromId,
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
          toId: toId,
          pathBetween: lineDraw,
          fromParentID: fromParentID,
          toParentID: toParentID,
          fromType: fromType,
          toType: toType,
          fromTypePosition: fromTypePosition,
          toTypePosition: toTypePosition,
          IsCorrect: IsCorrect
        });
      }
    }
  }
}

function isPathDuplicate(fromId, toId) {
  var pathIsDuplicate = false;
  pathDetails.forEach(path => {
    if (
      (fromId === path.fromId && toId === path.toId) ||
      (fromId === path.toId && toId === path.fromId)
    ) {
      pathIsDuplicate = true;
    }
  });
  return pathIsDuplicate;
}

/**
 *  Function when a question group moved
 */
function dragLineDrawWithQuestion(array1Details) {
  pathDetails.forEach(path => {
    if (path.fromId === array1Details[0].QgroupId) {
      path.pathBetween.remove();
      drawLine(
        array1Details[0].QgroupId,
        path.toId,
        array1Details[0].Qcx,
        array1Details[0].Qcy,
        path.x2,
        path.y2,
        array1Details[0].ID,
        path.toParentID,
        array1Details[0].Type == BranchingLogicEnum.WHATSAPPTEMPLATE ? 15 : 2,
        path.toType,
        array1Details[0].position.slice(0),
        path.toTypePosition.slice(0),
        "Drag",
        path.IsCorrect
      );
    } else if (path.toId === array1Details[0].QgroupId) {
      path.pathBetween.remove();
      drawLine(
        path.fromId,
        array1Details[0].QgroupId,
        path.x1,
        path.y1,
        array1Details[0].Qcx,
        array1Details[0].Qcy,
        path.fromParentID,
        array1Details[0].ID,
        path.fromType,
        array1Details[0].Type == BranchingLogicEnum.WHATSAPPTEMPLATE ? 15 : 2,
        path.fromTypePosition.slice(0),
        array1Details[0].position.slice(0),
        "Drag",
        path.IsCorrect
      );
    } else {
      array1Details[0].AnswerDetails.forEach(answerData => {
        if (path.fromId === answerData.AgroupId) {
          path.pathBetween.remove();
          drawLine(
            answerData.AgroupId,
            path.toId,
            answerData.Acx,
            answerData.Acy,
            path.x2,
            path.y2,
            array1Details[0].ID,
            path.toParentID,
            array1Details[0].Type == BranchingLogicEnum.WHATSAPPTEMPLATE ? 16 : 3,
            path.toType,
            array1Details[0].position.slice(0),
            path.toTypePosition.slice(0),
            "Drag",
            answerData.IsCorrect
          );
        } else if (path.toId === answerData.AgroupId) {
          path.pathBetween.remove();
          drawLine(
            path.fromId,
            answerData.AgroupId,
            path.x1,
            path.y1,
            answerData.Acx,
            answerData.Acy,
            path.fromParentID,
            array1Details[0].ID,
            path.fromType,
            array1Details[0].Type == BranchingLogicEnum.WHATSAPPTEMPLATE ? 16 : 3,
            path.fromTypePosition.slice(0),
            array1Details[0].position.slice(0),
            "Drag",
            answerData.IsCorrect
          );
        }
      });
    }
  });
}

/**
 * Result Svg creation
 */

function resultSvgAnimation(resultData, ResultData) {
  var selectedResult;
  var resultDescription;
  var resultId = resultData.Id;
  var isBasedOnCoreleationResult = false;

    for(let i=0; i<ResultData.length; i++){
      if (ResultData[i].ResultId == resultId) {
        selectedResult = ResultData[i].ResultInternalTitle ? ResultData[i].ResultInternalTitle : '';
        isBasedOnCoreleationResult = ResultData[i].IsPersonalityCorrelatedResult;
        resultDescription = ResultData[i].ShowDescription ? ResultData[i].ResultDescription ? ResultData[i].ResultDescription : "Result Description" : '';
        break;
      }
    }
    const fiteredArr = filterPipe.transform(resultDescription ? resultDescription : '');
    const fiteredselectedResult = filterPipe.transform(selectedResult ? selectedResult:'');

    var parentFObjSVG = `<svg>
    <foreignObject width="240" height="75">
    <body>
    <div class="box-result-gutter #$resClass$#" id=rb_${resultId} #$resAppData$#>
    <div class="title-gutter">Resultaten</div>
    </div>
    </body>
    </foreignObject>
    </svg>`;
    var fobjectSVG = `<svg>
    <foreignObject width="200" height="38">
    <body>
    <div class="result-gutter #$resClass$#" id=${resultId} #$resAppData$#>
    <span title="${fiteredselectedResult}">${fiteredselectedResult}</span>
    <small title="${fiteredArr}">${fiteredArr}</small>
    </div>
    </body>
    </foreignObject>
    </svg>`;

    if(isBasedOnCoreleationResult){
      basedOnCoreleationResultId = `R_${resultId}`;
      parentFObjSVG = parentFObjSVG.replace("#$resClass$#", '');
      fobjectSVG = fobjectSVG.replace("#$resClass$#", '');
      parentFObjSVG = parentFObjSVG.replace("#$resAppData$#", '');
      fobjectSVG = fobjectSVG.replace("#$resAppData$#", '');
    }else{
      parentFObjSVG = parentFObjSVG.replace("#$resClass$#", 'app-data pointer');
      fobjectSVG = fobjectSVG.replace("#$resClass$#", 'app-data pointer');
      parentFObjSVG = parentFObjSVG.replace("#$resAppData$#", 'app-data="edit-quiz"');
      fobjectSVG = fobjectSVG.replace("#$resAppData$#", 'app-data="edit-quiz"');
    }
    var fobjectSVGButton = `<svg></svg>`;
    var div1 = Snap.parse(fobjectSVG);
    var parentDiv = Snap.parse(parentFObjSVG);
    var circleRect = s.rect(200, -20, 20, 30).attr({ fill: "transparent" });
    var optionC1 = s
      .circle(210, -10, 2)
      .attr({ fill: "black" })
      .addClass("join");
    var optionC2 = s
      .circle(210, -5, 2)
      .attr({ fill: "black" })
      .addClass("join");
    var optionC3 = s
      .circle(210, 0, 2)
      .attr({ fill: "black" })
      .addClass("join");
    var groupOption = s
      .group()
      .append(circleRect)
      .append(optionC1)
      .append(optionC2)
      .append(optionC3)
      .attr({ cursor: "pointer" });
    var c1 = s
      .circle(100, -20, 10)
      .attr({ fill: "#fff", stroke: "#ccc", cursor: "pointer" })
      .addClass("join");
    var g2 = s.group().attr({ id: `R_${resultId}` });
    var g1 = g2
      .group()
      .append(parentDiv)
      .transform(
        `t${+resultData.Position[0] - 20},${+resultData.Position[1] - 20}`
      );
    var g1 = g2
      .group()
      .append(div1)
      .append(groupOption)
      .append(c1)
      .attr({ id: `r_${resultId}` })
      .transform(`t${+resultData.Position[0]},${+resultData.Position[1]}`);
    g2.drag(resultDragMove, resultDragStart, resultOnmove);
    groupOption.click(openMoreOption, g1);
    c1.click(clickOnResultCircle, g1);
    c1.click(updateCircleDetails, c1);

    var Buttondiv = Snap.parse(fobjectSVGButton);
    var buttonCircle = s
      .circle(50, 15, 10)
      .attr({ fill: "#fff", stroke: "#ccc", cursor: "pointer" })
      .addClass("join");
    var buttonGroup = g2
      .group()
      .append(Buttondiv)
      .append(buttonCircle)
      .attr({ id: `rb_${resultId}` })
      .transform(
        `t${+resultData.Position[0] + 50},${+resultData.Position[1] + 40}`
      );

    if (!isDuplicate(`R_${resultId}`, resultDetails)) {
      resultDetails.push({
        ID: `R_${resultId}`,
        RgroupId: `r_${resultId}`,
        Rcx: +resultData.Position[0] + 100,
        Rcy: +resultData.Position[1] - 20,
        BgroupId: `rb_${resultId}`,
        Bcx: +resultData.Position[0] + 100,
        Bcy: +resultData.Position[1] + 55,
        position: [+resultData.Position[0], +resultData.Position[1]]
      });
    }
    buttonCircle.click(clickOnResultCircle, buttonGroup);
    buttonCircle.click(updateCircleDetails, buttonCircle);
    corX += 100;
    corY += 100;
}

function badgeSvgAnimation(badgeData, BadgeData) {
  var selectedBadge;
  var badgeId = badgeData.Id;

  for(let i=0; i<BadgeData.length; i++){
    if (BadgeData[i].BadgetId == badgeId) {
      selectedBadge = BadgeData[i].BadgetTitle ? BadgeData[i].BadgetTitle : '';
      break;
    }
  }
  const fiteredselectedResult = filterPipe.transform(selectedBadge ? selectedBadge : '');

  var parentFObjSVG = `<svg>
  <foreignObject width="200" height="60">
    <body>
      <div class="badge-container-gutter badgeBG app-data pointer" id=bb_${badgeId} app-data="edit-quiz">
        <div class="title-gutter">Badges</div>
      </div>
    </body>
  </foreignObject>
  </svg>`;
  
  var fobjectSVG = `<svg>
  <foreignObject width="140" height="35">
    <body>
      <div class="badge-container app-data pointer" id=${badgeId} app-data="edit-quiz">
      <div class="badge-gutter" title="${fiteredselectedResult}">${fiteredselectedResult}</div></div>
    </body>
  </foreignObject>
  </svg>`;
  var div1 = Snap.parse(fobjectSVG);
  var circleRect = s.rect(145, -20, 20, 30).attr({ fill: "transparent" });
  var optionC1 = s
    .circle(155, -10, 2)
    .attr({ fill: "black" })
    .addClass("join");
  var optionC2 = s
    .circle(155, -5, 2)
    .attr({ fill: "black" })
    .addClass("join");
  var optionC3 = s
    .circle(155, 0, 2)
    .attr({ fill: "black" })
    .addClass("join");
  var groupOption = s
    .group()
    .append(circleRect)
    .append(optionC1)
    .append(optionC2)
    .append(optionC3)
    .attr({ cursor: "pointer" });
  var c1 = s
    .circle(75, -20, 10)
    .attr({ fill: "#fff", stroke: "#ccc", cursor: "pointer" })
    .addClass("join");
  var g2 = s.group().attr({ id: `B_${badgeId}` });
  var parentDiv = Snap.parse(parentFObjSVG);
  var g3 = g2
    .group()
    .append(parentDiv)
    .transform(
      `t${+badgeData.Position[0]},${+badgeData.Position[1]}`
    );
  var g1 = g2
    .group()
    .append(div1)
    .append(groupOption)
    .append(c1)
    .attr({ id: `b_${badgeId}` })
    .transform(`t${+badgeData.Position[0] + 35},${+badgeData.Position[1] + 20}`);
  g2.drag(badgeDragMove, badgeDragStart, badgeOnmove);

  groupOption.click(openMoreOption, g1);
  c1.click(clickOnBadgeCircle, g1);
  c1.click(updateCircleDetails, c1);

  if (!isDuplicate(`B_${badgeId}`, badgeDetails)) {
    badgeDetails.push({
      ID: `B_${badgeId}`,
      BDgroupId: `b_${badgeId}`,
      BDcx: +badgeData.Position[0] + 110,
      BDcy: +badgeData.Position[1] + 0,
      position: [+badgeData.Position[0], +badgeData.Position[1]]
    });
  }
  corX += 100;
  corY += 100;
}

function contentSvgAnimation(contentData, ContentData){
  var selectedContent;
  var contentDescription;
  var contentId = contentData.Id;

  for(let i=0; i<ContentData.length; i++){
    if(ContentData[i].Type == BranchingLogicEnum.CONTENT && ContentData[i].ContentId == contentId){
      if(componentReference.quizData && componentReference.quizData.usageType && componentReference.quizData.usageType.includes(usageTypeEnum.WebFlow)){
        selectedContent = ContentData[i].ContentTitle ? ContentData[i].ContentTitle : '';
      }else{
        selectedContent = ContentData[i].ShowTitle ? ContentData[i].ContentTitle ? ContentData[i].ContentTitle : '' : '';
      }
      contentDescription = ContentData[i].ShowDescription ? ContentData[i].ContentDescription ? ContentData[i].ContentDescription : "Content Description" : '';
      break;
    }
  }

  const fiteredArr = filterPipe.transform(contentDescription ? contentDescription : '');
  const fiteredselectedResult = filterPipe.transform(selectedContent ? selectedContent : '');
  

  var parentFObjSVG = `<svg>
  <foreignObject width="240" height="75">
    <body>
      <div class="box-content-gutter app-data pointer" id=cb_${contentId} app-data="edit-quiz">
        <div class="title-gutter">Content paginas</div>
      </div>
    </body>
  </foreignObject>
  </svg>`;

  var fobjectSVG = `<svg>
  <foreignObject width="200" height="38">
    <body>
      <div class="content-gutter app-data pointer" id=${contentId} app-data="edit-quiz"><span title="${fiteredselectedResult}">${fiteredselectedResult}</span>
        <small title="${fiteredArr}">${fiteredArr}</small>
      </div>
    </body>
  </foreignObject>
  </svg>`;

  var fobjectSVGButton = `<svg></svg>`;
  var div1 = Snap.parse(fobjectSVG);
  let hideClass = '';
  let joinClass = 'join';
  if(componentReference.oldWhatsappFlow && componentReference.firstQuesAndContentObj.Type == BranchingLogicEnum.CONTENT && contentData.Id == componentReference.firstQuesAndContentObj.Id){
    hideClass = 'display-none';
    joinClass = 'join display-none'
  }
  var parentDiv = Snap.parse(parentFObjSVG);
  var circleRect = s.rect(200, -20, 20, 30).attr({ fill: "transparent" });

  var optionC1 = s
    .circle(210, -10, 2)
    .attr({ fill: "black" })
    .addClass("join");
  var optionC2 = s
    .circle(210, -5, 2)
    .attr({ fill: "black" })
    .addClass("join");
  var optionC3 = s
    .circle(210, 0, 2)
    .attr({ fill: "black" })
    .addClass("join");
  var groupOption = s
    .group()
    .append(circleRect)
    .append(optionC1)
    .append(optionC2)
    .append(optionC3)
    .attr({ cursor: "pointer", class : hideClass});
  var c1 = s
    .circle(100, -20, 10)
    .attr({ fill: "#fff", stroke: "#ccc", cursor: "pointer" })
    .addClass(joinClass);
  var g2 = s.group().attr({ id: `C_${contentId}` });
  var g1 = g2
    .group()
    .append(parentDiv)
    .transform(
      `t${+contentData.Position[0] - 20},${+contentData.Position[1] - 20}`
    );
  var g1 = g2
    .group()
    .append(div1)
    .append(groupOption)
    .append(c1)
    .attr({ id: `c_${contentId}` })
    .transform(`t${+contentData.Position[0]},${+contentData.Position[1]}`);
  g2.drag(contentDragMove, contentDragStart, contentOnmove);
  groupOption.click(openMoreOption, g1);
  c1.click(clickOnContentCircle, g1);
  c1.click(updateCircleDetails, c1);

  if (!isDuplicate(`C_${contentId}`, contentDetails)) {
    contentDetails.push({
      ID: `C_${contentId}`,
      CgroupId: `c_${contentId}`,
      Ccx: +contentData.Position[0] + 100,
      Ccy: +contentData.Position[1] - 20,
      CBgroupId: `cb_${contentId}`,
      CBcx: +contentData.Position[0] + 100,
      CBcy: +contentData.Position[1] + 55,
      position: [+contentData.Position[0], +contentData.Position[1]]
    });
  }

  var Buttondiv = Snap.parse(fobjectSVGButton);
  var buttonCircle = s
    .circle(50, 15, 10)
    .attr({ fill: "#fff", stroke: "#ccc", cursor: "pointer" })
    .addClass("join");
  var buttonGroup = g2
    .group()
    .append(Buttondiv)
    .append(buttonCircle)
    .attr({ id: `cb_${contentId}` })
    .transform(
      `t${+contentData.Position[0] + 50},${+contentData.Position[1] + 40}`
    );
  buttonCircle.click(clickOnContentCircle, buttonGroup);
  buttonCircle.click(updateCircleDetails, buttonCircle);
  corX += 100;
  corY += 100;
}

/**
 * Function call when a result moved successfully
 */
function resultOnmove(x) {
  if (updatedResultData.length) {
    var draggedResult = $(`#${updatedResultData[0].ID}`).find(
      ".box-result-gutter"
    )[0];
    var draggedResultTitle = $(`#${updatedResultData[0].ID}`).find(
      ".result-gutter"
    )[0];
    resultDetails.forEach((resultData, index) => {
      if (resultData.ID === this.node.id && updatedResultData.length) {
        resultDetails[index] = Object.assign({}, updatedResultData[0]);
        updatedResultData = [];
        setTimeout(() => {
          if(isMoveCount > 1){
            $(draggedResult).removeClass("drag-item");
            $(draggedResultTitle).removeClass("drag");
            if(basedOnCoreleationResultId != this.node.id){
              $(draggedResult).addClass("app-data");
              $(draggedResultTitle).addClass("app-data");
            }
          }
          isMoveCount = 0;
        }, 200);
      }
    });
  }
}

/**
 * Function call on dragging Result div
 */
function resultDragMove(dx, dy) {
  if (updatedResultData.length) {
    dx =
      selectedResultposition[0] + dx >= 0 &&
      selectedResultposition[0] + dx <= updatedWidth - 215
        ? dx
        : updatedResultData[0].position[0] - selectedResultposition[0];
    dy =
      selectedResultposition[1] + dy >= 0 &&
      selectedResultposition[1] + dy <= updatedHeight - 140
        ? dy
        : updatedResultData[0].position[1] - selectedResultposition[1];
  }
  updatedResultData = [];
  resultDetails.forEach(resultData => {
    if (resultData.ID === this.node.id) {
      if (resultData.Rcx) {
        updatedResultData.push({
          ID: resultData.ID,
          RgroupId: resultData.RgroupId,
          Rcx: resultData.Rcx + dx,
          Rcy: resultData.Rcy + dy,
          BgroupId: resultData.BgroupId,
          position: [resultData.position[0] + dx, resultData.position[1] + dy]
        });
        if (oneLineDetails.length) {
          if (oneLineDetails[0].groupId === resultData.RgroupId) {
            oneLineDetails[0].x1 = updatedResultData[0].Rcx;
            oneLineDetails[0].y1 = updatedResultData[0].Rcy;
            oneLineDetails[0].position = updatedResultData[0].position.slice(0);
          }
        }
      } else {
        updatedResultData.push({
          ID: resultData.ID,
          RgroupId: resultData.RgroupId,
          BgroupId: resultData.BgroupId
        });
      }
      if (resultData.Bcx) {
        updatedResultData[0].Bcx = resultData.Bcx + dx;
        updatedResultData[0].Bcy = resultData.Bcy + dy;
        updatedResultData[0].position = [
          resultData.position[0] + dx,
          resultData.position[1] + dy
        ];
        if (oneLineDetails.length) {
          if (oneLineDetails[0].groupId === resultData.BgroupId) {
            oneLineDetails[0].x1 = updatedResultData[0].Bcx;
            oneLineDetails[0].y1 = updatedResultData[0].Bcy;
            oneLineDetails[0].position = updatedResultData[0].position.slice(0);
          }
        }
      }
    }
  });
  this.attr({
    transform:
      this.data("origTransform") +
      (this.data("origTransform") ? "T" : "t") +
      [dx, dy]
  });

  var draggedResult = $(`#${updatedResultData[0].ID}`).find(
    ".box-result-gutter"
  )[0];
  var draggedResultTitle = $(`#${updatedResultData[0].ID}`).find(
    ".result-gutter"
  )[0];

  isMoveCount = isMoveCount + 1;
  if(isMoveCount > 1){
    $(draggedResult).addClass("drag-item");
    $(draggedResultTitle).addClass("drag");
    if(basedOnCoreleationResultId != updatedResultData[0].ID){
      $(draggedResult).removeClass("app-data");
      $(draggedResultTitle).removeClass("app-data");
    }
  }
  dragLineDrawWithResult(updatedResultData);
}

/**
 * Function call when result is start dragging
 */
function resultDragStart() {
  resultDetails.forEach(resultData => {
    if (resultData.ID == this.node.id) {
      selectedResultposition = resultData.position.slice(0);
    }
  });

  this.data("origTransform", this.transform().local);
}

/**
 * to get the value when click on a circle
 */
function clickOnResultCircle(clickOnResultCircle) {
  var selectedResult;
  var selectedType;
  resultDetails.forEach(resultData => {
    if (resultData.RgroupId === this.node.id) {
      selectedResult = Object.assign({}, resultData);
      selectedType = 4;
      updateOneLineArrayDetail(
        resultData.Rcx,
        resultData.Rcy,
        resultData.RgroupId,
        resultData.ID,
        selectedType,
        resultData.position.slice(0)
      );
    } else if (resultData.BgroupId === this.node.id) {
      selectedResult = Object.assign({}, resultData);
      selectedType = 5;
      updateOneLineArrayDetail(
        resultData.Bcx,
        resultData.Bcy,
        resultData.BgroupId,
        resultData.ID,
        selectedType,
        resultData.position.slice(0)
      );
    }
  });

  drowOneLineDetails();
}

/**
 *  Function when a result group moved
 */
function dragLineDrawWithResult(array1Details) {
  pathDetails.forEach(path => {
    if (path.fromId === array1Details[0].RgroupId) {
      path.pathBetween.remove();
      drawLine(
        array1Details[0].RgroupId,
        path.toId,
        array1Details[0].Rcx,
        array1Details[0].Rcy,
        path.x2,
        path.y2,
        array1Details[0].ID,
        path.toParentID,
        4,
        path.toType,
        array1Details[0].position.slice(0),
        path.toTypePosition.slice(0),
        "Drag",
        path.IsCorrect
      );
    } else if (path.toId === array1Details[0].RgroupId) {
      path.pathBetween.remove();
      drawLine(
        path.fromId,
        array1Details[0].RgroupId,
        path.x1,
        path.y1,
        array1Details[0].Rcx,
        array1Details[0].Rcy,
        path.fromParentID,
        array1Details[0].ID,
        path.fromType,
        4,
        path.fromTypePosition.slice(0),
        array1Details[0].position.slice(0),
        "Drag",
        path.IsCorrect
      );
    } else if (path.fromId === array1Details[0].BgroupId) {
      path.pathBetween.remove();
      drawLine(
        array1Details[0].BgroupId,
        path.toId,
        array1Details[0].Bcx,
        array1Details[0].Bcy,
        path.x2,
        path.y2,
        array1Details[0].ID,
        path.toParentID,
        5,
        path.toType,
        array1Details[0].position.slice(0),
        path.toTypePosition.slice(0),
        "Drag",
        path.IsCorrect
      );
    } else if (path.toId === array1Details[0].BgroupId) {
      path.pathBetween.remove();
      drawLine(
        path.fromId,
        array1Details[0].BgroupId,
        path.x1,
        path.y1,
        array1Details[0].Bcx,
        array1Details[0].Bcy,
        path.fromParentID,
        array1Details[0].ID,
        path.fromType,
        5,
        path.fromTypePosition.slice(0),
        array1Details[0].position.slice(0),
        "Drag",
        path.IsCorrect
      );
    }
  });
}

/**
 * Function call when a content moved successfully
 */
function contentOnmove(x) {
  if (updatedContentData.length) {
    var draggedContent = $(`#${updatedContentData[0].ID}`).find(
      ".box-content-gutter"
    )[0];
    var draggedContentTitle = $(`#${updatedContentData[0].ID}`).find(
      ".content-gutter"
    )[0];
    contentDetails.forEach((contentData, index) => {
      if (contentData.ID === this.node.id && updatedContentData.length) {
        contentDetails[index] = Object.assign({}, updatedContentData[0]);
        updatedContentData = [];
        setTimeout(() => {
          if(isMoveCount > 1){
            $(draggedContent).removeClass("drag-item");
            $(draggedContentTitle).removeClass("drag");
            $(draggedContent).addClass("app-data");
            $(draggedContentTitle).addClass("app-data");
          }
          isMoveCount = 0;
        }, 200);
      }
    });
  }
}

/**
 * Function call on dragging Content div
 */
function contentDragMove(dx, dy) {
  if (updatedContentData.length) {
    dx =
      selectedContentPosition[0] + dx >= 0 &&
      selectedContentPosition[0] + dx <= updatedWidth - 215
        ? dx
        : updatedContentData[0].position[0] - selectedContentPosition[0];
    dy =
      selectedContentPosition[1] + dy >= 0 &&
      selectedContentPosition[1] + dy <= updatedHeight - 140
        ? dy
        : updatedContentData[0].position[1] - selectedContentPosition[1];
  }

  if(componentReference.oldWhatsappFlow && componentReference.firstQuesAndContentObj.Type == BranchingLogicEnum.CONTENT && this.node.id == 'C_'+componentReference.firstQuesAndContentObj.Id){
    dy = 0
  }

  updatedContentData = [];
  contentDetails.forEach(contentData => {
    if (contentData.ID === this.node.id) {
      if (contentData.Ccx) {
        updatedContentData.push({
          ID: contentData.ID,
          CgroupId: contentData.CgroupId,
          Ccx: contentData.Ccx + dx,
          Ccy: contentData.Ccy + dy,
          CBgroupId: contentData.CBgroupId,
          position: [contentData.position[0] + dx, contentData.position[1] + dy]
        });
        if (oneLineDetails.length) {
          if (oneLineDetails[0].groupId === contentData.CgroupId) {
            oneLineDetails[0].x1 = updatedContentData[0].Ccx;
            oneLineDetails[0].y1 = updatedContentData[0].Ccy;
            oneLineDetails[0].position = updatedContentData[0].position.slice(
              0
            );
          }
        }
      } else {
        updatedContentData.push({
          ID: contentData.ID,
          CgroupId: contentData.CgroupId,
          CBgroupId: contentData.CBgroupId
        });
      }
      if (contentData.CBcx) {
        updatedContentData[0].CBcx = contentData.CBcx + dx;
        updatedContentData[0].CBcy = contentData.CBcy + dy;
        updatedContentData[0].position = [
          contentData.position[0] + dx,
          contentData.position[1] + dy
        ];
        if (oneLineDetails.length) {
          if (oneLineDetails[0].groupId === contentData.CBgroupId) {
            oneLineDetails[0].x1 = updatedContentData[0].CBcx;
            oneLineDetails[0].y1 = updatedContentData[0].CBcy;
            oneLineDetails[0].position = updatedContentData[0].position.slice(
              0
            );
          }
        }
      }
    }
  });

  this.attr({
    transform:
      this.data("origTransform") +
      (this.data("origTransform") ? "T" : "t") +
      [dx, dy]
  });
  var draggedContent = $(`#${updatedContentData[0].ID}`).find(
    ".box-content-gutter"
  )[0];
  var draggedContentTitle = $(`#${updatedContentData[0].ID}`).find(
    ".content-gutter"
  )[0];
  isMoveCount = isMoveCount + 1;
  if(isMoveCount > 1){
    $(draggedContent).addClass("drag-item");
    $(draggedContentTitle).addClass("drag");
    $(draggedContent).removeClass("app-data");
    $(draggedContentTitle).removeClass("app-data");
  }
  dragLineDrawWithContent(updatedContentData);
}

/**
 * Function call when Content is start dragging
 */
function contentDragStart() {
  contentDetails.forEach(contentData => {
    if (contentData.ID == this.node.id) {
      selectedContentPosition = contentData.position.slice(0);
    }
  });

  this.data("origTransform", this.transform().local);
}

/**
 * to get the value when click on a Content circle
 */
function clickOnContentCircle(clickOnContentCircle) {
  var selectedContent;
  var selectedType;
  contentDetails.forEach(contentData => {
    if (contentData.CgroupId === this.node.id) {
      selectedContent = Object.assign({}, contentData);
      selectedType = 6;
      updateOneLineArrayDetail(
        contentData.Ccx,
        contentData.Ccy,
        contentData.CgroupId,
        contentData.ID,
        selectedType,
        contentData.position.slice(0)
      );
    } else if (contentData.CBgroupId === this.node.id) {
      selectedContent = Object.assign({}, contentData);
      selectedType = 7;
      updateOneLineArrayDetail(
        contentData.CBcx,
        contentData.CBcy,
        contentData.CBgroupId,
        contentData.ID,
        selectedType,
        contentData.position.slice(0)
      );
    }
  });

  drowOneLineDetails();
}

/**
 *  Function when a content group moved
 */
function dragLineDrawWithContent(array1Details) {
  pathDetails.forEach(path => {
    if (path.fromId === array1Details[0].CgroupId) {
      path.pathBetween.remove();
      drawLine(
        array1Details[0].CgroupId,
        path.toId,
        array1Details[0].Ccx,
        array1Details[0].Ccy,
        path.x2,
        path.y2,
        array1Details[0].ID,
        path.toParentID,
        6,
        path.toType,
        array1Details[0].position.slice(0),
        path.toTypePosition.slice(0),
        "Drag",
        path.IsCorrect
      );
    } else if (path.toId === array1Details[0].CgroupId) {
      path.pathBetween.remove();
      drawLine(
        path.fromId,
        array1Details[0].CgroupId,
        path.x1,
        path.y1,
        array1Details[0].Ccx,
        array1Details[0].Ccy,
        path.fromParentID,
        array1Details[0].ID,
        path.fromType,
        6,
        path.fromTypePosition.slice(0),
        array1Details[0].position.slice(0),
        "Drag",
        path.IsCorrect
      );
    } else if (path.fromId === array1Details[0].CBgroupId) {
      path.pathBetween.remove();
      drawLine(
        array1Details[0].CBgroupId,
        path.toId,
        array1Details[0].CBcx,
        array1Details[0].CBcy,
        path.x2,
        path.y2,
        array1Details[0].ID,
        path.toParentID,
        7,
        path.toType,
        array1Details[0].position.slice(0),
        path.toTypePosition.slice(0),
        "Drag",
        path.IsCorrect
      );
    } else if (path.toId === array1Details[0].CBgroupId) {
      path.pathBetween.remove();
      drawLine(
        path.fromId,
        array1Details[0].CBgroupId,
        path.x1,
        path.y1,
        array1Details[0].CBcx,
        array1Details[0].CBcy,
        path.fromParentID,
        array1Details[0].ID,
        path.fromType,
        7,
        path.fromTypePosition.slice(0),
        array1Details[0].position.slice(0),
        "Drag",
        path.IsCorrect
      );
    }
  });
}

/**
 * Function call when a action moved successfully
 */
function badgeOnmove(x) {
  if (updatedBadgeData.length) {
    var draggedBadge = $(`#${updatedBadgeData[0].ID}`).find(
      ".badge-container-gutter"
    )[0];
    var draggedBadgeTitle = $(`#${updatedBadgeData[0].ID}`).find(
      ".badge-container"
    )[0];
    badgeDetails.forEach((badgeData, index) => {
      if (badgeData.ID === this.node.id && updatedBadgeData.length) {
        badgeDetails[index] = Object.assign({}, updatedBadgeData[0]);
        updatedBadgeData = [];
        setTimeout(() => {
          if(isMoveCount > 1){
            $(draggedBadge).removeClass("drag-item");
            $(draggedBadgeTitle).removeClass("drag");
            $(draggedBadge).addClass("app-data");
            $(draggedBadgeTitle).addClass("app-data");
          }
          isMoveCount = 0;
        }, 200);
      }
    });
  }
}

/**
 * Function call on dragging Action div
 */
function badgeDragMove(dx, dy) {
  if (updatedBadgeData.length) {
    dx =
      selectedBadgePosition[0] + dx >= 0 &&
      selectedBadgePosition[0] + dx <= updatedWidth - 165
        ? dx
        : updatedBadgeData[0].position[0] - selectedBadgePosition[0];
    dy =
      selectedBadgePosition[1] + dy >= 0 &&
      selectedBadgePosition[1] + dy <= updatedHeight - 50
        ? dy
        : updatedActionData[0].position[1] - selectedBadgePosition[1];
  }

  updatedBadgeData = [];
  badgeDetails.forEach(badgeData => {
    if (badgeData.ID === this.node.id) {
      if (badgeData.BDcx) {
        updatedBadgeData.push({
          ID: badgeData.ID,
          BDgroupId: badgeData.BDgroupId,
          BDcx: badgeData.BDcx + dx,
          BDcy: badgeData.BDcy + dy,
          position: [badgeData.position[0] + dx, badgeData.position[1] + dy]
        });
        if (oneLineDetails.length) {
          if (oneLineDetails[0].groupId === badgeData.BDgroupId) {
            oneLineDetails[0].x1 = updatedBadgeData[0].BDcx;
            oneLineDetails[0].y1 = updatedBadgeData[0].BDcy;
            oneLineDetails[0].position = updatedBadgeData[0].position.slice(0);
          }
        }
      } else {
        updatedBadgeData.push({
          ID: badgeData.ID,
          BDgroupId: badgeData.BDgroupId
        });
      }
    }
  });

  this.attr({
    transform:
      this.data("origTransform") +
      (this.data("origTransform") ? "T" : "t") +
      [dx, dy]
  });
  var draggedBadge = $(`#${updatedBadgeData[0].ID}`).find(
    ".badge-container-gutter"
  )[0];
  var draggedBadgeTitle = $(`#${updatedBadgeData[0].ID}`).find(
    ".badge-container"
  )[0];
  isMoveCount = isMoveCount + 1;
  if(isMoveCount > 1){
    $(draggedBadge).addClass("drag-item");
    $(draggedBadgeTitle).addClass("drag");
    $(draggedBadge).removeClass("app-data");
    $(draggedBadgeTitle).removeClass("app-data");
  }
  $(draggedBadge).addClass("drag-item");
  dragLineDrawWithBadge(updatedBadgeData);
}

/**
 * Function call when action is start dragging
 */
function badgeDragStart() {
  badgeDetails.forEach(badgeData => {
    if (badgeData.ID == this.node.id) {
      selectedBadgePosition = badgeData.position.slice(0);
    }
  });

  this.data("origTransform", this.transform().local);
}

/**
 * to get the value when click on an Action circle
 */
function clickOnBadgeCircle(clickOnBadgeCircle) {
  var selectedBadge;
  var selectedType;
  badgeDetails.forEach(badgeData => {
    if (badgeData.BDgroupId === this.node.id) {
      selectedBadge = Object.assign({}, badgeData);
      selectedType = 11;
      updateOneLineArrayDetail(
        badgeData.BDcx,
        badgeData.BDcy,
        badgeData.BDgroupId,
        badgeData.ID,
        selectedType,
        badgeData.position.slice(0)
      );
    }
  });
  drowOneLineDetails();
}

function drowOneLineDetails(){
  if (oneLineDetails.length >= 2) {
    if (
      isCreateAPath(oneLineDetails[0].Type, oneLineDetails[1].Type) &&
      !isPathDuplicate(oneLineDetails[0].groupId, oneLineDetails[1].groupId)
    ) {
      drawLine(
        oneLineDetails[0].groupId,
        oneLineDetails[1].groupId,
        oneLineDetails[0].x1,
        oneLineDetails[0].y1,
        oneLineDetails[1].x1,
        oneLineDetails[1].y1,
        oneLineDetails[0].ID,
        oneLineDetails[1].ID,
        oneLineDetails[0].Type,
        oneLineDetails[1].Type,
        oneLineDetails[0].position.slice(0),
        oneLineDetails[1].position.slice(0),
        "New",
        oneLineDetails[0].IsCorrect ? oneLineDetails[0].IsCorrect : oneLineDetails[1].IsCorrect
      );
      oneLineDetails = [];
    } else {
      oneLineDetails.splice(0, 2);
    }
  }
}

/**
 *  Function when a result group moved
 */
function dragLineDrawWithBadge(array1Details) {
  pathDetails.forEach(path => {
    if (path.fromId === array1Details[0].BDgroupId) {
      path.pathBetween.remove();
      drawLine(
        array1Details[0].BDgroupId,
        path.toId,
        array1Details[0].BDcx,
        array1Details[0].BDcy,
        path.x2,
        path.y2,
        array1Details[0].ID,
        path.toParentID,
        11,
        path.toType,
        array1Details[0].position.slice(0),
        path.toTypePosition.slice(0),
        "Drag",
        path.IsCorrect
      );
    } else if (path.toId === array1Details[0].BDgroupId) {
      path.pathBetween.remove();
      drawLine(
        path.fromId,
        array1Details[0].BDgroupId,
        path.x1,
        path.y1,
        array1Details[0].BDcx,
        array1Details[0].BDcy,
        path.fromParentID,
        array1Details[0].ID,
        path.fromType,
        11,
        path.fromTypePosition.slice(0),
        array1Details[0].position.slice(0),
        "Drag",
        path.IsCorrect
      );
    }
  });
}

function openMoreOption(type) {
  var x = this.getBBox().width;
  var y = this.getBBox().height;
  var isEditFlowOption = false;

  if (componentReference.quizData && componentReference.quizData.QuizTypeId == 3 && this.node.id.split("_")[0] === "r") {
    let elementId = this.node.id.split("_")[1];
    isEditFlowOption = componentReference.getBasedOnCorealtion(elementId);
  }

  var deleteBranch = componentReference.language == 'en-US' ? 'Delete' :'Verwijder';
  var editBranch = componentReference.language == 'en-US' ? 'Edit' :'Bewerk';
  var unlinkBranch = componentReference.language == 'en-US' ? 'Unlink all' :'Ontkoppel alles';
  var duplicateBranch = componentReference.language == 'en-US' ? 'Duplicate' : 'Dupliceren';

  var fobjectDelete = `<svg>
  <foreignObject width="${componentReference.language == 'en-US' ? 100 : 120}" height="30">
  <body>
  <div class="li" [id]=${this.node.id}>
  <span>
  ${deleteBranch}
  </span>
  <i class="fa fa-trash" aria-hidden="true"></i>
  </div>
  </body>
  </foreignObject>
  </svg>`;

  var fobjectEditToBuilder = `<svg>
  <foreignObject width="${componentReference.language == 'en-US' ? 85 : 110}" height="30">
  <body>
  <div class="li app-data" [id]=${this.node.id} app-data="edit-quiz">
  <span>
  ${editBranch}
  </span>
  <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
  </div>
  </body>
  </foreignObject>
  </svg>`;

  var fobjectUnlink = `<svg>
  <foreignObject width="${componentReference.language == 'en-US' ? 119 : 159}" height="30">
  <body>
  <div class="li" [id]=${this.node.id}>
  <span>
  ${unlinkBranch}
  </span>
  <i class="fa fa-chain-broken" aria-hidden="true"></i>
  </div>
  </body>
  </foreignObject>
  </svg>`;

  let duplicateClass = 'hide-duplicate';
  if(componentReference.quizData.IsQuesAndContentInSameTable){
    if(this.node.id.split("_")[0] === "r"){
      if(componentReference.quizData && (((componentReference.quizData.QuizTypeId == 2 || componentReference.quizData.QuizTypeId == 5) && componentReference.resultCount <= componentReference.questionCount) || 
      ((componentReference.quizData.QuizTypeId == 4 || componentReference.quizData.QuizTypeId == 6) && componentReference.resultCount < ((componentReference.maximum-componentReference.minimum)+1)) ||
      (componentReference.quizData.QuizTypeId == 3 || componentReference.quizData.QuizTypeId == 7)) && !isEditFlowOption){
        duplicateClass = 'li';
      }
    }else{
      duplicateClass = 'li';
    }
  }
  

  var fobjectDuplicate = `<svg>
  <foreignObject width="${componentReference.language == 'en-US' ? 119 : 129}" height="30">
  <body>
  <div class=${duplicateClass} [id]=${this.node.id}>
  <span>
  ${duplicateBranch}
  </span>
  <i class="fa fa-clone" aria-hidden="true"></i>
  </div>
  </body>
  </foreignObject>
  </svg>`;

  var moreOptiondiv1 = Snap.parse(fobjectDelete);
  var moreOptiondiv3 = Snap.parse(fobjectEditToBuilder);
  var moreOptiondiv2 = Snap.parse(fobjectUnlink);
  var moreOptiondiv4 = Snap.parse(fobjectDuplicate);
  if (!deleteOptionGroup || !editToBuilderOptionGroup || !unlinkOptionGroup || !duplicateOptionGroup) {
    if (this.node.id.split("_")[0] === "q") {
      uniqueMoreOptionsId = this.node.id;
      deleteOptionGroup = this.group()
        .append(moreOptiondiv1)
        .attr({ cursor: "pointer" })
        .transform(`t${x - (componentReference.language == 'en-US' ? 100 : 120)}, ${-55}`);
      deleteOptionGroup.click(deleteQuestionGroup, this);
      editToBuilderOptionGroup = this.group()
        .append(moreOptiondiv3)
        .attr({ cursor: "pointer" })
        .transform(`t${x - (componentReference.language == 'en-US' ? 85 : 110)}, ${-95}`);
      editToBuilderOptionGroup.click(editToBuilder, this);
      unlinkOptionGroup = this.group()
        .append(moreOptiondiv2)
        .attr({ cursor: "pointer" })
        .transform(`t${x - (componentReference.language == 'en-US' ? 118 : 158)}, ${-135}`);
      unlinkOptionGroup.click(unlinkQuestionGroup, this);
      duplicateOptionGroup = this.group()
      .append(moreOptiondiv4)
      .attr({ cursor: "pointer" })
      .transform(`t${x - (componentReference.language == 'en-US' ? 118 : 128)}, ${-175}`);
      duplicateOptionGroup.click(duplicateQuestionGroup, this);
    } else if (this.node.id.split("_")[0] === "r") {
      uniqueMoreOptionsId = this.node.id;
      deleteOptionGroup = this.group()
        .append(moreOptiondiv1)
        .attr({ cursor: "pointer" })
        .transform(`t${x - (componentReference.language == 'en-US' ? 100 : 120)}, ${-55}`);
      deleteOptionGroup.click(deleteResultGroup, this);
      if(!isEditFlowOption){
        editToBuilderOptionGroup = this.group()
          .append(moreOptiondiv3)
          .attr({ cursor: "pointer" })
          .transform(`t${x - (componentReference.language == 'en-US' ? 85 : 110)}, ${-95}`);
        editToBuilderOptionGroup.click(editToBuilder, this);
      }else{
        editToBuilderOptionGroup = this.group()
        .append(moreOptiondiv3)
        .attr({ cursor: "pointer", class: 'display-none' })
        .transform(`t${x - (componentReference.language == 'en-US' ? 85 : 110)}, ${-95}`);
        editToBuilderOptionGroup.click(editToBuilder, this);  
      }
      unlinkOptionGroup = this.group()
        .append(moreOptiondiv2)
        .attr({ cursor: "pointer" })
        .transform(`t${x - (componentReference.language == 'en-US' ? 118 : 158)}, ${isEditFlowOption ? -95 :-135}`);
      unlinkOptionGroup.click(unlinkResultGroup, this);
      duplicateOptionGroup = this.group()
      .append(moreOptiondiv4)
      .attr({ cursor: "pointer" })
      .transform(`t${x - (componentReference.language == 'en-US' ? 118 : 128)}, ${-175}`);
      if(componentReference.quizData && (((componentReference.quizData.QuizTypeId == 2 || componentReference.quizData.QuizTypeId == 5) && componentReference.resultCount <= componentReference.questionCount) || 
      ((componentReference.quizData.QuizTypeId == 4 || componentReference.quizData.QuizTypeId == 6) && componentReference.resultCount < ((componentReference.maximum-componentReference.minimum)+1)) ||
      (componentReference.quizData.QuizTypeId == 3 || componentReference.quizData.QuizTypeId == 7))){
        duplicateOptionGroup.click(duplicateResultGroup, this);
      }
    } else if (this.node.id.split("_")[0] === "c") {
      uniqueMoreOptionsId = this.node.id;
      deleteOptionGroup = this.group()
        .append(moreOptiondiv1)
        .attr({ cursor: "pointer" })
        .transform(`t${x - (componentReference.language == 'en-US' ? 100 : 120)}, ${-55}`);
      deleteOptionGroup.click(deleteContentGroup, this);
      editToBuilderOptionGroup = this.group()
        .append(moreOptiondiv3)
        .attr({ cursor: "pointer" })
        .transform(`t${x - (componentReference.language == 'en-US' ? 85 : 110)}, ${-95}`);
      editToBuilderOptionGroup.click(editToBuilder, this);
      unlinkOptionGroup = this.group()
        .append(moreOptiondiv2)
        .attr({ cursor: "pointer" })
        .transform(`t${x - (componentReference.language == 'en-US' ? 118 : 158)}, ${-135}`);
      unlinkOptionGroup.click(unlinkContentGroup, this);
      duplicateOptionGroup = this.group()
      .append(moreOptiondiv4)
      .attr({ cursor: "pointer" })
      .transform(`t${x - (componentReference.language == 'en-US' ? 118 : 128)}, ${-175}`);
      duplicateOptionGroup.click(duplicateContentGroup, this);
    } else if (this.node.id.split("_")[0] === "b") {
      uniqueMoreOptionsId = this.node.id;
      deleteOptionGroup = this.group()
        .append(moreOptiondiv1)
        .attr({ cursor: "pointer" })
        .transform(`t${x - (componentReference.language == 'en-US' ? 100 : 120)}, ${-65}`);
      deleteOptionGroup.click(deleteBadgeGroup, this);
      editToBuilderOptionGroup = this.group()
        .append(moreOptiondiv3)
        .attr({ cursor: "pointer" })
        .transform(`t${x - (componentReference.language == 'en-US' ? 85 : 110)}, ${-105}`);
      editToBuilderOptionGroup.click(editToBuilder, this);
      unlinkOptionGroup = this.group()
        .append(moreOptiondiv2)
        .attr({ cursor: "pointer" })
        .transform(`t${x - (componentReference.language == 'en-US' ? 118 : 158)}, ${-145}`);
      unlinkOptionGroup.click(unlinkBadgeGroup, this);
    }
  } else if (this.node.id === uniqueMoreOptionsId) {
    deleteOptionGroup.remove();
    editToBuilderOptionGroup.remove();
    unlinkOptionGroup.remove();
    duplicateOptionGroup.remove();
    uniqueMoreOptionsId = "";
  } else if (
    deleteOptionGroup ||
    editToBuilderOptionGroup ||
    unlinkOptionGroup ||
    duplicateOptionGroup
  ) {
    deleteOptionGroup.remove();
    editToBuilderOptionGroup.remove();
    unlinkOptionGroup.remove();
    duplicateOptionGroup.remove();
    if (this.node.id.split("_")[0] === "q") {
      uniqueMoreOptionsId = this.node.id;
      deleteOptionGroup = this.group()
        .append(moreOptiondiv1)
        .attr({ cursor: "pointer" })
        .transform(`t${x - (componentReference.language == 'en-US' ? 100 : 120)}, ${-55}`);
      deleteOptionGroup.click(deleteQuestionGroup, this);
      editToBuilderOptionGroup = this.group()
        .append(moreOptiondiv3)
        .attr({ cursor: "pointer" })
        .transform(`t${x - (componentReference.language == 'en-US' ? 85 : 110)}, ${-95}`);
      editToBuilderOptionGroup.click(editToBuilder, this);
      unlinkOptionGroup = this.group()
        .append(moreOptiondiv2)
        .attr({ cursor: "pointer" })
        .transform(`t${x - (componentReference.language == 'en-US' ? 118 : 158)}, ${-135}`);
      unlinkOptionGroup.click(unlinkQuestionGroup, this);
      duplicateOptionGroup = this.group()
      .append(moreOptiondiv4)
      .attr({ cursor: "pointer" })
      .transform(`t${x - (componentReference.language == 'en-US' ? 118 : 128)}, ${-175}`);
      duplicateOptionGroup.click(duplicateQuestionGroup, this);
    } else if (this.node.id.split("_")[0] === "r") {
      uniqueMoreOptionsId = this.node.id;
      deleteOptionGroup = this.group()
        .append(moreOptiondiv1)
        .attr({ cursor: "pointer" })
        .transform(`t${x - (componentReference.language == 'en-US' ? 100 : 120)}, ${-55}`);
      deleteOptionGroup.click(deleteResultGroup, this);
      if(!isEditFlowOption){
      editToBuilderOptionGroup = this.group()
        .append(moreOptiondiv3)
        .attr({ cursor: "pointer" })
        .transform(`t${x - (componentReference.language == 'en-US' ? 85 : 110)}, ${-95}`);
      editToBuilderOptionGroup.click(editToBuilder, this);
      }else{
        editToBuilderOptionGroup = this.group()
        .append(moreOptiondiv3)
        .attr({ cursor: "pointer", class: 'display-none' })
        .transform(`t${x - (componentReference.language == 'en-US' ? 85 : 110)}, ${-95}`);
        editToBuilderOptionGroup.click(editToBuilder, this);
      }
      unlinkOptionGroup = this.group()
        .append(moreOptiondiv2)
        .attr({ cursor: "pointer" })
        .transform(`t${x - (componentReference.language == 'en-US' ? 118 : 158)}, ${isEditFlowOption ? -95 :-135}`);
      unlinkOptionGroup.click(unlinkResultGroup, this);
      duplicateOptionGroup = this.group()
      .append(moreOptiondiv4)
      .attr({ cursor: "pointer" })
      .transform(`t${x - (componentReference.language == 'en-US' ? 118 : 128)}, ${-175}`);
      if(componentReference.quizData && (((componentReference.quizData.QuizTypeId == 2 || componentReference.quizData.QuizTypeId == 5) && componentReference.resultCount <= componentReference.questionCount) || 
      ((componentReference.quizData.QuizTypeId == 4 || componentReference.quizData.QuizTypeId == 6) && componentReference.resultCount < ((componentReference.maximum-componentReference.minimum)+1)) ||
      (componentReference.quizData.QuizTypeId == 3 || componentReference.quizData.QuizTypeId == 7))){
        duplicateOptionGroup.click(duplicateResultGroup, this);
      }
    } else if (this.node.id.split("_")[0] === "c") {
      uniqueMoreOptionsId = this.node.id;
      deleteOptionGroup = this.group()
        .append(moreOptiondiv1)
        .attr({ cursor: "pointer" })
        .transform(`t${x - (componentReference.language == 'en-US' ? 100 : 120)}, ${-55}`);
      deleteOptionGroup.click(deleteContentGroup, this);
      editToBuilderOptionGroup = this.group()
        .append(moreOptiondiv3)
        .attr({ cursor: "pointer" })
        .transform(`t${x - (componentReference.language == 'en-US' ? 85 : 110)}, ${-95}`);
      editToBuilderOptionGroup.click(editToBuilder, this);
      unlinkOptionGroup = this.group()
        .append(moreOptiondiv2)
        .attr({ cursor: "pointer" })
        .transform(`t${x - (componentReference.language == 'en-US' ? 118 : 158)}, ${-135}`);
      unlinkOptionGroup.click(unlinkContentGroup, this);
      duplicateOptionGroup = this.group()
      .append(moreOptiondiv4)
      .attr({ cursor: "pointer" })
      .transform(`t${x - (componentReference.language == 'en-US' ? 118 : 128)}, ${-175}`);
      duplicateOptionGroup.click(duplicateContentGroup, this);
    } else if (this.node.id.split("_")[0] === "b") {
      uniqueMoreOptionsId = this.node.id;
      deleteOptionGroup = this.group()
        .append(moreOptiondiv1)
        .attr({ cursor: "pointer" })
        .transform(`t${x - (componentReference.language == 'en-US' ? 100 : 120)}, ${-65}`);
      deleteOptionGroup.click(deleteBadgeGroup, this);
      editToBuilderOptionGroup = this.group()
        .append(moreOptiondiv3)
        .attr({ cursor: "pointer" })
        .transform(`t${x - (componentReference.language == 'en-US' ? 85 : 110)}, ${-105}`);
      editToBuilderOptionGroup.click(editToBuilder, this);
      unlinkOptionGroup = this.group()
        .append(moreOptiondiv2)
        .attr({ cursor: "pointer" })
        .transform(`t${x - (componentReference.language == 'en-US' ? 118 : 158)}, ${-145}`);
      unlinkOptionGroup.click(unlinkBadgeGroup, this);
    }
  }
}

/**
 * Function call on click cut Button
 */
function deleteQuestionGroup() {
  uniqueMoreOptionsId = "";
  var questionIndex;
  var pathIndex = [];
  var removedQuestion;
  questionIndex = questionDetails.findIndex(removeQuestion => {
    return removeQuestion.ID === this.node.parentNode.id;
  });
  removedQuestion = questionDetails.splice(questionIndex, 1);

  pathDetails.forEach(path => {
    if (
      path.fromParentID === this.node.parentNode.id ||
      path.toParentID === this.node.parentNode.id
    ) {
      pathIndex.push(
        pathDetails.findIndex(removedpath => {
          return removedpath === path;
        })
      );
      path.pathBetween.remove();
    }
  });

  for (var i = pathIndex.length - 1; i >= 0; i--) {
    pathDetails.splice(pathIndex[i], 1);
  }

  branchingLogicDataList["QuestionAndContentList"].forEach(question => {
    if(question.Type == 2){
      if (question.QuestionId == removedQuestion[0].QgroupId.split("_")[1]) {
        removedQuestionDetails = question;
      }
    }
  });
  componentReference.addDeletedData(removedQuestionDetails, 2);

  this.node.parentNode.remove();
}

function duplicateQuestionGroup() {
  let questionId = this.node.parentNode.id.split("_")[1];
  removeOptionGroup();
  if(componentReference.quizData.IsQuesAndContentInSameTable){
    componentReference.onDuplicateQuestion(questionId);
  }
}

function duplicateContentGroup() {
  let contentId = this.node.parentNode.id.split("_")[1];
  removeOptionGroup();
  if(componentReference.quizData.IsQuesAndContentInSameTable){
    componentReference.onDuplicateQuestion(contentId);
  }
}

function duplicateResultGroup() {
  let resultId = this.node.parentNode.id.split("_")[1];
  removeOptionGroup();
  if(componentReference.quizData.IsQuesAndContentInSameTable){
    componentReference.onDuplicateResult(resultId);
  }
}

function removeOptionGroup() {
  if (deleteOptionGroup && editToBuilderOptionGroup && unlinkOptionGroup && duplicateOptionGroup) {
    deleteOptionGroup.remove();
    editToBuilderOptionGroup.remove();
    unlinkOptionGroup.remove();
    duplicateOptionGroup.remove();
    uniqueMoreOptionsId = "";
  }
}

function editToBuilder(element) {
  uniqueMoreOptionsId = "";
  var elementType, elementId, type;
  if (this.node.id.split("_")[0] === "q") {
    (type = 2),(elementType = "question"), (elementId = this.node.id.split("_")[1]);
  } else if (this.node.id.split("_")[0] === "r") {
    (type = 4),(elementType = "result"), (elementId = this.node.id.split("_")[1]);
  }else if (this.node.id.split("_")[0] === "c") {
    (type = 6),(elementType = "content"), (elementId = this.node.id.split("_")[1]);
  } else if (this.node.id.split("_")[0] === "b") {
    (type = 11),(elementType = "badge"), (elementId = this.node.id.split("_")[1]);
  }
  
  //componentReference.updateBranchingLogic(elementType, elementId);
  componentReference.onEditQuiz(type,elementId,false);
}

function unlinkQuestionGroup() {
  var pathIndex = [];
  var connectedAnswersId = [];
  var answerListBlocks = [];
  pathDetails.forEach(path => {
    if (
      path.fromParentID === this.node.parentNode.id ||
      path.toParentID === this.node.parentNode.id
    ) {
      pathIndex.push(
        pathDetails.findIndex(removedpath => {
          return removedpath === path;
        })
      );
      path.pathBetween.remove();
      if (path.fromType == 2 || path.toType == 3) {
        connectedAnswersId.push(path.toId);
      } else if (path.toType == 2 || path.fromType == 3) {
        connectedAnswersId.push(path.fromId);
      }
    }
  });

  for (var i = pathIndex.length - 1; i >= 0; i--) {
    pathDetails.splice(pathIndex[i], 1);
  }

  for (var j = 0; j < connectedAnswersId.length; j++) {
    var arr = $(`#${connectedAnswersId[j]}`).find(".link-to-block");
    for (var k = 0; k < arr.length; k++) {
      answerListBlocks.push(arr[k]);
      ``;
    }
  }

  for (var j = 0; j < answerListBlocks.length; j++) {
    if (answerListBlocks[j]) {
      answerListBlocks[j].style.display = "block";
    }
  }

  if (deleteOptionGroup && editToBuilderOptionGroup && unlinkOptionGroup && duplicateOptionGroup) {
    deleteOptionGroup.remove();
    editToBuilderOptionGroup.remove();
    unlinkOptionGroup.remove();
    duplicateOptionGroup.remove();
    uniqueMoreOptionsId = "";
  }
}

/**
 * Function call on click cut Button
 */
function deleteResultGroup() {
  uniqueMoreOptionsId = "";
  var resultIndex;
  var pathIndex = [];
  var removedResult;
  resultIndex = resultDetails.findIndex(removeResult => {
    return removeResult.ID === this.node.parentNode.id;
  });
  removedResult = resultDetails.splice(resultIndex, 1);
  pathDetails.forEach(path => {
    if (
      path.fromParentID === this.node.parentNode.id ||
      path.toParentID === this.node.parentNode.id
    ) {
      pathIndex.push(
        pathDetails.findIndex(removedpath => {
          return removedpath === path;
        })
      );
      path.pathBetween.remove();
    }
  });

  for (var i = pathIndex.length - 1; i >= 0; i--) {
    pathDetails.splice(pathIndex[i], 1);
  }

  branchingLogicDataList["ResultList"].forEach(result => {
    if (result.ResultId == removedResult[0].RgroupId.split("_")[1]) {
      removedResultDetails = result;
    }
  });
  componentReference.addDeletedData(removedResultDetails, 4);

  this.node.parentNode.remove();
}

function unlinkResultGroup() {
  var pathIndex = [];
  var connectedResultsId = [];
  var resultButtonBlock = [];
  pathDetails.forEach(path => {
    if (
      path.fromParentID === this.node.parentNode.id ||
      path.toParentID === this.node.parentNode.id
    ) {
      pathIndex.push(
        pathDetails.findIndex(removedpath => {
          return removedpath === path;
        })
      );
      path.pathBetween.remove();
      if (path.fromType == 4 || path.toType == 5) {
        connectedResultsId.push(path.toId);
      } else if (path.toType == 4 || path.fromType == 5) {
        connectedResultsId.push(path.fromId);
      }
    }
  });

  for (var i = pathIndex.length - 1; i >= 0; i--) {
    pathDetails.splice(pathIndex[i], 1);
  }

  for (var j = 0; j < connectedResultsId.length; j++) {
    var arr = $(`#${connectedResultsId[j]}`).find(".link-to-block");
    for (var k = 0; k < arr.length; k++) {
      resultButtonBlock.push(arr[k]);
    }
  }

  // var resultButtonBlock = $(`#${this.node.parentNode.id}`).find(".link-to-block")
  for (var j = 0; j < resultButtonBlock.length; j++) {
    if (resultButtonBlock[j]) {
      resultButtonBlock[j].style.display = "block";
    }
  }

  if (deleteOptionGroup && editToBuilderOptionGroup && unlinkOptionGroup && duplicateOptionGroup) {
    deleteOptionGroup.remove();
    editToBuilderOptionGroup.remove();
    unlinkOptionGroup.remove();
    duplicateOptionGroup.remove();
    uniqueMoreOptionsId = "";
  }
}

/**
 * Function call on click cut Button
 */
function deleteContentGroup() {
  uniqueMoreOptionsId = "";
  var contentIndex;
  var pathIndex = [];
  var removedContent;
  contentIndex = contentDetails.findIndex(removeContent => {
    return removeContent.ID === this.node.parentNode.id;
  });
  removedContent = contentDetails.splice(contentIndex, 1);
  pathDetails.forEach(path => {
    if (
      path.fromParentID === this.node.parentNode.id ||
      path.toParentID === this.node.parentNode.id
    ) {
      pathIndex.push(
        pathDetails.findIndex(removedpath => {
          return removedpath === path;
        })
      );
      path.pathBetween.remove();
    }
  });

  for (var i = pathIndex.length - 1; i >= 0; i--) {
    pathDetails.splice(pathIndex[i], 1);
  }

  branchingLogicDataList["QuestionAndContentList"].forEach(content => {
    if(content.Type == 6){
      if (content.ContentId == removedContent[0].CgroupId.split("_")[1]) {
        removedContentDetails = content;
      }
    }
  });
  componentReference.addDeletedData(removedContentDetails, 6);

  this.node.parentNode.remove();
}

function unlinkContentGroup() {
  var pathIndex = [];
  var connectedContentId = [];
  var contentButtonBlock = [];
  pathDetails.forEach(path => {
    if (
      path.fromParentID === this.node.parentNode.id ||
      path.toParentID === this.node.parentNode.id
    ) {
      pathIndex.push(
        pathDetails.findIndex(removedpath => {
          return removedpath === path;
        })
      );
      path.pathBetween.remove();
      if (path.fromType == 8 || path.toType == 9) {
        connectedContentId.push(path.toId);
      } else if (path.toType == 8 || path.fromType == 9) {
        connectedContentId.push(path.fromId);
      }
    }
  });

  for (var i = pathIndex.length - 1; i >= 0; i--) {
    pathDetails.splice(pathIndex[i], 1);
  }

  for (var j = 0; j < connectedContentId.length; j++) {
    var arr = $(`#${connectedContentId[j]}`).find(".link-to-block");
    for (var k = 0; k < arr.length; k++) {
      contentButtonBlock.push(arr[k]);
    }
  }

  for (var j = 0; j < contentButtonBlock.length; j++) {
    contentButtonBlock[j].style.display = "block";
  }

  if (deleteOptionGroup && editToBuilderOptionGroup && unlinkOptionGroup && duplicateOptionGroup) {
    deleteOptionGroup.remove();
    editToBuilderOptionGroup.remove();
    unlinkOptionGroup.remove();
    duplicateOptionGroup.remove();
    uniqueMoreOptionsId = "";
  }
}

/**
 * Function call on click cut Button
 */
function deleteBadgeGroup() {
  uniqueMoreOptionsId = "";
  var badgeIndex;
  var pathIndex = [];
  var removedBadge;
  badgeIndex = badgeDetails.findIndex(removeAction => {
    return removeAction.ID === this.node.parentNode.id;
  });
  removedBadge = badgeDetails.splice(badgeIndex, 1);
  pathDetails.forEach(path => {
    if (
      path.fromParentID === this.node.parentNode.id ||
      path.toParentID === this.node.parentNode.id
    ) {
      pathIndex.push(
        pathDetails.findIndex(removedpath => {
          return removedpath === path;
        })
      );
      path.pathBetween.remove();
    }
  });

  for (var i = pathIndex.length - 1; i >= 0; i--) {
    pathDetails.splice(pathIndex[i], 1);
  }

  branchingLogicDataList["BadgeList"].forEach(badge => {
    if (badge.BadgetId == removedBadge[0].BDgroupId.split("_")[1]) {
      removedBadgeDetails = badge;
    }
  });
  componentReference.addDeletedData(removedBadgeDetails, 11);

  this.node.parentNode.remove();
}

function unlinkBadgeGroup() {
  var pathIndex = [];
  var connectedBadgesId = [];
  var badgeButtonBlock = [];
  pathDetails.forEach(path => {
    if (
      path.fromParentID === this.node.parentNode.id ||
      path.toParentID === this.node.parentNode.id
    ) {
      pathIndex.push(
        pathDetails.findIndex(removedpath => {
          return removedpath === path;
        })
      );
      path.pathBetween.remove();
      if (path.fromType == 11 || path.toType == 12) {
        connectedBadgesId.push(path.toId);
      } else if (path.toType == 11 || path.fromType == 12) {
        connectedBadgesId.push(path.fromId);
      }
    }
  });

  for (var i = pathIndex.length - 1; i >= 0; i--) {
    pathDetails.splice(pathIndex[i], 1);
  }

  for (var j = 0; j < connectedBadgesId.length; j++) {
    var arr = $(`#${connectedBadgesId[j]}`).find(".link-to-block");
    for (var k = 0; k < arr.length; k++) {
      badgeButtonBlock.push(arr[k]);
    }
  }

  for (var j = 0; j < badgeButtonBlock.length; j++) {
    if (badgeButtonBlock[j]) {
      badgeButtonBlock[j].style.display = "block";
    }
  }

  if (deleteOptionGroup && editToBuilderOptionGroup && unlinkOptionGroup) {
    deleteOptionGroup.remove();
    editToBuilderOptionGroup.remove();
    unlinkOptionGroup.remove();
    uniqueMoreOptionsId = "";
  }
}

function updateCircleDetails() {
  if (!oneLineDetails.length) {
    clickOnACircle = false;
    shadowPath.remove();
    shadowPath = null;
    clickedCircleDetails.circleData.removeClass("clicked");
    clickedCircleDetails = null;
  }
  if (
    clickedCircleDetails &&
    clickedCircleDetails.id === this.id &&
    shadowPath
  ) {
    clickOnACircle = false;
    clickedCircleDetails = null;
    this.removeClass("clicked");
    shadowPath.remove();
    shadowPath = null;
  } else if (!clickedCircleDetails && oneLineDetails.length) {
    clickOnACircle = true;
    clickedCircleDetails = {
      circleData: this,
      id: this.id,
      position: [
        oneLineDetails[oneLineDetails.length - 1].x1,
        oneLineDetails[oneLineDetails.length - 1].y1
      ]
    };
    this.addClass("clicked");
    createAShadowPath("Init");
  }
  if (
    clickedCircleDetails &&
    clickedCircleDetails.id != this.id &&
    oneLineDetails.length
  ) {
    clickedCircleDetails.circleData.removeClass("clicked");
    clickOnACircle = true;
    clickedCircleDetails = {
      circleData: this,
      id: this.id,
      position: [
        oneLineDetails[oneLineDetails.length - 1].x1,
        oneLineDetails[oneLineDetails.length - 1].y1
      ]
    };
    this.addClass("clicked");
    createAShadowPath("Init");
  }
}

function createAShadowPath(type) {
  if (shadowPath && type === "Dragged") {
    shadowPath.remove();
    shadowPath = null;
  }
  var clickedPositionArray;
  if (clickedCircleDetails) {
    clickedPositionArray = clickedCircleDetails.position.slice(0);
  }
  if (type === "Init") {
  }
  if (type === "Dragged") {
    if (true) {
      var midY = (clickedPositionArray[1] + pageY) / 2;
      var linePath = `M ${clickedPositionArray[0]} ${
        clickedPositionArray[1]
      } C ${clickedPositionArray[0]} ${midY} ${pageX} ${midY} ${pageX -
        2} ${pageY - 2}`;
      var lineLength = Snap.path.getTotalLength(linePath);
      var lineDraw = s.path(linePath);
      lineDraw.attr({ fill: "none", stroke: "#8c8989" });
      lineDraw.animate({ strokeDashoffset: 0 });
      shadowPath = lineDraw;
    }
  } else if (
    type.split("_")[0] === "Clicked" &&
    type.split("_")[1] &&
    shadowPath
  ) {
    oneLineDetails = [];
    clickOnACircle = false;
    shadowPath.remove();
    clickedCircleDetails.circleData.removeClass("clicked");
    clickedCircleDetails = null;
    shadowPath = null;
  }
}

function updateWidthHeight(branchingLogicData, maxQuestionWidth) {
  branchingLogicData.forEach(branchimgData => {
    if (+branchimgData.Position[0] + maxQuestionWidth > updatedWidth) {
      updatedWidth = +branchimgData.Position[0] + maxQuestionWidth;
      componentReference.svgWidth = updatedWidth;
    }
    if (+branchimgData.Position[1] + 200 > updatedHeight) {
      updatedHeight = +branchimgData.Position[1] + 500;
      componentReference.svgHeight = updatedHeight;
    }
  });
}