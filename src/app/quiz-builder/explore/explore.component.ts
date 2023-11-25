import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef, ComponentFactoryResolver } from "@angular/core";
import { QuizBuilderApiService } from "../quiz-builder-api.service";
import { UserInfoService } from "../../shared/services/security.service";
import { NotificationsService } from "angular2-notifications";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import * as moment from "moment";
import { Moment } from "moment";
import { Router, ActivatedRoute } from "@angular/router";
import { QuizPermissionGaurd } from '../quiz-permission.guard';
import { ShareQuizComponent } from '../share-quiz/share-quiz.component';
import { EmailSmsSubjectService } from '../email-sms/email-sms-subject.service';
import { Subscription, Subscribable } from 'rxjs';
import { ShareConfigService } from '../../shared/services/shareConfig.service';
import { SharedService } from '../../shared/services/shared.service';
import { Meta, Title } from '@angular/platform-browser';
import { quizTypeEnum, usageTypeEnum } from "../quiz-tool/commonEnum";

@Component({
  selector: "app-explore",
  templateUrl: "./explore.component.html",
  styleUrls: ["./explore.component.scss"]
})
export class ExploreComponent implements OnInit {
  // Subscription
  private automationSuggestionFilteredDataSubscription: Subscription;

  //public officeList:any = [];
  public selectedOffice: any = {};
  public userList;
  public selectedUser:string = "";
  public selectedUserEmail: string = "";
  public quizList:any=[];
  public modalRef: BsModalRef;
  public quizId;
  public sortByDate;
  public sortByTagColor;
  public filterData: string;
  public isQuizListNull: boolean = false;
  public filterDataByUserName: string;
  public AutomationType = [
    { label: "Assessment", value: "2" },
    {label : "Scored", value :"4"}
  ];
  // public AutomationTypeId = "0";
  public automationTypeArray = ["2", "3", "4"];
  public selectAllAutomationType: boolean = true;
  //public offsetValue;

  //new style
  //public isLandelijkVestiing: boolean = false;
  public showOptionsForFilter: boolean = false;
  isActiveIconOnHover: any={};
  public searchOffice: string = '';
  public automationType: string = "";
  //public businessUserId:any;
  //public businessUserEmail:any;
  //public sharedMe:boolean;
  public officeId:any;
  public isQuizList:boolean=false;
  public isPublished:boolean=false;
  private publishTemplate;
  @ViewChild("shareQuizTemplate", { read: ViewContainerRef , static:true})
  shareQuizTemplate: ViewContainerRef;
  private openMode;
  public selectedQuiz;
  public suggestionType = 1;

  public callForSuggestionFilteredData: any = {};
  public isCompanyWise: boolean = true;
  public companyCode: any;

  public getOfficeData: any = [];
  public allOfficeIds: any = [];
  public userInfo: any = {};

  public hoverOnFavorite: any = {};
  public isFavorited:boolean=false;
  public isFavorite:boolean=false;
  public isStandard;
  public defaultImage:any="https://res.cloudinary.com/dbbkqtyqn/image/upload/c_fill,w_283,h_134,g_auto,q_auto:best,f_auto/v1588680596/Jobrock/automation-place-holder-corner.png";  
  public defaultWhatsAppCover:any="https://res.cloudinary.com/dbbkqtyqn/image/upload/c_fill,w_283,h_134,g_auto,q_auto:best,f_auto/v1646131152/Jobrock/whatsapp-place-holder.jpg";
  public startDate:any;
  public endDate:any;
  public isContactAutomationReport:boolean = false;

  public isRecoding:boolean=false;
  public isRecoding2:boolean=false;

  public moreTagsVisible: any = {};
  public recordsPerData = 0;
  public pageIndex:number = 1;
  public startRecord:any = 0;
  public endRecord:any = 0;
  public prePageIndex:number = 1;
  public preferredOffices: any = [];
  public selectAll: boolean = false;
  public selectedOfficeName = [];

  public quizTypeEnum = quizTypeEnum;
  public usageTypeEnum = usageTypeEnum;

  constructor(
    private quizBuilderApiService: QuizBuilderApiService,
    private userInfoService: UserInfoService,
    private modalService: BsModalService,
    private notificationsService: NotificationsService,
    private router: Router,
    private quizPermissionGaurd: QuizPermissionGaurd,
    private _crf: ComponentFactoryResolver,
    private route: ActivatedRoute,
    private emailSmsSubjectService: EmailSmsSubjectService,
    private shareConfigService: ShareConfigService,
    private sharedService: SharedService,
    private titleService: Title,
    private metaService : Meta
  ) {}

  ngOnInit() {
    this.titleService.setTitle( "Explore all | Jobrock" );
    this.companyCode = this.sharedService.getCookie("clientCode");
    this.isStandard = this.userInfoService.get().IsCreateStandardAutomationPermission;
    // get user info
    this.userInfo = this.userInfoService._info;
    if(this.userInfo.IsNPSAutomationPermission){
      this.automationTypeArray = ["1","2", "3", "4"];
    }
    // get offices list
    this.getOfficesList();
    // call for automation list by suggestion filtered
    //call ForSuggestion FilteredData Subscription
    this.automationSuggestionFilteredDataSubscription = this.shareConfigService.automationSuggestionFilteredDataObservable
      .subscribe((item: any) => {
        if (item.viewFor) {
          this.callForSuggestionFilteredData = Object.assign({}, item);
        }
        this.getAutomationListCompanyWise(this.isCompanyWise);
    });


  }

  // get offices list
  getOfficesList() {
    this.preferredOffices = this.userInfo.PreferredOffices;
    this.getOfficeData = this.userInfo.officesParentChildList;
    let getAllOffices = this.userInfo.OfficeList;
    if(this.preferredOffices && this.preferredOffices.length > 0){
      this.preferredOffices.map((item: any) => {
        if(getAllOffices && getAllOffices.length > 0){
          for (let i = 0; i < getAllOffices.length; i++) {
            if (item.id == getAllOffices[i].id) {
              this.selectedOfficeName.push(getAllOffices[i].name);
              this.allOfficeIds.push(getAllOffices[i].id);
              break;
            }
          }
        }    
      });

     
      if(this.selectedOfficeName && this.selectedOfficeName.length > 0){
        this.selectedOffice.officeName = this.selectedOfficeName.join();
      }
    }else{
      this.selectAllOffice();
    }
  }

//new style
getAutomationListCompanyWise(isCompanyWise: boolean) {
  this.isCompanyWise = isCompanyWise;
  this.emailSmsSubjectService.changeSearchSection(true)
  this.showOptionsForFilter = false;
  this.pageIndex = 1;
  this.getQuizListdetail();
}

startOfficeFilter() {
  this.showOptionsForFilter = !this.showOptionsForFilter;
}

selectOfficeToFilter(officeName: any, officeId: any) {
  this.selectedOffice = {};
  if (this.allOfficeIds.includes(officeId)) {
    var id = this.allOfficeIds.indexOf(officeId);
    this.allOfficeIds.splice(id, 1);
    var officeNames = this.selectedOfficeName.indexOf(officeName);
    this.selectedOfficeName.splice(officeNames, 1);
  } else {
    this.allOfficeIds.push(officeId);
    this.selectedOfficeName.push(officeName);
  }
  //show office name
  if(this.allOfficeIds && this.allOfficeIds.length > 0){
    this.selectedOffice.officeName = this.selectedOfficeName.join();
  }else{
    this.selectedOffice.officeName = 'Team';
  }
  //all  select option
  if (this.allOfficeIds.length == this.userInfo.OfficeList.length) {
    this.selectAll = true;
    this.selectedOffice.officeName = 'All teams';
  } else {
    this.selectAll = false;
  }

  this.searchOffice='';
  //this.officeId=officeId;
  this.pageIndex = 1;
  this.getQuizListdetail();
  this.emailSmsSubjectService.changeSearchSection(true)
}

getQuizListdetail(pageIndex?){
  this.isQuizList = false;
  this.pageIndex = pageIndex ? pageIndex : this.pageIndex;
  let officeIds: string = '';

  if(!this.isCompanyWise){
    //officeIds = this.allOfficeIds.join();
    officeIds = this.allOfficeIds;
  }
  
  let QuizTypeId = this.automationTypeArray.toString();

  // ready to send
  let readyToSendObj: any = {
    // "BusinessUserID": this.userInfo.BusinessUserId,
    // "BusinessUserEmail": this.userInfo.UserName,
    "IncludeSharedWithMe": this.isCompanyWise,
    "OffsetValue": this.userInfo.OffsetValue,
    "QuizTag": [],
    "SearchTxt": "",
    "QuizTypeId": QuizTypeId,
    // "IsDashboard": true,
    "OfficeIdList": officeIds,
    "QuizId": "",
    "QuizTagId": "",
    "IsFavorite": "",
    "CompanyCode": this.companyCode,
    "PageNo": this.pageIndex,
    "PageSize": 25,
    "IsPublished":"",
    "UsageType":""
  }

  if(this.isFavorited){
    readyToSendObj.IsFavorite = this.isFavorited;
  }

  if(this.isPublished){
    readyToSendObj.IsPublished = this.isPublished;
  }

  if (this.callForSuggestionFilteredData.viewData && this.callForSuggestionFilteredData.viewData.length > 0) {
    
    this.callForSuggestionFilteredData.viewData.map(function (item: any) {
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
      else if (item.filterCode == 'Usage') {
        readyToSendObj.UsageType = item.searchValue;
      }
    });
  }
  // this.quizBuilderApiService.getAutomationListVersion3(readyToSendObj)
  this.quizBuilderApiService.getAutomationReportList(readyToSendObj)
      .subscribe(data => {
        //pagination
          if(data.CurrentPageIndex == 1){
            this.startRecord = 1;
            this.endRecord = data.QuizListResponse.length + this.startRecord - 1 ;
          }else if(data.CurrentPageIndex > 1 && this.prePageIndex < data.CurrentPageIndex){
            this.startRecord = this.endRecord + 1;
            this.endRecord = data.QuizListResponse.length + this.startRecord - 1;
          }else if(data.CurrentPageIndex > 1 && this.prePageIndex > data.CurrentPageIndex){
            this.startRecord = this.startRecord - data.QuizListResponse.length;
            this.endRecord = this.endRecord - this.quizList.length;
          }
        this.recordsPerData = data.TotalRecords;
        this.prePageIndex = data.CurrentPageIndex;

          // if(data && data.QuizListResponse && data.QuizListResponse.length > 0 && this.isPublished){
          //   this.quizList = [];
          //   for(let i = 0; i < data.QuizListResponse.length; i++){
          //     if(data.QuizListResponse[i].IsPublished == this.isPublished){
          //       this.quizList.push(data.QuizListResponse[i]);
          //     }
          //   }
          // }else{
            this.quizList = data.QuizListResponse;
          //}

          if(this.quizList && this.quizList.length > 0){
          this.quizList.forEach(quiz => {
            quiz.createdOnFormat = moment(quiz.createdOn).format("ll");
            quiz.lastEditOnFormat = moment(quiz.LastEditDate).format("ll");
            if(quiz.QuizCoverDetail.QuizCoverImage){
              var content = quiz.QuizCoverDetail.QuizCoverImage.split('.');
              var contentType = content[content.length-1];
              if(contentType === 'jpg' || contentType === 'png' || contentType === 'jpeg' || contentType === 'gif' || contentType === 'tiff' || contentType === 'svg' || contentType === 'webp' || contentType===''){
                let uploadIndex=quiz.QuizCoverDetail.QuizCoverImage.indexOf( "upload/");
                let uploadedSubstring=quiz.QuizCoverDetail.QuizCoverImage.substring(0,(uploadIndex+7));
                let c_cropIndex=quiz.QuizCoverDetail.QuizCoverImage.indexOf( "c_crop/");
                if(c_cropIndex != -1){
                let c_cropSubstring=quiz.QuizCoverDetail.QuizCoverImage.substring(c_cropIndex+7);
                quiz.QuizCoverDetail.QuizCoverImage=uploadedSubstring + c_cropSubstring;
                }
                quiz.QuizCoverDetail.QuizCoverImage = quiz.QuizCoverDetail.QuizCoverImage.replace('upload/', "upload/c_fill,w_283,h_134,g_auto,q_auto:best,f_auto/");
                
                quiz.isImage  = true;
              }else { 
                quiz.isImage  = false;
              }
            }else{
              quiz.isImage  = true;
            }
            quiz.isQuizTags=false;
            quiz.isAction=false;
          });
        }else{
          this.isQuizList=true;
        }
        },
        error => {
          this.isQuizList=false;
        }
      );
   //   this.officeId='';
}


setPermissionDataToGuardService(quizData){
  this.quizPermissionGaurd.setPermissionData(quizData);
  if((this.isCompanyWise && this.isStandard) || !this.isCompanyWise){
    if(quizData.UsageTypes && quizData.UsageTypes.includes(3) && quizData.QuizTypeId != quizTypeEnum.Nps){
      if(quizData.IsBranchingLogicEnabled){
        window.open("quiz-builder/quiz-tool/"+quizData.Id+"/branching-logic");
      }else{
        window.open("quiz-builder/quiz-tool/"+quizData.Id);
      }
    }else if(quizData.IsBranchingLogicEnabled && quizData.QuizTypeId != 1){
      window.open("quiz-builder/quiz-tool/"+quizData.Id+"/branching-logic");
    }else{
      window.open("quiz-builder/quiz-tool/"+quizData.Id+"/cover");
    }
  }
}

openPermissionPopup(template){
  this.modalRef = this.modalService.show(template, { class: "modal-sm" });
}

onPublished(){
  this.isPublished = !this.isPublished;
  this.pageIndex = 1;
  this.emailSmsSubjectService.changeSearchSection(true)
  this.getQuizListdetail();
}

onAction(quizid){
  for(let i=0; i<this.quizList.length;i++){
    if(this.quizList[i].Id==quizid){
      this.quizList[i].isAction=!this.quizList[i].isAction;
    }
  }
}

dynamicTemplateShare(quiz) {
  this.shareQuizTemplate.clear();
  var SHARE_QuizTemplate = this._crf.resolveComponentFactory(
    ShareQuizComponent
  );
  var SHARE_QuizComponentRef = this.shareQuizTemplate.createComponent(
    SHARE_QuizTemplate
  );
  SHARE_QuizComponentRef.instance.quizData = quiz;
}

onDuplicatedQuiz(publishTemplate, quiz) {
  this.publishTemplate = publishTemplate;
  this.quizId = quiz.Id;
  this.quizBuilderApiService.createDuplicateQuiz(quiz.Id).subscribe(
    data => {
      let res=data['data'];
      if(quiz.IsBranchingLogicEnabled && quiz.QuizTypeId != 1){
        window.open("quiz-builder/quiz-tool/"+res+"/branching-logic");
      }else{
        window.open("quiz-builder/quiz-tool/"+res+"/cover");
      }
    },
    error => {
      this.notificationsService.error('Error');
      // this.publishModal(publishTemplate, quizId, "DUPLICATE");
    }
  );
}

publishModal(template: TemplateRef<any>, quizId, Mode) {
  this.openMode = Mode;
  // this.modalRef = this.modalService.show(template, { class: "modal-sm" });
}

onRemovedQuiz(template, item) {
  if(item.QuizTypeId == 1){
    this.automationType = "NPS";
 }else if(item.QuizTypeId == 2){
    this.automationType = "BASIC";
 }else if(item.QuizTypeId == 3){
    this.automationType = "PROFILE";
 }else{
   this.automationType = "SCORED";
 }
 this.quizId = item.Id;
  this.deleteQuizTemplate(template);
}

deleteQuizTemplate(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template, { class: "modal-sm" });
}

  //Modal confirm
delete(): void {
  this.quizBuilderApiService.removeQuiz(this.quizId).subscribe(
    data => {
     // this.notificationsService.success("Success");
      this.quizList = this.quizList.filter(quiz => quiz.Id != this.quizId);
      this.pageIndex = 1;
      this.getQuizListdetail();
    },
      error => {
     //   this.notificationsService.error("Error");
      }
    );
    this.modalRef.hide();
}

  //Modal decline
  cancel(): void {
    this.modalRef.hide();
  }

//end new style

  onSelectAutomationType(index) {
    if (this.automationTypeArray.includes(this.AutomationType[index].value)) {
      var id = this.automationTypeArray.indexOf(
        this.AutomationType[index].value
      );
      this.automationTypeArray.splice(id, 1);
    } else {
      this.automationTypeArray.push(this.AutomationType[index].value);
    }

    if (this.automationTypeArray.length === this.AutomationType.length) {
      this.selectAllAutomationType = true;
    } else {
      this.selectAllAutomationType = false;
    }

    this.getQuizList(
      // this.selectedUser,
      // this.selectedUserEmail,
      this.selectedOffice.officeId,
      false
    );
  }

  onSelectAllAutomationType() {
    this.selectAllAutomationType = !this.selectAllAutomationType;
    if (this.selectAllAutomationType) {
      this.automationTypeArray = [];
      this.AutomationType.forEach(automation => {
        this.automationTypeArray.push(automation.value);
      });
    } else {
      this.automationTypeArray = [];
    }

    this.getQuizList(
      // this.selectedUser,
      // this.selectedUserEmail,
      this.selectedOffice.officeId,
      false
    );
  }

  /**
   *  Function to get UserList data against OfficeId
   */
  getUserList(officeId) {
    this.quizBuilderApiService.getUserListData(officeId).subscribe(
      data => {
        this.userList = data;
        if(this.userList.length > 0) {
          this.selectedUser = this.userList[0].BusinessUserId;
          this.selectedUserEmail = this.userList[0].UserName;
          this.getQuizList(
            // this.selectedUser,
            // this.selectedUserEmail,
            this.selectedOffice.officeId,
            false
          );
        }
      },
      error => {
        this.notificationsService.error("Error");
      }
    );
  }

  /**
   *
   * @param e number (office id)
   * function call when selected office change
   */
  onOfficeChange(e) {
    this.getUserList(e.value);
    this.quizBuilderApiService.setOffice(e.value);
  }

  /**
   *
   * @param user Object (userInfo)
   * function call on selected User change
   */
  selectUser(user) {
    this.selectedUser = user.BusinessUserId;
    this.selectedUserEmail = user.UserName;
    this.getQuizList(
      // this.selectedUser,
      // this.selectedUserEmail,
      this.selectedOffice.officeId,
      false
    );
  }

  /**
   *
   * @param BusinessUserID number
   * @param BusinessUserEmail string
   * @param officeId number
   * @param sharedMe boolean
   * Get Quiz List against userId, User email, officeId
   * Api Integration
   */
  getQuizList(officeId, sharedMe) {
    var automationTypeArrayData;
    if (!this.automationTypeArray.length) {
      automationTypeArrayData = "0";
    } else {
      automationTypeArrayData = this.automationTypeArray.toString();
    }

    this.quizBuilderApiService
      .getQuizList(
        // BusinessUserID,
        // BusinessUserEmail,
        officeId,
        sharedMe,
        this.userInfo.OffsetValue,
        automationTypeArrayData
        // false
      )
      .subscribe(
        data => {
          this.quizList = data;
          this.quizList.forEach(quiz => {
            quiz.createdOnFormat = moment(quiz.createdOn).format("ll HH:mm");
          });
          if (!data.length) {
            this.isQuizListNull = true;
          } else {
            this.isQuizListNull = false;
          }
        },
        error => {
          this.notificationsService.error("Error");
        }
      );
  }

  /**
   *
   * @param publishTemplate Template reference
   * @param quizId number (QuizId)
   * duplicate Quiz created against quizId
   * Api integration
   */
  createDuplicateQuiz(publishTemplate, quizId) {
    this.quizId = quizId;
    this.quizBuilderApiService.createDuplicateQuiz(quizId).subscribe(
      data => {
        //this.notificationsService.success("Success");
      },
      error => {
      //  this.publishModal(publishTemplate, quizId);
      }
    );
  }

  //Modal confirm
  confirm(): void {
    this.quizBuilderApiService.publishQuiz(this.quizId).subscribe(
      data => {
        if (this.openMode === "PREVIEW") {
          this.onShowPreview(this.publishTemplate, this.selectedQuiz);
        } else if (this.openMode === "DUPLICATE") {
          this.onDuplicatedQuiz(this.publishTemplate, this.quizId);
        }
        this.selectedQuiz ?this.selectedQuiz.IsPublished = true:'';
        this.selectedQuiz  ? this.selectedQuiz.PublishedCode = data:'';
      },
      error => {
        this.notificationsService.error("Error");
      }
    );
    this.modalRef.hide();
  }

  //Modal decline
  decline(): void {
    this.modalRef.hide();
  }

  // publishModal(template: TemplateRef<any>, quizId) {
  //   this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  // }

  onSearchBoxEmpty() {
    this.filterData = "";
  }

  onSearchByUserNameBoxEmpty() {
    this.filterDataByUserName = "";
  }

  onStatistic(quiz){
    this.startDate = moment().subtract(1, 'months').format('L');
    this.endDate = moment().format('L');
    window.open(`quiz/automation-report?QuizId=${quiz.Id}&StartDate=${this.startDate}&EndDate=${this.endDate}`,"_blank");
  }

  onShowPreview(publishTemplate, quiz) {
    this.quizId = quiz.Id;
    this.selectedQuiz = quiz;
    this.quizBuilderApiService.getQuizDetails(quiz.Id).subscribe(quizData => {
      if (quizData.PublishedCode) {
        this.quizBuilderApiService
          .getQuizCode(quizData.PublishedCode, "PREVIEW")
          .subscribe(
            data => {
              window.open("quiz-preview/attempt-quiz?QuizCodePreview="+data,"_blank");
            },
            error => {
              this.notificationsService.error("Error");
            }
          );
      } else {
        this.selectedQuiz = quiz;
        // this.publishModal(publishTemplate, quiz.Id,"PREVIEW");
      }
    });
  }

  /**
   * Function call when sort by Date clicked
   */
  onSortedByDate() {
    this.sortByDate = !this.sortByDate;
    this.sortByTagColor = null;
  }

  /**
   * function call when sort by Tag Color clicked
   */
  onSortedByTagColor() {
    this.sortByTagColor = !this.sortByTagColor;
    this.sortByDate = null;
  }

  // call for favorite selection
  selectFavoriteList(selectedId:any, isFavorite:any){
    this.isFavorite = !isFavorite;

    this.quizBuilderApiService.updateQuizFavoriteStatus(selectedId, this.isFavorite, this.companyCode).subscribe(
      data => {
        if(data == "Favorite Status Updated"){
          this.quizList.map(function (item: any) {
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
          this.pageIndex = 1;
          this.getQuizListdetail();
        }
        
      },
      error => {
      //  this.publishModal(publishTemplate, quizId);
      }
    );
  }

  // get all favorite list
  getFavoriteList(){
    this.isFavorited = !this.isFavorited;
    this.pageIndex = 1;
    this.getQuizListdetail();
  }

  // select tag to filter
  selectTagToFilter(selectedTag:any){
    this.shareConfigService.quizTagsReadyToFilter =  Object.assign({}, selectedTag);
    this.shareConfigService.changeQuizTagsReadyToFilter();
  }

  onRecoding(){
    this.isRecoding = true;
  }

  onRecodings(){
    this.isRecoding2 = true;
  }
  
  closeRecording(event){
    this.isRecoding = false;
  }
  closeRecordings(event){
    this.isRecoding2 = false;
  }

//select all offices
  onSelectAll() {
    this.selectAllOffice();
    this.getQuizListdetail();
  }

  selectAllOffice(){
    this.selectAll = !this.selectAll;
    this.selectedOfficeName = [];
    this.allOfficeIds = [];
    this.selectedOffice.officeName = 'Team';
    if (this.selectAll) {
      this.userInfo.OfficeList.map(item => {
        this.allOfficeIds.push(item.id);
        this.selectedOfficeName.push(item.name)
        this.selectedOffice.officeName = 'All teams';
      });
    }
  }

  ngOnDestroy(){
    this.titleService.setTitle( "Automation | Jobrock");
  }

}
