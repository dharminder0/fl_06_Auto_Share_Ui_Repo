import { Component, OnInit, Inject, OnDestroy, Input, EventEmitter, Output } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { QuizBuilderApiService } from "../../quiz-builder-api.service";
import { ActivatedRoute, NavigationStart, NavigationEnd, Router } from "@angular/router";
import { DOCUMENT, Location } from "@angular/common";
import { QuizzToolHelper } from "../quiz-tool-helper.service";
import { Subscription } from "rxjs/Subscription";
import { QuizToolData } from "../quiz-tool.data";
import { FroalaEditorOptions } from "../../email-sms/template-body/template-froala-options";
import { UserInfoService } from "../../../shared/services/security.service";
import { QuizBuilderDataService } from '../../quiz-builder-data.service';
import { Config } from '../../../../config';
import { DynamicMediaReplaceMentsService } from '../dynamic-media-replacement';
import { rightMenuEnum } from '../rightmenu-enum/rightMenuEnum';
import { RemoveallTagPipe } from "../../../shared/pipes/search.pipe";
import { elementReorderKey, enableItemPage } from "../commonEnum";
import { CommonService } from "../../../shared/services/common.service";
declare var cloudinary: any;
declare var $: any;
const filterPipe = new RemoveallTagPipe();

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.css"]
})
export class ContentComponent implements OnInit, OnDestroy {
  @Input() contentData;
  @Input() isOpenBranchingLogicSide;
  @Output() updateBranchingLogic: EventEmitter<any> = new EventEmitter<any>();
  public tab = "tab-01";
  public contentForm: FormGroup;
  public imageORvideo;
  public contentId;
  public descimageORvideo;
  public quizId;
  public routerSubscription: Subscription;
  public quizURL;
  public hostURL;
  public selectedQuiz;
  public brandingColor;
  public quizTypeId;
  public options: object;
  public options1: object;
  public options2: object;
  public contentSettingData;
  public defaultCoverImage:any="https://res.cloudinary.com/dbbkqtyqn/image/upload/v1588680596/Jobrock/automation-place-holder-corner.png";
  public classList = ['content', 'contentDesc', 'contentButton'];
  public froalaEditorOptions = new FroalaEditorOptions();
  //mediafile
  public isVisibleMediaLibrary:boolean=false;
  public isDescriptionImageMediaLibrary:boolean=false;
  public config = new Config();
  public mediaCheck;
  public mediaDescriptionCheck;
  private isDynamicMediaDataSubscription: Subscription;
  public isAutoPlay:boolean;
  public isDesAutoPlay:boolean;
  public isButtonEnable:boolean = true;
  private isContentElementSubscription: Subscription;
  public isProcess:boolean = false;
  public isDesCriptionEnable:boolean = false;
  public hoverOnMainDiv:boolean = false;
  private isVideoSoundEnableSubscription:Subscription;
  private isStylingSubscription: Subscription;
  public contentElementReorder:any;
  public isWhatsappEnable = false;
  private isWhatsappEnableSubscription: Subscription;
  private isvideoSecondsToApplySubscription: Subscription;
  private isEnableSetFrameToggleObservableSubscription: Subscription;
  public elementReorderKey = elementReorderKey;
  public elementObj:any;
  constructor(
    private quizBuilderApiService: QuizBuilderApiService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private location: Location,
    private quizzToolHelper: QuizzToolHelper,
    private quizToolData: QuizToolData,
    private userInfoService: UserInfoService,
    private quizBuilderDataService:QuizBuilderDataService,
    private dynamicMediaReplaceService:DynamicMediaReplaceMentsService,
    private commonService:CommonService
  ) {
    this.route.params.subscribe(params => {
      if(params["cId"]){
        this.contentId = params["cId"];
      }
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

  ngOnInit() {
    this.options = this.froalaEditorOptions.setEditorOptions(200);
    this.options1 = this.froalaEditorOptions.setEditorOptions(1000);
    this.options2 = this.froalaEditorOptions.setEditorOptions(45,'Volgende');
    this.hostURL = this.location["_platformLocation"].location.host;
    this.contentElementReorder = this.commonService.getElementReorderStr();
    this.quizTypeId = this.quizzToolHelper.quizTypeId;
    this.getWhatsappUsage();
    this.getBrandingColors();
    if(!this.isOpenBranchingLogicSide){
      this.assignTagsForCloudinary()
     }
    if(!this.contentId){
      this.contentId = this.contentData.Id;
    }
    this.initializeContentComponent();
    this.routerChangeSubscription();
    this.onSaveQuizSubscription();
    this.getDynamicMediaDataTitle();
    this.getVideoChangeTime();
    this.getSetFrameToggle();
  }

  onSaveQuizSubscription(){
    let self = this;
    this.quizBuilderDataService.currentQuizSaveAll.subscribe(function(res){
      if(res){
        self.saveContent();
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
   })
  }

  getVideoChangeTime(){
    this.isvideoSecondsToApplySubscription = this.dynamicMediaReplaceService.videoTimeChangeObservable.subscribe(res => {
       if(res && Object.keys(res).length != 0 && this.contentId == res.id){
         if((res.page == enableItemPage.content_page || res.page == enableItemPage.content_title_page) && this.contentForm.get('SecondsToApply').value != res.secToApply){
          this.contentForm.patchValue({'SecondsToApply' : res.secToApply});
         }
         else if(res.page == enableItemPage.content_des_page && this.contentForm.get('SecondsToApplyForDescription').value != res.secToApply){
         this.contentForm.patchValue({'SecondsToApplyForDescription' : res.secToApply});
         }
         this.contentForm.markAsDirty();
       }
     });
  }
  getSetFrameToggle(){
    this.isEnableSetFrameToggleObservableSubscription =  this.dynamicMediaReplaceService.isEnableSetFrameToggleObservable.subscribe((res) =>{
      if(res && Object.keys(res).length != 0 && this.contentId == res.id){
        if((res.page == enableItemPage.content_page || res.page == enableItemPage.content_title_page) && this.contentForm.get('VideoFrameEnabled').value != res.VideoFrameEnabled){
         this.contentForm.patchValue({'VideoFrameEnabled': res.VideoFrameEnabled});
        }
        else if(res.page == enableItemPage.content_des_page && this.contentForm.get('DescVideoFrameEnabled').value != res.VideoFrameEnabled){
         this.contentForm.patchValue({'DescVideoFrameEnabled': res.VideoFrameEnabled});
        }
        this.contentForm.markAsDirty();
      }
    });
 }

  getWhatsappUsage(){
    this.isWhatsappEnableSubscription = this.dynamicMediaReplaceService.isUsageTypeWhatsAppObservable.subscribe(res => this.isWhatsappEnable = res);
  }

  changeComponent(){
    this.onContentElement();
  }
  
  onContentElement(){
    if(this.contentForm){
      this.isButtonEnable = this.contentForm.get('EnableNextButton').value;
      this.tab = (this.contentForm.get('ShowContentDescriptionImage').value == true) ? 'tab-02' : 'tab-01';
      this.isDesCriptionEnable = this.contentForm.get('ShowDescription').value;
      this.contentElementReorder.map(coverReorder => {
        if(coverReorder.key == this.elementReorderKey.title){
          coverReorder.displayOrder = this.contentForm.get('DisplayOrderForTitle').value;
        }else if(coverReorder.key == this.elementReorderKey.media){
          coverReorder.displayOrder = this.contentForm.get('DisplayOrderForTitleImage').value;
        }else if(coverReorder.key == this.elementReorderKey.description){
          coverReorder.displayOrder = this.contentForm.get('DisplayOrderForDescription').value;
          coverReorder.disMedia.displayOrder = this.contentForm.get('DisplayOrderForDescriptionImage').value;
        }else if(coverReorder.key == this.elementReorderKey.button){
          coverReorder.displayOrder = this.contentForm.get('DisplayOrderForNextButton').value;
        }
      });
      this.contentElementReorder.sort((a, b) => (a.displayOrder > b.displayOrder) ? 1 : -1)
    }
    this.isContentElementSubscription = this.dynamicMediaReplaceService.isContentElementSettingObservable.subscribe(res =>{
      if(res && Object.keys(res).length != 0){
        if(res.contentId == this.contentId && res.elementData && res.elementData.length > 0){
          this.contentElementReorder = [];
          let titleOrder = false;
          let mediaOrder = false;
          let descriptionOrder = false;
          let buttonOrder = false;
          let descriptionImageOrder = false;
          let titleMedia = false;
          let showDescriptionImage = false;
          res.elementData.map(ele => {
            if(ele.key == this.elementReorderKey.title){
              titleOrder = ele.displayOrder;
            }else if(ele.key == this.elementReorderKey.media){
              titleMedia = ele.value;
              mediaOrder = ele.displayOrder;
            }else if(ele.key == this.elementReorderKey.description){
              this.isDesCriptionEnable = ele.value;
              descriptionOrder = ele.displayOrder;
              showDescriptionImage = ele.disMedia.value;
              descriptionImageOrder = ele.disMedia.displayOrder;
              this.tab = showDescriptionImage?'tab-02':'tab-01'
            }else if(ele.key == this.elementReorderKey.button){
              this.isButtonEnable = ele.value;
              buttonOrder = ele.displayOrder;
            }
          });
          this.contentElementReorder = res.elementData;
          this.contentForm.patchValue({
            'ShowContentTitleImage': titleMedia,
            'EnableNextButton': this.isButtonEnable,
            'ShowDescription' : this.isDesCriptionEnable,
            'ShowContentDescriptionImage':showDescriptionImage,
            'DisplayOrderForTitle':titleOrder,
            'DisplayOrderForTitleImage':mediaOrder,
            'DisplayOrderForDescription':descriptionOrder,
            'DisplayOrderForDescriptionImage':descriptionImageOrder,
            'DisplayOrderForNextButton':buttonOrder,
            'EnableMediaFileForTitle':titleMedia ? this.contentForm.get('EnableMediaFileForTitle').value : false,
            'EnableMediaFileForDescription':this.isDesCriptionEnable ? showDescriptionImage ? this.contentForm.get('EnableMediaFileForDescription').value : false : false
          });
          this.contentForm.markAsDirty();
        }
      }
    });
  }

  getDynamicMediaDataTitle(){
    this.isAutoPlay = this.contentForm.get('AutoPlay').value;
    this.isDesAutoPlay = this.contentForm.get('AutoPlayForDescription').value;
    this.isDynamicMediaDataSubscription = this.dynamicMediaReplaceService.isEnableMediaSetiingObjectObservable.subscribe(item=>{
      if(item && item.id == this.contentId && item.page == 'content_title_page' && item.data != undefined && item.autoPlayData != undefined){
        let oldEnableMediaFile =this.contentForm.get('EnableMediaFileForTitle').value;
        let oldAutoPlayData =this.contentForm.get('AutoPlay').value;
        if(oldEnableMediaFile != item.data || oldAutoPlayData != item.autoPlayData){
          this.contentForm.patchValue({'EnableMediaFileForTitle': item.data});
          this.contentForm.patchValue({'AutoPlay': item.autoPlayData});
          this.isAutoPlay = item.autoPlayData; 
          this.contentForm.controls.EnableMediaFileForTitle.markAsDirty();
        }
      }
      if(item && item.id == this.contentId && item.page == 'content_des_page' && item.data != undefined && item.autoPlayData != undefined){
        let oldEnableMediaFile =this.contentForm.get('EnableMediaFileForDescription').value;
        let oldAutoPlayData =this.contentForm.get('AutoPlayForDescription').value;
        if(oldEnableMediaFile != item.data || oldAutoPlayData != item.autoPlayData){
        this.contentForm.patchValue({'EnableMediaFileForDescription': item.data});
        this.contentForm.patchValue({'AutoPlayForDescription': item.autoPlayData});
        this.isDesAutoPlay = item.autoPlayData; 
        this.contentForm.controls.EnableMediaFileForDescription.markAsDirty();
        }
      }
    });
  }

  private assignTagsForCloudinary() {
    if (this.quizToolData.getCurrentOfficeName()) {
      this.C_tagsForContent = this.quizToolData.getCurrentOfficeName();
      this.C_tagsForDesc = this.quizToolData.getCurrentOfficeName();
    } else {
      this.C_tagsForContent = []
      this.C_tagsForDesc = []
    }
  }

  onFormValueChanges() {
    this.contentForm.valueChanges.subscribe(data => {
      $(document).ready(function () {
        $(window).on("beforeunload", function () {
          return "";
        });
      });

      var contentInfo = {
        Id: data.Id,
        Title: data.ContentTitle
      };
      this.quizzToolHelper.updateSidebarOptionsContentTitle.next(contentInfo);
    });
    let self = this;
    setTimeout(function(){  
      var contentInfo = {
        Id: self.contentForm.controls.Id.value,
        Title:self.contentForm.controls.ContentTitle.value
      };
      self.quizzToolHelper.updateSidebarOptionsContentTitle.next(contentInfo);
    }, 500);
  }

  initializeContentComponent() {
    this.getContentData();
    this.createContentForm(this.contentData);
    this.onFormValueChanges();
    this.changeComponent();
  }

  getContentData() {
    if(!this.isOpenBranchingLogicSide){
      this.contentData = this.route.snapshot.data["contentData"];
    }
  }

  /**
   * Router Subscription: When the url param changes,
   * this funtion is called and the component is reinitialized with
   * new data
   */
  routerChangeSubscription() {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.saveContent();
      }
      if (event instanceof NavigationEnd) {
        this.initializeContentComponent();
      }
    });
  }

  createContentForm(data) {
    this.imageORvideo = this.commonService.getImageOrVideo(data.ContentTitleImage);
    this.descimageORvideo = this.commonService.getImageOrVideo(data.ContentDescriptionImage);
    this.contentForm = new FormGroup({
      Id: new FormControl(this.contentData.Id, Validators.required),
      AliasTextForNextButton: new FormControl(
        this.contentData.AliasTextForNextButton? this.contentData.AliasTextForNextButton:''
      ),
      ContentDescription: new FormControl(this.contentData.ContentDescription),
      ContentDescriptionImage: new FormControl(
        this.contentData.ContentDescriptionImage
      ),
      PublicIdForContentDescription: new FormControl(
        this.contentData.PublicIdForContentDescription
      ),
      PublicIdForContentTitle: new FormControl(
        this.contentData.PublicIdForContentTitle
      ),
      ContentTitle: new FormControl(this.contentData.ContentTitle),
      AutoPlay: new FormControl(this.contentData.AutoPlay),
      AutoPlayForDescription: new FormControl(this.contentData.AutoPlayForDescription),
      ContentTitleImage: new FormControl(this.contentData.ContentTitleImage),
      EnableMediaFileForTitle: new FormControl(this.contentData.EnableMediaFileForTitle),
      EnableMediaFileForDescription: new FormControl(this.contentData.EnableMediaFileForDescription),
      ShowContentDescriptionImage: new FormControl(
        this.contentData.ShowContentDescriptionImage ? this.contentData.ShowContentDescriptionImage : false
      ),
      ShowContentTitleImage: new FormControl(
        this.contentData.ShowContentTitleImage
      ),
      EnableNextButton: new FormControl(this.contentData.EnableNextButton ? this.contentData.EnableNextButton : false),
      QuizId : new FormControl(this.quizId),
      ShowTitle : new FormControl(true),
      ShowDescription : new FormControl(this.contentData.ShowDescription),
      DisplayOrderForDescription : new FormControl(this.contentData.DisplayOrderForDescription),
      DisplayOrderForDescriptionImage : new FormControl(this.contentData.DisplayOrderForDescriptionImage),
      DisplayOrderForNextButton : new FormControl(this.contentData.DisplayOrderForNextButton),
      DisplayOrderForTitle : new FormControl(this.contentData.DisplayOrderForTitle),
      DisplayOrderForTitleImage : new FormControl(this.contentData.DisplayOrderForTitleImage),
      SecondsToApply : new FormControl(this.contentData.SecondsToApply),
      SecondsToApplyForDescription : new FormControl(this.contentData.SecondsToApplyForDescription),
      VideoFrameEnabled: new FormControl(this.contentData.VideoFrameEnabled),
      DescVideoFrameEnabled: new FormControl(this.contentData.DescVideoFrameEnabled)

    });
    this.mediaCheck = this.contentData.EnableMediaFileForTitle;
    this.mediaDescriptionCheck = this.contentData.EnableMediaFileForDescription;
    this.commonService.onLoadvideo('update',true);
    this.commonService.onLoadvideo('updatedes',true);
  }

    //use Media Lib

    onUseMedia(){
      if(this.config.disableMedia){
        this.uploadContentImage();
      }else{
        this.isVisibleMediaLibrary=true;
      }
    }
  
    changeUploadedUrl(event){
      if(event.message == "success"){
        if (event.externalUrl) {
          this.imageORvideo = this.commonService.getImageOrVideo(event.externalUrl);
          this.contentForm.controls.ContentTitleImage.patchValue(event.externalUrl);
        }
        this.contentForm.patchValue({ PublicIdForContentTitle: event.publicId, SecondsToApply: 0});
        this.contentForm.controls.ContentTitleImage.markAsDirty();
        this.saveContent();
        this.commonService.onLoadvideo('update',true);
      }
      this.isVisibleMediaLibrary=false;
      let self = this;
      setTimeout(function(){self.openEnableMediaSetiing('content_title_page')}, 1500);
    }

  uploadContentImage() {
    var env_content = Object.assign({}, environment.cloudinaryConfiguration);
    env_content.cropping_aspect_ratio = 2.25;
    env_content.min_image_width = '900';
    env_content.min_image_height = '400';
    var widget = cloudinary.createUploadWidget(
      env_content,
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
          this.contentForm.controls.ContentTitleImage.patchValue(result[0].secure_url);
          this.contentForm.patchValue({ PublicIdForContentTitle: result[0].public_id });
          this.contentForm.controls.ContentTitleImage.markAsDirty();
          this.saveContent();
        } else {
          console.log(
            "Error! Cloudinary upload widget error questionImage",
            error
          );
        }
      }
    );
    widget.open(this.contentForm.controls.ContentTitleImage.value);
  }

    //use Media Lib

    onUseDescriptionMedia(){
      if(this.config.disableMedia){
        this.uploadDescriptionImage();
      }else{
      this.isDescriptionImageMediaLibrary=true;
      }
    }
  
    changeUploadedDescriptionUrl(event){
      if(event.message == "success"){
        if (event.externalUrl) {
          this.descimageORvideo = this.commonService.getImageOrVideo(event.externalUrl);
          this.contentForm.controls.ContentDescriptionImage.patchValue(event.externalUrl);
        }
        this.contentForm.patchValue({ PublicIdForContentDescription: event.publicId, SecondsToApplyForDescription : 0 });
        this.contentForm.controls.ContentDescriptionImage.markAsDirty();
        this.saveContent();
        this.commonService.onLoadvideo('updatedes',true);
      }
      this.isDescriptionImageMediaLibrary=false;
      let self = this;
      setTimeout(function(){self.openEnableMediaSetiing('content_des_page')}, 1500);
    }

  uploadDescriptionImage() {
    var env_contentDes = Object.assign({}, environment.cloudinaryConfiguration);
    env_contentDes.cropping_aspect_ratio = 2.25;
    env_contentDes.min_image_width = '900';
    env_contentDes.min_image_height = '400';
    env_contentDes.resource_type = ['image'];
    var widget = cloudinary.createUploadWidget(
      env_contentDes,
      (error, result) => {
        if (!error && result[0].secure_url) {
          this.descimageORvideo = this.commonService.getImageOrVideo(result[0].secure_url);
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
          this.contentForm.controls.ContentDescriptionImage.patchValue(result[0].secure_url);
          this.contentForm.patchValue({ PublicIdForContentDescription: result[0].public_id });
          this.contentForm.controls.ContentDescriptionImage.markAsDirty();
          this.saveContent();
        } else {
          console.log(
            "Error! Cloudinary upload widget error questionImage",
            error
          );
        }
      }
    );
    widget.open(this.contentForm.controls.ContentDescriptionImage.value);
  }

  removeDescriptionImage() {
    this.descimageORvideo = "image";
    this.contentForm.patchValue({
      ContentDescriptionImage: "",
      SecondsToApplyForDescription : 0
    });
    this.contentForm.controls.ContentDescriptionImage.markAsDirty();
    this.saveContent();
    this.openEnableMediaSetiing(enableItemPage.content_page);
  }

  removeContentImage() {
    this.imageORvideo = "image";
    this.contentForm.patchValue({
      SecondsToApply: 0,
      ContentTitleImage: ""
    });
    this.contentForm.controls.ContentTitleImage.markAsDirty();
    this.saveContent();
    this.openEnableMediaSetiing(enableItemPage.content_page);
  }

  hideContentImage() {
    this.contentForm
      .get("ShowContentTitleImage")
      .patchValue(!this.contentForm.get("ShowContentTitleImage").value);
    this.contentForm.controls.ShowContentTitleImage.markAsDirty();
  }

  saveContent() {
    const filterQuestionTitle = filterPipe.transform(this.contentForm.value.ContentTitle ? this.contentForm.value.ContentTitle : '');
    if (this.contentForm.dirty && filterQuestionTitle.trim() && filterQuestionTitle.trim().length > 0) {
      this.quizBuilderApiService
        .updateQuizContent(this.contentForm.value)
        .subscribe(
          data => {
            $(window).off("beforeunload");
            this._markFormPristine(this.contentForm);
            if(this.isOpenBranchingLogicSide){
              this.updateBranchingLogic.emit();
            }
          },
          error => {
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
   * *CONTENT
   * *CLoudinary Upload Widget Extra configuration
   */
  cloudinaryUploadWidgetConfigurationsForContent = {
    cropping_aspect_ratio: 2.25,
    min_image_width: '900',
    min_image_height: '400',
    folder: this.userInfoService._info.CloudinaryBaseFolder
  }

  /**
   * *CONTENT
   * * Tags for cloudinary
   */
  C_tagsForContent = []

  /**
 * 
 * @param Image Dimension
 */
  CM_recommended_image_dimensions_for_content = {
    width: 900,
    height: 400
  }

  CM_accepted_formats_content = ['image', 'video'];


  /**
   * *DESCRIPTION UPLOAD
   * *CLoudinary Upload Widget Extra configuration
   */
  cloudinaryUploadWidgetConfigurationsForDesc = {
    cropping_aspect_ratio: 2.25,
    min_image_width: '900',
    min_image_height: '400',
    resource_type: ['image'],
    folder: this.userInfoService._info.CloudinaryBaseFolder
  }


  /**
   * *DESCRIPTION UPLOAD
   * * Tags for cloudinary
   */
  C_tagsForDesc = []

  /**
 * 
 * @param Image Dimension
 */
  CM_recommended_image_dimensions_for_desc = {
    width: 900,
    height: 400
  }

  CM_accepted_formats_desc = ['image', 'video'];

  setElementObj(){
    this.elementObj = [
      {
        "key": this.elementReorderKey.title,
        "value":this.contentForm.get('ShowTitle').value,
        "displayOrder":this.contentForm.get('DisplayOrderForTitle').value
      },
      {
        "key":this.elementReorderKey.media,
        "value":this.contentForm.get('ShowContentTitleImage').value,
        "displayOrder":this.contentForm.get('DisplayOrderForTitleImage').value
      },
      {
        "key":this.elementReorderKey.description,
        "value":this.contentForm.get('ShowDescription').value,
        "displayOrder":this.contentForm.get('DisplayOrderForDescription').value,
        "disMedia" : {
          "key":this.elementReorderKey.descriptionMedia,
          "value":this.contentForm.get('ShowContentDescriptionImage').value,
          "displayOrder":this.contentForm.get('DisplayOrderForDescriptionImage').value
        }
      },
      {
        "key":this.elementReorderKey.button,
        "value":this.contentForm.get('EnableNextButton').value,
        "displayOrder":this.contentForm.get('DisplayOrderForNextButton').value
      }
    ];
  }

  sendEnableSettingData(collapseObj,setFrameVideo,page?){
    let enableItemSettingObj = {
      "page":'',
      "data":false,
      "isVideo":'',
      "autoPlayData":false,
      "isOpen":true,
      "menuType":rightMenuEnum.contentPageSetting,
      "contentId":this.contentId,
      "elementEnable":collapseObj.elementCollapse,
      "mediaEnable":collapseObj.mediaCollapse,
      "contentElement": this.elementObj,
      "setFrameVideo":setFrameVideo
    }
    if(collapseObj.isDesTab){
      enableItemSettingObj.page = enableItemPage.content_des_page;
      enableItemSettingObj.data = this.contentForm.get('EnableMediaFileForDescription').value;
      enableItemSettingObj.isVideo = this.descimageORvideo;
      enableItemSettingObj.autoPlayData = this.contentForm.get('AutoPlayForDescription').value;
    }else{
      enableItemSettingObj.page = page;
      enableItemSettingObj.data = this.contentForm.get('EnableMediaFileForTitle').value;
      enableItemSettingObj.isVideo = this.imageORvideo;
      enableItemSettingObj.autoPlayData = this.contentForm.get('AutoPlay').value;
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
      if(this.descimageORvideo == "video"){
        let clVideoEle=this.commonService.onLoadvideo('updatedes');
        if(clVideoEle){
          videoDuration = clVideoEle.duration;
        }
      }
      setFrameVideo.videoDuration = isFinite(videoDuration) ? videoDuration : 0;
      setFrameVideo.secondsToApply = this.contentForm.get('SecondsToApplyForDescription').value;
      setFrameVideo.videoFrameEnabled = this.contentForm.get('DescVideoFrameEnabled').value;
    }else{
      if(this.imageORvideo == "video"){
        let clVideoEle=this.commonService.onLoadvideo('update');
        if(clVideoEle){
          videoDuration = clVideoEle.duration;
        }
      }
      setFrameVideo.videoDuration = isFinite(videoDuration) ? videoDuration : 0;
      setFrameVideo.secondsToApply = this.contentForm.get('SecondsToApply').value;
      setFrameVideo.videoFrameEnabled = this.contentForm.get('VideoFrameEnabled').value;
    }
    return setFrameVideo;
  }

  openEnableMediaSetiing(res){
    this.setElementObj();
    if(!this.isProcess){
      this.isProcess = true;
      
      let collapseObj = {
        elementCollapse : (res == enableItemPage.content_page) ? true : false,
        mediaCollapse  : (res == enableItemPage.content_des_page || res == enableItemPage.content_title_page) ? true : false,
        isDesTab : (res == enableItemPage.content_des_page) ? true : false
      }

      if(res == 'closeTab'){
        this.dynamicMediaReplaceService.isOpenEnableMediaSetiing = {
          "isOpen":false,
          "menuType":rightMenuEnum.contentPageSetting
        };
      }else if(collapseObj.isDesTab){
        let setFrameVideo = this.setFrameVideoObj(collapseObj);
        this.sendEnableSettingData(collapseObj,setFrameVideo);
      }else{
        let setFrameVideo = this.setFrameVideoObj(collapseObj);
        this.sendEnableSettingData(collapseObj,setFrameVideo,res);
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
    if(this.contentForm.get('VideoFrameEnabled').value == true && this.contentForm.get('SecondsToApply').value){
      startOffset = this.contentForm.get('SecondsToApply').value;
    }
    return `{ "cloud-name":"${environment.cloudinaryConfiguration.cloud_name}", "transformation": [{"start-offset": ${startOffset}, "fetch_format": "auto", "quality": "auto"}]}`
  }

  applyposterDes(){
    let startOffset:string = "0";
    if(this.contentForm.get('DescVideoFrameEnabled').value == true && this.contentForm.get('SecondsToApplyForDescription').value){
      startOffset = this.contentForm.get('SecondsToApplyForDescription').value;
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
    if(this.isDynamicMediaDataSubscription){
      this.isDynamicMediaDataSubscription.unsubscribe();
    }
    if(this.isContentElementSubscription){
      this.isContentElementSubscription.unsubscribe();
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
}
