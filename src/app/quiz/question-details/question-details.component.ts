/// <reference types="@types/googlemaps" />
import { Component, OnInit, Renderer2, ElementRef, ViewChild, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { QuizDataService } from '../quiz-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MbscDatetimeOptions } from '@mobiscroll/angular';
import * as moment from 'moment-timezone';
import { Subscription } from 'rxjs';
import { postcodeValidator, postcodeValidatorExistsForCountry } from 'postcode-validator';
import { answerTypeEnum, BrandingLanguage } from '../../quiz-builder/quiz-tool/commonEnum';
import { environment } from '../../../environments/environment';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-question-details',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.css']
})
export class QuestionDetailsComponent implements OnInit, OnDestroy, AfterViewInit {
  //Dynamic component data instance
  public options: object;
  public QuestionDetails;
  public IsBackButtonEnable;
  public PreviousQuestionSubmittedAnswer;
  dateSettings: MbscDatetimeOptions = {
    dateFormat: 'dd/mm/yy',
    dateWheels: '|dd| |MM| |YY|'
  };
  public QuizBrandingAndStyle;
  public imageORvideo: string = 'image';
  public imageORvideoDes: string = 'image';
  public isNextButtonEnable: boolean = true;
  public quizStatus = {
    status: '',
    QuestionId: '',
    AnswerId: '',
    QuestionType: 0,
    obj: []
  }
  public timerObj: object = {
    hours: 0,
    minutes: 0,
    seconds: 0
  }
  public addClass;
  public CountDownInterval;
  public clasList = ['question-head', 'higherLevelBrandingColor'];
  public previewCode;
  @ViewChild('previewContainer', { read: ElementRef, static: true }) previewContainer: ElementRef;
  public answerIdModel;
  public selectedOptionArray: Array<number> = [];
  public buttonEnable: boolean = false;
  public hoverOnOption:any={};
  progress = 100;
  intervalId;
  getHour;
  getMin;
  getSec;
  interval;
  public coverImage;
  public descriptionImage;
  public isMobileView:boolean=false;
  public isStartQuiz:boolean=false;
  public nextStatus;
  public isNextStatus:boolean=false;
  public minHeightInDiv:any;
  public buttonShow:boolean = true;
  public isQuizCenter:boolean=false;
  public logoImage:string = "";
  public logoBackgroundColor:string = "";
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

  public ratingEmojiList = [
    {
      id : 1,
      name : "Lbl_Verysad"
    },
    {
      id : 2,
      name : "Lbl_Sad"
    },
    {
      id : 3,
      name : "Lbl_Normal"
    },
    {
      id : 4,
      name : "Lbl_Happy"
    },    
    {
      id : 5,
      name : "Lbl_Veryhappy"
    }
  ];

  public availabilityList = [
    {
      id : 1,
      name : "Lbl_Immediately"
    },
    {
      id : 2,
      name : "Lbl_Within3months"
    },
    {
      id : 3,
      name : "Lbl_After3months"
    }
  ];

  public getPostalCountryList;
  public countryCode = "";
  public isVaildPostCode:boolean = false;
  public selectedCountry:any= [];

  public ratingComment:any;
  public starHover:number = 0;
  public selectedDateOfBirth:any;
  private isVideoSoundEnableSubscription:Subscription;
  public questionTypeEnum = answerTypeEnum;
  public isleftSlide:boolean;
  public regXForVarFormulaV2 = /\{\{(([a-zA-Z0-9_]\.){0,1}[a-zA-Z0-9_])+\}\}/g;
  public availabilityDate: any;
  public availabilityMinDate : any;
  public availabilityMaxDate : any;

  constructor(private quizDataService: QuizDataService,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private router: Router,
    private cdref: ChangeDetectorRef,
    private commonService:CommonService
  ) { }

  ngOnInit() {
    if(this.QuestionDetails.AnswerType == answerTypeEnum.availability){
      this.availabilityMinDate = new Date();
      this.availabilityMaxDate = new Date();
    }
    this.QuestionDetails.QuestionTitle = this.QuestionDetails.QuestionTitle ? this.QuestionDetails.QuestionTitle.replace(this.regXForVarFormulaV2,'') : '';
    this.QuestionDetails.Description = this.QuestionDetails.Description ? this.QuestionDetails.Description.replace(this.regXForVarFormulaV2,'') : '';
    if(this.QuestionDetails.AnswerType == answerTypeEnum.singleSelect || this.QuestionDetails.AnswerType == answerTypeEnum.multiSelect){
      this.QuestionDetails.AnswerOption.map(answer => {
        answer.Title = answer.Title ? answer.Title.replace(this.regXForVarFormulaV2,'') : '';
        return true;
      });
    }

    if(!this.QuestionDetails.NextButtonText){
      this.QuestionDetails.NextButtonText = this.QuizBrandingAndStyle.Language == BrandingLanguage.Dutch ? 'Volgende' : 'Next';
    }
    this.isMobileView= window.outerWidth < 768 ? true : false;
    this.getPostalCountryList = this.quizDataService.postalCountryList;
    this.logoImage = this.quizDataService.logoImage ? this.quizDataService.logoImage : '';
    this.logoBackgroundColor = this.quizDataService.logoBackGroundColor ? this.quizDataService.logoBackGroundColor : '';
    this.isAwnserClick = false;
    this.options = this.quizDataService.getFroalaOption();
    //add popup-container class
    this.previewCode = this.route.queryParams['value'].QuizCodePreview;
    if (this.previewCode && !this.router.url.match("quiz-preview-mode")) {
      this.addClass = true;
      this.renderer.addClass(this.previewContainer.nativeElement, 'preview-popup')
    }

    this.commonService.scrollUp();
    this.componentSlide();
    // start the timer  if timerRequired is true 
    this.startTimer();
    this.getQuesAndDescImage();
    this.getAnswerType();
    this.nextBtnEnable();
    this.getQuestionElementReorder();
    this.getScrollSubscription();
    this.getSoundEnable();
    //timer
    if (this.QuestionDetails['TimerRequired'] ){
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
  }

  componentSlide(){
    if(this.nextStatus == "start_quiz" &&  this.isMobileView){
      this.isleftSlide = false;
      let self=this;
      setTimeout(function(){  self.isNextStatus = true}, 1000);
    }else{
      this.isleftSlide = true;
      this.isNextStatus = true;
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

  getQuesAndDescImage(){
    if (this.QuestionDetails.QuestionImage) {
      this.coverImage=this.QuestionDetails.QuestionImage.replace('upload/', "upload/g_auto,q_auto,f_auto/");
      this.imageORvideo = this.commonService.getImageOrVideo(this.QuestionDetails.QuestionImage);
    }
    if (this.QuestionDetails.DescriptionImage) {
      this.descriptionImage=this.QuestionDetails.DescriptionImage.replace('upload/', "upload/g_auto,q_auto,f_auto/");
      this.imageORvideoDes = this.commonService.getImageOrVideo(this.QuestionDetails.DescriptionImage);
    }
  }

  getAnswerType(){
    if(this.QuestionDetails.AnswerType == this.questionTypeEnum.fullAddress || this.QuestionDetails.AnswerType == this.questionTypeEnum.postCode){
      this.getSelectedCountryList();
    }

    if (this.PreviousQuestionSubmittedAnswer) {
      if (this.QuestionDetails.AnswerType == this.questionTypeEnum.multiSelect || this.QuestionDetails.AnswerType == this.questionTypeEnum.driversLicense) {
        let i = this.PreviousQuestionSubmittedAnswer.SubmittedAnswerDetails;
        i.forEach(element => {
          this.selectedOptionArray.push(element.AnswerId)
        });
      }else if (this.QuestionDetails.AnswerType == this.questionTypeEnum.smallText || this.QuestionDetails.AnswerType == this.questionTypeEnum.largeText || this.QuestionDetails.AnswerType == this.questionTypeEnum.postCode || this.QuestionDetails.AnswerType == this.questionTypeEnum.nps || this.QuestionDetails.AnswerType == this.questionTypeEnum.ratingEmoji || this.QuestionDetails.AnswerType == this.questionTypeEnum.ratingStar || this.QuestionDetails.AnswerType == this.questionTypeEnum.availability) {
        this.answerSLText = this.PreviousQuestionSubmittedAnswer.SubmittedAnswerDetails[0].SubmittedAnswerTitle;
        this.ratingComment = this.PreviousQuestionSubmittedAnswer.SubmittedAnswerDetails[0].Comment;
        this.availabilityDate = new Date(this.PreviousQuestionSubmittedAnswer.SubmittedAnswerDetails[0].Comment);
        if(this.QuestionDetails.AnswerType == answerTypeEnum.availability){
          this.setMinAndMaxDate(this.answerSLText);
        }
      }else if(this.QuestionDetails.AnswerType == this.questionTypeEnum.dateOfBirth){
        if(this.PreviousQuestionSubmittedAnswer.SubmittedAnswerDetails[0].SubmittedAnswerTitle){
          this.selectedDateOfBirth = moment(this.PreviousQuestionSubmittedAnswer.SubmittedAnswerDetails[0].SubmittedAnswerTitle).format('YYYY-MM-DD');
        }
      }else if (this.QuestionDetails.AnswerType == this.questionTypeEnum.fullAddress) {
        this.subAnswerSlText[0] = this.PreviousQuestionSubmittedAnswer.SubmittedAnswerDetails[0].SubmittedAnswerTitle;
        this.subAnswerSlText[1] = this.PreviousQuestionSubmittedAnswer.SubmittedAnswerDetails[1].SubmittedAnswerTitle;
        this.subAnswerSlText[2] = this.PreviousQuestionSubmittedAnswer.SubmittedAnswerDetails[2].SubmittedAnswerTitle;
      }
      if(this.QuestionDetails.AnswerType == this.questionTypeEnum.fullAddress || this.QuestionDetails.AnswerType == this.questionTypeEnum.postCode){
        this.countryCode = this.PreviousQuestionSubmittedAnswer.SubmittedAnswerDetails[0].SubmittedSecondaryAnswerTitle;
        this.isValidPostCode();
      }
    }else if(this.QuestionDetails.AnswerType == this.questionTypeEnum.fullAddress || this.QuestionDetails.AnswerType == this.questionTypeEnum.postCode){
      if(this.quizDataService.getGoogleApiCall()){
        this.getLocation();
        this.quizDataService.setGoogleApiCall(false);
      }else{
        if(this.QuestionDetails && this.QuestionDetails.AnswerOption && this.QuestionDetails.AnswerOption.length > 0 && this.QuestionDetails.AnswerOption[0].ListValues && this.QuestionDetails.AnswerOption[0].ListValues.length > 0 && this.quizDataService.getCurrentLocation() && this.QuestionDetails.AnswerOption[0].ListValues.includes(this.quizDataService.getCurrentLocation())){
          this.countryCode = this.quizDataService.getCurrentLocation();
        }
      }
    }

  }

  getQuestionElementReorder(){
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

  getSelectedCountryList(){
    this.selectedCountry = [];
    if(this.QuestionDetails.AnswerOption && this.QuestionDetails.AnswerOption.length > 0){
      if(this.QuestionDetails.AnswerOption[0].ListValues && this.QuestionDetails.AnswerOption[0].ListValues.length > 0){
        let selectedCountryObj;
        this.QuestionDetails.AnswerOption[0].ListValues.map(selectedCountry => {
          selectedCountryObj= this.getPostalCountryList.filter(postalCountry => {
            return postalCountry.value == selectedCountry;
          });
          this.selectedCountry.push(selectedCountryObj[0]);
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
      }
    });
  }

  ngAfterViewInit() {
    this.PreviousQuestionSubmittedAnswer ? this.buttonEnable=true :this.buttonEnable=false ;
    this.clasList.forEach((elem) => {
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
    } , timeSchedule);

  }

  onScroll() {
    if(this.isMobileView){
      this.buttonShow = this.commonService.isScrolledIntoView();
    }
  }

  // ngAfterContentChecked() {
  //   /**
  //    * akshay
  //    *  to tell angular that you updated the content after ngAfterContentChecked
  //    */
   
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
      this.timerObj['hours'] = time['hour'];
      this.timerObj['minutes'] = time['min'];
      this.timerObj['seconds'] = time['sec'];
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
  nextBtnEnable() {
    if (this.QuestionDetails.MaxAnswer == null && this.QuestionDetails.MinAnswer == null) {
      this.isNextButtonEnable = false;
    }

    else {
      if (this.selectedOptionArray.length > this.QuestionDetails.MaxAnswer || this.selectedOptionArray.length < this.QuestionDetails.MinAnswer) {
        this.isNextButtonEnable = true;
      } else {
        this.isNextButtonEnable = false;
      }
    }

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
        this.timerObj['seconds'] > 0 ? (this.timerObj['seconds'] = this.timerObj['seconds'] - 1) : function stop() {
          if (this.QuestionDetails['AnswerType'] == this.questionTypeEnum.singleSelect 
           ) {
              this.quizStatus.AnswerId ? this.selectedOption(this.quizStatus.AnswerId) : this.selectedOption();
          }if( this.QuestionDetails['AnswerType'] == this.questionTypeEnum.multiSelect){
            this. submitCurrentOption()
          } 
          if( this.QuestionDetails['AnswerType'] == this.questionTypeEnum.smallText ||
          this.QuestionDetails['AnswerType'] == this.questionTypeEnum.largeText){
            this.submitCurrentOptionWithText('');
          }
        }.bind(this)()

      }
    }, 1000);
  }

  //  done for applying next button on single correct answers and answer type 9 
  singleOptionSelected(answerId) {
    this.quizStatus.AnswerId = answerId;
    this.buttonEnable = true;
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
  selectedOption(optionValue?) {
    
    if (this.CountDownInterval) {
      clearInterval(this.CountDownInterval);
    }
    event ? event.preventDefault() : '';
    this.quizStatus.AnswerId = optionValue ? optionValue : null;
    this.quizStatus.status = 'complete_question'
    this.quizStatus.QuestionId = this.QuestionDetails.QuestionId;
    this.quizDataService.nextStepStatus.next(this.quizStatus)
    this.quizDataService.setQuizBrandingAndStyle(this.QuizBrandingAndStyle);
    if (this.PreviousQuestionSubmittedAnswer) {
      this.PreviousQuestionSubmittedAnswer.SubmittedAnswerDetails[0].AnswerId = '';
    }
  }

  setStyling(elem) {
    var data = document.getElementsByClassName(elem);
    for (var x = 0; x < data.length; x++) {
      if (elem == 'higherLevelBrandingColor') {
        if (data[x].childNodes[1] && data[x].childNodes[1].childNodes[0]) {
          if(data[x].childNodes[1].childNodes[0]['style']){
            data[x].childNodes[1].childNodes[0]['style'] = {};
            data[x].childNodes[1].childNodes[0]['style'].background = this.QuizBrandingAndStyle.OptionColor;
            data[x].childNodes[1].childNodes[0]['style'].color = this.QuizBrandingAndStyle.OptionFontColor;
          }
        }
      }
      else {
        if (data[x].childNodes[1] && data[x].childNodes[1].childNodes[0]) {
          data[x].childNodes[1].childNodes[0]['style'] = {};
          data[x].childNodes[1].childNodes[0]['style'].background = this.QuizBrandingAndStyle.BackgroundColor;
          data[x].childNodes[1].childNodes[0]['style'].color = this.QuizBrandingAndStyle.FontColor;
        }
      }
    }
  }
  // Returns true if the Timer is on and the question type is Short text, Long text, Single select & Multiple select
  // Done for applying Timer 
  checkForQuesType() {
    if (
      this.QuestionDetails['AnswerType'] == this.questionTypeEnum.singleSelect ||
      this.QuestionDetails['AnswerType'] == this.questionTypeEnum.multiSelect || this.QuestionDetails['AnswerType'] == this.questionTypeEnum.smallText ||
      this.QuestionDetails['AnswerType'] == this.questionTypeEnum.largeText
    ) {
      return true;
    }
  }
  previousQuestion() {
    this.quizStatus.status = 'previous_question';
    this.quizStatus.QuestionId = this.QuestionDetails.QuestionId;
    this.quizStatus.QuestionType = 2;
    this.quizDataService.nextStepStatus.next(this.quizStatus);
    this.quizDataService.setQuizBrandingAndStyle(this.QuizBrandingAndStyle);
  }

  /**
   * @param answerId selected option id
   * add and remove selected option  
   */


  selectedMultipleOption(answerId) {
    event.preventDefault();
    if (this.selectedOptionArray.includes(answerId)) {
      let ansIndex = this.selectedOptionArray.findIndex((ans) => {
        return ans == answerId;
      });
      this.selectedOptionArray.splice(ansIndex, 1);
    } else {
      this.selectedOptionArray.push(answerId)
    }
    this.nextBtnEnable();
  }

  /**
   * hit api attempt quiz using multiple option
   */
  submitCurrentOption() {
    if (this.CountDownInterval) {
      clearInterval(this.CountDownInterval);
    }
    if(  this.PreviousQuestionSubmittedAnswer && ! this.quizStatus.AnswerId){
      this.quizStatus.AnswerId  = this.PreviousQuestionSubmittedAnswer.SubmittedAnswerDetails[0].AnswerId  
    }else{
    this.quizStatus.AnswerId = (this.QuestionDetails['AnswerType'] != this.questionTypeEnum.singleSelect && this.QuestionDetails['AnswerType'] != this.questionTypeEnum.lookingForJob) ? this.selectedOptionArray.toString() : this.quizStatus.AnswerId;
  }
  this.quizStatus.AnswerId = (this.QuestionDetails['AnswerType'] != this.questionTypeEnum.singleSelect && this.QuestionDetails['AnswerType'] != this.questionTypeEnum.lookingForJob) ? this.selectedOptionArray.toString() : this.quizStatus.AnswerId;
    this.quizStatus.status = 'complete_question'
    this.quizStatus.QuestionId = this.QuestionDetails.QuestionId;
    this.quizDataService.nextStepStatus.next(this.quizStatus)
    this.quizDataService.setQuizBrandingAndStyle(this.QuizBrandingAndStyle);
  }

  public answerSLText: any;
  public subAnswerSlText = ['', '', ''];
  /**
 * hit api attempt quiz using short and long option's text
 */

onSelectedSlide(data){
  if(this.QuestionDetails.AnswerType == answerTypeEnum.availability && this.answerSLText != data){
    this.availabilityDate = null;
    this.setMinAndMaxDate(data);
  }
  this.answerSLText = data;
}

setMinAndMaxDate(data:any){
  let currentDate = new Date();
  let getCurrentTime = new Date(currentDate.getTime());
  getCurrentTime.setMonth(getCurrentTime.getMonth()+3);
  if(data == 1){
    this.availabilityMinDate = new Date();
    this.availabilityMaxDate = new Date();
    this.availabilityDate = new Date();
  }else if(data == 2){
    this.availabilityMinDate = new Date();
    this.availabilityMaxDate = new Date(getCurrentTime);
  }else if(data == 3){
    getCurrentTime.setDate(getCurrentTime.getDate()+1);
    this.availabilityMinDate = new Date(getCurrentTime);
    getCurrentTime.setMonth(getCurrentTime.getMonth()+3);
    this.availabilityMaxDate = new Date(getCurrentTime);
  }
}


  submitCurrentOptionWithText() {
    this.CountDownInterval ? clearInterval(this.CountDownInterval) : '';
    if(this.QuestionDetails.IsMultiRating && (this.QuestionDetails.AnswerType == this.questionTypeEnum.ratingEmoji || this.QuestionDetails.AnswerType == this.questionTypeEnum.ratingStar)){
      this.quizStatus.AnswerId = this.QuestionDetails.AnswerOption[this.answerSLText-1].AnswerId;
    }else{
      if(this.QuestionDetails.AnswerType == this.questionTypeEnum.availability){
        this.quizStatus.AnswerId = this.QuestionDetails.AnswerOption[this.answerSLText-1].AnswerId;
      }else{
        this.quizStatus.AnswerId = this.QuestionDetails.AnswerOption[0].AnswerId;
      }
   }
    this.quizStatus.status = 'complete_question';
    this.quizStatus.QuestionId = this.QuestionDetails.QuestionId;
    if(this.QuestionDetails.AnswerType == this.questionTypeEnum.dateOfBirth){
        if (typeof this.selectedDateOfBirth == "string") {
          this.answerSLText = this.PreviousQuestionSubmittedAnswer.SubmittedAnswerDetails[0].SubmittedAnswerTitle;
        } else {
          this.answerSLText = this.selectedDateOfBirth.toLocaleDateString();
        }
    }
    if (this.QuestionDetails.AnswerType == this.questionTypeEnum.smallText || this.QuestionDetails.AnswerType == this.questionTypeEnum.largeText || this.QuestionDetails.AnswerType == this.questionTypeEnum.dateOfBirth || this.QuestionDetails.AnswerType == this.questionTypeEnum.postCode || this.QuestionDetails.AnswerType == this.questionTypeEnum.nps) {
      this.quizStatus.obj = [
        {
          "AnswerId": this.QuestionDetails.AnswerOption[0].AnswerId,
          "Answers": [
            {
              "AnswerText": this.answerSLText,
              "SubAnswerTypeId": 0,
              "Comment" : this.ratingComment,
              "AnswerSecondaryText":this.QuestionDetails.AnswerType == this.questionTypeEnum.postCode ? this.countryCode : null
            }
          ]
        }
      ];
    } else if(this.QuestionDetails.AnswerType == this.questionTypeEnum.ratingEmoji || this.QuestionDetails.AnswerType == this.questionTypeEnum.ratingStar){
        this.quizStatus.obj = [
          {
            "AnswerId": this.QuestionDetails.IsMultiRating ? this.QuestionDetails.AnswerOption[this.answerSLText-1].AnswerId : this.QuestionDetails.AnswerOption[0].AnswerId,
            "Answers": [
              {
                "AnswerText": this.answerSLText,
                "SubAnswerTypeId": 0,
                "Comment" : this.ratingComment,
                "AnswerSecondaryText": null
              }
            ]
          }
        ];
    }else if(this.QuestionDetails.AnswerType == this.questionTypeEnum.availability){
      this.quizStatus.obj = [
        {
          "AnswerId": this.QuestionDetails.AnswerOption[this.answerSLText-1].AnswerId,
          "Answers": [
            {
              "AnswerText": this.answerSLText,
              "SubAnswerTypeId": 0,
              "Comment" : moment(this.availabilityDate).format('YYYY-MM-DD'),
              "AnswerSecondaryText": null
            }
          ]
        }
      ];
    }
     else {
      this.quizStatus.obj = [
        {
          "AnswerId": this.QuestionDetails.AnswerOption[0].AnswerId,
          "Answers": [
            {
              "AnswerText": this.subAnswerSlText[0],
              "SubAnswerTypeId": 1,
              "AnswerSecondaryText": this.QuestionDetails.AnswerType == this.questionTypeEnum.fullAddress ? this.countryCode : null
            }
          ]
        },
        {
          "AnswerId": this.QuestionDetails.AnswerOption[1].AnswerId,
          "Answers": [
            {
              "AnswerText": this.subAnswerSlText[1],
              "SubAnswerTypeId": 2
            }
          ]
        },
        {
          "AnswerId": this.QuestionDetails.AnswerOption[1].AnswerId,
          "Answers": [
            {
              "AnswerText": this.subAnswerSlText[2],
              "SubAnswerTypeId": 3
            }
          ]
        }

      ];
    }
    this.quizDataService.nextStepStatus.next(this.quizStatus)
    this.quizDataService.setQuizBrandingAndStyle(this.QuizBrandingAndStyle);
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

  isValidPostCode(){
    if(this.isMobileView){
      let ngSelectElement = document.getElementsByTagName("ng-select");
      if(ngSelectElement && ngSelectElement.length > 0){
        ngSelectElement[0].classList.remove("ng-select-filtered");
      }
    }
    
    let answerText = this.QuestionDetails.AnswerType == this.questionTypeEnum.fullAddress ? this.subAnswerSlText[0] : this.answerSLText;
    if(this.countryCode && answerText){
      if(postcodeValidatorExistsForCountry(this.countryCode)){
        this.isVaildPostCode = postcodeValidator(answerText, this.countryCode);
      }else{
        this.isVaildPostCode = postcodeValidator(answerText, 'INTL');
        console.log(`Invaild country code ${this.countryCode}`);
      }
    }else{
      this.isVaildPostCode = false;
    }
  }
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

  //get location
  getLocation() {
    var isCountryCode = false;
    var country = null, countryCode = null;
    if (!!(navigator.geolocation)) {
      navigator.geolocation.getCurrentPosition(function(position) {
		    const latlng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        new google.maps.Geocoder().geocode({ location: latlng }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
              if (results[1]) {
                for (var r = 0, rl = results.length; r < rl; r += 1) {
                    var result = results[r];
                    //country & countryCode
                    if (!country && result.types[0] === 'country') {
                        country = result.address_components[0].long_name;
                        countryCode = result.address_components[0].short_name;
                        isCountryCode = true;
                    }
                }
                console.log(`Country: ${country}, Country Code: ${countryCode}`);
              }
          }
        });
			}, function(error) {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            console.log( "User denied the request for Geolocation.");
            isCountryCode = true;
            break;
          case error.POSITION_UNAVAILABLE:
            console.log( "Location information is unavailable.");
            isCountryCode = true;
            break;
          case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            isCountryCode = true;
            break;
        }
			},{maximumAge:0, timeout:10000, enableHighAccuracy:true});

      let waitForPostalCode = setInterval(() => {
        if(isCountryCode){
          if(countryCode){
            this.quizDataService.setCurrentLocation(countryCode);
            if(this.QuestionDetails && this.QuestionDetails.AnswerOption && this.QuestionDetails.AnswerOption.length > 0 && this.QuestionDetails.AnswerOption[0].ListValues && this.QuestionDetails.AnswerOption[0].ListValues.length > 0 && this.QuestionDetails.AnswerOption[0].ListValues.includes(countryCode)){
              this.countryCode = countryCode;
              this.isValidPostCode();
            }
          }
          isCountryCode = false;
          clearInterval(waitForPostalCode);
        }
      }, 1000);

    } else { 
     console.log("Geolocation is not supported by this browser.");
    }
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    this.quizDataService.nextStepStatus.next('')
    if(this.isVideoSoundEnableSubscription){
      this.isVideoSoundEnableSubscription.unsubscribe();
    }
  }

}
