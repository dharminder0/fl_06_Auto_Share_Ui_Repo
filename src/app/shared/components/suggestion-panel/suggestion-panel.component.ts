import { Component,Input, Output, EventEmitter } from '@angular/core';
import { QuizBuilderApiService } from '../../../quiz-builder/quiz-builder-api.service';
import { UserInfoService } from '../../services/security.service';
import { ShareConfigService } from '../../services/shareConfig.service';
import { suggestionEnum } from './suggestion-enum/suggestionEnum';
import { EmailSmsSubjectService } from '../../../quiz-builder/email-sms/email-sms-subject.service';
import { SharedService } from '../../services/shared.service';
import { Subscription } from 'rxjs';
import { checkString } from '@amcharts/amcharts4/core';

@Component({
  selector: 'app-suggestion-panel',
  templateUrl: './suggestion-panel.component.html',
  styleUrls: ['./suggestion-panel.component.scss']
})

export class SuggestionPanelComponent {

  @Input() isCompanyWise:any;
  @Input() selectedOffice:any;
  @Input() connectedOffice: any;
  @Input() suggestionType:any;
  @Input() status:any;
  @Input() notificationType:any;
  @Input() templateId:any;
  @Output() linkedUnlinked = new EventEmitter<string>();
  @Input() reportOfficeIds:any;
  @Input() reportName:any;
  @Input() reportId:any;

  private quizTagsReadyToFilterSubscription: Subscription
  showSuggestionDrpDwn:boolean = false;
  areSuggestionsAvailable:any = [];
  public suggestionDataAvailable:any = [];
  public hoverOnFilterHolder: boolean = false;
  public snippet:string = "";
  private responceObject:any = {};
  suggestionDataAvailableTemp : any = {};
  appliedFilters: any = [];
  public suggetionFilters: any;
  //public isShare:boolean=false;
  public isHideFilter:boolean=false;
  public isOptionFilter:boolean=false;
  public isFullFilterList:boolean=false;
  public officeId: string = '';
  public userInfo: any = {};
  public timeoutToFetchUser: any = null;
  public companyCode: any;
  public usageType: any = '';

  public predefineUsageSuggestion: any = {};

  constructor(
    private quizBuilderApiService: QuizBuilderApiService,
    private userInfoService:UserInfoService,
    private shareConfigService: ShareConfigService,
    private emailSmsSubjectService: EmailSmsSubjectService,
    private sharedService: SharedService
  ){}

  ngOnInit() {
    // get user info
    this.userInfo = this.userInfoService._info;
    this.companyCode = this.sharedService.getCookie("clientCode");
    if(this.suggestionType == 3){
      this.suggestionDataAvailable = this.shareConfigService.suggestionOptionsForAutomationReport;
      this.suggetionFilters= this.shareConfigService.suggetionFiltersAutomationReport;
    }else{
      this.suggestionDataAvailable = JSON.parse(JSON.stringify(this.shareConfigService.suggestionOptionsForAutomation));
      this.suggetionFilters= this.shareConfigService.suggetionFilters;
    }
    this.emailSmsSubjectService.currentSearchSection.subscribe((res)=>{
      if(res){
        //this.appliedFilters = [];
        //this.snippet = '';
        this.areSuggestionsAvailable = [];
      }
    });

    this.quizTagsReadyToFilterSubscription = this.shareConfigService.quizTagsReadyToFilterObservable
      .subscribe((item: any) => {
        if (item.TagId) {
          this.applyFilterBasedOnSuggestion('Tag',this.shareConfigService.quizTagsReadyToFilter);
        }
    });

    if(this.suggestionType == 3){
      let search = {
        "QuizId":this.reportId,
        "QuizTitle":this.reportName
      }
      this.applyFilterBasedOnSuggestion('Automations',search);
    }
  }

  getSuggestions(userSnip:any){
    if(!userSnip){
      this.areSuggestionsAvailable = [];
      return false;
    }
    this.suggestionForAutomationData(userSnip);
  }

  suggestionForAutomationData(userSnip:any){
    
    clearTimeout(this.timeoutToFetchUser);
    this.timeoutToFetchUser = setTimeout (() => {
      if(this.suggestionType == suggestionEnum.Explore){
        this.suggestionForExploreAll(userSnip);
      }
      else if(this.suggestionType == suggestionEnum.LikedUnlinked){
        this.suggestionForLinkedUnLinkedAutomation(userSnip);
      }else if(this.suggestionType == suggestionEnum.AutomationReport){
        this.suggestionForAutomationReport(userSnip);
      }
    }, 500);
  }

  suggestionForAutomationReport(userSnip:any){
    let officeIds = this.isCompanyWise == 'true' ? '' : this.reportOfficeIds;
    this.quizBuilderApiService.getSearchAndSuggestion(
      officeIds,
      this.isCompanyWise,
      userSnip
    ).subscribe(response => {
      this.getSuggestionList(response);
    });
  }

  suggestionForExploreAll(userSnip:any){
    if(!this.isCompanyWise){
      if (this.selectedOffice.officeId) {
        this.officeId = this.selectedOffice.officeId;
      }
      else{
        this.officeId = this.connectedOffice.join();
      }
    }
    else{
      this.officeId = '';
    }

    this.quizBuilderApiService.getSearchAndSuggestion(
      // this.userInfo.BusinessUserId,
      // this.userInfo.UserName,
      this.officeId,
      this.isCompanyWise,
      userSnip,
      this.usageType
    ).subscribe(response => {
      this.getSuggestionList(response);
    });
  }

  suggestionForLinkedUnLinkedAutomation(userSnip:any){
    let officeList: string = "";
    let usageType = 1;
    if (!this.emailSmsSubjectService.getShared()) {
      if (this.quizBuilderApiService.getOffice()) {
        officeList = this.quizBuilderApiService.getOffice();
      }
      else{
        officeList = "";
      }
    }
    if(this.status == 3){
      this.templateId="";
    }
    this.quizBuilderApiService.GetSearchAndSuggestionByNotificationTemplate(
      this.status,
      this.notificationType,
      this.emailSmsSubjectService.getShared(),
      this.userInfo.OffsetValue,
      // this.userInfo.UserName,
      officeList,
      this.templateId,
      userSnip,
      this.companyCode,
      usageType
      
      
    ).subscribe(response => {
      this.getSuggestionList(response);
    });
  }

  getSuggestionList(response){
    this.responceObject = response;
    if(this.suggestionType == suggestionEnum.Explore){
      this.responceObject = {...this.responceObject, ...this.predefineUsageSuggestion };
    }
    for (let currObj in this.responceObject) {
      this.suggestionDataAvailableTemp[currObj] = new Array<any>();
      this.suggestionDataAvailableTemp[currObj] = this.responceObject[currObj];
    }

    this.suggestionDataAvailable = this.suggestionDataAvailable.filter((currObj: any, index: any) => {
      if (this.suggestionDataAvailableTemp[currObj.code] && this.suggestionDataAvailableTemp[currObj.code].length > 0) {
        currObj.suggestions = [];  
        currObj.suggestions = this.suggestionDataAvailableTemp[currObj.code];
        if(!this.areSuggestionsAvailable.includes(currObj.code)){
          this.areSuggestionsAvailable.push(currObj.code);
        }
        return currObj;
      }
      else{
        currObj.suggestions = [];
        if(this.areSuggestionsAvailable.includes(currObj.code)){
          this.areSuggestionsAvailable.splice(this.areSuggestionsAvailable.indexOf(currObj.code), 1);
        }
        return currObj;
      }
    });
  }

    // apply Filter Based On Suggestion
  applyFilterBasedOnSuggestion(filterCode: string, searchValue: any){
    let searchValueToSend:string = "";
    let searchTextToSend:string = "";
    if(filterCode.toLowerCase() === "automations"){
      searchValueToSend = searchValue.QuizId;
      searchTextToSend = searchValue.QuizTitle;
    }
    else if(filterCode.toLowerCase() === "automationtypes"){
      searchValueToSend = searchValue.AutomationTypeId;
      searchTextToSend = searchValue.AutomationTypeName;
    }
    else if(filterCode.toLowerCase() === "tag"){
      searchValueToSend = searchValue.TagId;
      searchTextToSend = searchValue.TagName;
    }
    else if(filterCode.toLowerCase() === "office"){
      searchValueToSend = searchValue.officeId;
      searchTextToSend = searchValue.officeTitle;
    }
    else if(filterCode.toLowerCase() === "date"){
      searchValueToSend = searchValue.dateId;
      searchTextToSend = searchValue.dateTitle;
    }
    else if(filterCode.toLowerCase() === "usage"){
      this.usageType = searchValue.UsageId;
      searchValueToSend = searchValue.UsageId;
      searchTextToSend = searchValue.UsageTitle;
    }
    else{
      searchValueToSend = searchValue;
      searchTextToSend = searchValue;
    }
    this.allValueForSuggetionFilter(filterCode, searchValueToSend, searchTextToSend, 'contain');
    this.areSuggestionsAvailable = [];
    this.snippet = '';
  }

  allValueForSuggetionFilter(filterCode: string, searchValue: string, searchText:string, filterOperator: string) {
    let tempObj: any = {};
    for (let currObj of this.suggetionFilters) {
      if (currObj.searchName.toLowerCase() === filterCode.toLowerCase()) {
        tempObj = {};
        tempObj = Object.assign({}, currObj);
        tempObj.searchValue = searchValue;
        tempObj.textToDisplay = searchText;
        tempObj.filterCode = filterCode;

        if(currObj.type.toLowerCase() == "multi"){
          let isExistingValue: boolean = true;
          this.appliedFilters.map(function (item:any) {
            if (item.filterCode.toString() == filterCode.toString()) {
              if(!item.searchValue.toString().includes(tempObj.searchValue)){
                item.searchValue += ',' + tempObj.searchValue;
                item.textToDisplay += ', ' + tempObj.textToDisplay;
              }
              tempObj = item;
              isExistingValue = false;
            }
          });

          if(isExistingValue){
            this.appliedFilters = this.appliedFilters.filter((currObj:any) => {
              if (currObj.filterCode.toString() !== filterCode.toString()) {
                return currObj;
              }
            });
            this.appliedFilters.push(tempObj);
          }
          
        }
        else if(currObj.type.toLowerCase() == "single"){
          this.appliedFilters = this.appliedFilters.filter((currObj:any) => {
            if (currObj.filterCode.toString() !== filterCode.toString()) {
              return currObj;
            }
          });
          this.appliedFilters.push(tempObj);
        }
      }
    }

    // call For Automation Suggestion Filtered Data
    if(this.suggestionType == suggestionEnum.Explore){
      if(!this.shareConfigService.automationSuggestionFilteredData.viewData){
        this.shareConfigService.automationSuggestionFilteredData.viewData = [];
      }
      this.shareConfigService.automationSuggestionFilteredData.viewFor = tempObj.filterCode;
      this.shareConfigService.automationSuggestionFilteredData.viewData = this.shareConfigService.automationSuggestionFilteredData.viewData.filter((currObj: any, index: any) => {
        if (currObj.filterCode.toString() !== tempObj.filterCode.toString()) {
          return currObj;
        }
      });
      this.shareConfigService.automationSuggestionFilteredData.viewData.push(tempObj);
      this.shareConfigService.changeAutomationSuggestionFilteredData();
      //reset filter after filter applyed.
      this.suggestionDataAvailable = JSON.parse(JSON.stringify(this.shareConfigService.suggestionOptionsForAutomation));
    }

    // call For email templete Suggestion Filtered Data
    if(this.suggestionType == suggestionEnum.LikedUnlinked){
      if(!this.shareConfigService.emailTempleteSuggestionFilteredData.viewData){
        this.shareConfigService.emailTempleteSuggestionFilteredData.viewData = [];
      }
      this.shareConfigService.emailTempleteSuggestionFilteredData.viewFor = tempObj.filterCode;
      this.shareConfigService.emailTempleteSuggestionFilteredData.viewData = this.shareConfigService.emailTempleteSuggestionFilteredData.viewData.filter((currObj: any, index: any) => {
        if (currObj.filterCode.toString() !== tempObj.filterCode.toString()) {
          return currObj;
        }
      });
      this.shareConfigService.emailTempleteSuggestionFilteredData.viewData.push(tempObj);
      this.shareConfigService.changeEmailTempleteSuggestionFilteredData();


      //this.linkedUnlinked.emit(this.appliedFilters)
      // if(this.appliedFilters.length == 3){
      //   this.isOptionFilter=true;
      //   this.isFullFilterList=false;
      // }
    }

    // call For Automation Report Suggestion Filtered Data
    if(this.suggestionType == suggestionEnum.AutomationReport){
      if(!this.shareConfigService.automationReportSuggestionFilteredData.viewData){
        this.shareConfigService.automationReportSuggestionFilteredData.viewData = [];
      }
      this.shareConfigService.automationReportSuggestionFilteredData.viewFor = tempObj.filterCode;
      this.shareConfigService.automationReportSuggestionFilteredData.viewData = this.shareConfigService.automationReportSuggestionFilteredData.viewData.filter((currObj: any, index: any) => {
        if (currObj.filterCode.toString() !== tempObj.filterCode.toString()) {
          return currObj;
        }
      });
      this.shareConfigService.automationReportSuggestionFilteredData.viewData.push(tempObj);
      this.shareConfigService.changeAutomationReportSuggestionFilteredData();
    }

  }

  removeFilter(removeFilteredFor:any){
    this.appliedFilters.splice(this.appliedFilters.indexOf(removeFilteredFor), 1);
    // remove For Automation Suggestion Filtered Data

    // call For Automation Suggestion Filtered Data
    if(this.suggestionType == suggestionEnum.Explore){
      //remove usage type predefine filter
      if(removeFilteredFor.filterCode == "Usage"){
        this.usageType = '';
      }
      this.shareConfigService.automationSuggestionFilteredData.viewFor = removeFilteredFor.filterCode;
      this.shareConfigService.automationSuggestionFilteredData.viewData.splice(this.shareConfigService.automationSuggestionFilteredData.viewData.indexOf(removeFilteredFor), 1);
      this.shareConfigService.changeAutomationSuggestionFilteredData();
    }

    if(this.suggestionType == suggestionEnum.LikedUnlinked){
      this.shareConfigService.emailTempleteSuggestionFilteredData.viewFor = removeFilteredFor.filterCode;
      this.shareConfigService.emailTempleteSuggestionFilteredData.viewData.splice(this.shareConfigService.emailTempleteSuggestionFilteredData.viewData.indexOf(removeFilteredFor), 1);
      this.shareConfigService.changeEmailTempleteSuggestionFilteredData();
      
      if(this.appliedFilters && this.appliedFilters.length < 2){
        this.isFullFilterList = false;
      }
    }

    // call For Automation report Suggestion Filtered Data
    if(this.suggestionType == suggestionEnum.AutomationReport){
      this.shareConfigService.automationReportSuggestionFilteredData.viewFor = removeFilteredFor.filterCode;
      this.shareConfigService.automationReportSuggestionFilteredData.viewData.splice(this.shareConfigService.automationReportSuggestionFilteredData.viewData.indexOf(removeFilteredFor), 1);
      this.shareConfigService.changeAutomationReportSuggestionFilteredData();
    }

  }

  showSelectedFilter(isFullFilterList){
    this.isFullFilterList = isFullFilterList;
  }

  setPredefineFilter(){
    if(this.suggestionType == suggestionEnum.Explore){
      // set predefine usage filter
      if(!this.snippet){
        this.suggestionDataAvailable = JSON.parse(JSON.stringify(this.shareConfigService.suggestionOptionsForAutomation));
      }
      this.predefineUsageSuggestion = this.shareConfigService.predefineUsageSuggestion;
      this.suggestionDataAvailable.map(item=>{
        if(item.code == 'Usage'){
          item.suggestions = this.predefineUsageSuggestion[item.code];
          this.areSuggestionsAvailable.push(item.code);
        }
      })
    }
  }
}