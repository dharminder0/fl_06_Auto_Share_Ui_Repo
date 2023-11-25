import { Component,EventEmitter,OnInit, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NotificationsService } from "angular2-notifications";
import { SharedService } from "../../../shared/services/shared.service";
import { CommonService } from "../../../shared/services/common.service";
import { UserInfoService } from "../../../shared/services/security.service";
import { QuizBuilderApiService } from "../../quiz-builder-api.service";
import { QuizBuilderDataService } from "../../quiz-builder-data.service";
import { BranchingLogicEnum } from "../commonEnum";
import { DynamicMediaReplaceMentsService } from "../dynamic-media-replacement";
import { rightMenuEnum } from "../rightmenu-enum/rightMenuEnum";

@Component({
    selector: "edit-quiz-overLay",
    templateUrl: "./edit-quiz-overLay.component.html",
    styleUrls: ["./edit-quiz-overLay.component.scss"]
})

export class EditQuizOverLayComponent implements OnInit {
    @Output() branchingData: EventEmitter<any> = new EventEmitter<any>();
    @Output() templateData: EventEmitter<any> = new EventEmitter<any>();
    public editType;
    public editTypeId;
    public quizData;
    public questionData;
    public quizId = null;
    public contentData;
    public sameTableContentAndQuestion;
    public isOpenBranchingLogicSide:boolean = true;
    public resultData;
    public badgeData;
    public coverData;
    public personalResult:boolean = false;
    public userInfo:any={};
    public enabledPermissions:any = {};
    public language;
    public branchingLogicEnum = BranchingLogicEnum;
    public multiResultEnum = 12;
    public selectedTemplateData:any;
    constructor(private quizBuilderApiService: QuizBuilderApiService,
        private route: ActivatedRoute,
        private quizBuilderDataService:QuizBuilderDataService,
        private dynamicMediaReplaceService:DynamicMediaReplaceMentsService,
        private notificationsService: NotificationsService,
        private userInfoService: UserInfoService,
        private commonService: CommonService,
        private sharedService: SharedService
    ){}

    ngOnInit(){
        this.route.parent.params.subscribe(params => {
            this.quizId = +params["id"];
        });
        if((this.editType == BranchingLogicEnum.QUESTION || (this.editType == BranchingLogicEnum.CONTENT && this.sameTableContentAndQuestion)) && this.editTypeId){
            this.fetchQuestionDetails();
        }else if(this.editType == BranchingLogicEnum.CONTENT && !this.sameTableContentAndQuestion && this.editTypeId){
            this.fetchContentDetails();
        }else if(this.editType == BranchingLogicEnum.RESULT && this.editTypeId){
            this.fetchResultDetails();
        }else if(this.editType == BranchingLogicEnum.BADGE && this.editTypeId){
            this.fetchBadgesDetails();
        }else if(this.editType == BranchingLogicEnum.START){
            this.fetchCoverDetails();
        }else if(this.editType == this.multiResultEnum){               
            setTimeout(() => {
                this.personalResult = true;
            }, 1000);
        }else if(this.editType == BranchingLogicEnum.WHATSAPPTEMPLATE){    
        }
        this.userInfo = this.userInfoService._info;
        if(this.userInfo)
        {
            this.language = this.userInfo.ActiveLanguage
        }
        this.enabledPermissions = JSON.parse(JSON.stringify(this.userInfoService.userPermissions));
    }

    fetchQuestionDetails() {
        this.quizBuilderApiService
        .getQuestionDetails(this.editTypeId,this.quizId)
        .subscribe(
          questionData => {
              this.questionData = JSON.parse(JSON.stringify(questionData));
            },
            error => {
              this.notificationsService.error("Error");
            }
          );
    }

    fetchContentDetails(){
        this.quizBuilderApiService.getQuizContent(this.editTypeId,this.quizId).subscribe(contentData => {
                this.contentData = JSON.parse(JSON.stringify(contentData));
            },
            error => {
                this.notificationsService.error("Error");
            }
        );
    }

    fetchResultDetails(){
        this.quizBuilderApiService.getResultDetails(this.editTypeId,this.quizId).subscribe(resultData => {
            this.resultData = JSON.parse(JSON.stringify(resultData));
        },
        error => {
            this.notificationsService.error("Error");
        }
    );
    }

    fetchBadgesDetails(){
        this.quizBuilderApiService.getQuizBadge(this.editTypeId,this.quizId).subscribe(badgeData => {
            this.badgeData = JSON.parse(JSON.stringify(badgeData));
        },
        error => {
            this.notificationsService.error("Error");
        }
        );
    }

    onUpdateBranchingLogic(){
        this.quizBuilderApiService.getBranchingLogicDetails(this.quizId).subscribe(res => {
            if(res){
                this.branchingData.emit(res);
                this.notificationsService.success(this.language == 'en-US' ? "Saved" : "Opgeslagen");
            }
        });
    }

    fetchCoverDetails(){
        this.quizBuilderApiService.getQuizCoverDetails(this.quizId).subscribe(coverData => {
                this.coverData = JSON.parse(JSON.stringify(coverData));
            },
            error => {
                this.notificationsService.error("Error");
            }
        );
    }

    onSetTemplateDetail(event){
        this.selectedTemplateData = event;
        this.templateData.emit(this.selectedTemplateData);
    }

    onSaveAll(){
        if(this.editType == BranchingLogicEnum.WHATSAPPTEMPLATE){
            this.commonService.closeOverlay();
        }else if(!this.commonService.checkSelectedQuestionValidity()){
            this.quizBuilderDataService.changeQuizSaveAll("saveAll");
            this.commonService.closeOverlay();
            let getPlayVideos = document.getElementsByTagName("video");
            if(getPlayVideos && getPlayVideos.length > 0){
                for(let i=0; i<getPlayVideos.length; i++){
                    getPlayVideos[i].muted = true;
                }
            }
            if(this.dynamicMediaReplaceService.isOpenEnableMediaSetiing.isOpen == true){
                this.dynamicMediaReplaceService.isOpenEnableMediaSetiing={
                    "isOpen":false,
                    "menuType":rightMenuEnum.DynamicMedia
                };
                this.dynamicMediaReplaceService.changeOpenEnableMediaSetiingSubmission();
            }
            if((this.editType == 2 || (this.editType == 6 && this.sameTableContentAndQuestion)) && this.dynamicMediaReplaceService.isElementSetting && Object.keys(this.dynamicMediaReplaceService.isElementSetting).length != 0){
                this.dynamicMediaReplaceService.isElementSetting = {};
                this.dynamicMediaReplaceService.changeElementSettingSubmission();
            }else if((this.editType == 6 || !this.sameTableContentAndQuestion ) && this.dynamicMediaReplaceService.isContentElementSetting && Object.keys(this.dynamicMediaReplaceService.isContentElementSetting).length != 0){
                this.dynamicMediaReplaceService.isContentElementSetting = {};
                this.dynamicMediaReplaceService.changeContentElementSettingSubmission();
            }else if(this.editType == 4 && this.dynamicMediaReplaceService.resultElementSetting && Object.keys(this.dynamicMediaReplaceService.resultElementSetting).length != 0){
                this.dynamicMediaReplaceService.resultElementSetting = {};
                this.dynamicMediaReplaceService.changeResultElementSettingSubmission();
            }else if(this.editType == 11 && this.dynamicMediaReplaceService.isBadgeElementSetting && Object.keys(this.dynamicMediaReplaceService.isBadgeElementSetting).length != 0){
                this.dynamicMediaReplaceService.isBadgeElementSetting = {};
                this.dynamicMediaReplaceService.changeBadgeElementSettingSubmission();
            }else if(this.editType == 1 && this.dynamicMediaReplaceService.isCoverElementSetting && Object.keys(this.dynamicMediaReplaceService.isCoverElementSetting).length != 0){
                this.dynamicMediaReplaceService.isCoverElementSetting = {};
                this.dynamicMediaReplaceService.changeCoverElementSettingSubmission();
            }
        }        
    }

    onSaveTemplate(){
        if(this.enabledPermissions.isJRSalesforceEnabled && this.userInfo.AccountLoginType == 'salesforce'){
            let selectedTemplateDetails:any = {}
            if(this.sharedService.hsmTemplateData  && Object.keys(this.sharedService.hsmTemplateData).length > 0){
                selectedTemplateDetails = JSON.parse(JSON.stringify(this.sharedService.hsmTemplateData));
                this.quizBuilderApiService.updateQuizWhatsAppTemplate(this.quizId,selectedTemplateDetails.id,selectedTemplateDetails.templateBody[0].langCode).subscribe(res => {
                    this.templateData.emit({res,selectedTemplateDetails});
                });
                this.commonService.closeOverlay();
            }
        }
        else{
            this.quizBuilderDataService.changeQuizWhatsappSave("save");
            this.commonService.closeOverlay();
        }
        // this.quizBuilderDataService.changeQuizWhatsappSave("save");
        // this.commonService.closeOverlay();
    }
}