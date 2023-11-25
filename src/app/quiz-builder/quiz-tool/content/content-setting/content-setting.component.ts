import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { QuizBuilderApiService } from '../../../quiz-builder-api.service';
import { NotificationsService } from 'angular2-notifications';
import { QuizzToolHelper } from '../../quiz-tool-helper.service';


@Component({
  selector: 'app-content-setting',
  templateUrl: './content-setting.component.html',
  styleUrls: ['./content-setting.component.css']
})

export class ContentSettingComponent implements OnInit {
  @Input() contentId;
  @Input() quizId;
  public questionId: number;
  // public sub;
  public editAnswer;
  public viewPreviousQuestion;
  public previousButtonData;
  public contentSettingForm: FormGroup;
  public autoplay: boolean = true;

  constructor(private route: ActivatedRoute,
    private quizBuilderApiService: QuizBuilderApiService,
    private notificationsService: NotificationsService,
    private quizToolHelperService :QuizzToolHelper) {}
  
  ngOnInit() {
    /**
     * To Create New Form Instance
     */
    this.contentSettingForm = new FormGroup({
      'Id': new FormControl(''),
      'EditAnswer':  new FormControl(''),
      'ViewPreviousQuestion':  new FormControl(''),
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
    this.quizBuilderApiService.getQuizContent(this.contentId,this.quizId)
      .subscribe((data) => {
        this.previousButtonData = data;
        this.contentSettingForm.patchValue({
          'Id': data.Id,
          'EditAnswer' : data.EditAnswer,
          'ViewPreviousQuestion': data.ViewPreviousQuestion,
          'AutoPlay': data.AutoPlay
        })
       
      },(error) => {
        this.notificationsService.error('Error');
      });

    this.onChanges();
  }

  /** 
   * Change color engine values when Form value changes
  */
  onChanges(){
    this.contentSettingForm.valueChanges
    .subscribe((data) => {
      this.editAnswer = data.EditAnswer;
      this.viewPreviousQuestion = data.ViewPreviousQuestion;
      this.autoplay = data.AutoPlay;
      
    })
  }


  /**
   * Api Integration: To Update branding colors and image
   */
  onUpdateContentSetting(){
    this.quizBuilderApiService.updateQuizContentSetting(this.contentSettingForm.value)
    .subscribe((data) => {
      // this.notificationsService.success('Content', 'Setting has been Updated');
    }, (error) => {
      // this.notificationsService.error('Content Setting', 'Something went wrong');
    });

    this.quizToolHelperService.setContentSetting(this.contentSettingForm.value)
  }

}

