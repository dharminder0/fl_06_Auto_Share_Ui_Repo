import {Component,OnInit,ViewChild,ViewContainerRef,ComponentFactoryResolver,OnDestroy,Inject,AfterViewInit,Input,Output,EventEmitter} from "@angular/core";
import { SetCorrectAnswerComponent } from "./set-correct-answer/set-correct-answer.component";
import {ActivatedRoute,NavigationEnd,Router,NavigationStart} from "@angular/router";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import { QuizBuilderApiService } from "../../quiz-builder-api.service";
import { NotificationsService } from "angular2-notifications";
import { QuizzToolHelper } from "../quiz-tool-helper.service";
import { environment } from "../../../../environments/environment";
import { BsModalRef } from "ngx-bootstrap";
import { DOCUMENT, Location } from "@angular/common";
import { SetTagsComponent } from "./set-tags/set-tags.component";
import { QuizToolData } from "../quiz-tool.data";
import { EditResultCorelationsComponent } from "./edit-result-corelations/edit-result-corelations.component";
import { FroalaEditorOptions } from "../../email-sms/template-body/template-froala-options";
import { UserInfoService } from "../../../shared/services/security.service";
import { QuizBuilderDataService } from '../../quiz-builder-data.service';
import { Config } from '../../../../config';
import { DynamicMediaReplaceMentsService } from '../dynamic-media-replacement';
import { Subscription } from 'rxjs';
import { rightMenuEnum } from '../rightmenu-enum/rightMenuEnum';
import { RemoveallTagPipe } from "../../../shared/pipes/search.pipe";
import { QuizDataService } from "../../../quiz/quiz-data.service";
import { answerTypeEnum, BrandingLanguage, elementDisplayOrder, elementReorderKey, enableItemPage, QuizAnswerStructureType } from "../commonEnum";
import { CommonService } from "../../../shared/services/common.service";
import { VariablePopupService } from "../../../shared/services/variable-popup.service";
import { TextViewComponent } from "./text-view/text-view.component";
import { BranchingLogicAuthService } from "../branching-logic-auth.service";
import { ImageViewComponent } from "./image-view/image-view.component";
import { SharedService } from "../../../shared/services/shared.service";
declare var cloudinary: any;
declare var $: any;
const TABS = ["tab-01", "tab-02", "tab-03"];
const filterPipe = new RemoveallTagPipe();
@Component({
  selector: "app-questions",
  templateUrl: "./questions.component.html",
  styleUrls: ["./questions.component.css"],
})
export class QuestionsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("setCorrectAnswerTemplate", { read: ViewContainerRef , static:true})
  setCorrectAnswerTemplate: ViewContainerRef;
  @Input() isOpenBranchingLogicSide;
  @Output() updateBranchingLogic: EventEmitter<any> = new EventEmitter<any>();
  public questionForm: FormGroup;
  public tab: string;
  @Input() questionData;
  public showQuestionImage: boolean = false;
  public showDescriptionImage:boolean = false;
  public setCorrectAnswerChangeSubscription;
  public quizId = null;
  public modalRef: BsModalRef;
  public valueChangesSubscription;
  public quizURL;
  public that;
  public dublicateCur;
  public selectedQuiz;
  public hostURL;
  public imageORvideo;
  public descriptionImageORvideo;
  public questionDataModel;
  public routerEventSubscription;
  public quizTypeId;
  public updatedScore;
  public brandingColor;
  public previousButtonSettingData;
  public resetButton:boolean = false;
  // public options : any ;
  // public optionsDes : any ;
  public nextBtnOptions: object;
  public froalaEditorOptions = new FroalaEditorOptions();
  public classList =["question-title"];
  public defaultCoverImage:any="https://res.cloudinary.com/dbbkqtyqn/image/upload/v1588680596/Jobrock/automation-place-holder-corner.png";
  //mediafile
  public isVisibleMediaLibrary:boolean=false;
  public config = new Config();
  private isDynamicMediaDataSubscription: Subscription;
  private isAnswerTypeObservableSubscription: Subscription;
  private isImageAnswerTypeObservableSubscription: Subscription;
  private isAnswerResultSettingObservableSubscription: Subscription;
  private isAnswerReorderSettingObservableSubscription: Subscription;
  private isElementObservableSubscription: Subscription;
  public isAutoPlay:boolean;
  public isDesAutoPlay:boolean;
  public hasObjectMappingFields:boolean = false;
  public isProcess:boolean = false;
  public isQuestionEnable:boolean;
  public enableNextButton:boolean = false;
  public isDesImage;
  public isQuestionDesEnable:boolean = false;
  public hoverOnMainDiv:boolean = false;
  public hoverOnMediaDiv:boolean = false;
  public questionElementReorder:any;

public elementObj:any;
public selectedAnwser:any;
public isAnswerTypeChange:boolean = false;
private isVideoSoundEnableSubscription:Subscription;
public isWhatsappEnable: boolean;
private isWhatsappEnableSubscription: Subscription;
private isStylingSubscription: Subscription;
//country code start
public getPostalCountryList;
public selectAll: boolean = false;
public selectedCountcodeArray = [];
public selectedCountryNameArray = [];
public selectedCountryName = '';
public answerDisplayOrder;
public isAllSelectCountry:boolean = false;

public answerStructureType: number = QuizAnswerStructureType.default;
public QTitleMaxLength: any = 60;
public DescriptionMaxLength: any = 1024;

private isvideoSecondsToApplySubscription: Subscription;
private isEnableSetFrameToggleObservableSubscription: Subscription;
private quizBuilderDataServiceSubscription: Subscription;
public answerVideoDuration;
public elementReorderKey = elementReorderKey;
public isDuplicateAnswerExist: boolean = false;
public isEnableMultiRating:boolean = false;
public isQuesAndContentInSameTable:boolean;
public IsBranchingLogicEnabled:boolean;
public enabledPermissions:any = {};
public userInfo:any = {};
public isTagPremission:boolean = false;
public clientAtsFieldsList:any = {};
public isHoveredOnButton = false;

public get QuizAnswerStructureType(): typeof QuizAnswerStructureType{
  return QuizAnswerStructureType;
}
public get AnswerTypeEnum(): typeof answerTypeEnum{
  return answerTypeEnum
}
//country code end
  constructor(
    private _crf: ComponentFactoryResolver,
    private router: Router,
    private _fb: FormBuilder,
    @Inject(DOCUMENT) private document: Document,
    private notificationsService: NotificationsService,
    private quizBuilderApiService: QuizBuilderApiService,
    private quizzToolHelper: QuizzToolHelper,
    private userInfoService: UserInfoService,
    private route: ActivatedRoute,
    private location: Location,
    private quizToolData:QuizToolData,
    private quizBuilderDataService:QuizBuilderDataService,
    private dynamicMediaReplaceService:DynamicMediaReplaceMentsService,
    private quizDataService: QuizDataService,
    private commonService:CommonService,
    private variablePopupService:VariablePopupService,
    private branchingLogicAuthService:BranchingLogicAuthService,
    private sharedService: SharedService
  ) {
    this.userInfo = this.userInfoService._info;
    this.enabledPermissions = JSON.parse(JSON.stringify(this.userInfoService.userPermissions));
    if(this.variablePopupService.showExtVariablePopup && !(this.variablePopupService.mappedSfFieldsObj && Object.keys(this.variablePopupService.mappedSfFieldsObj).length > 0)
      && this.enabledPermissions.isJRSalesforceEnabled && this.userInfo.AccountLoginType == 'salesforce' && this.enabledPermissions.isNewVariablePopupEnabled ){
      this.getMappedSfFieldsList(); 
    }
  }

  ngOnInit() {
    this.route.parent.parent.params.subscribe(params => {
      if(params["id"]){
        this.quizId = params["id"];
      }else{
        this.route.parent.params.subscribe(params => {
          this.quizId = +params["id"];
        });
      }
    });
    this.isTagPremission = this.userInfo.IsContactTagsPermission
    this.hostURL = this.location["_platformLocation"].location.host;
    // this.options = this.froalaEditorOptions.setEditorOptions(2000);
    this.updateFroalaOptionsAndEvents();
    this.nextBtnOptions = this.froalaEditorOptions.setEditorOptions(45,'Volgende');
    this.getPostalCountryList = this.quizDataService.postalCountryList;
    this.quizTypeId = this.quizzToolHelper.quizTypeId;
    this.questionElementReorder = this.commonService.getElementReorderStr();
    this.questionElementReorder.push({
      "displayOrder": elementDisplayOrder.question,
      "key": elementReorderKey.question
    });
    this.getBrandingColors();
    this.setTab();
    this.getSnapShotData();
    this.initializeComponent();
    this.routerParamSubscription();
    this.whenSetCorrectAnswerSaved();
    this.getVideoChangeTime();
    this.getSetFrameToggle();
    if(!this.isOpenBranchingLogicSide){
      this.assignTagsForCloudinary();
    }
    if(this.quizTypeId == 4 || this.quizTypeId == 6){
    this.updateAnsweScore();
    }
    this.onSaveQuizSubscription();
    this.getDynamicMediaData();
    this.getClientObjectMappingDetails();
    this.getDateTypeFieldSettings();
    this.AnswerResultSettingSubscription();
    this.getWhatsappUsage(); 
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

  onSaveQuizSubscription(){
    this.quizBuilderDataServiceSubscription = this.quizBuilderDataService.currentQuizSaveAll.subscribe( (res) => {
      if(res){
        if(!this.commonService.checkSelectedQuestionValidity()){
          this.save();
        }
      }
    });
  }

  AnswerResultSettingSubscription(){
    this.isAnswerResultSettingObservableSubscription = this.dynamicMediaReplaceService.isAnswerResultSettingObservable.subscribe(res => {
      if(res){
        if(this.questionForm.controls.QuestionId.value == res.questionId){
          //answer display order shorting
          if(this.answerDisplayOrder && this.answerDisplayOrder.Answers && this.answerDisplayOrder.Answers.length > 0){
            this.questionForm.controls.AnswerList.value.map(answerObj => {
              let selectedDisplayAnswerObj;
              selectedDisplayAnswerObj = this.answerDisplayOrder.Answers.filter(ansDisplayOrder => {
                return answerObj.AnswerId == ansDisplayOrder.AnswerId;
              });
              answerObj.DisplayOrder = selectedDisplayAnswerObj[0].DisplayOrder;
            });
            this.questionForm.controls.AnswerList.value.sort((a, b) => (a.DisplayOrder > b.DisplayOrder) ? 1 : -1);
            this.answerDisplayOrder = null;
          }

          if(this.isOpenBranchingLogicSide){
            this.muteVideos();
          }
            if(this.quizTypeId == 3 || this.quizTypeId == 7){
              this.dynamicTemplateEditResultCorrelation();
            }else{
              this.dynamicTemplateSetCorrectAnswer();
            }
        }
      }
    });
  }

  getBrandingColors(){
    this.isStylingSubscription = this.quizzToolHelper.isStylingObservable.subscribe((data) => {
      if(data && Object.keys(data).length > 0){
         this.brandingColor = data
      }else{
        this.brandingColor = this.quizzToolHelper.getBrandingAndStyling();
      }
      this.brandingColor.NextButtonText = this.brandingColor.Language == BrandingLanguage.Dutch ? 'Volgende' : 'Next';
   })
  }

  getVideoChangeTime(){
    this.isvideoSecondsToApplySubscription = this.dynamicMediaReplaceService.videoTimeChangeObservable.subscribe(res => {
       if(res && Object.keys(res).length != 0 && this.questionForm.controls.QuestionId.value == res.id){
         if(res.page == 'question_page' && this.questionForm.get('SecondsToApply').value != res.secToApply){
          this.questionForm.patchValue({'SecondsToApply': res.secToApply});
         }
         else if(res.page == 'question_des_page' && this.questionForm.get('SecondsToApplyForDescription').value != res.secToApply){
          this.questionForm.patchValue({'SecondsToApplyForDescription': res.secToApply});
         }
         this.questionForm.markAsDirty();
       }
     });
  }
  getSetFrameToggle(){
    this.isEnableSetFrameToggleObservableSubscription =  this.dynamicMediaReplaceService.isEnableSetFrameToggleObservable.subscribe((res) =>{
      if(res && Object.keys(res).length != 0 && this.questionForm.controls.QuestionId.value == res.id){
        if(res.page == 'question_page' && this.questionForm.get('VideoFrameEnabled').value != res.VideoFrameEnabled){
         this.questionForm.patchValue({'VideoFrameEnabled': res.VideoFrameEnabled});
        }
        else if(res.page == 'question_des_page' && this.questionForm.get('DescVideoFrameEnabled').value != res.VideoFrameEnabled){
         this.questionForm.patchValue({'DescVideoFrameEnabled': res.VideoFrameEnabled});
        }
        this.questionForm.markAsDirty();
      }
    });
 }

  getWhatsappUsage(){
    this.isWhatsappEnableSubscription = this.dynamicMediaReplaceService.isUsageTypeWhatsAppObservable.subscribe(res => {
      if(res && this.questionForm.controls.ShowAnswerImage.value && this.selectedAnswerType < '3'){
        this.tab = "tab-01";
      }else if(this.questionForm.controls.ShowAnswerImage.value && this.selectedAnswerType < '3'){
        this.tab = "tab-02";
      }
      this.isWhatsappEnable = res;
      this.commonService.isWhatsappEnable = this.isWhatsappEnable;
      // update text-view input() data (answerStructureType) only after getUsage response 
      if(this.isWhatsappEnable){
        if(this.questionData.AnswerStructureType == 0){
          this.updateAnsStructureType(this.questionData.AnswerType);
          this.questionData.answerStructureType = this.answerStructureType;
          this.questionForm.patchValue({
            'AnswerStructureType':this.answerStructureType
          });
        }
        this.updateFroalaOptionsAndEvents();
        this.updateFormForWhatsAppChatbotFlow();
      }
    });
  }

  getClientObjectMappingDetails(){
    this.quizBuilderApiService.getObjectFieldsList().subscribe(data => {

      if(data && data.data && data.data.length > 0){
        this.quizzToolHelper.clientObjectFieldsList = data.data;
        this.hasObjectMappingFields = true;

        if(!(this.quizzToolHelper.clientAtsFieldsList && Object.keys(this.quizzToolHelper.clientAtsFieldsList).length > 0)){
          this.quizzToolHelper.clientAtsFieldsList = {};

          this.quizzToolHelper.clientObjectFieldsList.forEach((currObj:any) => {
            if(currObj.Fields && currObj.Fields.length > 0){
              currObj.Fields.map((subObj:any) => {
                this.quizzToolHelper.clientAtsFieldsList[`${currObj.ObjectName}.${subObj.Name}`] = subObj.DisplayName;
              });
            }
          });
        }
        this.clientAtsFieldsList = JSON.parse(JSON.stringify(this.quizzToolHelper.clientAtsFieldsList));
      }
    });
  }


  getDynamicMediaData(){
    this.isAutoPlay = this.questionForm.get('AutoPlay').value;
    this.isDesAutoPlay = this.questionForm.get('AutoPlayForDescription').value;
    this.isDynamicMediaDataSubscription = this.dynamicMediaReplaceService.isEnableMediaSetiingObjectObservable.subscribe(item=>{
      if(item && this.questionForm.controls.QuestionId.value == item.id && item.page == 'question_page' && item.data != undefined && item.autoPlayData != undefined){
        let oldEnableMediaFile =this.questionForm.get('EnableMediaFile').value;
        let oldAutoPlayData =this.questionForm.get('AutoPlay').value;
        if(oldEnableMediaFile != item.data || oldAutoPlayData != item.autoPlayData){
          this.questionForm.patchValue({'EnableMediaFile': item.data});
          this.questionForm.patchValue({'AutoPlay': item.autoPlayData});
          this.isAutoPlay = item.autoPlayData; 
          this.questionForm.markAsDirty();
        }
      }
      if(item && this.questionForm.controls.QuestionId.value == item.id && item.page == 'question_des_page' && item.data != undefined && item.autoPlayData != undefined){
        let oldEnableMediaFile =this.questionForm.get('EnableMediaFileForDescription').value;
        let oldAutoPlayData =this.questionForm.get('AutoPlayForDescription').value;
        if(oldEnableMediaFile != item.data || oldAutoPlayData != item.autoPlayData){
        this.questionForm.patchValue({'EnableMediaFileForDescription': item.data});
        this.questionForm.patchValue({'AutoPlayForDescription': item.autoPlayData});
        this.isDesAutoPlay = item.autoPlayData; 
        this.questionForm.controls.EnableMediaFileForDescription.markAsDirty();
        }
      }
    });
  }


  ngAfterViewInit(){
    $(".dropdown-container, .btn-save, .btn-close").on('click', function() {
      $(".answer-type-dropdown").toggleClass('open')
    })

    this.classList.forEach((data)=>{
      this.setStyling(data);
    });
    //set height of description text area reflect only in case of whatsapp flow  
    setTimeout(() => {
      this.setAutoHeightOfTextArea('whtsAp_desc_'+this.questionData.QuestionId);
    }, 500);
  }

  onTextViewChange(e){
    if(this.isWhatsappEnable && parseInt(this.selectedAnswerType) == answerTypeEnum.singleSelect){
      // this.commonService.answerTextList[e.id] = this.variablePopupService.convertToPlainText(this.variablePopupService.updateTemplateVarHTMLIntoVariableV2(e.answer)).replace(/\#\$/g, '').replace(/\$\#/g,'');
      this.commonService.answerTextList[e.id] = e.answer;
    }
    this.questionForm.get(`AnswerList.${e.id}.AnswerText`).patchValue(e.answer.trim());
    if(e.countryList && (parseInt(this.selectedAnswerType) == answerTypeEnum.postCode || parseInt(this.selectedAnswerType) == answerTypeEnum.fullAddress)){
      this.questionForm.get(`AnswerList.${e.id}.ListValues`).patchValue(e.countryList);
      this.questionForm.markAsDirty();
    }
  }

  setStyling(elem){
    if(document.getElementsByClassName(elem)[0] && document.getElementsByClassName(elem)[0].childNodes[1]){
      var data = document.getElementsByClassName(elem)[0].childNodes[1].childNodes[0]['style']
      data.resize="vertical";
      data.background= this.brandingColor.BackgroundColor;
      data.color= this.brandingColor.FontColor;
      data.fontFamily=this.brandingColor.FontType;
    }
  }

// udatading the answer Score Data
  updateAnsweScore(){
      this.updatedScore = this.quizzToolHelper.updatedAnswerScoredData.skip(1).subscribe(
      data => {
        this.fetchQuestionDetails();
      }
    )

  }


  private assignTagsForCloudinary(){
    if(this.quizToolData.getCurrentOfficeName()){
      this.C_tags = this.quizToolData.getCurrentOfficeName();
    }else{
      this.C_tags = []
    }
  }


  /**
   * Function to update the question in the sidebar option dynamically when
   * user changes the data in the title
   */
  onQuestionTitleTextChanges() {

    this.valueChangesSubscription = this.questionForm
      .get("QuestionTitle")
      .valueChanges.debounceTime(500)
      .subscribe(changedTitle => {
        $(document).ready(function () {
          $(window).on("beforeunload", function () {
            // return confirm("Do you really want to close?");
            return "";
          });
        });
        var questionInfo = {
          QuestionId: this.questionForm.controls.QuestionId.value,
          // QuestionTitle: this.questionForm.controls.QuestionTitle.value
          QuestionTitle: this.variablePopupService.updateTemplateVarHTMLIntoVariableV2(this.questionForm.controls.QuestionTitle.value)
        };
        this.quizzToolHelper.updateSidebarOptionsQuestionTitle.next(
          questionInfo
        );
      });
      let self = this;
      setTimeout(function(){  
        var questionInfo = {
          QuestionId: self.questionForm.controls.QuestionId.value,
          QuestionTitle: self.variablePopupService.updateTemplateVarHTMLIntoVariableV2(self.questionForm.controls.QuestionTitle.value)
        };
        self.quizzToolHelper.updateSidebarOptionsQuestionTitle.next(
          questionInfo
        );
      }, 500);
  }

  /**
   * Create Set correct answer template
   */
  public dynamicTemplateSetCorrectAnswer() {
    /** Save the Data Before opening Choose the correct  Answer */
    this.save();
    this.setCorrectAnswerTemplate.clear();
    var SectionCorrectAnswerTemplate = this._crf.resolveComponentFactory(
      SetCorrectAnswerComponent
    );
    var SectionCorrectAnswerComponentRef = this.setCorrectAnswerTemplate.createComponent(
      SectionCorrectAnswerTemplate
    );
    SectionCorrectAnswerComponentRef.instance.questionData = JSON.parse(JSON.stringify(this.questionForm.value));
    if(this.questionData.AnswerType == answerTypeEnum.singleSelect || this.questionData.AnswerType == answerTypeEnum.multiSelect){
      SectionCorrectAnswerComponentRef.instance.questionData.AnswerList.map(answer => {
        answer.AnswerText = this.variablePopupService.updateTemplateVarHTMLIntoVariableV2(answer.AnswerText);
        return true;
      });
    }
    SectionCorrectAnswerComponentRef.instance.answerTypeData = +this.selectedAnswerType;
    SectionCorrectAnswerComponentRef.instance.isOpenBranchingLogicSide = this.isOpenBranchingLogicSide;
    SectionCorrectAnswerComponentRef.instance.isWhatsappEnable = this.isWhatsappEnable;
    SectionCorrectAnswerComponentRef.instance.editBranchingData.subscribe(data => {
      if(data){
        this.updateBranchingLogic.emit();
      }
    });
  }

  dynamicTemplateEditResultCorrelation()
  {
    this.save();
    this.setCorrectAnswerTemplate.clear();
    var SectionCorrectAnswerTemplate = this._crf.resolveComponentFactory(
      EditResultCorelationsComponent
    );
    var SectionCorrectAnswerComponentRef = this.setCorrectAnswerTemplate.createComponent(
      SectionCorrectAnswerTemplate
    );
    SectionCorrectAnswerComponentRef.instance.questionData = this.questionForm.value;
    SectionCorrectAnswerComponentRef.instance.IsMultiRating = this.isEnableMultiRating;
    SectionCorrectAnswerComponentRef.instance.answerTypeData = +this.selectedAnswerType;
    SectionCorrectAnswerComponentRef.instance.editQuestionData.subscribe(data => {
      this.fetchQuestionDetails();
    });
  }

  answerReorderingInQuestionId(data){
    this.answerDisplayOrder = data;
    this.quizBuilderApiService.reorderAnswerInQuestionId(data)
    .subscribe((data) => {
      if(this.isOpenBranchingLogicSide){
        this.questionForm.markAsDirty();
      }
    }, (error) => {});
  }

  /**
   * Create Set tag answer template
   */
  onAnswerTag(event){
    //answer display order shorting
    if(this.answerDisplayOrder && this.answerDisplayOrder.Answers && this.answerDisplayOrder.Answers.length > 0){
        this.questionForm.controls.AnswerList.value.map(answerObj => {
        let selectedDisplayAnswerObj;
        selectedDisplayAnswerObj = this.answerDisplayOrder.Answers.filter(ansDisplayOrder => {
          return answerObj.AnswerId == ansDisplayOrder.AnswerId;
        });
        answerObj.DisplayOrder = selectedDisplayAnswerObj[0].DisplayOrder;
        });
        this.questionForm.controls.AnswerList.value.sort((a, b) => (a.DisplayOrder > b.DisplayOrder) ? 1 : -1);
        this.answerDisplayOrder = null;
      }

      if(this.isOpenBranchingLogicSide){
        this.muteVideos();
      }
    
    this.dynamicTemplateSetTags(event);
  }

  onAddRemoveAnser(){
    this.updateBranchingLogic.emit();
  }

  /**
   * Create Set catgegories answer template
   */
  public dynamicTemplateSetTags(answerId?, mappingFor ='Answer') {
    /** Save the Data Before opening Choose the correct  Answer */
    this.save();
    this.setCorrectAnswerTemplate.clear();
    var SectionCorrectAnswerTemplate = this._crf.resolveComponentFactory(
      SetTagsComponent
    );
    var SectionCorrectAnswerComponentRef = this.setCorrectAnswerTemplate.createComponent(
      SectionCorrectAnswerTemplate
    );
    SectionCorrectAnswerComponentRef.instance.questionData = JSON.parse(JSON.stringify(this.questionForm.value));
    SectionCorrectAnswerComponentRef.instance.isWhatsappEnable = this.isWhatsappEnable;
    SectionCorrectAnswerComponentRef.instance.mappingFor = mappingFor;
    if(this.questionData.AnswerType == answerTypeEnum.singleSelect || this.questionData.AnswerType == answerTypeEnum.multiSelect){
      SectionCorrectAnswerComponentRef.instance.questionData.AnswerList.map(answer => {
        answer.AnswerText = this.variablePopupService.updateTemplateVarHTMLIntoVariableV2(answer.AnswerText);
        return true;
      });
    }
    SectionCorrectAnswerComponentRef.instance.answerTypeData = +this.selectedAnswerType;
    SectionCorrectAnswerComponentRef.instance.selectedAnswerId = answerId;
  }

  /**
   * Function called when user saves set correct answer in SetCorrectAnswerComponent
   */
  whenSetCorrectAnswerSaved() {
    this.setCorrectAnswerChangeSubscription = this.quizzToolHelper
      .whenUpdateQuestionData()
      .subscribe(data => {
        if(data instanceof Object){
          this.fetchQuestionDetails();
        }
      });
  }

  /**
   * Function to Fetch QuestionDetails against questionId
   */
  fetchQuestionDetails() {
    this.quizBuilderApiService
    .getQuestionDetails(this.questionForm.controls.QuestionId.value,this.quizId)
    .subscribe(
      questionData => {
          this.questionData = questionData;        
          this.answerStructureType = this.questionData.AnswerStructureType;
          this.questionForm.reset();
          this.initializeComponent();
      },
      error => {
        this.notificationsService.error("Error");
      }
    );
  }

  /**
   * Function to switch tabs;
   * if tab==tab-01 then patch value with false
   * else patch with true
   */
  linkDisabled : {};
  linkdisabled : {};
  linkDisabled1 : {};
  linkdisabled1 : {};
  public switchTab(tabId: string) {
    this.setTab(tabId);
    this.questionForm.controls.ShowAnswerImage.patchValue(
      tabId == "tab-01" || tabId == "tab-03" ? false : true
    );
    this.questionForm.controls['ShowAnswerImage'].markAsDirty();
  }

  /**
   * Function to save the Question via API endpoint
   */
  public save() {
    if(this.questionForm.controls.AnswerType.value == '11' && this.isEnableMultiRating){
      this.setEmojiMultiSelectType();
    }
    let requestPayload: any = {};
    const filterQuestionTitle = filterPipe.transform(this.questionForm.value.QuestionTitle ? this.questionForm.value.QuestionTitle : '');
    if ((this.questionForm.dirty || this.resetButton)) {
      this.questionForm.controls.ShowAnswerImage.patchValue(
        this.tab == "tab-01" || this.tab == "tab-03" ? false : true
      );
      requestPayload = JSON.parse(JSON.stringify(this.questionForm.value));  
      if((!this.isAnswerTypeChange || !(filterQuestionTitle && filterQuestionTitle.trim())) && this.commonService.checkSelectedQuestionValidity()){
        return false;  
      }
      this.questionForm.controls['ShowAnswerImage'].markAsDirty();
      this.updatePayloadForVariables(requestPayload);
      this.quizBuilderApiService
        .updateQuestionDetails(requestPayload, this.isWhatsappEnable)
        .subscribe(
          data => {
            $(window).off("beforeunload");
            this._markFormPristine(this.questionForm);
            this.quizzToolHelper.updateQuestionData(null);
            if(this.dynamicMediaReplaceService.IsQuesAndContentInSameTable){
              this.dynamicMediaReplaceService.isSelectedQuesAndContent = {
                "questionId":this.questionForm.controls.QuestionId.value,
                "type":this.questionForm.controls.Type.value
              }
              this.dynamicMediaReplaceService.changeSelectedQuesAndContentSubmission();
            }
            if(this.isAnswerTypeChange){
              this.isAnswerTypeChange = false;
              this.answerTypeChangeSave();
            }
            if(this.isOpenBranchingLogicSide){
              this.updateBranchingLogic.emit();
            }
          },
          error => {
            this.notificationsService.error("Error", error.error.message);
            if(this.isAnswerTypeChange){
              this.isAnswerTypeChange = false;
              this.answerTypeChangeSave();
            }
          }
        );
    }
  }

  private _markFormPristine(form: FormGroup): void {
    Object.keys(form.controls).forEach(control => {
      form.controls[control].markAsPristine();
    });
  }

  /**
   * Subscription for listening to router change
   */
  private routerParamSubscription() {
    this.routerEventSubscription = this.router.events.subscribe(event => {
      
      if (event instanceof NavigationStart) {
        this.save();
      }
      if (event instanceof NavigationEnd) {
        this.getSnapShotData();
        this.initializeComponent();
      }
    });
  }

  /**
   * Initializer when component loades or route changes
   */
  private initializeComponent() {
    // if(this.isWhatsappEnable){
    //   this.questionData.QuestionTitle = this.questionData.QuestionTitle.replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/\s/g,"&nbsp;");
    //   this.questionData.Description = this.questionData.Description.replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/\s/g,"&nbsp;");
    // }
    
    // if(this.questionData.AnswerType == answerTypeEnum.singleSelect || this.questionData.AnswerType == answerTypeEnum.multiSelect && this.enabledPermissions.isJRSalesforceEnabled && this.userInfo.AccountLoginType == 'salesforce' && this.isTagPremission){
    if((this.questionData.AnswerType == answerTypeEnum.singleSelect || this.questionData.AnswerType == answerTypeEnum.multiSelect) && this.enabledPermissions.isJRSalesforceEnabled && this.userInfo.AccountLoginType == 'salesforce'){
        let ObjectFieldsInAnswer: any = {}
        for(let i =0; i < this.questionData.AnswerList.length; i++){
          if(this.questionData.AnswerList[i].ObjectFieldsInAnswer && this.questionData.AnswerList[i].ObjectFieldsInAnswer.FieldName && !ObjectFieldsInAnswer.FieldName){
            ObjectFieldsInAnswer = JSON.parse(JSON.stringify(this.questionData.AnswerList[i].ObjectFieldsInAnswer));
            ObjectFieldsInAnswer.IsExternalSync = false;
            break;
           }
        }
        this.questionData.AnswerList.map((AnswerList, index)=>{
           if(AnswerList.ObjectFieldsInAnswer == null && ObjectFieldsInAnswer.FieldName){
            // ObjectFieldsInAnswer.Value = JSON.parse(JSON.stringify(AnswerList.AnswerText))
            this.questionData.AnswerList[index].ObjectFieldsInAnswer = JSON.parse(JSON.stringify(ObjectFieldsInAnswer));
           }
        })
      
    }
    // if(this.enabledPermissions.isJRSalesforceEnabled && this.userInfo.AccountLoginType == 'salesforce' && this.isTagPremission && this.commonService.isAnswerChange){
    if(this.enabledPermissions.isJRSalesforceEnabled && this.userInfo.AccountLoginType == 'salesforce' && this.commonService.isAnswerChange){
      let bodyObj:any[] = [];
      this.questionData.AnswerList.map((answerList)=>{
        if(answerList.ObjectFieldsInAnswer == null){
          switch (this.questionData.AnswerType) {
            case answerTypeEnum.postCode: 
              bodyObj.push({
                "AnswerId": answerList.AnswerId,
                "ObjectName": 'Contact',
                "FieldName": 'PostalCode',
                "Value": "",
                "IsExternalSync": true
              });            
              break;
          
            case answerTypeEnum.dateOfBirth: 
              bodyObj.push({
                "AnswerId": answerList.AnswerId,
                "ObjectName": 'Contact',
                "FieldName": 'BirthDate',
                "Value": "",
                "IsExternalSync": true
              });            
              break;
          
            case answerTypeEnum.availability: 
              bodyObj.push({
                "AnswerId": answerList.AnswerId,
                "ObjectName": 'Contact',
                "FieldName": 'AvailableFromDate',
                "Value": "",
                "IsExternalSync": true
              });            
              break;
          
            case answerTypeEnum.FirstName: 
              bodyObj.push({
                "AnswerId": answerList.AnswerId,
                "ObjectName": 'Contact',
                "FieldName": 'FirstName',
                "Value": "",
                "IsExternalSync": true
              });            
              break;
          
            case answerTypeEnum.LastName: 
              bodyObj.push({
                "AnswerId": answerList.AnswerId,
                "ObjectName": 'Contact',
                "FieldName": 'LastName',
                "Value": "",
                "IsExternalSync": true
              });            
              break;
          
            case answerTypeEnum.Email: 
              bodyObj.push({
                "AnswerId": answerList.AnswerId,
                "ObjectName": 'Contact',
                "FieldName": 'Email',
                "Value": "",
                "IsExternalSync": true
              });            
              break;
          
            case answerTypeEnum.PhoneNumber: 
              bodyObj.push({
                "AnswerId": answerList.AnswerId,
                "ObjectName": 'Contact',
                "FieldName": 'Phone',
                "Value": "",
                "IsExternalSync": true
              });            
              break;
          
            default:
              break;
          }
        }
    });
    if(bodyObj && bodyObj.length > 0){
  
      this.quizBuilderApiService.updateAnswerObjectMapping(bodyObj).subscribe(data => {
        // this.quizzToolHelper.updateQuestionData(bodyObj);
        this.fetchQuestionDetails();
      })
    }
  }
    this.commonService.isAnswerChange = false;
    this.answerDisplayOrder = null;
    this.createForm(this.questionData);
    this.commonService.questionForm = this.questionForm;
    // this.isWhatsappEnable ? this.updateDescriptionFieldV2() : false;
    this.patchAnswerList(this.questionData.AnswerList);
    this.updateQuestionVarList();
    this.onQuestionTitleTextChanges();
    this.changeComponent();
    this.showQuestionImage = this.questionForm.controls.ShowQuestionImage.value;
    this.showDescriptionImage = this.questionForm.controls.ShowDescriptionImage.value;
    this.enableNextButton = this.questionForm.controls.EnableNextButton.value;
    let selectedAnswerType = parseInt(this.selectedAnswerType)
    if(selectedAnswerType > 4){
      this.tab = "tab-03";
    } 
    else if(selectedAnswerType < 3){
      this.tab = this.questionForm.controls.ShowAnswerImage.value
      ? "tab-02"
      : "tab-01";
    }
    if(selectedAnswerType == 3 || selectedAnswerType == 4){
      this.tab = "tab-01";
    } 

    if(selectedAnswerType == 10 || selectedAnswerType == 11 || selectedAnswerType == 12 || selectedAnswerType == 13){
      this.tab = "tab-03";
    } 

  }

  setEmojiMultiSelectType(){
    for(let i=0; i <this.questionForm.controls.AnswerList.value.length; i++){
      let ratingAnswerText;
      if(i==0){
        ratingAnswerText = this.questionForm.controls.AnswerList.value[0].OptionTextforRatingOne;
      }else if(i==1){
        ratingAnswerText = this.questionForm.controls.AnswerList.value[0].OptionTextforRatingTwo;
      }
      else if(i==2){
        ratingAnswerText = this.questionForm.controls.AnswerList.value[0].OptionTextforRatingThree;
      }
      else if(i==3){
        ratingAnswerText = this.questionForm.controls.AnswerList.value[0].OptionTextforRatingFour;
      }
      else if(i==4){
        ratingAnswerText = this.questionForm.controls.AnswerList.value[0].OptionTextforRatingFive;
      }
      this.questionForm.controls.AnswerList.value[i].AnswerText = ratingAnswerText;
    }
  }

  changeComponent(){
    if(this.questionForm.controls.Type.value){
      if(this.questionForm.controls.Type.value == 2){
        this.isQuestionEnable = true;
      }else{
        this.isQuestionEnable = false;
      }
    }
    if(this.questionForm){
      this.enableNextButton = this.questionForm.controls.EnableNextButton.value;
      this.showQuestionImage = this.questionForm.controls.ShowQuestionImage.value;
      this.showDescriptionImage = this.questionForm.controls.ShowDescriptionImage.value;
      this.isQuestionDesEnable = this.questionForm.controls.ShowDescription.value;
      this.questionElementReorder.map(coverReorder => {
        if(coverReorder.key == this.elementReorderKey.title){
          coverReorder.displayOrder = this.questionForm.get('DisplayOrderForTitle').value;
        }else if(coverReorder.key == this.elementReorderKey.media){
          coverReorder.displayOrder = this.questionForm.get('DisplayOrderForTitleImage').value;
        }else if(coverReorder.key == this.elementReorderKey.description){
          coverReorder.displayOrder = this.questionForm.get('DisplayOrderForDescription').value;
          coverReorder.disMedia.displayOrder = this.questionForm.get('DisplayOrderForDescriptionImage').value;
        }else if(coverReorder.key == this.elementReorderKey.button){
          coverReorder.displayOrder = this.questionForm.get('DisplayOrderForNextButton').value;
        }else if(coverReorder.key == this.elementReorderKey.question){
          coverReorder.displayOrder = this.questionForm.get('DisplayOrderForAnswer').value;
        }
      });
      this.questionElementReorder.sort((a, b) => (a.displayOrder > b.displayOrder) ? 1 : -1)
    }
    this.onChangeAnswerType();
    this.onAnswerImageType();
    this.onElementChange();
  }

  onChangeAnswerType(){
    if(this.isAnswerTypeObservableSubscription){
      this.isAnswerTypeObservableSubscription.unsubscribe();
    }
    this.isAnswerTypeObservableSubscription = this.dynamicMediaReplaceService.isAnswerTypeObservable.subscribe(res => {
      if(res){
        if(
          this.questionForm.controls.QuestionId.value == res.questionId && 
          (this.selectedAnswerType != res.awnserType || (this.isWhatsappEnable && (this.answerStructureType != res.answerStructureType)))
        ){
          this.selectedAnswerType = res.awnserType;
          this.isAnswerTypeChange = true;
          this.answerStructureType = res.answerStructureType;
          this.isEnableMultiRating = res.isEnableMultiRating;
          // to bypass checkSelectedQuestionValidity() for duplicate answer validity check
          if(this.isWhatsappEnable){
            this.commonService.answerTextList = [];
          }
          this.questionForm.markAsDirty();
          this.save();
        }
      }
    });
  }

  onAnswerImageType(){
    if(this.isImageAnswerTypeObservableSubscription){
      this.isImageAnswerTypeObservableSubscription.unsubscribe();
    }
    this.isImageAnswerTypeObservableSubscription = this.dynamicMediaReplaceService.isAnswerTextImageObservable.subscribe(res => {
      if(res){
        if(res.tab && this.questionForm.controls.QuestionId.value == res.questionId && this.selectedAnswerType == res.awnserType){
          // const filterQuestionTitle = filterPipe.transform(this.questionForm.value.QuestionTitle ? this.questionForm.value.QuestionTitle : '');
          const filterQuestionTitle = this.questionForm.value.QuestionTitle ? this.variablePopupService.updateTemplateVarHTMLIntoVariableV2(this.questionForm.value.QuestionTitle) : "";

          if(filterQuestionTitle && filterQuestionTitle.trim() && filterQuestionTitle.trim().length > 0){
            this.switchTab(res.tab);
          }
        }
      }
    });
  }

  onElementChange(){
    if(this.isElementObservableSubscription){
      this.isElementObservableSubscription.unsubscribe();
    }
    if(this.isVideoSoundEnableSubscription){
      this.isVideoSoundEnableSubscription.unsubscribe();
    }
    this.isElementObservableSubscription = this.dynamicMediaReplaceService.isElementSettingObservable.subscribe(res => {
      if(res && Object.keys(res).length != 0){
        if(this.questionForm.controls.QuestionId.value == res.questionId && res.elementData && res.elementData.length > 0){
          this.questionElementReorder = [];
          let titleOrder = 1;
          let mediaOrder = 2;
          let descriptionOrder = 3;
          let buttonOrder = 6;
          let descriptionImageOrder = 4;
          let questionOrder = 5;
          res.elementData.map(ele => {
            if(ele.key == this.elementReorderKey.title){
              titleOrder = ele.displayOrder;
            }else if(ele.key == this.elementReorderKey.media){
              this.showQuestionImage = ele.value;
              mediaOrder = ele.displayOrder;
            }else if(ele.key == this.elementReorderKey.description){
              this.isQuestionDesEnable = ele.value;
              descriptionOrder = ele.displayOrder;
              this.showDescriptionImage = ele.disMedia.value;
              descriptionImageOrder = ele.disMedia.displayOrder;
            }else if(ele.key == this.elementReorderKey.button){
              this.enableNextButton = ele.value;
              buttonOrder = ele.displayOrder;
            }else if(ele.key == this.elementReorderKey.question){
              this.isQuestionEnable = ele.value;
              if(this.isQuestionEnable){
                this.questionForm.patchValue({'Type': 2});
              }else{
                this.questionForm.patchValue({'Type': 6});
              }
              // this.isWhatsappEnable? this.updateDescriptionFieldV2() : false;
              questionOrder = ele.displayOrder;
            }
          });
          this.questionElementReorder = res.elementData;
          this.questionForm.patchValue({
            'ShowQuestionImage': this.showQuestionImage,
            'ShowDescriptionImage':this.showDescriptionImage,
            'EnableNextButton':this.enableNextButton,
            'ShowDescription':this.isQuestionDesEnable,
            'DisplayOrderForTitle':titleOrder, //1
            'DisplayOrderForTitleImage':mediaOrder,//2
            'DisplayOrderForDescription':descriptionOrder,//3
            'DisplayOrderForDescriptionImage':descriptionImageOrder,//4
            'DisplayOrderForNextButton':buttonOrder,//6
            'DisplayOrderForAnswer':questionOrder,//5
            'EnableMediaFile': this.showQuestionImage ? this.questionForm.get('EnableMediaFile').value : false,
            'EnableMediaFileForDescription': this.isQuestionDesEnable ? this.showDescriptionImage ? this.questionForm.get('EnableMediaFileForDescription').value : false : false
          });
          this.questionForm.markAsDirty();
        }
      }
    });
  }

  /**
   * Accessing SnapShot data from resolve
   */
  private getSnapShotData() {
    if(!this.isOpenBranchingLogicSide){
      this.questionData = this.route.snapshot.data["questionData"];
    }
    this.answerStructureType = this.questionData.AnswerStructureType;
    this.selectedAnswerType = this.questionData.AnswerType.toString();
    this.questionId = this.questionData.QuestionId;
    //set height of description text area reflect only in case of whatsapp flow  
    setTimeout(() => {        
      this.setAutoHeightOfTextArea('whtsAp_desc__'+this.questionData.QuestionId);
    }, 500);
  }

  /**
   * Function for Setting tab
   * if param provided then update otherwise use first tab ie tab-01/TABS[0]
   */
  private setTab(tab?) {
    this.tab = tab || TABS[0];
  }

  /**
   * Function to create Form
   */
  private createForm(data) {
    this.quizzToolHelper.selectedAnswerType.next({answerType: data.AnswerType, questionId: data.QuestionId, isdataLive:false});
    this.isAutoPlay = data.AutoPlay;
    this.isDesAutoPlay = data.AutoPlayForDescription;
    this.imageORvideo = this.commonService.getImageOrVideo(data.QuestionImage);
    data.DescriptionImage = data.DescriptionImage ? data.DescriptionImage : '';
    this.descriptionImageORvideo = this.commonService.getImageOrVideo(data.DescriptionImage);
    this.questionForm = this._fb.group({
      QuestionId: [
        data.QuestionId ? data.QuestionId : "",
        [Validators.required]
      ],
      ShowAnswerImage: [data.ShowAnswerImage ? data.ShowAnswerImage : false],
      QuestionTitle: [this.variablePopupService.updateTemplateVariableIntoHTMLV2(data.QuestionTitle)],
      QuestionImage: [data.QuestionImage ? data.QuestionImage : ""],
      EnableMediaFile: [data.EnableMediaFile],
      AutoPlay: [data.AutoPlay],
      ShowQuestionImage: [
        data.ShowQuestionImage ? data.ShowQuestionImage : false
      ],
      AnswerList: this._fb.array([]),
      CorrectAnswerId: [data.CorrectAnswerId ? data.CorrectAnswerId : ""],
      CorrectAnswerExplanation: [
        data.CorrectAnswerExplanation ? data.CorrectAnswerExplanation : ""
      ],
      RevealCorrectAnswer: [
        data.RevealCorrectAnswer ? data.RevealCorrectAnswer : false
      ],
      AliasTextForCorrect: [
        data.AliasTextForCorrect ? data.AliasTextForCorrect : ""
      ],
      AliasTextForIncorrect: [
        data.AliasTextForIncorrect ? data.AliasTextForIncorrect : ""
      ],
      AliasTextForYourAnswer: [
        data.AliasTextForYourAnswer ? data.AliasTextForYourAnswer : ""
      ],
      AliasTextForCorrectAnswer: [
        data.AliasTextForCorrectAnswer ? data.AliasTextForCorrectAnswer : ""
      ],
      AliasTextForExplanation: [
        data.AliasTextForExplanation ? data.AliasTextForExplanation : ""
      ],
      AliasTextForNextButton: [
        data.AliasTextForNextButton ? data.AliasTextForNextButton : ""
      ],
      PublicIdForQuestion: [
        data.PublicIdForQuestion ? data.PublicIdForQuestion : ""
      ],
      AnswerType: [
        data.AnswerType ? data.AnswerType : "1"
      ],
      NextButtonTxtSize: [ data.NextButtonTxtSize ? data.NextButtonTxtSize : "24 px"],
      NextButtonTxtColor: [ data.NextButtonTxtColor ? data.NextButtonTxtColor :this.brandingColor.ButtonFontColor],
      NextButtonHoverTxtColor: [ data.NextButtonHoverTxtColor ? data.NextButtonHoverTxtColor :this.brandingColor.ButtonHoverTextColor],
      NextButtonText: [ data.NextButtonText],
      NextButtonColor: [ data.NextButtonColor ? data.NextButtonColor : this.brandingColor.ButtonColor],
      NextButtonHoverColor: [ data.NextButtonHoverColor ? data.NextButtonHoverColor : this.brandingColor.ButtonHoverColor],
      MinAnswer: [ data.MinAnswer ? data.MinAnswer : 0 ],
      MaxAnswer: [ data.MaxAnswer ? data.MaxAnswer : 0 ],
      Description : [this.variablePopupService.updateTemplateVariableIntoHTMLV2(data.Description)],
      ShowDescriptionImage: [
        data.ShowDescriptionImage ? data.ShowDescriptionImage : false
      ],
      DescriptionImage: [data.DescriptionImage ? data.DescriptionImage : ""],
      PublicIdForDescription: [
        data.PublicIdForDescription ? data.PublicIdForDescription : ""
      ],
      EnableMediaFileForDescription: [data.EnableMediaFileForDescription],
      AutoPlayForDescription:[data.AutoPlayForDescription],
      EnableNextButton:[data.EnableNextButton ? data.EnableNextButton : false],
      Type:[data.Type],
      QuizId : [this.quizId],
      ShowTitle : [data.ShowTitle],
      ShowDescription : [data.ShowDescription ? data.ShowDescription : false],
      DisplayOrderForTitle : [data.DisplayOrderForTitle],
      DisplayOrderForTitleImage : [data.DisplayOrderForTitleImage],
      DisplayOrderForDescription : [data.DisplayOrderForDescription],
      DisplayOrderForDescriptionImage : [data.DisplayOrderForDescriptionImage], 
      DisplayOrderForAnswer :[data.DisplayOrderForAnswer],
      DisplayOrderForNextButton : [data.DisplayOrderForNextButton],
      TopicTitle:[data.TopicTitle ? data.TopicTitle : ''],
      EnableComment:[data.EnableComment],
      SecondsToApply:[data.SecondsToApply],
      SecondsToApplyForDescription:[data.SecondsToApplyForDescription],
      VideoFrameEnabled:[data.VideoFrameEnabled],
      DescVideoFrameEnabled:[data.DescVideoFrameEnabled],
      AnswerStructureType:[data.AnswerStructureType? data.AnswerStructureType : QuizAnswerStructureType.default],
      DescriptionVarList: [],
      QuestionTitleVarList: []
    });
    this.nextButtonTxtSize = data.NextButtonTxtSize ? data.NextButtonTxtSize.replace("px", "").trim() : "24";
    this.nextButtonTitleColor = data.NextButtonTxtColor ? data.NextButtonTxtColor : this.brandingColor.ButtonFontColor;
    this.nextButtonHoverTitleColor = data.NextButtonHoverTxtColor ? data.NextButtonHoverTxtColor : this.brandingColor.ButtonHoverTextColor;
    this.nextButtonColor = data.NextButtonColor ? data.NextButtonColor : this.brandingColor.ButtonColor;
    this.nextButtonHoverColor = data.NextButtonHoverColor ? data.NextButtonHoverColor : this.brandingColor.ButtonHoverColor;
    this.isEnableMultiRating = data.IsMultiRating;
    this.commonService.onLoadvideo('update',true);
    this.commonService.onLoadvideo('updatedes',true);
  }

  private pushAnswerFormArray(answer) {
    let AnswerText = answer.AnswerText;
    let AnswerDescription = answer.AnswerDescription;
    if(this.isWhatsappEnable && answerTypeEnum.singleSelect == this.questionData.AnswerType){
      AnswerText = answer.AnswerText.replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/\s/g,"&nbsp;");
      AnswerDescription = answer.AnswerDescription.replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/\s/g,"&nbsp;");
    }
    return this._fb.group({
      AnswerId: answer.AnswerId,
      AnswerText: this.variablePopupService.updateTemplateVariableIntoHTMLV2(AnswerText),
      AnswerImage: answer.AnswerImage,
      AssociatedScore: answer.AssociatedScore,
      IsCorrectAnswer: answer.IsCorrectAnswer,
      imageORvideo: answer.imageORvideo,
      PublicIdForAnswer: answer.PublicIdForAnswer,
      EnableMediaFile : answer.EnableMediaFile,
      Categories: [answer.Categories],
      AutoPlay: [answer.AutoPlay],
      OptionTextforRatingOne: [answer.OptionTextforRatingOne],
      OptionTextforRatingTwo: [answer.OptionTextforRatingTwo],
      OptionTextforRatingThree: [answer.OptionTextforRatingThree],
      OptionTextforRatingFour: [answer.OptionTextforRatingFour],
      OptionTextforRatingFive: [answer.OptionTextforRatingFive],
      DisplayOrder : [answer.DisplayOrder],
      ObjectFieldsInAnswer : [answer.ObjectFieldsInAnswer],
      ObjectFieldsInAnswerComment : [answer.ObjectFieldsInAnswerComment],
      SecondsToApply : [answer.SecondsToApply],
      VideoFrameEnabled: [answer.VideoFrameEnabled],
      ListValues: [answer.ListValues],
      AnswerVarList:[],
      AnswerDescription: this.variablePopupService.updateTemplateVariableIntoHTMLV2(AnswerDescription)
    });
    // console.group(this.questionForm.value);
    // console.groupEnd()
  }

  private patchAnswerList(AnswerList) {
    this.clearAnswerList();
    this.commonService.answerTextList = [];
    const control = <FormArray>this.questionForm.controls["AnswerList"];
    for (let i = 0; i < AnswerList.length; i++) {
      AnswerList[i].imageORvideo = this.commonService.getImageOrVideo(AnswerList[i].AnswerImage);
      control.push(this.pushAnswerFormArray(AnswerList[i]));
      // insert answer text to list for further duplcacy checks
      if(this.selectedAnswerType == '1'){
        // this.commonService.answerTextList[i] = AnswerList[i].AnswerText.replace(/&nbsp;/g,' ').replace(/<br(\s)*([^<])*>/g,'\n').replace(/\#\$/g, '').replace(/\$\#/g,'');
        this.commonService.answerTextList[i] = control.at(i).value.AnswerText;
      }
      //get country code...
      if((this.selectedAnswerType == '7' || this.selectedAnswerType == '8') && i == 0){

        this.getQuestionCountryCode(AnswerList[i]);
      }
    }
  }

  getQuestionCountryCode(AnswerList){
    this.selectAll = false;
    this.selectedCountcodeArray = [];
    this.selectedCountryNameArray = [];
    this.selectedCountryName = '';
    this.isAllSelectCountry = false;

    if(AnswerList.ListValues && AnswerList.ListValues.length > 0){
        this.selectedCountcodeArray = JSON.parse(JSON.stringify(AnswerList.ListValues));
        let selectedCountryObj;
        this.selectedCountcodeArray.map(selectedCountry => {
          selectedCountryObj= this.getPostalCountryList.filter(postalCountry => {
            return postalCountry.value == selectedCountry;
          });
          this.selectedCountryNameArray.push(selectedCountryObj[0].label);
        });
        this.selectedCountryName = this.selectedCountryNameArray.join();
      
      if(AnswerList.ListValues.length  == this.getPostalCountryList.length){
        this.selectedCountryName = '';
        this.isAllSelectCountry = true;
        this.selectAll = true;
      }
    }
  }

  /**
   * Function to clear AnswerList FormArray
   */
  public clearAnswerList() {
    const control = <FormArray>this.questionForm.controls["AnswerList"];
    while (control.length) {
      control.removeAt(control.length - 1);
    }
  }

  //use Media Lib

  onUseMedia(text:any){
    if(!this.commonService.checkSelectedQuestionValidity()){
      this.isDesImage = text;
      if(this.config.disableMedia){
        this.uploadQuestionImage(text);
      }else{
        this.isVisibleMediaLibrary=true;
      }
    }
  }

  changeUploadedUrl(event){
    if(event.message == "success"){
      if (event.externalUrl) {
        let mediaType = this.commonService.getImageOrVideo(event.externalUrl);
        if(this.isWhatsappEnable){
          event.externalUrl = this.commonService.transformMediaExtention(event.externalUrl, mediaType);
        }
        if(this.isDesImage == 'img'){
          this.imageORvideo = mediaType;
          this.questionForm.controls.QuestionImage.patchValue(event.externalUrl);
        }else{
            this.descriptionImageORvideo = mediaType;
            this.questionForm.controls.DescriptionImage.patchValue(event.externalUrl);
        }
      }
      if(this.isDesImage == 'img'){
        this.questionForm.patchValue({ PublicIdForQuestion: event.publicId, SecondsToApply: 0});
        this.questionForm.controls.QuestionImage.markAsDirty();
      }else{
        this.questionForm.patchValue({ PublicIdForDescription: event.publicId, SecondsToApplyForDescription : 0});
        this.questionForm.controls.DescriptionImage.markAsDirty();
      }
      this.save();
      this.commonService.onLoadvideo('update',true);
      this.commonService.onLoadvideo('updatedes',true);
    }
    this.isVisibleMediaLibrary=false;
    let self = this;
    setTimeout(function(){
      if(self.isDesImage == 'img'){
        self.questionPageSetting('img');
      }else{self.questionPageSetting('desImg');}}, 1500);
  }

  /**
   * Function to upload image
   * !Depricated
   */
  uploadQuestionImage(text) {

    var env_question = Object.assign({}, environment.cloudinaryConfiguration);
    env_question.cropping_aspect_ratio = 2.25;
    env_question.min_image_width = '900';
    env_question.min_image_height = '400';
    var widget = cloudinary.createUploadWidget(
      env_question,
      (error, result) => {
        if (!error && result[0].secure_url) {
          let mediaType = this.commonService.getImageOrVideo(result[0].secure_url);
          if(text == 'img'){
            this.imageORvideo = mediaType;
            }else{
              this.descriptionImageORvideo = mediaType;
          }
          var coordinate = "";
          if (
            result[0] &&
            result[0].coordinates &&
            result[0].coordinates.faces
          ) {
            var cloudCoordinate = result[0].coordinates.faces;
            coordinate = `x_${cloudCoordinate[0][0]},y_${
              cloudCoordinate[0][1]
              },w_${cloudCoordinate[0][2]},h_${cloudCoordinate[0][3]},c_crop`;
          }
          if (result[0].secure_url.match("upload")) {
            var index = result[0].secure_url.match("upload").index;
            result[0].secure_url =
              result[0].secure_url.slice(0, index + 6) +
              "/" +
              coordinate +
              result[0].secure_url.slice(index + 6 + Math.abs(0));
          }
          if(text == 'img'){
          this.questionForm.controls.QuestionImage.patchValue(result[0].secure_url);
          this.questionForm.patchValue({ PublicIdForQuestion: result[0].public_id });
          this.questionForm.controls.QuestionImage.markAsDirty();
          }else{
            this.questionForm.controls.DescriptionImage.patchValue(result[0].secure_url);
            this.questionForm.patchValue({ PublicIdForDescription: result[0].public_id });
            this.questionForm.controls.DescriptionImage.markAsDirty();
          }
          this.save();
        } else {
          console.log(
            "Error! Cloudinary upload widget error questionImage",
            error
          );
        }
      }
    );
    if(text == 'img'){
      widget.open(this.questionForm.controls.QuestionImage.value);
    }else{
      widget.open(this.questionForm.controls.DescriptionImage.value);
    }
  }

  removeImagePopup(text:any) {
    if(!this.commonService.checkSelectedQuestionValidity()){
      if(text == 'img'){
      this.imageORvideo = "image";
      this.questionForm.patchValue({
        QuestionImage: "",
        SecondsToApply: 0
      });
      this.questionForm.controls.QuestionImage.markAsDirty();
      }else{
        this.descriptionImageORvideo = "image";
        this.questionForm.patchValue({
          DescriptionImage: "",
          SecondsToApplyForDescription : 0
        });
        this.questionForm.controls.DescriptionImage.markAsDirty();
      }
      this.save();
      this.questionPageSetting('main');
    }
  }

  /**
   * *CLoudinary Upload Widget Extra configuration
   */
  cloudinaryUploadWidgetConfigurations = {
    cropping_aspect_ratio: 2.25,
    min_image_width: '900',
    min_image_height: '400',
    folder: this.userInfoService._info.CloudinaryBaseFolder
  }


  /**
   * * Tags for cloudinary
   */
  C_tags = []

  /**
   * 
   * @param Image Dimension
   */
  CM_recommended_image_dimensions = {
    width:900,
    height:400
  }
  
  CM_accepted_formats = ['image','video'];

  public questionId: string;
  public selectedAnswerType: string;
  public readonly : boolean = false;
  /**
   * on select AnswerType
   */
  onSelectAnswerType(ansType, questionId){
    this.selectedAnswerType = ansType;

    if(ansType == "6"){
      this.questionForm.controls['QuestionTitle'].setValue('Your driving License');
    }
    if(ansType == "5"){
      this.questionForm.controls['QuestionTitle'].setValue('Your date of birth');
    }
    if(ansType == "7"){
      this.questionForm.controls['QuestionTitle'].setValue('Your full address');
    }
    if(ansType == "8"){
      this.questionForm.controls['QuestionTitle'].setValue('Your post code');
    }
    if(ansType == "9"){
      this.questionForm.controls['QuestionTitle'].setValue('Are you still looking for jobs ?');
    }
    if(ansType == "11" || ansType == "12"){
      this.questionForm.controls['QuestionTitle'].setValue('Are you happy with the way the recruiter contacted you?');
    }
    if(ansType == "13"){
      this.questionForm.controls['QuestionTitle'].setValue('Available from date');
    }
    this.questionId = questionId;
    this.quizzToolHelper.selectedAnswerType.next({answerType:ansType, questionId: questionId,  isdataLive:true});
    let selectedAnswerType = parseInt(this.selectedAnswerType);
    if(selectedAnswerType > 4){
      this.tab = "tab-03";
    } 
    else if(selectedAnswerType < 3){
      this.tab = this.questionForm.controls.ShowAnswerImage.value
      ? "tab-02"
      : "tab-01";
    }
    if(selectedAnswerType == 3 || selectedAnswerType == 4){
      this.tab = "tab-01";
    } 
    if(selectedAnswerType == 10 || selectedAnswerType == 11 || selectedAnswerType == 12 || selectedAnswerType == 13){
      this.tab = "tab-03";
    } 
  }

  

  /**
   * on click save button from answerType dropdown
   * 
   */
  answerTypeChangeSave(){
    if(this.selectedAnswerType == "6"){
      this.questionForm.controls['QuestionTitle'].setValue('Your driving License');
    }
    if(this.selectedAnswerType == "5"){
      this.questionForm.controls['QuestionTitle'].setValue('Your date of birth');
    }
    if(this.selectedAnswerType == "7"){
      this.questionForm.controls['QuestionTitle'].setValue('Your full address');
    }
    if(this.selectedAnswerType == "8"){
      this.questionForm.controls['QuestionTitle'].setValue('Your post code');
    }
    if(this.selectedAnswerType == "9"){
      this.questionForm.controls['QuestionTitle'].setValue('Are you still looking for jobs ?');
    }
    if(this.selectedAnswerType == "11" || this.selectedAnswerType == "12"){
      this.questionForm.controls['QuestionTitle'].setValue('Are you happy with the way the recruiter contacted you?');
    }
    if(this.selectedAnswerType  == "13"){
      this.questionForm.controls['QuestionTitle'].setValue('Available from date');
    }
    this.quizBuilderApiService.updateAnswerType(this.questionId, this.selectedAnswerType, this.answerStructureType, this.isWhatsappEnable,this.isEnableMultiRating).subscribe((data) => {
      if(this.isOpenBranchingLogicSide){
        this.updateBranchingLogic.emit();
      }
      this.questionForm.markAsDirty();
      this.getUpdatedQuestionData();
      // this.questionForm.patchValue({
      //   AnswerType: this.selectedAnswerType
      // });
      this.quizzToolHelper.updatedResultRange.next("");
    });
  }

  getUpdatedQuestionData(){
    this.quizBuilderApiService.getQuestionDetails(this.questionForm.controls.QuestionId.value,this.quizId).subscribe((updatedQuestionData) => {
      this.questionData = updatedQuestionData;
      //updating answer structure type
      this.answerStructureType = updatedQuestionData.AnswerStructureType;
      this.selectedAnswerType = this.questionData.AnswerType.toString();
      var updatedQuestionInfo = {
        QuestionId: updatedQuestionData.QuestionId,
        QuestionTitle: updatedQuestionData.QuestionTitle
      };
      this.quizzToolHelper.updateSidebarOptionsQuestionTitle.next(
        updatedQuestionInfo
      );
      this.questionId = this.questionData.QuestionId;
      this.quizzToolHelper.setQuestionDataWhenAnswerTypeChange(this.questionData);
      this.initializeComponent();
    });
  }

  answerTypeChangeCancel(questionId){
    // this.questionData;
    this.questionForm.controls['QuestionTitle'].setValue(this.questionData.QuestionTitle);
    this.selectedAnswerType = this.questionData.AnswerType.toString();
    if(this.selectedAnswerType > '4'){
      this.tab = "tab-03";
      } 
      else if(this.selectedAnswerType < '3'){
        this.tab = this.questionForm.controls.ShowAnswerImage.value
        ? "tab-02"
        : "tab-01";
      }
      if(this.selectedAnswerType == '3' ||this.selectedAnswerType == '4'){
        this.tab = "tab-01";
        } 

        if(this.selectedAnswerType == '10' || this.selectedAnswerType == '11' || this.selectedAnswerType == '12' || this.selectedAnswerType == '13'){
          this.tab = "tab-03";
          } 
    this.quizzToolHelper.selectedAnswerType.next({answerType:+this.selectedAnswerType, questionId: questionId,  isdataLive:false});
  }

  public isOpenSizeTooltip: boolean = false;
  public isOpenColorTooltip: boolean = false;
  public nextButtonTitleColor;
  public nextButtonHoverTitleColor;
  public nextButtonColor;
  public nextButtonHoverColor;
  public nextButtonTxtSize: number = 24;

  onSizeTooltipShown(){
    this.isOpenSizeTooltip = true;
  }

  onSizeTooltipHidden(){
    this.isOpenSizeTooltip = false;
  }

  onColorTooltipShown(){
    this.isOpenColorTooltip = true;
  }

  onColorTooltipHidden(){
    this.isOpenColorTooltip = false;
  }

  /**
   * Change Event when Font size changes
   * @param font Font size of Button Text
   */
  onNextButtonTxtSizeChange(font){
    this.questionForm.get("NextButtonTxtSize").patchValue(font + " px");
    this.questionForm.controls.NextButtonTxtSize.markAsDirty();
  }

  /**
   * Change Event when Button Color Changes
   * @param btnColor Button Color
   */
  onNextButtonColorChange(btnColor) {
    this.questionForm.get("NextButtonColor").patchValue(btnColor);
    this.questionForm.controls.NextButtonColor.markAsDirty();
  }

  onNextButtonHoverColorChange(btnColor) {
    this.questionForm.get("NextButtonHoverColor").patchValue(btnColor);
    this.questionForm.controls.NextButtonHoverColor.markAsDirty();
  }

  /**
   * Change Event when title Color changes
   * @param titleColor
   */
  onNextButtonTitleColorChange(titleColor) {
    this.questionForm.get("NextButtonTxtColor").patchValue(titleColor);
    this.questionForm.controls.NextButtonTxtColor.markAsDirty();
  }

   /**
   * Save Button Text Size via API
   */
  saveNextButtonTxtSize() {
    this.save();
  }

  /**
   * Save Button Color (or Background) via API
   */
  saveNextButtonColorConfig() {
    this.save();

  }

  resetColor()
  {
    this.resetButton = true;
    this.nextButtonTitleColor = this.brandingColor.ButtonFontColor;
    this.nextButtonHoverTitleColor = this.brandingColor.ButtonHoverTextColor;
    this.nextButtonColor = this.brandingColor.ButtonColor;
    this.nextButtonHoverColor = this.brandingColor.ButtonHoverColor;
    this.questionForm.patchValue({
      NextButtonTxtColor : this.nextButtonTitleColor,
      NextButtonColor : this.nextButtonColor,
      NextButtonHoverColor : this.nextButtonHoverColor
    });
    this.save();
  }

  onMediaAnswerImageSetting(data){
    this.selectedAnwser = data.selectedAnwser;
    this.answerVideoDuration = data.duration;
    this.questionPageSetting(data.type);
  }

  setElementObj(){
    this.elementObj = [
      {
        "key":this.elementReorderKey.title,
        "value":this.questionForm.get('ShowTitle').value,
        "displayOrder":this.questionForm.get('DisplayOrderForTitle').value
      },
      {
        "key":this.elementReorderKey.media,
        "value":this.questionForm.get('ShowQuestionImage').value,
        "displayOrder":this.questionForm.get('DisplayOrderForTitleImage').value
      },
      {
        "key":this.elementReorderKey.description,
        "value":this.questionForm.get('ShowDescription').value,
        "displayOrder":this.questionForm.get('DisplayOrderForDescription').value,
        "disMedia" : {
          "key":this.elementReorderKey.descriptionMedia,
          "value":this.questionForm.get('ShowDescriptionImage').value,
          "displayOrder":this.questionForm.get('DisplayOrderForDescriptionImage').value
        }
      },
      {
        "key":this.elementReorderKey.question,
        "value":(this.questionForm.controls.Type.value == 2) ? true : false,
        "displayOrder":this.questionForm.get('DisplayOrderForAnswer').value
      },
      {
        "key":this.elementReorderKey.button,
        "value":this.questionForm.get('EnableNextButton').value,
        "displayOrder":this.questionForm.get('DisplayOrderForNextButton').value
      }
    ];
  }

  sendEnableSettingData(collapseObj,setFrameVideo){
    let enableItemSettingObj = {
      "page":'',
      "data": false,
      "isVideo":'',
      "autoPlayData": false,
      "isOpen" : true,
      "menuType" : rightMenuEnum.questionPageSetting,
      "questionId" : this.questionForm.controls.QuestionId.value,
      "answerType": this.selectedAnswerType,
      "elementEnable":collapseObj.elementCollapse,
      "mediaEnable":collapseObj.mediaCollapse,
      "answerEnable":collapseObj.answerCollapse,
      "questionElement": this.elementObj,
      "setFrameVideo":setFrameVideo,
      "answerStructureType" : this.questionForm.controls.AnswerStructureType.value,
      "isMultiRating" :  this.isEnableMultiRating
    };
    if(collapseObj.isDesTab){
      enableItemSettingObj.page = enableItemPage.question_des_page;
      enableItemSettingObj.data = this.questionForm.get('EnableMediaFileForDescription').value;
      enableItemSettingObj.isVideo = this.descriptionImageORvideo;
      enableItemSettingObj.autoPlayData = this.questionForm.get('AutoPlayForDescription').value;
    }else if(collapseObj.isAnswerTab){
      enableItemSettingObj.page = this.selectedAnwser.controls.AnswerId.value;
      enableItemSettingObj.data = this.selectedAnwser.controls.EnableMediaFile ? this.selectedAnwser.controls.EnableMediaFile.value == null ? false : this.selectedAnwser.controls.EnableMediaFile.value : false;
      enableItemSettingObj.isVideo = this.selectedAnwser.controls.imageORvideo.value;
      enableItemSettingObj.autoPlayData = this.selectedAnwser.controls.AutoPlay ? this.selectedAnwser.controls.AutoPlay.value == null ? false : this.selectedAnwser.controls.AutoPlay.value : false;
    }else{
      enableItemSettingObj.page = enableItemPage.question_page;
      enableItemSettingObj.data = this.questionForm.get('EnableMediaFile').value;
      enableItemSettingObj.isVideo = this.imageORvideo;
      enableItemSettingObj.autoPlayData = this.questionForm.get('AutoPlay').value;
    }
    this.dynamicMediaReplaceService.isOpenEnableMediaSetiing = enableItemSettingObj;
  }

  setFrameVideoObj(collapseObj){
    let videoDuration = 0;
    let setFrameVideo = {
      "videoDuration" : 0,
      "secondsToApply" : '',
      "videoFrameEnabled": ''
    }
    if(collapseObj.isDesTab){
      if(this.descriptionImageORvideo == "video"){
        let clVideoEle = this.commonService.onLoadvideo('updatedes');
        if(clVideoEle){
          videoDuration = clVideoEle.duration;
        }
      }
      setFrameVideo.videoDuration = isFinite(videoDuration) ? videoDuration : 0;
      setFrameVideo.secondsToApply = this.questionForm.get('SecondsToApplyForDescription').value;
      setFrameVideo.videoFrameEnabled = this.questionForm.get('DescVideoFrameEnabled').value
    }else if(collapseObj.isAnswerTab){
        setFrameVideo.videoDuration = isFinite(this.answerVideoDuration) ? this.answerVideoDuration : 0;
        setFrameVideo.secondsToApply = this.selectedAnwser.controls.SecondsToApply && this.selectedAnwser.controls.SecondsToApply.value ? this.selectedAnwser.controls.SecondsToApply.value : 0;
        setFrameVideo.videoFrameEnabled = this.selectedAnwser.controls.VideoFrameEnabled && this.selectedAnwser.controls.VideoFrameEnabled.value ? this.selectedAnwser.controls.VideoFrameEnabled.value : false;
    }else{
      if(this.imageORvideo == "video"){
        let clVideoEle = this.commonService.onLoadvideo('update');
        if(clVideoEle){
          videoDuration = clVideoEle.duration;
        }
      }
      setFrameVideo.videoDuration = isFinite(videoDuration) ? videoDuration : 0,
      setFrameVideo.secondsToApply = this.questionForm.get('SecondsToApply').value,
      setFrameVideo.videoFrameEnabled = this.questionForm.get('VideoFrameEnabled').value
    }
    return setFrameVideo;
  }

  questionPageSetting(text:any){
    this.setElementObj();
    if(!this.isProcess){
      this.isProcess = true;

      let collapseObj = {
        elementCollapse : (text == 'main') ? true : false,
        mediaCollapse  : (text == 'img' || text == 'desImg' || text == 'media') ? true : false,
        answerCollapse : (text == 'answer' || text == 'text') ? true : false,
        isDesTab : (text == 'desImg') ? true : false,
        isAnswerTab : (text == 'media' || text == 'text')? true : false
      }

      if(text == 'closeTab'){
        this.dynamicMediaReplaceService.isOpenEnableMediaSetiing = {
          "isOpen":false,
          "menuType":rightMenuEnum.questionPageSetting
        };
      }else if(collapseObj.isDesTab){
        this.save();
        let setFrameVideo = this.setFrameVideoObj(collapseObj);
        this.sendEnableSettingData(collapseObj,setFrameVideo);
      }else if(collapseObj.isAnswerTab){
        this.save();
        let setFrameVideo = this.setFrameVideoObj(collapseObj);
        this.sendEnableSettingData(collapseObj,setFrameVideo);
      }else{
        /**
         * wait for update of postal code in question form ListValues
         */
        setTimeout(() => {          
          this.save();
        }, 5);
        let setFrameVideo = this.setFrameVideoObj(collapseObj);
        this.sendEnableSettingData(collapseObj,setFrameVideo);
      }
      this.dynamicMediaReplaceService.changeOpenEnableMediaSetiingSubmission();
    }
    if(this.isProcess){
      let self = this;
      setTimeout(function(){ self.isProcess = false}, 300);
    }
  }

  muteVideos(){
    let getPlayVideos = document.getElementsByTagName("video");
    if(getPlayVideos && getPlayVideos.length > 0){
        for(let i=0; i<getPlayVideos.length; i++){
            getPlayVideos[i].muted = true;
        }
    }
  }

  // poster function 
  applyposter(){
    let startOffset:string = "0";
    if(this.questionForm.get('VideoFrameEnabled').value == true && this.questionForm.get('SecondsToApply').value){
      startOffset = this.questionForm.get('SecondsToApply').value;
    }
    return `{ "cloud-name":"${environment.cloudinaryConfiguration.cloud_name}", "transformation": [{"start-offset": ${startOffset}, "fetch_format": "auto", "quality": "auto"}]}`
  }

  applyposterDes(){
    let startOffset:string = "0";
    if(this.questionForm.get('DescVideoFrameEnabled').value == true && this.questionForm.get('SecondsToApplyForDescription').value){
      startOffset = this.questionForm.get('SecondsToApplyForDescription').value;
    }
    return `{ "cloud-name":"${environment.cloudinaryConfiguration.cloud_name}", "transformation": [{"start-offset": ${startOffset}, "fetch_format": "auto", "quality": "auto"}]}`
  }

  onEnableComment(item){
    this.questionForm.patchValue({'EnableComment': !item});
    if(!item == false){
      this.saveObjectMappingForComment();
    }
    let self = this;
    setTimeout(function(){ self.questionForm.controls.EnableComment.markAsDirty()}, 1000);
  }

  ngOnDestroy() {
    this.setCorrectAnswerChangeSubscription.unsubscribe();
    this.valueChangesSubscription.unsubscribe();
    if(this.isStylingSubscription){
      this.isStylingSubscription.unsubscribe();
    }
    if(this.updatedScore){
      this.updatedScore.unsubscribe();
    }
    if(this.routerEventSubscription)
    {
      this.routerEventSubscription.unsubscribe();
    }
    if(this.isDynamicMediaDataSubscription){
      this.isDynamicMediaDataSubscription.unsubscribe();
    }
    if(this.isAnswerTypeObservableSubscription){
      this.isAnswerTypeObservableSubscription.unsubscribe();
    }
    if(this.isImageAnswerTypeObservableSubscription){
      this.isImageAnswerTypeObservableSubscription.unsubscribe();
    }
    if(this.isAnswerResultSettingObservableSubscription){
      this.isAnswerResultSettingObservableSubscription.unsubscribe();
    }
    if(this.isElementObservableSubscription){
      this.isElementObservableSubscription.unsubscribe();
    }
    if(this.isVideoSoundEnableSubscription){
      this.isVideoSoundEnableSubscription.unsubscribe();
    }
    if(this.isWhatsappEnableSubscription){
      this.isWhatsappEnableSubscription.unsubscribe();
    }
    if(this.isAnswerReorderSettingObservableSubscription){
      this.isAnswerReorderSettingObservableSubscription.unsubscribe();
    }
    if(this.isvideoSecondsToApplySubscription){
      this.isvideoSecondsToApplySubscription.unsubscribe();
    }
    if(this.isEnableSetFrameToggleObservableSubscription){
      this.isEnableSetFrameToggleObservableSubscription.unsubscribe();
    }
    if(this.quizBuilderDataServiceSubscription){
      this.quizBuilderDataServiceSubscription.unsubscribe();
    }
  }

  items: string[] = [
    'The first choice!',
    'And another choice for you.',
    'but wait! A third!'
  ];
 
  onHidden(): void {
  }
  onShown(): void {
  }
  isOpenChange(): void {
    if(this.quizTypeId == 4 || this.quizTypeId == 6){
    this.updatedScore.unsubscribe();
    }
  }

  updateAnsStructureType(selectedAnswerType: any){
    let answerType = parseInt(selectedAnswerType);
    switch (answerType) {
      case answerTypeEnum.ratingEmoji:                 
      case answerTypeEnum.ratingStar:  
      case answerTypeEnum.nps:  
        this.answerStructureType = QuizAnswerStructureType.list;              
        break;
      case answerTypeEnum.singleSelect: 
      case answerTypeEnum.lookingForJob:
          this.answerStructureType = QuizAnswerStructureType.button;              
          break;
      default:
          this.answerStructureType = QuizAnswerStructureType.default;
          break;
    }
  }

  setAutoHeightOfTextArea(id:any){
    var textarea = document.getElementById(id);
    if(textarea){
      textarea.style.height = "";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }

  updateDescriptionField(id?:any){
    if(this.questionForm.get('ShowTitle').value && this.answerStructureType == QuizAnswerStructureType.button && this.questionForm.get('Type').value == 2){
      this.DescriptionMaxLength = 960;
      let description = this.questionForm.get('Description').value
      if(description.length > 960){
        description =description.slice(0,960);
        this.questionForm.patchValue({
          'Description': description
        });
        id = id ? id : 'whtsAp_desc__'+this.questionData.QuestionId
        this.setAutoHeightOfTextArea(id);
      }
    }else {
      this.DescriptionMaxLength = 1024;
    }
  }

/********************** variable popup implementation start *****************************/
  @ViewChild(TextViewComponent, {static: false}) textViewComponentRef:TextViewComponent;
  @ViewChild(ImageViewComponent, {static: false}) imageViewComponentRef:ImageViewComponent;
  public froalaOpenedFor: string;
  public froalaEditorFor: any = {};

  initFroalaOptionsAndEventsFor(froalaFor:any){
    if(!this.froalaEditorFor[froalaFor]){
      this.froalaEditorFor[froalaFor] = {
        "isShowVarBtn":false,
        "froalaRef": new FroalaEditorOptions(),
       }
    }
    let maxCharCount = froalaFor == 'QuestionTitle' 
                          ? this.isWhatsappEnable ? 60 : 2000 
                          : this.isWhatsappEnable
                              ? this.questionForm.get('ShowTitle').value && 
                                this.questionData.AnswerStructureType == QuizAnswerStructureType.button && 
                                this.questionData.Type == 2
                                  ? 960
                                  : 1024
                              : 2000;
    this.froalaEditorFor[froalaFor].froalaRef.SSEditorCharCount();
    this.froalaEditorFor[froalaFor].options = this.froalaEditorFor[froalaFor].froalaRef.setEditorOptions(2000);

    this.froalaEditorFor[froalaFor].options.charCounterCount = false;
    this.froalaEditorFor[froalaFor].options.ssCharCounterCount = true;
    this.froalaEditorFor[froalaFor].options.ssCharCounterMax = maxCharCount;
    if(this.isWhatsappEnable && froalaFor == 'QuestionTitle'){
      this.froalaEditorFor[froalaFor].options.multiLine = false;
    }
    this.froalaEditorFor[froalaFor].options.pluginsEnabled.push('ssCharCounter','ssCharCounterCount','ssCharCounterMax'); 

    this.froalaEditorFor[froalaFor].options.froalaFor = froalaFor;

    this.froalaEditorFor[froalaFor].options.events["froalaEditor.focus"] = (e, editor) => { 
      if(e.target.classList.contains("text-view")){
        editor.toolbar.hide();
      }else{
        editor.toolbar.show();
      }                   
    };
    this.froalaEditorFor[froalaFor].options.events["froalaEditor.blur"] = (e, editor) => {                               
      editor.toolbar.hide();
    };
    this.froalaEditorFor[froalaFor].options.events["froalaEditor.initialized"] = (e, editor) =>{
      this.froalaEditorFor[editor.opts.froalaFor].froalaRef.editorRefernce = editor;
      editor.toolbar.hide();
      if(e.target.parentElement.classList.contains( 'has-ques-variable' )){    
        editor.events.bindClick($('body'), 'i#ques-btn-variable', function () {      
          editor.selection.save();
        });
      }
      if(e.target.parentElement.classList.contains( 'has-des-variable' )){    
        editor.events.bindClick($('body'), 'i#des-btn-variable', function () {      
          editor.selection.save();
        });
      }
    };
    this.froalaEditorFor[froalaFor].options.events["froalaEditor.keypress"] = (e, editor, keypressEvent) => {                           
      if (keypressEvent.which == 13 || keypressEvent.which == 10) {
        editor.html.insert('<br>');
        keypressEvent.preventDefault();
        keypressEvent.stopImmediatePropagation();
        keypressEvent.stopPropagation();
      }
    };
  }

  updateFroalaOptionsAndEvents(){
    //for Question Title
    this.initFroalaOptionsAndEventsFor('QuestionTitle');
    //for Description
    this.initFroalaOptionsAndEventsFor('Description');
  }

  openVariablePopup(openFor?:any){
    this.froalaOpenedFor = openFor
    let variablePopupPayload: any = {};
    let msg = this.froalaEditorFor[this.froalaOpenedFor].froalaRef.editorRefernce.html.get();     
    variablePopupPayload.listOfUsedVariableObj = this.variablePopupService.getListOfUsedVariableObjV2(msg);  
    variablePopupPayload.listOfUsedVariableObj.map(varItem => {
      return (varItem.formula = varItem.formula.replace(/\{\{/g,'%').replace(/\}\}/g,'%'));
    });  
    variablePopupPayload.allowedVariblesFor = 'quiz';
    variablePopupPayload.isOpenPopup = true;
    this.variablePopupService.variablePopupOpened = openFor;

    this.variablePopupService.variablePopupPayload = variablePopupPayload;
    this.variablePopupService.changeInVariablePopupPayload();
  }

  UpdatePopUpStatus(e){
    let value: any;
    let listOfUsedVariableObj = this.variablePopupService.listOfUsedVariableObj;
    if(this.variablePopupService.variablePopupOpened == 'QuestionTitle' || this.variablePopupService.variablePopupOpened == 'Description'){
      let activeFroalaRef = this.froalaEditorFor[this.froalaOpenedFor].froalaRef;
      let tempVarFormulaList:any = [];
      listOfUsedVariableObj.map(varItem => {
        tempVarFormulaList.push(varItem.formula.replace(/^%/g,'{{').replace(/%$/g,'}}'));
      });
      this.questionForm.get(this.variablePopupService.variablePopupOpened+'VarList').patchValue(tempVarFormulaList);
      value = this.variablePopupService.insertFormulaIntoEditorV2(listOfUsedVariableObj, activeFroalaRef);
      if(value && value.msg){
        if(this.variablePopupService.variablePopupOpened == 'QuestionTitle'){
          this.questionForm.get('QuestionTitle').patchValue(value.msg);
        }else if(this.variablePopupService.variablePopupOpened == 'Description'){
          this.questionForm.get('Description').patchValue(value.msg);
        }
      }
      if(value && value.newContent){
        this.questionForm.markAsDirty();
      }
    }
    if(this.variablePopupService.variablePopupOpened == 'Answers' || this.variablePopupService.variablePopupOpened == 'ImageAnswers' || this.variablePopupService.variablePopupOpened == 'AnswersDescription'){
      if(this.variablePopupService.variablePopupOpened == 'ImageAnswers'){
        this.imageViewComponentRef.UpdatePopUpStatus();
      }else{
        this.textViewComponentRef.UpdatePopUpStatus();
      }
    }
    setTimeout(() => {
      this.save();
    }, 1000);
  }

  updatePayloadForVariables(requestPayload:any){
    requestPayload.MsgVariables = [];
    if(requestPayload.QuestionTitleVarList && requestPayload.QuestionTitleVarList.length > 0){
      requestPayload.MsgVariables = [...requestPayload.MsgVariables,...requestPayload.QuestionTitleVarList];
    }
    delete requestPayload.QuestionTitleVarList;
    if(requestPayload.DescriptionVarList && requestPayload.DescriptionVarList.length > 0){
      requestPayload.MsgVariables = [...requestPayload.MsgVariables,...requestPayload.DescriptionVarList];
    }
    delete requestPayload.DescriptionVarList
    requestPayload.Description = this.variablePopupService.updateTemplateVarHTMLIntoVariableV2(requestPayload.Description);
    requestPayload.QuestionTitle = this.variablePopupService.updateTemplateVarHTMLIntoVariableV2(requestPayload.QuestionTitle);
    if(this.isWhatsappEnable){
      requestPayload.Description = this.variablePopupService.convertToPlainText(requestPayload.Description);
      requestPayload.QuestionTitle = this.variablePopupService.convertToPlainText(requestPayload.QuestionTitle);
    }
    if(this.questionData.AnswerType == answerTypeEnum.singleSelect || this.questionData.AnswerType == answerTypeEnum.multiSelect){
      requestPayload.AnswerList.map(answer => {
        answer.AnswerText = this.variablePopupService.updateTemplateVarHTMLIntoVariableV2(answer.AnswerText);
        answer.AnswerDescription = this.variablePopupService.updateTemplateVarHTMLIntoVariableV2(answer.AnswerDescription);
        if(answer.AnswerVarList && answer.AnswerVarList.length > 0){
          requestPayload.MsgVariables = [...requestPayload.MsgVariables,...answer.AnswerVarList];
        }
        delete answer.AnswerVarList;
        if(this.isWhatsappEnable){
          answer.AnswerText = this.variablePopupService.convertToPlainText(answer.AnswerText);
          answer.AnswerDescription = this.variablePopupService.convertToPlainText(answer.AnswerDescription);
        }
      });
    }
    /** 
     * set unique items in @MsgVariables 
     */
    requestPayload.MsgVariables = Array.from(new Set(requestPayload.MsgVariables));

  }

  updateDescriptionFieldV2(){
    if(this.isWhatsappEnable){
      this.froalaEditorFor.Description.options.ssCharCounterCount = true;
      if(this.questionForm.get('ShowTitle').value && this.questionData.AnswerStructureType == QuizAnswerStructureType.button && this.questionData.Type == 2){
        this.froalaEditorFor.Description.options.ssCharCounterMax = 960;
      }else{
        this.froalaEditorFor.Description.options.ssCharCounterMax = 1024;
      }
      this.froalaEditorFor.Description.options.pluginsEnabled.push('ssCharCounter','ssCharCounterCount','ssCharCounterMax');   
    }
    if(this.froalaEditorFor.Description.FroalaControls){
      this.froalaEditorFor.Description.FroalaControls.destroy();
      setTimeout(() => {    
        this.froalaEditorFor.Description.FroalaControls.getEditor().opts = this.froalaEditorFor.Description.options;
        this.froalaEditorFor.Description.FroalaControls.initialize();
      }, 0);
    }
  }

  public initialize(initControls,froalaFor:string) {
    this.froalaEditorFor[froalaFor]['FroalaControls'] = initControls;
    if(this.froalaEditorFor[froalaFor]['FroalaControls']){
      setTimeout(() => {        
        this.froalaEditorFor[froalaFor]['FroalaControls'].initialize();
      }, 10);
    }
  }

  updateVarListFor(openFor:string){
    let msg = this.froalaEditorFor[openFor].froalaRef.editorRefernce.html.get();     
    let updatedVarist = this.variablePopupService.getListVariableFormulaV2(msg);
    this.questionForm.get(openFor+'VarList').patchValue(updatedVarist)
  }
  
  updateQuestionVarList(){
    setTimeout(() => {      
      if(this.questionData.MsgVariables && this.questionData.MsgVariables.length > 0){
        this.questionData.QuestionTitleVarList = [];
        this.questionData.DescriptionVarList = [];
        this.questionData.MsgVariables.map(item => {
          this.questionData.QuestionTitle.includes(item)? this.questionData.QuestionTitleVarList.push(item) : false;
          this.questionData.Description.includes(item)? this.questionData.DescriptionVarList.push(item) : false;
        });
        this.questionForm.get('QuestionTitleVarList').patchValue(this.questionData.QuestionTitleVarList);
        this.questionForm.get('DescriptionVarList').patchValue(this.questionData.DescriptionVarList);
        this.questionData.AnswerList.map((answer, i) => {
          answer.AnswerVarList = [];
          this.questionData.MsgVariables.map(item => {
            answer.AnswerText.includes(item) ? answer.AnswerVarList.push(item) : false;
          });
          (this.questionForm.get("AnswerList") as FormArray).at(i).get('AnswerVarList').patchValue(answer.AnswerVarList);
        })
      }
    }, 0);
  }

  updateFormForWhatsAppChatbotFlow(){
    if(this.isWhatsappEnable){
      this.questionData.QuestionTitle = this.questionData.QuestionTitle.replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/\s/g,"&nbsp;");
      this.questionData.Description = this.questionData.Description.replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/\s/g,"&nbsp;");
    }
    this.createForm(this.questionData);
    this.updateDescriptionFieldV2();
    this.patchAnswerList(this.questionData.AnswerList);    
    this.commonService.questionForm = this.questionForm;
  }

  getMappedSfFieldsList(){
    this.variablePopupService.mappedSfFieldsObj = {};
  
    this.quizBuilderApiService.getMappedSfFieldsList().subscribe((results) => {
      if (results && results.length > 0) {
        results.forEach((currObj:any) => {
          if(currObj.Fields && currObj.Fields.length > 0){
            currObj.Fields.map((subObj:any) => {
              this.variablePopupService.mappedSfFieldsObj[`${currObj.ObjectName}.${subObj.FieldName}`] = subObj.FieldLabel;
              this.variablePopupService.mappedSfFieldsFullObj[`${currObj.ObjectName}.${subObj.FieldName}`] = subObj;
            });
          }
        });
      }
      this.initializeComponent();
    }), (error:any) => {
      console.log('Could not load Group status  data');
    }
  }

/********************** variable popup implementation ends *****************************/

  saveObjectMappingForComment(){
    let bodyObj:any[] = [];

    this.questionForm.value.AnswerList.map((answer,index) => {
      
      if(answer.ObjectFieldsInAnswerComment){
        answer.ObjectFieldsInAnswerComment.IsExternalSync = false;
        (this.questionForm.controls.AnswerList as FormArray).at(index).get('ObjectFieldsInAnswerComment').patchValue(answer.ObjectFieldsInAnswerComment);
        answer.ObjectFieldsInAnswerComment.AnswerId = answer.AnswerId;
        bodyObj.push(answer.ObjectFieldsInAnswerComment);
      }
    });
    
    if(bodyObj && bodyObj.length > 0){

      this.quizBuilderApiService.updateAnswerObjectMapping(bodyObj).subscribe(data => {
        
      })
    }
  }

  getMediaVersionFromURl(url:string){
    let regex = /\/v(\d+)\//g;
    let matchFound = url.match(regex) || [];
    let version:string = '1';
    if(matchFound && matchFound.length > 0){
      version = matchFound[0].replace(regex,'$1');
    }
    return version;
  }
  
  getDateTypeFieldSettings(){
    this.quizzToolHelper.dateFieldsSyncSettingList = [];
    this.quizBuilderApiService.getDateFieldSyncSettings().subscribe(response => {
      if(response && response.data && response.data.length > 0){
        response.data.map((item,index)=>{
          item.label = item.FieldOptionTitle;
          item.value = index.toString();
          if(item.Fields && item.Fields.length > 0){     
            item.dateFuncList = [];       
            item.Fields.map(subItem => {
              item.dateFuncList.push({label : subItem, value : subItem });
            });
          }
        },true);
        this.quizzToolHelper.dateFieldsSyncSettingList = response.data;
      }
    },error => {
      console.log("failed to get field sync setting");
    });
  }
  
}
