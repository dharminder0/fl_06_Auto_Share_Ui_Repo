import { Component, OnInit } from '@angular/core';
import { QuizBuilderApiService } from '../../quiz-builder-api.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { QuizzToolHelper } from '../quiz-tool-helper.service';
import { SharedService } from '../../../shared/services/shared.service';

@Component({
  selector: 'app-redirect-results',
  templateUrl: './redirect-results.component.html',
  styleUrls: ['./redirect-results.component.css']
})
export class RedirectResultsComponent implements OnInit {

  public quizData;
  public resultRedirectForm: FormGroup;
  public originalResult = [];

  constructor(private quizBuilderApiService: QuizBuilderApiService,
    private notificationsService: NotificationsService,
    private _fb: FormBuilder,
    private quizzToolHelper: QuizzToolHelper,
    private sharedService :SharedService) { }

  ngOnInit() {
    /**
     * Create a new Form Instance using FormBuilder
     */

    this.resultRedirectForm = this._fb.group({
      'resultRedirect': this._fb.array([])
    });
    this.originalResult = []

    /**
     * Get the result redirect data list 
     * Api Integration
     */
    this.quizBuilderApiService.getResultRedirectData(this.quizData.QuizId)
      .subscribe((data) => {
        data.forEach((quiz) => {
          (<FormArray>this.resultRedirectForm.get('resultRedirect')).push(this.addNewResultRedirect(quiz))
          this.originalResult.push(quiz)
        });
      }, (error) => {
        this.notificationsService.error('Error');
      })

    this.resultFormChanges()

  }

  resultFormChanges() {
    this.resultRedirectForm.valueChanges
      .subscribe((result) => {
        if (this.originalResult.length) {
          for (var i = 0; i < this.originalResult.length; i++) {
            if (this.originalResult[i].ResultTitle != result.resultRedirect[i].ResultTitle) {
              var resultInfo = {
                ResultId:result.resultRedirect[i].ResultId,
                Title:result.resultRedirect[i].ResultTitle
              }
              this.quizzToolHelper.updateSidebarOptionsResultTitle.next(resultInfo);
            }
          }
        }
      })
  }

  /**
   * 
   * @param quiz Result redirect data
   * create new Form Group according to result redirect data
   */
  addNewResultRedirect(quiz) {
    
    if(quiz.ResultTitle){
    quiz.ResultTitle = this.sharedService.sanitizeData(quiz.ResultTitle)
    }
    return this._fb.group({
      'QuizId': quiz.QuizId,
      'ResultId': quiz.ResultId,
      'ResultTitle': quiz.ResultTitle,
      'IsRedirectOn': quiz.IsRedirectOn,
      'RedirectResultTo': quiz.RedirectResultTo
    });
  }

  /** 
   * Update result redirect data list on click save button
   * api integration
  */
  updateResultRedirect() {
    this.quizBuilderApiService.updateResultRedirectData(this.resultRedirectForm.controls['resultRedirect'].value)
      .subscribe((data) => {
        this.notificationsService.success('Updated Successfully');
      }, (error) => {
        this.notificationsService.error('Error');
      })
  }
}
