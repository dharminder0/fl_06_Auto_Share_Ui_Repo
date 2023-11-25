import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizBuilderApiService } from '../../quiz-builder-api.service';
import { FormGroup, FormControl } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { QuizzToolHelper } from '../quiz-tool-helper.service';


@Component({
  selector: 'app-previous-question',
  templateUrl: './previous-question.component.html',
  styleUrls: ['./previous-question.component.css']
})
export class PreviousQuestionComponent implements OnInit {

  public quizId: number;
  public sub;
  public editAnswer;
  public viewPreviousQuestion;
  public previousButtonData;
  public previousButtonForm: FormGroup;
  public applyToAll;


  constructor(private route: ActivatedRoute,
    private quizBuilderApiService: QuizBuilderApiService,
    private notificationsService: NotificationsService,
    private quizToolHelperService :QuizzToolHelper) {}
  
  ngOnInit() {

    /**
     * To Create New Form Instance
     */
    this.previousButtonForm = new FormGroup({
      'QuizId': new FormControl(''),
      'EditAnswer':  new FormControl(''),
      'ViewPreviousQuestion':  new FormControl(''),
      'ApplyToAll':  new FormControl(''),
    });

    /**
     * to Get QuizId from parent routing params
     */
    this.sub = this.route.parent.params.subscribe(param=>{
      this.quizId = +param['id']
    })

    /**
     * Api Integration: To Get Branding Details according to QuizId
     * Patch response Data to the form controls
     */
    this.quizBuilderApiService.getPreviousButtonSetting(this.quizId)
      .subscribe((data) => {
        this.previousButtonData = data;
        this.previousButtonForm.patchValue({
          'QuizId': data.QuizId,
          'ApplyToAll': data.ApplyToAll,
          'EditAnswer' : data.EditAnswer,
          'ViewPreviousQuestion': data.ViewPreviousQuestion,
        })
      this.applyToAll = data.ApplyToAll;
      this.editAnswer = data.EditAnswer;
      this.viewPreviousQuestion = data.ViewPreviousQuestion;
      },(error) => {
        this.notificationsService.error('Error');
      });

    //this.onChanges();
  }

  /** 
   * Change color engine values when Form value changes
  */
  // onChanges(){
  //   this.previousButtonForm.valueChanges
  //   .subscribe((data) => {
  //     this.applyToAll = data.ApplyToAll;
  //     this.editAnswer = data.EditAnswer;
  //     this.viewPreviousQuestion = data.ViewPreviousQuestion;
  //   })
  // }

  onSelect(val) {  
    if (val === 'viewPreviousQuestion') {
      this.viewPreviousQuestion = !this.viewPreviousQuestion;
      if (this.editAnswer) {
        this.editAnswer = false;
      }
    }
    if (val === 'editAnswer') {
      this.editAnswer = !this.editAnswer;
      if (this.viewPreviousQuestion) {
        this.viewPreviousQuestion = false;
      }
    }
    this.previousButtonForm.valueChanges
    .subscribe((data) => {
      data.EditAnswer = this.editAnswer;
      data.ViewPreviousQuestion = this.viewPreviousQuestion;
    })
  }

  /**
   * Api Integration: To Update branding colors and image
   */
  onUpdatePreviousButtonSetting(){
    this.quizBuilderApiService.updatePreviousButtonSetting(this.previousButtonForm.value)
    .subscribe((data) => {
      // this.notificationsService.success('Previous Button', 'Setting has been Updated');
    }, (error) => {
      // this.notificationsService.error('Previous Button Setting', 'Something went wrong');
    });

    this.quizToolHelperService.setPreviousButtonSetting(this.previousButtonForm.value)
  }

}
