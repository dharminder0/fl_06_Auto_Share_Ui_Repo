import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { UserInfoService } from '../../../shared/services/security.service';
import { Subscription } from 'rxjs';
import { EmailSmsSubjectService } from '../email-sms-subject.service';
import { QuizBuilderApiService } from '../../quiz-builder-api.service';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ShareConfigService } from '../../../shared/services/shareConfig.service';
import { SharedService } from '../../../shared/services/shared.service';
import { QuizPermissionGaurd } from '../../quiz-permission.guard';
import { usageTypeEnum } from '../../quiz-tool/commonEnum';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'linked-unlinked-automation',
  templateUrl: './linked-unlinked-automation.component.html',
  styleUrls: ['./linked-unlinked-automation.component.scss']
})

export class LinkedUnlinkedAutomationComponent implements OnInit {
  // Subscription
  private emailTempleteSuggestionFilteredDataSubscription: Subscription;
  @Input() notificationType: any;
  public isUnlinkedAutomation: boolean = false;
  public selectedOffice: any = {};
  public officeList;
  public businessUserEmail;
  public offsetValue;
  public officeIdSubscription: Subscription;
  public sharedWithMeSubscription: Subscription;
  public updateTemplateSubscription: Subscription;
  public notificationTypeSubscription: Subscription;
  public sharedWithMe = true;
  public templateId;
  public quizTemplateList;
  public getTemplateTypeDetail;
  public quizId;
  public modalRef: BsModalRef;
  public suggestionType = 2;
  public status: any = 1;
  public companyCode: string = '';
  public hoverOnPreview: any = {};
  public hoverOnFavorite: any = {};
  public isFavorited:boolean=false;
  public isFavorite:boolean=false;
  isActiveIconOnHover: any={};
  // public smallScreenDefaultImage:any="https://res.cloudinary.com/dbbkqtyqn/image/upload/c_fill,w_auto,g_auto,q_auto:best,f_auto/v1588680596/Jobrock/automation-place-holder-corner.png";
  public largeScreenDefaultImage:any="https://res.cloudinary.com/dbbkqtyqn/image/upload/c_fill,w_auto,g_auto,q_auto:best,f_auto/v1588680596/Jobrock/automation-place-holder-corner.png";
  public defaultWhatsAppCover:any="https://res.cloudinary.com/dbbkqtyqn/image/upload/c_fill,w_auto,g_auto,q_auto:best,f_auto/v1646131152/Jobrock/whatsapp-place-holder.jpg";
  public usageTypeEnum = usageTypeEnum;

  public recordsPerData = 0;
  public pageIndex:number = 1;
  public startRecord:any = 0;
  public endRecord:any = 0;
  public prePageIndex:number = 1;

  constructor(
    private userInfoService: UserInfoService,
    private emailSmsSubjectService: EmailSmsSubjectService,
    private quizBuilderApiService: QuizBuilderApiService,
    private notificationsService: NotificationsService,
    private modalService: BsModalService,
    private router: Router,
    private shareConfigService: ShareConfigService,
    private sharedService: SharedService,
    private quizPermissionGaurd: QuizPermissionGaurd,
    private commonService:CommonService
  ) {
    this.officeList = this.userInfoService.get().OfficeList;
    this.businessUserEmail = this.userInfoService.get().UserName;
  }

  ngOnInit() {
    this.companyCode = this.sharedService.getCookie("clientCode");
    this.offsetValue = this.userInfoService.get().OffsetValue;
    this.getTemplateDetails();

    this.officeIdSubscription = this.emailSmsSubjectService.officeIdSubject
      .subscribe((id) => {
        this.pageIndex = 1;
        this.selectedOffice.officeId = id;
        this.getTemplateDetails();
      });

    this.sharedWithMeSubscription = this.emailSmsSubjectService.sharedWithMeSubjcet
      .subscribe((data) => {
        this.sharedWithMe = data;
      });

    this.updateTemplateSubscription = this.emailSmsSubjectService.updateTemplateSubject
      .subscribe((bool) => {
        if (bool) {
          // this.getTemplateDetails();
          this.isUnlinkedAutomation = true;
          this.status = 3;
        }
      });


    this.notificationTypeSubscription = this.emailSmsSubjectService.notificationTypesSubject
      .subscribe((type) => {
        this.notificationType = type;
        this.getTemplateDetails();
      })

    this.emailSmsSubjectService.templateIdSubject
      .subscribe((tempId) => {
        if (this.templateId != tempId) {
          this.templateId = tempId;
          this.getTemplateDetails();
          this.emailSmsSubjectService.changeSearchSection(true)
        }
      })

    //call ForSuggestion FilteredData Subscription
    this.emailTempleteSuggestionFilteredDataSubscription = this.shareConfigService.emailTempleteSuggestionFilteredDataObservable
      .subscribe((item: any) => {
        if (this.shareConfigService.emailTempleteSuggestionFilteredData.viewFor) {
          this.pageIndex = 1;
          this.getTemplateDetails();
        }
      });

  }

  getAutomationListLinkedWise(islinked) {
    this.pageIndex = 1;
    if (islinked) {
      this.isUnlinkedAutomation = false;
      this.status = 1;
      this.emailSmsSubjectService.changeSearchSection(true)
    } else {
      this.isUnlinkedAutomation = true;
      this.status = 3;
      this.emailSmsSubjectService.changeSearchSection(true)
    }
    this.getTemplateDetails();
  }

  getTemplateDetails(pageIndex?) {
    this.pageIndex = pageIndex ? pageIndex : this.pageIndex;
    if (!this.emailSmsSubjectService.getShared() && !this.selectedOffice.officeId) {
      if (this.quizBuilderApiService.getOffice()) {
        this.selectedOffice.officeId = this.quizBuilderApiService.getOffice();
      }
      if (!this.selectedOffice.officeId && this.officeList.length) {
        this.selectedOffice.officeId = this.officeList[0].id
      }
    }

    let readyToSendObj: any = {
      "IncludeSharedWithMe": this.emailSmsSubjectService.getShared(),
      "IsFavorite": "",
      "NotificationType": this.notificationType,
      "OfficeId": this.selectedOffice.officeId,
      "OrderBy": 0,
      "PageNo": this.pageIndex,
      "PageSize": 25,
      "QuizId": "",
      "QuizTagId": "",
      "QuizTypeId": "",
      "SearchTxt": "",
      "TemplateId": ""
    }

    if(this.isFavorited){
      readyToSendObj.IsFavorite = this.isFavorited;
    }

    if (this.shareConfigService.emailTempleteSuggestionFilteredData.viewData && this.shareConfigService.emailTempleteSuggestionFilteredData.viewData.length > 0) {
    
      this.shareConfigService.emailTempleteSuggestionFilteredData.viewData.map(function (item: any) {
        if (item.filterCode == 'qSearch') {
          readyToSendObj.SearchTxt = item.searchValue;
        }
        else if (item.filterCode == 'Automations') {
          readyToSendObj.QuizId = item.searchValue;
        }
        else if (item.filterCode == 'AutomationTypes') {
          readyToSendObj.QuizTypeId = item.searchValue;
        }
        else if (item.filterCode == 'Tag') {
          readyToSendObj.QuizTagId = item.searchValue;
        }
      });
    }

    if (this.isUnlinkedAutomation) {
      readyToSendObj.UsageType = 1;
      this.getInActiveQuizListForNotificationTemplate(readyToSendObj);
    } else {
      readyToSendObj.TemplateId = this.templateId;
      this.getQuizTemplateListInTemplate(readyToSendObj);
    }
   // this.getTemplateTypeDetail = data;
  }

  getQuizTemplateListInTemplate(readyToSendObj){
    this.quizBuilderApiService.getNotificationTemplateQuizTemplateList(readyToSendObj).subscribe(data => {
      //pagination
      if(data.CurrentPageIndex == 1){
        this.startRecord = 1;
        this.endRecord = data.QuizInTemplateList.length + this.startRecord - 1 ;
      }else if(data.CurrentPageIndex > 1 && this.prePageIndex < data.CurrentPageIndex){
        this.startRecord = this.endRecord + 1;
        this.endRecord = data.QuizInTemplateList.length + this.startRecord - 1;
      }else if(data.CurrentPageIndex > 1 && this.prePageIndex > data.CurrentPageIndex){
        this.startRecord = this.startRecord - data.QuizInTemplateList.length;
        this.endRecord = this.endRecord - this.quizTemplateList.length;
      }
      this.recordsPerData = data.TotalRecords;
      this.prePageIndex = data.CurrentPageIndex;

      this.quizTemplateList = data.QuizInTemplateList;
      this.getQuizCoverImage();
    });
  }

  getInActiveQuizListForNotificationTemplate(readyToSendObj){
    this.quizBuilderApiService.getNotificationTemplateInActiveQuizList(readyToSendObj).subscribe(data => {
      
       //pagination
       if(data.CurrentPageIndex == 1){
        this.startRecord = 1;
        this.endRecord = data.InactiveQuizList.length + this.startRecord - 1 ;
      }else if(data.CurrentPageIndex > 1 && this.prePageIndex < data.CurrentPageIndex){
        this.startRecord = this.endRecord + 1;
        this.endRecord = data.InactiveQuizList.length + this.startRecord - 1;
      }else if(data.CurrentPageIndex > 1 && this.prePageIndex > data.CurrentPageIndex){
        this.startRecord = this.startRecord - data.InactiveQuizList.length;
        this.endRecord = this.endRecord - this.quizTemplateList.length;
      }
      this.recordsPerData = data.TotalRecords;
      this.prePageIndex = data.CurrentPageIndex;
      
      this.quizTemplateList = data.InactiveQuizList;
      this.getQuizCoverImage();
    });
  }

  getQuizCoverImage(){
    if(this.quizTemplateList){
      this.quizTemplateList.forEach(quiz => {
        if(quiz.QuizCoverDetails.QuizCoverImage){
          let imageORvideo = this.commonService.getImageOrVideo(quiz.QuizCoverDetails.QuizCoverImage);
          if(imageORvideo == 'image'){
            if(window.innerWidth >= 1249 && window.innerWidth <= 1600){
              quiz.QuizCoverDetails.QuizCoverImage = quiz.QuizCoverDetails.QuizCoverImage.replace('upload/', `upload/c_lpad,f_auto,w_173,h_112,q_auto/`);
            }else{
              quiz.QuizCoverDetails.QuizCoverImage = quiz.QuizCoverDetails.QuizCoverImage.replace('upload/', `upload/c_lpad,f_auto,w_208,h_93,q_auto/`);
            }
           
            quiz.isImage  = true;
          }else { 
            quiz.isImage  = false;
          }
        }else{
          quiz.isImage  = true;
        }
        quiz.isQuizTags=false;
      });
    }
  }

  onShowTag(quizid){
    for(let i=0; i<this.quizTemplateList.length;i++){
      if(this.quizTemplateList[i].Id==quizid){
        this.quizTemplateList[i].isQuizTags=!this.quizTemplateList[i].isQuizTags;
      }
    }
  }

  onShowPreview(publishTemplate, quiz) {
    this.quizId = quiz.Id;
    this.quizBuilderApiService.getQuizDetails(quiz.Id).subscribe(quizData => {
      if (quizData.PublishedCode) {
        this.quizBuilderApiService
          .getQuizCode(quizData.PublishedCode, "PREVIEW")
          .subscribe(
            data => {
              window.open("quiz-preview/attempt-quiz?QuizCodePreview="+data,"_blank");
              // this.router.navigate(
              //   [{ outlets: { popup: "quiz-preview/attempt-quiz" } }],
              //   { queryParams: { QuizCodePreview: data } }
              // );
            },
            error => {
             // this.notificationsService.error("Error");
            }
          );
      } else {
        this.publishModal(publishTemplate, quiz.Id);
      }
    });
  }

  publishModal(template: TemplateRef<any>, quizId) {
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  //Modal confirm
  confirm(): void {
    this.quizBuilderApiService.publishQuiz(this.quizId).subscribe(
      data => {
      //  this.notificationsService.success("Success");
      },
      error => {
      //  this.notificationsService.error("Error");
      }
    );
    this.modalRef.hide();
  }

  //Modal decline
  decline(): void {
    this.modalRef.hide();
  }

  updateTemplateQuizType(data) {
    let updateTemplateQuizParam;
    for (let i = 0; i < this.getTemplateTypeDetail.NotificationTemplateList.length; i++) {
      if (this.getTemplateTypeDetail.NotificationTemplateList[i].Id == this.templateId) {
        updateTemplateQuizParam = this.getTemplateTypeDetail.NotificationTemplateList[i];
        updateTemplateQuizParam.QuizInTemplateList.push(data);
        let findIndex = this.quizTemplateList.indexOf(data);
        this.quizTemplateList.splice(findIndex, 1);
      }
    }
    this.quizBuilderApiService.updateQuizTemplate(updateTemplateQuizParam)
      .subscribe((data) => {
        // this.notificationsService.success("Success")
      })
  }

  makeTemplateInactive(data) {
    var body = {
      NotificationType: this.notificationType,
      QuizInTemplateList: []
    };

    this.getTemplateTypeDetail.InactiveQuizList.forEach((type) => {
      body.QuizInTemplateList.push({
        id: type.Id
      });
    });

    body.QuizInTemplateList.push({ id: data.Id });
    let findIndex = this.quizTemplateList.indexOf(data);
    this.quizTemplateList.splice(findIndex, 1);

    this.quizBuilderApiService.setInactiveQuizType(body)
      .subscribe((data) => {
        // this.notificationsService.success('Template has been Inactive');
      }, (error) => {
        //this.notificationsService.error('Something Went Wrong');
      })
  }

  unlinkAutomation(data){
    var body = {
      NotificationType: this.notificationType,
      QuizId: data.Id,
      TemplateId : this.templateId
    };
    let findIndex = this.quizTemplateList.indexOf(data);
    this.quizTemplateList.splice(findIndex, 1);
    this.quizBuilderApiService.unlinkAutomationNotificationTemplate(body)
    .subscribe((data) => {this.getTemplateDetails();});
  }

  linkAutomation(data){
    var body = {
      NotificationType: this.notificationType,
      QuizId: data.Id,
      TemplateId : this.templateId
    };
    let findIndex = this.quizTemplateList.indexOf(data);
    this.quizTemplateList.splice(findIndex, 1);
    this.quizBuilderApiService.linkAutomationNotificationTemplate(body)
    .subscribe((data) => {this.getTemplateDetails();});
  }

  getSeachMessage(data: any) {
    console.log("templete search");
    console.log(data);
    console.log("templete search");
  }

  ngOnDestroy() {
    this.officeIdSubscription.unsubscribe();
    this.sharedWithMeSubscription.unsubscribe();
    this.updateTemplateSubscription.unsubscribe();
    this.notificationTypeSubscription.unsubscribe();
  }

  // call for favorite selection
  selectFavoriteList(selectedId:any, isFavorite:any){
    this.isFavorite = !isFavorite;

    this.quizBuilderApiService.updateQuizFavoriteStatus(selectedId, this.isFavorite, this.companyCode).subscribe(
      data => {
        if(data == "Favorite Status Updated"){
          this.quizTemplateList.map(function (item: any) {
            if(item.Id == selectedId){
              if(item.IsFavorited){
                item.IsFavorited = false;
              }
              else{
                item.IsFavorited = true;
              }
            }
          })
          // call for quiz list
          this.getTemplateDetails();
        }
        
      },
      error => {
      //  this.publishModal(publishTemplate, quizId);
      }
    );
  }

  // get all favorite list
  getFavoriteList(){
    this.pageIndex = 1;
    this.isFavorited = !this.isFavorited;
    this.getTemplateDetails();
  }

  // select tag to filter
  selectTagToFilter(selectedTag:any){
    this.shareConfigService.quizTagsReadyToFilter =  Object.assign({}, selectedTag);
    this.shareConfigService.changeQuizTagsReadyToFilter();
  }

}