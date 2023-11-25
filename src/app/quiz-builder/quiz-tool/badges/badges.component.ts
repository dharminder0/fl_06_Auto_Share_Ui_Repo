import { Component, OnInit, Inject, OnDestroy, ViewChild, ViewContainerRef, Input, Output, EventEmitter, AfterViewInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { ActivatedRoute, NavigationStart, NavigationEnd, Router } from "@angular/router";
import { QuizBuilderApiService } from "../../quiz-builder-api.service";
import { DOCUMENT } from "@angular/common";
import { environment } from "../../../../environments/environment";
import { Subscription } from "rxjs/Subscription";
import { QuizzToolHelper } from "../quiz-tool-helper.service";
import { QuizToolData } from "../quiz-tool.data";
import { FroalaEditorOptions } from "../../email-sms/template-body/template-froala-options";
import { UserInfoService } from "../../../shared/services/security.service";
import { QuizBuilderDataService } from '../../quiz-builder-data.service';
import { Config } from '../../../../config';
import { DynamicMediaReplaceMentsService } from '../dynamic-media-replacement';
import { rightMenuEnum } from '../rightmenu-enum/rightMenuEnum';
import { RemoveallTagPipe } from "../../../shared/pipes/search.pipe";
import { CommonService } from "../../../shared/services/common.service";
declare var cloudinary: any;
declare var $: any;
const filterPipe = new RemoveallTagPipe();
@Component({
  selector: "app-badges",
  templateUrl: "./badges.component.html",
  styleUrls: ["./badges.component.css"]
})
export class BadgesComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() badgeData;
  @Input() isOpenBranchingLogicSide;
  @Output() updateBranchingLogic: EventEmitter<any> = new EventEmitter<any>();
  public badgeForm: FormGroup;
  public badgeId;
  public quizId;
  public imageORvideo;
  public routerSubscription: Subscription;
  public quizURL;
  public hostURL;
  public quizTypeId;
  public mediaCheck;
  public defaultCoverImage:any="https://res.cloudinary.com/dbbkqtyqn/image/upload/c_fill,w_250,h_250,g_face,q_auto:best,f_auto/v1588680596/Jobrock/automation-place-holder-corner.png";
  @ViewChild("shareQuizTemplate", { read: ViewContainerRef , static:true})
  shareQuizTemplate: ViewContainerRef;
  public options :object;
  public froalaEditorOptions = new FroalaEditorOptions();
  //mediafile
  public isVisibleMediaLibrary:boolean=false;
  public config = new Config();
  private isDynamicMediaDataSubscription: Subscription;
  public isAutoPlay:boolean;
  public brandingColors;
  public isMediaEnable:boolean = false;
  public isProcess:boolean = false;
  private isElementSubscription: Subscription;
  private isVideoSoundEnableSubscription:Subscription;
  private isStylingSubscription: Subscription;
  public hoverOnMainDiv:boolean = false;
  public badgeElementReorder:any = [
    {
        "displayOrder": 1,
        "key": "title"
    },
    {
        "displayOrder": 2,
        "key": "media"
    }
];
public isWhatsappEnable: boolean = false;

private isWhatsappEnableSubscription: Subscription;
private isvideoSecondsToApplySubscription: Subscription;
private isEnableSetFrameToggleObservableSubscription: Subscription;
  constructor(
    private quizBuilderApiService: QuizBuilderApiService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private quizzToolHelper: QuizzToolHelper,
    private userInfoService: UserInfoService,
    private quizToolData:QuizToolData,
    private quizBuilderDataService:QuizBuilderDataService,
    private dynamicMediaReplaceService:DynamicMediaReplaceMentsService,
    private commonService:CommonService
  ) {
    this.route.params.subscribe(params => {
      this.badgeId = params["bId"];
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

  ngOnInit() {
    this.quizTypeId = this.quizzToolHelper.quizTypeId;
    this.options = this.froalaEditorOptions.setEditorOptions(200);
    if(!this.badgeId){
      this.badgeId = this.badgeData.Id;
    }
    this.getWhatsappUsage();
    this.getBrandingColors();
    this.initBadgeComponent();
    this.routerChangeSubscription();
    if(!this.isOpenBranchingLogicSide){
      this.assignTagsForCloudinary();
    }
    this.onSaveQuizSubscription();
    this.getDynamicMediaData();
    this.getVideoChangeTime();
    this.getSetFrameToggle();
  }

  onSaveQuizSubscription(){
    let self = this;
    this.quizBuilderDataService.currentQuizSaveAll.subscribe(function(res){
      if(res){
        self.saveBadge();
      }
    });
  }

  getBrandingColors(){
    this.isStylingSubscription = this.quizzToolHelper.isStylingObservable.subscribe((data) => {
      if(data && Object.keys(data).length > 0){
         this.brandingColors = data
      }
      else{
        this.brandingColors = this.quizzToolHelper.getBrandingAndStyling();
      }
   })
  }

  initBadgeComponent() {
    this.getBadgeData();
    this.initializeForm(this.badgeData);
    this.badgeValueChanges();
    this.onBadgeElement();
  }

  onBadgeElement(){
    if(this.isElementSubscription){
      this.isElementSubscription.unsubscribe();
    }
    if(this.isVideoSoundEnableSubscription){
      this.isVideoSoundEnableSubscription.unsubscribe();
    }
    if(this.badgeForm){
      this.isMediaEnable = this.badgeForm.get('ShowImage').value;
      this.badgeElementReorder.map(badgeReorder => {
        if(badgeReorder.key == 'title'){
          badgeReorder.displayOrder = this.badgeForm.get('DisplayOrderForTitle').value;
        }else if(badgeReorder.key == 'media'){
          badgeReorder.displayOrder = this.badgeForm.get('DisplayOrderForTitleImage').value;
        }
      });
      this.badgeElementReorder.sort((a, b) => (a.displayOrder > b.displayOrder) ? 1 : -1)
    }
    this.isElementSubscription = this.dynamicMediaReplaceService.isBadgeElementSettingObservable.subscribe(res => {
      if(res && Object.keys(res).length != 0){
        if(res.badgeId == this.badgeId && res.elementData && res.elementData.length > 0){
          this.badgeElementReorder = [];
          let titleOrder = false;
          let mediaOrder = false;
          res.elementData.map(ele => {
            if(ele.key == 'title'){
              titleOrder = ele.displayOrder;
            }else if(ele.key == 'media'){
              this.isMediaEnable = ele.value;
              mediaOrder = ele.displayOrder;
            }
          });
          this.badgeElementReorder = res.elementData;
          this.badgeForm.patchValue({
            'ShowImage':  this.isMediaEnable,
            'DisplayOrderForTitle': titleOrder,
            'DisplayOrderForTitleImage': mediaOrder,
            'EnableMediaFile': this.isMediaEnable ? this.badgeForm.get('EnableMediaFile').value : false
          });
          this.badgeForm.markAsDirty();
        }
      }
    });
  }

  getDynamicMediaData(){
    this.isAutoPlay = this.badgeForm.get('AutoPlay').value;
    this.isDynamicMediaDataSubscription = this.dynamicMediaReplaceService.isEnableMediaSetiingObjectObservable.subscribe(item=>{
      if(item && item.id == this.badgeId && item.page == 'badges_page' && item.data != undefined && item.autoPlayData != undefined){
        let oldEnableMediaFile =this.badgeForm.get('EnableMediaFile').value;
        let oldAutoPlayData =this.badgeForm.get('AutoPlay').value;
        if(oldEnableMediaFile != item.data || oldAutoPlayData != item.autoPlayData){
          this.badgeForm.patchValue({'EnableMediaFile': item.data});
          this.badgeForm.patchValue({'AutoPlay': item.autoPlayData});
          this.isAutoPlay = item.autoPlayData; 
          this.badgeForm.controls.EnableMediaFile.markAsDirty();
        }
      }
    });
  }

  getVideoChangeTime(){
    this.isvideoSecondsToApplySubscription = this.dynamicMediaReplaceService.videoTimeChangeObservable.subscribe(res => {
       if(res && Object.keys(res).length != 0 && this.badgeId == res.id){
         if(res.page == 'badges_page' && this.badgeForm.get('SecondsToApply').value != res.secToApply){
          this.badgeForm.patchValue({'SecondsToApply': res.secToApply});
          this.badgeForm.controls.SecondsToApply.markAsDirty();
         }
       }
     });
  }

  getSetFrameToggle(){
    this.isEnableSetFrameToggleObservableSubscription =  this.dynamicMediaReplaceService.isEnableSetFrameToggleObservable.subscribe((res) =>{
      if(res && Object.keys(res).length != 0 && this.badgeId == res.id){
        if(res.page == 'badges_page' && this.badgeForm.get('VideoFrameEnabled').value != res.VideoFrameEnabled){
         this.badgeForm.patchValue({'VideoFrameEnabled': res.VideoFrameEnabled});
         this.badgeForm.controls.VideoFrameEnabled.markAsDirty();
        }
      }
    });
 }

  badgeValueChanges() {
    this.badgeForm.valueChanges
      .subscribe((badge) => {
        $(document).ready(function () {
          $(window).on("beforeunload", function () {
            return "";
          });
        });
        var badgeInfo = {
          Id: badge.Id,
          Title: badge.Title
        };
        this.quizzToolHelper.updateSidebarOptionsBadgeTitle.next(badgeInfo);
      })
      let self = this;
      setTimeout(function(){  
        var badgeInfo = {
          Id: self.badgeForm.controls.Id.value,
          Title:self.badgeForm.controls.Title.value
        };
        self.quizzToolHelper.updateSidebarOptionsBadgeTitle.next(badgeInfo);
      }, 500);
  }

  getBadgeData() {
    if(this.route.snapshot.data["badgeData"]){
      this.badgeData = this.route.snapshot.data["badgeData"];
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
        this.saveBadge();
      }
      if (event instanceof NavigationEnd) {
        this.initBadgeComponent();
        //set height of description text area reflect only in case of whatsapp flow  
        setTimeout(() => {     
          this.setAutoHeightOfTextArea('badge_title_'+this.badgeData.Id);
        }, 500);
      }      
    });
  }

  initializeForm(data) {
    this.imageORvideo = this.commonService.getImageOrVideo(data.Image);
    this.badgeForm = new FormGroup({
      Id: new FormControl(this.badgeData.Id),
      Title: new FormControl(this.badgeData.Title),
      Image: new FormControl(this.badgeData.Image),
      PublicIdForBadge: new FormControl(this.badgeData.PublicIdForBadge),
      EnableMediaFile: new FormControl(this.badgeData.EnableMediaFile),
      AutoPlay : new FormControl(this.badgeData.AutoPlay),
      ShowTitle : new FormControl(true),
      ShowImage : new FormControl(this.badgeData.ShowImage),
      QuizId:new FormControl(this.quizId),
      DisplayOrderForTitleImage : new FormControl(this.badgeData.DisplayOrderForTitleImage),
      DisplayOrderForTitle:new FormControl(this.badgeData.DisplayOrderForTitle),
      SecondsToApply:new FormControl(this.badgeData.SecondsToApply),
      VideoFrameEnabled:new FormControl(this.badgeData.VideoFrameEnabled)
    });
    this.mediaCheck = this.badgeData.EnableMediaFile;  
    this.commonService.onLoadvideo('update',true);
  }


  /**
   * *CLoudinary Upload Widget Extra configuration
   */
  cloudinaryUploadWidgetConfigurations = {
    cropping_aspect_ratio: 1,
    min_image_width: '250',
    min_image_height: '250',
    resource_type: ['image'],
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
    width:250,
    height:250
  }

  CM_accepted_formats = ['image','video'];

    //use Media Lib

    onUseMedia(){
      if(this.config.disableMedia){
        this.uploadBadgeImage();
      }else{
      this.isVisibleMediaLibrary=true;
      }
    }
  
    changeUploadedUrl(event){
      if(event.message == "success"){
        if (event.externalUrl) {
          this.imageORvideo = this.commonService.getImageOrVideo(event.externalUrl);
          this.badgeForm.controls.Image.patchValue(event.externalUrl);
        }
        this.badgeForm.patchValue({ PublicIdForBadge: event.publicId, SecondsToApply: 0});
        this.badgeForm.controls.Image.markAsDirty();
        this.saveBadge();
        this.commonService.onLoadvideo('update',true);
      }
      this.isVisibleMediaLibrary=false;
      let self = this;
      setTimeout(function(){self.openEnableMediaSetiing('img')}, 1500);
    }
  


  uploadBadgeImage() {
    var env_badge = Object.assign({}, environment.cloudinaryConfiguration);
    env_badge.cropping_aspect_ratio = 1;
    env_badge.min_image_width = '250';
    env_badge.min_image_height = '250';
    env_badge.resource_type = ['image']
    var widget = cloudinary.createUploadWidget(
      env_badge,
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
          this.badgeForm.controls.Image.patchValue(result[0].secure_url);
          this.badgeForm.patchValue({ PublicIdForBadge: result[0].public_id });
          this.badgeForm.controls.Image.markAsDirty();
          this.saveBadge();
        } else {
          console.log(
            "Error! Cloudinary upload widget error questionImage",
            error
          );
        }
      }
    );
    widget.open(this.badgeForm.controls.Image.value);
  }

  removeBadgeImage() {
    this.imageORvideo = "image";
    this.badgeForm.patchValue({
      SecondsToApply: 0,
      Image: ""
    });
    this.badgeForm.controls.Image.markAsDirty();
    this.saveBadge();
    this.openEnableMediaSetiing('main');
  }

  saveBadge() {
    const filterQuestionTitle = filterPipe.transform(this.badgeForm.value.Title ? this.badgeForm.value.Title : '');
    if (this.badgeForm.dirty && filterQuestionTitle.trim() && filterQuestionTitle.trim().length > 0) {
      this.quizBuilderApiService.updateBadge(this.badgeForm.value).subscribe(
        data => {
          $(window).off("beforeunload");
          this._markFormPristine(this.badgeForm);
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

  setElementObj(){
    let elementArr = [
      {
        "key":'title',
        "value":this.badgeForm.get('ShowTitle').value,
        "displayOrder":this.badgeForm.get('DisplayOrderForTitle').value
      },
      {
        "key":'media',
        "value":this.badgeForm.get('ShowImage').value,
        "displayOrder":this.badgeForm.get('DisplayOrderForTitleImage').value
      }
    ];
    return elementArr;
  }

  sendEnableSettingData(text,setFrameVideo,elementArr){
    let elementCollapse = (text == 'main') ? true : false;
    let mediaCollapse = (text == 'img') ? true : false;
    this.dynamicMediaReplaceService.isOpenEnableMediaSetiing = {
      "page":'badges_page',
      "data":this.badgeForm.get('EnableMediaFile').value,
      "isVideo":this.imageORvideo,
      "autoPlayData":this.badgeForm.get('AutoPlay').value,
      "isOpen":true,
      "menuType":rightMenuEnum.badgePageSetting,
      "badgeId":this.badgeId,
      "elementEnable":elementCollapse,
      "mediaEnable":mediaCollapse,
      "badgeElement": elementArr,
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
          "menuType":rightMenuEnum.badgePageSetting
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
          "secondsToApply" : this.badgeForm.get('SecondsToApply').value,
          "videoFrameEnabled": this.badgeForm.get('VideoFrameEnabled').value
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
    if(this.badgeForm.get('VideoFrameEnabled').value == true && this.badgeForm.get('SecondsToApply').value){
      startOffset = this.badgeForm.get('SecondsToApply').value;
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
    if(this.isElementSubscription){
      this.isElementSubscription.unsubscribe();
    }
    if(this.isVideoSoundEnableSubscription){
      this.isVideoSoundEnableSubscription.unsubscribe();
    }
    if(this.isvideoSecondsToApplySubscription){
      this.isvideoSecondsToApplySubscription.unsubscribe();
    }
    if(this.isEnableSetFrameToggleObservableSubscription){
      this.isEnableSetFrameToggleObservableSubscription.unsubscribe();
    }
    if(this.isWhatsappEnableSubscription){
      this.isWhatsappEnableSubscription.unsubscribe();
    }
  }

  getWhatsappUsage(){
    this.isWhatsappEnableSubscription = this.dynamicMediaReplaceService.isUsageTypeWhatsAppObservable.subscribe(res => this.isWhatsappEnable = res);
  }

  setAutoHeightOfTextArea(id:any){
    var textarea = document.getElementById(id);
    if(textarea){
      textarea.style.height = "";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }

  ngAfterViewInit(): void {
    //set height of description text area reflect only in case of whatsapp flow  
    setTimeout(() => {     
      this.setAutoHeightOfTextArea('badge_title_'+this.badgeData.Id);
    }, 500);
  }
}