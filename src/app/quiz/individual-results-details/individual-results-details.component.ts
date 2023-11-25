import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  AfterViewInit,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { QuizDataService } from "../quiz-data.service";
import { Router, ActivatedRoute } from "@angular/router";
import { QuizApiService } from "../quiz-api.service";

@Component({
  selector: "app-individual-results-details",
  templateUrl: "./individual-results-details.component.html",
  styleUrls: ["./individual-results-details.component.css"]
})
export class IndividualResultsDetailsComponent implements OnInit,AfterViewInit {
  @Input() public ResultScore;
  @Input() public QuizBrandingAndStyle;
  @Input() public index;
  @Input() public resultLeadForm;
  @Output() isBackMultiResult: EventEmitter<any> = new EventEmitter<any>();
  public individualResultData;
  public multiResultComponentRef;
  @ViewChild("previewContainer", { read: ElementRef, static:true })
  previewContainer: ElementRef;
  public previewCode;
  public type;
  public data;
  public companycode;
  public resultDetails;
  public quizStatus = {
    status: "",
    data: "",
    quizBrandingAndStyle: {}
  };
  public addClass = false;
  public isMobileView:boolean=false;

  constructor(
    private quizDataService: QuizDataService,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router :Router,
    private quizApiService: QuizApiService
  ) {}

  public options;
  ngOnInit() {
    this.isMobileView = window.outerWidth < 768 ? true : false;
    this.options = this.quizDataService.getFroalaOption();
    this.individualResultData = this.ResultScore.PersonalityResultList[this.index];
    if(!this.QuizBrandingAndStyle){
      this.QuizBrandingAndStyle = this.quizApiService.attemptQuizSetting.QuizBrandingAndStyle;
    }
    this.previewCode = this.route.queryParams["value"].QuizCodePreview;
    if (this.previewCode && !this.router.url.match("quiz-preview-mode")) {
      this.addClass =true;
      if(this.previewContainer){
        this.renderer.addClass(this.previewContainer.nativeElement,"preview-popup");
      }
    }
    this.quizDataService.resultDetailsData.subscribe(data => {
      this.resultDetails = data;
    });
  }

  ngAfterViewInit(){
      this.setStyling('next-line-string');
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

  onDestroyIndividualResult(){
    this.quizDataService.hiddenProperty.next(true);
    this.multiResultComponentRef.destroy();
  }

  onBackMultipleResult(){
    this.isBackMultiResult.emit();
  }

}
