import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  ViewChild,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { QuizDataService } from "../quiz-data.service";
import { Subscription } from "rxjs";
import { environment } from "../../../environments/environment";
import { CommonService } from "../../shared/services/common.service";
import { BrandingLanguage } from "../../quiz-builder/quiz-tool/commonEnum";

@Component({
  selector: "app-content-details",
  templateUrl: "./content-details.component.html",
  styleUrls: ["./content-details.component.css"]
})
export class ContentDetailsComponent implements OnInit, OnDestroy , AfterViewInit {
  public ContentData;
  public previewCode;
  public QuizBrandingAndStyle;
  public IsBackButtonEnable;
  @ViewChild("previewContainer", { read: ElementRef , static:true})
  previewContainer: ElementRef;
  public imageORvideo;
  public imageORvideoDescription;
  public quizStatus = {
    AnswerId: "",
    status: "",
    QuestionType: 0,
    QuestionId: 0,
    ContentId: "",
  };
  public addClass= false;
  public isMobileView:boolean=false;
  public isStartQuiz:boolean=false;
  public leftSlide:boolean=false;
  public minHeightInDiv:any;
  public buttonShow:boolean=true;
  public logoImage:string = "";
  public logoBackgroundColor:string = "";
  private isVideoSoundEnableSubscription:Subscription;
  public nextStatus;
  public isleftSlide:boolean;
  public isNextStatus:boolean=false;
  public contentElementReorder:any = [
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
        "displayOrder": 6,
        "key": "button"
    }
  ];
  public regXForVarFormulaV2 = /\{\{(([a-zA-Z0-9_]\.){0,1}[a-zA-Z0-9_])+\}\}/g;  
  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private router: Router,
    private quizDataService: QuizDataService,
    private commonService:CommonService
  ) {}

  public options;
  ngOnInit() {
    this.ContentData.ContentTitle = this.ContentData.ContentTitle ? this.ContentData.ContentTitle.replace(this.regXForVarFormulaV2,'') : '';
    this.ContentData.ContentDescription = this.ContentData.ContentDescription ? this.ContentData.ContentDescription.replace(this.regXForVarFormulaV2,'') : '';
    if(!this.ContentData.AliasTextForNextButton){
      this.ContentData.AliasTextForNextButton = this.QuizBrandingAndStyle.Language == BrandingLanguage.Dutch ? 'Volgende' : 'Next';
    }
    this.commonService.scrollUp();
    this.isMobileView = window.outerWidth < 768 ? true : false;
    this.logoImage = this.quizDataService.logoImage ? this.quizDataService.logoImage : '';
    this.logoBackgroundColor = this.quizDataService.logoBackGroundColor ? this.quizDataService.logoBackGroundColor : '';
    this.options = this.quizDataService.getFroalaOption();

    if(this.isMobileView){
      let self=this;
      setTimeout(function(){  self.leftSlide = true }, 1000);
    }
    this.componentSlide();
   //add popup-container class
    this.previewCode = this.route.queryParams["value"].QuizCodePreview;
    if (this.previewCode && !this.router.url.match("quiz-preview-mode")) {
      this.addClass = true;
      this.renderer.addClass(
        this.previewContainer.nativeElement,
        "preview-popup"
      );
    }
    this.getContentAndDescImage();
    this.reOrderElement();
    this.getScrollSubscription();
    this.getSoundEnable();
  }

  componentSlide(){
    if(this.nextStatus == "start_quiz" &&  this.isMobileView){
      this.isleftSlide = false;
      let self=this;
      setTimeout(function(){  self.isNextStatus = true }, 1000);
    }else{
      this.isleftSlide = true;
      this.isNextStatus = true;
    }
  }

  getContentAndDescImage(){
    if (this.ContentData.ContentTitleImage) {
      this.imageORvideo = this.commonService.getImageOrVideo(this.ContentData.ContentTitleImage);
    }
    if (this.ContentData.ContentDescriptionImage) {
      this.imageORvideoDescription = this.commonService.getImageOrVideo(this.ContentData.ContentDescriptionImage);
    }
  }

  reOrderElement(){
    if(this.ContentData){
      this.contentElementReorder = [
        {
            "displayOrder": this.ContentData.DisplayOrderForTitle,
            "key": "title"
        },
        {
            "displayOrder": this.ContentData.DisplayOrderForTitleImage,
            "key": "media"
        },
        {
            "displayOrder": this.ContentData.DisplayOrderForDescription,
            "key": "description",
            "disMedia" : {
                "displayOrder": this.ContentData.DisplayOrderForDescriptionImage,
                "key": "description media",
            }
        },
        {
            "displayOrder": this.ContentData.DisplayOrderForNextButton,
            "key": "button"
        }
      ];
      this.contentElementReorder.sort((a, b) => (a.displayOrder > b.displayOrder) ? 1 : -1)
    }
  }

  getScrollSubscription(){
    this.quizDataService.isScrollSubmissionObservable.subscribe(res => {
      this.onScroll();
    });
  }

  getSoundEnable(){
    this.isVideoSoundEnableSubscription = this.quizDataService.isSoundEnableInAttemptObservable.subscribe(data => {
      if(data){
        if(this.imageORvideo === 'video' && this.ContentData && this.ContentData.AutoPlay && this.ContentData.ShowContentTitleImage){
          this.commonService.videoAutoPlayWithSound("autoPlayVideo",false);
        }
        if(this.ContentData.ShowContentDescriptionImage && this.ContentData.AutoPlayForDescription && this.imageORvideoDescription === 'video'){
          this.commonService.videoAutoPlayWithSound("autoplayDes",false);
        }
      }
    });
  }

  ngAfterViewInit(){
    this.setStyling("next-line-string");
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
      if(self.ContentData.AutoPlay && self.imageORvideo === 'video'){
        self.commonService.videoAutoPlayWithSound("autoPlayVideo",true);
      }

      if(self.ContentData.AutoPlayForDescription && self.imageORvideoDescription === 'video'){
        self.commonService.videoAutoPlayWithSound("autoplayDes",true);
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
      if(data[x].childNodes[1] && data[x].childNodes[1].childNodes[0]){
        data[x].childNodes[1].childNodes[0]['style'] = {};
        data[x].childNodes[1].childNodes[0]['style'].background = this.QuizBrandingAndStyle.BackgroundColor;
        data[x].childNodes[1].childNodes[0]['style'].color = this.QuizBrandingAndStyle.FontColor;
      }
    }
  }

  next() {
    this.quizStatus.AnswerId = "";
    this.quizStatus.status = "complete_content";
    this.quizStatus.ContentId = this.ContentData.Id;
    this.quizDataService.setQuizBrandingAndStyle(this.QuizBrandingAndStyle);
    if(this.isMobileView){
      this.isStartQuiz=true;
      let self=this;
      setTimeout(function(){
        self.quizDataService.nextStepStatus.next(self.quizStatus);
      }, 1000);
    }else{
      this.quizDataService.nextStepStatus.next(this.quizStatus);
    }
  }


  previousQuestion() {
    this.quizStatus.status = 'previous_question';
    this.quizStatus.QuestionId = this.ContentData.Id;
    this.quizStatus.QuestionType = 6;
    this.quizDataService.nextStepStatus.next(this.quizStatus);
    this.quizDataService.setQuizBrandingAndStyle(this.QuizBrandingAndStyle);
  }

   // poster function 
   applyposter(){
    let startOffset:string = "0";
    if(this.ContentData.VideoFrameEnabled == true && this.ContentData.SecondsToApply){
      startOffset = this.ContentData.SecondsToApply;
    }
    return `{ "cloud-name":"${environment.cloudinaryConfiguration.cloud_name}", "transformation": [{"start-offset": ${startOffset}, "fetch_format": "auto", "quality": "auto"}]}`
  }

  applyposterDes(){
    let startOffset:string = "0";
    if(this.ContentData.DescVideoFrameEnabled == true && this.ContentData.SecondsToApplyForDescription){
      startOffset = this.ContentData.SecondsToApplyForDescription;
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
