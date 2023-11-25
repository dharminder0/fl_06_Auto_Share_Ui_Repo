import { Component, OnInit, Input } from '@angular/core';
import { QuizBuilderDataService } from '../../../quiz-builder-data.service';
import { QuizBuilderApiService } from '../../../quiz-builder-api.service';
import { QuizzToolHelper } from '../../quiz-tool-helper.service';
import { SharedService } from '../../../../shared/services/shared.service';
import { NotificationsService } from 'angular2-notifications';
import { DynamicMediaReplaceMentsService } from '../../dynamic-media-replacement';
import { rightMenuEnum } from '../../rightmenu-enum/rightMenuEnum';
import { VariablePopupService } from '../../../../shared/services/variable-popup.service';
import { UserInfoService } from '../../../../shared/services/security.service';
import { answerTypeEnum } from '../../commonEnum';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';


import * as _moment from 'moment';
import {
  DateTimeAdapter,
  OWL_DATE_TIME_FORMATS,
  OWL_DATE_TIME_LOCALE,
} from 'ng-pick-datetime';

const moment = (_moment as any).default ? (_moment as any).default : _moment; 
export const MY_CUSTOM_FORMATS = {
  parseInput: 'DD/MM/YYYY',
  fullPickerInput: 'DD/MM/YYYY hh:mm:ss a',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'hh:mm:ss a',
  monthYearLabel: 'MMM-YYYY',
  dateA11yLabel: 'LLL',
  monthYearA11yLabel: 'MMMM-YYYY',
};



@Component({
  selector: 'app-set-tags',
  templateUrl: './set-tags.component.html',
  styleUrls: ['./set-tags.component.css'],
  providers: [
    {
      provide: DateTimeAdapter,
      useClass: MomentDateTimeAdapter,
      deps: [OWL_DATE_TIME_LOCALE],
    },

    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ],
})
export class SetTagsComponent implements OnInit {

  /**
   * * question Data
   */
  @Input()
  public questionData: any;
  public answerTypeData: number;


  /**
   * *Quiz Category List : [{categoryName:"exampleCategory",tagList:[{value:"",label:""}]}]
   */
  public quizCategoryList = [];



  /**
   * *Container for the currently selected answer
   */
  public selectedAnswer;



  /**
   * * Create Model contains the core Logic. It is an object having keys as all the answer ids of all the answers
   * * in this questionData and further keys as categories and then the tagIds of respective categories 
   * * Format of the model
   * * {
   * *    answerId1: {
   * *                CategoryName1: [ tagId1, tagId2 , tagId3],
   * *                CategoryName2: [ tagId1, tagId2 , tagId3],
   * *                CategoryName3: [ tagId1, tagId2 , tagId3]
   * *              },
   * *    answerId2: {
   * *                CategoryName1: [ tagId1, tagId2 , tagId3],
   * *                CategoryName2: [ tagId1, tagId2 , tagId3],
   * *                CategoryName3: [ tagId1, tagId2 , tagId3]
   * *              }
   * * }   
   */
  public categoryModel = {};
  public selectedObject:string = "";
  public selectedField:string = "";
  public objectMappingList:any[] = [];
  public fieldMappingList:any = {};
  public fieldList:any = {};
  public answerObjectModel:any = {};
  public selectedAnswerType:number = -1;
  public updateSettingsFor:string[] = [];
  public editFieldMappingValue:boolean = false;
  public fieldMappingValue:string = "";
  public selectedAnswerId:any;
  public enabledPermissions:any = {};
  public userInfo:any = {};
  public isPickListValueMatch:boolean = true;
  public renderMessageVariableComponent: boolean = false;
  public isWhatsappEnable:boolean;
  public isDateValueValid:boolean = true;
  public isValueFound:boolean = false;
  public fieldValueCheck:boolean = false;
  /**
   * @params : 'AnswerComment'/'Answer'
   */
  public mappingFor:string = 'Answer';
  public fieldObject:any = {};
  public dateFieldsSyncSettingListOrg:Array<any> = [];
  public dateFieldsSyncSettingList:Array<any> = [];
  public isDateMappingValueValid:boolean;
  public isFieldObjectMakingInProgress: boolean = true;

  constructor(
    private quizBuilderDataService: QuizBuilderDataService,
    private quizzToolHelper: QuizzToolHelper,
    private quizBuilderApiService: QuizBuilderApiService,
    private notificationsService: NotificationsService,
    private sharedService : SharedService,
    private dynamicMediaReplaceService:DynamicMediaReplaceMentsService,
    private variablePopupService: VariablePopupService,
    private userInfoService: UserInfoService) {
      this.userInfo = this.userInfoService._info;
      this.enabledPermissions = JSON.parse(JSON.stringify(this.userInfoService.userPermissions));
     }
    


  ngOnInit() {
    this.renderMessageVariableComponent = true;
    if(this.questionData.AnswerList){
      this.questionData.AnswerList.forEach(element => {
        if(element.AnswerText){
          element.AnswerText = this.sharedService.sanitizeData(element.AnswerText);
        }
        // if(this.mappingFor == 'AnswerComment' && [answerTypeEnum.ratingEmoji,answerTypeEnum.ratingStar,answerTypeEnum.nps].includes(this.questionData.AnswerType)){
        //   element.AnswerText = this.userInfo.ActiveLanguage == 'en-US' ? 'Type your explanation here...' : 'Type hier je toelichting...';
        // }
        if(element.AnswerId == this.selectedAnswerId){
          this.selectedAnswer = element;
        }
        this.answerObjectModel[element.AnswerId] = {};
        this.answerObjectModel[element.AnswerId].AnswerText = element.AnswerText;
        this.answerObjectModel[element.AnswerId].placeholder = "Provide some value...";
        if([answerTypeEnum.ratingEmoji,answerTypeEnum.ratingStar,answerTypeEnum.nps,answerTypeEnum.smallText,answerTypeEnum.largeText].includes(this.questionData.AnswerType)){
          this.answerObjectModel[element.AnswerId].AnswerText = '';
          if(this.mappingFor == 'AnswerComment'){
            this.answerObjectModel[element.AnswerId].placeholder = this.userInfo.ActiveLanguage == 'en-US' ? 'Type your explanation here...' : 'Type hier je toelichting...';
          }else{
            this.answerObjectModel[element.AnswerId].placeholder = element.AnswerText;
          }
        }
        if(element[`ObjectFieldsIn${this.mappingFor}`] && Object.keys(element[`ObjectFieldsIn${this.mappingFor}`]).length > 0){
          this.answerObjectModel[element.AnswerId].ObjectName = element[`ObjectFieldsIn${this.mappingFor}`].ObjectName;
          this.answerObjectModel[element.AnswerId].FieldName = element[`ObjectFieldsIn${this.mappingFor}`].FieldName;
          this.answerObjectModel[element.AnswerId].AnswerText = element[`ObjectFieldsIn${this.mappingFor}`].Value;
          this.answerObjectModel[element.AnswerId].IsExternalSync = element[`ObjectFieldsIn${this.mappingFor}`].IsExternalSync;
          this.answerObjectModel[element.AnswerId].IsCommentMapped = element[`ObjectFieldsIn${this.mappingFor}`].IsCommentMapped;
          if(this.quizzToolHelper.clientAtsFieldsList[`${element[`ObjectFieldsIn${this.mappingFor}`].ObjectName}.${element[`ObjectFieldsIn${this.mappingFor}`].FieldName}`]){
            this.answerObjectModel[element.AnswerId].FieldLabel = this.quizzToolHelper.clientAtsFieldsList[`${element[`ObjectFieldsIn${this.mappingFor}`].ObjectName}.${element[`ObjectFieldsIn${this.mappingFor}`].FieldName}`];
          }
          else{
            this.answerObjectModel[element.AnswerId].FieldLabel = this.answerObjectModel[element.AnswerId].FieldName;
          }
        }        
      });
    }
    if(this.questionData && this.questionData.AnswerType){
      this.selectedAnswerType  = this.questionData.AnswerType;
    }
    /**
     * * Select the first answer from the answerList as default
     */
    // this.answerObjectModel[this.selectedAnswer.AnswerId] = {};
    // this.answerObjectModel[this.selectedAnswer.AnswerId].AnswerText = this.selectedAnswer.AnswerText;
    // if(this.selectedAnswer.ObjectFieldsInAnswer && Object.keys(this.selectedAnswer.ObjectFieldsInAnswer).length > 0){
    //   this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName = this.selectedAnswer.ObjectFieldsInAnswer.ObjectName;
    //   this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName = this.selectedAnswer.ObjectFieldsInAnswer.FieldName;
    //   this.answerObjectModel[this.selectedAnswer.AnswerId].AnswerText = this.selectedAnswer.ObjectFieldsInAnswer.Value;
    //   this.answerObjectModel[this.selectedAnswer.AnswerId].IsExternalSync = this.selectedAnswer.ObjectFieldsInAnswer.IsExternalSync;
    // }


    /**
     * * Populate the quizCategoryList variable with the category List obtained from the service
     */
    this.assignQuizCategoryListFromDataService();


    /** 
     * *Initialze the Category Model(categoryModel) to have all answerIds as object keys and assign to those keys their respective
     * *categories
     */
    this.initializeCategoryModelForAllAnswer();
    this.dateFieldsSyncSettingListOrg = this.quizzToolHelper.dateFieldsSyncSettingList;
    this.dateFieldsSyncSettingList = JSON.parse(JSON.stringify(this.dateFieldsSyncSettingListOrg));

    this.checkForClientObjectList();
  }

  updateFieldMappingValue(){
    this.fieldValueCheck = false;
    this.isValueFound = true;
    let fieldType: any = this.fieldObject[  `${this.answerObjectModel[ this.selectedAnswer.AnswerId ].ObjectName}${this.answerObjectModel[ this.selectedAnswer.AnswerId ].FieldName}` ].DataType;
    if(fieldType && fieldType.toLowerCase().includes('date')){
      let dateSettingTypeIndex = this.answerObjectModel[this.selectedAnswer.AnswerId].dateSettingTypeIndex;
      if((dateSettingTypeIndex || dateSettingTypeIndex == 0) && this.dateFieldsSyncSettingList[dateSettingTypeIndex].FieldOptionTitle.toLowerCase().includes('fixeddate')){
        let dateFieldsSyncSettingObj = this.dateFieldsSyncSettingList[dateSettingTypeIndex];
        if(dateFieldsSyncSettingObj.FieldOptionTitle.toLowerCase().includes('fixeddate')){
          if(dateFieldsSyncSettingObj.FieldType.toLowerCase() =='date'){
            this.fieldMappingValue = moment(this.fieldMappingValue).format('DD/MM/YYYY');            
          }
          if(dateFieldsSyncSettingObj.FieldType.toLowerCase() == 'datetime'){
            this.fieldMappingValue = moment(this.fieldMappingValue).format('DD/MM/YYYY h:mm:ss a');
          }
        }
      }
    }
    this.answerObjectModel[this.selectedAnswer.AnswerId].AnswerText = this.fieldMappingValue;
    this.getMatchValueIsPickList();
    this.updateFieldMappingValueStore(this.fieldMappingValue);
    this.editDate(true);
    this.resetFieldMappingValue();
  }

  getMatchValueIsPickList(fieldMappingValue?:any){
    if(!fieldMappingValue){
      fieldMappingValue = this.answerObjectModel[this.selectedAnswer.AnswerId].AnswerText;
    }
    this.isPickListValueMatch = false;
    if(fieldMappingValue && this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName && this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName && 
      (this.selectedAnswerType >=0 && this.selectedAnswerType <= 4 || this.mappingFor == 'AnswerComment' && this.selectedAnswerType >=10 && this.selectedAnswerType <= 12) &&
      this.fieldList[`${this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName}${this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName}`] &&
      this.fieldList[`${this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName}${this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName}`].length > 0){
        this.fieldList[`${this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName}${this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName}`].map(field => {
          if(field.value ==  fieldMappingValue){
            this.isPickListValueMatch = true;
          }
        });
    }else{
      this.isPickListValueMatch = true;
    }
  }

  resetFieldMappingValue(){
    this.editFieldMappingValue = false;
    this.fieldMappingValue = '';
    this.answerObjectModel[this.selectedAnswer.AnswerId].dateSettingTypeIndex = undefined;
    let fieldType: any = this.fieldObject[  `${this.answerObjectModel[ this.selectedAnswer.AnswerId ].ObjectName}${this.answerObjectModel[ this.selectedAnswer.AnswerId ].FieldName}` ].DataType;
    if(fieldType && fieldType.toLowerCase().includes('date')){
      this.isDateValueValid = !this.isValueFound ? false : true; 
    }
  }

  removeAnswerTag(selectedAnsId){
    this.answerObjectModel[selectedAnsId].ObjectName = null;
    this.answerObjectModel[selectedAnsId].FieldName = null;
    this.answerObjectModel[selectedAnsId].AnswerText = '';
    this.answerObjectModel[selectedAnsId].FieldLabel = null;
    this.isPickListValueMatch = true;
    this.isDateValueValid = true;
  }

  /**
   * *Loop through all the Answers and create the categoryModel
   */
  private initializeCategoryModelForAllAnswer() {
    this.questionData.AnswerList.forEach(answer => {
      this.assignCategoryModel(answer);
    });
  }

  /**
   * * Input : A Single instance of answer. It has AnswerId.
   * * This function creates categoryModel and grows it
   * * Algorithm 
   * * Loop through CategoryList {
   * *   create a new object with key as answerId
   * *   Loop through all the categories in this answer {
   * *       create Object with key as categoryName and assign the ids of that particular category to this key
   * *   }
   * * }
   * 
   * @param answer : A Single instance of answer
   */
  private assignCategoryModel(answer) {
    /** Created a new Object with key as answerId */
    this.categoryModel[answer.AnswerId] = {}

    /** Loop over all categoryList */
    for (var i = 0; i < this.quizCategoryList.length; i++) {

      let category = this.quizCategoryList[i];
      let categoryName = category.categoryName.tagCategoryName;
      let categoryId = category.categoryName.tagCategoryId;
      let foundCategory = false;
      let answerCategories = answer.Categories || [];
      /** Loop over all the categories in answer */
      for (var j = 0; j < answerCategories.length; j++) {
        let selectedAnswerCategory = answerCategories[j];

        /** Check whether the category from the categoryList exist in the answer . If yes then assign all the tagids in this category */
        if (selectedAnswerCategory.CategoryName == category.categoryName.tagCategoryName) {
          foundCategory = true;
          if (selectedAnswerCategory.TagDetails && selectedAnswerCategory.TagDetails.length) {
            this.categoryModel[answer.AnswerId][`${categoryName}_${categoryId}`] = selectedAnswerCategory.TagDetails.map(tag => tag.TagId.toString())
          } else {
            /** If category not found then assign empty array */
            this.categoryModel[answer.AnswerId][`${categoryName}_${categoryId}`] = []
          }
        }
      }
      if (!foundCategory) {
        this.categoryModel[answer.AnswerId][`${categoryName}_${categoryId}`] = [];
      }
    }

  }

  /** Get And Assign Quiz category list from data service */
  assignQuizCategoryListFromDataService() {
    this.quizCategoryList = this.quizBuilderDataService.getQuizCategoryList();
  }

  /**
   * * Update the selectedAnswer key
   * @param answer : A single answer instance
   */
  public chooseAnswer(answer) {
    if(!this.isPickListValueMatch && (this.selectedAnswer && this.answerObjectModel[this.selectedAnswer.AnswerId].IsExternalSync)){
      return false;
    }
    this.selectedAnswer = answer;
    if(!this.answerObjectModel[this.selectedAnswer.AnswerId]){
      this.answerObjectModel[this.selectedAnswer.AnswerId] = {};
      this.answerObjectModel[this.selectedAnswer.AnswerId].AnswerText = this.selectedAnswer.AnswerText;
      
      if(this.selectedAnswer[`ObjectFieldsIn${this.mappingFor}`] && Object.keys(this.selectedAnswer[`ObjectFieldsIn${this.mappingFor}`]).length > 0){
        this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName = this.selectedAnswer[`ObjectFieldsIn${this.mappingFor}`].ObjectName;
        this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName = this.selectedAnswer[`ObjectFieldsIn${this.mappingFor}`].FieldName;
        this.answerObjectModel[this.selectedAnswer.AnswerId].AnswerText = this.selectedAnswer[`ObjectFieldsIn${this.mappingFor}`].Value;
        this.answerObjectModel[this.selectedAnswer.AnswerId].IsExternalSync = this.selectedAnswer[`ObjectFieldsIn${this.mappingFor}`].IsExternalSync;
      }
    }

    let fieldType: any = this.fieldObject[  `${this.answerObjectModel[ this.selectedAnswer.AnswerId ].ObjectName}${this.answerObjectModel[ this.selectedAnswer.AnswerId ].FieldName}` ].DataType;
    if(fieldType && fieldType.toLowerCase().includes('date')){
      this.filterDateSynSettingList()
    }

    this.getMatchValueIsPickList();
    this.resetFieldMappingValue();
  }

  saveAnswerSettings(){
    this.renderMessageVariableComponent = false;
    if(this.selectedAnswerType >=0 && this.selectedAnswerType <= 4){
      this.saveTagDetails();
    }
    if(this.objectMappingList && this.objectMappingList.length > 0){
      this.saveObjectMapping();
    }
  }

  /**
   * * Save the categoryModel to the server
   */
  saveTagDetails() {
    let result = [];
    for (var answerIdKey in this.categoryModel) {
      let answerObject = {}
      let answerId = answerIdKey;
      answerObject['answerId'] = answerId;
      answerObject['Categories'] = [];
      for (var category in this.categoryModel[answerIdKey]) {
        let categoryObject = {
          CategoryName: category.split("_")[0],
          categoryId: category.split("_")[1],
          TagDetails: []
        };

        this.categoryModel[answerIdKey][category].forEach(tagId => {
          categoryObject.TagDetails.push(this.getTag(category.split("_")[0], tagId))
        })

        answerObject['Categories'].push(categoryObject)

      }
      result.push(answerObject);
    }

    if(!this.updateSettingsFor.includes("tags")){
      this.updateSettingsFor.push("tags");
    }

    this.quizBuilderApiService.updateAnswerTagAndCategory(result).subscribe(data => {
      if(this.updateSettingsFor.includes("tags")){
        this.updateSettingsFor.splice(this.updateSettingsFor.indexOf("tags"),1);
      }
      // this.notificationsService.success('Set-Tags', 'Tags has been Updated');
      if(!this.updateSettingsFor || this.updateSettingsFor.length <= 0){
        this.quizzToolHelper.updateQuestionData(result);
      }
    })

  }

  saveObjectMapping(){
    let bodyObj:any[] = [];
    
    for (var currObj in this.answerObjectModel){
      //if(this.answerObjectModel[currObj].ObjectName && this.answerObjectModel[currObj].FieldName){
        if(this.selectedAnswerType != answerTypeEnum.availability && this.selectedAnswerType != answerTypeEnum.ratingEmoji && this.selectedAnswerType != answerTypeEnum.ratingStar && this.selectedAnswerType != answerTypeEnum.nps){
          bodyObj.push({
            "AnswerId": currObj,
            "ObjectName": this.answerObjectModel[currObj].ObjectName,
            "FieldName": this.answerObjectModel[currObj].FieldName,
            "Value": (this.selectedAnswerType >=0 && this.selectedAnswerType <= 4) ? this.answerObjectModel[currObj].AnswerText ? this.answerObjectModel[currObj].AnswerText : "" : '',
            "IsExternalSync":  this.answerObjectModel[currObj].IsExternalSync ? this.answerObjectModel[currObj].IsExternalSync : false,
            "IsCommentMapped":  false
          });
        }else{
          bodyObj.push({
            "AnswerId": currObj,
            "ObjectName": this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName,
            "FieldName": this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName,
            "Value": (this.selectedAnswerType >=10 && this.selectedAnswerType <= 12) ? this.answerObjectModel[currObj].AnswerText ? this.answerObjectModel[currObj].AnswerText : "" : '',
            "IsExternalSync": this.answerObjectModel[this.selectedAnswer.AnswerId].IsExternalSync,
            "IsCommentMapped": [answerTypeEnum.ratingEmoji, answerTypeEnum.ratingStar, answerTypeEnum.nps].includes(this.selectedAnswerType) && this.mappingFor == 'AnswerComment'
                                ? true
                                : false
          });
        }

     // }
    }

    if(bodyObj && bodyObj.length > 0){
      if(!this.updateSettingsFor.includes("fieldMapping")){
        this.updateSettingsFor.push("fieldMapping");
      }

      this.quizBuilderApiService.updateAnswerObjectMapping(bodyObj).subscribe(data => {
        if(this.updateSettingsFor.includes("fieldMapping")){
          this.updateSettingsFor.splice(this.updateSettingsFor.indexOf("fieldMapping"),1);
        }
        
        if(!this.updateSettingsFor || this.updateSettingsFor.length <= 0){
          this.quizzToolHelper.updateQuestionData(bodyObj);
        }
      })
    }
  }

  /**
   * 
   * @param categoryName : e.g Certificates
   * @param tagid : e.g 2
   * 
   * * Output : {  TagId:2, TagName:"O Level" }
   */
  getTag(categoryName, tagid) {
    for (var icategory = 0; icategory < this.quizCategoryList.length; icategory++) {
      let category = this.quizCategoryList[icategory];
      if (category.categoryName.tagCategoryName == categoryName) {
        for (var itag = 0; itag < category.tagList.length; itag++) {
          let tag = category.tagList[itag];
          if (tag.value == tagid) {
            return {
              TagId: tag.value,
              TagName: tag.label
            }
          }
        }
      }
    }
  }

  onClose(){
    this.renderMessageVariableComponent = false;
    if(this.dynamicMediaReplaceService.isOpenEnableMediaSetiing.isOpen == true){
      this.dynamicMediaReplaceService.isOpenEnableMediaSetiing={
          "isOpen":false,
          "menuType":rightMenuEnum.DynamicMedia
      };
      this.dynamicMediaReplaceService.changeOpenEnableMediaSetiingSubmission();
    }
  }

  openVariablePopup(){
    this.answerObjectModel[this.selectedAnswer.AnswerId].dateSettingTypeIndex = undefined;
    let variablePopupPayload: any = {};
    variablePopupPayload.listOfUsedVariableObj = [];
    if(this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName && this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName){
      variablePopupPayload.listOfUsedVariableObj.push(
        {
          "formula":`%${this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName}.${this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName}%`,
          "title":`${this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName}.${this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName}`
        }
      );
    }
    variablePopupPayload.allowedVariblesFor = 'tag'
    variablePopupPayload.isOpenPopup = true;
    variablePopupPayload.fetchDspName = true;

    this.variablePopupService.variablePopupPayload = variablePopupPayload;
    this.variablePopupService.changeInVariablePopupPayload();
  }

  UpdatePopUpStatus(e){
    this.isDateValueValid = true;
    let listOfUsedVariableObj = this.variablePopupService.listOfUsedVariableObj;
    if(listOfUsedVariableObj && listOfUsedVariableObj.length > 0){
      this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName =  listOfUsedVariableObj[0].formula ? listOfUsedVariableObj[0].formula.split('.')[0].replace("%","") : null;
      this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName = listOfUsedVariableObj[0].formula ? listOfUsedVariableObj[0].formula.split('.')[1].replace("%",""): null;
      this.answerObjectModel[this.selectedAnswer.AnswerId].FieldLabel = listOfUsedVariableObj[0].title ? (listOfUsedVariableObj[0].title.split('.')[1] ? listOfUsedVariableObj[0].title.split('.')[1] : listOfUsedVariableObj[0].title) : null;
      this.answerObjectModel[this.selectedAnswer.AnswerId].AnswerText = this.selectedAnswer.AnswerText;


      if(this.fieldObject[this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName+this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName].listValues && 
        this.fieldObject[this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName+this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName].listValues.length > 0){
        this.answerObjectModel[this.selectedAnswer.AnswerId].AnswerText = '';    
      }

      if(this.fieldObject[this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName+this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName].DataType.toLowerCase().includes('date')){
        this.answerObjectModel[this.selectedAnswer.AnswerId].AnswerText = '';
        this.filterDateSynSettingList();      
      }

      if([answerTypeEnum.ratingEmoji,answerTypeEnum.ratingStar,answerTypeEnum.nps,answerTypeEnum.smallText,answerTypeEnum.largeText].includes(this.questionData.AnswerType)){
        this.answerObjectModel[this.selectedAnswer.AnswerId].AnswerText = '';        
      }
      this.fieldValueCheck = true;
      this.getMatchValueIsPickList();
      if(this.selectedAnswerType == answerTypeEnum.singleSelect || this.selectedAnswerType == answerTypeEnum.multiSelect){
        this.presetTags();       
      }
    }
    
  }
  
  presetTags(){
     if( this.answerObjectModel && Object.keys(this.answerObjectModel).length > 0){     
         for(let answer in this.answerObjectModel){
                if(!this.answerObjectModel[answer].hasOwnProperty('FieldName') && !this.answerObjectModel[answer].hasOwnProperty('ObjectName') &&
                !this.answerObjectModel[answer].hasOwnProperty('FieldLabel')){
                     this.answerObjectModel[answer].FieldName = this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName;
                     this.answerObjectModel[answer].FieldLabel = this.answerObjectModel[this.selectedAnswer.AnswerId].FieldLabel;
                     this.answerObjectModel[answer].ObjectName =  this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName;
                     this.answerObjectModel[answer].AnswerText = this.answerObjectModel[this.selectedAnswer.AnswerId].AnswerText;                    
                }
         }
     }
  }

  updateFieldMappingValueStore(mappingValue:string){
    if(this.mappingFor == 'AnswerComment' && this.selectedAnswerType >=10 && this.selectedAnswerType <= 12){      
      Object.keys(this.answerObjectModel).map((data:any)=>{      
        this.answerObjectModel[data].AnswerText = mappingValue;
      });
    }
  }

  editDate(errorCheck?){
    this.editFieldMappingValue = !errorCheck ? true : false; 
    // this.fieldMappingValue = this.answerObjectModel[this.selectedAnswer.AnswerId].AnswerText;
    let tempFieldMappingValue = this.answerObjectModel[this.selectedAnswer.AnswerId].AnswerText;
    let dateOnlyRegX ='^[0-9]{2}\\/[0-9]{2}\\/[0-9]{4}$';
    let dateTimeRegX ='^[0-9]{2}\\/[0-9]{2}\\/[0-9]{4}\\s[0-9]{1,2}\\:[0-9]{2}\\:[0-9]{1,2}\\s(am|AM|pm|PM)$';
    let isDateOnlyMatched = (new RegExp(dateOnlyRegX,"g")).test(tempFieldMappingValue);
    let isDateTimeMatched = (new RegExp(dateTimeRegX,"g")).test(tempFieldMappingValue);

    this.answerObjectModel[this.selectedAnswer.AnswerId].dateSettingTypeIndex = undefined;
    let fieldType: any =  (this.answerObjectModel[ this.selectedAnswer.AnswerId ].ObjectName && this.answerObjectModel[ this.selectedAnswer.AnswerId ].FieldName) ? this.fieldObject[  `${this.answerObjectModel[ this.selectedAnswer.AnswerId ].ObjectName}${this.answerObjectModel[ this.selectedAnswer.AnswerId ].FieldName}` ].DataType : '';
    if(fieldType && fieldType.toLowerCase().includes('date')){
      this.filterDateSynSettingList()
      this.dateFieldsSyncSettingList.every(item => {
        if(fieldType == item.FieldType){
          if(tempFieldMappingValue && item.Fields && item.Fields.includes(tempFieldMappingValue)){
            this.answerObjectModel[this.selectedAnswer.AnswerId].dateSettingTypeIndex = item.value;
            this.isValueFound = true;
            return false;
          }else{
            if(item.FieldOptionTitle.toLowerCase().includes('fixeddate') && isDateOnlyMatched){
              this.answerObjectModel[this.selectedAnswer.AnswerId].dateSettingTypeIndex = item.value;
              tempFieldMappingValue = moment(tempFieldMappingValue,"DD/MM/YYYY");
              this.isValueFound = true;
              return false;
            }
            if(item.FieldOptionTitle.toLowerCase().includes('fixeddatetime') && isDateTimeMatched){
              this.answerObjectModel[this.selectedAnswer.AnswerId].dateSettingTypeIndex = item.value;
              tempFieldMappingValue = moment(tempFieldMappingValue,"DD/MM/YYYY h:mm:ss a");
              this.isValueFound = true;
              return false;
            }
          }
        }else{
          this.isDateValueValid = false;
        }
        return true;
      });
    }
    if(this.isValueFound){
      this.fieldMappingValue = tempFieldMappingValue;
      this.isDateValueValid = true;
    }
    // else{
    //   this.isDateValueValid = false;
    // }
  }

  validateDateFieldMappingValueFor(dateType:string){  
    let reGex ='^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$'
    let regx = new RegExp(reGex,"g");
    let isPatternMatched = regx.test(this.fieldMappingValue);

    if(dateType=="automated"){
      this.isDateMappingValueValid = this.fieldMappingValue? true : false;
    }
    else if(dateType =="fixed"){
      if(this.fieldMappingValue && isPatternMatched){
        var params =this.fieldMappingValue.split('/');

        var isDateValid = (1 <= parseInt(params[0]) && parseInt(params[0]) <= 31) ? true : false;

        var isMonthValid = (1 <= parseInt(params[1]) && parseInt(params[1]) <= 12) ? true : false;

        var isYearValid = (1 <= parseInt(params[2]) && parseInt(params[2]) <= 9999) ? true : false;

        if(isDateValid && isMonthValid && isYearValid){
            this.isDateMappingValueValid=true;
        }else{
        this.isDateMappingValueValid= false;
        }
      } else{
        this.isDateMappingValueValid=false;
      }
    }
  }

  checkForClientObjectList(){
    let intervalId;
    const getClientObjectList = () =>{
      if(this.quizzToolHelper.clientObjectFieldsList && this.quizzToolHelper.clientObjectFieldsList.length > 0){
        this.isFieldObjectMakingInProgress = true;
        this.quizzToolHelper.clientObjectFieldsList.map((currObj:any) => {
          this.objectMappingList.push({"label":currObj.ObjectDisplayName,"value":currObj.ObjectName});
          this.fieldMappingList[currObj.ObjectName] = [];
          
          if(currObj.Fields && currObj.Fields.length > 0){
            currObj.Fields.map((fieldObj:any) => {
              this.fieldMappingList[currObj.ObjectName].push({"label":fieldObj.DisplayName,"value":fieldObj.Name});
              this.fieldList[`${currObj.ObjectName}${fieldObj.Name}`] = [];
              if(fieldObj.FieldListValues){
                fieldObj.FieldListValues.map((listValue:any)=>{
                  this.fieldList[`${currObj.ObjectName}${fieldObj.Name}`].push({"label":listValue.Label,"value":listValue.Value});
                })
              }
              this.fieldObject[`${currObj.ObjectName}${fieldObj.Name}`] = {};
              this.fieldObject[`${currObj.ObjectName}${fieldObj.Name}`] = fieldObj;
              this.fieldObject[`${currObj.ObjectName}${fieldObj.Name}`].listValues = this.fieldList[`${currObj.ObjectName}${fieldObj.Name}`];
            });
          }
        },this);
        this.isFieldObjectMakingInProgress = false; 
        this.getMatchValueIsPickList();
        this.filterDateSynSettingList(); 
        this.editDate(true);
        clearInterval(intervalId);
      }
    }
    intervalId = setInterval(getClientObjectList, 100);
  }

  filterDateSynSettingList(){
    let tempIndex:number = 0;
    this.dateFieldsSyncSettingList = this.dateFieldsSyncSettingListOrg.filter(item => {
      if(this.fieldObject[this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName+this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName] && 
          item.FieldType.toLowerCase() == this.fieldObject[this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName+this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName].DataType.toLowerCase()
      ){
        let temp = tempIndex++;
        item.value = temp.toString();
        return true;
      }else{
        return false;
      }
    }); 
  }

  checkAndResetPushValue(){
    if(this.fieldObject[this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName+this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName] && 
        (this.fieldObject[this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName+this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName].listValues.length > 0 ||
          this.fieldObject[this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName+this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName].DataType.toLowerCase().includes('date')
        )
    ){
      this.answerObjectModel[this.selectedAnswer.AnswerId].AnswerText = '';
    }
  }

  CheckEditValue(){
    this.fieldMappingValue = "";
    this.fieldValueCheck = true;
  }
}
