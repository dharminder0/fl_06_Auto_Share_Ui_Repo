import { Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy, AfterViewInit, Input, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { QuizDataService } from "../quiz-data.service";
import { QuizApiService } from "../quiz-api.service";

@Component({
  selector: "app-multiple-results",
  templateUrl: "./multiple-results.component.html",
  styleUrls: ["./multiple-results.component.css"]
})
export class MultipleResultsComponent implements OnInit ,OnDestroy, AfterViewInit {
  @Input() public ResultScore;
  @Input() public QuizBrandingAndStyle;
  @Input() public resultLeadForm;
  @Output() isSelectedResultIndex: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('previewContainer', { read: ElementRef , static:true}) previewContainer: ElementRef;
  public previewCode;
  public type;
  public data;
  public companycode;
  public hide:boolean=true;
  public hiddenProperySubscription;
  public quizStatus = {
    status: '',
    data: '',
    index: null,
    appointmentCode:'',
    companycode:'',
    quizBrandingAndStyle:''
  }
  public appointmentCode;
  public publishedCode;
  public completeQuiz;
  public flowOrder;
  public resultDetails;
  public addClass = false;
  public classList =["result-title","next-line-string"];
  public isMobileView:boolean=false;
  public isStartQuiz:boolean=false;
  public leftSlide:boolean=false;

  constructor(private renderer: Renderer2,
  private route: ActivatedRoute,
  private router: Router,
  private quizDataService: QuizDataService,
  private quizApiService: QuizApiService) {}

  public options;
  ngOnInit() {
    this.isMobileView = window.outerWidth < 768 ? true : false;
    if(this.isMobileView){
      let self=this;
      setTimeout(function(){  self.leftSlide = true }, 1000);
    }
    this.options = this.quizDataService.getFroalaOption()
    this.previewCode = this.route.queryParams['value'].QuizCodePreview;
    if (this.previewCode && !this.router.url.match("quiz-preview-mode")) {
      if(this.previewContainer){
        this.renderer.addClass(this.previewContainer.nativeElement, 'preview-popup')
      }
      this.addClass = true;
    }

    this.quizDataService.resultDetailsData
    .subscribe(data => {
      this.resultDetails = data;
    });

    this.hiddenProperySubscription = this.quizDataService.hiddenProperty.subscribe(
      data =>
      {
        this.hide = true;
      }
    );
    if(this.completeQuiz && this.publishedCode){
      this.getAppointmentCode();
    }
  }
  ngAfterViewInit(){
    this.classList.forEach((data) => {
      this.setStyling(data);
    });
  }

  setStyling(elem) {
      var data = document.getElementsByClassName(elem);
      for(var x =0 ; x < data.length ; x++){
        if(data[x].childNodes[1] && data[x].childNodes[1].childNodes[0]){
          data[x].childNodes[1].childNodes[0]['style'].background = this.QuizBrandingAndStyle.BackgroundColor;
          data[x].childNodes[1].childNodes[0]['style'].color = this.QuizBrandingAndStyle.FontColor;
          data[x].childNodes[1].childNodes[0]['style'].fontFamily= this.QuizBrandingAndStyle.FontType;
        }
      }
  }

  showIndividualResult(index){
    if(this.resultLeadForm){
      this.isSelectedResultIndex.emit(index);
    }else{
      if(this.isMobileView){
        this.isStartQuiz=true;
        let self=this;
        setTimeout(function(){ 
          self.next(index);
          self.hide =false;
        }, 1000);
      }else{
        this.next(index);
        this.hide =false;
      }
    }
  }

  /**
   * When user clicks the button 
   * It is then informed in quiz.component.ts where the subscription to 
   * the behaviour subject determines which component to call
   */
  next(index) {
    this.quizStatus.status = "indi-result";
    this.quizStatus.data = this.ResultScore;
    this.quizStatus.index = index;
    this.quizDataService.nextStepStatus.next(this.quizStatus)
    this.quizDataService.setQuizBrandingAndStyle(this.QuizBrandingAndStyle);
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


  ngOnDestroy()
  {
    this.hiddenProperySubscription.unsubscribe();
  }

}
