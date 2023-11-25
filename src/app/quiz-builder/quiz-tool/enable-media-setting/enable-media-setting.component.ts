import { Component, OnInit, Input } from "@angular/core";
import { DynamicMediaReplaceMentsService } from '../dynamic-media-replacement';
import { of, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from "@angular/router";
import { DragulaService } from "ng2-dragula";
import { elementDisplayOrder, elementReorderKey, enableItemPage, QuizAnswerStructureType } from "../commonEnum";
import { CommonService } from "../../../shared/services/common.service";

@Component({
    selector: "enable-media-setting",
    templateUrl: "./enable-media-setting.component.html",
    styleUrls: ["./enable-media-setting.component.scss"]
})

export class EnableMediaSettingComponent implements OnInit {
    public isSidebarOpen:boolean;
    public dynamicMediaData:any={};
    private isOpenDynamicMediaSubscription: Subscription;
    private isDynamicMediaDataSubscription: Subscription;

    public menuType:any;
    public quizId:any;

    // Question page
    public questionId:any;
    public pageSetting:boolean = false;
    public anwserSetting:boolean = false;
    public selectedAnswerType: string;
    public answerStructureType: number = QuizAnswerStructureType.default;
    public answer_result_setting:boolean = false;
    @Input() quizData;
    public quizTypeID;
    public elements;
    public dynamic_media:boolean =false;
    public isMediaEnable:boolean = false;
    public isQuestionEnable:boolean = false;
    public isLoaderEnable: boolean = false;
    public questionElementReorder:any;
    public isMultiRating:boolean;

    // Content Page
    public contentId:any;
    public contentPageSetting:boolean = false;
    public isContentMediaEnable:boolean = false;
    public contentDynamicMedia:boolean = false;
    public contenttextImageDes:boolean = false;
    public contentElement:boolean = false;
    public getComponentData;
    public contentElementReorder:any;

    // cover page
    public isCoverMedia:boolean = false;
    public coverDynamicMedia:boolean = false;
    public coverElement:boolean = false;
    public coverElementReorder:any;

    //badge page
    public isBadgeMedia:boolean = false;
    public badgeElement:boolean = false;
    public badgeDynamicMedia:boolean = false;
    public badgeId;
    public badgeElementReorder:any = [
        {
            "titleName": "Title",
            "id": 1,
            "displayOrder": 1,
            "value": false,
            "key": "title"
        },
        {
            "titleName": "Media",
            "id": 2,
            "displayOrder": 2,
            "value": false,
            "key": "media"
        }
    ];

    public questionContentType;

    // result page
    public resultDynamicMedia:boolean = false;
    public resultElement:boolean = false;
    public isResultMedia:boolean = false;
    public resultNavigationSetting:boolean = false;
    public resultId;
    public resultElementReorder:any;

    public isQuesAndContentInSameTable:boolean;
    public dragulaSubscription;
    public isWhatsappEnable:boolean = false;
    private isWhatsappEnableSubscription: Subscription;
    public setFrameVideo;
    public multipleVideoFrame = false;
    public oldVideoFrame = '';
    public elementDisplayOrder = elementDisplayOrder;

    constructor(private dynamicMediaReplaceService:DynamicMediaReplaceMentsService,
        private router: Router,
        private route: ActivatedRoute,
        private dragulaService: DragulaService,
        private commonService:CommonService){
            dragulaService.setOptions('cover-element', {});
            dragulaService.setOptions('question-element', {});
            dragulaService.setOptions('content-element', {});
            dragulaService.setOptions('result-element', {});
            dragulaService.setOptions('badge-element', {});
           this.dragulaSubscription = dragulaService.dropModel.subscribe((value:any) => {
                this.onDropModel(value);
            });
    }

    private onDropModel(args:any) {
        if(args && args.length > 0 && args.includes('cover-element')){
           this.onCoverElementReorder();
        }else if(args && args.length > 0 && args.includes('question-element')){
            this.onQuestionElementReorder();
        }else if(args && args.length > 0 && args.includes('content-element')){
            this.onContentElementReorder();
        }else if(args && args.length > 0 && args.includes('result-element')){
            this.onResultElementReorder();
        }else if(args && args.length > 0 && args.includes('badge-element')){
            this.onBadgeElementReorder();
        }
    }

    private onCoverElementReorder(){
        this.coverElementReorder.map((ele,index) => {
            ele.displayOrder = index + 1;
        });
        this.dynamicMediaReplaceService.isCoverElementSetting = this.coverElementReorder;
        this.dynamicMediaReplaceService.changeCoverElementSettingSubmission();
    }

    private onQuestionElementReorder(){
        let index = 0;
        this.questionElementReorder.map(ele => {
            index = index + 1;
            ele.displayOrder = index;
            if(ele.id == 3){
                index = index + 1;
                ele.disMedia.displayOrder = index;
            }
        });
        this.dynamicMediaReplaceService.isElementSetting = {
            "questionId" : this.questionId,
            "elementData":this.questionElementReorder
        };
        this.dynamicMediaReplaceService.changeElementSettingSubmission();
    }

    private onContentElementReorder(){
        let index = 0;
        this.contentElementReorder.map(ele => {
            index = index + 1;
            ele.displayOrder = index;
            if(ele.id == 3){
                index = index + 1;
                ele.disMedia.displayOrder = index;
            }
        });
        this.dynamicMediaReplaceService.isContentElementSetting = {
            "contentId" : this.contentId,
            "elementData": this.contentElementReorder
        };
        this.dynamicMediaReplaceService.changeContentElementSettingSubmission();
    }
    
    onResultElementReorder(){
        this.resultElementReorder.map((ele,index) => {
            ele.displayOrder = index + 1;
        });
        this.dynamicMediaReplaceService.resultElementSetting = {
            "resultId": this.resultId,
            "elementData":this.resultElementReorder
        };
        this.dynamicMediaReplaceService.changeResultElementSettingSubmission();
    }

    onBadgeElementReorder(){
        this.badgeElementReorder.map((ele,index) => {
            ele.displayOrder = index + 1;
        });
        this.dynamicMediaReplaceService.isBadgeElementSetting = {
            "badgeId":this.badgeId,
            "elementData":this.badgeElementReorder
        };
        this.dynamicMediaReplaceService.changeBadgeElementSettingSubmission();
    }

    ngOnInit() {
        if(this.route.snapshot.data["quizData"]){
            this.quizData = this.route.snapshot.data["quizData"];
        }
        this.coverElementReorder = this.commonService.getElementReorderStrForEnablePage(true);
        this.resultElementReorder = this.commonService.getElementReorderStrForEnablePage(true);
        this.questionElementReorder = this.commonService.getElementReorderStrForEnablePage();
        this.questionElementReorder.push({
            "titleName": "Question",
            "id": elementDisplayOrder.question,
            "displayOrder": elementDisplayOrder.question,
            "value": false,
            "key": elementReorderKey.question
          });
        this.contentElementReorder = this.commonService.getElementReorderStrForEnablePage();
        this.quizTypeID = this.quizData.QuizTypeId;
        this.quizId = this.quizData.QuizId;
        this.isQuesAndContentInSameTable = this.quizData.IsQuesAndContentInSameTable;
        this.dynamicMediaReplaceService.setQuesAndContentInSameTable(this.isQuesAndContentInSameTable);
        this.getOpenDynamicMediaSetting();
        this.getDynamicMediaData();
        this.getWhatsappUsage();
    }

    getWhatsappUsage(){
       this.isWhatsappEnableSubscription = this.dynamicMediaReplaceService.isUsageTypeWhatsAppObservable.subscribe(res => {
        this.isWhatsappEnable = res;
        if(this.isWhatsappEnable){
            this.questionElementReorder = this.questionElementReorder.filter(element => !(element.id == elementDisplayOrder.title || element.id == elementDisplayOrder.button));
        }           
       });
    }

    getDynamicMediaData(){
        this.dynamicMediaReplaceService.isEnableMediaSetiingObjectObservable.subscribe(item=>{
           this.dynamicMediaData = item;
        });
    }

    getOpenDynamicMediaSetting(){
        this.isOpenDynamicMediaSubscription = this.dynamicMediaReplaceService.isOpenEnableMediaSetiingObservable.subscribe(data=>{
            this.closeTab();
            this.setFrameVideo = {};
            this.dynamic_media = false;
            this.resultDynamicMedia = false;
            this.badgeDynamicMedia = false;
            this.coverDynamicMedia = false;
            this.contentDynamicMedia = false;
            this.getComponentData = data;
            this.isSidebarOpen = data.isOpen;
            this.menuType = data.menuType;
            this.elements = data.elementEnable ? data.elementEnable : false;
            this.anwserSetting = data.answerEnable ? data.answerEnable : false;
            this.resultElement = data.elementEnable ? data.elementEnable : false;
            this.badgeElement =  data.elementEnable ? data.elementEnable : false;
            this.coverElement = data.elementEnable ? data.elementEnable : false;
            this.contentElement = data.elementEnable ? data.elementEnable : false;

            if((data.contentId || data.questionId) && data.page != this.oldVideoFrame){
                this.oldVideoFrame = data.page;
                this.multipleVideoFrame = false;
            }

            if(data.page){
                let dynamicMediaObject={
                    "page":data.page,
                    "data":data.data,
                    "isVideo":data.isVideo,
                    "autoPlayData":data.autoPlayData
                }
                this.dynamicMediaData = dynamicMediaObject;
            }

            if(data.page == enableItemPage.cover_page){
                this.getCoverSettingDetails(data);//cover page
            }else if(data.questionId){
                this.getQuestionSettingDetails(data);// question page
            }else if(data.contentId){
                this.getContentSettingDetails(data);//content page
            }else if(data.resultId){
                this.getResultSettingDetails(data);//result page
            }else if(data.badgeId){
                this.getBadgeSettingDetails(data);//badge page
            }
        });
    }

    getQuestionSettingDetails(data){
        this.questionId = data.questionId;
        this.selectedAnswerType = data.answerType;
        this.answerStructureType = data.answerStructureType;
        this.isMultiRating = data.isMultiRating;
        if(data.questionElement && data.questionElement.length > 0){
            if (data.mediaEnable) {
                this.isLoaderEnable = true;
                setTimeout(()=>{                    
                    this.isLoaderEnable = false;
                    this.dynamic_media = data.mediaEnable;
                }, 1000);
            }
            this.questionElementReorder.map(ele => {
                data.questionElement.map(coverEle => {
                    if(ele.key == coverEle.key){
                        ele.value = coverEle.value;
                        ele.displayOrder = coverEle.displayOrder;
                        if(ele.id == elementDisplayOrder.description){
                            ele.disMedia.value = coverEle.disMedia.value;
                            ele.disMedia.displayOrder = coverEle.disMedia.displayOrder;   
                        }
                        if(data.page == enableItemPage.question_page && ele.key == elementReorderKey.media){
                            this.isMediaEnable = coverEle.value;
                        }else if(data.page == enableItemPage.question_des_page && ele.id == elementDisplayOrder.description){
                            this.isMediaEnable = coverEle.value ? coverEle.disMedia.value : false;
                        }else{
                            this.isMediaEnable = true;
                        }
                        if(ele.key == elementReorderKey.question){
                            this.isQuestionEnable = coverEle.value;
                        }
                    }
                });
            });
            this.questionElementReorder.sort((a, b) => (a.displayOrder > b.displayOrder) ? 1 : -1)
            this.setFrameVideo = {
                'videoDuration' : data.setFrameVideo.videoDuration,
                'secondsToApply' : data.setFrameVideo.secondsToApply,
                'id': data.questionId,
                'page':data.page,
                'VideoFrameEnabled': data.setFrameVideo.videoFrameEnabled
            };
            setTimeout(() => {
                this.multipleVideoFrame = true;
            }, 100);
        }
    }

    getResultSettingDetails(data){
        this.resultId = data.resultId;
        if(data.resultElement && data.resultElement.length > 0){
            if (data.mediaEnable) {
                this.isLoaderEnable = true;
                setTimeout(()=>{                           
                    this.isLoaderEnable = false;
                    this.resultDynamicMedia = data.mediaEnable;
                }, 1000);
            }
            this.resultElementReorder.map(ele => {
                data.resultElement.map(coverEle => {
                    if(ele.key == coverEle.key){
                        ele.value = coverEle.value;
                        ele.displayOrder = coverEle.displayOrder;
                        if(ele.key == elementReorderKey.media){
                            this.isResultMedia = coverEle.value;
                        }
                    }
                });
            });
            this.resultElementReorder.sort((a, b) => (a.displayOrder > b.displayOrder) ? 1 : -1);
            this.setFrameVideo = {
                'videoDuration' : data.setFrameVideo.videoDuration,
                'secondsToApply' : data.setFrameVideo.secondsToApply,
                'id': data.resultId,
                'page':data.page,
                'VideoFrameEnabled': data.setFrameVideo.videoFrameEnabled};
        }
    }

    getBadgeSettingDetails(data){
        this.badgeId = data.badgeId;
        if(data.badgeElement && data.badgeElement.length > 0){
            if (data.mediaEnable) {
                this.isLoaderEnable = true;
                setTimeout(()=>{                         
                    this.isLoaderEnable = false;
                    this.badgeDynamicMedia = data.mediaEnable;
                }, 1000);
            }
            this.badgeElementReorder.map(ele => {
                data.badgeElement.map(coverEle => {
                    if(ele.key == coverEle.key){
                        ele.value = coverEle.value;
                        ele.displayOrder = coverEle.displayOrder;
                        if(ele.key == elementReorderKey.media){
                            this.isBadgeMedia = coverEle.value;
                        }
                    }
                });
            });
            this.badgeElementReorder.sort((a, b) => (a.displayOrder > b.displayOrder) ? 1 : -1);
            this.setFrameVideo = {
                'videoDuration' : data.setFrameVideo.videoDuration,
                'secondsToApply' : data.setFrameVideo.secondsToApply,
                'id': data.badgeId,
                'page':data.page,
                'VideoFrameEnabled': data.setFrameVideo.videoFrameEnabled
            };
        }
    }

    getCoverSettingDetails(data){
        if(data.coverElement && data.coverElement.length > 0){
            if (data.mediaEnable) {
                this.isLoaderEnable = true;
                setTimeout(()=>{
                    this.isLoaderEnable = false;
                    this.coverDynamicMedia = data.mediaEnable;
                }, 1000);
            }
            this.coverElementReorder.map(ele => {
                data.coverElement.map(coverEle => {
                    if(ele.key == coverEle.key){
                        ele.value = coverEle.value;
                        ele.displayOrder = coverEle.displayOrder;
                        if(ele.key == elementReorderKey.media){
                            this.isCoverMedia = coverEle.value;
                        }
                    }
                });
            });
            this.coverElementReorder.sort((a, b) => (a.displayOrder > b.displayOrder) ? 1 : -1);
            this.setFrameVideo = {
                'videoDuration' : data.setFrameVideo.videoDuration,
                'secondsToApply' : data.setFrameVideo.secondsToApply,
                'id':'',
                'page':data.page,
                'VideoFrameEnabled': data.setFrameVideo.videoFrameEnabled
            };
        }
    }

    getContentSettingDetails(data){
        this.contentId = data.contentId;
        if(data.contentElement && data.contentElement.length > 0){
            if (data.mediaEnable) {
                this.isLoaderEnable = true;
                setTimeout(()=>{
                    this.isLoaderEnable = false;
                    this.contentDynamicMedia = data.mediaEnable;
                }, 1000);
            }
            this.contentElementReorder.map(ele => {
                data.contentElement.map(coverEle => {
                    if(ele.key == coverEle.key){
                        ele.value = coverEle.value;
                        ele.displayOrder = coverEle.displayOrder;
                        if(ele.id == 3){
                            ele.disMedia.value = coverEle.disMedia.value;
                            ele.disMedia.displayOrder = coverEle.disMedia.displayOrder;   
                        }
                        if((data.page == enableItemPage.content_page || data.page == enableItemPage.content_title_page) && ele.key == elementReorderKey.media){
                            this.isContentMediaEnable = coverEle.value;
                        }else if(data.page == enableItemPage.content_des_page && ele.id == elementDisplayOrder.description){
                            this.isContentMediaEnable = coverEle.value ? coverEle.disMedia.value : false;
                        }
                    }
                });
            });
            this.contentElementReorder.sort((a, b) => (a.displayOrder > b.displayOrder) ? 1 : -1)
            this.setFrameVideo = {
                'videoDuration' : data.setFrameVideo.videoDuration,
                'secondsToApply' : data.setFrameVideo.secondsToApply,
                'id': data.contentId,
                'page':data.page,
                'VideoFrameEnabled': data.setFrameVideo.videoFrameEnabled
            };
            setTimeout(() => {
                this.multipleVideoFrame = true;
            }, 100);
        }
    }

    closeTab(){
        this.pageSetting = false;
        this.contentPageSetting = false;
        this.resultNavigationSetting = false;
        this.answer_result_setting = false;
    }

    closeSideBar(){
        this.dynamicMediaReplaceService.isOpenEnableMediaSetiing={
            "isOpen":false,
            "menuType":this.menuType
        };
        this.dynamicMediaReplaceService.changeOpenEnableMediaSetiingSubmission();
        this.isSidebarOpen=false;
    }

    onClickedEnable(res,mgs,menuType){
        let id;
        if(menuType == 2){
            id = this.questionId
        }else if(menuType == 4){
            id = this.badgeId
        }else if(menuType == 5){
            id = this.contentId
        }else if(menuType == 6){
            id = this.resultId
        }
        this.dynamicMediaReplaceService.isEnableMediaSetiingObject ={
            "page":res.page,
            "data":mgs == "enableMedia" ? !res.data : res.data,
            "isVideo":res.isVideo,
            "autoPlayData":mgs == "autoPlayVideo" ? !res.autoPlayData : res.autoPlayData,
            "id" : id
        }
        this.dynamicMediaReplaceService.changeEnableMediaSettingObjectSubmission();
    }

    // Question page
    onCollapseQuestionPage(text:any){
        if(text == 'pageSetting'){
            this.pageSetting = !this.pageSetting;
            this.anwserSetting = false;
            this.answer_result_setting = false;
            this.elements = false;
            this.dynamic_media = false;
        }else if(text == 'anwserSetting'){
            this.anwserSetting = !this.anwserSetting;
            this.pageSetting = false;
            this.answer_result_setting = false;
            this.elements = false;
            this.dynamic_media = false;
        }else if(text == 'answer_result_setting'){
            this.anwserSetting = false;
            this.pageSetting = false;
            this.answer_result_setting = !this.answer_result_setting;
            this.elements = false;
            this.dynamic_media = false;
        }
        else if(text == 'elements'){
            this.anwserSetting = false;
            this.pageSetting = false;
            this.answer_result_setting = false;
            this.elements = !this.elements;
            this.dynamic_media = false;
        }
        else if(text == 'dynamic_media'){
            this.dynamic_media = !this.dynamic_media;
            this.anwserSetting = false;
            this.pageSetting = false;
            this.answer_result_setting = false;
            this.elements = false;
        }
    }

    onSelectedAnswerType(data:any){
        this.selectedAnswerType = data;
    }

    onDynamicTemplateSetCorrectAnswer(){
        this.dynamicMediaReplaceService.isAnswerResultSetting = {
            "questionId" : this.questionId
        };
        this.dynamicMediaReplaceService.changeAnswerResultSettingSubmission();
    }

    onQuestionElement(data?,text?){
        this.questionElementReorder.map(ele => {
            if(text == 'descriptionMedia' && ele.id == data.id){
                ele.disMedia.value =  !data.disMedia.value;
                if(this.getComponentData.page == enableItemPage.question_des_page){
                    this.isMediaEnable =  ele.disMedia.value;
                    this.dynamicMediaData.data = this.isMediaEnable ? this.dynamicMediaData.data : false;
                }
            }else if(data.key == ele.key){
                ele.value = !data.value;
                if(data.key == elementReorderKey.media && this.getComponentData.page == enableItemPage.question_page){
                    this.isMediaEnable = ele.value;
                    this.dynamicMediaData.data = this.isMediaEnable ? this.dynamicMediaData.data : false;
                }
                if(data.key == elementReorderKey.question){
                    this.isQuestionEnable = ele.value;
                }
                if(this.getComponentData.page == enableItemPage.question_des_page && data.key == elementReorderKey.description){
                    this.isMediaEnable =  ele.value ? ele.disMedia.value :false;
                    this.dynamicMediaData.data = this.isMediaEnable ? this.dynamicMediaData.data : false;
                }
            }
        });
        this.dynamicMediaReplaceService.isElementSetting = {
            "questionId" : this.questionId,
            "elementData":this.questionElementReorder
        };
        this.dynamicMediaReplaceService.changeElementSettingSubmission();
    }

    // Content Page
    onCollapseContentPage(text:any){
        if(text == 'contentPage'){
            this.contentPageSetting = !this.contentPageSetting;
            this.contentDynamicMedia = false;
            this.contenttextImageDes = false;
            this.contentElement = false;
        }else if(text == 'dynamic_media'){
            this.contentPageSetting = false;
            this.contentDynamicMedia = !this.contentDynamicMedia;
            this.contenttextImageDes = false;
            this.contentElement = false;
        }else if(text == 'text-imageDes'){
            this.contenttextImageDes = !this.contenttextImageDes;
            this.contentPageSetting = false;
            this.contentDynamicMedia = false;
            this.contentElement = false;
        }else if(text == 'element'){
            this.contentElement = !this.contentElement;
            this.contentPageSetting = false;
            this.contentDynamicMedia = false;
            this.contenttextImageDes = false;
        }
    }

    onContentElement(data?,text?:any){
        this.contentElementReorder.map(ele => {
            if(text == 'descriptionMedia' && ele.id == data.id){
                ele.disMedia.value =  !data.disMedia.value;
                if(this.getComponentData.page == enableItemPage.content_des_page){
                    this.isContentMediaEnable =  ele.disMedia.value;
                    this.dynamicMediaData.data = this.isContentMediaEnable ? this.dynamicMediaData.data : false;
                }
            }else if(data.key == ele.key){
                ele.value = !data.value;
                if(data.key == elementReorderKey.media && this.getComponentData.page == enableItemPage.content_page){
                    this.isContentMediaEnable = ele.value;
                }
                if(this.getComponentData.page == enableItemPage.content_des_page && data.key == elementReorderKey.description){
                    this.isContentMediaEnable =  ele.value ? ele.disMedia.value :false;
                    this.dynamicMediaData.data = this.isContentMediaEnable ? this.dynamicMediaData.data : false;
                }
            }
        });
        
        this.dynamicMediaReplaceService.isContentElementSetting = {
            "contentId" : this.contentId,
            "elementData": this.contentElementReorder
        };
        this.dynamicMediaReplaceService.changeContentElementSettingSubmission();
    }

    // cover page 
    onCollapseCoverPage(text:any){
        if(text == 'element'){
            this.coverElement = !this.coverElement;
            this.coverDynamicMedia = false;
        }else if(text == 'dynamic_media'){
            this.coverElement = false;
            this.coverDynamicMedia = !this.coverDynamicMedia;
        }
    }

    onCoverElement(data?){
        this.coverElementReorder.map(ele => {
            if(data.key == ele.key){
                ele.value = !data.value;
                if(data.key == elementReorderKey.media){
                    this.isCoverMedia = ele.value;
                    this.dynamicMediaData.data = this.isCoverMedia ? this.dynamicMediaData.data : false;
                }
            }
        });
        this.dynamicMediaReplaceService.isCoverElementSetting = this.coverElementReorder;
        this.dynamicMediaReplaceService.changeCoverElementSettingSubmission();
    }

        // badge page 
    onCollapseBadgePage(text:any){
        if(text == 'element'){
            this.badgeElement = !this.badgeElement;
            this.badgeDynamicMedia = false;
        }else if(text == 'dynamic_media'){
            this.badgeElement = false;
            this.badgeDynamicMedia = !this.badgeDynamicMedia;
        }
    }

    onBadgeElement(data){
        this.badgeElementReorder.map(ele => {
            if(data.key == ele.key){
                ele.value = !data.value;
                if(data.key == 'media'){
                    this.isBadgeMedia = ele.value;
                    this.dynamicMediaData.data = this.isBadgeMedia ? this.dynamicMediaData.data : false;
                }
            }
        });
        this.dynamicMediaReplaceService.isBadgeElementSetting = {
            "badgeId":this.badgeId,
            "elementData":this.badgeElementReorder
        };
        this.dynamicMediaReplaceService.changeBadgeElementSettingSubmission();
    }

    // result

    onCollapseResultPage(text:any){
        if(text == 'element'){
            this.resultDynamicMedia = false;
            this.resultElement = !this.resultElement;
            this.resultNavigationSetting = false;
        }else if(text == 'dynamic_media'){
            this.resultDynamicMedia = !this.resultDynamicMedia;
            this.resultElement = false;
            this.resultNavigationSetting = false;
        }else if(text == 'navigation_result'){
            this.resultNavigationSetting = !this.resultNavigationSetting;
            this.resultDynamicMedia = false;
            this.resultElement = false;
        }
    }

    onResultElement(data){
        this.resultElementReorder.map(ele => {
            if(data.key == ele.key){
                ele.value = !data.value;
                if(data.key == elementReorderKey.media){
                    this.isResultMedia = ele.value;
                    this.dynamicMediaData.data = this.isResultMedia ? this.dynamicMediaData.data : false;
                }
            }
        });
        this.dynamicMediaReplaceService.resultElementSetting = {
            "resultId": this.resultId,
            "elementData":this.resultElementReorder
        };
        this.dynamicMediaReplaceService.changeResultElementSettingSubmission();
    }

    onResultSetting(){
        this.dynamicMediaReplaceService.resultSetting = {
            "resultId": this.resultId
        };
        this.dynamicMediaReplaceService.changeResultSettingSubmission();
    }

    editSetFrameVideo(data){
       if(data && Object.keys(data).length != 0)
       {
           if(data.check == 'forSecToapply'){
               this.setFrameVideo.secondsToApply = data.secToApply;
           }else{
               this.setFrameVideo.VideoFrameEnabled = data.videoFrameEnabled;
           }
       }
    }

    ngOnDestroy(){
        if(this.isOpenDynamicMediaSubscription){
            this.isOpenDynamicMediaSubscription.unsubscribe(); 
        }
        if(this.isDynamicMediaDataSubscription){
            this.isDynamicMediaDataSubscription.unsubscribe();
        }

        if(this.dragulaSubscription){
            this.dragulaSubscription.unsubscribe();
        }
        this.dragulaService.destroy('cover-element');
        this.dragulaService.destroy('question-element');
        this.dragulaService.destroy('content-element');
        this.dragulaService.destroy('result-element');
        this.dragulaService.destroy('badge-element');
        if(this.isWhatsappEnableSubscription){
            this.isWhatsappEnableSubscription.unsubscribe();
        }
    }
}