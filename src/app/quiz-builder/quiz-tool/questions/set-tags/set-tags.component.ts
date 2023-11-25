import { Component, OnInit, Input } from '@angular/core';
import { QuizBuilderDataService } from '../../../quiz-builder-data.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { QuizBuilderApiService } from '../../../quiz-builder-api.service';
import { QuizzToolHelper } from '../../quiz-tool-helper.service';
import { SharedService } from '../../../../shared/services/shared.service';
import { NotificationsService } from 'angular2-notifications';
import { DynamicMediaReplaceMentsService } from '../../dynamic-media-replacement';
import { rightMenuEnum } from '../../rightmenu-enum/rightMenuEnum';
import { VariablePopupService } from '../../../../shared/services/variable-popup.service';
import { UserInfoService } from '../../../../shared/services/security.service';
import { answerTypeEnum } from '../../commonEnum';

@Component({
  selector: 'app-set-tags',
  templateUrl: './set-tags.component.html',
  styleUrls: ['./set-tags.component.css']
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
  public isPickListValueMatch:boolean = false;


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
    if(this.questionData.AnswerList){
      this.questionData.AnswerList.forEach(element => {
        if(element.AnswerText){
          element.AnswerText = this.sharedService.sanitizeData(element.AnswerText);
        }
        if(element.AnswerId == this.selectedAnswerId){
          this.selectedAnswer = element;
        }
          this.answerObjectModel[element.AnswerId] = {};
          this.answerObjectModel[element.AnswerId].AnswerText = element.AnswerText;
          if(element.ObjectFieldsInAnswer && Object.keys(element.ObjectFieldsInAnswer).length > 0){
            this.answerObjectModel[element.AnswerId].ObjectName = element.ObjectFieldsInAnswer.ObjectName;
            this.answerObjectModel[element.AnswerId].FieldName = element.ObjectFieldsInAnswer.FieldName;
            this.answerObjectModel[element.AnswerId].AnswerText = element.ObjectFieldsInAnswer.Value;
            this.answerObjectModel[element.AnswerId].IsExternalSync = element.ObjectFieldsInAnswer.IsExternalSync;
            if(this.quizzToolHelper.clientAtsFieldsList[`${element.ObjectFieldsInAnswer.ObjectName}.${element.ObjectFieldsInAnswer.FieldName}`]){
              this.answerObjectModel[element.AnswerId].FieldLabel = this.quizzToolHelper.clientAtsFieldsList[`${element.ObjectFieldsInAnswer.ObjectName}.${element.ObjectFieldsInAnswer.FieldName}`];
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
    
    if(this.quizzToolHelper.clientObjectFieldsList && this.quizzToolHelper.clientObjectFieldsList.length > 0){
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
          });
        }
      },this);
    }
    this.getMatchValueIsPickList();
  }
  
  updateFieldMappingValue(){
    this.answerObjectModel[this.selectedAnswer.AnswerId].AnswerText = this.fieldMappingValue;
    this.getMatchValueIsPickList();
    this.resetFieldMappingValue();
  }

  getMatchValueIsPickList(){
    this.isPickListValueMatch = false;
    if(this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName && this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName && 
      this.selectedAnswerType >=0 && this.selectedAnswerType <= 4 &&
      this.fieldList[`${this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName}${this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName}`] &&
      this.fieldList[`${this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName}${this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName}`].length > 0){
        this.fieldList[`${this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName}${this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName}`].map(field => {
          if(field.value ==  this.answerObjectModel[this.selectedAnswer.AnswerId].AnswerText){
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
  }

  removeAnswerTag(selectedAnsId){
    this.answerObjectModel[selectedAnsId].ObjectName = null;
    this.answerObjectModel[selectedAnsId].FieldName = null;
    this.answerObjectModel[selectedAnsId].AnswerText = '';
    this.isPickListValueMatch = true;
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
    if(!this.isPickListValueMatch){
      return false;
    }
    this.selectedAnswer = answer;
    if(!this.answerObjectModel[this.selectedAnswer.AnswerId]){
      this.answerObjectModel[this.selectedAnswer.AnswerId] = {};
      this.answerObjectModel[this.selectedAnswer.AnswerId].AnswerText = this.selectedAnswer.AnswerText;
      
      if(this.selectedAnswer.ObjectFieldsInAnswer && Object.keys(this.selectedAnswer.ObjectFieldsInAnswer).length > 0){
        this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName = this.selectedAnswer.ObjectFieldsInAnswer.ObjectName;
        this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName = this.selectedAnswer.ObjectFieldsInAnswer.FieldName;
        this.answerObjectModel[this.selectedAnswer.AnswerId].AnswerText = this.selectedAnswer.ObjectFieldsInAnswer.Value;
        this.answerObjectModel[this.selectedAnswer.AnswerId].IsExternalSync = this.selectedAnswer.ObjectFieldsInAnswer.IsExternalSync;
      }
    }
    this.resetFieldMappingValue();
  }

  saveAnswerSettings(){
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
        if(this.selectedAnswerType != answerTypeEnum.availability && this.selectedAnswerType != answerTypeEnum.ratingEmoji && this.selectedAnswerType != answerTypeEnum.ratingStar){
          bodyObj.push({
            "AnswerId": currObj,
            "ObjectName": this.answerObjectModel[currObj].ObjectName,
            "FieldName": this.answerObjectModel[currObj].FieldName,
            "Value": (this.selectedAnswerType >=0 && this.selectedAnswerType <= 4) ? this.answerObjectModel[currObj].AnswerText ? this.answerObjectModel[currObj].AnswerText : "" : '',
            "IsExternalSync":  this.answerObjectModel[currObj].IsExternalSync ? this.answerObjectModel[currObj].IsExternalSync : false
          });
        }else{
          bodyObj.push({
            "AnswerId": currObj,
            "ObjectName": this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName,
            "FieldName": this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName,
            "Value": "",
            "IsExternalSync": this.answerObjectModel[this.selectedAnswer.AnswerId].IsExternalSync
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
    if(this.dynamicMediaReplaceService.isOpenEnableMediaSetiing.isOpen == true){
      this.dynamicMediaReplaceService.isOpenEnableMediaSetiing={
          "isOpen":false,
          "menuType":rightMenuEnum.DynamicMedia
      };
      this.dynamicMediaReplaceService.changeOpenEnableMediaSetiingSubmission();
    }
  }

  openVariablePopup(){
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

    this.variablePopupService.variablePopupPayload = variablePopupPayload;
    this.variablePopupService.changeInVariablePopupPayload();
  }

  UpdatePopUpStatus(e){
    let listOfUsedVariableObj = this.variablePopupService.listOfUsedVariableObj;
    if(listOfUsedVariableObj && listOfUsedVariableObj.length > 0){
      this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName =  listOfUsedVariableObj[0].formula ? listOfUsedVariableObj[0].formula.split('.')[0].replace("%","") : null;
      this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName = listOfUsedVariableObj[0].formula ? listOfUsedVariableObj[0].formula.split('.')[1].replace("%",""): null;
      this.answerObjectModel[this.selectedAnswer.AnswerId].FieldLabel = listOfUsedVariableObj[0].title ? listOfUsedVariableObj[0].title.split('.')[1]: null;
      this.answerObjectModel[this.selectedAnswer.AnswerId].AnswerText = this.selectedAnswer.AnswerText;
      this.getMatchValueIsPickList();
      if(this.selectedAnswerType == answerTypeEnum.singleSelect || this.selectedAnswerType == answerTypeEnum.multiSelect){
        this.presetTags();
      }
    }
    
  }
  
  presetTags(){
     if( this.answerObjectModel && Object.keys(this.answerObjectModel).length > 0){     
         for(let answer in this.answerObjectModel){
                if(!this.answerObjectModel[answer].hasOwnProperty('FieldName') && !this.answerObjectModel[answer].hasOwnProperty('ObjectName')){
                     this.answerObjectModel[answer].FieldName = this.answerObjectModel[this.selectedAnswer.AnswerId].FieldName;
                     this.answerObjectModel[answer].ObjectName =  this.answerObjectModel[this.selectedAnswer.AnswerId].ObjectName;
                     this.answerObjectModel[answer].AnswerText = this.answerObjectModel[this.selectedAnswer.AnswerId].AnswerText;
                }
         }
     }
  }

}
