import { Injectable } from "@angular/core";
import { QuizzToolHelper } from "./quiz-tool-helper.service";
import { Subscription } from "rxjs/Subscription";
import { QuizBuilderApiService } from "../quiz-builder-api.service";

@Injectable()
export class ResultRangeDataFactory {
  public updateQuestionAndResult;
  public resultRangeSubscription: Subscription;
  public quizData;
  public quizDataSubscription;
  public deletedResultIndex: number = 0;
  constructor(
    private quizToolHelper: QuizzToolHelper,
    private quizBuilderApiService: QuizBuilderApiService
  ) {}

  setQuizData() {
    this.quizDataSubscription = this.quizToolHelper.updatedQuizData.skip(1).subscribe(
      quizData => {
        this.quizData = quizData;
        // this.quizToolHelper.updatedAnswerScoredData.next("");
        // this.quizToolHelper.updatedResultRange.next("");
      }
    );
    this.resultRangeSubscription = this.quizToolHelper.updateSidebarResultRange.subscribe(
      data => {
        this.updateResultRangedata(data);
      }
    );
  }

  updateResultRangedata(type) {
    switch (type) {
      case "Add-Question":
        this.updateRangeOnAddQuestion(this.quizData.Results);
        break;
      case "Add-Result":
        this.updatedRangeOnAddResult(this.quizData.Results);
        break;
      case "Remove-Question":
        this.updateRangeOnRemoveQuestion(this.quizData.Results);
        break;
      case "Remove-Result":
        this.updatedRangeOnRemoveResult(this.quizData.Results);
        break;
      default:
        this.updateDefaultRange();
    }
  }

  updateRangeOnAddQuestion(resultData) {
    let isAnyResultRangeEmpty = false;
    for(let i=0; i<resultData.length; i++){
      if(resultData[i].MaxScore === null && resultData[i].MinScore === null){
        resultData[i].MaxScore = resultData[i].MinScore = this.quizData.QuestionsInQuiz.length;
        isAnyResultRangeEmpty = true;
        break;
      }
    }

    if(!isAnyResultRangeEmpty){
      resultData[resultData.length-1].MaxScore++;
    }
    this.updateResultRangeApi(this.quizData.Results);
  }

  updatedRangeOnAddResult(resultData) {
    let isRangeRemoved = false;
    let changedResultIndex = 0;
    let maxScore = resultData[resultData.length - 2].MaxScore;
    let changedMaxData = 0;
    for (let i = resultData.length - 2; i >= 0; i--) {
      if (resultData[i].MaxScore - resultData[i].MinScore > 0) {
        isRangeRemoved = true;
        changedMaxData = resultData[i].MaxScore;
        resultData[i].MaxScore--;
        changedResultIndex = i;
        break;
      }
    }
    if(changedMaxData){
      for (let j = changedResultIndex + 1; j < resultData.length - 1; j++) {
        resultData[j].MinScore = changedMaxData;
        resultData[j].MaxScore = changedMaxData;
        changedMaxData++;
      }
    }
    if (isRangeRemoved) {
      resultData[resultData.length - 1].MaxScore = resultData[
        resultData.length - 1
      ].MinScore = maxScore;
    }else {
      resultData[resultData.length - 1].MaxScore = resultData[
        resultData.length - 1
      ].MinScore = null;
    }
    this.updateResultRangeApi(this.quizData.Results);
  }

  updateRangeOnRemoveQuestion(resultData) {
    let isRangeRemoved = false;
    let changedResultIndex = null;
    for (let i = resultData.length - 1; i >= 0; i--) {
      if (resultData[i].MaxScore - resultData[i].MinScore > 0) {
        isRangeRemoved = true;
        resultData[i].MaxScore--;
        changedResultIndex = i;
        break;
      }
    }
    if(this.quizData.QuestionsInQuiz.length+1 >= resultData.length){
      for (let j = changedResultIndex + 1; j < resultData.length; j++) {
        resultData[j].MinScore--;
        resultData[j].MaxScore--;
      }
      if (!isRangeRemoved) {
        for (let k = resultData.length - 1; k > 0; k--) {
          if (resultData[k].MaxScore != null) {
            resultData[k].MaxScore = null;
          }
          if (resultData[k].MinScore != null) {
            resultData[k].MinScore = null;
          }
        }
      }
    }else{
      resultData[this.quizData.QuestionsInQuiz.length+1].MaxScore = resultData[this.quizData.QuestionsInQuiz.length+1].MinScore = null;
    }
    this.updateResultRangeApi(this.quizData.Results);
  }

  updatedRangeOnRemoveResult(resultData) {
    if(resultData[this.deletedResultIndex].MinScore !== null && resultData[this.deletedResultIndex].MaxScore !== null){
      if(this.deletedResultIndex === resultData.length-1){
        resultData[this.deletedResultIndex-1].MaxScore = resultData[this.deletedResultIndex].MaxScore;
      }else{
        if(resultData[this.deletedResultIndex+1].MaxScore === null && resultData[this.deletedResultIndex+1].MinScore === null){
          resultData[this.deletedResultIndex+1].MaxScore = resultData[this.deletedResultIndex].MaxScore;
          resultData[this.deletedResultIndex+1].MinScore = resultData[this.deletedResultIndex].MinScore;
        }else{
          resultData[this.deletedResultIndex+1].MinScore = resultData[this.deletedResultIndex].MinScore;
        }
      }
    }
    this.updateResultRangeApi(this.quizData.Results);
  }

  updateDefaultRange() {
  }

  updateResultRangeApi(resultRangeData) {
    let resultRangeBody = {
      QuizId: this.quizData.QuizId,
      Results: resultRangeData
    };
    this.quizBuilderApiService
      .updateResultRangeData(resultRangeBody)
      .subscribe(data => {
      });
  }

  removeSubscriptionEvent() {
    this.resultRangeSubscription.unsubscribe();
    this.quizDataSubscription.unsubscribe();
  }
}