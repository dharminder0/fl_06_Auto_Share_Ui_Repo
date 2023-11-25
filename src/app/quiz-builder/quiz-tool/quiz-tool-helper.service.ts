import { Injectable, OnInit } from "@angular/core";

import { Subject } from "rxjs";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import * as Rx from "rxjs/BehaviorSubject";

export class QuizzToolHelper implements OnInit{
  constructor() {}

  ngOnInit(){
  }
public quizTypeId;
  /**
   * Subject to focus on the element when hovered on it.
   * E.g When user hovers over the cover image it should be hovered as well in
   * the child route.
   */
  private focusElement = new Subject<any>();
  focus(elementId: any) {
    this.focusElement.next(elementId);
  }

  whenFocus() {
    return this.focusElement.asObservable();
  }

  /**
   * Subject for updating Question Route when user updates SetCorrectAnswerComponent
   */
  private questionDataChange = new Subject<any>();
  updateQuestionData(data: any) {
    this.questionDataChange.next(data);
  }

  whenUpdateQuestionData() {
    return this.questionDataChange.asObservable();
  }

    /**
   * Subject for updating Question Route when user updates SetCorrectAnswerComponent
   */
  public resultDataChange = new Subject<any>();
  updateResultData(data: any) {
    this.resultDataChange.next(data);
  }

  /**
   * Subject when answer added against a particular question
   */
  private quesAdded = new Subject<any>();
  updateAnswerAdded(data: any) {
    this.quesAdded.next(data);
  }

  whenUpdateAnswerAdded() {
    return this.quesAdded.asObservable();
  }

  // set the branding and styling data from cover page resolver

  public styling : any = {};

  setBrandingAndStyling(data)
  {
    // this.styling ={};
    this.styling =
    {
      BackgroundColor: data.BackgroundColor,
      ButtonColor: data.ButtonColor,
      ButtonFontColor: data.ButtonFontColor,
      FontColor: data.FontColor,
      FontType: data.FontType ? data.FontType : "Montserrat",
      ImageFileURL: data.ImageFileURL,
      OptionColor: data.OptionColor,
      OptionFontColor: data.OptionFontColor,
      PublicIdForImageFile: data.PublicIdForImageFile,
      QuizId: data.QuizId,
      Language: data.Language
    };
  }

    public isStylingObservable = new BehaviorSubject(this.styling);

    setBrandingAndStylingSubmission() {
        this.isStylingObservable.next(this.styling);
    }

  public backButtonSetting;
  setPreviousButtonSetting(data)
  {
    // this.styling ={};
    this.backButtonSetting =
    {
          EditAnswer : data.EditAnswer,
          ViewPreviousQuestion: data.ViewPreviousQuestion,   
    };
  }

  getPreviousButtonSetting()
  {
    return this.backButtonSetting;
  }

  public questionSetting;
  setQuestionSetting(data)
  {
    // this.styling ={};
    this.questionSetting =
    {
          EditAnswer : data.EditAnswer,
          ViewPreviousQuestion: data.ViewPreviousQuestion, 
          AutoPlay: data.AutoPlay,  
    };
  }
  getQuestionSetting()
  {
    return this.questionSetting;
  }


  public contentSetting;
  setContentSetting(data)
  {
    // this.styling ={};
    this.contentSetting =
    {
          EditAnswer : data.EditAnswer,
          ViewPreviousQuestion: data.ViewPreviousQuestion, 
          AutoPlay: data.AutoPlay,  
    };
  }

  getCoverSetting()
  {
    return this.coverSetting;
  }
  public coverSetting;
  setCoverSetting(data)
  {
    // this.styling ={};
    this.coverSetting =
    {
          VideoControls: data.ViewControls,   
    };
  }

  getContentSetting()
  {
    return this.contentSetting;
  }

 


  // return the branding and styling data to components

  getBrandingAndStyling()
  {
    return this.styling;
  }

  private quesRemoved = new Subject<any>();
  updateAnswerRemoved(data: any) {
    this.quesRemoved.next(data);
  }

  whenUpdateAnswerRemoved() {
    return this.quesRemoved.asObservable();
  }

  public urlSizeColorDataSubject: Subject<any> = new Subject();
  setUrlSizeColorData(data) {
    this.urlSizeColorDataSubject.next(data);
  }

  /**
   * Update question data change to the sidebar when answertype changed
   */
  public optionDataSubject: Subject<any> = new Subject();
  setQuestionDataWhenAnswerTypeChange(optionData){
    this.optionDataSubject.next(optionData);
  }

  /**
   * Subject when a question/result is clicked on left side bar in quiz too
   *
   */
  private leftSidebarOptionClicked = new Subject<any>();
  updateOptionClicked(data: any) {
    this.leftSidebarOptionClicked.next(data);
  }

  whenUpdateOptionClicked() {
    return this.leftSidebarOptionClicked.asObservable();
  }

  public updateSidebarOptionsQuestionTitle = new Rx.BehaviorSubject(undefined);
  public updateSidebarOptionsResultTitle = new Rx.BehaviorSubject(undefined);
  public updateSidebarOptionsCoverTitle = new Rx.BehaviorSubject(undefined);
  public updateSidebarOptionsActionTitle = new Rx.BehaviorSubject(undefined);
  public updateSidebarOptionsContentTitle = new Rx.BehaviorSubject(undefined);
  public updateSidebarOptionsBadgeTitle = new Rx.BehaviorSubject(undefined);
  public updateSidebarResultRange = new Subject();
  public updatedQuizData = new Rx.BehaviorSubject(undefined);
  public selectedAnswerType = new Rx.BehaviorSubject({});
  public updatedResultRange = new Rx.BehaviorSubject(undefined);
  public updatedAnswerScoredData = new Rx.BehaviorSubject(undefined);
  public updatedMaxScore =new Subject();
  public updateMultipleData =new Rx.BehaviorSubject("");
  public maxScore =new Subject();
  public showLead =new Subject();
  public clientObjectFieldsList:any[] = [];
  clientAtsFieldsList: any = {};
}
