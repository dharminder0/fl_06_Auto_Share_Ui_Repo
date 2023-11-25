import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  TemplateRef,
  AfterViewInit,
  Input
} from "@angular/core";
import { QuizBuilderApiService } from "../../quiz-builder-api.service";
import {
  ActivatedRoute,
  Router,
  NavigationStart,
  NavigationEnd
} from "@angular/router";
import { QuizzToolHelper } from "../quiz-tool-helper.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { skip } from "rxjs/operator/skip";
import { MultipleResultSettingComponent } from "../multiple-result-setting/multiple-result-setting.component";
import { NotificationsService } from "angular2-notifications";
import { ShareQuizComponent } from "../../share-quiz/share-quiz.component";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Subscription } from "rxjs/Subscription";
import { FroalaEditorOptions } from "../../email-sms/template-body/template-froala-options";
import { QuizBuilderDataService } from '../../quiz-builder-data.service';
declare var $: any;

@Component({
  selector: "app-show-multiple-result",
  templateUrl: "./show-multiple-result.component.html",
  styleUrls: ["./show-multiple-result.component.css"]
})
export class ShowMultipleResultComponent implements OnInit,AfterViewInit, OnDestroy {
  @Input() isOpenBranchingLogicSide;
  public multipleDataSubscription;
  public multipleResultData;
  public resultData = [];
  public progressBarValues = [];
  public radioValue = false;
  public multipleResultForm: FormGroup;
  public graphColor;
  public btnColor;
  public btnFontColor;
  public routerSubscription;
  public quizId;
  public maxScoreSubscription;
  public duplicateMax;
  public dublicateCur;
  public dublicateLead;

  public formValueSubscription: Subscription;
  private isStylingSubscription: Subscription;
  public brandingColor;
  @ViewChild("resultSettingsTemplate", { read: ViewContainerRef , static:true})
  resultSettingsTemplate: ViewContainerRef;
  public options:Object;
  public froalaEditorOptions = new FroalaEditorOptions();
  public classList =["top-result"];

  constructor(
    private quizBuilderApiService: QuizBuilderApiService,
    private route: ActivatedRoute,
    private router: Router,
    private quizToolHelper: QuizzToolHelper,
    private _cfr: ComponentFactoryResolver,
    private notificationsService: NotificationsService,
    private modalService: BsModalService,
    private quizBuilderDataService:QuizBuilderDataService
  ) {}

  ngOnInit() {
    this.options = this.froalaEditorOptions.setEditorOptions(200);
    this.getPersonalityResultSettings();
    this.createForm();
    this.routerChangeSubscription();
    this.subscribeData();
    this.getBrandingColors();
    let self = this;
    this.quizBuilderDataService.currentQuizSaveAll.subscribe(function(res){
      if(res){
        self.saveResult();
      }
    });
  }
  getBrandingColors(){
    this.isStylingSubscription = this.quizToolHelper.isStylingObservable.subscribe((data) => {
      if(data && Object.keys(data).length > 0){
         this.brandingColor = data
      }
      else{
        this.brandingColor = this.quizToolHelper.getBrandingAndStyling();
      }
   })
  }

  ngAfterViewInit() {
    this.classList.forEach((data) => {
      this.setStyling(data);
    });
  }
  setStyling(elem) {
    
    // if(elem == 'details-button'){
    //   setTimeout(()=>{
    //     
    //     var data = document.getElementsByClassName('details-button')
    //     for(let i =0 ; i < data.length; i++){
    //       var tempData = data[i].childNodes[1].childNodes[0]['style'];
    //       tempData.background = this.btnColor;
    //       tempData.color = this.btnFontColor;
    //     }
    //   },100)
    // }
    // else{
      var data = document.getElementsByClassName(elem)[0].childNodes[1].childNodes[0]['style'];
      data.background = this.brandingColor.BackgroundColor;
      data.color = this.brandingColor.FontColor;
      data.fontFamily = this.brandingColor.FontType
    // }
 
  }

  routerChangeSubscription() {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.saveResult();
      }
    });
  }

  public isOpenSizeTooltip: boolean = false;
  public isOpenColorTooltip: boolean = false;

  getPersonalityResultSettings() {
    this.multipleDataSubscription = this.quizToolHelper.updateMultipleData.subscribe(
      data => {
        this.quizBuilderApiService
          .getPersonalityResultSettings(this.route.parent.snapshot.params.id)
          .subscribe(data => {
            this.multipleResultData = data;
            this.resultData = [];
            this.resultData.push(
              ...this.multipleResultData[0]["ResultDetails"]
            );
            this.progressBarValues = [];
            this.getProgressBarValues();
            this.setFormValue();
            this.duplicateMax = this.multipleResultData[0].MaxResult;
            this.dublicateLead= this.multipleResultData[0].ShowLeadUserForm;
            this.dublicateCur = this.multipleResultData[0][
              "ResultDetails"
            ].length;
          });
      }
    );
  }

  getProgressBarValues() {
    for (var i = 0; i < this.resultData.length; i++) {
      var val = Math.floor(100 / Math.pow(2, i + 1));
      this.progressBarValues[i] = val;
    }
  }

  saveResult() {
    if (this.multipleResultForm.dirty) {
      this.quizBuilderApiService
        .updatePersonalittyResultSettings(this.multipleResultForm.value)
        .subscribe(
          data => {
            $(window).off("beforeunload");
            this._markFormPristine(this.multipleResultForm);
            this.notificationsService.success("Success");
          },
          error => {
            this.notificationsService.error("Error");
          }
        );
    }
  }

  private _markFormPristine(form: FormGroup): void {
    Object.keys(form.controls).forEach(control => {
      form.controls[control].markAsPristine();
    });
  }

  createForm() {
    this.multipleResultForm = new FormGroup({
      Title: new FormControl(),
      ButtonColor: new FormControl("#000"),
      ButtonFontColor: new FormControl("#000"),
      GraphColor: new FormControl("#000"),
      IsFullWidthEnable: new FormControl(),
      SideButtonText: new FormControl("", Validators.required),
      Id: new FormControl(null, Validators.required),
      QuizId: new FormControl(null, Validators.required),
      Status: new FormControl(),
      MaxResult: new FormControl(),
      LastUpdatedOn: new FormControl(),
      LastUpdatedBy: new FormControl(),
      // ShowLeadUserForm: new FormControl()
    });
  }

  setFormValue() {
    this.multipleResultForm.patchValue({
      Title: this.multipleResultData[0].Title,
      ButtonColor: this.multipleResultData[0].ButtonColor
        ? this.multipleResultData[0].ButtonColor
        : "#000",
      ButtonFontColor: this.multipleResultData[0].ButtonFontColor
        ? this.multipleResultData[0].ButtonFontColor
        : "#000",
      GraphColor: this.multipleResultData[0].GraphColor
        ? this.multipleResultData[0].GraphColor
        : "#000",
      IsFullWidthEnable: this.multipleResultData[0].IsFullWidthEnable,
      SideButtonText: this.multipleResultData[0].SideButtonText,
      Id: this.multipleResultData[0].Id,
      QuizId: this.multipleResultData[0].QuizId,
      Status: this.multipleResultData[0].Status,
      MaxResult: this.multipleResultData[0].MaxResult,
      LastUpdatedOn: this.multipleResultData[0].LastUpdatedOn,
      LastUpdatedBy: this.multipleResultData[0].LastUpdatedBy,
      // ShowLeadUserForm: this.multipleResultData[0].ShowLeadUserForm
    });
    this.onChanges();
    this.setFullWidth();
    this.quizId = this.route.parent.snapshot.params.id;
  }

  onChanges() {
    this.graphColor = this.multipleResultForm.controls.GraphColor.value;
    this.btnColor = this.multipleResultForm.controls.ButtonColor.value;
    this.btnFontColor = this.multipleResultForm.controls.ButtonFontColor.value;
    this.multipleResultForm.valueChanges.subscribe(data => {
      this.multipleResultForm.markAsDirty();
      $(document).ready(function() {
        $(window).on("beforeunload", function() {
          // return confirm("Do you really want to close?");
          return "";
        });
      });
      this.graphColor = data.GraphColor
        ? data.GraphColor
        : this.setGraphColor();
      this.btnColor = data.ButtonColor
        ? data.ButtonColor
        : this.setButtonColor();
      this.btnFontColor = data.ButtonFontColor
        ? data.ButtonFontColor
        : this.setButtonFontColor();
      this.setFullWidth();
      // this.setStyling('details-button');
    });
  }

  setGraphColor() {
    this.multipleResultForm.patchValue({
      GraphColor: "#000000"
    });
    return "#000000";
  }

  setButtonColor() {
    this.multipleResultForm.patchValue({
      ButtonColor: "#000000"
    });
    return "#000000";
  }

  setButtonFontColor() {
    this.multipleResultForm.patchValue({
      ButtonFontColor: "#000000"
    });
    return "#000000";
  }

  setFullWidth() {
    if (this.multipleResultForm.controls.IsFullWidthEnable.value == true) {
      this.radioValue = true;
    } else {
      this.radioValue = false;
    }
  }

  // setLeadForm() {
  //   if (this.multipleResultForm.controls.ShowLeadUserForm.value == true) {
  //     this.radioValue = true;
  //   } else {
  //     this.radioValue = false;
  //   }
  // }

  dynamicTemplateSettings() {
    this.resultSettingsTemplate.clear();
    var RES_settingsTemplate = this._cfr.resolveComponentFactory(
      MultipleResultSettingComponent
    );
    var RES_settingsComponentRef = this.resultSettingsTemplate.createComponent(
      RES_settingsTemplate
    );
    RES_settingsComponentRef.instance.max = this.duplicateMax;
    RES_settingsComponentRef.instance.curResults = this.dublicateCur;
    RES_settingsComponentRef.instance.showLeadForm = this.dublicateLead;
  }

  onSizeTooltipShown() {
    this.isOpenSizeTooltip = true;
  }

  onSizeTooltipHidden() {
    this.isOpenSizeTooltip = false;
  }

  onColorTooltipShown() {
    this.isOpenColorTooltip = true;
  }

  onColorTooltipHidden() {
    this.isOpenColorTooltip = false;
  }

  subscribeData() {
    this.maxScoreSubscription = this.quizToolHelper.maxScore.subscribe(data => {
      (this.duplicateMax = data["maxScore"]),
        (this.dublicateCur = data["CurrentRes"]);
        (this.dublicateLead = data["showLead"]);
    });
  }

  saveProgressBarSize() {
    this.quizBuilderApiService
      .updateResultProgressBarWidth(
        this.quizId,
        this.multipleResultForm.controls["IsFullWidthEnable"].value
      )
      .subscribe(
        data => {
          this.notificationsService.success("Progress bar has updated");
        },
        error => {
          this.notificationsService.error("Something wen wrong");
        }
      );
  }

  saveColors() {
    this.saveResult();
  }

  public publishTemplate;
  @ViewChild("shareQuizTemplate", { read: ViewContainerRef , static:true})
  shareQuizTemplate: ViewContainerRef;
  private openMode;
  public modalRef: BsModalRef;

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

  /**
   * Create Share Quiz Template
   */
  dynamicTemplateShare() {
    this.shareQuizTemplate.clear();
    this.quizBuilderApiService.getQuizDetails(this.quizId).subscribe(quiz => {
      var SHARE_QuizTemplate = this._cfr.resolveComponentFactory(
        ShareQuizComponent
      );
      var SHARE_QuizComponentRef = this.shareQuizTemplate.createComponent(
        SHARE_QuizTemplate
      );
      SHARE_QuizComponentRef.instance.quizData = quiz;
    });
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

  publishModal(template: TemplateRef<any>, quizId, Mode) {
    this.openMode = Mode;
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  ngOnDestroy() {
    this.multipleDataSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
    this.maxScoreSubscription.unsubscribe();
    if(this.isStylingSubscription){
      this.isStylingSubscription.unsubscribe();
    }
    if(this.formValueSubscription){
      this.formValueSubscription.unsubscribe();
    }
  }
}
