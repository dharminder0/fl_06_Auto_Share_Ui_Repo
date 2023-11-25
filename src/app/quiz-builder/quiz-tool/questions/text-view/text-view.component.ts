import { Component, OnInit, Input,AfterViewInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
import { QuizBuilderApiService } from '../../../quiz-builder-api.service';
import { FormArrayName, FormArray, FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { QuizzToolHelper } from '../../quiz-tool-helper.service';
import { FroalaEditorOptions } from '../../../email-sms/template-body/template-froala-options';
import { UserInfoService } from '../../../../shared/services/security.service';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { answerTypeEnum, QuizAnswerStructureType } from '../../commonEnum';
import { CommonService } from '../../../../shared/services/common.service';
import { VariablePopupService } from '../../../../shared/services/variable-popup.service';
import { ActivatedRoute } from '@angular/router';
import { BranchingLogicAuthService } from '../../branching-logic-auth.service';
import { Config } from '../../../../../config';
declare var $: any;
@Component({
  selector: 'app-text-view',
  templateUrl: './text-view.component.html',
  styleUrls: ['./text-view.component.scss']
})

export class TextViewComponent implements OnInit, OnDestroy, OnChanges {
  @Input() isOpenBranchingLogicSide;
  @Output() isAddRemoveAnser: EventEmitter<any> = new EventEmitter<any>();
  @Input() form: FormGroup;
  public _answerTypeNum: number = 1;
  @Input() set answerType(ansType: number){
    this._answerTypeNum = ansType;
  }
  @Input() answerStructureType: number; 
  @Input() isWhatsappEnable: boolean;
  @Input() clientAtsFieldsObj:any;
  public inputMaxLength: number;

  @Output() onTextChange: EventEmitter<any> = new EventEmitter<any>();
  public froalaEditorOptions = new FroalaEditorOptions();
  // public valueChangesSubscription

  @Output() anserTag: EventEmitter<any> = new EventEmitter<any>();

  @Output() answerReorderObj: EventEmitter<any> = new EventEmitter<any>();
  public brandingColor;
  public options : object ;
  public classList =["ans"];
  public userInfo: any = {};
  public isTagPremission:boolean = false;
  public language;
  public dragulaSubscription;
  public reOrderList:any = [];
  private isStylingSubscription: Subscription;
  public isDisableAddAnswer:boolean = false;  
  private isAnswerTypeObservableSubscription: Subscription;
  public get quizAnswerStructureType(): typeof QuizAnswerStructureType {
    return QuizAnswerStructureType;
  }
  public isQuesAndContentInSameTable:boolean;
  public IsBranchingLogicEnabled:boolean;
  public config = new Config();
  public isVeriablePopupType:any;
  clientAtsFieldsList:any = {};

  constructor(
    private quizBuilderApiService: QuizBuilderApiService,
    private notificationsService: NotificationsService,
    private quizzToolHelper: QuizzToolHelper,
    private userInfoService: UserInfoService,
    private _fb: FormBuilder,
    private dragulaService: DragulaService,
    private commonService: CommonService,
    private variablePopupService: VariablePopupService,
    private route: ActivatedRoute,
    private branchingLogicAuthService: BranchingLogicAuthService,
    ) {

      this.clientAtsFieldsList = JSON.parse(JSON.stringify(this.quizzToolHelper.clientAtsFieldsList));

    const answerBag: any = this.dragulaService.find('answer-bag');
    if (answerBag !== undefined ) this.dragulaService.destroy('answer-bag');
    this.dragulaService.setOptions('answer-bag', { revertOnSpill: true }); 
    this.dragulaSubscription = dragulaService.dropModel.subscribe((value:any) => {
        this.onDropModel(value);
    });

    this.dragulaService.drag.subscribe(value => {
     let ansDrag = document.getElementsByClassName('ans-drag');
     if(ansDrag && ansDrag.length > 0){
      $(`.ans-drag`).css("display", `none`);
     }
     $(`#ans-drag .fr-toolbar`).css("display", `none`);
    });

    this.dragulaService.over.subscribe(value => {
      let ansDrag = document.getElementsByClassName('ans-drag');
      if(ansDrag && ansDrag.length > 0){
       $(`.ans-drag`).css("display", `none`);
      }
      $(`#ans-drag .fr-toolbar`).css("display", `none`);
     });

    this.dragulaService.out.subscribe(value => {
      let ansDrag = document.getElementsByClassName('ans-drag');
      if(ansDrag && ansDrag.length > 0){
       $(`.ans-drag`).css("display", `inherit`);
      }
    });

  }

  private onDropModel(args:any) {
    if(args && args.length > 0 && args.includes('answer-bag')){
      this.reOrderingAnswerList();
    }
  }

  reOrderingAnswerList(){
    this.reOrderList = [];
    if(this.getAnswerListControl(this.form) && this.getAnswerListControl(this.form).length > 0){
      this.getAnswerListControl(this.form).map((group,index) => {
        this.reOrderList.push({
          "DisplayOrder" : index + 1,
          "AnswerId":group.controls.AnswerId.value
        });
      });
    }
    let paramObj = {
      'QuestionId': this.form.controls.QuestionId.value,
      'Answers':this.reOrderList
    }
    this.answerReorderObj.emit(paramObj);
  }

  ngOnInit() { 
    this.userInfo = this.userInfoService._info;
    if(this.userInfo){
      this.language = this.userInfo.ActiveLanguage;
    }
    this.isTagPremission = this.userInfo.IsContactTagsPermission;
    // this.onAnswerTextChange()
    this.options = this.froalaEditorOptions.setEditorOptions(1000);
    // this.onQuestionTitleTextChanges()

    this.setAnswerInputMaxLength();

    this.getBrandingColors();

    this.IsBranchingLogicEnabled = this.branchingLogicAuthService.getBranchingLogicEnable();
    if(this.IsBranchingLogicEnabled){
      this.route.data.subscribe((data) => {
        this.isQuesAndContentInSameTable = data["quizData"].IsQuesAndContentInSameTable;
      });
    }else{
      this.route.parent.parent.data.subscribe((data) => {
        this.isQuesAndContentInSameTable = data["quizData"].IsQuesAndContentInSameTable;
      });
    }
  }

  setAnswerInputMaxLength(){    
    this.isDisableAddAnswer = true;
    switch (this.answerStructureType) {
      case QuizAnswerStructureType.button:
        this.inputMaxLength = 20;     
        break;

      case QuizAnswerStructureType.list:
        this.inputMaxLength = 24;        
        break;
    
      default:
        this.options = this.froalaEditorOptions.setEditorOptions(1000);
        this.isDisableAddAnswer = false;
        break;
    }
  }

  getBrandingColors(){
    this.isStylingSubscription = this.quizzToolHelper.isStylingObservable.subscribe((data) => {
      if(data && Object.keys(data).length > 0){
         this.brandingColor = data
      }
      else{
        this.brandingColor = this.quizzToolHelper.getBrandingAndStyling();
      }
   })
  }

  ngAfterViewInit(){
    this.appyStylingToFroala();
  }

  appyStylingToFroala(){
    if(this.form.value.AnswerList){
      this.form.value.AnswerList.forEach(element => {
        this.setStyling(element.AnswerId);
      });
    }
  }

  dataChange(event,val){
    var answerChange = {
      answer : event,
      id : val
    }
    this.onTextChange.emit(answerChange);
  }

  answerInputChange(event,val){
    var answerChange = {
      answer : event.target.value,
      id : val
    }
    this.onTextChange.emit(answerChange);
  }

  setStyling(elem){
    
    if(document.getElementById('answ_'+elem) && document.getElementById('answ_'+elem).childNodes[1] && document.getElementById('answ_'+elem).childNodes[1].childNodes[0]){
    var data = document.getElementById('answ_'+elem).childNodes[1].childNodes[0]['style']
    
      data.background= this.brandingColor.OptionColor;
      data.color= this. brandingColor.OptionFontColor;
    
    data.fontFamily=this.brandingColor.FontType
    }
  }


  /**
   * Function that returns a group
   * @param answer : Object { AnswerId:'', AnswerText:'', AnswerImage:''}
   */
  private initAnswer(answer) {
    
    return this._fb.group({
      AnswerId: answer.AnswerId,
      AnswerText: answer.AnswerText,
      AnswerImage: answer.AnswerImage,
      imageORvideo: 'image',
      Categories: [answer.Categories],
      PublicIdForAnswer: answer.PublicIdForAnswer,
      EnableMediaFile:answer.EnableMediaFile,
      AutoPlay:answer.AutoPlay,
      SecondsToApply: answer.SecondsToApply ? answer.SecondsToApply : 0,
      VideoFrameEnabled: answer.VideoFrameEnabled ? answer.VideoFrameEnabled : false,
      AnswerVarList:[answer.AnswerVarList ? answer.AnswerVarList : []],
      AnswerDescription:answer.AnswerDescription,
      ObjectFieldsInAnswer: answer.ObjectFieldsInAnswer

    });
  }

  /**
   * Step1: Add answer against question against QuestionId via API;
   * Step2: Push the data from the server i.e the new answer object to the
   * formArray
   */
  public addAnswer() {
    if(!this.commonService.checkSelectedQuestionValidity()){
      this.quizBuilderApiService.addAnswerToQuiz(this.form.controls.QuestionId.value)
        .subscribe((data) => {
          // this.quizzToolHelper.updateQuestionData(null);
  
          /**
           * ! Depricated : Both the below calls may not be required
           */
          if(this.isOpenBranchingLogicSide){
            this.isAddRemoveAnser.emit();
          }
          data.AutoPlay = true;
          
          this.createOptions(this.froalaEditorAt,this.form.controls.AnswerList.value.length,'ans');
          if(this.isWhatsappEnable && this._answerTypeNum == 1 && this.answerStructureType == this.quizAnswerStructureType.list){
            this.createOptions(this.froalaEditorAnsDesc,this.form.controls.AnswerList.value.length,'ansDesc');
          }

          if(this._answerTypeNum == answerTypeEnum.singleSelect || this._answerTypeNum == answerTypeEnum.multiSelect){
            for(let i=0; i<this.form.value.AnswerList.length; i++){
              if(this.form.value.AnswerList[i].ObjectFieldsInAnswer && this.form.value.AnswerList[i].ObjectFieldsInAnswer.FieldName){
                data.ObjectFieldsInAnswer = JSON.parse(JSON.stringify(this.form.value.AnswerList[i].ObjectFieldsInAnswer));
                data.ObjectFieldsInAnswer.IsExternalSync = false;
                // data.ObjectFieldsInAnswer.Value = data.AnswerText;
                break;
              }
            }
          }

          this.pushDataToAnswerListControl(data);
          this.updateAnswerListSidebarAdded(data)
          this.notificationsService.success(this.language == 'en-US' ? "Answer" : "Antwoord", this.language == 'en-US' ? "Added succesfully" : "Succcesvol toegevoegd");
        }, (error) => {
          this.notificationsService.error("Error", error);
        });
    }

  }

  /**
   * Observable for updating answer list on sidebar when 
   * answer is added
   */
  public updateAnswerListSidebarAdded(data) {
    var questionId = this.form.controls.QuestionId.value;
    this.quizzToolHelper.updateAnswerAdded({ answer: data, questionId: questionId });
  }

  /**
 * Observable for updating answer list on sidebar when 
 * answer is removed
 */
  public updateAnswerListSidebarRemoved(index) {
    var questionId = this.form.controls.QuestionId.value;
    this.quizzToolHelper.updateAnswerRemoved({ questionId: questionId, answerIndex: index });
  }


  /**
   * Function to push a single data to AnswerList control
   */
  private pushDataToAnswerListControl(data) {
    const control = <FormArray>this.form.controls['AnswerList'];
    const addrCtrl = this.initAnswer(data);
    control.push(addrCtrl);
    if(this.isWhatsappEnable){
      this.commonService.answerTextList.push(data.AnswerText);
    }
  }


  /**
   * Function to remove single data from AnswerList Control
   * @param index index
   */
  private removeDataFromAnswerListControl(index) {
    const control = <FormArray>this.form.controls['AnswerList'];
    control.removeAt(index);
  }


  /**
   * Function to remove answer against a answerId;
   * Step1: Remove answer against answerId via API endpoint;
   * Step2: Remove the answer from the formArray i.e `AnswerList`
   * 
   */
  public removeAnswer(answerId, index) {
    let tempAnswerText: string;
    if(this.isWhatsappEnable){
      tempAnswerText = this.commonService.answerTextList[index];
      this.commonService.answerTextList.splice(index,1);
    }
    this.quizBuilderApiService.removeAnswer(answerId)
      .subscribe((data) => {
        // this.quizzToolHelper.updateQuestionData(null);
        if(this.isOpenBranchingLogicSide){
          this.isAddRemoveAnser.emit();
        }
        this.quizzToolHelper.updatedResultRange.next("");
        /**
         * !Depricated: Below calls may not be required as question Data will be updated.
         */
        // delete this.froalaEditorAt[index];
        this.removeDataFromAnswerListControl(index);
        this.createFroalaEditorAndOption();
        // this.quizzToolHelper.updateQuestionData(null);
        this.updateAnswerListSidebarRemoved(index)
        this.notificationsService.success(this.language == 'en-US' ? "Answer removed" : "Antwoord verwijderd");

      }, (error) => {
        if(this.isWhatsappEnable){
          this.commonService.answerTextList[index] = tempAnswerText;
        }
        this.notificationsService.error(error)
      })
  }

  /**
 * Function to get control of AnswerList
 * Why need a accessor for getting controls?
 * https://github.com/angular/angular/issues/10192#issuecomment-269876477
 * @param form 
 */
  getAnswerListControl(form) {
    this.appyStylingToFroala();
    return form.get('AnswerList').controls;
  }

  /**
   * Function return short and long answer type placeholders
   */
  getShortAndLongAnsTypePlaceholder(){
    if(+this._answerTypeNum === 3){
      return "Short Answer Text...";
    }else if(+this._answerTypeNum === 4){
      return "Long Answer Text...";
    }
  }

  public dynamicTemplateSetTags(anwserId) {
    this.anserTag.emit(anwserId);
  }

  ngOnDestroy() {
    // this.valueChangesSubscription.unsubscribe();
    if(this.isStylingSubscription){
      this.isStylingSubscription.unsubscribe();
    }
    if(this.dragulaSubscription){
      this.dragulaSubscription.unsubscribe()
    }
    if(this.isAnswerTypeObservableSubscription){
      this.isAnswerTypeObservableSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.answerStructureType){
      this.answerStructureType = changes.answerStructureType.currentValue;
      this.setAnswerInputMaxLength();
    }
    if(changes.form){
      this.createFroalaEditorAndOption();
    }
    if(changes.clientAtsFieldsObj.currentValue){
      this.clientAtsFieldsList = JSON.parse(JSON.stringify(this.quizzToolHelper.clientAtsFieldsList));
    }
  }

  public froalaOpenedAt: number;
  openVariablePopup(openAt:number,type:string){
    this.froalaOpenedAt = openAt
    let variablePopupPayload: any = {};
    let msg;
    this.isVeriablePopupType = type;
    if(this.isVeriablePopupType == 'ans'){
      msg = this.froalaEditorAt[this.froalaOpenedAt].froalaRef.editorRefernce.html.get();    
      this.variablePopupService.variablePopupOpened = 'Answers';
    }else if(this.isVeriablePopupType == 'ansDesc'){
      msg = this.froalaEditorAnsDesc[this.froalaOpenedAt].froalaRef.editorRefernce.html.get(); 
      this.variablePopupService.variablePopupOpened = 'AnswersDescription';   
    }
    variablePopupPayload.listOfUsedVariableObj = this.variablePopupService.getListOfUsedVariableObjV2(msg);
    variablePopupPayload.listOfUsedVariableObj.map(varItem => {
      return (varItem.formula = varItem.formula.replace(/\{\{/g,'%').replace(/\}\}/g,'%'));
    });    
    variablePopupPayload.allowedVariblesFor = 'quiz';
    variablePopupPayload.isOpenPopup = true;
    this.variablePopupService.variablePopupPayload = variablePopupPayload;
    this.variablePopupService.changeInVariablePopupPayload();
  }

  UpdatePopUpStatus(){
    let listOfUsedVariableObj = this.variablePopupService.listOfUsedVariableObj;
    let activeFroalaRef;
    if(this.isVeriablePopupType == 'ans'){
      activeFroalaRef = this.froalaEditorAt[this.froalaOpenedAt].froalaRef;
    }else if(this.isVeriablePopupType == 'ansDesc'){
      activeFroalaRef = this.froalaEditorAnsDesc[this.froalaOpenedAt].froalaRef;
    }
    this.isVeriablePopupType = '';
    let tempVarFormulaList:any = [];
    listOfUsedVariableObj.map(varItem => {
      tempVarFormulaList.push(varItem.formula.replace(/^%/g,'{{').replace(/%$/g,'}}'));
    });
    this.getAnswerGroupAt(this.froalaOpenedAt).get('AnswerVarList').patchValue(tempVarFormulaList);
    this.variablePopupService.insertFormulaIntoEditorV2(listOfUsedVariableObj, activeFroalaRef);
    this.form.markAsDirty();
  }

  public froalaEditorAt:any = {};
  public froalaEditorAnsDesc:any = {};
  createFroalaEditorAndOption(){
    let index = 0;
    let arrayList: FormArray = this.form.get("AnswerList") as FormArray;
    arrayList.controls.forEach((element: FormControl) => {
      this.createOptions(this.froalaEditorAt,index,'ans');
      if(this.isWhatsappEnable && this._answerTypeNum == 1 && this.answerStructureType == this.quizAnswerStructureType.list){
        this.createOptions(this.froalaEditorAnsDesc,index,'ansDesc');
      }
      index++;
    });
  }

  createOptions(froalaEditor,index:any,type){
    if(!froalaEditor[index]){
      froalaEditor[index] = {
        "isShowVarBtn":false,
        "froalaRef": new FroalaEditorOptions(),
       }
    }
    switch (this.answerStructureType) {
      case QuizAnswerStructureType.button:
        this.inputMaxLength = 20;     
        break;

      case QuizAnswerStructureType.list:
        this.inputMaxLength = type == 'ans' ? 24 : 72;        
        break;
    
      default:
        this.inputMaxLength = 1000;
        break;
    }
    froalaEditor[index].options = froalaEditor[index].froalaRef.setEditorOptions(this.inputMaxLength);
    
    froalaEditor[index].options.charCounterCount = false;
    froalaEditor[index].options.ssCharCounterCount = true;
    froalaEditor[index].options.ssCharCounterMax = this.inputMaxLength;
    froalaEditor[index].options.pluginsEnabled.push('ssCharCounter','ssCharCounterCount','ssCharCounterMax'); 
    
    froalaEditor[index].options.AnswerIndex = index;
   
    froalaEditor[index].options.events["froalaEditor.initialized"] = (e, editor) =>{
      froalaEditor[editor.opts.AnswerIndex].froalaRef.editorRefernce = editor;                  
      editor.toolbar.hide();
      if(type == 'ans' && e.target.parentElement.classList.contains( 'has-ans-variable' )){
        editor.events.bindClick($('body'), 'i#ans-btn-variable'+editor.opts.AnswerIndex, function () {      
          editor.selection.save();
        });
      }else if(type == 'ansDesc' && e.target.parentElement.classList.contains( 'has-ans-desc-variable' )){
        editor.events.bindClick($('body'), 'i#ans-desc-btn-variable'+editor.opts.AnswerIndex, function () {      
          editor.selection.save();
        });
      }
    };
    if(this.isWhatsappEnable){
      froalaEditor[index].options.events["froalaEditor.focus"] = (e, editor) => {                               
        editor.toolbar.hide();
      }
      froalaEditor[index].options.events["froalaEditor.blur"] = (e, editor) => {                               
        editor.toolbar.hide();
      }
    }
  }

  getAnswerGroupAt(answerIndex: any): FormGroup{
    return (this.form.get("AnswerList") as FormArray).at(answerIndex) as FormGroup;
  }

  updateVarListFor(updateAt:number){
    let msg = this.froalaEditorAt[updateAt].froalaRef.editorRefernce.html.get();     
    let updatedVarist = this.variablePopupService.getListVariableFormulaV2(msg);
    this.getAnswerGroupAt(updateAt).get('AnswerVarList').patchValue(updatedVarist);
  }
}