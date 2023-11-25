import { Component, OnInit, Renderer2, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { QuizDataService } from '../quiz-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RemoveallTagPipe } from '../../shared/pipes/search.pipe';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { QuizApiService } from '../quiz-api.service';
import { CommonService } from '../../shared/services/common.service';
import { BrandingLanguage } from '../../quiz-builder/quiz-tool/commonEnum';
const filterPipe = new RemoveallTagPipe();
@Component({
  selector: 'app-cover-details',
  templateUrl: './cover-details.component.html',
  styleUrls: ['./cover-details.component.css']
})
export class CoverDetailsComponent implements OnInit, OnDestroy, AfterViewInit {
  public quizStatus = {
    status: '',
    QuestionId: '',
    AnswerId: ''
  }
  public imageORvideo;
  public QuizBrandingAndStyle;
  public previewCode;
  public coverData;
  public addClass = false;
  public coverImage;
  public isMobileView:boolean=false;
  public isStartQuiz:boolean=false;
  public defaultImage:any="https://res.cloudinary.com/dbbkqtyqn/image/upload/c_fill,w_auto,g_auto,q_auto:best,f_auto/v1588680596/Jobrock/automation-place-holder-corner.png";
  public leftSlide:boolean=false;
  public minHeightInDiv:any;
  public buttonShow:boolean = true;
  public logoImage:string = "";
  public elemTop:any;
  public elemBottom:any; 
  public isHoveredOnButton = false;
  public logoBackgroundColor:string = "";
  private isVideoSoundEnableSubscription:Subscription;
  public coverElementReorder:any = [
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

  public regXForVarFormulaV2 = /\{\{(([a-zA-Z0-9_]\.){0,1}[a-zA-Z0-9_])+\}\}/g;
  @ViewChild('previewContainer', {read: ElementRef, static:true}) previewContainer: ElementRef;
  constructor(private route: ActivatedRoute,
    private titleService: Title,
    private renderer: Renderer2,
    private router: Router,
    private quizDataService: QuizDataService,
    private quizApiService: QuizApiService,
    private commonService:CommonService
  ) { }

  public options;
  ngOnInit() {
    this.isMobileView= window.outerWidth < 768 ? true : false;
    if(this.isMobileView){
      let self=this;
      setTimeout(function(){  self.leftSlide = true }, 1000);
    }
    this.coverData.QuizCoverDetails.QuizCoverTitle = this.coverData.QuizCoverDetails.QuizCoverTitle ? this.coverData.QuizCoverDetails.QuizCoverTitle.replace(this.regXForVarFormulaV2,'') : '';
    this.coverData.QuizCoverDetails.QuizDescription = this.coverData.QuizCoverDetails.QuizDescription ? this.coverData.QuizCoverDetails.QuizDescription.replace(this.regXForVarFormulaV2,'') : '';
    this.logoImage = this.quizDataService.logoImage ? this.quizDataService.logoImage : '';
    this.logoBackgroundColor = this.quizDataService.logoBackGroundColor ? this.quizDataService.logoBackGroundColor : '';
    this.options = this.quizDataService.getFroalaOption()
    this.QuizBrandingAndStyle = this.quizApiService.attemptQuizSetting.QuizBrandingAndStyle;
    if(!this.coverData.QuizCoverDetails.QuizStartButtonText){
      this.coverData.QuizCoverDetails.QuizStartButtonText = this.QuizBrandingAndStyle.Language == BrandingLanguage.Dutch ? 'Start' : 'Start';
    }
    this.quizDataService.setQuizTitle(this.coverData.QuizCoverDetails.QuizTitle);
    this.setAttemptQuizTitle();
    //add popup-container class
    this.previewCode = this.route.queryParams['value'].QuizCodePreview;
    if(this.previewCode && !this.router.url.match("quiz-preview-mode")){
      this.addClass = true;
      this.renderer.addClass(this.previewContainer.nativeElement, 'preview-popup')
    }
    this.getCoverImage();
    this.getElementOrder();
    this.getScrollSubscription();
    this.getSoundEnable();
  }

  getCoverImage(){
    if(this.coverData.QuizCoverDetails.QuizCoverImage){
      this.coverImage=this.coverData.QuizCoverDetails.QuizCoverImage.replace('upload/', "upload/g_auto,q_auto,f_auto/");
      this.imageORvideo = this.commonService.getImageOrVideo(this.coverData.QuizCoverDetails.QuizCoverImage);
    }
  }

  getScrollSubscription(){
    this.quizDataService.isScrollSubmissionObservable.subscribe(res => {
      this.onScroll();
    });
  }

  getElementOrder(){
    if(this.coverData.QuizCoverDetails){
      this.coverElementReorder = [
        {
            "displayOrder": this.coverData.QuizCoverDetails.DisplayOrderForTitle,
            "key": "title"
        },
        {
            "displayOrder": this.coverData.QuizCoverDetails.DisplayOrderForTitleImage,
            "key": "media"
        },
        {
            "displayOrder": this.coverData.QuizCoverDetails.DisplayOrderForDescription,
            "key": "description"
        },
        {
            "displayOrder": this.coverData.QuizCoverDetails.DisplayOrderForNextButton,
            "key": "button"
        }
      ];
      this.coverElementReorder.sort((a, b) => (a.displayOrder > b.displayOrder) ? 1 : -1)
    }
  }

  getSoundEnable(){
    this.isVideoSoundEnableSubscription = this.quizDataService.isSoundEnableInAttemptObservable.subscribe(data => {
      if(data){
        if(this.imageORvideo === 'video' && this.coverData && this.coverData.QuizCoverDetails && this.coverData.QuizCoverDetails.AutoPlay && this.coverData.QuizCoverDetails.ShowQuizCoverImage){
          this.commonService.videoAutoPlayWithSound("autoPlayVideo",false);
        }
      }
    });
  }

  ngAfterViewInit(){
    
      let timeSchedule = this.isMobileView ? 4000 : 1000;
      this.setStyling("next-line-string");
      let self = this;
      setTimeout(function(){  
        if(self.isMobileView){
          self.buttonShow = self.commonService.isScrolledIntoView();
        } }, 100);

      setTimeout(function(){  
        if(self.coverData.QuizCoverDetails.ShowQuizCoverImage && self.coverData.QuizCoverDetails.AutoPlay && self.imageORvideo === 'video'){
          self.commonService.videoAutoPlayWithSound("autoPlayVideo",true);
        }
      } , timeSchedule);
  }

  onScroll() {
    if(this.isMobileView){
      this.buttonShow = this.commonService.isScrolledIntoView();
    }
  }

  public setAttemptQuizTitle() {
    if(this.coverData.QuizCoverDetails.QuizCoverTitle){
      const fiteredAnwserText = filterPipe.transform(this.coverData.QuizCoverDetails.QuizCoverTitle);
      this.titleService.setTitle( fiteredAnwserText);
      //this.quizDataService.createDataLayer('jr_Automation_View',this.QuizBrandingAndStyle.QuizId,'');
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

  // poster function 
  applyposter(){
    let startOffset:string = "0";
    if(this.coverData.QuizCoverDetails.VideoFrameEnabled == true && this.coverData.QuizCoverDetails.SecondsToApply){
      startOffset = this.coverData.QuizCoverDetails.SecondsToApply;
    }
    return `{ "cloud-name":"${environment.cloudinaryConfiguration.cloud_name}", "transformation": [{"start-offset": ${startOffset}, "fetch_format": "auto", "quality": "auto"}]}`
  }
  /**
   * When user clicks the button on cover page
   * It is then informed in quiz.component.ts where the subscription to 
   * the behaviour subject determines which component to call
   */
  startQuiz() {
    this.quizStatus.status = 'start_quiz',
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
    this.quizDataService.createDataLayer('jr_Automation_Start',this.QuizBrandingAndStyle.QuizId,'');
  }

  ngOnDestroy(){
    this.quizDataService.nextStepStatus.next('');
    if(this.isVideoSoundEnableSubscription){
      this.isVideoSoundEnableSubscription.unsubscribe();
    }
  }

}
