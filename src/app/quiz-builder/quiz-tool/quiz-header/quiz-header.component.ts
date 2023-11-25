import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef, ComponentFactoryResolver, Input } from '@angular/core';
import { QuizBuilderApiService } from '../../quiz-builder-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Location } from "@angular/common";
import { ShareQuizComponent } from '../../share-quiz/share-quiz.component';
import { SharedService } from '../../../shared/services/shared.service';
import { QuizBuilderDataService } from '../../quiz-builder-data.service';
import { Title } from '@angular/platform-browser';
import { NotificationsService } from 'angular2-notifications';
import { UserInfoService } from '../../../shared/services/security.service';
import { Subscription } from 'rxjs';
import { DynamicMediaReplaceMentsService } from '../dynamic-media-replacement';

@Component({
    selector: 'app-quiz-header',
    templateUrl: './quiz-header.component.html',
    styleUrls: ['./quiz-header.component.scss']
  })

  export class QuizHeaderComponent implements OnInit{

    @Input() isBrsnchingLogic;
    private publishTemplate;
    public quizId;
    public openMode;
    public modalRef: BsModalRef;
    private shareTemplate;
    public quizURL;
    public selectedQuiz;
    public hostURL;
    public quizData;
    public islogic:boolean=false;
    public isBackandSave:boolean=false;
    public tagName;
    public usageName;
    public isUagesPopup:boolean = false;
    public usagesDatas;
    public isEditUsage:boolean = true;
    public usagesInWebChat:any=[{
      id : 1,
      title : "Webflow"
    },
    // {
    //   id : 2,
    //   title : "ChatBot"
    // },
    {
      id : 3,
      title : "WhatsApp chatbot"
    }
    ];
    public usages:any=[{
      id : 1,
      title : "Webflow"
    }
    ];

    public getUsages:any;
    public isWebChatPermission:boolean = false;
    public userInfo: any = {};
    public isBranchingLogicLinkSubscription: Subscription;
    public quizType;

    @ViewChild("shareQuizTemplate", { read: ViewContainerRef, static:true })
    shareQuizTemplate: ViewContainerRef;
    
    constructor( private quizBuilderApiService: QuizBuilderApiService,
      private modalService: BsModalService,
      private location: Location,
      private route: ActivatedRoute,
      private _crf: ComponentFactoryResolver,
      private sharedService: SharedService,
      private router: Router,
      private quizBuilderDataService:QuizBuilderDataService,
      private titleService: Title,
      private notificationsService: NotificationsService,
      private userInfoService: UserInfoService,
      private dynamicMediaReplaceService:DynamicMediaReplaceMentsService){}

      getQuizCoverDetail(){
        let self=this;
        this.quizBuilderApiService.getQuizCoverDetails(this.quizId).subscribe(function(res){
          self.quizData=res;
          self.quizType = res.QuizType;
          self.dataToSanitize();
        });
      }

      dataToSanitize() {
        this.quizData.QuizTitle = this.sharedService.sanitizeData(this.quizData.QuizTitle);
        this.quizBuilderDataService.isQuizCoverTitleSubmission=this.quizData.QuizTitle;
        this.quizBuilderDataService.changeIsQuizCoverTitleSubmission();
        this.titleService.setTitle( (this.quizData.QuizTitle?this.quizData.QuizTitle : "Untitled automation" )+ " " + "| Jobrock" );
      }

    ngOnInit() {
      this.userInfo = this.userInfoService._info;
      this.isWebChatPermission = this.userInfo.IsWebChatbotPermission;
      this.hostURL = this.location[
        "_platformLocation"
      ].location.host;
      this.routerParamSubscription();
      this.quizData = this.route.snapshot.data["quizData"];
      if(this.isBrsnchingLogic) {
        setTimeout(() => {
          this.getQuizCoverDetail();
        }, 1000);
        this.islogic=true;
      }else{
        this.quizType = this.quizData.QuizTypeId;
        this.dataToSanitize()
        this.islogic=false;
      }
      this.getUsageDetails();
      this.branchingLogicSave();
    }

    getUsageDetails(){
      if(this.isWebChatPermission){
        this.getUsages = this.usagesInWebChat;
      }else{
        this.getUsages = this.usages;
      }
      this.quizBuilderApiService.getQuizUsageType(this.quizId).subscribe(data=>{
        if(data && data.UsageTypes.length > 0 ){
          this.usagesDatas = data;
          let usageNames:any = [];
          this.getUsages.map(usage => {
            data.UsageTypes.map(useType =>{
              if(usage.id == useType){
                usageNames.push(usage.title);
              }
            });
            this.usageName = usageNames.toString();
          });
            let tagNames:any = [];
            this.tagName = '';
            if(data.Tag && data.Tag.length > 0){
              data.Tag.map(tag => {
                if(tag.TagName){
                  tagNames.push(tag.TagName);
                  this.tagName = tagNames.toString();
                }
              });
            }

            //hide next button all page if usage type whatsapp
            if(this.isWebChatPermission && data.UsageTypes.includes(3)){
              this.dynamicMediaReplaceService.isUsageTypeWhatsApp = true;
            }else{
              this.dynamicMediaReplaceService.isUsageTypeWhatsApp = false;
            }
            this.dynamicMediaReplaceService.changeUsageTypeWhatsAppSubmission();

            //if webchat permission disable and previously by defualt usage type selected 2 
            if(data.UsageTypes.length == 1 && this.isWebChatPermission == false){
              if(data.UsageTypes[0] == 2 || data.UsageTypes[0] == 3){
                this.isUagesPopup = true;
                this.isEditUsage = false;
              }else{
                this.isEditUsage = true;
              }
            }
            else if(data.UsageTypes[0] == 2){
              this.isUagesPopup = true;
              this.isEditUsage = false;
            }
            else{
              this.isEditUsage = true;
            }

        }else{
          this.isUagesPopup = true;
          this.isEditUsage = false;
        }
      });
    }

    routerParamSubscription() {
      this.route.parent.params.subscribe(params => {
        this.quizId = params["id"];
      });
    }

    onPreviewQuiz(publishTemplate) {
      this.publishTemplate = publishTemplate;
      var quiz;
      this.quizBuilderApiService.getQuizDetails(this.quizId).subscribe(data => {
        quiz = data;
        if (quiz.PublishedCode) {
          this.quizBuilderApiService
            .getQuizCode(quiz.PublishedCode, "PREVIEW")
            .subscribe(
              data => {
                window.open("quiz-preview/attempt-quiz?QuizCodePreview="+data,"_blank");
              }
            );
        } else {
          this.publishModal(publishTemplate, this.quizId, "PREVIEW");
        }
      });
    }

    publishModal(template: TemplateRef<any>, quizId, Mode) {
      this.openMode = Mode;
      this.modalRef = this.modalService.show(template, { class: "modal-sm" });
    }

  //Modal decline
    decline(): void {
      this.modalRef.hide();
    }

  //Modal confirm
  confirm(): void {
    this.quizBuilderApiService.publishQuiz(this.quizId).subscribe(
      data => {
        if (this.openMode === "PREVIEW") {
          this.onPreviewQuiz(this.publishTemplate);
        } else if (this.openMode === "SHARE") {
          this.onSharLinkClicked(this.shareTemplate, this.publishTemplate);
        }
      }
    );
    this.modalRef.hide();
  }
    
  onSharLinkClicked(shareTemplate, publishTemplate) {
    this.shareTemplate = shareTemplate;
    this.publishTemplate = publishTemplate;
    this.quizBuilderApiService.getQuizDetails(this.quizId).subscribe(quiz => {
      if (quiz.IsPublished) {
        this.shareQuizURL(shareTemplate);
        this.quizURL = this.hostURL + "/quiz?Code=" + quiz.PublishedCode;
      } else {
        this.quizId = quiz.QuizId;
        this.selectedQuiz = quiz;
        this.publishModal(publishTemplate, quiz.QuizId, "SHARE");
      }
    });
  }

  shareQuizURL(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  dynamicTemplateShare() {
    this.shareQuizTemplate.clear();
    this.quizBuilderApiService.getQuizDetails(this.quizId).subscribe(quiz => {
      var SHARE_QuizTemplate = this._crf.resolveComponentFactory(
        ShareQuizComponent
      );
      var SHARE_QuizComponentRef = this.shareQuizTemplate.createComponent(
        SHARE_QuizTemplate
      );
      SHARE_QuizComponentRef.instance.quizData = quiz;
    });
  }

  onPublished() {
    this.quizBuilderApiService.publishQuiz(this.quizId).subscribe(
      data => {},
       error => {
        this.notificationsService.error(error.error.message);
      }
    );
  }

  onChangeTitle(event){
    this.titleService.setTitle( event + " | Jobrock" );
    this.quizBuilderDataService.isQuizCoverTitleSubmission=event;
    this.quizBuilderDataService.changeIsQuizCoverTitleSubmission();
  }

  onSaveAll(){
     this.quizBuilderDataService.changeQuizSaveAll("saveAll");
  }

  onLogicSave(){
    this.isBackandSave = true;
    this.quizBuilderDataService.isBranchingLogicSubmission="branchingLogic";
    this.quizBuilderDataService.changeBranchingLogicSubmission();
  }

  branchingLogicSave(){
    let self=this;
    this.isBranchingLogicLinkSubscription = this.quizBuilderDataService.isBranchingLogicLinkSubmissionObservable.subscribe((item: any) => {
      if(item){
        self.isBackandSave = false;
        if(item == 'Save'){
          this.quizBuilderDataService.isBranchingLogicLinkSubmission = '';
          this.quizBuilderDataService.changeBranchingLogicLinkSubmission();
          this.updateQuizTitle();
        }
      }
    });
  }

  onBack(){
    this.router.navigate(['/quiz-builder/quiz-tool', this.quizId,'cover']);
  }

  onUsage(){
    this.isUagesPopup = true;
  }
  
  changeUsage(event){
    this.isUagesPopup = false;
    if(event.isSave){
      let obj = {
        "QuizId": this.quizId,
        "TagIds": event.TagIds,
        "UsageTypes": event.UsageTypes 
        }
        this.quizBuilderApiService.updateQuizUsageTypeAndTag(obj).subscribe(data=>{
          this.getUsageDetails();
        },
          error => {
            console.log(error);
        });
    }
  }

  updateQuizTitle() {
    let param ={
      "QuizId": this.quizId,
      "QuizTitle": this.quizBuilderDataService.isQuizCoverTitleSubmission
    }
      this.quizBuilderApiService
        .updateQuizTitleDetails(param)
        .subscribe(
          data => {},
          error => {
            this.notificationsService.error(
              "quiz title",
              "Something went Wrong"
            );
          }
        );
  }

  ngOnDestroy() {
    this.isBranchingLogicLinkSubscription.unsubscribe();
    this.quizBuilderDataService.changeQuizSaveAll(undefined);
    this.titleService.setTitle( "Automation | Jobrock");
  }

  }