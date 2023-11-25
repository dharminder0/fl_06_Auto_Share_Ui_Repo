import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ElementRef,
  TemplateRef,
  ComponentFactoryResolver,
  Renderer2
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { UserInfoService } from "../../shared/services/security.service";
import { QuizBuilderApiService } from "../quiz-builder-api.service";
import { NotificationsService } from "angular2-notifications";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import * as moment from "moment";
import { Moment } from "moment";
import { Config } from "../../../config";
import { ShareQuizComponent } from "../share-quiz/share-quiz.component";
import { QuizPermissionGaurd } from "../quiz-permission.guard";
declare var $: any;

@Component({
  selector: "app-quiz-user",
  templateUrl: "./quiz-user.component.html",
  styleUrls: ["./quiz-user.component.css"]
})
export class QuizUserComponent implements OnInit {
  @ViewChild("popover", {static:true})
  popover: ElementRef;

  public quizList = [];
  public officeList = [];
  public officeListArray = [];
  public officeIdArray = [];
  public sharedWithMe: boolean = true;
  public selectAll: boolean = false;
  public businessUserEnail;
  public businessUserId;
  public filterData: string;
  public sortByDate;
  public sortByTagColor;
  public selectedColor = "red";
  public quizId;
  public modalRef: BsModalRef;
  public selectedQuiz;
  public quizURL;
  public hostURL;
  private openMode;
  private publishTemplate;
  private shareTemplate;
  public offsetValue;
  @ViewChild("shareQuizTemplate", { read: ViewContainerRef , static:true})
  shareQuizTemplate: ViewContainerRef;
  public AutomationType = [
    {label: "Assessment", value: "2"},
    {label : "Scored", value :"4"},
    {label : "Personality",value :"3"}
  ];
  // public AutomationTypeId = "0";
  public automationTypeArray = ["2","4","3"];
  public selectAllAutomationType: boolean = true;
  public searchText;
  public isStandard;

  constructor(
    private route: ActivatedRoute,
    private quizBuilderApiService: QuizBuilderApiService,
    private userInfoService: UserInfoService,
    private modalService: BsModalService,
    private notificationsService: NotificationsService,
    private router: Router,
    private location: Location,
    private _crf: ComponentFactoryResolver,
    private quizPermissionGaurd: QuizPermissionGaurd,
    private renderer: Renderer2
  ) {
    this.businessUserId = this.userInfoService.get().BusinessUserId;
    this.businessUserEnail = this.userInfoService.get().UserName;

    /**
     * Get Office list data to create select box
     */
    this.officeList = this.userInfoService.get().OfficeList;
    if(this.userInfoService.get().officesParentChildList.length > 0){
    this.userInfoService.get().officesParentChildList.forEach(office => {
      this.officeListArray.push({
          id: office.id.toString(),
          name: office.name,
          type : 'Parent'
      })
      if(office.children && office.children.length > 0){
        office.children.forEach(child => {
          this.officeListArray.push({
            id :  child.id.toString(),
            name :  child.name,
            type  :  'Child'
          }) 
        })
    }
    })
  }

    if (this.quizBuilderApiService.getOfficeIds()) {
      this.officeIdArray = this.quizBuilderApiService.getOfficeIds().split(",");
    } else {
      // this.officeList.forEach(office => {
      //   if (office.id == 133) {
      //     this.officeIdArray.push(office.id.toString());
      //   }
      // });
      if (!this.officeIdArray.length) {
        this.officeListArray.forEach(office => {
            this.officeIdArray.push(office.id.toString());
        });
      }
      this.setOfficeIdsINLocalStorage(this.officeIdArray.toString());
    }

    if(this.officeIdArray.length >= this.officeListArray.length){
      this.selectAll = true;
    }else{
      this.selectAll = false;
    }
  }

  ngOnInit() {
    this.offsetValue = this.userInfoService.get().OffsetValue;
    this.isStandard = this.userInfoService.get().IsCreateStandardAutomationPermission;
    this.hostURL = this.location[
      "_platformLocation"
    ].location.host;
    /**
     * Get Quiz list data via resolver
     */
    this.quizList = this.route.snapshot.data["quizList"];
    this.quizList.forEach(quiz => {
      quiz.createdOnFormat = moment(quiz.createdOn).format("ll HH:mm");
    });
  }

  autoFocus()
  {
    $(function() {
      $("#Box1").focus();
    });
  }

  onSelectAutomationType(index){
    if (this.automationTypeArray.includes(this.AutomationType[index].value)) {
      var id = this.automationTypeArray.indexOf(this.AutomationType[index].value);
      this.automationTypeArray.splice(id, 1);
    } else {
      this.automationTypeArray.push(this.AutomationType[index].value);
    }

    if (this.automationTypeArray.length === this.AutomationType.length) {
      this.selectAllAutomationType = true;
    } else {
      this.selectAllAutomationType = false;
    }

    this.getQuizListData(
      this.officeIdArray.toString(),
      this.sharedWithMe
    );
  }

  onSelectAllAutomationType(){
    this.selectAllAutomationType = !this.selectAllAutomationType;
    if (this.selectAllAutomationType) {
      this.automationTypeArray = [];
      this.AutomationType.forEach(automation => {
        this.automationTypeArray.push(automation.value);
      });
    } else {
      this.automationTypeArray = [];
    }

    this.getQuizListData(
      this.officeIdArray.toString(),
      this.sharedWithMe
    );
  }

  /**
   * Function call when sharedWithMe checkbox value change
   */
  onSharedWithMe(event) {
    // this.sharedWithMe = !this.sharedWithMe;
    this.getQuizListData(
      this.officeIdArray.toString(),
      this.sharedWithMe
    );
  }

  /**
   * Function call when all office selected
   */
  onSelectAll() {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.officeIdArray = [];
      this.officeListArray.forEach(office => {
        this.officeIdArray.push(office.id.toString());
      });
    } else {
      this.officeIdArray = [];
    }

    this.getQuizListData(
      this.officeIdArray.toString(),
      this.sharedWithMe
    );

    this.setOfficeIdsINLocalStorage(this.officeIdArray.toString())
  }

  setOfficeIdsINLocalStorage(officeIdList){
    this.quizBuilderApiService.setOfficeIds(officeIdList);
  }

  /*
  * Function call when a specific office selected
  */

  onSelectOffice(officeId) {
    if (this.officeIdArray.includes(officeId.toString())) {
      var id = this.officeIdArray.indexOf(officeId.toString());
      this.officeIdArray.splice(id, 1);
    } else {
      this.officeIdArray.push(officeId.toString());
    }

    if (this.officeIdArray.length >= this.officeListArray.length) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }

    this.getQuizListData(
      this.officeIdArray.toString(),
      this.sharedWithMe
    );

    this.setOfficeIdsINLocalStorage(this.officeIdArray.toString())
  }

  /**
   *
   * @param businessUserId number (userId)
   * @param businessUserEnail string (userEmail)
   * @param officeIdList string comma(,) separated (selected OfficeId)
   * @param sharedWithMe boolean
   * Api Integration: Get Quiz List Data
   */
  getQuizListData(officeIdList, sharedWithMe) {
    var automationTypeArrayData;
    if(!this.automationTypeArray.length){
      automationTypeArrayData = "0";
    }else{
      automationTypeArrayData = this.automationTypeArray.toString();
    }   
    this.quizBuilderApiService
      .getQuizList(officeIdList, sharedWithMe, this.offsetValue, automationTypeArrayData)
      .subscribe(
        data => {
          this.quizList = data;
          this.quizList.forEach(quiz => {
            quiz.createdOnFormat = moment(quiz.createdOn).format("ll HH:mm");
          });
        },
        error => {
          this.notificationsService.error("Quiz-List", "Something went Wrong");
        }
      );
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

  /**
   *
   * @param e Tag Details
   */
  showColor(e) {
    this.updateTag(e);
  }

  /**
   *
   * @param tagDetails Tag Details
   * Api Integration: update and remove Tag Details
   */
  updateTag(tagDetails) {
    this.quizBuilderApiService.updateTagDetails(tagDetails).subscribe(data => {
      this.quizList.forEach(quiz => {
        if (quiz.Id == tagDetails.QuizId) {
          quiz.TagColor = tagDetails.TagColor;
          quiz.LabelText = tagDetails.LabelText;
        }
      });
    });
  }

  /**
   *
   * @param e Tag Details
   */
  removedColor(e) {
    this.updateTag(e);
  }

  /**
   *
   * @param publishTemplate Template reference
   * @param quizId number (QuizId)
   * Api Integration: Create Duplicate Quiz Against quizId
   */
  onDuplicatedQuiz(publishTemplate, quizId) {
    this.publishTemplate = publishTemplate;
    this.quizId = quizId;
    this.quizBuilderApiService.createDuplicateQuiz(quizId).subscribe(
      data => {
        this.notificationsService.success("Success");
        data['message'] ? this.publishModal(publishTemplate, quizId, "DUPLICATE"): 
        this.router.navigate([`quiz-tool/${data['data']}/cover`], {
          relativeTo: this.route
        });
      },
      error => {
        this.notificationsService.error('Error');
        // this.publishModal(publishTemplate, quizId, "DUPLICATE");
      }
    );
  }

  //Modal confirm
  confirm(): void {
    this.quizBuilderApiService.publishQuiz(this.quizId).subscribe(
      data => {
        if (this.openMode === "PREVIEW") {
          this.onPreviewQuiz(this.publishTemplate, this.selectedQuiz);
        } else if (this.openMode === "SHARE") {
          this.selectedQuiz.IsPublished = true;
          this.onSharLinkClicked(
            this.shareTemplate,
            this.publishTemplate,
            this.selectedQuiz
          );
        } else if (this.openMode === "DUPLICATE") {
          this.onDuplicatedQuiz(this.publishTemplate, this.quizId);
        }
        this.notificationsService.success("Success");
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

  publishModal(template: TemplateRef<any>, quizId, Mode) {
    this.openMode = Mode;
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  /**
   *
   * @param template Template reference
   * @param quizId number
   */
  onRemovedQuiz(template, quizId) {
    this.quizId = quizId;
    this.deleteQuizTemplate(template, quizId);
  }

  deleteQuizTemplate(template: TemplateRef<any>, quizId) {
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  //Modal confirm
  delete(): void {
    this.quizBuilderApiService.removeQuiz(this.quizId).subscribe(
      data => {
        this.notificationsService.success("Success");
        this.quizList = this.quizList.filter(quiz => quiz.Id != this.quizId);
      },
      error => {
        this.notificationsService.error("Error");
      }
    );
    this.modalRef.hide();
  }

  //Modal decline
  cancel(): void {
    this.modalRef.hide();
  }

  onSearchBoxEmpty() {
    this.filterData = "";
  }

  /**
   * Set permission data to user based on isCreateByYou ans isViewOnly
   */
  setPermissionDataToGuardService(quizData, permissionQuizTemplate){
    this.quizPermissionGaurd.setPermissionData(quizData);
    if((this.isStandard && this.sharedWithMe) || (this.officeIdArray.length!=0 && (quizData.IsCreatedByYou || !quizData.IsViewOnly))){
      this.router.navigate(['/quiz-builder/quiz-tool', quizData.Id,'cover']);
    }else{
      this.openPermissionPopup(permissionQuizTemplate);
    }
  }

  openPermissionPopup(template){
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  onPreviewQuiz(publishTemplate, quiz) {
    this.publishTemplate = publishTemplate;
    this.selectedQuiz = quiz;
    if (quiz.PublishedCode) {
      this.quizBuilderApiService
        .getQuizCode(quiz.PublishedCode, "PREVIEW")
        .subscribe(
          data => {
            window.open("quiz-preview/attempt-quiz?QuizCodePreview="+data,"_blank");
            // this.router.navigate(
            //   [{ outlets: { popup: "quiz-preview/attempt-quiz" } }],
            //   { queryParams: { QuizCodePreview: data } }
            // );
          },
          error => {
            this.notificationsService.error("Error");
          }
        );
    } else {
      this.quizId = quiz.Id;
      this.selectedQuiz = quiz;
      this.publishModal(publishTemplate, quiz.Id, "PREVIEW");
    }
  }

  onSharLinkClicked(shareTemplate, publishTemplate, quiz) {
    this.shareTemplate = shareTemplate;
    this.publishTemplate = publishTemplate;
    this.selectedQuiz = quiz;
    var config = new Config();
    if (quiz.IsPublished) {
      this.shareQuizURL(shareTemplate);
      this.quizURL = this.hostURL + "/quiz?Code=" + quiz.PublishedCode;
    } else {
      this.quizId = quiz.Id;
      this.selectedQuiz = quiz;
      this.publishModal(publishTemplate, quiz.Id, "SHARE");
    }
  }

  shareQuizURL(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  /**
   * Create Share Quiz Template
   */
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

}
