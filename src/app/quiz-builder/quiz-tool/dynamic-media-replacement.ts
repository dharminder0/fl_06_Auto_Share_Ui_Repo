import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DynamicMediaReplaceMentsService {

    public isOpenEnableMediaSetiing: any = {};
    public isOpenEnableMediaSetiingObservable = new BehaviorSubject(this.isOpenEnableMediaSetiing);

    changeOpenEnableMediaSetiingSubmission() {
        this.isOpenEnableMediaSetiingObservable.next(this.isOpenEnableMediaSetiing);
    }

    public isEnableMediaSetiingObject: any = {};
    public isEnableMediaSetiingObjectObservable = new BehaviorSubject(this.isEnableMediaSetiingObject);

    changeEnableMediaSettingObjectSubmission() {
        this.isEnableMediaSetiingObjectObservable.next(this.isEnableMediaSetiingObject);
    }

    public isAnswerType: any = {};
    public isAnswerTypeObservable = new BehaviorSubject(this.isAnswerType);

    changeAnswerSubmission() {
        this.isAnswerTypeObservable.next(this.isAnswerType);
    }

    public isAnswerTextImage: any = {};
    public isAnswerTextImageObservable = new BehaviorSubject(this.isAnswerTextImage);

    changeAnswerTextImageSubmission() {
        this.isAnswerTextImageObservable.next(this.isAnswerTextImage);
    }

    public isAnswerResultSetting: any = {};
    public isAnswerResultSettingObservable = new BehaviorSubject(this.isAnswerResultSetting);

    changeAnswerResultSettingSubmission() {
        this.isAnswerResultSettingObservable.next(this.isAnswerResultSetting);
    }

    public isElementSetting: any = {};
    public isElementSettingObservable = new BehaviorSubject(this.isElementSetting);

    changeElementSettingSubmission() {
        this.isElementSettingObservable.next(this.isElementSetting);
    }

    // content page
    public isContentElementSetting: any = {};
    public isContentElementSettingObservable = new BehaviorSubject(this.isContentElementSetting);

    changeContentElementSettingSubmission() {
        this.isContentElementSettingObservable.next(this.isContentElementSetting);
    }

    // cover page
    public isCoverElementSetting: any = [];
    public isCoverElementSettingObservable = new BehaviorSubject(this.isCoverElementSetting);

    changeCoverElementSettingSubmission() {
        this.isCoverElementSettingObservable.next(this.isCoverElementSetting);
    }

    // badges page
    public isBadgeElementSetting: any = {};
    public isBadgeElementSettingObservable = new BehaviorSubject(this.isBadgeElementSetting);

    changeBadgeElementSettingSubmission() {
        this.isBadgeElementSettingObservable.next(this.isBadgeElementSetting);
    }

    //content and question transfer
    public IsQuesAndContentInSameTable;
    setQuesAndContentInSameTable(text){
      this.IsQuesAndContentInSameTable = text;
    }

    //result page

    public resultElementSetting: any = {};
    public resultElementSettingObservable = new BehaviorSubject(this.resultElementSetting);

    changeResultElementSettingSubmission() {
        this.resultElementSettingObservable.next(this.resultElementSetting);
    }

    public resultSetting: any = {};
    public resultSettingObservable = new BehaviorSubject(this.resultSetting);

    changeResultSettingSubmission() {
        this.resultSettingObservable.next(this.resultSetting);
    }

    //selected question and content

    public isSelectedQuesAndContent: any = {};
    public isSelectedQuesAndContentObservable = new BehaviorSubject(this.isSelectedQuesAndContent);

    changeSelectedQuesAndContentSubmission() {
        this.isSelectedQuesAndContentObservable.next(this.isSelectedQuesAndContent);
    }

    //next button disable in whatsapp

    public isUsageTypeWhatsApp: boolean = false;
    public isUsageTypeWhatsAppObservable = new BehaviorSubject(this.isUsageTypeWhatsApp);

    changeUsageTypeWhatsAppSubmission() {
        this.isUsageTypeWhatsAppObservable.next(this.isUsageTypeWhatsApp);
    }

    public videoTimeChange:any = {};
    public videoTimeChangeObservable = new BehaviorSubject(this.videoTimeChange);

    changeVideoTimeChange() {
        this.videoTimeChangeObservable.next(this.videoTimeChange);
    }

    public isEnableSetFrameToggle:any = {};
    public isEnableSetFrameToggleObservable = new BehaviorSubject(this.isEnableSetFrameToggle);

    setFrameEnableChange() {
        this.isEnableSetFrameToggleObservable.next(this.isEnableSetFrameToggle);
    }

}