import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { QuizBuilderApiService } from '../../../quiz-builder-api.service';
import { QuizzToolHelper } from '../../quiz-tool-helper.service';
import { SharedService } from '../../../../shared/services/shared.service';
import { DynamicMediaReplaceMentsService } from '../../dynamic-media-replacement';
import { rightMenuEnum } from '../../rightmenu-enum/rightMenuEnum';
@Component({
  selector: 'app-set-correct-answer',
  templateUrl: './set-correct-answer.component.html',
  styleUrls: ['./set-correct-answer.component.css']
})
export class SetCorrectAnswerComponent implements OnInit {

  //questionData is from the instance of dynamic component
  @Output() editBranchingData: EventEmitter<any> = new EventEmitter<any>();
  public questionData: any;
  public answerTypeData: number;
  public setCorrectAnswerForm: FormGroup;
  public _correctAnswerArray = []
  public quizTypeID;
  public quizID;
  public maxAnswerSubscription;
  public isOpenBranchingLogicSide;
  public isWhatsappEnable: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private quizBuilderApiService: QuizBuilderApiService,
    private quizzToolHelper:QuizzToolHelper,
    private sharedService : SharedService,
    private dynamicMediaReplaceService:DynamicMediaReplaceMentsService) {}

  ngOnInit() {
    if(this.questionData.AnswerList){
    this.questionData.AnswerList.forEach(element => {
      if(element.AnswerText){
      element.AnswerText = this.sharedService.sanitizeData(element.AnswerText);
    }
    });
  }
    if(this.quizzToolHelper.quizTypeId){
      this.quizTypeID = this.quizzToolHelper.quizTypeId;
    }else if(this.questionData.Type){
      this.quizTypeID = this.questionData.Type;
    }
    this.createForm(this.questionData);
    this.getFormArrayData();
    this.findAndPatchCorrectAnswerId();
    this.quizID = this.quizBuilderApiService.quizId;
  }

  /**
 * Function to create Form
 */
  private createForm(data) {
    this.setCorrectAnswerForm = this._fb.group({
      QuestionId: [data.QuestionId ? data.QuestionId : '', [Validators.required]],
      CorrectAnswerId: [data.CorrectAnswerId ? data.CorrectAnswerId : ''],
      CorrectAnswerIdArray: this._fb.array([]),
      CorrectAnswerExplanation: [data.CorrectAnswerExplanation ? data.CorrectAnswerExplanation : ''],
      RevealCorrectAnswer: [data.RevealCorrectAnswer ? data.RevealCorrectAnswer : false],
      AliasTextForCorrect: [data.AliasTextForCorrect ? data.AliasTextForCorrect : ''],
      AliasTextForIncorrect: [data.AliasTextForIncorrect ? data.AliasTextForIncorrect : ''],
      AliasTextForYourAnswer: [data.AliasTextForYourAnswer ? data.AliasTextForYourAnswer : ''],
      AliasTextForCorrectAnswer: [data.AliasTextForCorrectAnswer ? data.AliasTextForCorrectAnswer : ''],
      AliasTextForExplanation: [data.AliasTextForExplanation ? data.AliasTextForExplanation : ''],
      AliasTextForNextButton: [data.AliasTextForNextButton ? data.AliasTextForNextButton : ''],
      AnswerType: [data.AnswerType ? data.AnswerType : '1'],
      AnswerScoreRequestData: this._fb.array([]),
      MinAnswer: [data.MinAnswer ? data.MinAnswer : 0, [Validators.min(0), Validators.max(data.AnswerList.length)]],
      MaxAnswer: [data.MaxAnswer ? data.MaxAnswer : 0, [Validators.min(0), Validators.max(data.AnswerList.length)]]
    });
    this.createAnswerFormArray(data.AnswerList);
  }

  createAnswerFormArray(answerList){
    answerList.forEach((answer) => {
      if(answer.IsCorrectAnswer){
        this._correctAnswerArray.push(true);
      (<FormArray>this.setCorrectAnswerForm.get('CorrectAnswerIdArray')).push(this.createAnswerFormControl(answer));
      }else {
        this._correctAnswerArray.push(false);
      }      
    })
  }

  createAnswerFormControl(answer){
    return this._fb.group({
      answerId: answer.AnswerId,
      AnswerType :[answer.AnswerType ? answer.AnswerType :1],
      AnswerScoreRequestData: this._fb.array([])
    });
  }

// getting form array data for scored type Quiz
getFormArrayData()
{
  for(var i=0;i<this.questionData.AnswerList.length;i++)
  {
    var z;
    if(this.questionData.AnswerList[i].AssociatedScore)
    {
      z= this.questionData.AnswerList[i].AssociatedScore;
    }
    else{
      z=0;
    }
    let control = new FormGroup({
      "AnswerId" : new FormControl(this.questionData.AnswerList[i].AnswerId),
      "AssociatedScore" :new FormControl(z)
    });
    (<FormArray>this.setCorrectAnswerForm.get('AnswerScoreRequestData')).push(control);
  }
}
// incementing and decrementng the Input Field

    decrement(index)
    {
      var y = this.setCorrectAnswerForm.value.
      AnswerScoreRequestData[index].AssociatedScore;

    ((this.setCorrectAnswerForm.controls.AnswerScoreRequestData as FormArray)
      .controls[index] as FormGroup).patchValue({
    AssociatedScore  :y-1
    });
    }

    increment(index)
    {
      var y = this.setCorrectAnswerForm.value.
      AnswerScoreRequestData[index].AssociatedScore;

    ((this.setCorrectAnswerForm.controls.AnswerScoreRequestData as FormArray)
      .controls[index] as FormGroup).patchValue({
    AssociatedScore  :y+1
    }); 
    }
  /**
   * Function to patch CorrectAnswerId
   */
  findAndPatchCorrectAnswerId(){
    var correctAnswerId = [],
        anslistArr = this.questionData.AnswerList,
        anslength = this.questionData.AnswerList.length;
    
    for(var i = 0; i < anslength ; i ++){
      if(anslistArr[i].IsCorrectAnswer){
        correctAnswerId = anslistArr[i].AnswerId;
        break;
      }
    }
    // this.patchCorrectAnswerId(correctAnswerId);
  }
  /**
   * Function to patch CorrectAnswerId
   */
  patchCorrectAnswerId(answerId, index){
    var _isAnswerAlreadyExist = this.removeExistingAnswerId(answerId);
    if(!_isAnswerAlreadyExist){
      this.addMoreAnswerId(answerId);
    }
    if(this.answerTypeData === 1){
      for(let i =0; i<this._correctAnswerArray.length; i++){
        this._correctAnswerArray[i] = false;
      }      
      this._correctAnswerArray[index] = true;
    }else if(this.answerTypeData === 2){
      this._correctAnswerArray[index] = !this._correctAnswerArray[index];
    }
  }

  addMoreAnswerId(answerId){
    (<FormArray>this.setCorrectAnswerForm.get('CorrectAnswerIdArray')).push(
      this._fb.group({
        answerId: answerId
      })
    )
  }

  removeExistingAnswerId(answerId){
    var answerListArray = this.setCorrectAnswerForm.controls['CorrectAnswerIdArray'].value;
    if(this.answerTypeData === 1){
      answerListArray.forEach((answer, index) => {
        (<FormArray>this.setCorrectAnswerForm.get('CorrectAnswerIdArray')).removeAt(index);
      });
      return false;
    }else if(this.answerTypeData === 2){
      var answerIndex = answerListArray.findIndex((answer) => {
        return answerId == answer.answerId;
      });
      if(answerIndex >= 0){
        (<FormArray>this.setCorrectAnswerForm.get('CorrectAnswerIdArray')).removeAt(answerIndex);
        return true;
      }
      return false;
    }  
  }

  /**
   * Function to save the Question Set correct answer and
   * trigger the Parent QuestionsComponent to update Data via subject
   */
  save() {
    var _correctAnswerIdArray=[];
    this.setCorrectAnswerForm.controls['CorrectAnswerIdArray'].value.forEach((ans) => {
      _correctAnswerIdArray.push(ans.answerId)
    });
    this.setCorrectAnswerForm.patchValue({
      CorrectAnswerId: _correctAnswerIdArray
    });

    if(this.quizTypeID != 3){
      this.quizBuilderApiService.updateQuizCorrectAnswerSetting(this.setCorrectAnswerForm.value).subscribe((data)=>{
        if(this.isOpenBranchingLogicSide){
          this.editBranchingData.emit(true);
        }
        if(this.quizTypeID == 4){
          this.quizzToolHelper.updatedResultRange.next(this.setCorrectAnswerForm.value);
          this.quizzToolHelper.updatedAnswerScoredData.next(this.setCorrectAnswerForm.value);
        }else{
          this.quizzToolHelper.updateQuestionData(this.setCorrectAnswerForm.value);
        }
      })
    }
  }

  onClose(){
    if(this.dynamicMediaReplaceService.isOpenEnableMediaSetiing.isOpen == true){
      this.dynamicMediaReplaceService.isOpenEnableMediaSetiing={
          "isOpen":false,
          "menuType":rightMenuEnum.DynamicMedia
      };
      this.dynamicMediaReplaceService.changeOpenEnableMediaSetiingSubmission();
    }
  }

}
