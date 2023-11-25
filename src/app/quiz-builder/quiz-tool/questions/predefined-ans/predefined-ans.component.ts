import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { QuizBuilderApiService } from '../../../quiz-builder-api.service';
import { FormArrayName, FormArray, FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { QuizzToolHelper } from '../../quiz-tool-helper.service';
import { QuizDataService } from '../../../../quiz/quiz-data.service';
import { QuizBuilderDataService } from '../../../../quiz-builder/quiz-builder-data.service';
import { Subscription } from 'rxjs';
import { languageEnum } from '../../../../shared/Enum/languageEnum';
import { NavigationStart, Router } from '@angular/router';
import { UserInfoService } from '../../../../shared/services/security.service';
import { answerTypeEnum } from '../../commonEnum';
import { SharedService } from '../../../../shared/services/shared.service';
declare var $: any;
@Component({
  selector: 'app-predefined-ans',
  templateUrl: './predefined-ans.component.html',
  styleUrls: ['./predefined-ans.component.scss']
})
export class PredefinedAnsComponent implements OnInit, OnDestroy {
  @Input() isWhatsappEnable;
  @Input() isOpenBranchingLogicSide;
  @Output() isAddRemoveAnser: EventEmitter<any> = new EventEmitter<any>();
  @Input() form: FormGroup;
  public _answerTypeNum: number = 1;
  @Input() set answerType(ansType: number){
    this._answerTypeNum = ansType;
  }
  @Output() onTextChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() anserTag: EventEmitter<any> = new EventEmitter<any>();

  dummyDrivingLicense : Array<string> = ['A','B','BE','C','CE','D','THE','G','No driving license'];
  dummyJobs: Array<string> = ['Yes','No','No, but open to good suggestions'];
  public brandingColor;
  public ratingEmojiList = [
    {
      id : 1,
      name : "Lbl_Verysad",
      dutchName: "Zeer ontevreden",
      englishName: "Very dissatisfied",
      polishName: "Bardzo niezadowalająca"
    },
    {
      id : 2,
      name : "Lbl_Sad",
      dutchName: "Ontevreden",
      englishName: "Dissatisfied",
      polishName: "Niezadowalająca"
    },
    {
      id : 3,
      name : "Lbl_Normal",
      dutchName: "Neutraal",
      englishName: "Neutral",
      polishName: "Neutralna"
    },
    {
      id : 4,
      name : "Lbl_Happy",
      dutchName: "Tevreden",
      englishName: "Satisfied",
      polishName: "Zadowalająca"
    },    
    {
      id : 5,
      name : "Lbl_Veryhappy",
      dutchName: "Zeer tevreden",
      englishName: "Very satisfied",
      polishName: "Bardzo zadowalająca"
    }
  ];
  public getPostalCountryList: any = [];
  public showOptionsForCountry;
  // public routerEventSubscription;
  @Input() selectAll;
  @Input() selectedCountcodeArray;
  @Input() selectedCountryNameArray;
  @Input() selectedCountryName;
  @Input() isAllSelectCountry;
  public searchCountry;
  // public valueChangesSubscription;
  // public countryChangesSubscription:Subscription;
  private isStylingSubscription: Subscription;
  public quizLanguage;
  public isCountrySelectionChanges: boolean = false;
  public isTagPremission:boolean = false;
  public userInfo: any = {};
  public enabledPermissions:any = {};
  public isJRSalesforcePermission:boolean = false;

  constructor(
    private quizDataService: QuizDataService,
    private router: Router,
    private quizBuilderApiService: QuizBuilderApiService,
    private notificationsService: NotificationsService,
    private quizzToolHelper: QuizzToolHelper,
    private quizBuilderDataService:QuizBuilderDataService,
    private userInfoService: UserInfoService,
    private _fb: FormBuilder,
    private sharedService: SharedService,) { }


    ngOnChanges(changes: SimpleChanges) {
      this.quizLanguage = languageEnum;
      if(!changes.selectedCountryName){
        this.selectedCountryName = "";
        this.selectAll = false;
        this.isAllSelectCountry = false;

        if(changes.selectedCountryNameArray && changes.selectedCountryNameArray.currentValue && changes.selectedCountryNameArray.currentValue.length > 0){
          this.selectedCountryName = changes.selectedCountryNameArray.currentValue.join();
          if(this.getPostalCountryList.length == changes.selectedCountryNameArray.currentValue.length){
            this.selectedCountryName = '';
            this.selectAll = true;
            this.isAllSelectCountry = true;
          }
        }
      }
    }


  ngOnInit() {
    this.userInfo = this.userInfoService._info;
    this.enabledPermissions = JSON.parse(JSON.stringify(this.userInfoService.userPermissions));
    this.isJRSalesforcePermission = (this.enabledPermissions.isJRSalesforceEnabled && this.userInfo.AccountLoginType == 'salesforce') ? true : false;
    this.isTagPremission = this.userInfo.IsContactTagsPermission;
    this.getPostalCountryList = JSON.parse(JSON.stringify(this.quizDataService.postalCountryList));
    this.getBrandingColors();
    // this.getSaveQuestionAction();
    // this.routerParamSubscription();
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


  // getSaveQuestionAction(){
  //   let self = this;
  //   this.countryChangesSubscription =  this.quizBuilderDataService.currentQuizSaveAll.subscribe(function(res: any){
  //     if(res && (self._answerTypeNum == 7 || self._answerTypeNum == 8)){
  //       self.updateAnswerValuesCountryCode();
  //     }
  //   });
  // }

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
      ObjectFieldsInAnswer: answer.ObjectFieldsInAnswer,
      OptionTextforRatingOne: [answer.OptionTextforRatingOne],
      OptionTextforRatingTwo: [answer.OptionTextforRatingTwo],
      OptionTextforRatingThree: [answer.OptionTextforRatingThree],
      OptionTextforRatingFour: [answer.OptionTextforRatingFour],
      OptionTextforRatingFive: [answer.OptionTextforRatingFive]
    });
  }


  /**
   * Step1: Add answer against question against QuestionId via API;
   * Step2: Push the data from the server i.e the new answer object to the
   * formArray
   */
  public addAnswer() {
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
        this.pushDataToAnswerListControl(data);
        this.updateAnswerListSidebarAdded(data)
        this.notificationsService.success("Answer", "Added succesfully");
      }, (error) => {
        this.notificationsService.error("Error", error);
      })

  }

  onSearchChange(event,val){
    
    var answerChange = {
      answer : event,
      id : val
    }
    this.onTextChange.emit(answerChange);
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
        this.removeDataFromAnswerListControl(index);
        this.updateAnswerListSidebarRemoved(index)
        this.notificationsService.success("Removed")
      }, (error) => {
        this.notificationsService.error(error.error.message)
      })
  }

  /**
 * Function to get control of AnswerList
 * Why need a accessor for getting controls?
 * https://github.com/angular/angular/issues/10192#issuecomment-269876477
 * @param form 
 */
  getAnswerListControl(form): FormArray {
    return form.get('AnswerList').controls as FormArray;
  }

  /**
   * Function return short and long answer type placeholders
   */
  getShortAndLongAnsTypePlaceholder(){
    if(+this._answerTypeNum === 5){
      return "Date of Birth";
    }else if(+this._answerTypeNum === 8){
      return "Postal Code";
    }
  }

  onOptionTextLabelChange(event,msg){
    const control = this.getAnswerListControl(this.form);
    if(msg == 'ratingOne'){
      control[0].patchValue({OptionTextforRatingOne : event.target.value});
    }else if(msg == 'ratingTwo'){
      control[0].patchValue({OptionTextforRatingTwo : event.target.value});
    }else if(msg == 'ratingThree'){
      control[0].patchValue({OptionTextforRatingThree : event.target.value});
    }else if(msg == 'ratingFour'){
      control[0].patchValue({OptionTextforRatingFour : event.target.value});
    }else if(msg == 'ratingFive'){
      control[0].patchValue({OptionTextforRatingFive : event.target.value});
    }
    this.form.markAsDirty();
  }

  //country list
  startOfficeCountry(){
    this.searchCountry = '';
    this.showOptionsForCountry = !this.showOptionsForCountry;
  }

  //select country list
  onSelectAll(answerIndex:any) {
    this.selectAll = !this.selectAll;
    this.selectedCountcodeArray = [];
    this.selectedCountryNameArray = [];
    this.selectedCountryName = '';
    this.isAllSelectCountry = false;
    this.isCountrySelectionChanges = true;
    if (this.selectAll) {
      this.getPostalCountryList.map(item => {
        this.selectedCountcodeArray.push(item.value);
        this.selectedCountryNameArray.push(item.label)
        this.isAllSelectCountry = true;
      });
    } 
    this.emitCountryListChange(this.selectedCountcodeArray,answerIndex);  
  }

  emitCountryListChange(countryList:any, answerIndex: any){
    let countryCodeListChange = {
      countryList: countryList,
      id: answerIndex,
      answer:this.getAnswerGroupAt(answerIndex).value.AnswerText
    }
    this.onTextChange.emit(countryCodeListChange);
  }

  selectCountryToFilter(data, answerIndex){
    if (this.selectedCountcodeArray.includes(data.value)) {
      var id = this.selectedCountcodeArray.indexOf(data.value);
      this.selectedCountcodeArray.splice(id, 1);
      var countryNames = this.selectedCountryNameArray.indexOf(data.label);
      this.selectedCountryNameArray.splice(countryNames, 1);

    } else {
      this.selectedCountcodeArray.push(data.value);
      this.selectedCountryNameArray.push(data.label);
    
    }
    //show office name
    if(this.selectedCountcodeArray && this.selectedCountcodeArray.length > 0){
      this.selectedCountryName = this.selectedCountryNameArray.join();
    }else{
      this.selectedCountryName = '';
      this.isAllSelectCountry = false;
    }
    //all  select option
    if (this.getPostalCountryList.length == this.selectedCountcodeArray.length) {
      this.selectAll = true;
      this.selectedCountryName = '';
      this.isAllSelectCountry = true;
    } else {
      this.selectAll = false;
    }
    this.isCountrySelectionChanges = true;
    this.emitCountryListChange(this.selectedCountcodeArray,answerIndex);  
  }

  // updateAnswerValuesCountryCode(){
  //   let answerId = this.form.value.AnswerList[0].AnswerId;
  //   if((this._answerTypeNum == 7 || this._answerTypeNum == 8) && this.isCountrySelectionChanges){ 
  //       this.quizBuilderApiService.updateAnswerValuesInCountryCode(answerId,this.selectedCountcodeArray).subscribe((data) => {
  //         if(data){
  //           this.isCountrySelectionChanges = false;
  //           console.log(data)
  //         }
  //       })
  //   }
  // }

  /**
   * Subscription for listening to router change
   */

  // private routerParamSubscription() {    
  //   this.routerEventSubscription = this.router.events.subscribe(event => {     
  //     if (event instanceof NavigationStart) {
  //         this.updateAnswerValuesCountryCode();      
  //     }
  //   })
  // }

  public dynamicTemplateSetTags(anwserId?) {
    if(this.form.value.AnswerType == answerTypeEnum.availability || this.form.value.AnswerType == answerTypeEnum.ratingStar){
      anwserId = this.form.value.AnswerList[0].AnswerId;
    }
    this.anserTag.emit(anwserId);
  }
  
  ngOnDestroy() {
    // this.valueChangesSubscription.unsubscribe();
    // if(this.routerEventSubscription)
    // {
    //   this.routerEventSubscription.unsubscribe();
    // }
    if(this.isStylingSubscription){
      this.isStylingSubscription.unsubscribe();
    }
    // if(this.countryChangesSubscription){
    //   this.countryChangesSubscription.unsubscribe();
    // }
  }

  getAnswerGroupAt(answerIndex: any): FormGroup{
    return this.getAnswerListControl(this.form).at(answerIndex) as FormGroup;
  }
}

