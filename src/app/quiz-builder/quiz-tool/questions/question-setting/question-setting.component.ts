import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { QuizBuilderApiService } from '../../../quiz-builder-api.service';
import { NotificationsService } from 'angular2-notifications';
import { QuizzToolHelper } from '../../quiz-tool-helper.service';
import { UserInfoService } from '../../../../shared/services/security.service';


@Component({
  selector: 'app-question-setting',
  templateUrl: './question-setting.component.html',
  styleUrls: ['./question-setting.component.css']
})

export class QuestionSettingComponent implements OnInit, AfterViewInit {

  @Input() questionId: any;
  @Input() isQuestionEnable:boolean;
  @Input() quizId:any;
  // public sub;
  public editAnswer: boolean = false;
  public viewPreviousQuestion: boolean = false;
  public timerRequired: boolean = false;
  public time = '';
  public questionSettingForm: FormGroup;
  public answerType: number;
  public Hours: Array<any> = [{ value: '0' + String(0), label: '0' + String(0) }, { value: '0' + String(1), label: '0' + String(1) }];
  public MinutesArray: Array<any> = [];
  public SecondsArray: Array<any> = [];
  public hours = '00';
  public minutes = '00';
  public seconds = '00';
  public previousButtonData: boolean = false;
  public autoplay: boolean = true;
  public userInfo:any={};
  public language;

  constructor(private route: ActivatedRoute,
    private quizBuilderApiService: QuizBuilderApiService,
    private notificationsService: NotificationsService,
    private quizToolHelperService: QuizzToolHelper,
    private userInfoService: UserInfoService) { }

  ngOnInit() {
    this.AddtoArray(this.MinutesArray, this.hours ? 30 : 60);
    this.AddtoArray(this.SecondsArray, 60)
    /**
     * To Create New Form Instance
     */
    this.questionSettingForm = new FormGroup({
      'QuestionId': new FormControl(''),
      'EditAnswer': new FormControl(''),
      'ViewPreviousQuestion': new FormControl(''),
      'TimerRequired': new FormControl(''),
      'Time': new FormControl(''),
      'AutoPlay': new FormControl('')
    });

    /**
     * to Get QuestionId from parent routing params
     */
    // this.sub = this.route.parent.params.subscribe(param=>{
    //   this.questionId = +param['QuestionId']
    // })

    /**
     * Api Integration: To Get Branding Details according to QuestionId
     * Patch response Data to the form controls
     */
    this.quizBuilderApiService.getQuestionDetails(this.questionId,this.quizId)
      .subscribe((data) => {
        this.previousButtonData = data;
        this.answerType = data.AnswerType;
        this.editAnswer = data.EditAnswer;
        this.viewPreviousQuestion = data.ViewPreviousQuestion;
        this.timerRequired = data.TimerRequired;
        data.Time ? this.CountDownDropdown(data.Time) : "";
        this.autoplay = data.AutoPlay;

        this.questionSettingForm.patchValue({
          'QuestionId': data.QuestionId,
          'EditAnswer': data.EditAnswer,
          'ViewPreviousQuestion': data.ViewPreviousQuestion,
          'TimerRequired': data.TimerRequired,
          'Time': data.Time,
          'AutoPlay': data.AutoPlay
        });
      }, (error) => {
        this.notificationsService.error('Error');
      });
     this.userInfo = this.userInfoService._info;
     if(this.userInfo)
     {
       this.language = this.userInfo.ActiveLanguage
     }
    // this.onChanges();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      if (!(parseInt(this.hours)) && !(parseInt(this.minutes)) && !(parseInt(this.seconds))) {
        this.timerRequired ? document.getElementById("myBtn")['disabled'] = true : document.getElementById("myBtn")['disabled'] = false
      }
    }, 1000)

  }

  CountDownDropdown(time) {

    document.getElementById("myBtn")['disabled'] = false;
    var tempTimeVal = time.split(':');
    this.hours = tempTimeVal[0]
    this.minutes = tempTimeVal[1]
    this.seconds = tempTimeVal[2]
    if ((parseInt(this.hours))) {
      this.MinutesArray.length = 0;
      this.AddtoArray(this.MinutesArray, this.hours ? 30 : 60);
    }
  }

  /** 
   * Change color engine values when Form value changes
  */
  onChanges(val) {    
    // toggling and updating values 
    if (val === 'viewPreviousQuestion') {
      document.getElementById("myBtn")['disabled'] = false;
      this.viewPreviousQuestion = !this.viewPreviousQuestion;
      if (this.editAnswer) {
        this.editAnswer = false;
      } if (this.timerRequired) {
        this.timerRequired = !this.timerRequired
      }
    }
    if (val === 'editAnswer') {
      document.getElementById("myBtn")['disabled'] = false;
      this.editAnswer = !this.editAnswer;
      if (this.viewPreviousQuestion) {
        this.viewPreviousQuestion = false;
      } if (this.timerRequired) {
        this.timerRequired = !this.timerRequired
      }
    }
    if (val === 'TimerRequired') {
      this.timerRequired = !this.timerRequired
      if(this.timerRequired){
      this.checkForTimerValues();
      }
      // document.getElementById("myBtn")['disabled'] = false;
      if (this.editAnswer) {
        this.editAnswer = false;
      } if (this.viewPreviousQuestion) {
        this.viewPreviousQuestion = false;
      }
    }
    if (val === 'AutoPlay') {
        document.getElementById("myBtn")['disabled'] = false;
        this.autoplay = !this.autoplay;
      }
    this.questionSettingForm.valueChanges
      .subscribe((data) => {
        data.EditAnswer = this.editAnswer;
        data.ViewPreviousQuestion = this.viewPreviousQuestion;
        data.TimerRequired = this.timerRequired;
        data.AutoPlay = this.autoplay;
      })
  }
  // for button disable and enable property and changing dropdown list options
  ButtonDisableProperty() {
    // for dropdown list update 
    if (parseInt(this.hours)) {
      this.MinutesArray = [];
      this.AddtoArray(this.MinutesArray, 30);
    } else if (!parseInt(this.hours)) {
      this.MinutesArray = [];
      this.AddtoArray(this.MinutesArray, 60);
    }
    this.checkForTimerValues();
  }
  // for button enable disable  
  checkForTimerValues() {
    if(this.timerRequired){
    if (parseInt(this.hours) || parseInt(this.minutes) || parseInt(this.seconds)) {
      document.getElementById("myBtn")['disabled'] = false;
    } else { 
      document.getElementById("myBtn")['disabled'] = true;
    }
  }
  }
  // for dropdown values of ng-select in timer  

  AddtoArray(array, n) {
    for (let i = 0; i < n; i++) {
      if (i < 10) {
        array.push({
          value: '0' + String(i),
          label: '0' + String(i)
        })
      } else {
        array.push({
          value: String(i),
          label: String(i)
        })
      }
    }
  }
  /**
   * Api Integration: To Update branding colors and image
   */
  onUpdateQuestionSetting() {
    this.questionSettingForm.patchValue({
      'Time': (this.editAnswer || this.viewPreviousQuestion) ? null : this.hours + ':' + this.minutes + ':' + this.seconds
      // 'AnswerType': data.AnswerType,
    });

    this.quizBuilderApiService.updateQuizQuestionSetting(this.questionSettingForm.value)
      .subscribe((data) => {
        this.notificationsService.success(this.language == 'en-US' ? "Question" : "Vraag", this.language == 'en-US'? "Changes are saved" : "Wijzigingen opgeslagen");
      }, (error) => {
        this.notificationsService.error('Question Setting', 'Something went wrong');
      });

    this.quizToolHelperService.setPreviousButtonSetting(this.questionSettingForm.value)
  }

}

