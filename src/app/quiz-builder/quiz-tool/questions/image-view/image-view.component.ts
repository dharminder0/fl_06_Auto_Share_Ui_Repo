import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { QuizBuilderApiService } from '../../../quiz-builder-api.service';
import { NotificationsService } from 'angular2-notifications';
import { QuizzToolHelper } from '../../quiz-tool-helper.service';
import { environment } from '../../../../../environments/environment';
import { QuizHelperUtil } from '../../../QuizHelper.util';
import { QuizToolData } from '../../quiz-tool.data';
import { FroalaEditorOptions } from '../../../email-sms/template-body/template-froala-options';
import { UserInfoService } from '../../../../shared/services/security.service';
import { Config } from '../../../../../config';
import { DynamicMediaReplaceMentsService } from '../../dynamic-media-replacement';
import { Subscription } from 'rxjs';
import { rightMenuEnum } from '../../rightmenu-enum/rightMenuEnum';
import { ActivatedRoute } from '@angular/router';
import { DragulaService } from 'ng2-dragula';
import { CommonService } from '../../../../shared/services/common.service';
import { VariablePopupService } from '../../../../shared/services/variable-popup.service';
import { BranchingLogicAuthService } from '../../branching-logic-auth.service';
declare var $: any;
declare var cloudinary: any;
@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.css']
})
export class ImageViewComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() isOpenBranchingLogicSide;
  @Output() isAddRemoveAnser: EventEmitter<any> = new EventEmitter<any>();
  public brandingColor;
  public froalaEditorOptions = new FroalaEditorOptions();
  public options : object ;
  @Input() quizId:any;
  public selectAnswerControl:any;
  //mediafile
  public isVisibleMediaLibrary:boolean=false;
  @Input() form: FormGroup;
  public _answerTypeNum: number = 1;
  @Input() set answerType(ansType: number){
    this._answerTypeNum = ansType;
  }
  @Output() onImageTextChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() openMediaSetting: EventEmitter<any> = new EventEmitter<any>();
  @Output() answerReorderObj: EventEmitter<any> = new EventEmitter<any>();
  dummyDrivingLicense : Array<string> = ['A','B','BE','C','CE','D','THE','G','No driving license'];
  dummyJobs: Array<string> = ['Yes','No','No, but open to good suggestions'];
  dummyAddress : Array<string> = ['Post Code','House Number'];
  public defaultCoverImage:any="https://res.cloudinary.com/dbbkqtyqn/image/upload/c_fill,w_210,h_166,g_face,q_auto:best,f_auto/v1588680596/Jobrock/automation-place-holder-corner.png";
  public config = new Config();
  public mediaCheck;
  private isDynamicMediaDataSubscription: Subscription;
  public selectedAwnserId:any;
  public isAutoPlay:boolean;
  private isVideoSoundEnableSubscription:Subscription;
  private isStylingSubscription: Subscription;
  public dragulaSubscription;
  public reOrderList:any = [];
  public isUpload:boolean = false;
  public IsBranchingLogicEnabled:boolean;
  public isQuesAndContentInSameTable:boolean;

  private isvideoSecondsToApplySubscription: Subscription;
  private isEnableSetFrameToggleObservableSubscription: Subscription;
  constructor(
    private quizBuilderApiService: QuizBuilderApiService,
    private notificationsService: NotificationsService,
    private quizzToolHelper: QuizzToolHelper,
    private quizToolData:QuizToolData,
    private userInfoService: UserInfoService,
    private dynamicMediaReplaceService:DynamicMediaReplaceMentsService,
    private route: ActivatedRoute,
    private _fb: FormBuilder,
    private dragulaService: DragulaService,
    private commonService:CommonService,
    private variablePopupService:VariablePopupService,
    private branchingLogicAuthService: BranchingLogicAuthService) {

      const answerBag: any = this.dragulaService.find('answer-image-bag');
      if (answerBag !== undefined ) this.dragulaService.destroy('answer-image-bag');
      this.dragulaService.setOptions('answer-image-bag', { 
        invalid: (el, handle) => el.classList.contains('donotdrag'),
        accepts: (el, target, source, sibling) => sibling && sibling.classList ? !sibling.classList.contains('do-not-drag') : '',
        moves: (el, source, handle, sibling) => !handle.closest(".ans-drag")
      });

      this.dragulaSubscription = dragulaService.dropModel.subscribe((value:any) => {
          this.onDropModel(value);
      });

      this.dragulaService.drag.subscribe(value => {
         $(`.ans-drag`).css("display", `none`);
         $(`#ans-drag .fr-toolbar`).css("display", `none`);
         $(`#ans-drag .my-videos`).css("height", `120px`);
         $(`#ans-drag .my-videos`).css("width", `220px`);
       });
   
       this.dragulaService.over.subscribe(value => {
          $(`.ans-drag`).css("display", `none`);
          $(`#ans-drag .fr-toolbar`).css("display", `none`);
          $(`#ans-drag .my-videos`).css("height", `120px`);
          $(`#ans-drag .my-videos`).css("width", `220px`);
        });
   
       this.dragulaService.out.subscribe(value => {
          $(`.ans-drag`).css("display", ``);
          $(`#ans-drag .my-videos`).css("height", ``);
          $(`#ans-drag .my-videos`).css("width", ``);
       });

    }


  private onDropModel(args:any) {
    if(args && args.length > 0 && args.includes('answer-image-bag')){
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
    if(this.route.snapshot.data["questionData"]){
      this.assignTagsForCloudinary();
    }
    this.options = this.froalaEditorOptions.setEditorOptions(2000);
    this.onChanges();
    this.getBrandingColors();
    this.getDynamicMediaData();
    this.getVideoChangeTime();
    this.getSetFrameToggle();

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

  dataChange(event,val){
    var answerChange = {
      answer : event,
      id : val
    }
    this.onImageTextChange.emit(answerChange);
  }

  appyStylingToFroala(){
    if(this.form.value.AnswerList){
      this.form.value.AnswerList.forEach(element => {
        this.setStyling(element.AnswerId);
      });
    }
  }

  private assignTagsForCloudinary(){
    if(this.quizToolData.getCurrentOfficeName()){
      this.C_tags = this.quizToolData.getCurrentOfficeName();
    }else{
      this.C_tags = []
    }
  }

  setStyling(elem){
    
    if(document.getElementById('ansq_'+elem) && document.getElementById('ansq_'+elem).childNodes[1]){
    var data = document.getElementById('ansq_'+elem).childNodes[1].childNodes[0]['style']
    
      data.background= this.brandingColor.OptionColor;
      data.color= this. brandingColor.OptionFontColor;
    
    data.fontFamily=this.brandingColor.FontType
    }
  }


  onChanges() {
    this.form.valueChanges
      .subscribe((data) => {
        $(document).ready(function () {
          $(window).on("beforeunload", function () {
            // return confirm("Do you really want to close?");
            return "";
          });
        });
      });
  }

    //use Media Lib

    onUseMedia(answerControl, index){
      if(this.config.disableMedia){
        this.uploadAnswerImage(answerControl, index);
      }else{
      this.selectAnswerControl = answerControl;
      this.isVisibleMediaLibrary=true;
      }
    }
  
    changeUploadedUrl(event){
      if(event.message == "success"){
        if (event.externalUrl) {
          this.selectAnswerControl.patchValue({ imageORvideo: this.commonService.getImageOrVideo(event.externalUrl) });
          if(event.publicId){
            this.selectAnswerControl.patchValue({ AnswerImage: event.externalUrl })
          }
        }
        this.selectAnswerControl.patchValue({ PublicIdForAnswer: event.publicId, SecondsToApply: 0});
        this.selectAnswerControl.controls.AnswerImage.markAsDirty();
        let clVideoEleDes:any = document.getElementById(this.selectAnswerControl.controls.AnswerId.value);
        if(clVideoEleDes){
          let selectedEleDes:any = clVideoEleDes.querySelector("video");
          if(selectedEleDes){
            selectedEleDes.load();
          }
        }
      }
      this.isVisibleMediaLibrary=false;
      let self = this;
      setTimeout(function(){self.openEnableMediaSetiing(self.selectAnswerControl,'media')}, 1500);
    }

    enableMedia(answerControl,index){
      answerControl.patchValue({ EnableMediaFile: !answerControl.controls.EnableMediaFile.value });
    }

    openEnableMediaSetiing(answerControl,type){
        this.selectedAwnserId = answerControl;
        let videoDuration = 0;
        if(answerControl.controls.imageORvideo.value == "video"){
          let clVideoEle = this.commonService.onLoadvideo(answerControl.controls.AnswerId.value);
          if(clVideoEle){
            videoDuration = clVideoEle.duration;
          }
        }
  
        this.openMediaSetting.emit({
          "selectedAnwser": answerControl,
          "type":this.isUpload ? 'text': type,
          "duration":isFinite(videoDuration) ? videoDuration : 0
        });
        this.isUpload = false;
    }

    getDynamicMediaData(){
      if(this.selectedAwnserId){
        this.isAutoPlay = this.selectedAwnserId.controls.AutoPlay.value;
      }
        this.isDynamicMediaDataSubscription = this.dynamicMediaReplaceService.isEnableMediaSetiingObjectObservable.subscribe(item=>{
          if(this.selectedAwnserId){
          if(item && item.page == this.selectedAwnserId.controls.AnswerId.value && item.data != undefined && item.autoPlayData != undefined){
            let oldEnableMediaFile =this.selectedAwnserId.controls.EnableMediaFile.value;
            let oldAutoPlayData = this.selectedAwnserId.controls.AutoPlay.value;
            if(oldEnableMediaFile != item.data || oldAutoPlayData != item.autoPlayData){
              this.selectedAwnserId.patchValue({EnableMediaFile: item.data});
              this.selectedAwnserId.patchValue({AutoPlay: item.autoPlayData});
              this.isAutoPlay = item.autoPlayData; 
              this.selectedAwnserId.controls.EnableMediaFile.markAsDirty();
            }
          }
        }
      });
    }

    getVideoChangeTime(){
      this.isvideoSecondsToApplySubscription = this.dynamicMediaReplaceService.videoTimeChangeObservable.subscribe(res => {
         if(res && Object.keys(res).length != 0 && this.form.controls.QuestionId.value == res.id && this.selectedAwnserId){
           if(res.page == this.selectedAwnserId.controls.AnswerId.value && this.selectedAwnserId.controls.SecondsToApply 
            && this.selectedAwnserId.controls.SecondsToApply.value != res.secToApply){
            this.selectedAwnserId.patchValue({SecondsToApply: res.secToApply});
            this.selectedAwnserId.controls.SecondsToApply.markAsDirty();
           }
         }
       });
    }
    getSetFrameToggle(){
      this.isEnableSetFrameToggleObservableSubscription =  this.dynamicMediaReplaceService.isEnableSetFrameToggleObservable.subscribe((res) =>{
        if(res && Object.keys(res).length != 0 && this.form.controls.QuestionId.value == res.id && this.selectedAwnserId){
          if(res.page == this.selectedAwnserId.controls.AnswerId.value && this.selectedAwnserId.controls.VideoFrameEnabled
            && this.selectedAwnserId.controls.VideoFrameEnabled.value != res.VideoFrameEnabled){
           this.selectedAwnserId.patchValue({VideoFrameEnabled: res.VideoFrameEnabled});
           this.selectedAwnserId.controls.VideoFrameEnabled.markAsDirty();
          }
        }
      });
   }

  /**
   * Function to upload image
   */
  uploadAnswerImage(answerControl, index) {


    var env_answer = Object.assign({}, environment.cloudinaryConfiguration);
    env_answer.cropping_aspect_ratio = 1.2;
    env_answer.min_image_width = '300';
    env_answer.min_image_height = '250';
    var widget = cloudinary.createUploadWidget(env_answer,
      function (error, result) {
        if (!error && result[0].secure_url) {
          answerControl.patchValue({ imageORvideo: this.commonService.getImageOrVideo(result[0].secure_url) });
          var coordinate = '';
          if (result[0] && result[0].coordinates && result[0].coordinates.faces) {
            var cloudCoordinate = result[0].coordinates.faces
            coordinate = `x_${cloudCoordinate[0][0]},y_${cloudCoordinate[0][1]},w_${cloudCoordinate[0][2]},h_${cloudCoordinate[0][3]},c_crop`;
          }
          if (result[0].secure_url.match('upload')) {
            var index = result[0].secure_url.match('upload').index;
            result[0].secure_url = result[0].secure_url.slice(0, index + 6) + '/' + coordinate + result[0].secure_url.slice(index + 6 + Math.abs(0));
          }
          answerControl.patchValue({ AnswerImage: result[0].secure_url })
          answerControl.patchValue({ PublicIdForAnswer: result[0].public_id });
          answerControl.controls.AnswerImage.markAsDirty();
        } else {
          console.log("Error! Cloudinary upload widget error answerImage", error)
        }
      });
    widget.open(answerControl.controls.AnswerImage.value);

  }

  removeAnswerImage(answerControl, index) {
    answerControl.patchValue({ AnswerImage: '', SecondsToApply: 0})
    answerControl.patchValue({ imageORvideo: 'image' })
    answerControl.controls.AnswerImage.markAsDirty();
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
      PublicIdForAnswer: answer.PublicIdForAnswer,
      Categories: answer.Categories,
      EnableMediaFile:answer.EnableMediaFile,
      AutoPlay:answer.AutoPlay,
      SecondsToApply: answer.SecondsToApply ? answer.SecondsToApply : 0,
      VideoFrameEnabled: answer.VideoFrameEnabled ? answer.VideoFrameEnabled : false,
      AnswerVarList:[answer.AnswerVarList ? answer.AnswerVarList : []]
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
    this.createOptions(control.length - 1);
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
        if(this.isOpenBranchingLogicSide){
          this.isAddRemoveAnser.emit();
        }
        this.removeDataFromAnswerListControl(index);
        this.updateAnswerListSidebarRemoved(index)
        this.dynamicMediaReplaceService.isOpenEnableMediaSetiing = {
          "isOpen":true,
          "menuType":rightMenuEnum.DynamicMedia
        };
        this.dynamicMediaReplaceService.changeOpenEnableMediaSetiingSubmission();
        this.notificationsService.success("Removed")
        this.openMediaSetting.emit({
          "selectedAnwser": '',
          "type":'main'
        });
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
  getAnswerListControl(form) {
    this.appyStylingToFroala();
    return form.get('AnswerList').controls;
  }


  /**
   * *CLoudinary Upload Widget Extra configuration
   */
  cloudinaryUploadWidgetConfigurations = {
    cropping_aspect_ratio: 1.2,
    min_image_width: '300',
    min_image_height: '250',
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
    width:300,
    height:250
  }

  CM_accepted_formats = ['image','video'];

  // poster function 
  applyposterAns(selectedAnswer){
    let startOffset:string = "0";
    if((selectedAnswer.controls.VideoFrameEnabled && selectedAnswer.controls.VideoFrameEnabled.value) && (selectedAnswer.controls.SecondsToApply && selectedAnswer.controls.SecondsToApply.value)){
      startOffset = selectedAnswer.controls.SecondsToApply.value;
    }
      return `{ "cloud-name":"${environment.cloudinaryConfiguration.cloud_name}", "transformation": [{"start-offset": ${startOffset}, "fetch_format": "auto", "quality": "auto"}]}`
  }

  ngOnDestroy(){
    if(this.isStylingSubscription){
      this.isStylingSubscription.unsubscribe();
    }
    if(this.isDynamicMediaDataSubscription){
      this.isDynamicMediaDataSubscription.unsubscribe();
    }
    if(this.isVideoSoundEnableSubscription){
      this.isVideoSoundEnableSubscription.unsubscribe();
    }
    if(this.dragulaSubscription){
      this.dragulaSubscription.unsubscribe()
    }
    if(this.isvideoSecondsToApplySubscription){
      this.isvideoSecondsToApplySubscription.unsubscribe();
    }
    if(this.isEnableSetFrameToggleObservableSubscription){
      this.isEnableSetFrameToggleObservableSubscription.unsubscribe();
    }
  }

  public froalaEditorAt:any = {};
  public froalaOpenedAt: number;
  createOptions(index:any){
    if(!this.froalaEditorAt[index]){
      this.froalaEditorAt[index] = {
        "isShowVarBtn":false,
        "froalaRef": new FroalaEditorOptions(),
       }
    }
    this.froalaEditorAt[index].options = this.froalaEditorAt[index].froalaRef.setEditorOptions(1000);
    
    this.froalaEditorAt[index].options.charCounterCount = false;
    this.froalaEditorAt[index].options.ssCharCounterCount = true;
    this.froalaEditorAt[index].options.ssCharCounterMax = 1000;
    this.froalaEditorAt[index].options.pluginsEnabled.push('ssCharCounter','ssCharCounterCount','ssCharCounterMax'); 
    
    this.froalaEditorAt[index].options.AnswerIndex = index;
   
    this.froalaEditorAt[index].options.events["froalaEditor.initialized"] = (e, editor) =>{
      this.froalaEditorAt[editor.opts.AnswerIndex].froalaRef.editorRefernce = editor;                  
      editor.toolbar.hide();
      if(e.target.parentElement.classList.contains( 'has-ans-variable' )){
        editor.events.bindClick($('body'), 'i#ans-btn-variable'+editor.opts.AnswerIndex, function () {      
          editor.selection.save();
        });
      }
    };
  }

  createFroalaEditorAndOption(){
    let index = 0;
    let arrayList: FormArray = this.form.get("AnswerList") as FormArray;
    arrayList.controls.forEach((element: FormControl) => {
      this.createOptions(index);
      index++;
    });
  }

  getAnswerGroupAt(answerIndex: any): FormGroup{
    return (this.form.get("AnswerList") as FormArray).at(answerIndex) as FormGroup;
  }

  updateVarListFor(updateAt:number){
    let msg = this.froalaEditorAt[updateAt].froalaRef.editorRefernce.html.get();     
    let updatedVarist = this.variablePopupService.getListVariableFormulaV2(msg);
    this.getAnswerGroupAt(updateAt).get('AnswerVarList').patchValue(updatedVarist);
  }

  openVariablePopup(openAt:number){
    this.froalaOpenedAt = openAt
    let variablePopupPayload: any = {};
    let msg = this.froalaEditorAt[this.froalaOpenedAt].froalaRef.editorRefernce.html.get();    
    variablePopupPayload.listOfUsedVariableObj = this.variablePopupService.getListOfUsedVariableObjV2(msg);
    variablePopupPayload.listOfUsedVariableObj.map(varItem => {
      return (varItem.formula = varItem.formula.replace(/\{\{/g,'%').replace(/\}\}/g,'%'));
    });    
    variablePopupPayload.allowedVariblesFor = 'quiz';
    variablePopupPayload.isOpenPopup = true;
    this.variablePopupService.variablePopupOpened = 'ImageAnswers';

    this.variablePopupService.variablePopupPayload = variablePopupPayload;
    this.variablePopupService.changeInVariablePopupPayload();
  }

  UpdatePopUpStatus(){
    let listOfUsedVariableObj = this.variablePopupService.listOfUsedVariableObj;
    let activeFroalaRef = this.froalaEditorAt[this.froalaOpenedAt].froalaRef;
    let tempVarFormulaList:any = [];
    listOfUsedVariableObj.map(varItem => {
      tempVarFormulaList.push(varItem.formula.replace(/^%/g,'{{').replace(/%$/g,'}}'));
    });
    this.getAnswerGroupAt(this.froalaOpenedAt).get('AnswerVarList').patchValue(tempVarFormulaList);
    this.variablePopupService.insertFormulaIntoEditorV2(listOfUsedVariableObj, activeFroalaRef);
    this.form.markAsDirty();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.form){
      this.createFroalaEditorAndOption();
    }
  }
}
