import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { QuizBuilderApiService } from '../../../quiz-builder-api.service';
import { NotificationsService } from 'angular2-notifications';
import { QuizzToolHelper } from '../../quiz-tool-helper.service';


@Component({
  selector: 'app-cover-setting',
  templateUrl: './cover-setting.component.html',
  styleUrls: ['./cover-setting.component.css']
})

export class CoverSettingComponent implements OnInit {

  public questionId: number;
  // public sub;
  public editAnswer;
  public viewPreviousQuestion;
  public previousButtonData;
  public coverSettingForm: FormGroup;
  public videoControls: boolean = true;
  public quizId

  constructor(private route: ActivatedRoute,
    private quizBuilderApiService: QuizBuilderApiService,
    private notificationsService: NotificationsService,
    private quizToolHelperService :QuizzToolHelper) {}
  
  ngOnInit() {
    /**
     * To Create New Form Instance
     */
    this.route.parent.params.subscribe(params => {
      this.quizId = +params["id"];
    });
    this.coverSettingForm = new FormGroup({
      'Id': new FormControl(''),
      'VideoControls': new FormControl('')
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
    this.quizBuilderApiService.getQuizDetails(this.quizId)
      .subscribe((data) => {
        this.previousButtonData = data;
        this.coverSettingForm.patchValue({
          'Id': this.quizId,
          'VideoControls': data.VideoControls
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
    this.coverSettingForm.valueChanges
    .subscribe((data) => {
      this.videoControls = data.VideoControls;    
    })
  }


  /**
   * Api Integration: To Update branding colors and image
   */
  onUpdateContentSetting(){
    this.quizBuilderApiService.updateQuizCoverSetting(this.coverSettingForm.value)
    .subscribe((data) => {
      this.notificationsService.success('Content', 'Setting has been Updated');
    }, (error) => {
      this.notificationsService.error('Content Setting', 'Something went wrong');
    });

    this.quizToolHelperService.setContentSetting(this.coverSettingForm.value)
  }

}

