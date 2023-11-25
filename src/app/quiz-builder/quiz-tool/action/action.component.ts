import {
  Component,
  OnInit,
  TemplateRef,
  Inject,
  OnDestroy,
  ViewChild,
  ComponentFactoryResolver,
  ViewContainerRef
} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { QuizBuilderApiService } from "../../quiz-builder-api.service";
import {
  ActivatedRoute,
  Router,
  NavigationStart,
  NavigationEnd
} from "@angular/router";

import { HttpClient } from "@angular/common/http";
import { UserInfoService } from "../../../shared/services/security.service";
import { NotificationsService } from "angular2-notifications";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { DOCUMENT, Location } from "@angular/common";
import { QuizzToolHelper } from "../quiz-tool-helper.service";
import { ShareQuizComponent } from "../../share-quiz/share-quiz.component";
import { Subscription } from "rxjs/Subscription";
import { SharedService } from "../../../shared/services/shared.service";
import { TagModel } from 'ngx-chips/core/accessor';
import { QuizBuilderDataService } from '../../quiz-builder-data.service';
declare var $: any;
@Component({
  selector: "app-action",
  templateUrl: "./action.component.html",
  styleUrls: ["./action.component.css"]
})
export class ActionComponent implements OnInit, OnDestroy {
  public actionForm: FormGroup;
  calendarList = [];
  dubCalendarList = [];
  public appointmentTypeList = [
    {
      label: "SELECT_APPOINTMENT",
      value: "0"
    }
  ];
  public automationList = [
    {
      label: "SELECT_AUTOMATION",
      value: "0"
  }
  ];
  // public appointmentId;
  public quizActionData;
  public actionEmails = [];
  public routerSubscription: Subscription;
  public appointmentType;
  public publishTemplate;
  public quizId;
  dubEmailArray = [];
  public openMode;
  public quizURL;
  public shareTemplate;
  public hostURL;
  public selectedQuiz;
  public appointmentData1;
  public automationData1
  public modalRef: BsModalRef;
  private actionSubscription : Subscription;
  selectedCalendarIds;
  @ViewChild("shareQuizTemplate", { read: ViewContainerRef, static: true })
  shareQuizTemplate: ViewContainerRef;
  public getListApiParams:Object;
  public brandingColors;

  constructor(
    private quizBuilderApiService: QuizBuilderApiService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private modalService: BsModalService,
    private userInfoService: UserInfoService,
    private notificationsService: NotificationsService,
    private location: Location,
    private quizzToolHelper: QuizzToolHelper,
    private shared: SharedService,
    private _crf: ComponentFactoryResolver,
    private quizBuilderDataService:QuizBuilderDataService
  ) {
    this.route.parent.parent.params.subscribe(params => {
      this.quizId = +params["id"];
    });
  }

  ngOnInit() {
    this.brandingColors = this.quizzToolHelper.getBrandingAndStyling();
    this.getListApiParams = this.userInfoService._info;
    this.hostURL = this.location[
      "_platformLocation"
    ].location.host;

    this.actionEmails = [];
    this.initializeActionComponent();
    this.routerChangeSubscription();
    this.actionEmails = this.quizActionData.ReportEmails;
    this.dubEmailArray = this.quizActionData.ReportEmails;
    this.onActionTypeChanges();
    var e = {};
    e["value"] = this.quizActionData.AppointmentId;
    this.onSelectAppointment(e);
    var eAuto = {};
    eAuto["value"] = this.quizActionData.AutomationId;
    this.onSelectAutomation(eAuto);

    this.addAutomation();
    let self = this;
    this.quizBuilderDataService.currentQuizSaveAll.subscribe(function(res){
      if(res){
        self.saveAction();
      }
    });
  }

  onActionTypeChanges() {
    this.actionForm.controls["ActionType"].valueChanges.subscribe(
      actionType => {
        if (actionType == 1) {
          
          this.actionForm.patchValue({
            ReportEmailsArray: "",
            ReportEmails: "",
            AutomationId:"0",
            AppointmentId:
              this.quizActionData.AppointmentId.toString() != "0"
                ? this.quizActionData.AppointmentId.toString()
                : this.appointmentTypeList[0].value
          });
          var e = {};
          e["value"] = this.quizActionData.AppointmentId;
          this.onSelectAppointment(e);
          this.actionForm.get("ReportEmailsArray").setErrors(null);
          this.actionForm.get("AutomationId").setErrors(null);

        } else if (actionType == 2) {
          
          this.actionForm.patchValue({
            AppointmentId: "0",
            AutomationId: "0",
            ReportEmailsArray: this.dubEmailArray,
            ReportEmails: this.dubEmailArray ? this.dubEmailArray.toString() : ""
          });
          
          this.actionForm.get("AppointmentId").setErrors(null);
          this.actionForm.get("AutomationId").setErrors(null);
        }

        // else if (actionType == 3) {
          
        //   this.actionForm.patchValue({
        //     ReportEmailsArray: "",
        //     ReportEmails: "",
        //     AppointmentId: "0",
        //     AutomationId:
        //       this.quizActionData.AutomationId.toString() != "0"
        //         ? this.quizActionData.AutomationId.toString()
        //         : this.automationList[0].value
        //   });
        //   this.actionForm.get("ReportEmailsArray").setErrors(null);
        //   this.actionForm.get("AppointmentId").setErrors(null);
        // }

        else if (actionType == 3) {
          
          this.actionForm.patchValue({
            ReportEmailsArray: "",
            ReportEmails: "",
            AppointmentId: "0",
            AutomationId:
              this.quizActionData.ActionType == 3 && this.quizActionData.AutomationId != null
                ? this.quizActionData.AutomationId.toString()
                : this.automationList[0].value
          });
          var e = {};
          e["value"] = this.quizActionData.AutomationId;
          this.onSelectAutomation(e);
          this.actionForm.get("ReportEmailsArray").setErrors(null);
          this.actionForm.get("AutomationId").setErrors(null);

        }

        
      }
    );

    this.actionForm.valueChanges.subscribe(data => {
      $(document).ready(function () {
        $(window).on("beforeunload", function () {
          // return confirm("Do you really want to close?");
          return "";
        });
      });
      var actionInfo = {
        Id: data.id,
        Title: data.Title
      };
      this.quizzToolHelper.updateSidebarOptionsActionTitle.next(actionInfo);
    });
  }

  addAutomation(){
    this.automationData1.forEach((element) => {
      this.automationList.push({
        label:element.QuizTitle,
        value:element.Id.toString()
      })
    });
  }

  initializeActionComponent() {
    this.getActionData();
    this.createActionForm();
    this.onActionTypeChanges();
    // this.getAppointmentType();
  }

  getActionData() {
    this.quizActionData = this.route.snapshot.data["quizActionData"];
    this.appointmentData1 = this.route.snapshot.data["appointmentData1"];
    this.automationData1 = this.route.snapshot.data["automationData1"];
    this.selectedCalendarIds = this.quizActionData.CalendarIds;
    var e = {};
    e["value"] = this.quizActionData.AppointmentId;
    if (e['value'] != "0") {
      this.appointmentData1.forEach(appointment => {
        appointment.AppointmentTypeList.forEach(data => {
          if (data.Id == parseInt(e['value'])) {
            this.calendarList = data.CalendarListForSlotBased;
          }
        })
      });
    } else {
      this.calendarList = [];
    }

    this.appointmentData1.forEach(appointment => {
      appointment.AppointmentTypeList.forEach(appointmentType => {
        this.appointmentTypeList.push({
          label: appointmentType.AppointmentTypeName,
          value: appointmentType.Id.toString()
        });
      });
    });
    this.appointmentType = this.appointmentData1;

  }

  createActionForm() {
    
    this.actionForm = new FormGroup({
      id: new FormControl(this.quizActionData.Id, Validators.required),
      Title: new FormControl(this.quizActionData.Title, Validators.required),
      AppointmentId: new FormControl(
        this.quizActionData.AppointmentId.toString() != "0"
          ? this.quizActionData.AppointmentId.toString()
          : this.appointmentTypeList[0].value
      ),
      CalendarIds: new FormControl([]),
      ReportEmails: new FormControl(
        this.quizActionData.ReportEmails
          ? this.quizActionData.ReportEmails.toString()
          : ""
      ),
      AutomationId: new FormControl(
        this.quizActionData.ActionType == 3 && this.quizActionData.AutomationId != null
          ? this.quizActionData.AutomationId.toString()
          : this.automationList[0].value
      ),
      ActionType: new FormControl(this.quizActionData.ActionType),
      ReportEmailsArray: new FormControl(this.quizActionData.ReportEmails)
    });
    this.patchUserEmailValueFromBackend(this.quizActionData.ReportEmails);
  }

  /**
   * Router Subscription: When the url param changes,
   * this funtion is called and the component is reinitialized with
   * new data
   */
  routerChangeSubscription() {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.saveAction();
      }
      if (event instanceof NavigationEnd) {
        this.initializeActionComponent();
      }
    });
  }

  /**
   * Asynchronous Validation for email chips
   */
  emailValidation(control: FormControl) {
    var emailRegex: string =
      '(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))';
    var length = control.value.length;
    if (!control.value.match(emailRegex)) {
      return {
        emailInvalid: true
      };
    }
  }

  public placeholderData = "ENTER_EMAIL_ADDRESS";
  /**
   * to set Error Message
   */
  public errorMessages = {
    emailInvalid: 'Please enter valid email-id'
  };
  public validators = [this.emailValidation];

  onSelectAppointment(e) {
    if (e.value != "0") {
      this.appointmentData1.forEach(appointment => {
        appointment.AppointmentTypeList.forEach(data => {
          if (data.Id == parseInt(e.value)) {
            this.calendarList = data.CalendarListForSlotBased;
          }
        })
      });
    } else {
      this.calendarList = [];
    }

    if (this.actionForm.controls.AppointmentId.value == this.quizActionData.AppointmentId) {
      this.selectedCalendarIds = this.quizActionData.CalendarIds;
    } else {
      this.selectedCalendarIds = [];
    }
  }

  addCalenderId(Id, CalendarName) {

    if (!this.selectedCalendarIds.includes(Id)) {
      this.selectedCalendarIds.push(Id);
    } else {
      var index = this.selectedCalendarIds.indexOf(Id);
      this.selectedCalendarIds.splice(index, 1)
    }
    this.actionForm.controls.CalendarIds.setValue(this.selectedCalendarIds);
    this.actionForm.markAsDirty();
  }

  onSelectAutomation(e) {
  }

  onAddingAction(tag: TagModel) {
    this.actionEmails.push(tag["value"]);
    this.actionForm.patchValue({
      ReportEmails: this.actionEmails.toString()
    });
  }

  /**
 * Patch value to usersEmail form backend data
 */

  patchUserEmailValueFromBackend(ReportEmails) {
    let userEmailarray: Array<Object> = [];
    ReportEmails.forEach((email) => {
      let obj = { display: email, value: email };
      userEmailarray.push(obj)
    })
    this.actionForm.patchValue({
      'ReportEmailsArray': userEmailarray
    });
  }

  /**
   * function call on submit/save button clicked
   */

  saveAction() {
    if (this.actionForm.dirty) { 
      
      if (this.actionForm.value.ActionType === 2) {
        let userEmailData = this.actionForm.value.ReportEmailsArray.map(function (item) {
          return item['value'];
        });
        this.actionForm.patchValue({
          ReportEmails: userEmailData.toString()
        })
      }
      this.quizBuilderApiService
        .updateQuizAction(this.actionForm.value)
        .subscribe(data => {
          $(window).off("beforeunload");
          this._markFormPristine(this.actionForm);
          // this.notificationsService.success("Success");
        });
      this.quizActionData.AppointmentId = parseInt(this.actionForm.value.AppointmentId);
      this.quizActionData.AutomationId = parseInt(this.actionForm.value.AutomationId);
      this.quizActionData.CalendarIds = this.actionForm.value.CalendarIds;
    }
    
    this.dubEmailArray = [];
    if(this.actionForm.controls.ReportEmailsArray.value.length){
    this.actionForm.controls.ReportEmailsArray.value.forEach(mail=>{
      if(typeof mail == "object"){
        this.dubEmailArray.push(mail.value);
      }else{
        this.dubEmailArray.push(mail);
      }
    })
  }else{
    this.dubEmailArray = [];
  }
  }

  private _markFormPristine(form: FormGroup): void {
    Object.keys(form.controls).forEach(control => {
      form.controls[control].markAsPristine();
    });
  }

  onPreviewQuiz(publishTemplate) {
    this.publishTemplate = publishTemplate;
    var quiz;
    this.quizBuilderApiService.getQuizDetails(this.quizId).subscribe(
      data => {
        quiz = data;
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
          // this.quizId = quiz.Id;
          // this.selectedQuiz = quiz;
          this.publishModal(publishTemplate, this.quizId, "PREVIEW");
        }
      },
      error => {
        this.notificationsService.error("Error");
      }
    );
  }

  //Modal confirm
  publish(): void {
    this.quizBuilderApiService.publishQuiz(this.quizId).subscribe(
      data => {
        this.notificationsService.success("Success");
        if (this.openMode === "PREVIEW") {
          this.onPreviewQuiz(this.publishTemplate);
        } else if (this.openMode === "SHARE") {
          this.onSharLinkClicked(this.shareTemplate, this.publishTemplate);
        }
        // this.selectedQuiz.IsPublished = true;
        // this.selectedQuiz.PublishedCode = data;
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

  publishModal(template: TemplateRef<any>, quizId, Mode) {
    this.openMode = Mode;
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
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

  /**
   * To publish Quiz against QuizId
   */
  onPublished() {
    this.quizBuilderApiService.publishQuiz(this.quizId).subscribe(
      data => {
        this.notificationsService.success("Success");
      },
      error => {
        this.notificationsService.error("Error");
      }
    );
  }

  /**
   * Create Share Quiz Template
   */
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

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
