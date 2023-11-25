import { Component, OnInit, Renderer2, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { QuizDataService } from '../quiz-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../shared/services/common.service';
@Component({
  selector: 'app-answer-details',
  templateUrl: './answer-details.component.html',
  styleUrls: ['./answer-details.component.css']
})
export class AnswerDetailsComponent implements OnInit , AfterViewInit{
  public SubmittedAnswer;
  public QuizBrandingAndStyle;
  public type;
  public data;
  public companycode;
  public addClass= false;
  public quizStatus = {
    status: '',
    data: '',
    companycode: '',
    quizBrandingAndStyle: ''
  }
  public previewCode;
  public isMobileView:boolean=false;
  public isStartQuiz:boolean=false;
  public minHeightInDiv:any;
  public buttonShow:boolean = true;
  public logoImage:string = "";
  public logoBackgroundColor:string = "";
  public defaultCoverImage:any="https://res.cloudinary.com/dbbkqtyqn/image/upload/c_fill,w_200,h_200,g_face,q_auto:best,f_auto/v1588680596/Jobrock/automation-place-holder-corner.png";

  @ViewChild('previewContainer', {read: ElementRef, static: true}) previewContainer: ElementRef;
  constructor(private quizDataService: QuizDataService,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private router: Router,
    private commonService:CommonService) { }
    
  public options;
  ngOnInit() {
    this.commonService.scrollUp();
    this.isMobileView = window.outerWidth < 768 ? true : false;
    this.logoImage = this.quizDataService.logoImage ? this.quizDataService.logoImage : '';
    this.logoBackgroundColor = this.quizDataService.logoBackGroundColor ? this.quizDataService.logoBackGroundColor : '';
    this.options = this.quizDataService.getFroalaOption()
    this.previewCode = this.route.queryParams['value'].QuizCodePreview;
    if(this.previewCode && !this.router.url.match("quiz-preview-mode")){
      this.addClass = true;
      this.renderer.addClass(this.previewContainer.nativeElement, 'preview-popup')
    }
    this.setAnswerImageAndVideoType();
    this.setCorrectAnswerImageAndVideoType();
    this.getScrollSubscription();
  }
  
  ngAfterViewInit(){
    this.setStyling("upperLevelStyle")
    let self = this;
    setTimeout(function(){  
      if(self.isMobileView){
        self.buttonShow = self.commonService.isScrolledIntoView();
      } }, 100);
  }

  getScrollSubscription(){
    this.quizDataService.isScrollSubmissionObservable.subscribe(res => {
      this.onScroll();
    });
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
      data[x].childNodes[1].childNodes[0]['style'].background = this.QuizBrandingAndStyle.BackgroundColor;
      data[x].childNodes[1].childNodes[0]['style'].color = this.QuizBrandingAndStyle.OptionFontColor;
      }
    }
  }
  public answerImageORvideo = [];

  setAnswerImageAndVideoType(){
    for (var i = 0; i < this.SubmittedAnswer.SubmittedAnswerDetails.length; i++) {
      if (this.SubmittedAnswer.SubmittedAnswerDetails[i].SubmittedAnswerImage) {
        let imageORvideo = this.commonService.getImageOrVideo(this.SubmittedAnswer.SubmittedAnswerDetails[i].SubmittedAnswerImage);
        this.answerImageORvideo.push(imageORvideo);
      }else{
        this.answerImageORvideo.push("");
      }
    }
  }

  public correctAnswerImageORvideo = [];
  setCorrectAnswerImageAndVideoType(){
    for (var i = 0; i < this.SubmittedAnswer.CorrectAnswerDetails.length; i++) {
      if (this.SubmittedAnswer.CorrectAnswerDetails[i].CorrectAnswerImage) {
        let imageORvideo = this.commonService.getImageOrVideo(this.SubmittedAnswer.CorrectAnswerDetails[i].CorrectAnswerImage);
        this.correctAnswerImageORvideo.push(imageORvideo);
      }else{
        this.correctAnswerImageORvideo.push("");
      }
    }
  }

   /**
   * When user clicks the button 
   * It is then informed in quiz.component.ts where the subscription to 
   * the behaviour subject determines which component to call
   * 
   * 
   * In this case the data is also send to render a new component either
   * result or question detail component with the data which is send
   */
  next() {
    this.quizStatus.status = this.type;
    this.quizStatus.data = this.data;
    this.quizStatus.companycode = this.companycode;
    this.quizStatus.quizBrandingAndStyle =this.QuizBrandingAndStyle;
    this.quizDataService.nextStepStatus.next(this.quizStatus)
    if(this.type === "result-leadform" || this.type === 'result'){
      this.quizDataService.setQuizBrandingAndStyle(this.QuizBrandingAndStyle);
    }
  }
}
