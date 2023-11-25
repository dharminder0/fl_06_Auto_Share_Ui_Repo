import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ShareConfigService {
  
    public suggestionOptionsForAutomation:any = [
        {
          "title":"Usage",
          "code":"Usage",
          "icon":"assets/layouts/img/scratch-icon.png",
          "suggestions": new Array<any>()
        },
        {
          "title":"Automation",
          "code":"Automations",
          "icon":"assets/layouts/img/automation-setting.png",
          "suggestions": new Array<any>()
        },
        {
            "title":"Automation type",
            "code":"AutomationTypes",
            "icon":"assets/layouts/img/automation-type.png",
            "suggestions": new Array<any>()
        },
        {
            "title":"Tags",
            "code":"Tag",
            "icon":"assets/layouts/img/automation-tag.png",
            "suggestions": new Array<any>()
        },
        {
            "title":"Offices",
            "code":"Office",
            "icon":"assets/layouts/img/automation-office.png",
            "suggestions": new Array<any>()
        },
        {
          "title":"Date",
          "code":"Date",
          "icon":"assets/layouts/img/automation-calendar.png",
          "suggestions": new Array<any>()
        }        
    ];

    public suggetionFilters: any = [
        {
          "filterTitle": "Automation",
          "searchName": "Automations",
          "searchValue": "",
          "type": "single",
          "searchOperator": "contain"
        },
        {
          "filterTitle": "Automation type",
          "searchName": "AutomationTypes",
          "searchValue": "",
          "type": "single",
          "searchOperator": "contain"
        },
        {
            "filterTitle": "Tags",
            "searchName": "Tag",
            "searchValue": "",
            "type": "single",
            "searchOperator": "contain"
        },
        {
            "filterTitle": "Offices",
            "searchName": "Office",
            "searchValue": "",
            "type": "single",
            "searchOperator": "contain"
        },
        {
            "filterTitle": "Date",
            "searchName": "Date",
            "searchValue": "",
            "type": "single",
            "searchOperator": "contain"
        },
        {
            "filterTitle": "Usage",
            "searchName": "Usage",
            "searchValue": "",
            "type": "single",
            "searchOperator": "contain"
        },
        {
          "filterTitle": "Quick Search",
          "searchName": "qSearch",
          "searchValue": "",
          "type": "single",
          "searchOperator": "contain"
        }
    ];


    public suggestionOptionsForAutomationReport:any = [
      {
        "title":"Automation",
        "code":"Automations",
        "icon":"assets/layouts/img/automation-setting.png",
        "suggestions": new Array<any>()
      }
  ];
  public suggetionFiltersAutomationReport: any = [
      {
        "filterTitle": "Automation",
        "searchName": "Automations",
        "searchValue": "",
        "type": "single",
        "searchOperator": "contain"
      },
      {
        "filterTitle": "Quick Search",
        "searchName": "qSearch",
        "searchValue": "",
        "type": "single",
        "searchOperator": "contain"
      }
  ];

  public predefineUsageSuggestion: any = {
    "Usage": [
      {
        "UsageId":1,
        "UsageTitle":"Web flow"
      },
      {
        "UsageId":3,
        "UsageTitle":"WhatsApp chatbot"
      }
    ]
  }

  public automationSuggestionFilteredData: any = {};
  public automationSuggestionFilteredDataObservable = new BehaviorSubject(this.automationSuggestionFilteredData);
  public emailTempleteSuggestionFilteredData: any = {};
  public emailTempleteSuggestionFilteredDataObservable = new BehaviorSubject(this.emailTempleteSuggestionFilteredData);
  public quizTagsReadyToFilter: any = {};
  public quizTagsReadyToFilterObservable = new BehaviorSubject(this.quizTagsReadyToFilter);

  public automationReportSuggestionFilteredData: any = {};
  public automationReportSuggestionFilteredDataObservable = new BehaviorSubject(this.automationReportSuggestionFilteredData);

  changeAutomationSuggestionFilteredData(){
    this.automationSuggestionFilteredDataObservable.next(this.automationSuggestionFilteredData);
  }
  
  changeEmailTempleteSuggestionFilteredData(){
    this.emailTempleteSuggestionFilteredDataObservable.next(this.emailTempleteSuggestionFilteredData);
  }

  changeQuizTagsReadyToFilter(){
    this.quizTagsReadyToFilterObservable.next(this.quizTagsReadyToFilter);
  }
 
  changeAutomationReportSuggestionFilteredData(){
    this.automationReportSuggestionFilteredDataObservable.next(this.automationReportSuggestionFilteredData);
  }

  getPageDomain(){
    let fileDomain: string = "";
    if (window.location.origin && window.location.origin != "") {
      fileDomain = (new URL(window.location.origin)).hostname.split('.').slice(-2).join('.');
    }
    return fileDomain;
  }

  getCookieExpiresDate(){
    var expirationTime = 24 * 30 * 24 * 60 * 60 * 1000; // For 2 years
    var date = new Date();
    var dateTimeNow = date.getTime();
    date.setTime(dateTimeNow + expirationTime);
    return date.toUTCString();
  }

  setCookie(cName:string, cVal:string){
    document.cookie = `jr_${cName}=${cVal};expires=${this.getCookieExpiresDate()};path=/;domain=${this.getPageDomain()};`
  }


}