import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewInit
} from "@angular/core";
import { QuizDataService } from "../quiz-data.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MbscDatetimeOptions } from "@mobiscroll/angular";
import { Subscription } from "rxjs";
import { environment } from "../../../environments/environment";
import { CommonService } from "../../shared/services/common.service";
import { answerTypeEnum, BrandingLanguage } from "../../quiz-builder/quiz-tool/commonEnum";

@Component({
  selector: "app-question-image-details",
  templateUrl: "./question-image-details.component.html",
  styleUrls: ["./question-image-details.component.css"]
})
export class QuestionImageDetailsComponent implements OnInit, OnDestroy, AfterViewInit {
  //Dynamic component data instance
  public QuestionDetails;
  public IsBackButtonEnable;
  public PreviousQuestionSubmittedAnswer;
  dateSettings: MbscDatetimeOptions = {
    dateFormat: 'dd/mm/yy',
    dateWheels: '|dd| |MM| |YY|'
};
  public isQuestionNotComplete: boolean = true;
  public quizStatus = {
    status: "",
    QuestionId: "",
    AnswerId: "",
    QuestionType: 0,
    // AnswerText : ''
    obj: []
  };
  public previewCode;
  public isNextButtonEnable:boolean = true;
  @ViewChild("previewContainer", { read: ElementRef , static:true})
  previewContainer: ElementRef;
  public imageORvideo;
  public answerImageORvideo = [];
  public answerIdModel;
  public QuizBrandingAndStyle;
  public addClass = false;
  public clasList =['question-head','higherLevelBrandingColor'];
  public  buttonEnable:boolean=false ;
  public CountDownInterval;
  public hoverOnOption:any={};
  public timerObj: object = {
    hours: 0,
    minutes: 0,
    seconds: 0
  }
  progress = 100;
  intervalId;
  getHour;
  getMin;
  getSec;
  interval;
  isPreview:boolean=false;
  public coverImage;
  public isMobileView:boolean=false;
  public isStartQuiz:boolean=false;
  public nextStatus;
  public isNextStatus:boolean=false;
  public minHeightInDiv:any;
  public buttonShow:boolean=true;
  public logoImage:string = "";
  public logoBackgroundColor:string = "";
  public imageORvideoDes: string = 'image';
  public descriptionImage;
  public isAwnserClick:boolean = false;
  public questionElementReorder:any = [
    {
        "displayOrder": 1,
        "key": "title"
    },
    {
        "displayOrder": 2,
        "key": "media"
    },
    {
        "displayOrder": 3,
        "key": "description",
        "disMedia" : {
            "displayOrder": 4,
            "key": "description media",
        }
    },
    {
        "displayOrder": 5,
        "key": "question"
    },
    {
        "displayOrder": 6,
        "key": "button"
    }
  ];

  public defaultCoverImage:any="https://res.cloudinary.com/dbbkqtyqn/image/upload/c_fill,w_200,h_200,g_face,q_auto:best,f_auto/v1588680596/Jobrock/automation-place-holder-corner.png";
  public defaultCoverImageInMoblie:any="https://res.cloudinary.com/dbbkqtyqn/image/upload/c_fill,w_140,h_130,g_face,q_auto:best,f_auto/v1588680596/Jobrock/automation-place-holder-corner.png";
  private isVideoSoundEnableSubscription:Subscription;
  public isleftSlide:boolean;
  public questionTypeEnum = answerTypeEnum;

  constructor(
    private quizDataService: QuizDataService,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private router: Router,
    private cdref: ChangeDetectorRef,
    private commonService:CommonService
  ) {}

  public regXForVarFormulaV2 = /\{\{(([a-zA-Z0-9_]\.){0,1}[a-zA-Z0-9_])+\}\}/g;
  public options;
  ngOnInit() {
    this.QuestionDetails.QuestionTitle = this.QuestionDetails.QuestionTitle ? this.QuestionDetails.QuestionTitle.replace(this.regXForVarFormulaV2,'') : '';
    this.QuestionDetails.Description = this.QuestionDetails.Description ? this.QuestionDetails.Description.replace(this.regXForVarFormulaV2,'') : '';
    if(!this.QuestionDetails.NextButtonText){
      this.QuestionDetails.NextButtonText = this.QuizBrandingAndStyle.Language == BrandingLanguage.Dutch ? 'Volgende' : 'Next';
    }
    this.isMobileView = window.outerWidth < 768 ? true : false;
    this.logoImage = this.quizDataService.logoImage ? this.quizDataService.logoImage : '';
    this.logoBackgroundColor = this.quizDataService.logoBackGroundColor ? this.quizDataService.logoBackGroundColor : '';
    this.options = this.quizDataService.getFroalaOption();
    this.isAwnserClick = false;
    this.isQuestionNotComplete = true;
    this.commonService.scrollUp();
    this.componentSlide();
    // start the timer  if timerRequired is true 
    this.startTimer();
    this.getQuesAndDescORAnsImage();
    //add popup-container class
    this.previewCode = this.route.queryParams["value"].QuizCodePreview;
    if (this.previewCode && !this.router.url.match("quiz-preview-mode")) {
      this.addClass = true;
      this.isPreview = true;
      this.renderer.addClass(this.previewContainer.nativeElement,"preview-popup");
    }
    this.getAnswerType();
    this.nextBtnEnable();
    this.getReorder();
    //timer
    if (this.QuestionDetails['TimerRequired']){
      this.getInterval();
      const getDownloadProgress = () => {
        if (this.progress <=100 && this.progress!=0) {
          this.progress = this.progress - 1;
        }
        else {
          clearInterval(this.intervalId);
        }
      }
      this.intervalId = setInterval(getDownloadProgress, this.interval);
    }
    this.getScrollSubscription();
    this.getSoundEnable();
  }

  getReorder(){
    if(this.QuestionDetails){
      this.questionElementReorder = [
        {
            "displayOrder": this.QuestionDetails.DisplayOrderForTitle,
            "key": "title"
        },
        {
            "displayOrder": this.QuestionDetails.DisplayOrderForTitleImage,
            "key": "media"
        },
        {
            "displayOrder": this.QuestionDetails.DisplayOrderForDescription,
            "key": "description",
            "disMedia" : {
                "displayOrder": this.QuestionDetails.DisplayOrderForDescriptionImage,
                "key": "description media",
            }
        },
        {
            "displayOrder": this.QuestionDetails.DisplayOrderForAnswer,
            "key": "question"
        },
        {
            "displayOrder": this.QuestionDetails.DisplayOrderForNextButton,
            "key": "button"
        }
      ];
      this.questionElementReorder.sort((a, b) => (a.displayOrder > b.displayOrder) ? 1 : -1)
    }
  }

  getScrollSubscription(){
    this.quizDataService.isScrollSubmissionObservable.subscribe(res => {
      this.onScroll();
    });
  }

  getQuesAndDescORAnsImage(){
    if (this.QuestionDetails.QuestionImage) {
      this.coverImage=this.QuestionDetails.QuestionImage.replace('upload/', "upload/g_auto,q_auto,f_auto/");
      this.imageORvideo = this.commonService.getImageOrVideo(this.QuestionDetails.QuestionImage);
    }
    
    if (this.QuestionDetails.DescriptionImage) {
      this.descriptionImage=this.QuestionDetails.DescriptionImage.replace('upload/', "upload/g_auto,q_auto,f_auto/");
      this.imageORvideoDes = this.commonService.getImageOrVideo(this.QuestionDetails.DescriptionImage);
    }

    for (var i = 0; i < this.QuestionDetails.AnswerOption.length; i++) {
      if (this.QuestionDetails.AnswerOption[i].ImageURL) {
        let imageOrVideo = this.commonService.getImageOrVideo(this.QuestionDetails.AnswerOption[i].ImageURL);
        this.answerImageORvideo.push(imageOrVideo);
      }else{
        this.answerImageORvideo.push("");
      }
      if(this.QuestionDetails.AnswerType == answerTypeEnum.singleSelect || this.QuestionDetails.AnswerType == answerTypeEnum.multiSelect){
        this.QuestionDetails.AnswerOption[i].Title = this.QuestionDetails.AnswerOption[i].Title ? this.QuestionDetails.AnswerOption[i].Title.replace(this.regXForVarFormulaV2, ''):'';
      }
    }
  }

  componentSlide(){
    if(this.nextStatus == "start_quiz" &&  this.isMobileView){
      this.isleftSlide = false;
      let self=this;
      setTimeout(function(){  self.isNextStatus = true }, 1000);
    }else{
       this.isNextStatus=true;
       this.isleftSlide = true;
    }
  }

  startTimer(){
    if (this.QuestionDetails['TimerRequired'] && !this.QuestionDetails['StartedOn']) {
      var tempTimeVal = this.QuestionDetails['Time'].split(':');
      this.timerObj['hours'] = parseInt(tempTimeVal[0])
      this.timerObj['minutes'] = parseInt(tempTimeVal[1])
      this.timerObj['seconds'] = parseInt(tempTimeVal[2])
      this.StartCountDown();   // function for timer 
    } else if (this.QuestionDetails['TimerRequired'] && this.QuestionDetails['StartedOn']) {
      this.getRefreshedTime();
    }
  }

  getAnswerType(){
    if (this.PreviousQuestionSubmittedAnswer){
      if (this.QuestionDetails.AnswerType== this.questionTypeEnum.multiSelect){
        let i = this.PreviousQuestionSubmittedAnswer.SubmittedAnswerDetails;
        i.forEach(element => {
          this.selectedOptionArray.push(element.AnswerId)
        });
      }
    }
  }

  getSoundEnable(){
    this.isVideoSoundEnableSubscription = this.quizDataService.isSoundEnableInAttemptObservable.subscribe(data => {
      if(data){
        if(this.imageORvideo === 'video' && this.QuestionDetails && this.QuestionDetails.AutoPlay && this.QuestionDetails.ShowQuestionImage){
          this.commonService.videoAutoPlayWithSound("autoPlayVideo",false);
        }
        if(this.QuestionDetails.ShowDescriptionImage && this.QuestionDetails.AutoPlayForDescription && this.imageORvideoDes === 'video'){
          this.commonService.videoAutoPlayWithSound("autoplayDes",false);
        }
        if(this.QuestionDetails.AnswerOption && this.QuestionDetails.AnswerOption.length > 0){
          this.QuestionDetails.AnswerOption.forEach((element,index) => {
            if(element.AutoPlay && this.answerImageORvideo[index] === 'video'){
              this.commonService.videoAutoPlayWithSound(element.AnswerId,false);
            }
          });
        }
      }
    });
  }

  ngAfterViewInit(){
    this.PreviousQuestionSubmittedAnswer ? this.buttonEnable=true :this.buttonEnable=false ;
    this.clasList.forEach((elem)=>{
      this.setStyling(elem);
    })
    this.cdref.detectChanges();
    let timeSchedule = 1000;
    if(this.isMobileView){
      timeSchedule = this.isleftSlide ? 2000 : 4000;
    }
    let self = this;
    setTimeout(function(){  
      if(self.isMobileView){
        self.buttonShow = self.commonService.isScrolledIntoView();
      } }, 100);

      setTimeout(function(){  
      if(self.QuestionDetails.AutoPlay && self.imageORvideo === 'video'){
        self.commonService.videoAutoPlayWithSound("autoPlayVideo",true);
      }

      if(self.QuestionDetails.AutoPlayForDescription && self.imageORvideoDes === 'video'){
        self.commonService.videoAutoPlayWithSound("autoplayDes",true);
      }

      if(self.QuestionDetails.AnswerOption && self.QuestionDetails.AnswerOption.length > 0){
        self.QuestionDetails.AnswerOption.forEach((element,index) => {
          if(element.AutoPlay && self.answerImageORvideo[index] === 'video'){
            self.commonService.videoAutoPlayWithSound(element.AnswerId,true);
          }
        });
      }
    } , timeSchedule);

  }

  onScroll() {
    if(this.isMobileView){
      this.buttonShow = this.commonService.isScrolledIntoView();
    }
  }

  setStyling(elem){
    var data = document.getElementsByClassName(elem);
    for(var x=0 ;x < data.length ;x++){
      if(elem == 'higherLevelBrandingColor'){
        if(data[x].childNodes[1] && data[x].childNodes[1].childNodes[0]){
          data[x].childNodes[1].childNodes[0]['style'] = {};
          data[x].childNodes[1].childNodes[0]['style'].background = this.QuizBrandingAndStyle.OptionColor;
          data[x].childNodes[1].childNodes[0]['style'].color = this.QuizBrandingAndStyle.OptionFontColor;
        }
      }
      else{
        if(data[x].childNodes[1] && data[x].childNodes[1].childNodes[0]){
          data[x].childNodes[1].childNodes[0]['style'] = {};
          data[x].childNodes[1].childNodes[0]['style'].background = this.QuizBrandingAndStyle.BackgroundColor;
          data[x].childNodes[1].childNodes[0]['style'].color = this.QuizBrandingAndStyle.FontColor;
        }
      }
    }
  }

  // ngAfterContentChecked() {
  //   /**
  //    * akshay
  //    *  to tell angular that you updated the content after ngAfterContentChecked
  //    */
  //   this.cdref.detectChanges();
  // }
  getRefreshedTime() {
    var startTime = new Date(this.QuestionDetails.StartedOn);
    var startingTimeinSeconds = (startTime.getHours() * 60 * 60) + (startTime.getMinutes() * 60) + (startTime.getSeconds());
    var currentTime = new Date();
    var onGoingTimeinSeconds = (currentTime.getUTCHours() * 60 * 60) + (currentTime.getUTCMinutes() * 60) + (currentTime.getUTCSeconds());
    var tempTimeVal = this.QuestionDetails['Time'].split(':');
    this.timerObj['hours'] = parseInt(tempTimeVal[0])
    this.timerObj['minutes'] = parseInt(tempTimeVal[1])
    this.timerObj['seconds'] = parseInt(tempTimeVal[2])
    var Time = (this.timerObj['hours'] * 60 * 60) + (this.timerObj['minutes'] * 60) + (this.timerObj['seconds'])
    if (Math.abs(onGoingTimeinSeconds - startingTimeinSeconds) > Time) {
      this.quizStatus.AnswerId ? this.selectedOption(this.quizStatus.AnswerId) : this.selectedOption()

    } else {
      var timerTime = Time - (onGoingTimeinSeconds - startingTimeinSeconds);
      var time = this.secondsToHms(timerTime);
      this.timerObj['hours'] = time['hour']
      this.timerObj['minutes'] = time['min']
      this.timerObj['seconds'] = time['sec']
      this.StartCountDown();
    }
  }
  secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return { hour: h, min: m, sec: s };
  }
  nextBtnEnable(){
    if(this.QuestionDetails.MaxAnswer == null && this.QuestionDetails.MinAnswer == null){
      this.isNextButtonEnable = false;
    } else {
      if(this.selectedOptionArray.length > this.QuestionDetails.MaxAnswer || this.selectedOptionArray.length < this.QuestionDetails.MinAnswer){
        this.isNextButtonEnable = true;
      }else{
        this.isNextButtonEnable = false;
      }
    }
  }

  getInterval(){
    let totalTimeDuration;
    let fixedPointNo;
    if (this.QuestionDetails['TimerRequired'] ){
    var tempTimeVal = this.QuestionDetails['Time'].split(':');
    this.getHour = parseInt(tempTimeVal[0])
    this.getMin = parseInt(tempTimeVal[1])
    this.getSec = parseInt(tempTimeVal[2])
    this.getHour = this.getHour * 60 * 60;
    this.getMin = this.getMin * 60;
    }
    if (this.QuestionDetails['TimerRequired'] && this.QuestionDetails['StartedOn']) {
      var startTime = new Date(this.QuestionDetails.StartedOn);
      var startingTimeinSeconds = (startTime.getHours() * 60 * 60) + (startTime.getMinutes() * 60) + (startTime.getSeconds());
      var currentTime = new Date();
      var onGoingTimeinSeconds = (currentTime.getUTCHours() * 60 * 60) + (currentTime.getUTCMinutes() * 60) + (currentTime.getUTCSeconds());
      let totalTimeInSec= (this.getHour + this.getMin + this.getSec) - (onGoingTimeinSeconds - startingTimeinSeconds);
       totalTimeDuration = totalTimeInSec/100;
    }else{
      totalTimeDuration = (this.getHour + this.getMin + this.getSec)/100;
    }
    fixedPointNo=totalTimeDuration.toFixed(3);
    this.interval = fixedPointNo * 1000;
  }

 getDownTime(){
  return (this.timerObj['hours']? this.timerObj['hours'] <= 9 ? '0'+this.timerObj['hours']+':' :this.timerObj['hours']+':' :'') + "" + (this.timerObj['minutes']? this.timerObj['minutes'] <= 9 ? '0'+this.timerObj['minutes'] :this.timerObj['minutes'] :'00')+ ":" + (this.timerObj['seconds']? this.timerObj['seconds'] <= 9 ? '0'+this.timerObj['seconds'] :this.timerObj['seconds'] :'00');
 }

  hours(){
    return this.timerObj['hours']? this.timerObj['hours'] <= 9 ? '0'+this.timerObj['hours']+':' :this.timerObj['hours']+':' :''
   }
   seconds(){
    return this.timerObj['seconds']? this.timerObj['seconds'] <= 9 ? '0'+this.timerObj['seconds'] :this.timerObj['seconds'] :'00'
   }
   minutes(){
    return this.timerObj['minutes']? this.timerObj['minutes'] <= 9 ? '0'+this.timerObj['minutes'] :this.timerObj['minutes'] :'00'
   }
    // added CountDownTimer to the question type : Short text, Long text, Single select & Multiple select 
    StartCountDown() {
      this.CountDownInterval = setInterval(() => {
        if (this.timerObj['seconds'] === 0 && (this.timerObj['hours'] || this.timerObj['minutes'])) {
          this.timerObj['seconds'] = 60;
          this.timerObj['minutes'] == 0 ? function decrement() {
            this.timerObj['hours'] > 0 ? (this.timerObj['minutes'] = 60) : (this.timerObj['minutes'] = 0);
            this.timerObj['hours'] > 0 ? (this.timerObj['hours'] = this.timerObj['hours'] - 1) : (this.timerObj['hours'] = 0);
          }.bind(this)()
            : (this.timerObj['minutes'] = this.timerObj['minutes'] - 1);
        } else {
          this.timerObj['seconds'] > 0 ? (this.timerObj['seconds'] = this.timerObj['seconds'] - 1) :function stop() {
            if (this.QuestionDetails['AnswerType'] == this.questionTypeEnum.singleSelect) {
                this.quizStatus.AnswerId ? this.selectedOption(this.quizStatus.AnswerId) : this.selectedOption();
            }if( this.QuestionDetails['AnswerType'] == this.questionTypeEnum.multiSelect){
              this. submitCurrentOption()
            }
          }.bind(this)()
        }
      }, 1000);
    }
    singleOptionSelected(answerId){
      this.quizStatus.AnswerId = answerId;
      this.buttonEnable=true;
      if(!this.QuestionDetails.EnableNextButton && this.isAwnserClick == false){
        this.isAwnserClick = true;
        this.submitCurrentOption();
      }
    }

    singleSelectedBtn(){
      if(!this.QuestionDetails.EnableNextButton){
        this.submitCurrentOption();
      }
    }

  /**
   * When user selects an option from the given options
   * It is then informed in quiz.component.ts where the subscription to
   * the behaviour subject determines which component to call
   */
  selectedOption(optionValue?, event?) {
    if (this.CountDownInterval) {
      clearInterval(this.CountDownInterval);
    }
    if(this.isQuestionNotComplete){
      this.isQuestionNotComplete = false;
      this.quizStatus.AnswerId = optionValue? optionValue:null;
      this.quizStatus.status = "complete_question";
      this.quizStatus.QuestionId = this.QuestionDetails.QuestionId;
      this.quizDataService.nextStepStatus.next(this.quizStatus);
      this.quizDataService.setQuizBrandingAndStyle(this.QuizBrandingAndStyle);
    }
  }
  checkForQuesType(){
    if(this.QuestionDetails['AnswerType']==this.questionTypeEnum.singleSelect || this.QuestionDetails['AnswerType']==this.questionTypeEnum.multiSelect){
      return true ;
    }
  }

  previousQuestion() {
    this.quizStatus.status = 'previous_question';
    this.quizStatus.QuestionId = this.QuestionDetails.QuestionId;
    this.quizStatus.QuestionType = 2;
    this.quizDataService.nextStepStatus.next(this.quizStatus);
    this.quizDataService.setQuizBrandingAndStyle(this.QuizBrandingAndStyle);
  }


  public selectedOptionArray: Array<number> = [];
  selectedMultipleOption(answerId){
    if(this.selectedOptionArray.includes(answerId)){
      let ansIndex = this.selectedOptionArray.findIndex((ans) => {
        return ans == answerId;
      });
      this.selectedOptionArray.splice(ansIndex, 1);
    }else{
      this.selectedOptionArray.push(answerId)
    }
    this.nextBtnEnable();
  }

  submitCurrentOption(){
    if (this.CountDownInterval) {
      clearInterval(this.CountDownInterval);
    }
    if(  this.PreviousQuestionSubmittedAnswer && ! this.quizStatus.AnswerId){
      this.quizStatus.AnswerId  = this.PreviousQuestionSubmittedAnswer.SubmittedAnswerDetails[0].AnswerId  
    }else{
    this.quizStatus.AnswerId = this.QuestionDetails['AnswerType'] != this.questionTypeEnum.singleSelect ? this.selectedOptionArray.toString() : this.quizStatus.AnswerId;
  }
      this.quizStatus.AnswerId =  this.QuestionDetails['AnswerType']!=this.questionTypeEnum.singleSelect ?  this.selectedOptionArray.toString():this.quizStatus.AnswerId ;
      this.quizStatus.status = "complete_question";
      this.quizStatus.QuestionId = this.QuestionDetails.QuestionId;
      this.quizDataService.nextStepStatus.next(this.quizStatus);
      this.quizDataService.setQuizBrandingAndStyle(this.QuizBrandingAndStyle);
  }

  public answerSLText = "";
  public subAnswerSlText = ['','',''];
    /**
   * hit api attempt quiz using short and long option's text
   */

  // poster function 
  applyposter(){
    let startOffset:string = "0";
    if(this.QuestionDetails.VideoFrameEnabled == true && this.QuestionDetails.SecondsToApply){
      startOffset = this.QuestionDetails.SecondsToApply;
    }
      return `{ "cloud-name":"${environment.cloudinaryConfiguration.cloud_name}", "transformation": [{"start-offset": ${startOffset}, "fetch_format": "auto", "quality": "auto"}]}`
  }

  applyposterDes(){
    let startOffset:string = "0";
    if(this.QuestionDetails.DescVideoFrameEnabled == true && this.QuestionDetails.SecondsToApplyForDescription){
      startOffset = this.QuestionDetails.SecondsToApplyForDescription;
    }
    return `{ "cloud-name":"${environment.cloudinaryConfiguration.cloud_name}", "transformation": [{"start-offset": ${startOffset}, "fetch_format": "auto", "quality": "auto"}]}`
  }
  applyposterAns(data){
    let startOffset:string = "0";
    if(data.VideoFrameEnabled == true && data.SecondsToApply){
      startOffset = data.SecondsToApply;
    }
    return `{ "cloud-name":"${environment.cloudinaryConfiguration.cloud_name}", "transformation": [{"start-offset": ${startOffset}, "fetch_format": "auto", "quality": "auto"}]}`
  }

  ngOnDestroy(){
    clearInterval(this.intervalId);
    if(this.isVideoSoundEnableSubscription){
      this.isVideoSoundEnableSubscription.unsubscribe();
    }
  }
  
}