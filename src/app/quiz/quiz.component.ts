import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  OnDestroy,
  AfterViewChecked
} from "@angular/core";
import { CoverDetailsComponent } from "./cover-details/cover-details.component";
import { QuestionDetailsComponent } from "./question-details/question-details.component";
import { ActivatedRoute, Router } from "@angular/router";
import { QuizDataService } from "./quiz-data.service";
import { QuizApiService } from "./quiz-api.service";
import { QuestionImageDetailsComponent } from "./question-image-details/question-image-details.component";
import { ResultDetailsComponent } from "./result-details/result-details.component";
import { AnswerDetailsComponent } from "./answer-details/answer-details.component";
import { QuizTerminatedComponent } from "./quiz-terminated/quiz-terminated.component";
import { LeadFormComponent } from "./lead-form/lead-form.component";
import { Subscription } from "rxjs";
import { ContentDetailsComponent } from "./content-details/content-details.component";
import { LoaderService } from "../shared/loader-spinner";
import { MultipleResultsComponent } from "./multiple-results/multiple-results.component";
import { IndividualResultsDetailsComponent } from "./individual-results-details/individual-results-details.component";
import { QuizBuilderApiService } from "../quiz-builder/quiz-builder-api.service";
import { BookAppointmentComponent } from "./book-appointment/book-appointment.component";
import { LeadResultComponent } from "./lead-resultform/lead-resultform.component";
import { DefaultMessageComponent } from "./default-message/default-message.component";
import { attemptQuizEnum } from "../shared/Enum/attemptQuizEnum";
import { usageTypeEnum } from "../quiz-builder/quiz-tool/commonEnum";

@Component({
  selector: "app-quiz",
  templateUrl: "./quiz.component.html",
  styleUrls: ["./quiz.component.css"]
})
export class QuizComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild("quizRef", { read: ViewContainerRef , static:true}) quizRef: ViewContainerRef;
  public quizData;
  public nextStepStatusSubscription: Subscription;
  public quizCode;
  public queryParams;
  public background;
  public overlay;
  public isMobile = false;
  public isAttemptQuiz=false;
  public logoImage; 
  public isMoblieViewLogo=false;
  public backgroundColorLogo:any;
  public isMobileView = false;
  public automationAlignment:any;
  public logoAlignment:any;
  public nextStatus:any;
  public isLogoDisplay:boolean;
  public isLogoSubscription: Subscription;
  public logoPublicId:any;
  public appointmentCode:any;
  public addTagCode:any = [];
  public flowOrder:any;
  public isComplateAutomation:boolean = false;
  public attemptQuizSetting;
  public previewCode;

  constructor(
    private _crf: ComponentFactoryResolver,
    private quizDataService: QuizDataService,
    private quizApiService: QuizApiService,
    private route: ActivatedRoute,
    private router: Router,
    private loaderService: LoaderService,
    private quizBuilderApiService :QuizBuilderApiService
  ) {
  }

  ngOnInit() {
    if(window.outerWidth < 768){
      this.isMobileView=true;
    }else{
      this.isMobileView=false;
    }
    if(this.router.url.match("quiz-preview-mode")){
      
      var data = this.route.snapshot.data.quizData;
      this.quizBuilderApiService.getQuizCode(data.PublishedCode, "PREVIEW").subscribe(
        data => {
          
          this.queryParams = data;
          this.quizApiService.getQuizAttemptQuiz(data, 'PREVIEW').subscribe(
            data =>{
              
              this.quizData = data;
              this.router.navigate(["."],{
                relativeTo: this.route,
                queryParams : {
                  QuizCodePreview : this.queryParams
                },
                queryParamsHandling: 'merge',
              })

              this.quizDataService.setQuizCode(this.queryParams);
              this.setData();
            }
          )
        })
    }
    else{
      this.quizData =  this.route.snapshot.data.quizData;
      this.setData();
    }
    // this.setBackground();
    // this.setLogo();

    if(this.router.url){
      let findSubUrl = this.router.url.substring(1, 18);
      if(findSubUrl == "quiz/attempt-quiz"){
        this.isAttemptQuiz=true;
      }
    }
    let self=this;
    window.addEventListener('click',soundOpen);
    function soundOpen() {
      if(!self.quizDataService.isSoundEnableInAttempt){
        self.quizDataService.isSoundEnableInAttempt = true;
        self.quizDataService.changeSoundEnableInAttempt();
      }
      window.removeEventListener('click',soundOpen);
    }

  }

  onScroll(event){
    this.quizDataService.isScrollSubmission = true;
    this.quizDataService.changeScrollSubmission();
  }

  ngAfterViewChecked(){
    this.logoDisplay();
  }

  setData(){
    this.getQuizCode();

    //attempt quiz api update
    this.getAttemptQuizSetting();
  }

  getAttemptQuizSetting(){
    this.quizApiService.getQuizAttemptSetting(this.quizCode).subscribe(data => {
      this.attemptQuizSetting = data;
      this.quizApiService.attemptQuizSetting = this.attemptQuizSetting;
      this.setBackground();
      this.setLogo();
      this.getQuizData();
      this.callQuizComponentBasedOnData(this.quizData);
      this.getNextStepSubscription();
    });
  }

  logoDisplay(){
   this.isLogoSubscription = this.quizDataService.isLogoSubmissionObservable.subscribe(data=>{
      this.isLogoDisplay = data;
    });
  }

  /**
   * @description Function to get QuizCode from the service
   */
  getQuizCode() {
    this.quizCode = this.quizDataService.getQuizCode();
  }

  /**
   * @description Function to get quiz data
   */
  getQuizData() {
    if(this.attemptQuizSetting.PrivacyLink){
      this.quizApiService.isPrivacyLink = decodeURIComponent(this.attemptQuizSetting.PrivacyLink);
    }
    if(this.attemptQuizSetting.PrivacyJson && Object.keys(this.attemptQuizSetting.PrivacyJson).length > 0){
      this.quizApiService.privacyJson = JSON.parse(JSON.stringify(this.attemptQuizSetting.PrivacyJson));
    }
    if(this.attemptQuizSetting.LeadFormTitle){
      this.quizApiService.isLeadFormTitle = this.attemptQuizSetting.LeadFormTitle;
    }
    if(this.attemptQuizSetting.SourceId){
      this.quizApiService.sourceId = this.attemptQuizSetting.SourceId;
    }
    if(this.attemptQuizSetting.SourceType){
      this.quizApiService.sourceType = this.attemptQuizSetting.SourceType;
    }
    if(this.attemptQuizSetting && this.attemptQuizSetting.QuizCoverDetails && this.attemptQuizSetting.QuizCoverDetails.QuizTitle){
      this.quizDataService.setQuizTitle(this.attemptQuizSetting.QuizCoverDetails.QuizTitle);
    }
    if(this.attemptQuizSetting && this.attemptQuizSetting.SourceName){
        this.quizDataService.setQuizSourceTitle(this.attemptQuizSetting.SourceName);
    } 
    this.getTagDetailForAttemptQuiz();
    this.quizDataService.setCompanyColor(this.attemptQuizSetting.PrimaryBrandingColor, this.attemptQuizSetting.SecondaryBrandingColor);
  }

  setBackground(){
    let backgroundImage;
    if(this.attemptQuizSetting && this.attemptQuizSetting.QuizBrandingAndStyle && this.attemptQuizSetting.QuizBrandingAndStyle.BackImageFileURL){
      if(window.outerWidth < 768){
        backgroundImage=this.attemptQuizSetting.QuizBrandingAndStyle.BackImageFileURL.replace('upload/', "upload/c_fill,w_"+window.innerWidth+",h_"+window.innerHeight+",g_auto,q_auto,f_auto/");
        this.isMobile = true;
      }else{
        if(this.attemptQuizSetting.QuizBrandingAndStyle.Flip){
          backgroundImage = this.attemptQuizSetting.QuizBrandingAndStyle.BackImageFileURL.replace('upload/', "upload/c_fill,w_"+window.innerWidth+",g_auto,q_auto,f_auto,a_hflip/");
        }else{
          backgroundImage = this.attemptQuizSetting.QuizBrandingAndStyle.BackImageFileURL.replace('upload/', "upload/c_fill,w_"+window.innerWidth+",g_auto,q_auto,f_auto/");
        }
      }
    }

    if(this.attemptQuizSetting && this.attemptQuizSetting.QuizBrandingAndStyle && this.attemptQuizSetting.QuizBrandingAndStyle.IsBackType == 1){
      if(backgroundImage){
        this.background = "url("+ backgroundImage +")";
      }
      this.overlay = this.attemptQuizSetting.QuizBrandingAndStyle.Opacity;
    }
    else{
      this.background =this.attemptQuizSetting.QuizBrandingAndStyle ? this.attemptQuizSetting.QuizBrandingAndStyle.BackColor : '';
    }
  }

  setLogo(){
    this.automationAlignment=this.attemptQuizSetting.QuizBrandingAndStyle ? this.attemptQuizSetting.QuizBrandingAndStyle.AutomationAlignment : '';
    this.logoAlignment=this.attemptQuizSetting.QuizBrandingAndStyle ? this.attemptQuizSetting.QuizBrandingAndStyle.LogoAlignment : '';
    this.backgroundColorLogo=this.attemptQuizSetting.QuizBrandingAndStyle ? this.attemptQuizSetting.QuizBrandingAndStyle.BackgroundColorofLogo : '';
    if(this.attemptQuizSetting.QuizBrandingAndStyle && this.attemptQuizSetting.QuizBrandingAndStyle.LogoUrl){
      this.logoImage=this.attemptQuizSetting.QuizBrandingAndStyle.LogoUrl;
      this.logoPublicId =this.attemptQuizSetting.QuizBrandingAndStyle.LogoPublicId;
      if(window.outerWidth < 768){
        this.logoImage=this.attemptQuizSetting.QuizBrandingAndStyle.LogoUrl.replace('upload/', "upload/c_lpad,w_130,h_30,q_auto,f_auto/");
        this.isMoblieViewLogo = true;
      } 
      this.quizDataService.logoImage = this.attemptQuizSetting.QuizBrandingAndStyle.LogoPublicId;
      this.quizDataService.logoBackGroundColor = this.backgroundColorLogo;
    }
  }

  /**
   * @description
   * Subscription function called when the view changes to next step
   * 1) When user starts the quiz from the cover detail
   * 2) When user selects one answer for the Given question
   * 3) When user clicks next after the answer-details component
   * 4) Result
   */
  getNextStepSubscription(){
    this.nextStepStatusSubscription = this.quizDataService.nextStepStatus.subscribe(nextStep => {
      if(nextStep){
        this.nextStatus= nextStep.status;
        this.previewCode = this.route.queryParams["value"].QuizCodePreview ? 'PREVIEW' : '';
        switch(this.nextStatus){
          case attemptQuizEnum.startQuiz:
            this.getAttemptQuiz();
            break;
          case attemptQuizEnum.completeQuestion:
            this.getAttemptQuiz(nextStep.QuestionId,nextStep.AnswerId,'',nextStep.obj);
            break;
          case attemptQuizEnum.previousQuestion:
            this.getAttemptQuiz(nextStep.QuestionId,'',nextStep.QuestionType);
            break;
          case attemptQuizEnum.completeContent:
            this.getAttemptQuiz(nextStep.ContentId);
            break;
          case attemptQuizEnum.startQuestion:
            this.getAttemptQuiz(nextStep.data.QuestionId,'','',[],nextStep.data);
            break;
          case attemptQuizEnum.startContent:
            this.getAttemptQuiz(nextStep.data.Id,'','',[],nextStep.data);
            break;
          case attemptQuizEnum.resultLeadform:
            if(this.flowOrder && this.flowOrder != 3){
              this.setFlowOrder(nextStep);
            }else{
              let companycode = this.previewCode ? '' : nextStep.companycode;
              this.createLeadForm(nextStep.data, '', companycode );
            }
            break;
          case attemptQuizEnum.result:
            if(this.flowOrder && this.flowOrder == 3){
              this.createResultDetails(nextStep.data, nextStep.quizBrandingAndStyle);
            }else if(!this.flowOrder){
              let completeQuiz = this.previewCode ? false : true;
              this.createResultDetails(nextStep.data, nextStep.quizBrandingAndStyle, completeQuiz);
            }
            break;
          case attemptQuizEnum.indiResult:
            if((this.flowOrder && this.flowOrder != 2) || !this.flowOrder){
              this.createIndividualResult(nextStep.data, nextStep.quizBrandingAndStyle, nextStep.index);
            }
            break;
          case attemptQuizEnum.appointmentCode:
            this.getAppointmentCode(nextStep.data);
            break;
          case attemptQuizEnum.resLead:
            this.createLeadForm(nextStep.data, nextStep.quizBrandingAndStyle, nextStep.companycode);
            break;
          case attemptQuizEnum.appointmentSlot:
            this.createAppointmentSlot(nextStep.appointmentCode,nextStep.quizBrandingAndStyle,nextStep.data);
            break;
        }
      }
    });
  }

  // api call in get attempt quiz
  getAttemptQuiz(id?,answerId?,type?,obj?,nextData?){
    this.loaderService.show();
    this.quizApiService
    .getQuizAttemptQuiz(this.quizCode, this.previewCode, this.nextStatus, id, answerId, '', type, obj)
    .subscribe(data => {
      this.loaderService.hide();
      if(this.nextStatus == attemptQuizEnum.startQuestion){
        if (nextData.ShowAnswerImage) {
          this.createQuestionImageComponent(
            this.nextStatus,
            nextData,
            this.attemptQuizSetting.QuizBrandingAndStyle,
            data.IsBackButtonEnable,
            data.PreviousQuestionSubmittedAnswer

          );
        } else {
          this.createQuestionComponent(
            this.nextStatus,
            nextData,
            this.attemptQuizSetting.QuizBrandingAndStyle,
            data.IsBackButtonEnable,
            data.PreviousQuestionSubmittedAnswer
          );
        }
      }else if(this.nextStatus == attemptQuizEnum.startContent){
        this.createContentDetails(
          this.nextStatus,
          nextData,
          this.attemptQuizSetting.QuizBrandingAndStyle,
          data.IsBackButtonEnable
        );
      }else{
        this.callQuizComponentBasedOnData(data);
      }
    });
  }

  setFlowOrder(nextStep){
    if(this.flowOrder == 1){
      //result to lead
      this.createResultDetails(nextStep.data, nextStep.quizBrandingAndStyle,'','',nextStep.companycode);
    }else if(this.flowOrder == 2){
      this.createResultLeadForm(nextStep.data,  nextStep.quizBrandingAndStyle, nextStep.companycode);
    }
  }

  /**
   * @description
   * Function to create Dynamic component based on data
   * 1) If cover details is present then coverDetail component is opened
   * 2) if Submitted answer is persent then its corresponding component is opened
   * 3) If Question Details then QuestionComponent
   * 4) If Question Details with image then QuestionImageComponent
   * 5) If Result Details then ResultDetailComponent
   * 6) If the data is null then quizTerminated component is opened
   * @param data
   */
  callQuizComponentBasedOnData(data) {
    this.attemptQuizDataUpdate(data);
    if(data.LoadQuizDetails && this.attemptQuizSetting.QuizCoverDetails) {
      this.getCoverDetails(this.attemptQuizSetting);
    }else if (data.SubmittedAnswer) {
      this.getSubmittedAnswerDetails(data);
    }else if (data.ContentDetails) {
      this.getContentDetails(data.IsBackButtonEnable,data.SubmittedAnswer,data);
    }else if (data.QuestionDetails) {
      this.getQuestionDetails(data.IsBackButtonEnable,data.PreviousQuestionSubmittedAnswer,data.SubmittedAnswer,data);
    }else if (data.ResultScore) {
      this.getResultDetails(data.ShowLeadUserForm,data.SubmittedAnswer,data);
    }else {
      this.createQuizEndComponent();
    }
  }

  setFlowOrderNotAnswerResult(nextStep,QuizBrandingAndStyle,CompanyCode){
    if(this.flowOrder == 1){
      //result to lead
      this.createResultDetails(nextStep.ResultScore, QuizBrandingAndStyle,'','',CompanyCode);
    }else if(this.flowOrder == 2){
      this.createResultLeadForm(nextStep.ResultScore, QuizBrandingAndStyle, CompanyCode);
    }
  }

  /**
   * @description Dynamic Component QUIZ TERMINATED
   */
  createQuizEndComponent() {
    this.quizRef.clear();
    var TemplateRef = this._crf.resolveComponentFactory(
      QuizTerminatedComponent
    );
    var TemplateComponentRef = this.quizRef.createComponent(TemplateRef);
  }

  /**
   * @description Dynamic Component QUESTION DETAIL
   */
  createQuestionComponent(nextStatus,QuestionDetails, QuizBrandingAndStyle, IsBackButtonEnable, PreviousQuestionSubmittedAnswer) {
    this.quizRef.clear();
    var TemplateRef = this._crf.resolveComponentFactory(
      QuestionDetailsComponent
    );
    var TemplateComponentRef = this.quizRef.createComponent(TemplateRef);
    TemplateComponentRef.instance.nextStatus = nextStatus;
    TemplateComponentRef.instance.QuestionDetails = QuestionDetails;
    TemplateComponentRef.instance.QuizBrandingAndStyle = QuizBrandingAndStyle;
    TemplateComponentRef.instance.IsBackButtonEnable = IsBackButtonEnable;
    TemplateComponentRef.instance.PreviousQuestionSubmittedAnswer = PreviousQuestionSubmittedAnswer;
  }

  /**
   * @description Dynamic Component QUESTION DETAIL WITH IMAGE
   */
  createQuestionImageComponent(nextStatus,QuestionDetails, QuizBrandingAndStyle, IsBackButtonEnable, PreviousQuestionSubmittedAnswer ) {
    this.quizRef.clear();
    var TemplateRef = this._crf.resolveComponentFactory(
      QuestionImageDetailsComponent
    );
    var TemplateComponentRef = this.quizRef.createComponent(TemplateRef);
    TemplateComponentRef.instance.nextStatus = nextStatus;
    TemplateComponentRef.instance.QuestionDetails = QuestionDetails;
    TemplateComponentRef.instance.QuizBrandingAndStyle = QuizBrandingAndStyle;
    TemplateComponentRef.instance.IsBackButtonEnable = IsBackButtonEnable;
    TemplateComponentRef.instance.PreviousQuestionSubmittedAnswer = PreviousQuestionSubmittedAnswer;

  }

  /**
   * @description Dynamic Component COVER DETAIL
   */
  createCoverComponent(coverData) {
    this.quizRef.clear();
    var TemplateRef = this._crf.resolveComponentFactory(CoverDetailsComponent);
    var TemplateComponentRef = this.quizRef.createComponent(TemplateRef);
    TemplateComponentRef.instance.coverData = coverData;
  }

  /**
   *  @description Dynamic Component ANSWER DETAIL
   */
  createAnswerDetails(SubmittedAnswer, type, data, QuizBrandingAndStyle, companycode?) {
    this.quizRef.clear();
    var TemplateRef = this._crf.resolveComponentFactory(AnswerDetailsComponent);
    var TemplateComponentRef = this.quizRef.createComponent(TemplateRef);
    TemplateComponentRef.instance.SubmittedAnswer = SubmittedAnswer;
    TemplateComponentRef.instance.type = type;
    TemplateComponentRef.instance.data = data;
    TemplateComponentRef.instance.companycode = companycode;
    TemplateComponentRef.instance.QuizBrandingAndStyle = QuizBrandingAndStyle;
  }

  /**
   * @description Dynamic Component RESULT DETAIL
   */
  public PublishedCode;
  createResultDetails(ResultScore, QuizBrandingAndStyle?, complete_quiz?,isFloworder?,companycode?) {
    this.PublishedCode = this.route.snapshot.queryParams["QuizCode"];
    this.quizRef.clear();
    if(ResultScore.PersonalityResultList && ResultScore.PersonalityResultList.length) {
      let TemplateRef = this._crf.resolveComponentFactory(MultipleResultsComponent);
      let TemplateComponentRef = this.quizRef.createComponent(TemplateRef);
      TemplateComponentRef.instance.ResultScore = ResultScore;
      TemplateComponentRef.instance.QuizBrandingAndStyle = QuizBrandingAndStyle;
      TemplateComponentRef.instance.resultLeadForm = isFloworder ? isFloworder : false;
      TemplateComponentRef.instance.companycode = companycode;
      TemplateComponentRef.instance.flowOrder = this.flowOrder;
      TemplateComponentRef.instance.publishedCode = this.PublishedCode;
      TemplateComponentRef.instance.completeQuiz = complete_quiz;
    } else {
      let TemplateRef = this._crf.resolveComponentFactory(ResultDetailsComponent);
      let TemplateComponentRef = this.quizRef.createComponent(TemplateRef);
      TemplateComponentRef.instance.ResultScore = ResultScore;
      TemplateComponentRef.instance.QuizBrandingAndStyle = QuizBrandingAndStyle;
      TemplateComponentRef.instance.quizType = this.attemptQuizSetting.QuizCoverDetails.QuizType;
      TemplateComponentRef.instance.resultLeadForm = isFloworder ? isFloworder : false;
      TemplateComponentRef.instance.flowOrder = this.flowOrder;
      TemplateComponentRef.instance.companycode = companycode;
      TemplateComponentRef.instance.publishedCode = this.PublishedCode;
      TemplateComponentRef.instance.completeQuiz = complete_quiz;
    }
  }

  getAppointmentCode(ResultScore){
    this.PublishedCode = this.route.snapshot.queryParams["QuizCode"];
    if(this.PublishedCode){
      let userTypeId = this.quizDataService.getUserTypeId() ? this.quizDataService.getUserTypeId() : "";
      this.quizApiService
      .getQuizAttemptQuiz(this.PublishedCode, "", "complete_quiz", "","", userTypeId, "", [])
      .subscribe(data => {
        if(data.AppointmentCode){
          this.createAppointmentSlot(data.AppointmentCode,this.attemptQuizSetting.QuizBrandingAndStyle,ResultScore);
        }else{
          if(this.flowOrder && this.flowOrder == 3){
            if(ResultScore){
              this.createResultDetails(ResultScore, this.attemptQuizSetting.QuizBrandingAndStyle);
            }
          }else {
            this.getDefaultMessage(this.attemptQuizSetting.QuizBrandingAndStyle);
          }
        }
      });
    }
  }

  getDefaultMessage(QuizBrandingAndStyle){
    this.quizRef.clear();
    let TemplateRef = this._crf.resolveComponentFactory(DefaultMessageComponent);
    let TemplateComponentRef = this.quizRef.createComponent(TemplateRef);
    TemplateComponentRef.instance.QuizBrandingAndStyle = QuizBrandingAndStyle;
  }

  /**
   *Dynamic create Individual result component for Personality
   */
  createIndividualResult(ResultScore, QuizBrandingAndStyle, index){
    let TemplateRef = this._crf.resolveComponentFactory(IndividualResultsDetailsComponent);
    let TemplateComponentRef = this.quizRef.createComponent(TemplateRef);
    TemplateComponentRef.instance.ResultScore = ResultScore;
    TemplateComponentRef.instance.QuizBrandingAndStyle = QuizBrandingAndStyle;
    TemplateComponentRef.instance.index = index;
    TemplateComponentRef.instance.multiResultComponentRef = TemplateComponentRef;
  }

  /**
   * @description Dynamic Component CONTENT DETAIL
   */
  createContentDetails(nextStatus,ContentData, QuizBrandingAndStyle,IsBackButtonEnable) {
    this.quizRef.clear();
    var TemplateRef = this._crf.resolveComponentFactory(
      ContentDetailsComponent
    );
    var TemplateComponentRef = this.quizRef.createComponent(TemplateRef);
    TemplateComponentRef.instance.nextStatus = nextStatus;
    TemplateComponentRef.instance.ContentData = ContentData;
    TemplateComponentRef.instance.QuizBrandingAndStyle = QuizBrandingAndStyle;
    TemplateComponentRef.instance.IsBackButtonEnable = IsBackButtonEnable;
  }

  /**
   * @description Dynamic Component Lead Form
   */
  createLeadForm(ResultScore, QuizBrandingAndStyle?, companycode?) {
    this.quizRef.clear();
    var TemplateRef = this._crf.resolveComponentFactory(LeadFormComponent);
    var TemplateComponentRef = this.quizRef.createComponent(TemplateRef);
    TemplateComponentRef.instance.ResultScore = ResultScore;
    TemplateComponentRef.instance.companycode = companycode;
    TemplateComponentRef.instance.QuizBrandingAndStyle = QuizBrandingAndStyle;
    TemplateComponentRef.instance.flowOrder = this.flowOrder;
  }

  /**
   * @description Dynamic Component Lead Result Form
   */
  createResultLeadForm(ResultScore, QuizBrandingAndStyle?, companycode?) {
    this.quizRef.clear();
    var TemplateRef = this._crf.resolveComponentFactory(LeadResultComponent);
    var TemplateComponentRef = this.quizRef.createComponent(TemplateRef);
    TemplateComponentRef.instance.ResultScore = ResultScore;
    TemplateComponentRef.instance.companycode = companycode;
    TemplateComponentRef.instance.QuizBrandingAndStyle = QuizBrandingAndStyle;
    TemplateComponentRef.instance.quizType = this.attemptQuizSetting.QuizCoverDetails.QuizType;
  }

    /**
   * @description Dynamic Component CONTENT DETAIL
   */
  createAppointmentSlot(AppointmentCode,QuizBrandingAndStyle,ResultScore) {
    this.quizRef.clear();
    var TemplateRef = this._crf.resolveComponentFactory(
      BookAppointmentComponent
    );
    var TemplateComponentRef = this.quizRef.createComponent(TemplateRef);
    TemplateComponentRef.instance.appointmentCode = AppointmentCode;
    TemplateComponentRef.instance.QuizBrandingAndStyle = QuizBrandingAndStyle;
    TemplateComponentRef.instance.ResultScore = ResultScore;
    TemplateComponentRef.instance.flowOrder = this.flowOrder;
  }

  //get cover details
  getCoverDetails(data){
    if(data && data.UsageType && data.UsageType.includes(usageTypeEnum.WhatsApp_Chatbot)){
      let quizStatus = {
        status: 'start_quiz'
      }
      this.quizDataService.nextStepStatus.next(quizStatus);
    }else if(data && data.QuizCoverDetails){
      this.createCoverComponent(data);
    }
  }

  //get question details
  getQuestionDetails(isBackButtonEnable,previousQuestionSubmittedAnswer,submittedAnswer,data){
      if(data && data.QuestionDetails){
        if(submittedAnswer){
          this.createAnswerDetails(
            submittedAnswer,
            "start_question",
            data.QuestionDetails,
            this.attemptQuizSetting.QuizBrandingAndStyle,
            this.attemptQuizSetting.CompanyCode
          );
        }else if (data.QuestionDetails.ShowAnswerImage) {
          this.createQuestionImageComponent(
            this.nextStatus,
            data.QuestionDetails,
            this.attemptQuizSetting.QuizBrandingAndStyle,
            isBackButtonEnable,
            previousQuestionSubmittedAnswer
          );
        }else{
          this.createQuestionComponent(
            this.nextStatus,
            data.QuestionDetails,
            this.attemptQuizSetting.QuizBrandingAndStyle,
            isBackButtonEnable,
            previousQuestionSubmittedAnswer
          );  
        }
      }
  }

  //get content details
  getContentDetails(isBackButtonEnable,submittedAnswer,data){
      if(data && data.ContentDetails){
        if(submittedAnswer){
          this.createAnswerDetails(
            submittedAnswer,
            "start_content",
            data.ContentDetails,
            this.attemptQuizSetting.QuizBrandingAndStyle
          );
        }else{
          this.createContentDetails(
            this.nextStatus,
            data.ContentDetails, 
            this.attemptQuizSetting.QuizBrandingAndStyle, 
            isBackButtonEnable);
        }
      }
  }

  //get result details
  getResultDetails(showLeadUserForm,submittedAnswer,data){
      if(data && data.ResultScore){
        if(submittedAnswer){
          if (showLeadUserForm) {
            this.createAnswerDetails(
              submittedAnswer,
              "result-leadform",
              data.ResultScore,
              this.attemptQuizSetting.QuizBrandingAndStyle,
              this.attemptQuizSetting.CompanyCode
            );
          } else {
            this.createAnswerDetails(
              submittedAnswer,
              "result",
              data.ResultScore,
              this.attemptQuizSetting.QuizBrandingAndStyle
            );
          }
        }else if(this.flowOrder && this.flowOrder != 3){
          this.setFlowOrderNotAnswerResult(data,this.attemptQuizSetting.QuizBrandingAndStyle, this.attemptQuizSetting.CompanyCode);
        }else{
          if (showLeadUserForm) {
            this.createLeadForm(data.ResultScore, this.attemptQuizSetting.QuizBrandingAndStyle, this.attemptQuizSetting.CompanyCode);
          } else {
            this.createResultDetails(data.ResultScore, this.attemptQuizSetting.QuizBrandingAndStyle, true);
          }
        }
      }
  }

  //get SubmittedAnswer details
  getSubmittedAnswerDetails(data){
      if(data && data.SubmittedAnswer){
        if (data.QuestionDetails) {
          this.getQuestionDetails(data.IsBackButtonEnable,data.PreviousQuestionSubmittedAnswer,data.SubmittedAnswer,data);
        }else if(data.ContentDetails){
          this.getContentDetails(data.IsBackButtonEnable,data.SubmittedAnswer,data);
        }else if (data.ResultScore) {
          this.getResultDetails(data.ShowLeadUserForm,data.SubmittedAnswer,data);
        }else {
          this.createQuizEndComponent();
        }
      }
  }

  //get tag for attempt quiz
  getTagDetailForAttemptQuiz(){
    if(this.attemptQuizSetting && this.attemptQuizSetting.Tag && this.attemptQuizSetting.Tag.length > 0){
      let tagCode;
      this.addTagCode = [];
      this.attemptQuizSetting.Tag.map(tag => {
        this.addTagCode.push(tag.TagCode);
      });
      tagCode = this.addTagCode.toString()
      this.quizDataService.setQuizTagCode(tagCode);
    }
  }

  //update data every time
  attemptQuizDataUpdate(data){
    if(data.AppointmentCode){
      this.appointmentCode = data.AppointmentCode;
    }
    if(data.FlowOrder){
      this.flowOrder = data.FlowOrder;
    }
    if(data.FormId){
      this.quizApiService.isFormId = data.FormId;
    }
  }

  ngOnDestroy() {
    this.nextStepStatusSubscription.unsubscribe();
    this.quizDataService.isLogoSubmission = false;
  }
}
