import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { NotificationsService } from "angular2-notifications";
import * as $ from "jquery";
import { answerTypeEnum, elementDisplayOrder, elementReorderKey, QuizAnswerStructureType } from "../../quiz-builder/quiz-tool/commonEnum";
import { QuizDataService } from "../../quiz/quiz-data.service";
import { UserInfoService } from "./security.service";
import { VariablePopupService } from "./variable-popup.service";

@Injectable()
export class CommonService {

    public imageType:any = ['','jpg','png','jpeg','gif','tiff','svg','webp'];
    public docType:any = ['text','doc','docx','pdf','ppt','pttx'];
    public elementReorderStr:any; 
    public elementReorderStrForBranchingLogic:any;
    public userInfo: any;
    public isAnswerChange: boolean = false;

    constructor(
      private quizDataService: QuizDataService,
      private notificationsService: NotificationsService,
      private userInfoService: UserInfoService,
      private variablePopupService:VariablePopupService
    ){
      this.userInfo = this.userInfoService.get();
    }

    getImageOrVideo(data){
      let content = data.split('.');
      let contentType = content[content.length-1];
      if(this.imageType.includes(contentType)){
        return 'image';
      }else if(this.docType.includes(contentType)){
        return 'pdf';
      }
        return 'video';
    }

    isScrolledIntoView() {
        let elem:HTMLElement = document.querySelector(".next-btn-container");
        let isVisible = true;
        if(elem){
          var pageBottom = document.documentElement.offsetHeight;
          let topPos = $('.next-btn-container').offset().top + 10;
          if(topPos >= pageBottom){
            isVisible = false;
          }else{
            isVisible = true;
          }
        }
        return isVisible;
    }

    videoAutoPlayWithSound(videoFrameId,isSound){
      let getVideoEle:any = document.getElementById(videoFrameId);
      if(getVideoEle){
      let selectedEle:any = getVideoEle.querySelector("video");
       if(selectedEle){
         if(isSound){
          selectedEle.muted = true;
          selectedEle.play();
          if(this.quizDataService.isSoundEnableInAttempt){
           selectedEle.muted = false;
          }
         }else{
          selectedEle.muted = false;
         }
        }
      }
    }

    onLoadvideo(videoFrameId,isload?){
      let getVideoEle:any = document.getElementById(videoFrameId);
      if(getVideoEle){
      let selectedEle:any = getVideoEle.querySelector("video");
       if(selectedEle){
         if(isload){
          selectedEle.load();
         }else{
          return selectedEle;
         }
        }
      }
    }

    scrollUp(){
      let scrollup= document.getElementById("scrollDiv");
      if(scrollup){
        scrollup.scroll(0,0);
      }
    }

    getElementReorderStr(isCoverOrResultType?){
     this.elementReorderStr = [
          {
              "displayOrder": elementDisplayOrder.title,
              "key": elementReorderKey.title
          },
          {
              "displayOrder": elementDisplayOrder.media,
              "key": elementReorderKey.media
          },
          {
              "displayOrder": elementDisplayOrder.description,
              "key": elementReorderKey.description,
              "disMedia" : {
                  "displayOrder": elementDisplayOrder.descriptionMedia,
                  "key": elementReorderKey.descriptionMedia
              }
          },
          {
              "displayOrder": isCoverOrResultType ? elementDisplayOrder.coverOrResultButton : elementDisplayOrder.button,
              "key": elementReorderKey.button
          }
      ];
      return this.elementReorderStr;
    }

    getElementReorderStrForEnablePage(isCoverOrResultType?){
      this.elementReorderStrForBranchingLogic  = [
          {
              "titleName": "Title",
              "id": elementDisplayOrder.title,
              "displayOrder": elementDisplayOrder.title,
              "value": false,
              "key": elementReorderKey.title
          },
          {
              "titleName": "Media",
              "id": elementDisplayOrder.media,
              "displayOrder": elementDisplayOrder.media,
              "value": false,
              "key": elementReorderKey.media
          },
          {
              "titleName": "Description",
              "id": elementDisplayOrder.description,
              "displayOrder": elementDisplayOrder.description,
              "value": false,
              "key": elementReorderKey.description,
              "disMedia" : {
                  "titleName": "Description Media",
                  "id": elementDisplayOrder.descriptionMedia,
                  "displayOrder": elementDisplayOrder.descriptionMedia,
                  "value": false,
                  "key": elementReorderKey.descriptionMedia,
              }
          },
          {
              "titleName": "Button",
              "id": isCoverOrResultType ? elementDisplayOrder.coverOrResultButton : elementDisplayOrder.button,
              "displayOrder": isCoverOrResultType ? elementDisplayOrder.coverOrResultButton : elementDisplayOrder.button,
              "value": false,
              "key": elementReorderKey.button
          }
      ];
      return this.elementReorderStrForBranchingLogic;
    }
  
  /* defined list of answer type i.e.
  * represented as interactive messeges in whatsapp chatbot flow 
  */
  getInteractiveAnswerTypeList(): Array<number>{      
    return [
      answerTypeEnum.singleSelect,
      answerTypeEnum.lookingForJob,
      answerTypeEnum.ratingEmoji,
      answerTypeEnum.ratingStar,
      answerTypeEnum.nps
    ]
  }

  /* for simple text only representation in froala editor:
  *  removing all tag <> except <br>
  * if there is any new line character (\n) replacing it with <br> tag
  * converting all white space into html space entity
  * if aurgument passed is null, undefined, 0 or '' then it returns '' only
  */
  updateTextOnlyViewForFroalaEditor(textToFormat: string): string{
    if(textToFormat){
      return textToFormat.replace(/<[^(br)][^>]*>/g,"") /* replace all tag into empty string except <br> */
                          .replace(/(?:\r\n|\r|\n)/g, '<br>') /* convert all new line (\n) into <br> tag */
                          .replace(/\s/g,"&nbsp;") /* replace all white spaces into html space entity */
    }else{
      return '';
    }
  }
  
  public questionForm: FormGroup;

  /**
   * hold anser text of answer list at respective index from answer list 
   * used to any duplicate answer in case of whatsApp   *  
   */  
  public answerTextList:Array<string> = [];

  public isWhatsappEnable:boolean = false;
  public isAnswerTypeChange:boolean = false;

  checkSelectedQuestionValidity(questData?:any): boolean{ 
    let isErrorInQuestion: boolean = false;
    let QuestionData = this.questionForm ? JSON.parse(JSON.stringify(this.questionForm.value)) : {};
    // QuestionData.QuestionTitle = this.variablePopupService.updateTemplateVarHTMLIntoVariableV2(QuestionData.QuestionTitle);
    // QuestionData.Description = this.variablePopupService.updateTemplateVarHTMLIntoVariableV2(QuestionData.Description);
    let answerInputMaxLength =  QuizAnswerStructureType.button == QuestionData.AnswerStructureType ? 20 : 24;
    if(Object.keys(QuestionData).length > 0 && QuestionData.Type == 2){
      switch (QuestionData.AnswerType) {
        case answerTypeEnum.singleSelect:
          if(this.isWhatsappEnable){
            if(!this.isAnswerTypeChange && this.hasDuplicates(this.answerTextList)){
              this.notificationsService.error("Duplicate answers are not allowed");
              isErrorInQuestion = true;
            }
            if(this.countLength(QuestionData.QuestionTitle) > 60){
              this.notificationsService.error("Question title found to be greater than 60 chars");
              isErrorInQuestion = true;
            }
            if(!QuestionData.Description.trim()){
              this.notificationsService.error(this.userInfo.ActiveLanguage == 'en-US' ? "Description is missing!" : "Omschrijving ontbreekt!");
              isErrorInQuestion = true;
            }
            if(this.countLength(QuestionData.Description) > 1024){
              this.notificationsService.error("Description found to be greater than 1024 chars");
              isErrorInQuestion = true;
            }
            if(!this.isAnswerTypeChange && this.answerTextList.includes('')){
              this.notificationsService.error("Answers can't be left empty");
              isErrorInQuestion = true;
            }
            this.answerTextList.map((answerText, i) => {
              if(this.countLength(answerText) > answerInputMaxLength){
                this.notificationsService.error("Answer "+(i+1)+" char limit exceeded");
                isErrorInQuestion = true;
              }
            });
          }
          break;
        case answerTypeEnum.postCode:
        case answerTypeEnum.fullAddress:
          if(!this.isWhatsappEnable && !this.isAnswerTypeChange){
            if(QuestionData.AnswerList[0] && QuestionData.AnswerList[0].ListValues && QuestionData.AnswerList[0].ListValues.length == 0){
              this.notificationsService.error(this.userInfo.ActiveLanguage == 'en-US' ? "Select at least 1 country code!" : "Selecteer minimaal 1 landcode!");
              isErrorInQuestion = true;
            }
          }
          break;
        case answerTypeEnum.largeText:
          if(this.isWhatsappEnable){
            if(this.countLength(QuestionData.QuestionTitle) > 60){
              this.notificationsService.error("Question title found to be greater than 60 chars");
              isErrorInQuestion = true;
            }
            if(!QuestionData.Description.trim()){
              this.notificationsService.error(this.userInfo.ActiveLanguage == 'en-US' ? "Description is missing!" : "Omschrijving ontbreekt!");
              isErrorInQuestion = true;
            }
            if(this.countLength(QuestionData.Description) > 1024){
              this.notificationsService.error("Description found to be greater than 1024 chars");
              isErrorInQuestion = true;
            }
          }
          break;
        case answerTypeEnum.ratingEmoji:
        case answerTypeEnum.ratingStar:
        case answerTypeEnum.nps:
          if(this.isWhatsappEnable){
            if(this.countLength(QuestionData.QuestionTitle) > 60){
              this.notificationsService.error("Question title found to be greater than 60 chars");
              isErrorInQuestion = true;
            }
            if(!QuestionData.Description.trim()){
              this.notificationsService.error(this.userInfo.ActiveLanguage == 'en-US' ? "Description is missing!" : "Omschrijving ontbreekt!");
              isErrorInQuestion = true;
            }
            if(this.countLength(QuestionData.Description) > 1024){
              this.notificationsService.error("Description found to be greater than 1024 chars");
              isErrorInQuestion = true;
            }
          }
          break;

        default:
          isErrorInQuestion = false;
          break;
      }
      if(QuestionData.ShowTitle && !QuestionData.QuestionTitle.trim()){
        this.notificationsService.error(this.userInfo.ActiveLanguage == 'en-US' ? "Title is missing!": "Titel ontbreekt!");
        isErrorInQuestion = true;
      }
    }
    if(this.isWhatsappEnable && QuestionData.Type == 6){
      if(!QuestionData.Description.trim()){
        this.notificationsService.error(this.userInfo.ActiveLanguage == 'en-US' ? "Description is missing!" : "Omschrijving ontbreekt!");
        isErrorInQuestion = true;
      }      
      if(QuestionData.ShowTitle && !QuestionData.QuestionTitle.trim()){
        this.notificationsService.error(this.userInfo.ActiveLanguage == 'en-US' ? "Title is missing!": "Titel ontbreekt!");
        isErrorInQuestion = true;
      }
    }
    return isErrorInQuestion;
  }

  /** 
   * check wheather answer list has any dulicate answer text
   * @param arr answer text list (Array<string>)
   * @returns boolean
   */
  hasDuplicates<T>(arr: T[]): boolean {
    return new Set(arr).size < arr.length;
  }

/**
 * to close overlay through service method
 * to prevent closing from common JS
 * (presently integrated only with edit quiz overlay)
 */
  closeOverlay(){    
    $(".app-sidebar-overlay").removeClass("open");
    $(".app-sidebar").removeClass("open");
    $("body").removeClass("app-body");
  }

  /**
   * check question title valid/invalid for whatsapp flow
   */
   isQuestionTitleValid(): boolean{
    let isvalid: boolean;
    isvalid = this.questionForm.get("QuestionTitle").value && 
              this.questionForm.get("QuestionTitle").value.length > 60 && 
              this.getInteractiveAnswerTypeList().includes(this.questionForm.get("AnswerType").value) 
              ? true
              : false;
    return isvalid;
  }

  /**
   * transform any media file extention into respective specified format 
   * e.g.
   * image (.anyExtension) => (.jpeg)
   * video (.anyextention) =. (.mp4)
   * 
   * cloudinary allow us to render any image/video by specific or actual file extention.
   */
  transformMediaExtention(mediaUrl: string, mediaType: string){
    let lastDotPosition: number = mediaUrl.lastIndexOf('.');
    let fileBasePath: string = mediaUrl.substring(0,lastDotPosition);
    if(fileBasePath || lastDotPosition > 0 ){
      if(mediaType == 'image'){
        return fileBasePath+'.jpeg';
      }
      if(mediaType == 'video'){
        return fileBasePath+'.mp4';
      }
    }else{
      return mediaUrl;
    }
  }

  public regXForVarFormulaV2 = /\#\$(([a-zA-Z0-9_]\.){0,1}[a-zA-Z0-9_])+\$\#/g
  countLength(content:string){
    var doc = new DOMParser().parseFromString(content, 'text/html');
    var list = content ? content.match(this.regXForVarFormulaV2) : [];
    if(list && list.length > 0){
      list.map(formula => {
        let el:any = doc.getElementById(formula);
        if(el){
          el.replaceWith(el.value);
        }
      })
    }
    var tempContent = doc.body.innerHTML.replace(/<br(\s)*([^<])*>/g,"\n");
    var tempDivEl = document.createElement("div");
    tempDivEl.innerHTML = tempContent;
    return (tempDivEl.textContent|| tempDivEl.innerText || "").replace(/\u200B/g, "").length
  }
}