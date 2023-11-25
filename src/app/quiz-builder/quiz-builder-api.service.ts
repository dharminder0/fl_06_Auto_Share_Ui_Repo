import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/concatMap'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mergeAll'


// import { HttpInterceptorService } from "../shared/services/http.interceptor.service";
import { UserInfoService } from "../shared/services/security.service";
import { Observable } from "rxjs/Observable";
import { QuizBuilderDataService } from "./quiz-builder-data.service";
import { mergeMap } from 'rxjs/operators';
import { Config } from '../../config';
import { SharedService } from '../shared/services/shared.service';
import { data, map } from "jquery";
import { of } from 'rxjs';



@Injectable()
export class QuizBuilderApiService {
  private config: Config;
  public quizTypeID;
  public options: any;
  OffsetValue;
  public automationType = [2, 3,4];
  public officeId = null;
  public officeIds = null;
  setOffice(officeId) {
    this.officeId = officeId;
    localStorage.setItem("officeId", officeId);
  }
  getOffice() {
    this.officeId = localStorage.getItem("officeId");
    return this.officeId;
  }

  setOfficeIds(officeIds) {
    this.officeIds = officeIds;
    localStorage.setItem("officeIds", officeIds);
  }
  getOfficeIds() {
    this.officeIds = localStorage.getItem("officeIds");
    return this.officeIds;
  }

  constructor(
    private http: HttpClient,
    private userInfoService: UserInfoService,
    private quizBuilderDataService: QuizBuilderDataService,
    private sharedService: SharedService
  ) {
    // const headers = new Headers();
    // headers.append("Content-Type", "application/json");
    // this.options = new RequestOptions({ headers: headers });
    this.config = new Config();
    this.OffsetValue = this.userInfoService.get().OffsetValue;
  }

  /**
   *
   * @param officeId : Fectch data according to the id
   */
  getQuizList(
    officeId,
    sharedMe,
    OffsetValue,
    automationTypeId
  ) {
    return this.http
      .post(
        "v1/Quiz/GetList?OfficeIdList=" +
        // BusinessUserID +
        // "&BusinessUserEmail=" +
        // BusinessUserEmail +
        // "&OfficeIdList=" +
        officeId +
        "&IncludeSharedWithMe=" +
        sharedMe +
        "&OffsetValue=" +
        OffsetValue +
        "&QuizTypeId=" +
        automationTypeId ,
        // "&IsDashboard=" +
        // isDashboard, 
        {})
      .map(response => {
        return response["data"];
      });
  }

  getAutomationList(data:any) {
    return this.http
      .post(
        "v1/Quiz/GetList?IncludeSharedWithMe=" +
        // data.BusinessUserID +
        // "&BusinessUserEmail=" +
        // data.BusinessUserEmail +
        // "&IncludeSharedWithMe=" +
        data.IncludeSharedWithMe +
        "&OffsetValue=" +
        data.OffsetValue +
        "&QuizTag=" +
        data.QuizTag +
        "&SearchTxt=" +
        data.SearchTxt +
        "&QuizTypeId=" +
        data.QuizTypeId+
        // "&IsDashboard=" +
        // data.IsDashboard+
        "&OfficeIdList=" +
        data.OfficeIdList+
        "&QuizId=" +
        data.QuizId+
        "&QuizTagId=" +
        data.QuizTagId+
        "&IsFavorite=" +
        data.IsFavorite+
        "&CompanyCode=" +
        data.CompanyCode, {})
      .map(response => {
        return response["data"];
      });
  }

  getAutomationListVersion3(data:any) {
    return this.http
      .post(
        "v3/Quiz/GetList?IncludeSharedWithMe=" +
        data.IncludeSharedWithMe +
        "&PageNo="+
        data.PageNo +
        "&PageSize="+
        data.PageSize +
        "&OffsetValue=" +
        data.OffsetValue +
        "&QuizTag=" +
        data.QuizTag +
        "&SearchTxt=" +
        data.SearchTxt +
        "&QuizTypeId=" +
        data.QuizTypeId+
        "&OfficeIdList=" +
        data.OfficeIdList+
        "&QuizId=" +
        data.QuizId+
        "&QuizTagId=" +
        data.QuizTagId+
        "&IsFavorite=" +
        data.IsFavorite+
        "&IsPublished="+
        data.IsPublished +
        "&UsageType="+
        data.UsageType +
        "&CompanyCode=" +
        data.CompanyCode, {})
      .map(response => {
        return response["data"];
      });
  }

  getAutomationReportList(body){
    return this.http.post("v3/Quiz/AutomationReportList", body).map(response => {
      return response["data"];
    });
  }

  getSearchAndSuggestion(
    // BusinessUserID,
    // BusinessUserEmail,
    officeId,
    sharedMe,
    SearchText,
    usageType?:any
  ) {
    let url = "v1/Integration/GetSearchAndSuggestion?OfficeIdList=" +
                // BusinessUserID +
                // "&BusinessUserEmail=" +
                // BusinessUserEmail +
                // "&OfficeIdList=" +
                officeId +
                "&IncludeSharedWithMe=" +
                sharedMe +
                "&SearchTxt=" +
                SearchText;
    if(usageType){
      url+=`&UsageType=${usageType}`;
    }
    return this.http
      .post(url, {})
      .map(response => {
        return response["data"];
      });
  }

  GetSearchAndSuggestionByNotificationTemplate(
    Status:any,
    NotificationType:any,
    IncludeSharedWithMe:boolean,
    OffsetValue:any,
    // BusinessUserEmail:string,
    OfficeId:string,
    NotificationTemplateId:any,
    SearchTxt:string,
    CompanyCode:string,
    usageType?:any
    ) {
    let url = "v1/NotificationTemplate/GetSearchAndSuggestionByNotificationTemplate?Status=" + 
              Status +
              "&NotificationType=" +
              NotificationType +
              "&IncludeSharedWithMe=" +
              IncludeSharedWithMe +
              "&OffsetValue=" +
              OffsetValue +
              // "&BusinessUserEmail=" +
              // BusinessUserEmail +
              "&OfficeId=" +
              OfficeId +
              "&NotificationTemplateId=" +
              NotificationTemplateId +
              "&SearchTxt=" +
              SearchTxt +
              "&CompanyCode=" +
              CompanyCode;
    if(usageType){
      url+=`&UsageType=${usageType}`;
    }
    return this.http
      .get(url)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to Add Quiz
   * @param body : Body
   */
  createNewQuiz(body) {
    return this.http.post("v1/Quiz/CreateQuiz", body).map(response => {
      return response["data"];
    });
  }

  //get multiple Result Values for Personality Type
  getPersonalityResultSettings(id)
  {
    return this.http.get("v1/Quiz/GetPersonalityResultSetting?QuizId="+id).map(response =>
      {
        return response["data"];
      });
  }

  updatePersonalittyResultSettings(body)
  {
    return this.http.post("v1/Quiz/UpdatePersonalityResultSetting", body).map(response => {
      return response["data"];
    });
  }

  updatePersonalityMaxResult(max,quizId,showLead)
  {
    return this.http.post("v1/Quiz/UpdatePersonalityMaxResult?quizId="+quizId+"&maxResult="+max+"&ShowLeadUserForm="+showLead,{}).map(response => {
      return response["data"];
    });
  }

  updateResultCorrelation(data)
  {
    return this.http.post("v1/Quiz/UpdateResultCorrelation", data).map(response => {
      return response["data"];
    });
  }

  getResultCorrelation(qId)
  {
    return this.http.get("v1/Quiz/GetResultCorrelation?questionId="+qId).map(response =>
      {
        return response["data"];
      });
  }
  
  updatePersonalityResultStatus(qId,status)
  {
    return this.http.post("v1/Quiz/UpdatePersonalityResultStatus?QuizId="+qId+"&status="+status,{})
    .map(response => {
      return response["data"];
    });
  }
  /**
   * Function to get previous button setting
   */
  getPreviousButtonSetting(id) {
    return this.http
      .get("v1/Quiz/GetQuizPreviousQuestionSetting?QuizId=" + id)
      .map(response => {
        return response["data"];
      });
  }
    /**
   * Function to add new previous button setting
   */
  updatePreviousButtonSetting(body) {
    return this.http.post("v1/Quiz/UpdateQuizSetting", body).map(response => {
      return response["data"];
    });
  }

    /**
   * Function to update question setting
   */
  updateQuizQuestionSetting(body) {
    return this.http.post("v1/Quiz/UpdateQuizQuestionSetting", body).map(response => {
      return response["data"];
    });
  }

   /**
   * Function to get brand
   */
  getBranding(id) {
    return this.http
      .get("v1/Quiz/GetQuizBrandingAndStyle?QuizId=" + id)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to add new Branding
   */
  addNewBranding(body) {
    return this.http.post("v1/Quiz/UpdateBrandingAndStyle", body).map(response => {
      return response["data"];
    });
  }



  /**
   * Function to get AccessSetting
   */
  getQuizAccessSetting(id) {
    return this.http
      .get("v1/Quiz/GetQuizAccessSetting?QuizId=" + id)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to Update AccessSettings
   */
  updateQuizAccessSettings(body) {
    return this.http
      .post("v1/Quiz/UpdateQuizAccessSetttings", body)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to get Social Share Access
   */
  getSocialShareAccess(id) {
    return this.http
      .get("v1/Quiz/GetQuizSocialShareSetting?QuizId=" + id)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to Update Social Share Access
   */
  updateSocialShareAccess(body) {
    return this.http
      .post("v1/Quiz/UpdateQuizSocialShareSetting", body)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to Add Question against Quizz ID
   */
  addQuestionQuiz(quizId,type,isWhatsappEnable): Observable<any> {
    return this.http
      .post("v1/Quiz/AddQuizQuestion?QuizId=" + quizId + "&Type=" + type + "&IsWhatsappEnable=" + isWhatsappEnable , {})
      .map(response => {
        return response["data"];
      });
  }

  //add duplicate question
  addDuplicateQuestionQuiz(quizId,questionId): Observable<any> {
    return this.http
      .post("v1/QuizDuplicate/AddQuestion?QuizId=" + quizId + "&questionId=" + questionId , {})
      .map(response => {
        return response["data"];
      });
  }

  //add duplicate Result
  addDuplicateResultQuiz(quizId,resultId): Observable<any> {
    return this.http
      .post("v1/QuizDuplicate/AddQuizResult?QuizId=" + quizId + "&quizResultId=" + resultId , {})
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to get Quiz details
   */
  public quizId;
  getQuizDetails(quizId): Observable<any> {
    return this.http
      .get("v1/Quiz/GetQuizDetails?QuizId=" + quizId)
      .map(response => {
        this.quizId = response["data"].QuestionsInQuiz;
        return response["data"];
      });
  }

  /**
   * Function to remove Question of quizz against questionId
   */
  removeQuestion(questionId): Observable<any> {
    return this.http
      .delete("v1/Quiz/RemoveQuestion?QuestionId=" + questionId)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to get Question Details against questionId
   */
  getQuestionDetails(questionId,quizId): Observable<any> {
    return this.http
      .get("v1/Quiz/GetQuizQuestionDetails?QuestionId=" + questionId + "&QuizId=" + quizId)
      .map(response => {
        return response["data"];
      });
  }


  /**
   * Function to Add Answer against a Quizz(using questionId)
   */
  addAnswerToQuiz(questionId) {
    return this.http
      .post("v1/Quiz/AddAnswerOptionInQuestion?QuestionId=" + questionId, {})
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to Delete Answer against answer id
   */
  removeAnswer(answerId): Observable<any> {
    return this.http
      .delete("v1/Quiz/RemoveAnswer?AnswerId=" + answerId)
      .map(response => {
        return response["data"];
      });
  }

  /*
* Function to get Quiz Cover Details
*/
  getQuizCoverDetails(quizId) {
    return this.http
      .get("v1/Quiz/GetQuizCoverDetails?QuizId=" + quizId)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to update Quiz Cover Details
   */
  updateQuizCoverDetails(body) {
    return this.http.post("v1/Quiz/UpdateQuizCoverDetails", body).map(response => {
      return response["data"];
    });
  }

  /**
   * Function to upload cover image
   */
  uploadCoverImage(body) {
    return this.http.post("v1/Quiz/UpdateQuizCoverImage", body).map(response => {
      return response["data"];
    });
  }

  /**
   * Function to update Question against questionId
   */
  updateQuestionDetails(body,isWhatsappEnable): Observable<any> {
    return this.http
      .post("v1/Quiz/UpdateQuizQuestionDetails?isWhatsappEnable=" + isWhatsappEnable, body)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to save the Set Correct Answer against a question
   */
  reorderQuestionsAnswers(body,isQuesAndContentInSameTable) {
    return this.http.post("v1/Quiz/ReorderQuestionAnswerAndContent?IsQuesAndContentInSameTable="+isQuesAndContentInSameTable, body).map(response => {
      return response["data"];
    });
  }

  /**
   * Function to save the Set Correct Answer against a question
   */
  updateQuizCorrectAnswerSetting(body): Observable<any> {
    return this.http
      .post("v1/Quiz/UpdateQuizCorrectAnswerSetting", body)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to Add new Result
   */
  addResultToQuiz(quizId) {
    return this.http
      .post("v1/Quiz/AddQuizResult?QuizId=" + quizId, {})
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to Delete Result against ResultId
   */
  removeResultQuiz(resultId) {
    return this.http
      .delete("v1/Quiz/RemoveQuizResult?ResultId=" + resultId)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to Get Result Details Against ResultId
   */
  getResultDetails(resultId,quizId) {
    return this.http
      .get("v1/Quiz/GetQuizResultDetails?ResultId=" + resultId + "&QuizId=" + quizId)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to Update Result Settings Against ResultId
   */
  updateResultSettings(body) {
    return this.http.post("v1/Quiz/UpdateResultSetting", body).map(response => {
      return response["data"];
    });
  }

  /**
   * Function to get the branching details Against QuizId
   */
  getBranchingLogicDetails(quizId) {
    return this.http
      .get("v1/Quiz/GetQuizBranchingLogicDetails?QuizId=" + quizId)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to get the branching details Against QuizId
   */
  getBranchingLogicData(quizId) {
    return this.http
      .get("v1/Quiz/GetQuizBranchingLogicData?QuizId=" + quizId)
      .map(response => {
        return response["data"];
      });
  }

  getBranchingLogic(quizId) {
    return this.http
      .get("v1/BranchingLogic/GetData?QuizId=" + quizId)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to update branching logic details
   */
  updateBranchingLogicDetails(body) {
    return this.http
      .post("v1/Quiz/UpdateQuizBranchingLogic", body)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to get Quiz Result Against QuizId
   */
  getQuizResultsData(quizId) {
    return this.http
      .get("v1/Quiz/GetQuizResults?QuizId=" + quizId)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to publish quiz Against QuizId
   */
  publishQuiz(quizId) {
    return this.http
      .post("v1/Quiz/PublishQuiz?QuizId=" + quizId, {})
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to create Duplicate Quiz Against QuizId
   */
  createDuplicateQuiz(quizId) {
    return this.http
      .post("v1/Quiz/DuplicateQuiz?QuizId=" + quizId, {})
      .map(response => {
        return response;
      });
  }

  /**
   * Function to update branching logic enable Option
   */
  updateBranchingLogicState(quizId, enableOption) {
    return this.http
      .post(
        "v1/Quiz/UpdateBranchingLogicState?QuizId=" +
        quizId +
        "&IsEnabled=" +
        enableOption,
        {}
      )
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to Get Email/Sms Template bosy
   */
  getTemplateBody(tempId) {
    return this.http
      .get(
        "v1/NotificationTemplate/GetTemplateBody?notificationTemplateId=" + tempId
      )
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to Update Quiz In Template
   */
  updateQuizTemplate(body) {
    return this.http
      .post("v1/NotificationTemplate/UpdateQuizInTemplate", body)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to Save Template Body
   */
  saveTemplateBody(body) {
    return this.http
      .post("v1/NotificationTemplate/SaveTemplateBody", body)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to Delete Template Body
   */
  deleteTemplateBody(tempId) {
    return this.http
      .delete("v1/NotificationTemplate/DeleteTemplate?id=" + tempId)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to Get Details of Template Type
   */

  getDetailsTemplateType(body) {
    return this.http.post('v1/NotificationTemplate/GetTemplateTypeDetails', body).map(response => response['data']);
  }

  // call for email templete details
  getEmailTemplateDetails(data:any) {
    return this.http
      .get(
        "v1/NotificationTemplate/GetTemplateTypeDetails?NotificationType=" +
        data.NotificationType +
        "&OfficeId=" +
        data.OfficeId +
        "&IncludeSharedWithMe=" +
        data.IncludeSharedWithMe +
        "&OffsetValue=" +
        data.OffsetValue +
        // "&BusinessUserEmail=" +
        // data.BusinessUserEmail +
        "&SearchTxt=" +
        data.SearchTxt +
        "&QuizId=" +
        data.QuizId +
        "&QuizTypeId=" +
        data.QuizTypeId +
        "&QuizTagId=" +
        data.QuizTagId +
        "&IsFavorite=" +
        data.IsFavorite +
        "&CompanyCode=" +
        data.CompanyCode 
      )
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to Get default template by type
   */
  getDefaultTemplate(notificationType) {
    return this.http
      .get(
        "v1/NotificationTemplate/GetDefaultTemplateByType?NotificationType=" +
        notificationType
      )
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to Add New Quiz template
   */
  addNewQuizTemplate(body) {
    return this.http
      .post("v1/NotificationTemplate/AddQuizTemplate", body)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function To update Active and Inactive Option
   */
  setInactiveQuizType(body) {
    return this.http
      .post("v1/NotificationTemplate/SetQuizInactive", body)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function To get Office User against officeId
   */
  getUserListData(officeId) {
    return this.http
      .get("v1/User/GetUserListByOfficeId?OfficeId=" + officeId)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to get Result Redirect data
   */
  getResultRedirectData(quizId) {
    return this.http
      .get("v1/Quiz/GetQuizRedirectResult?QuizId=" + quizId)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to Update Result Redirect data
   */
  updateResultRedirectData(body) {
    return this.http
      .post("v1/Quiz/UpdateQuizRedirectResult", body)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to update Result Details
   */
  updateResultDetails(body) {
    return this.http.post("v1/Quiz/UpdateQuizResult", body).map(response => {
      return response["data"];
    });
  }

  /**
   * Function to get quiz version against QuizId
   */
  getQuizVersionList(quizId, offsetValue) {
    return this.http
      .get("v1/Quiz/GetQuizListByVersions?QuizId=" + quizId + "&OffsetValue=" + offsetValue)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to get Quiz analytics against publishedQuizId
   */
  getQuizAnalyticsOverview(publishedQuizId) {
    return this.http
      .get("v1/Quiz/GetQuizAnalyticsOverview?PublishedQuizId=" + publishedQuizId)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to get Quiz analytics stats against publishedQuizId
   */
  getQuizAnalyticsStats(publishedQuizId) {
    return this.http
      .get("v1/Quiz/GetQuizAnalyticsStats?PublishedQuizId=" + publishedQuizId)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to get Reminder Settings Details against OfficeId
   */
  getReminderSettings(officeId) {
    return this.http
      .get("v1/ReminderSetting/GetReminderSettings?OfficeId=" + officeId)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to Update Reminder Settings Details
   */
  updateReminderSettings(body) {
    return this.http
      .post("v1/ReminderSetting/SaveReminderSettings", body)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to update Result Details
   */
  updateTagDetails(body) {
    return this.http.post("Quiz/UpdateQuizTagColor", body).map(response => {
      return response["data"];
    });
  }

  /**
   * Function to remove quiz against QuizId
   */
  removeQuiz(quizId) {
    return this.http
      .delete("v1/Quiz/RemoveQuiz?QuizId=" + quizId)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to Get quiz Reporting Details
   */
  getQuizReportingDetails(quizIdCSV, fromDate, toDate, numerator, denominator) {
    return this.http
      .get(
        "v1/Reporting/GetQuizReportDetails?QuizIdCSV=" +
        quizIdCSV +
        "&fromDate=" +
        fromDate +
        "&toDate=" +
        toDate +
        "&numerator=" +
        numerator +
        "&denominator=" +
        denominator
      )
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to Get quiz Report
   */
  getQuizReport(quizId, sourceId, fromDate, toDate,resultId) {
    return this.http
      .get(
        "v1/Reporting/GetQuizReport?QuizId=" +
        quizId +
        "&SourceId=" +
        sourceId +
        "&FromDate=" +
        fromDate +
        "&ToDate=" +
        toDate +
        "&ResultId=" +
        resultId 
      )
      .map(response => {
        return response["data"];
      });
  }

  getNPSAutomationReport(quizId, sourceId, fromDate, toDate,resultId,chartView) {
    return this.http
      .get(
        "v1/Reporting/GetNPSAutomationReport?QuizId=" +
        quizId +
        "&SourceId=" +
        sourceId +
        "&FromDate=" +
        fromDate +
        "&ToDate=" +
        toDate +
        "&ResultId=" +
        resultId +
        "&ChartView=" +
        chartView
      )
      .map(response => {
        return response["data"];
      });
  }

  getQuizTemplateReport(tempId, fromDate, toDate,resultId) {
    return this.http
      .get(
        "v1/Reporting/GetQuizTemplateReport?TemplateId=" +
        tempId +
        "&FromDate=" +
        fromDate +
        "&ToDate=" +
        toDate +
        "&ResultId=" +
        resultId 
      )
      .map(response => {
        return response["data"];
      });
  }

  getNPSTemplateReport(tempId, fromDate, toDate,resultId,chartView) {
    return this.http
      .get(
        "v1/Reporting/GetNPSTemplateAutomationReport?TemplateId=" +
        tempId +
        "&FromDate=" +
        fromDate +
        "&ToDate=" +
        toDate +
        "&ResultId=" +
        resultId +
        "&ChartView=" +
        chartView
      )
      .map(response => {
        return response["data"];
      });
  }

  getTemplateQuizDetails(tempId) {
    return this.http
      .get("v1/Reporting/GetTemplateQuizDetails?TemplateId=" +tempId)
      .map(response => {
        return response["data"];
      });
  }

  getQuizLeadReport(quizId, leadUserId) {
    return this.http
      .get(
        "v1/Reporting/GetQuizLeadReport?QuizId=" +
        quizId +
        "&LeadUserId=" +
        leadUserId 
      )
      .map(response => {
        return response["data"];
      });
  }


  /**
   * Function to get Quiz Lead Stats against PublishedQuizId
   */
  getQuizLeadStatsData(publishedQuizId) {
    return this.http
      .get("v1/Quiz/GetQuizLeadCollectionStats?PublishedQuizId=" + publishedQuizId)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to generate Quiz code against publishedCode
   */
  getQuizCode(publishedCode, mode) {
    return this.http
      .get(
        "v1/Quiz/GetQuizAttemptCode?PublishedCode=" +
        publishedCode +
        "&Mode=" +
        mode
      )
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to get quiz Action against actionId
   */
  getQuizAction(actionId) {
    return this.http.get("v1/Quiz/GetQuizAction?id=" + actionId).map(response => {
      return response["data"];
    });
  }

  /**
   * function to add new Action against quizId
   */
  addNewAction(quizId) {
    return this.http
      .post("v1/Quiz/AddActionInQuiz?quizId=" + quizId, {})
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to update action
   */
  updateQuizAction(body) {
    return this.http.post("v1/Quiz/UpdateActionInQuiz", body).map(response => {
      return response["data"];
    });
  }

  /**
   * function to remove quiz Action against ActionId
   */
  removeQuizAction(actionId) {
    return this.http
      .post("v1/Quiz/RemoveActionInQuiz?Id=" + actionId, {})
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to get quiz Content against actionId
   */
  getQuizContent(actionId,quizId) {
    return this.http
      .get("v1/Quiz/GetQuizContentDetail?Id=" + actionId + "&QuizId=" + quizId)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * function to add new Content against quizId
   */
  addNewContent(quizId) {
    return this.http
      .post("v1/Quiz/AddContentInQuiz?quizId=" + quizId, {})
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to update Content
   */
  updateQuizContent(body) {
    return this.http.post("v1/Quiz/UpdateContentInQuiz", body).map(response => {
      return response["data"];
    });
  }

  updateQuizContentSetting(body) {
    return this.http.post("v1/Quiz/UpdateContenSettingtInQuiz", body).map(response => {
      return response["data"];
    });
  }

  updateQuizCoverSetting(body) {
    return this.http.post("v1/Quiz/UpdateCoverSettingtInQuiz", body).map(response => {
      return response["data"];
    });
  }

  /**
   * function to remove quiz Content against ContentId
   */
  removeQuizContent(actionId) {
    return this.http
      .post("v1/Quiz/RemoveContentInQuiz?Id=" + actionId, {})
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to Get Appointment Type
   */
  getAppointmentType(officeIds, offset) {
    return this.http
      .post(
        "v2/Appointment/GetAppointmentTypeList?OffsetValue=" + offset, {'officeId': officeIds,'companyWise' : true,'isHitfromAppointmentModule' : true}
      )
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to get Quiz Badges against BadgeId
   */
  getQuizBadge(badgeId,quizId) {
    return this.http.get("v1/Quiz/GetBadgeInQuiz?Id=" + badgeId + "&QuizId=" + quizId).map(response => {
      return response["data"];
    });
  }

  /**
   * Function to create New Badges against QuizId
   */
  createNewBadge(quizId) {
    return this.http
      .post("v1/Quiz/AddBadgeInQuiz?quizId=" + quizId, {})
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to update Badges
   */
  updateBadge(body) {
    return this.http.post("v1/Quiz/UpdateBadgeInQuiz", body).map(response => {
      return response["data"];
    });
  }

  /**
   * Function to remove badges against BadgeId
   */
  removeBadge(badgeId) {
    return this.http
      .post("v1/Quiz/RemoveBadgeInQuiz?Id=" + badgeId, {})
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to Get Attachments
   */
  getAttachments(quizId) {
    return this.http
      .get("v1/Quiz/GetAttachmentsInQuiz?QuizId=" + quizId)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to add Attachments
   */
  addNewAttachments(body) {
    return this.http.post("v1/Quiz/AddAttachmentInQuiz", body).map(response => {
      return response["data"];
    });
  }

  /**
   * Function to Get share quiz data against quizId
   */
  getQuizShare(quizId) {
    return this.http
      .get("v1/Quiz/GetQuizShareSetting?QuizId=" + quizId)
      .map(response => {
        return response["data"];
      });
  }

  /**
   * Function to update Share Quiz
   */
  updateQuizShare(body) {
    return this.http.post("v1/Quiz/QuizShareSetting", body).map(response => {
      return response["data"];
    });
  }

  /**
   *@description:Get all Quiz categories and on all categories fetch its tag list
   */
  getQuizCategories() {
    return this.http.get("v1/Quiz/GetAllCategory")
      .map(response => response["data"] ? response["data"] : [])
      .mergeAll()
      .pipe(
        mergeMap(category => {
          return this.getTagsBasedOnCategory(category['tagCategoryId'])
        .map(tags => {
          //transforming tag data in accordance with ng-select
          let tagList = tags && tags.length ? tags.map(tag => {
            return {
              label: tag.tagName,
              value: tag.id.toString()
            }
          }) : [];
          let obj = {
            categoryName: category,
            tagList
          }
          return obj;
        })}
      )
      ).toArray()
      .map(data => {
        this.quizBuilderDataService.setQuizCategoryList(data)
        return data;
      })
  }

  getTagsBasedOnCategory(category) {
    return this.http.get(`v1/Quiz/GetTagsByCategory?tagCategoryId=${category}`).map(response => {
      return response["data"];
    })
  }

  getObjectFieldsList() {
    return this.http.get(`v1/Integration/GetObjectFieldsList`).map(response => {
      return response["data"];
    })
  }

  updateAnswerTagAndCategory(body): Observable<any> {
    return this.http.post('v1/Quiz/UpdateAnswerTagAndCategory', body).map(response => response['data'])
  }

  updateAnswerObjectMapping(body): Observable<any> {
    return this.http.post('v1/Quiz/UpdateAnswerObjectFieldsDetails', body).map(response => response['data'])
  }

  updateResultRangeData(body) {
    return this.http.post('v1/Quiz/UpdateResultRange', body).map(response => response['data']);
  }

  getCloudinarySignature(params) {
    let { CloudName, Timestamp, Type } = params
    return this.http.get(`v1/Integration/GetSHA256GeneratorValue?CloudName=${CloudName}&Timestamp=${Timestamp}&Type=${Type}`)
  }

  /**
   * hit api to update Answer type
   */
  updateAnswerType(qId, ansType, answerStructureType, isWhatsappEnable,IsMultiRating, minAnswer?, maxAnswer?){
    IsMultiRating = (ansType == '10' || ansType == '11' || ansType == '12') ? IsMultiRating : false;
    return this.http.post(`v1/Quiz/UpdateAnswerType?QuestionId=${qId}&AnswerType=${ansType}&MinAnswer=${minAnswer}&MaxAnswer=${maxAnswer}&AnswerStructureType=${answerStructureType}&isWhatsappEnable=${isWhatsappEnable}&isMultiRating=${IsMultiRating}`, {}).map((response) => {
      return response['data'];
    })
  }

  getCategories(PageNo = 1, PageSize = 100) {
    return this.http.get(`Category/GetCategories?PageNo=${PageNo}&PageSize=${PageSize}`).map(response => response['data'])
  }


  getTemplates(QuizType, CategoryId, PageNo = 1, PageSize = 100) {
    return this.http.get(`v1/Template/GetTemplateList?QuizType=${QuizType}&CategoryId=${CategoryId}&PageNo=${PageNo}&PageSize=${PageSize}`).map(response => response['data'])
  }

  /**
  * Create dulplicate quiz for using a new template
  */
  createDuplicateTemplate(QuizId = '', AccessibleOfficeId = '', CompanyAccessibleLevel = '', AccessibleUserEmails = ''): Observable<any> {
    return this.http
      .post(`v1/Quiz/DuplicateQuiz?QuizId=${QuizId}&AccessibleOfficeId=${AccessibleOfficeId}&CompanyAccessibleLevel=${CompanyAccessibleLevel}&AccessibleUserEmails=${AccessibleUserEmails}`, {})
      .map(response => {
        return response["data"];
      })
  }



  getTemplateList(QuizTypeId, CategoryId, PageNo, PageSize, SearchText, OrderByDate): Observable<any> {
    return this.http.get(`v1/Template/GetDashboardTemplates?OffsetValue=${this.OffsetValue}&QuizTypeId=${QuizTypeId}&CategoryId=${CategoryId}&PageNo=${PageNo}&PageSize=${PageSize}&SearchTxt=${SearchText}&OrderByDate=${OrderByDate}`)
      .map(response => {
        return response["data"];
      })
  }

  addNewTemplate(body): Observable<any> {
    return this.http.post('v1/Quiz/CreateQuiz', body).map(response => {
      return response['data'];
    })
  }


  changeTemplateStatus(templateId, TemplateStatus) {
    return this.http.post(`v1/Template/SetTemplateStatus?Id=${templateId}&TemplateStatus=${TemplateStatus}`, {}).map(response => {
      return response['data'];
    })
  }
  /**
   * api to change the multiple results progress bar width
   */
  updateResultProgressBarWidth(quizId, isFullWidthEnable){
    return this.http.post(`v1/Quiz/UpdatePersonalityWidthSetting?QuizId=${quizId}&IsFullWidthEnable=${isFullWidthEnable}`, {}).map((response) => {
      return response['data'];
    });
  }

  // call for favorite quiz
  updateQuizFavoriteStatus(QuizId:any, IsFavorite:boolean, CompanyCode:string) {
    return this.http
      .post("v1/Quiz/UpdateQuizFavoriteStatus?QuizId=" + QuizId + '&IsFavorite=' + IsFavorite + '&CompanyCode=' + CompanyCode, {})
      .map(response => {
        return response["data"];
      });
  }

  // call for automation tag
  getAutomationTagList(){
    return this.http
    .get("v1/Quiz/GetAutomationTagsList")
    .map(response => {
      return response["data"];
    });
  }

  //call for usage type

  getQuizUsageType(QuizId:any){
    return this.http
    .get("v1/Quiz/GetQuizUsageTypeDetails?QuizId="+QuizId, {})
    .map(response => {
      return response["data"];
    });
  }

  updateQuizUsageTypeAndTag(body){
    return this.http
    .post("v1/Quiz/UpdateQuizUsageTypeandTagDetails",body)
    .map(response => {
      return response["data"];
    });
  }

  //GetEmailSignature
  getEmailSignature(type){
    return this.http
    .get("v1/NotificationTemplate/GetEmailSignature?SignatureType="+type)
    .map(response => {
      return response["data"];
    });
  }

  //country code send perticular question
  // updateAnswerValuesInCountryCode(AnswerId:any,selectedCountcodeArray: any){
  //   return this.http.post("v1/Quiz/UpdateAnswerOptionValues?AnswerId=" + AnswerId,selectedCountcodeArray).map(response => { return response["data"]})
  // }

  //Reorder answerInQuestionId
  reorderAnswerInQuestionId(body) {
    return this.http.post("v1/Quiz/ReorderAnswer", body).map(response => {
      return response["data"];
    });
  }

  //update quizTitle
  updateQuizTitleDetails(body) {
    return this.http.post("v1/Quiz/UpdateQuiz", body).map(response => {
      return response["data"];
    });
  }

  getWhatsAppHSMTemplatesV1(type: string): Observable<any> {
    let url = `v1/WhatsApp/GetHSMTemplates?templatesType=${type}`;  
    return this.http.get(url).map((response) => {
      return response;
    });
  }
  getWhastappHsmTemplate2(paramObj: any): Observable<any>{
    let url = `v1/WhatsApp/HSMTemplateDetails?clientCode=${paramObj.clientCode}&moduleType=${paramObj.moduleType}&languageCode=${paramObj.languageCode}&templateId=${paramObj.templateId}`;  
    return this.http.get(url).map((response) => { return response});
  }
  getAllLanguageList(type: string): Observable<any> {
    let url = `v1/WhatsApp/GetLanguages?templateType=${type}`
    return this.http.get(url).map((response) => { return response});
  }

  getNotificationTemplateInActiveQuizList(body){
    return this.http.post("v1/NotificationTemplate/InActiveQuizList", body).map(response => {
      return response["data"];
    });
  }

  getNotificationTemplateQuizTemplateList(body){
    return this.http.post("v1/NotificationTemplate/QuizTemplateList", body).map(response => {
      return response["data"];
    });
  }
  

  getWhatsAppHSMTemplatesAutomation(templatesType): Observable<any> {
    let url = `v1/WhatsApp/GetHSMTemplates?templatesType=${templatesType}`;  
    return this.http.get(url).map((response) => {
      return response;
    });
  }

  getAllLanguageListAutomation(templatesType): Observable<any> {
    let url = `v1/WhatsApp/GetLanguages?templateType=${templatesType}`
    return this.http.get(url).map((response) => { return response});
  }

    // AddQuizWhatsAppTemplate
  updateQuizWhatsAppTemplate(QuizId:any, templateId:any, language:string) {
    return this.http
      .post("v1/WhatsApp/AddQuizWhatsAppTemplate?QuizId=" + QuizId + '&templateId=' + templateId + '&language=' + language, {})
      .map(response => {
        return response["data"];
      });
  }

  unlinkAutomationNotificationTemplate(body){
    return this.http.post("v1/NotificationTemplate/UnLinkAutomation", body).map(response => {
      return response["data"];
    });
  }

  linkAutomationNotificationTemplate(body){
    return this.http.post("v1/NotificationTemplate/LinkAutomation", body).map(response => {
      return response["data"];
    });
  }

  getPostalCountrylist(clientCode: any){
    let url = `v1/Account/ClientCountries?clientCode=${clientCode}`;  
    return this.http.get(url).map((response) => {
      return response;
    });
  }

  getMappedSfFieldsList(): Observable<any> {
    let clientCode: string = this.sharedService.getCookie("clientCode");
    // let companyCode:string = this.getCookie('clientCode');
    let object: string = "Vacancy,Lead,Contact";
    let Url = `v1/MasterList/${clientCode}/variablefields?objects=${object}`;
    return this.http.get(Url).map((data) => {return data});
  }

  deleteTestAutomationVerifyRequest(queryParams:any): Observable<any> {
    let clientCode: string = this.sharedService.getCookie("clientCode");
    let Url = `v1/Automation/DeleteVerifyRequestAutomation?requestId=${queryParams.requestIds}&objectType=${queryParams.objectType}&clientCode=${clientCode}`;
    return this.http.post(Url,{}).map((data) => {return data});
  }

  getDateFieldSyncSettings(): Observable<any>{
    return this.http.get(`Fields/SyncSetting`).map((data) => {return data});
  }
}
