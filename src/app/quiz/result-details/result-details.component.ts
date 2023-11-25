import { Component, OnInit, Renderer2, ViewChild, ElementRef, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizDataService } from '../quiz-data.service';
import { SharedService } from '../../shared/services/shared.service';
import * as $ from "jquery";
import { QuizApiService } from '../quiz-api.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CommonService } from '../../shared/services/common.service';
import { BrandingLanguage } from '../../quiz-builder/quiz-tool/commonEnum';

@Component({
  selector: 'app-result-details',
  templateUrl: './result-details.component.html',
  styleUrls: ['./result-details.component.css']
})
export class ResultDetailsComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() public ResultScore;
  public previewCode;
  @Input() public QuizBrandingAndStyle;
  @ViewChild('previewContainer', { read: ElementRef , static:true}) previewContainer: ElementRef;
  public sharedURL;
  public sharedResult;
  public imageORvideo;
  @Input() public quizType;
  @Input() public resultLeadForm:boolean;
  public appointmentCode;
  public publishedCode;
  public completeQuiz;
  public flowOrder;
  public companycode;
  public addClass = false;
  public isMobileView:boolean=false;
  public leftSlide:boolean=false;
  public minHeightInDiv:any;
  public buttonShow:boolean=true;
  public logoImage:string = "";
  public logoBackgroundColor:string = "";
  private isVideoSoundEnableSubscription:Subscription;
  public resultElementReorder:any = [
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
        "key": "description"
    },
    {
        "displayOrder": 4,
        "key": "button"
    }
];
public quizStatus = {
  status: '',
  data: '',
  companycode: '',
  quizBrandingAndStyle: '',
  appointmentCode:''
}
public regXForVarFormulaV2 = /\{\{(([a-zA-Z0-9_]\.){0,1}[a-zA-Z0-9_])+\}\}/g;
  
  constructor(private route: ActivatedRoute,
    private renderer: Renderer2,
    private router: Router,
    private quizDataService: QuizDataService,
    private sharedService :SharedService,
    private quizApiService: QuizApiService,
    private commonService:CommonService
  ) { }

  public options;
  ngOnInit() {
    this.ResultScore.Title = this.ResultScore.Title ? this.ResultScore.Title.replace(this.regXForVarFormulaV2,'') : '';
    this.ResultScore.Description = this.ResultScore.Description ? this.ResultScore.Description.replace(this.regXForVarFormulaV2,'') : '';
    if(!this.ResultScore.ActionButtonText){
      this.ResultScore.ActionButtonText = this.QuizBrandingAndStyle.Language == BrandingLanguage.Dutch ? 'Klik hier' : 'Click here';
    }
    this.commonService.scrollUp();
    this.isMobileView = window.outerWidth < 768 ? true : false;
    this.logoImage = this.quizDataService.logoImage ? this.quizDataService.logoImage : '';
    this.logoBackgroundColor = this.quizDataService.logoBackGroundColor ? this.quizDataService.logoBackGroundColor : '';
    this.options = this.quizDataService.getFroalaOption();
    this.quizDataService.createDataLayer('jr_Automation_Result',this.QuizBrandingAndStyle.QuizId,this.ResultScore.InternalTitle);
    if(this.isMobileView){
      let self=this;
      setTimeout(function(){  self.leftSlide = true }, 1000);
    }
    //add popup-container class
    this.previewCode = this.route.queryParams['value'].QuizCodePreview;
    if (this.previewCode && !this.router.url.match("quiz-preview-mode")) {
      this.addClass = true;
      if(this.previewContainer){
        this.renderer.addClass(this.previewContainer.nativeElement, 'preview-popup')
      }
    }

    this.getAnswer();
    this.sharedURL = this.quizDataService.getSharedQuizURL();
    this.sharedResult = `${this.ResultScore.ResultScoreValueTxt} - ${this.quizDataService.getQuizTitle()}`;
    if(!this.QuizBrandingAndStyle){
      this.QuizBrandingAndStyle = this.quizApiService.attemptQuizSetting.QuizBrandingAndStyle;
    }
    if (this.ResultScore.Image) {
      this.imageORvideo = this.commonService.getImageOrVideo(this.ResultScore.Image);
    }

    let url =this.ResultScore.ActionButtonURL
      $(function() {
        $('.blue').click(function(event) { 
          if(!url){event.preventDefault();}
        });
     });

    this.getReorder();
    if(this.completeQuiz && this.publishedCode){
      this.getAppointmentCode();
    }
    this.getScrollSubscription();
    this.getSoundEnable();
  }


  getScrollSubscription(){
    this.quizDataService.isScrollSubmissionObservable.subscribe(res => {
      this.onScroll();
    });
  }

  getReorder(){
    if(this.ResultScore){
      this.resultElementReorder = [
        {
            "displayOrder": this.ResultScore.DisplayOrderForTitle,
            "key": "title"
        },
        {
            "displayOrder": this.ResultScore.DisplayOrderForTitleImage,
            "key": "media"
        },
        {
            "displayOrder": this.ResultScore.DisplayOrderForDescription,
            "key": "description"
        },
        {
            "displayOrder": this.ResultScore.DisplayOrderForNextButton,
            "key": "button"
        }
      ];
      this.resultElementReorder.sort((a, b) => (a.displayOrder > b.displayOrder) ? 1 : -1)
    }
  }

  getSoundEnable(){
    this.isVideoSoundEnableSubscription = this.quizDataService.isSoundEnableInAttemptObservable.subscribe(data => {
      if(data){
        if(this.imageORvideo === 'video' && this.ResultScore && this.ResultScore.AutoPlay){
          this.commonService.videoAutoPlayWithSound("autoPlayVideo",false);
        }
      }
    });
  }

  getAnswer(){
    if(this.ResultScore.AttemptedQuestionAnswerDetails){
      this.ResultScore.AttemptedQuestionAnswerDetails.forEach(element => {
        if(element.YourAnswer){
        element.YourAnswer = this.sharedService.sanitizeData(element.YourAnswer);
        }
        if(element.CorrectAnswer){
        element.CorrectAnswer = this.sharedService.sanitizeData(element.CorrectAnswer);
        }
      });
    }
  }

  ngAfterViewInit(){
    this.setStyling("higherLevelStyle")
    let timeSchedule = this.isMobileView ? 4000 : 1000;
    let self = this;
    setTimeout(function(){  
      if(self.isMobileView){
        self.buttonShow = self.commonService.isScrolledIntoView();
      } }, 100);

    setTimeout(function(){  
      if(self.ResultScore.AutoPlay && self.imageORvideo === 'video'){
        self.commonService.videoAutoPlayWithSound("autoPlayVideo",true);
      }
    } , timeSchedule);

  }
    setStyling(elem){
      var data = document.getElementsByClassName(elem);
      for(var x=0 ;x < data.length ;x++){
        if(data[x].childNodes[1] && data[x].childNodes[1].childNodes[0]){
          data[x].childNodes[1].childNodes[0]['style'] = {};
          data[x].childNodes[1].childNodes[0]['style'].background = this.QuizBrandingAndStyle.BackgroundColor;
          data[x].childNodes[1].childNodes[0]['style'].color = this.QuizBrandingAndStyle.FontColor;
        }
      }
    }

  onScroll() {
    if(this.isMobileView){
      this.buttonShow = this.commonService.isScrolledIntoView();
    }
  }

  getAppointmentCode(){
      let userTypeId = this.quizDataService.getUserTypeId() ? this.quizDataService.getUserTypeId() : "";
      this.quizApiService
      .getQuizAttemptQuiz(this.publishedCode, "", "complete_quiz", "","", userTypeId, "", [])
      .subscribe(data => {
        this.appointmentCode = data.AppointmentCode;
      });
  }

  onleadForm(){
    if(this.flowOrder && this.flowOrder == 1){
      this.quizStatus.status = 'res-lead';
    }else if(this.appointmentCode){
      this.quizStatus.status = 'appointment_slot';
    }
    this.quizStatus.data = this.ResultScore;
    this.quizStatus.quizBrandingAndStyle = this.QuizBrandingAndStyle;
    this.quizStatus.companycode = this.companycode;
    this.quizStatus.appointmentCode = this.appointmentCode;
    this.quizDataService.nextStepStatus.next(this.quizStatus)
  }

  // poster function 
   applyposter(){
    let startOffset:string = "0";
    if(this.ResultScore.VideoFrameEnabled == true && this.ResultScore.SecondsToApply){
      startOffset = this.ResultScore.SecondsToApply;
    }
    return `{ "cloud-name":"${environment.cloudinaryConfiguration.cloud_name}", "transformation": [{"start-offset": ${startOffset}, "fetch_format": "auto", "quality": "auto"}]}`
  }
  ngOnDestroy(){
    this.quizDataService.nextStepStatus.next('');
    if(this.isVideoSoundEnableSubscription){
      this.isVideoSoundEnableSubscription.unsubscribe();
    }
  }
  
}
