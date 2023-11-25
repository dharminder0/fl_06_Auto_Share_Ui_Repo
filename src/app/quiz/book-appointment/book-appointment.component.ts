import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../shared/loader-spinner';
import { Config } from '../../../config';
import { QuizDataService } from '../quiz-data.service';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.scss']
})
export class BookAppointmentComponent implements OnInit {

  public appointmentCode;
  public QuizBrandingAndStyle;
  public Url: string = "";
  public config = new Config();
  public isMobileView:boolean=false;
  public leftSlide:boolean=false;
  public quizStatus = {
    status: '',
    data: '',
    quizBrandingAndStyle: ''
  };
  public ResultScore;
  public flowOrder;
  public isBookingSlotEnable:boolean = false;
  public isLoaderEnable:boolean = false;
  public iframeHeight;
  public isSetIframeHeight:boolean = true;
  public isHoveredOnButton = false;

  constructor(private quizDataService: QuizDataService,
    private loaderService: LoaderService,
    private commonService:CommonService) { }

  ngOnInit() {
    this.commonService.scrollUp();
    this.loaderService.show();
    this.isLoaderEnable = true;
    this.isMobileView = window.outerWidth < 768 ? true : false;
    if(this.isMobileView){
      let self=this;
      setTimeout(function(){  self.leftSlide = true }, 1000);
    }
    if(this.isSetIframeHeight){
      this.iframeHeight = window.innerHeight * (90 / 100);
    }
    let self=this;
    // get user info
    if (window.addEventListener) {
      window.addEventListener("message", onMessage, false);        
  } 
  function onMessage(event) {
      // Check sender origin to be trusted
      if (event.origin == self.config.appointmentSlotUrl){
        let data = event.data;
        self.isBookingSlotEnable = data.isSlotBook;
        self.loaderService.hide();
        if(data.message == 'loader'){
          self.isLoaderEnable = false;
        }
        if(data.isSlotSelected){
          self.quizDataService.createDataLayer('jr_Automation_Event_Slot_Select',self.QuizBrandingAndStyle.QuizId,'');
        }
        if(data.isSlotBook){
          self.quizDataService.createDataLayer('jr_Automation_Event_Booked',self.QuizBrandingAndStyle.QuizId,'');
        }
      }
  }
  let appointmentStyle:any = {
    "quiz_FontColor": this.QuizBrandingAndStyle.FontColor,
    "quiz_BackgroundColor":this.QuizBrandingAndStyle.BackgroundColor,
    "quiz_FontType":this.QuizBrandingAndStyle.FontType,
    "quiz_BackgroundColorofSelectedAnswer":this.QuizBrandingAndStyle.BackgroundColorofSelectedAnswer,
    "quiz_BackgroundColorofAnsweronHover":this.QuizBrandingAndStyle.BackgroundColorofAnsweronHover,
    "quiz_ButtonColor":this.QuizBrandingAndStyle.ButtonColor,
    "quiz_ButtonHoverColor":this.QuizBrandingAndStyle.ButtonHoverColor,
    "quiz_ButtonFontColor":this.QuizBrandingAndStyle.ButtonFontColor,
    "quiz_ButtonHoverTextColor":this.QuizBrandingAndStyle.ButtonHoverTextColor
  };
  let quizStyle = JSON.stringify(appointmentStyle);
  quizStyle = encodeURIComponent(quizStyle);
    this.Url = `${this.config.appointmentSlotUrl}/slots?AppointmentCode=${this.appointmentCode}&isExternal=true&lang=${this.QuizBrandingAndStyle.Language}&isExternalStyle=${quizStyle}`;
  }

  CalculateHeight() {
    return window.innerHeight * (90 / 100);
  }

  calculateMinHeight() {
    return window.innerHeight * (80 / 100);
  }
  
  close(){
    this.quizStatus.status = 'result';
    this.quizStatus.data = this.ResultScore;
    this.quizStatus.quizBrandingAndStyle = this.QuizBrandingAndStyle;
    this.quizDataService.nextStepStatus.next(this.quizStatus)
  }

}