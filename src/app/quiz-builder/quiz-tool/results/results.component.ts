import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy, TemplateRef, Inject, AfterViewInit, Output, Input, EventEmitter } from "@angular/core";
import { QuizBuilderApiService } from "../../quiz-builder-api.service";
import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from "@angular/router";
import { NotificationsService } from "angular2-notifications";
import { ResultSettingsComponent } from "./result-settings/result-settings.component";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { environment } from "../../../../environments/environment";
import { QuizzToolHelper } from "../quiz-tool-helper.service";
import { DOCUMENT, Location } from "@angular/common";
import { QuizToolData } from "../quiz-tool.data";
import { Subscription } from "rxjs/Subscription";
import { FroalaEditorOptions } from "../../email-sms/template-body/template-froala-options";
import { UserInfoService } from "../../../shared/services/security.service";
import { QuizBuilderDataService } from '../../quiz-builder-data.service';
import { Config } from '../../../../config';
import { DynamicMediaReplaceMentsService } from '../dynamic-media-replacement';
import { rightMenuEnum } from '../rightmenu-enum/rightMenuEnum';
import { RemoveallTagPipe } from "../../../shared/pipes/search.pipe";
import { CommonService } from "../../../shared/services/common.service";
import { BrandingLanguage, elementReorderKey, enableItemPage } from "../commonEnum";
import { VariablePopupService } from "../../../shared/services/variable-popup.service";
import { BranchingLogicAuthService } from "../branching-logic-auth.service";
declare var cloudinary: any;
declare var $: any;
const filterPipe = new RemoveallTagPipe();
@Component({
  selector: "app-results",
  templateUrl: "./results.component.html",
  styleUrls: ["./results.component.css"]
})
export class ResultsComponent implements OnInit, OnDestroy , AfterViewInit{
  @Input() isOpenBranchingLogicSide;
  @Output() updateBranchingLogic: EventEmitter<any> = new EventEmitter<any>();
  @Input() resultData;
  public isOpenSizeTooltip = false;
  public isOpenColorTooltip = false;
  public resultId;
  public quizId;
  public resultForm: FormGroup;
  public urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  public ActionButtonTxtSize;
  public ActionButtonColor = "#fff";
  public ActionButtonTitleColor = "#fff";
  public routerSubscription;
  public modalRef: BsModalRef;
  public DescriptionModel: string;
  public quizURL;
  public selectedQuiz;
  public hostURL;
  public imageORvideo;
  public quizTypeId=this.quizzToolHelper.quizTypeId;
  public brandingColor;
  public resetButton:boolean = false;
  public defaultCoverImage:any="https://res.cloudinary.com/dbbkqtyqn/image/upload/v1588680596/Jobrock/automation-place-holder-corner.png";
  private isDynamicMediaDataSubscription: Subscription;

  @ViewChild("resultSettingsTemplate", { read: ViewContainerRef , static:true})
  resultSettingsTemplate: ViewContainerRef;
  public froalaEditorOptions = new FroalaEditorOptions();
  public options : object ;
  public options1 : object ;
  public options2 : object ;
  public nextBtnOptions : object ;
  //mediafile
  public isVisibleMediaLibrary:boolean=false;
  public config = new Config();
  public mediaCheck;
  public isAutoPlay:boolean;
  
  private isStylingSubscription: Subscription;
  private isResultElementSubscription: Subscription;
  public isDescription:boolean;
  public isProcess:boolean = false;
  private isResultSettingSubscription: Subscription;
  public hoverOnMainDiv:boolean = false;
  private isVideoSoundEnableSubscription:Subscription;
  public resultElementReorder:any;
  public isWhatsappEnable = false;
  private isWhatsappEnableSubscription: Subscription;
  private isvideoSecondsToApplySubscription: Subscription;
  private isEnableSetFrameToggleObservableSubscription: Subscription;
  public elementReorderKey = elementReorderKey;
  public isQuesAndContentInSameTable:boolean;
  public IsBranchingLogicEnabled:boolean;

  constructor(
    private quizBuilderApiService: QuizBuilderApiService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private _fb: FormBuilder,
    private userInfoService: UserInfoService,
    @Inject(DOCUMENT) private document: Document,
    private quizzToolHelper: QuizzToolHelper,
    private notificationsService: NotificationsService,
    private _cfr: ComponentFactoryResolver,
    private location: Location,
    private quizToolData:QuizToolData,
    private quizBuilderDataService:QuizBuilderDataService,
    private dynamicMediaReplaceService:DynamicMediaReplaceMentsService,
    private commonService:CommonService,
    private variablePopupService:VariablePopupService,
    private branchingLogicAuthService:BranchingLogicAuthService
  ) {

    this.route.params.subscribe(params => {
        this.resultId = params["rId"];
    });

    this.route.parent.parent.params.subscribe(params => {
      if(params["id"]){
        this.quizId = +params["id"];
      }else{
        this.route.parent.params.subscribe(params => {
          this.quizId = +params["id"];
        });
      }
    });
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
  onResultTitleTextChanges() {
    this.resultForm.controls['InternalTitle'].valueChanges
    .subscribe((data) => {
      var resultInfo = {
        ResultId: this.resultForm.controls.ResultId.value,
        Title: data
      };
      this.quizzToolHelper.updateSidebarOptionsResultTitle.next(resultInfo);
    })
    this.resultForm.valueChanges.subscribe(changedTitle => {
      $(document).ready(function () {
        $(window).on("beforeunload", function () {
          return "";
        });
      });
    });
  }
  

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
    this.DescriptionModel = this.resultForm.get("Description").value;
  }

  confirm(): void {
    this.modalRef.hide();
    this.resultForm.get("Description").patchValue(this.DescriptionModel);
  }

  decline(): void {
    this.modalRef.hide();
  }

  ngOnInit() {
    this.options = this.froalaEditorOptions.setEditorOptions(200);
    this.options2 = this.froalaEditorOptions.setEditorOptions(200);
    this.options1 = this.froalaEditorOptions.setEditorOptions(1000);
    this.updateFroalaOptionsAndEvents();
    this.nextBtnOptions = this.froalaEditorOptions.setEditorOptions(40,'Call to action');
    this.resultElementReorder = this.commonService.getElementReorderStr(true);
    if(!this.resultId){
      this.resultId =this.resultData.ResultId;
    }
    this.hostURL = this.location["_platformLocation"].location.host;
    this.getWhatsappUsage();
    this.getBrandingColors();
    if(!this.isOpenBranchingLogicSide){
      this.assignTagsForCloudinary();
    }
    this.initializeComponent();
    this.routerChangeSubscription();
    this.whenSetTimeConfigurationSaved();
    this.onSaveQuizSubscription();
    this.getDynamicMediaData();
    this.resultSettingSubscription();
    this.getVideoChangeTime();
    this.getSetFrameToggle();

    this.IsBranchingLogicEnabled = this.branchingLogicAuthService.getBranchingLogicEnable();
    if(this.IsBranchingLogicEnabled){
      this.route.data.subscribe((data) => {
        this.isQuesAndContentInSameTable = data["quizData"].IsQuesAndContentInSameTable;
      });
    }else{
      this.route.parent.data.subscribe((data) => {
        this.isQuesAndContentInSameTable = data["quizData"].IsQuesAndContentInSameTable;
      });
    }
  }

  onSaveQuizSubscription(){
    let self = this;
    this.quizBuilderDataService.currentQuizSaveAll.subscribe(function(res){
      if(res){
        self.saveResult();
      }
    });
  }

  resultSettingSubscription(){
    this.isResultSettingSubscription = this.dynamicMediaReplaceService.resultSettingObservable.subscribe(res => {
      if(res && Object.keys(res).length != 0){
        if(res.resultId == this.resultId){
          const filterQuestionTitle = filterPipe.transform(this.resultForm.value.Title ? this.resultForm.value.Title : '');
          if (filterQuestionTitle.trim() && filterQuestionTitle.trim().length > 0) {
            if(this.isOpenBranchingLogicSide){
              this.muteVideos();
            }
            this.saveResult();
            this.dynamicTemplateSettings();
          }
        }
      }
    });
  }

  getVideoChangeTime(){
    this.isvideoSecondsToApplySubscription = this.dynamicMediaReplaceService.videoTimeChangeObservable.subscribe(res => {
       if(res && Object.keys(res).length != 0 && this.resultId == res.id){
         if(res.page == enableItemPage.result_page && this.resultForm.get('SecondsToApply').value != res.secToApply){
          this.resultForm.patchValue({'SecondsToApply': res.secToApply});
          this.resultForm.controls.SecondsToApply.markAsDirty();
         }
       }
     });
  }

  getSetFrameToggle(){
    this.isEnableSetFrameToggleObservableSubscription =  this.dynamicMediaReplaceService.isEnableSetFrameToggleObservable.subscribe((res) =>{
      if(res && Object.keys(res).length != 0 && this.resultId == res.id){
        if(res.page == enableItemPage.result_page && this.resultForm.get('VideoFrameEnabled').value != res.VideoFrameEnabled){
         this.resultForm.patchValue({'VideoFrameEnabled': res.VideoFrameEnabled});
         this.resultForm.controls.VideoFrameEnabled.markAsDirty();
        }
      }
    });
 }

  getBrandingColors(){
    this.isStylingSubscription = this.quizzToolHelper.isStylingObservable.subscribe((data) => {
      if(data && Object.keys(data).length > 0){
         this.brandingColor = data
      }
      else{
        this.brandingColor = this.quizzToolHelper.getBrandingAndStyling();
      }
      this.brandingColor.ActionBtnPlaceholderText = this.brandingColor.Language == BrandingLanguage.Dutch ? 'Klik hier' : 'Click here';
   })
  }

  getWhatsappUsage(){
    this.isWhatsappEnableSubscription = this.dynamicMediaReplaceService.isUsageTypeWhatsAppObservable.subscribe(res => {
      this.isWhatsappEnable = res;
      this.updateFroalaOptionsAndEvents();
      if(this.isWhatsappEnable){
        this.updateFormForWhatsAppChatbotFlow();
      }
    });
  }

  muteVideos(){
    let getPlayVideos = document.getElementsByTagName("video");
    if(getPlayVideos && getPlayVideos.length > 0){
        for(let i=0; i<getPlayVideos.length; i++){
            getPlayVideos[i].muted = true;
        }
    }
  }

  ngAfterViewInit(){
    var idArray = ['result_title_','result_desc_','result_internal_title_']
    idArray.forEach((data)=>{
      this.setStyling(data);
    })

    //set height of description text area reflect only in case of whatsapp flow  
    setTimeout(() => {     
      this.setAutoHeightOfTextArea('reslt_desc_'+this.resultId);
    }, 500);
  }


  getDynamicMediaData(){
    this.isAutoPlay = this.resultForm.get('AutoPlay').value;
    this.isDynamicMediaDataSubscription = this.dynamicMediaReplaceService.isEnableMediaSetiingObjectObservable.subscribe(item=>{
      if(item && item.id == this.resultId && item.page == enableItemPage.result_page && item.data != undefined && item.autoPlayData != undefined){
        let oldEnableMediaFile =this.resultForm.get('EnableMediaFile').value;
        let oldAutoPlayData =this.resultForm.get('AutoPlay').value;
        if(oldEnableMediaFile != item.data || oldAutoPlayData != item.autoPlayData){
          this.resultForm.patchValue({'EnableMediaFile': item.data});
          this.resultForm.patchValue({'AutoPlay': item.autoPlayData});
          this.isAutoPlay = item.autoPlayData; 
          this.resultForm.controls.EnableMediaFile.markAsDirty();
        }
      }
    });
  }

  setStyling(elem){

    if(document.getElementById(elem+this.resultId)){

    var data = document.getElementById(elem+this.resultId).childNodes[1].childNodes[0]['style']
      data.background= this.brandingColor.BackgroundColor;
      data.color= this.brandingColor.FontColor;
      data.fontFamily=this.brandingColor.FontType

    if(elem == 'result_desc_'){
      data.resize = 'vertical'
    }
    }
  }

  onSizeTooltipShown() {
    this.isOpenSizeTooltip = true;
  }

  onSizeTooltipHidden() {
    this.isOpenSizeTooltip = false;
  }

  onColorTooltipShown() {
    this.isOpenColorTooltip = true;
  }

  onColorTooltipHidden() {
    this.isOpenColorTooltip = false;
  }

  /**
   * Get Result Data from Snapshot (i.e from resolve)
   */
  getResultData() {
    if(!this.isOpenBranchingLogicSide){
      this.resultData = this.route.snapshot.data["resultData"];
    }
  }

  /**
   * Function to bind the ngModel values (ActionButtonTxtSize | ActionButtonColor | ActionButtonTitleColor)
   * from the formdata received from the server.
   */
  initializeActionButton() {
    this.ActionButtonTxtSize = this.resultForm
      .get("ActionButtonTxtSize")
      .value.replace("px", "")
      .trim();
    this.ActionButtonColor = this.resultForm.get("ActionButtonColor").value;
    this.ActionButtonTitleColor = this.resultForm.get(
      "ActionButtonTitleColor"
    ).value;
  }

  /**
   * Router Subscription: When the url param changes,
   * this funtion is called and the component is reinitialized with
   * new data
   */
  routerChangeSubscription() {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.saveResult();
      }
      if (event instanceof NavigationEnd) {
        this.initializeComponent();
        //set height of description text area reflect only in case of whatsapp flow  
        setTimeout(() => {     
          this.setAutoHeightOfTextArea('reslt_desc_'+this.resultId);
        }, 500);
      }
    });
  }

  /**
   * Initialiaze component: Used when route param changes
   * e.g result/12 ==> result/44
   */
  initializeComponent() {
    this.getResultData();
    this.createForm(this.resultData);
    this.updateResultVarList();
    this.initializeActionButton();
    this.onResultTitleTextChanges();
    this.onResultElement();
  }

  onResultElement(){
    if(this.isResultElementSubscription){
      this.isResultElementSubscription.unsubscribe();
    }
    if(this.resultForm){
      this.isDescription = this.resultForm.controls.ShowDescription.value;
      this.resultElementReorder.map(resultReorder => {
        if(resultReorder.key == this.elementReorderKey.title){
          resultReorder.displayOrder = this.resultForm.get('DisplayOrderForTitle').value;
        }else if(resultReorder.key == this.elementReorderKey.media){
          resultReorder.displayOrder = this.resultForm.get('DisplayOrderForTitleImage').value;
        }else if(resultReorder.key == this.elementReorderKey.description){
          resultReorder.displayOrder = this.resultForm.get('DisplayOrderForDescription').value;
        }else if(resultReorder.key == this.elementReorderKey.button){
          resultReorder.displayOrder = this.resultForm.get('DisplayOrderForNextButton').value;
        }
      });
      this.resultElementReorder.sort((a, b) => (a.displayOrder > b.displayOrder) ? 1 : -1)
    }
    this.isResultElementSubscription = this.dynamicMediaReplaceService.resultElementSettingObservable.subscribe(res => {
      if(res && Object.keys(res).length != 0 && (res.resultId == this.resultId) && res.elementData && res.elementData.length > 0){
        this.resultElementReorder = [];
        let titleOrder = false;
        let mediaOrder = false;
        let descriptionOrder = false;
        let buttonOrder = false;
        let media = false;
        let button = false;
        res.elementData.map(ele => {
          if(ele.key == this.elementReorderKey.title){
            titleOrder = ele.displayOrder;
          }else if(ele.key == this.elementReorderKey.media){
            media = ele.value;
            mediaOrder = ele.displayOrder;
          }else if(ele.key == this.elementReorderKey.description){
            this.isDescription = ele.value;
            descriptionOrder = ele.displayOrder;
          }else if(ele.key == this.elementReorderKey.button){
            button = ele.value;
            buttonOrder = ele.displayOrder;
          }
        });
        this.resultElementReorder = res.elementData;
        this.resultForm.patchValue({
          'ShowResultImage': media,
          'ShowDescription': this.isDescription,
          'EnableCallToActionButton': button,
          'DisplayOrderForTitle':titleOrder,
          'DisplayOrderForTitleImage':mediaOrder,
          'DisplayOrderForDescription':descriptionOrder,
          'DisplayOrderForNextButton':buttonOrder,
          'EnableMediaFile': media ? this.resultForm.get('EnableMediaFile').value : false
        });
        this.resultForm.markAsDirty();
      }
    });
  }

  detectLeadFormCapturEvent(data){
    this.resultForm.controls['ShowLeadUserForm'].patchValue(data);
  }
  /**
   * To publish Quiz against QuizId
   */
  onPublished() {
    this.quizBuilderApiService.publishQuiz(this.quizId).subscribe(
      data => {
        this.notificationsService.success("Success");
      },
      error => {
        this.notificationsService.error("Error");
      }
    );
  }

  /**
   * Dynamic Result Settings component Created on click event
   */
  dynamicTemplateSettings() {
    this.resultSettingsTemplate.clear();
    var RES_settingsTemplate = this._cfr.resolveComponentFactory(
      ResultSettingsComponent
    );
    var RES_settingsComponentRef = this.resultSettingsTemplate.createComponent(
      RES_settingsTemplate
    );
    RES_settingsComponentRef.instance.resultData = this.resultForm.value;
    RES_settingsComponentRef.instance.leadFormCaptureEvent.subscribe((data) => {
      this.detectLeadFormCapturEvent(data);
    })
  }

  hideCallToAction() {
    this.resultData.HideCallToAction = !this.resultData.HideCallToAction;
    var hideActionBooleanValue = !this.resultForm.get("HideCallToAction").value;
    this.resultForm.controls.HideCallToAction.markAsDirty();
    this.resultForm.get("HideCallToAction").patchValue(hideActionBooleanValue);
  }

  hideResultImage() {
    this.resultForm
      .get("ShowResultImage")
      .patchValue(!this.resultForm.get("ShowResultImage").value);
    this.resultForm.controls.ShowResultImage.markAsDirty();
  }

  saveResult() {
    var body = JSON.parse(JSON.stringify(this.resultForm.value));
    body.Description = this.variablePopupService.updateTemplateVarHTMLIntoVariableV2(body.Description);
    body.Title = this.variablePopupService.updateTemplateVarHTMLIntoVariableV2(body.Title);
    var re = new RegExp("^(http|https)://", "i");
    if(!re.test(body.ActionButtonURL)){
      body.ActionButtonURL = 'http://'+body.ActionButtonURL;
    }
    // const filterQuestionTitle = filterPipe.transform(this.resultForm.value.Title ? this.resultForm.value.Title : '');
    const filterQuestionTitle = filterPipe.transform(body.Title ? body.Title : '');
    if ((this.resultForm.dirty || this.resetButton) && filterQuestionTitle.trim() && filterQuestionTitle.trim().length > 0) {
      if(this.isWhatsappEnable){
        body.Description = this.variablePopupService.convertToPlainText(body.Description);
        body.Title = this.variablePopupService.convertToPlainText(body.Title);
      }
      body.MsgVariables = [];
      if(body.TitleVarList && body.TitleVarList.length > 0){
        body.MsgVariables = [...body.MsgVariables,...body.TitleVarList];
        delete body.TitleVarList;
      }
      if(body.DescriptionVarList && body.DescriptionVarList.length > 0){
        body.MsgVariables = [...body.MsgVariables,...body.DescriptionVarList];
        delete body.DescriptionVarList
      }
      /** 
       * set unique items in @MsgVariables 
       */
      body.MsgVariables = Array.from(new Set(body.MsgVariables));
      // delete body.ResultSettings;
      this.quizBuilderApiService.updateResultDetails(body).subscribe(
        data => {
          this.route.snapshot.data["resultData"] = body;
          $(window).off("beforeunload");
          this._markFormPristine(this.resultForm);
          // this.notificationsService.success("Success");
          this.quizzToolHelper.updateMultipleData.next("3");
          if(this.isOpenBranchingLogicSide){
            this.updateBranchingLogic.emit();
          }
        },

        error => {
          this.notificationsService.error("Error");
        }
      );
    }
  }

  private _markFormPristine(form: FormGroup): void {
    Object.keys(form.controls).forEach(control => {
      form.controls[control].markAsPristine();
    });
  }

  public setTimeConfigurationSubscription: Subscription
    /**
   * Function called when user saves set Time configuration in resultSettingsComponent
   */
  whenSetTimeConfigurationSaved() {
    this.setTimeConfigurationSubscription = this.quizzToolHelper.resultDataChange.subscribe(data => {
      this.resultData.ResultSettings = data;
      this.resultForm.controls['ResultSettings'].reset(); 
      this.fetchResultDetails();
      });
  }

  fetchResultDetails(){
    this.initializeComponent();
  }

  /**
   * Function to create Form
   */
  private createForm(data) {
    this.isAutoPlay = data.AutoPlay;
    this.imageORvideo = this.commonService.getImageOrVideo(data.Image);
    this.resultForm = this._fb.group({
      ResultId: [data.ResultId],
      ShowResultImage: [data.ShowResultImage],
      Title: [this.variablePopupService.updateTemplateVariableIntoHTMLV2(data.Title)],
      Image: [data.Image],
      Description: [this.variablePopupService.updateTemplateVariableIntoHTMLV2(data.Description)],
      EnableMediaFile: [data.EnableMediaFile],
      AutoPlay: [data.AutoPlay],
      HideCallToAction: [data.HideCallToAction],
      InternalTitle:[data.InternalTitle?data.InternalTitle:"Result 1"],
      ActionButtonURL: [
        data.ActionButtonURL,
        [Validators.pattern(this.urlRegex)]
      ],
      OpenLinkInNewTab: [data.OpenLinkInNewTab],
      ActionButtonTxtSize: [data.ActionButtonTxtSize],
      ActionButtonColor: [data.ActionButtonColor? data.ActionButtonColor : this.brandingColor ? this.brandingColor.ButtonColor : ''],
      ActionButtonTitleColor: [data.ActionButtonTitleColor ? data.ActionButtonTitleColor : this.brandingColor ? this.brandingColor.ButtonFontColor : ''],
      ActionButtonText: [data.ActionButtonText],
      ResultSettings: this._fb.group({
        QuizId: [data.ResultSettings.QuizId],
        ShowScoreValue: [data.ResultSettings.ShowScoreValue],
        ShowCorrectAnswer: [data.ResultSettings.ShowCorrectAnswer],
        AutoPlay: [data.ResultSettings.AutoPlay],
        CustomTxtForScoreValueInResult: [
          data.ResultSettings.CustomTxtForScoreValueInResult
        ],
        CustomTxtForAnswerKey: [data.ResultSettings.CustomTxtForAnswerKey],
        CustomTxtForYourAnswer: [data.ResultSettings.CustomTxtForYourAnswer],
        CustomTxtForCorrectAnswer: [
          data.ResultSettings.CustomTxtForCorrectAnswer
        ],
        CustomTxtForExplanation: [data.ResultSettings.CustomTxtForExplanation],
        RevealAfter: [data.ResultSettings.RevealAfter]
      }),
      PublicIdForResult: [data.PublicIdForResult],
      MaxScore :[data.MaxScore],
      MinScore :[data.MinScore],
      ShowLeadUserForm: [data.ShowLeadUserForm],
      ShowExternalTitle:[data.ShowExternalTitle],
      ShowInternalTitle:[true],
      ShowDescription:[data.ShowDescription ? data.ShowDescription : false],
      QuizId : [this.quizId],
      DisplayOrderForNextButton:[data.DisplayOrderForNextButton],
      DisplayOrderForDescription:[data.DisplayOrderForDescription],
      DisplayOrderForTitle:[data.DisplayOrderForTitle],
      DisplayOrderForTitleImage:[data.DisplayOrderForTitleImage],
      EnableCallToActionButton:[data.EnableCallToActionButton],
      SecondsToApply:[data.SecondsToApply],
      VideoFrameEnabled:[data.VideoFrameEnabled],
      TitleVarList:[],
      DescriptionVarList:[]
    });
    this.mediaCheck=data.EnableMediaFile;
    this.commonService.onLoadvideo('update',true);
  }

  resetColor()
  {
    this.resetButton =true;
    this.resultForm.patchValue({
      ActionButtonColor : this.brandingColor.ButtonColor,
      ActionButtonTitleColor : this.brandingColor.ButtonFontColor
    });
    this.ActionButtonColor = this.brandingColor.ButtonColor;
    this.ActionButtonTitleColor = this.brandingColor.ButtonFontColor;
    this.saveResult();
  }
  /**
   * Change Event when Font size changes
   * @param font Font size of Button Text
   */
  onActionButtonTxtSizeChange(font) {
    this.resultForm.get("ActionButtonTxtSize").patchValue(font + " px");
    this.resultForm.controls.ActionButtonTxtSize.markAsDirty();
  }

  /**
   * Change Event when Button Color Changes
   * @param btnColor Button Color
   */
  onActionButtonColorChange(btnColor) {
    this.resultForm.get("ActionButtonColor").patchValue(btnColor);
    this.resultForm.controls.ActionButtonColor.markAsDirty();
  }

  /**
   * Change Event when title Color changes
   * @param titleColor
   */
  onActionButtonTitleColorChange(titleColor) {
    this.resultForm.get("ActionButtonTitleColor").patchValue(titleColor);
    this.resultForm.controls.ActionButtonTitleColor.markAsDirty();
  }

  /**
   * Save Button Text Size via API
   */
  saveActionButtonTxtSize() {
    this.saveResult();
  }

  /**
   * Save Button Color (or Background) via API
   */
  saveActionButtonColorConfig() {
    this.saveResult();
  }

  /**
   * Save Button url via API
   */
  saveActionButtonURL() {
    this.saveResult();
  }

    //use Media Lib

    onUseMedia(){
      if(this.config.disableMedia){
        this.uploadResultImage();
      }else{
      this.isVisibleMediaLibrary=true;
      }
    }
  
    changeUploadedUrl(event){
      if(event.message == "success"){
        if (event.externalUrl) {
          this.imageORvideo = this.commonService.getImageOrVideo(event.externalUrl);
          if(this.isWhatsappEnable){
            event.externalUrl = this.commonService.transformMediaExtention(event.externalUrl, this.imageORvideo);
          }
          this.resultForm.controls.Image.patchValue(event.externalUrl);
        }
        this.resultForm.patchValue({ PublicIdForResult: event.publicId, SecondsToApply: 0});
        this.resultForm.controls.Image.markAsDirty();
        this.saveResult();
        this.commonService.onLoadvideo('update',true);
      }
      this.isVisibleMediaLibrary=false;
      let self = this;
      setTimeout(function(){self.openEnableMediaSetiing('img')}, 1500);
    }

  /**
   * Function to upload image
   */
  uploadResultImage() {
    var env_result = Object.assign({}, environment.cloudinaryConfiguration);
    env_result.cropping_aspect_ratio = 2.25;
    env_result.min_image_width = '900';
    env_result.min_image_height = '400';
    var widget = cloudinary.createUploadWidget(
      env_result,
      (error, result) => {
        if (!error && result[0].secure_url) {
          this.imageORvideo = this.commonService.getImageOrVideo(result[0].secure_url);
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
          this.resultForm.controls.Image.patchValue(result[0].secure_url);
          this.resultForm.patchValue({ PublicIdForResult: result[0].public_id });
          this.resultForm.controls.Image.markAsDirty();
          this.saveResult();
        } else {
          console.log(
            "Error! Cloudinary upload widget error resultImage",
            error
          );
        }
      }
    );
    widget.open(this.resultForm.controls.Image.value);
  }

  removeImagePopup() {
    this.imageORvideo = "image";
    this.resultForm.patchValue({
      Image: "",
      SecondsToApply : 0
    });
    this.resultForm.controls.Image.markAsDirty();
    this.saveResult();
    this.openEnableMediaSetiing('main');
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

  setElementObj(){
    let elementArr = [
      {
        "key":this.elementReorderKey.title,
        "value":this.resultForm.get('ShowExternalTitle').value,
        "displayOrder":this.resultForm.get('DisplayOrderForTitle').value
      },
      {
        "key":this.elementReorderKey.media,
        "value":this.resultForm.get('ShowResultImage').value,
        "displayOrder":this.resultForm.get('DisplayOrderForTitleImage').value
      },
      {
        "key":this.elementReorderKey.description,
        "value":this.resultForm.get('ShowDescription').value,
        "displayOrder":this.resultForm.get('DisplayOrderForDescription').value,
      },
      {
        "key":this.elementReorderKey.button,
        "value":this.resultForm.get('EnableCallToActionButton').value,
        "displayOrder":this.resultForm.get('DisplayOrderForNextButton').value
      }
    ];
    return elementArr;
  }

  sendEnableSettingData(text,setFrameVideo,elementArr){
    let elementCollapse = (text == 'main') ? true : false;
    let mediaCollapse = (text == 'img') ? true : false;
    this.dynamicMediaReplaceService.isOpenEnableMediaSetiing = {
      "page":'result_page',
      "data":this.resultForm.get('EnableMediaFile').value,
      "isVideo":this.imageORvideo,
      "autoPlayData":this.resultForm.get('AutoPlay').value,
      "isOpen":true,
      "menuType":rightMenuEnum.resultPageSetting,
      "resultId":this.resultId,
      "elementEnable":elementCollapse,
      "mediaEnable":mediaCollapse,
      "resultElement": elementArr,
      "setFrameVideo":setFrameVideo
    };
  }

  openEnableMediaSetiing(text:any){
    let videoDuration = 0;
    let elementArr = this.setElementObj();
    if(!this.isProcess){
      this.isProcess = true;
      if(text == 'closeTab'){
        this.dynamicMediaReplaceService.isOpenEnableMediaSetiing = {
          "isOpen":false,
          "menuType":rightMenuEnum.resultPageSetting
        };
      }else{
        if(this.imageORvideo == "video"){
          let clVideoEle = this.commonService.onLoadvideo('update');
          if(clVideoEle){
            videoDuration = clVideoEle.duration;
          }
        }
        let setFrameVideo = {
          "videoDuration" : isFinite(videoDuration) ? videoDuration : 0,
          "secondsToApply" : this.resultForm.get('SecondsToApply').value,
          "videoFrameEnabled": this.resultForm.get('VideoFrameEnabled').value
        }
        this.sendEnableSettingData(text,setFrameVideo,elementArr);
      }
      this.dynamicMediaReplaceService.changeOpenEnableMediaSetiingSubmission();
    }
    if(this.isProcess){
      let self = this;
      setTimeout(function(){ self.isProcess = false}, 300);
    }
  }

  // poster function 
  applyposter(){
    let startOffset:string = "0";
    if(this.resultForm.get('VideoFrameEnabled').value == true && this.resultForm.get('SecondsToApply').value){
      startOffset = this.resultForm.get('SecondsToApply').value;
    }
    return `{ "cloud-name":"${environment.cloudinaryConfiguration.cloud_name}", "transformation": [{"start-offset": ${startOffset}, "fetch_format": "auto", "quality": "auto"}]}`
  }

  ngOnDestroy() {
    if(this.isStylingSubscription){
      this.isStylingSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if(this.isDynamicMediaDataSubscription != undefined && this.isDynamicMediaDataSubscription != null){
      this.isDynamicMediaDataSubscription.unsubscribe();
    }
    if(this.isResultElementSubscription){
      this.isResultElementSubscription.unsubscribe();
    }
    if(this.isResultSettingSubscription){
      this.isResultSettingSubscription.unsubscribe();
    }
    if(this.isVideoSoundEnableSubscription){
      this.isVideoSoundEnableSubscription.unsubscribe();
    }
    if(this.isWhatsappEnableSubscription){
      this.isWhatsappEnableSubscription.unsubscribe();
    }
    if(this.isvideoSecondsToApplySubscription){
      this.isvideoSecondsToApplySubscription.unsubscribe();
    }
    if(this.isEnableSetFrameToggleObservableSubscription){
      this.isEnableSetFrameToggleObservableSubscription.unsubscribe();
    }
  }

  setAutoHeightOfTextArea(id:any){
    var textarea = document.getElementById(id);
    if(textarea){
      textarea.style.height = "";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }

  /********************** variable popup implementation start *****************************/
  public froalaOpenedFor: string;
  public froalaEditorFor: any = {};

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
    let listOfUsedVariableObj = this.variablePopupService.listOfUsedVariableObj;
    if(this.variablePopupService.variablePopupOpened == 'Title' || this.variablePopupService.variablePopupOpened == 'Description'){
      let activeFroalaRef = this.froalaEditorFor[this.froalaOpenedFor].froalaRef;
      let tempVarFormulaList:any = [];
      listOfUsedVariableObj.map(varItem => {
        tempVarFormulaList.push(varItem.formula.replace(/^%/g,'{{').replace(/%$/g,'}}'));
      });
      this.resultForm.get(this.variablePopupService.variablePopupOpened+'VarList').patchValue(tempVarFormulaList);
      this.variablePopupService.insertFormulaIntoEditorV2(listOfUsedVariableObj, activeFroalaRef);
      this.resultForm.markAsDirty();
    }
  }

  initFroalaOptionsAndEventsFor(froalaFor:any){
    if(!this.froalaEditorFor[froalaFor]){
      this.froalaEditorFor[froalaFor] = {
        "isShowVarBtn":false,
        "froalaRef": new FroalaEditorOptions(),
      }
    }
    let maxCharCount = (froalaFor == 'Title' ? this.isWhatsappEnable ? 60 : 200 : this.isWhatsappEnable ? 1024 : 1000);
    this.froalaEditorFor[froalaFor].froalaRef.SSEditorCharCount();
    this.froalaEditorFor[froalaFor].options = this.froalaEditorFor[froalaFor].froalaRef.setEditorOptions(maxCharCount);
    this.froalaEditorFor[froalaFor].options.froalaFor = froalaFor;
    this.froalaEditorFor[froalaFor].options.charCounterCount = false;
    this.froalaEditorFor[froalaFor].options.ssCharCounterCount = true;
    this.froalaEditorFor[froalaFor].options.ssCharCounterMax = maxCharCount;
    if(this.isWhatsappEnable && froalaFor == 'Title'){
      this.froalaEditorFor[froalaFor].options.multiLine = false;
    }
    this.froalaEditorFor[froalaFor].options.pluginsEnabled.push('ssCharCounter','ssCharCounterCount','ssCharCounterMax');   
    this.froalaEditorFor[froalaFor].options.events["froalaEditor.focus"] = (e, editor) => { 
      if(e.target.classList.contains("text-view")){
        editor.toolbar.hide();
      }else{
        editor.toolbar.show();
      }                  
    }
    this.froalaEditorFor[froalaFor].options.events["froalaEditor.blur"] = (e, editor) => {                               
      editor.toolbar.hide();
    }
    this.froalaEditorFor[froalaFor].options.events["froalaEditor.initialized"] = (e, editor) =>{
      this.froalaEditorFor[editor.opts.froalaFor].froalaRef.editorRefernce = editor;
      editor.toolbar.hide();
      if(e.target.parentElement.classList.contains( 'has-title-variable' )){    
        editor.events.bindClick($('body'), 'i#title-btn-variable', function () {      
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
    //for Title
    this.initFroalaOptionsAndEventsFor('Title');
    //for Description
    this.initFroalaOptionsAndEventsFor('Description');
  }

  updateResultVarList(){
    setTimeout(() => {      
      if(this.resultData.MsgVariables && this.resultData.MsgVariables.length > 0){
        this.resultData.TitleVarList = [];
        this.resultData.DescriptionVarList = [];
        this.resultData.MsgVariables.map(item => {
          this.resultData.Title.includes(item)? this.resultData.TitleVarList.push(item) : false;
          this.resultData.Description.includes(item)? this.resultData.DescriptionVarList.push(item) : false;
        });
        this.resultForm.get('TitleVarList').patchValue(this.resultData.TitleVarList);
        this.resultForm.get('DescriptionVarList').patchValue(this.resultData.DescriptionVarList);
      }
    }, 0);
  }

  updateVarListFor(openFor:string){
    let msg = this.froalaEditorFor[openFor].froalaRef.editorRefernce.html.get();     
    let updatedVarist = this.variablePopupService.getListVariableFormulaV2(msg);
    this.resultForm.get(openFor+'VarList').patchValue(updatedVarist);
  }

  updateFormForWhatsAppChatbotFlow(){
    if(this.isWhatsappEnable){
      this.resultData.Title = this.resultData.Title.replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/\s/g,"&nbsp;");
      this.resultData.Description = this.resultData.Description.replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/\s/g,"&nbsp;");
    }
    this.createForm(this.resultData);
  }
  /********************** variable popup implementation ends *****************************/
}
