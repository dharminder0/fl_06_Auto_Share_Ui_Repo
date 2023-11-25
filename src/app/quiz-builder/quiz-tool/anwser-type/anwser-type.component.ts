import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserInfoService } from '../../../shared/services/security.service';
import { CommonService } from '../../../shared/services/common.service';
import { answerTypeEnum, QuizAnswerStructureType, usageTypeEnum } from '../commonEnum';
import { DynamicMediaReplaceMentsService } from '../dynamic-media-replacement';
import { QuestionHelperUtil } from '../questions/question-helper-util';

@Component({
    selector: "anwser-type",
    templateUrl: "./anwser-type.component.html",
    styleUrls: ["./anwser-type.component.scss"]
})

export class AnwserTypeComponent implements OnInit {
    @Input() questionId: any;
    @Input() selectedAnswerType: string;
    @Input() isWhatsappEnable:boolean;
    @Input() isMultiRating:boolean;
    @Output() isSelectedAwnserType: EventEmitter<any> = new EventEmitter<any>();
    public AnswerTypes = new QuestionHelperUtil().answerTypeArray;
    @Input() quizData;
    public isImageAnswerType:boolean = false;
    @Input() answerStructureType:number = QuizAnswerStructureType.default;
    public isAnyChange: boolean = false;
    public get quizAnswerStructureType(): typeof QuizAnswerStructureType {
        return QuizAnswerStructureType;
    }
    public preAnswerType:any;
    public userInfo:any = {};
    public enabledPermissions:any = {};

    constructor( 
        private route: ActivatedRoute,
        private dynamicService : DynamicMediaReplaceMentsService,
        private commonService:CommonService,
        private userInfoService: UserInfoService,
    ){
        this.userInfo = this.userInfoService._info;
        this.enabledPermissions = JSON.parse(JSON.stringify(this.userInfoService.userPermissions));
    }

    ngOnInit(){
        this.preAnswerType = this.selectedAnswerType;
        if(this.route.snapshot.data["quizData"]){
            this.quizData = this.route.snapshot.data["quizData"];
        }
        this.setAnswerTypeForDiffAutomation(this.quizData.QuizTypeId);
        // reset to answerStructureType according to answertype only if when QuizAnswerStructureType is 0 (default)
        if(this.isWhatsappEnable && this.answerStructureType == QuizAnswerStructureType.default){
            this.updateAnsStructureType();
        }
    }

    setAnswerTypeForDiffAutomation(quizType){
        //quiz type accounding answer list
        this.AnswerTypes = this.AnswerTypes.filter((ansObj:any) => {
            if(ansObj.allowQuizType.includes(quizType)){
                if(this.enabledPermissions.isJRSalesforceEnabled && this.userInfo.AccountLoginType == 'salesforce'){
                  if(ansObj.isSalesForce){
                    return ansObj;
                  }
                }else{
                    return ansObj;
                }
               
            }
        });

        //whatsapp chatbot selected
        if(this.isWhatsappEnable){
            this.AnswerTypes = this.AnswerTypes.filter((ansObj:any) => {
                if(ansObj.allowUsageType.includes(usageTypeEnum.WhatsApp_Chatbot)){
                    return ansObj;
                }
            });
        }
    }
    
    onSave(){
        if(!this.commonService.checkSelectedQuestionValidity()){
            this.isSelectedAwnserType.emit(this.selectedAnswerType);
            this.dynamicService.isAnswerType = {
               "awnserType" : this.selectedAnswerType,
               "questionId" : this.questionId,
               "answerStructureType" : this.isWhatsappEnable ? this.answerStructureType : QuizAnswerStructureType.default,
               "isEnableMultiRating" : this.isMultiRating
            };
            this.preAnswerType = this.selectedAnswerType;
            this.dynamicService.changeAnswerSubmission();
            this.isAnyChange = false;
            this.commonService.isAnswerTypeChange = this.isAnyChange;
            this.commonService.isAnswerChange = true;
        }
    }

    onTextImage(data){
        this.isImageAnswerType = data;
        this.dynamicService.isAnswerTextImage = {
            "tab" : this.isImageAnswerType ? 'tab-02' : 'tab-01',
            "awnserType" : this.selectedAnswerType,
            "questionId" : this.questionId
        };
        this.dynamicService.changeAnswerTextImageSubmission();
    }

    updateAnsStructureType(){
        let selectedAnswerType = parseInt(this.selectedAnswerType);
        switch (selectedAnswerType) {
            case answerTypeEnum.ratingEmoji:                 
            case answerTypeEnum.ratingStar:  
            case answerTypeEnum.nps:  
                this.answerStructureType = QuizAnswerStructureType.list;              
                break;
            case answerTypeEnum.singleSelect: 
            case answerTypeEnum.lookingForJob:
                this.answerStructureType = QuizAnswerStructureType.button;              
                break;
            default:
                this.answerStructureType = QuizAnswerStructureType.default;
                break;
        }
    }

    updateChangeStatus(){
        this.isAnyChange = true;
        this.commonService.isAnswerTypeChange = this.isAnyChange;
    }

    onAnswerTypeChange(){
        if(this.selectedAnswerType != this.preAnswerType){
            this.isAnyChange = true;
        }else{
            this.isAnyChange = false;
        }
        this.commonService.isAnswerTypeChange = this.isAnyChange;  
    }

    onMultiRatingOption(data){
       this.isMultiRating = !data;
    }

}