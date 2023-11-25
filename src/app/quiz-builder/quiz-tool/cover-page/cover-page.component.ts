import { Component,OnInit,OnDestroy,Inject,Input,Output,EventEmitter } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { QuizBuilderApiService } from "../../quiz-builder-api.service";
import { FormGroup, FormControl } from "@angular/forms";
import "rxjs/add/operator/debounceTime";
import { NotificationsService } from "angular2-notifications";
import { Cloudinary } from "@cloudinary/angular-5.x";
import { QuizzToolHelper } from "../quiz-tool-helper.service";
import { Subscription } from "rxjs/Subscription";
import { environment } from "../../../../environments/environment";
import { BsModalRef } from "ngx-bootstrap";
import { DOCUMENT, Location } from "@angular/common";
import { QuizToolData } from "../quiz-tool.data";
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
// declare var spellCheck

@Component({
  selector: "app-cover-page",
  templateUrl: "./cover-page.component.html",
  styleUrls: ["./cover-page.component.css"]
})
export class CoverPageComponent implements OnInit, OnDestroy {
  public quizId;
  @Input() coverPageDetail;
  @Input() isOpenBranchingLogicSide;
  @Output() updateBranchingLogic: EventEmitter<any> = new EventEmitter<any>();
  public coverPageForm: FormGroup;
  public selectedQuiz;
  public modalRef: BsModalRef;
  public valueChangesSubscriptionCoverTitle: Subscription;
  public quizURL;
  public quizTypeId;
  public hostURL;
  public openMode;
  public imageORvideo;
  public video_public_id;
  public selectedSpeed: string = "0";
  public speedList: Array<any> = [
    { label: '0.5x', value: '-100' },
    { label: '0.75x', value: '-50' },
    { label: '1x', value: '0' },    
    { label: '1.25x', value: '25' },
    { label: '1.5x', value: '50' },
    { label: '1.75x', value: '75' },
    { label: '2x', value: '100' }
  ];
  public brandingColors;
  public options : object ;
  public textAreaOptions: object;
  public froalaEditorOptions = new FroalaEditorOptions();
  public classList =["resize","new-blue","cover-subhead"];
  public coverSettingData;
  public coverTilte;
  private isSuccessSubmissionSubscription: Subscription;
  public preCoverTitle:any;
  public config = new Config();
  public mediaCheck;
  private isDynamicMediaDataSubscription: Subscription;
  public isAutoPlay:boolean;
  
  //mediafile
  public isVisibleMediaLibrary:boolean=false;

  public defaultCoverImage:any="https://res.cloudinary.com/dbbkqtyqn/image/upload/v1588680596/Jobrock/automation-place-holder-corner.png";
  public defaultWhatsAppCover:any="https://res.cloudinary.com/dbbkqtyqn/image/upload/v1646131152/Jobrock/whatsapp-place-holder.jpg";
  public WhatsAppCoverPublicId:any="Jobrock/whatsapp-place-holder";

  public isMediaEnable:boolean = false;
  public isDesEnable:boolean = false;
  public isButtonEnable:boolean = false;
  private isCoverElementSubscription: Subscription;
  private isVideoSoundEnableSubscription:Subscription;
  private isStylingSubscription: Subscription;
  public isProcess:boolean = false;
  public hoverOnMainDiv:boolean = false;
  public coverElementReorder:any;
  public elementReorderKey = elementReorderKey;
  
public isQuesAndContentInSameTable:boolean;
public IsBranchingLogicEnabled:boolean;

public isWhatsappEnable = false;
private isWhatsappEnableSubscription: Subscription;
private isvideoSecondsToApplySubscription: Subscription;
private isEnableSetFrameToggleObservableSubscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private quizBuilderApiService: QuizBuilderApiService,
    private notificationsService: NotificationsService,
    private quizzToolHelper: QuizzToolHelper,
    private cloudinary: Cloudinary,
    private userInfoService: UserInfoService,
    private location: Location,
    private quizToolData:QuizToolData,
    private quizBuilderDataService:QuizBuilderDataService,
    private dynamicMediaReplaceService:DynamicMediaReplaceMentsService,
    private commonService:CommonService,
    private variablePopupService:VariablePopupService,
    private branchingLogicAuthService:BranchingLogicAuthService
  ) {}

  ngOnInit() {
    this.options = this.froalaEditorOptions.setEditorOptions(40);
    this.textAreaOptions = this.froalaEditorOptions.setEditorOptions(1000);
    this.updateFroalaOptionsAndEvents();
    this.quizTypeId = this.quizzToolHelper.quizTypeId;
    this.hostURL = this.location["_platformLocation"].location.host;
    this.coverElementReorder = this.commonService.getElementReorderStr(true);
    this.getWhatsappUsage();
    this.getBrandingColors();
    if(!this.isOpenBranchingLogicSide){
      this.assignTagsForCloudinary()
    }
    this.routerParamSubscription();
    this.createForm();
    this.getQuizCoverDetails();
    this.updateCoverVarList();
    this.onChanges();
    this.onCoverTitleTextChanges();
    this.setPreCoverTitle();
    this.getCoverTitle();
    this.getVideoChangeTime();
    this.getSetFrameToggle();
    this.onSaveQuizSubscription();
    this.getDynamicMediaData();
    this.patchElementOrderList();
    this.getElementOrderList();
    
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
        self.updateQuizCoverDetails();
      }
    });
  }

  getElementOrderList(){
    this.isCoverElementSubscription = this.dynamicMediaReplaceService.isCoverElementSettingObservable.subscribe(res => {
      if(res && Object.keys(res).length != 0){
        this.coverElementReorder = [];
        let titleOrder = false;
        let mediaOrder = false;
        let descriptionOrder = false;
        let buttonOrder = false;
        res.map(ele => {
          if(ele.key == this.elementReorderKey.title){
            titleOrder = ele.displayOrder;
          }else if(ele.key == this.elementReorderKey.media){
            this.isMediaEnable = ele.value;
            mediaOrder = ele.displayOrder;
          }else if(ele.key == this.elementReorderKey.description){
            this.isDesEnable = ele.value;
            descriptionOrder = ele.displayOrder;
          }else if(ele.key == this.elementReorderKey.button){
            this.isButtonEnable = ele.value;
            buttonOrder = ele.displayOrder;
          }
        });
        this.coverElementReorder = res;
        this.coverPageForm.patchValue({
          'ShowDescription' : this.isDesEnable,
          'EnableNextButton' : this.isButtonEnable,
          'ShowQuizCoverImage' : this.isMediaEnable,
          'DisplayOrderForTitle': titleOrder,
          'DisplayOrderForTitleImage' : mediaOrder,
          'DisplayOrderForDescription' : descriptionOrder,
          'DisplayOrderForNextButton' : buttonOrder,
          'EnableMediaFile' : !this.isMediaEnable ? false : this.coverPageForm.get('EnableMediaFile').value
        });
        this.coverPageForm.markAsDirty();
      }
    });
  }

  patchElementOrderList(){
    if(this.coverPageForm){
      this.coverPageForm.patchValue({'ShowQuizCoverTitle' : true});
      this.isDesEnable =this.coverPageForm.get('ShowDescription').value;
      this.isButtonEnable = this.coverPageForm.get('EnableNextButton').value;
      this.isMediaEnable = this.coverPageForm.get('ShowQuizCoverImage').value;
      this.coverElementReorder.map(coverReorder => {
        if(coverReorder.key == this.elementReorderKey.title){
          coverReorder.displayOrder = this.coverPageForm.get('DisplayOrderForTitle').value;
        }else if(coverReorder.key == this.elementReorderKey.media){
          coverReorder.displayOrder = this.coverPageForm.get('DisplayOrderForTitleImage').value;
        }else if(coverReorder.key == this.elementReorderKey.description){
          coverReorder.displayOrder = this.coverPageForm.get('DisplayOrderForDescription').value;
        }else if(coverReorder.key == this.elementReorderKey.button){
          coverReorder.displayOrder = this.coverPageForm.get('DisplayOrderForNextButton').value;
        }
      });
      this.coverElementReorder.sort((a, b) => (a.displayOrder > b.displayOrder) ? 1 : -1)
    }
  }

  getBrandingColors(){
    this.isStylingSubscription = this.quizzToolHelper.isStylingObservable.subscribe((data) => {
      if(data && Object.keys(data).length > 0){
         this.brandingColors = data
      }
      else{
        this.brandingColors = this.quizzToolHelper.getBrandingAndStyling();
      }
      this.brandingColors.QuizStartBtnPlaceholderText = this.brandingColors.Language == BrandingLanguage.Dutch ? 'Start' : 'Start';
   })
  }

  getWhatsappUsage(){
    this.isWhatsappEnableSubscription = this.dynamicMediaReplaceService.isUsageTypeWhatsAppObservable.subscribe(res => {
      this.isWhatsappEnable = res
      if(this.isWhatsappEnable && this.coverPageForm){
        this.updateQuizCoverImage();
      }
    });
  }

  getVideoChangeTime(){
   this.isvideoSecondsToApplySubscription = this.dynamicMediaReplaceService.videoTimeChangeObservable.subscribe(res => {
      if(res && Object.keys(res).length != 0 && res.page == 'cover_page' && this.coverPageForm.get('SecondsToApply').value != res.secToApply){
        this.coverPageForm.patchValue({'SecondsToApply': res.secToApply});
        this.coverPageForm.markAsDirty();
      }
    });
  }
  getSetFrameToggle(){
     this.isEnableSetFrameToggleObservableSubscription =  this.dynamicMediaReplaceService.isEnableSetFrameToggleObservable.subscribe(res =>{
      if(res && Object.keys(res).length != 0 && res.page == 'cover_page' && this.coverPageForm.get('VideoFrameEnabled').value != res.VideoFrameEnabled){
        this.coverPageForm.patchValue({'VideoFrameEnabled': res.VideoFrameEnabled});
        this.coverPageForm.markAsDirty();
      }
     });
  }


  getDynamicMediaData(){
    this.isAutoPlay = this.coverPageForm.get('AutoPlay').value;
    this.isDynamicMediaDataSubscription = this.dynamicMediaReplaceService.isEnableMediaSetiingObjectObservable.subscribe(item=>{
      if(item && item.page == 'cover_page' && item.data != undefined && item.autoPlayData != undefined){
        let oldEnableMediaFile =this.coverPageForm.get('EnableMediaFile').value;
        let oldAutoPlayData =this.coverPageForm.get('AutoPlay').value;
        if(oldEnableMediaFile != item.data || oldAutoPlayData != item.autoPlayData){
          this.coverPageForm.patchValue({'EnableMediaFile': item.data});
          this.coverPageForm.patchValue({'AutoPlay': item.autoPlayData});
          this.isAutoPlay = item.autoPlayData; 
          this.coverPageForm.markAsDirty();
        }
      }
    });
  }


  setPreCoverTitle(){
    this.preCoverTitle=this.coverPageDetail.QuizTitle;
    this.mediaCheck = this.coverPageDetail.EnableMediaFile;
    if(this.preCoverTitle != this.quizBuilderDataService.isPreQuizCoverTitleSubmission){
      this.quizBuilderDataService.isPreQuizCoverTitleSubmission=this.coverPageDetail.QuizTitle;
      this.quizBuilderDataService.changeIsPreQuizCoverTitleSubmission();
    }
  }

  getCoverTitle(){
    this.isSuccessSubmissionSubscription = this.quizBuilderDataService.isQuizCoverTitleSubmissionObservable.subscribe((item: any) => {
      this.coverPageForm.value.QuizTitle = item;
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
   * @description Accessing SnapShot data from resolve
   */
  private getQuizCoverDetails() {
    if(!this.isOpenBranchingLogicSide){
      this.coverPageDetail = this.route.snapshot.data["coverPageDetail"];
    }
    this.imageORvideo = this.commonService.getImageOrVideo(this.coverPageDetail.QuizCoverImage);
    let tempCoverDetails: any = JSON.parse(JSON.stringify(this.coverPageDetail));
    tempCoverDetails.QuizDescription = this.variablePopupService.updateTemplateVariableIntoHTMLV2(tempCoverDetails.QuizDescription);
    tempCoverDetails.QuizCoverTitle = this.variablePopupService.updateTemplateVariableIntoHTMLV2(tempCoverDetails.QuizCoverTitle);
    this.coverPageForm.patchValue(tempCoverDetails);
    if (!this.coverPageDetail.QuizTitle) {
      this.coverPageForm.patchValue({
        QuizTitle: "Untitled Quiz"
      });
    }
  }

  /**
   * @description Create Form Instance
   */
  createForm() {
    this.coverPageForm = new FormGroup({
      QuizCoverImage: new FormControl(""),
      QuizCoverImgAltTag: new FormControl(""),
      QuizCoverImgAttributionLabel: new FormControl(""),
      QuizCoverImgHeight: new FormControl(""),
      QuizCoverImgWidth: new FormControl(""),
      QuizCoverImgXCoordinate: new FormControl(""),
      QuizCoverImgYCoordinate: new FormControl(""),
      QuizDescription: new FormControl(""),
      QuizId: new FormControl(""),
      QuizStartButtonText: new FormControl(""),
      QuizTitle: new FormControl(""),
      QuizCoverTitle: new FormControl(""),
      PublicIdForQuizCover: new FormControl(""),
      EnableMediaFile:new FormControl(""),
      AutoPlay:new FormControl(""),
      ShowQuizCoverTitle:new FormControl(""),
      ShowDescription:new FormControl(""),
      EnableNextButton:new FormControl(""),
      ShowQuizCoverImage:new FormControl(""),
      DisplayOrderForTitle:new FormControl(""),
      DisplayOrderForTitleImage:new FormControl(""),
      DisplayOrderForDescription:new FormControl(""),
      DisplayOrderForNextButton:new FormControl(""),
      SecondsToApply:new FormControl(""),
      VideoFrameEnabled:new FormControl(""),
      QuizCoverTitleVarList:new FormControl(""),
      QuizDescriptionVarList:new FormControl("")
    });
  }

  /**
   * @description To Get the QuizId from parent routing params
   */
  routerParamSubscription() {
    this.route.parent.params.subscribe(params => {
      this.quizId = params["id"];
    });
  }

  /**
   * @description popup open when cover forms value changes
   */
  onChanges() {
    this.coverPageForm.valueChanges.subscribe(data => {
      $(document).ready(function () {
        $(window).on("beforeunload", function () {
          return "";
        });
      });
    });
  }

  /**
   * @description: Submit Form to update cover page
   */
  updateQuizCoverDetails() {
    this.coverPageForm.value.QuizTitle = this.quizBuilderDataService.isQuizCoverTitleSubmission;
    this.quizBuilderDataService.isPreQuizCoverTitleSubmissionObservable.subscribe((item: any) => {
      if(this.preCoverTitle != item){
        this.preCoverTitle = item;
      }
    });
    $(window).off("beforeunload");
    const filterQuestionTitle = filterPipe.transform(this.coverPageForm.value.QuizCoverTitle ? this.coverPageForm.value.QuizCoverTitle : '');
    if ((this.coverPageForm.dirty || this.preCoverTitle != this.coverPageForm.value.QuizTitle) && filterQuestionTitle.trim() && filterQuestionTitle.trim().length > 0) {
      let requestBodyToSend = JSON.parse(JSON.stringify(this.coverPageForm.value));
      requestBodyToSend.QuizDescription = this.variablePopupService.updateTemplateVarHTMLIntoVariableV2(requestBodyToSend.QuizDescription);
      requestBodyToSend.QuizCoverTitle = this.variablePopupService.updateTemplateVarHTMLIntoVariableV2(requestBodyToSend.QuizCoverTitle);
      requestBodyToSend.MsgVariables = [];
      if(requestBodyToSend.QuizCoverTitleVarList && requestBodyToSend.QuizCoverTitleVarList.length > 0){
        requestBodyToSend.MsgVariables = [...requestBodyToSend.MsgVariables,...requestBodyToSend.QuizCoverTitleVarList];
        delete requestBodyToSend.QuizCoverTitleVarList;
      }
      if(requestBodyToSend.QuizDescriptionVarList && requestBodyToSend.QuizDescriptionVarList.length > 0){
        requestBodyToSend.MsgVariables = [...requestBodyToSend.MsgVariables,...requestBodyToSend.QuizDescriptionVarList];
        delete requestBodyToSend.QuizDescriptionVarList
      }
      /** 
       * set unique items in @MsgVariables 
       */
      requestBodyToSend.MsgVariables = Array.from(new Set(requestBodyToSend.MsgVariables));
      this.quizBuilderApiService
        .updateQuizCoverDetails(requestBodyToSend)
        .subscribe(
          data => {
            this._markFormPristine(this.coverPageForm);
            if(this.isOpenBranchingLogicSide){
              this.updateBranchingLogic.emit();
            }
          },
          error => {
            this.notificationsService.error(
              "Cover-Page",
              "Something went Wrong"
            );
            this._markFormPristine(this.coverPageForm);
          }
        );
        if(this.preCoverTitle != this.coverPageForm.value.QuizTitle){
          this.quizBuilderDataService.isPreQuizCoverTitleSubmission=this.coverPageForm.value.QuizTitle;
          this.quizBuilderDataService.changeIsPreQuizCoverTitleSubmission();
        }
    }
  }

  private _markFormPristine(form: FormGroup): void {
    Object.keys(form.controls).forEach(control => {
      form.controls[control].markAsPristine();
    });
  }

  /**
   * @description : Cloudinary widget api for giving popup for image upload and save the url in the patch value in the formcontrol
   * @param formControl : this.coverPageForm.controls
   */

     //use Media Lib

  onUseMedia(formControl){
    if(this.config.disableMedia){
      this.coverImagePopup(formControl);
    }else{
      this.isVisibleMediaLibrary=true;
    }
  }
  changeUploadedUrl(event){
    if(event.message == "success"){
      if (event.externalUrl) {
        this.imageORvideo = this.commonService.getImageOrVideo(event.externalUrl);
        this.video_public_id = event.externalUrl;
        this.coverPageForm.controls.QuizCoverImage.patchValue(event.externalUrl);
      }
      this.coverPageForm.controls.PublicIdForQuizCover.patchValue(event.publicId);
      this.coverPageForm.controls.QuizCoverImage.markAsDirty();
      this.updateQuizCoverImage();
      this.commonService.onLoadvideo('update',true);
    }
    this.isVisibleMediaLibrary=false;
    let self = this;
    setTimeout(function(){self.openEnableMediaSetiing('media')}, 1500);
  }

  coverImagePopup(formControl) {
    var env_cover = Object.assign({}, environment.cloudinaryConfiguration);
    env_cover.cropping_aspect_ratio = 2.25;
    env_cover.min_image_width = '900';
    env_cover.min_image_height = '400';
    var widget = cloudinary.createUploadWidget(
      env_cover,
      (error, result) => {
        if (!error && result[0].secure_url) {
          this.imageORvideo = this.commonService.getImageOrVideo(result[0].secure_url);
          this.video_public_id = result[0].public_id;
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
          formControl.QuizCoverImage.patchValue(result[0].secure_url);
          formControl.PublicIdForQuizCover.patchValue(result[0].public_id);
          formControl.QuizCoverImage.markAsDirty();
          this.updateQuizCoverImage();
        } else {
          console.log(
            "Error! Cloudinary upload widget error Cover Image",
            error
          );
        }
      }
    );
    widget.open(formControl.QuizCoverImage.value);
  }
  updateQuizCoverImage() {
    this.coverPageForm.patchValue({'SecondsToApply': 0});
    let requestPayload: any = JSON.parse(JSON.stringify(this.coverPageForm.value));
    if(this.isWhatsappEnable){
      requestPayload.QuizCoverImage = this.defaultWhatsAppCover;
      requestPayload.PublicIdForQuizCover = this.WhatsAppCoverPublicId;
    }
    this.quizBuilderApiService
      .uploadCoverImage(requestPayload)
      .subscribe(data => { });
  }

  removeImagePopup(formControl) {
    this.imageORvideo = "image";
    if (this.coverPageForm.value.QuizCoverImage !== "") {
      this.coverPageForm.patchValue({
        QuizCoverImage: ""
      });
      this.updateQuizCoverImage();
      this.openEnableMediaSetiing('element');
    }
  }

  /**
   * @type valuechanges listener
   * @description Function to update the cover title in the sidebar option dynamically when  user changes the cover
   */
  onCoverTitleTextChanges() {
    this.valueChangesSubscriptionCoverTitle = this.coverPageForm.controls.QuizTitle.valueChanges.subscribe(
      changedTitle => {
        this.quizzToolHelper.updateSidebarOptionsCoverTitle.next(changedTitle);
      }
    );
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
        "value":this.coverPageForm.get('ShowQuizCoverTitle').value,
        "displayOrder":this.coverPageForm.get('DisplayOrderForTitle').value
      },
      {
        "key":this.elementReorderKey.media,
        "value":this.coverPageForm.get('ShowQuizCoverImage').value,
        "displayOrder":this.coverPageForm.get('DisplayOrderForTitleImage').value
      },
      {
        "key":this.elementReorderKey.description,
        "value":this.coverPageForm.get('ShowDescription').value,
        "displayOrder":this.coverPageForm.get('DisplayOrderForDescription').value
      },
      {
        "key":this.elementReorderKey.button,
        "value":this.coverPageForm.get('EnableNextButton').value,
        "displayOrder":this.coverPageForm.get('DisplayOrderForNextButton').value
      }
    ];
    return elementArr;
  }

  sendEnableSettingData(text,setFrameVideo,elementArr){
    let elementCollapse = (text == 'element') ? true : false;
    let mediaCollapse = (text == 'media') ? true : false;
    this.dynamicMediaReplaceService.isOpenEnableMediaSetiing = {
      "page": enableItemPage.cover_page,
      "data":this.coverPageForm.get('EnableMediaFile').value,
      "isVideo":this.imageORvideo,
      "autoPlayData":this.coverPageForm.get('AutoPlay').value,
      "isOpen":true,
      "menuType":rightMenuEnum.coverPageSetting,
      "coverElement": elementArr,
      "elementEnable":elementCollapse,
      "mediaEnable":mediaCollapse,
      "setFrameVideo":setFrameVideo
    };
  }

  openEnableMediaSetiing(text:any){
    let videoDuration = 0;
    if(this.imageORvideo == "video"){
      let clVideoEle = this.commonService.onLoadvideo('update');
      if(clVideoEle){
        videoDuration = clVideoEle.duration;
      }
    }

    let elementArr = this.setElementObj();
    let setFrameVideo = {
      "videoDuration" : isFinite(videoDuration) ? videoDuration : 0,
      "secondsToApply" : this.coverPageForm.get('SecondsToApply').value,
      "videoFrameEnabled": this.coverPageForm.get('VideoFrameEnabled').value
    }
    if(!this.isProcess){
      this.isProcess = true;
      if(text == 'closeTab'){
        this.dynamicMediaReplaceService.isOpenEnableMediaSetiing = {
          "isOpen":false,
          "menuType":rightMenuEnum.coverPageSetting
        };
      }else{
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
    if(this.coverPageForm.get('VideoFrameEnabled').value == true && this.coverPageForm.get('SecondsToApply').value){
      startOffset = this.coverPageForm.get('SecondsToApply').value;
    }
    return `{ "cloud-name":"${environment.cloudinaryConfiguration.cloud_name}", "transformation": [{"start-offset": ${startOffset}, "fetch_format": "auto", "quality": "auto"}]}`;    
  }

  ngOnDestroy() {
    this.updateQuizCoverDetails();
    this.valueChangesSubscriptionCoverTitle.unsubscribe();
    if(this.isStylingSubscription){
      this.isStylingSubscription.unsubscribe();
    }
    if(this.isDynamicMediaDataSubscription){
      this.isDynamicMediaDataSubscription.unsubscribe();
    }
    if(this.isCoverElementSubscription){
      this.isCoverElementSubscription.unsubscribe();
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
    if(this.variablePopupService.variablePopupOpened == 'QuizDescription' || this.variablePopupService.variablePopupOpened == 'QuizCoverTitle'){
      let activeFroalaRef = this.froalaEditorFor[this.froalaOpenedFor].froalaRef;
      let tempVarFormulaList:any = [];
      listOfUsedVariableObj.map(varItem => {
        tempVarFormulaList.push(varItem.formula.replace(/^%/g,'{{').replace(/%$/g,'}}'));
      });
      this.coverPageForm.get(this.variablePopupService.variablePopupOpened+'VarList').patchValue(tempVarFormulaList);
      this.variablePopupService.insertFormulaIntoEditorV2(listOfUsedVariableObj, activeFroalaRef);
      this.coverPageForm.markAsDirty();
    }
  }

  initFroalaOptionsAndEventsFor(froalaFor:any){
    if(!this.froalaEditorFor[froalaFor]){
      this.froalaEditorFor[froalaFor] = {
        "isShowVarBtn":false,
        "froalaRef": new FroalaEditorOptions(),
       }
    }
    this.froalaEditorFor[froalaFor].froalaRef.SSEditorCharCount();
    this.froalaEditorFor[froalaFor].options = this.froalaEditorFor[froalaFor].froalaRef.setEditorOptions();

    this.froalaEditorFor[froalaFor].options.charCounterCount = false;
    this.froalaEditorFor[froalaFor].options.ssCharCounterCount = true;
    this.froalaEditorFor[froalaFor].options.ssCharCounterMax = (froalaFor == 'QuizCoverTitle' ? 200 : 1000);
    this.froalaEditorFor[froalaFor].options.pluginsEnabled.push('ssCharCounter','ssCharCounterCount','ssCharCounterMax');

    this.froalaEditorFor[froalaFor].options.froalaFor = froalaFor;

    this.froalaEditorFor[froalaFor].options.events["froalaEditor.focus"] = (e, editor) => { 
      editor.toolbar.show();                  
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
    this.initFroalaOptionsAndEventsFor('QuizCoverTitle');
    //for Description
    this.initFroalaOptionsAndEventsFor('QuizDescription');
  }

  updateCoverVarList(){
    setTimeout(() => {      
      if(this.coverPageDetail.MsgVariables && this.coverPageDetail.MsgVariables.length > 0){
        this.coverPageDetail.QuizCoverTitleVarList = [];
        this.coverPageDetail.QuizDescriptionVarList = [];
        this.coverPageDetail.MsgVariables.map(item => {
          this.coverPageDetail.QuizCoverTitle.includes(item)? this.coverPageDetail.QuizCoverTitleVarList.push(item) : false;
          this.coverPageDetail.QuizDescription.includes(item)? this.coverPageDetail.QuizDescriptionVarList.push(item) : false;
        });
        this.coverPageForm.get('QuizCoverTitleVarList').patchValue(this.coverPageDetail.QuizCoverTitleVarList);
        this.coverPageForm.get('QuizDescriptionVarList').patchValue(this.coverPageDetail.QuizDescriptionVarList);
      }
    }, 0);
  }

  updateVarListFor(openFor:string){
    let msg = this.froalaEditorFor[openFor].froalaRef.editorRefernce.html.get();     
    let updatedVarist = this.variablePopupService.getListVariableFormulaV2(msg);
    this.coverPageForm.get(openFor+'VarList').patchValue(updatedVarist);
  }

  /********************** variable popup implementation ends *****************************/
}
