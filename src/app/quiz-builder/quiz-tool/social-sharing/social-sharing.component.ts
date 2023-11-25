import {
  Component,
  OnInit,
  TemplateRef,
  Renderer2,
  Inject,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { QuizBuilderApiService } from "../../quiz-builder-api.service";
import { FormGroup, FormControl } from "@angular/forms";
import { NotificationsService } from "angular2-notifications";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { DOCUMENT, Location } from "@angular/common";
import { ShareQuizComponent } from "../../share-quiz/share-quiz.component";


@Component({
  selector: 'app-social-sharing',
  templateUrl: './social-sharing.component.html',
  styleUrls: ['./social-sharing.component.css']
})
export class SocialSharingComponent implements OnInit, OnDestroy {
  public quizId;
  public socialShareData;
  public socialShareForm: FormGroup;
  public modalRef: BsModalRef;
  public quizURL;
  public selectedQuiz;
  public hostURL;
  public openMode;
  public shareTemplate;
  public publishTemplate;
  @ViewChild("shareQuizTemplate", { read: ViewContainerRef , static:true})
  shareQuizTemplate: ViewContainerRef;

  constructor(
    private route: ActivatedRoute,
    private quizBuilderApiService: QuizBuilderApiService,
    private modalService: BsModalService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private router: Router,
    private notificationsService: NotificationsService,
    private location: Location,
    private _crf: ComponentFactoryResolver
  ) { }

  ngOnInit() {
   this.hostURL = this.location[
      "_platformLocation"
    ].location.host;
    /**
     * to get hte QuizId via parent routing params
     */
    this.route.parent.params.subscribe(params => {
      this.quizId = +params["id"];
    });

    /**
     * Api integration: To get Social Share Access according to QuizId
     */


    /**
     * create A new Form instance
     */
    this.socialShareForm = new FormGroup({
      QuizId: new FormControl(this.quizId),
      EnableFacebookShare: new FormControl(""),
      EnableLinkedinShare: new FormControl(""),
      EnableTwitterShare: new FormControl(""),
      HideSocialShareButtons: new FormControl("")
    });

    this.onSocialShareFormChanges()
    this.getSocialShare();
  }

  getSocialShare() {
    if (!this.quizId) return;

    this.quizBuilderApiService.getSocialShareAccess(this.quizId).subscribe(
      data => {
        this.socialShareData = data;
        this.socialShareForm.setValue({
          QuizId: data.QuizId,
          EnableFacebookShare: data.EnableFacebookShare,
          EnableLinkedinShare: data.EnableLinkedinShare,
          EnableTwitterShare: data.EnableTwitterShare,
          HideSocialShareButtons: data.HideSocialShareButtons
        })
      },
      error => {
        this.notificationsService.error("Error");
      }
    );
  }
  onSocialShareFormChanges() {
    this.socialShareForm.controls['HideSocialShareButtons'].valueChanges
      .subscribe((data) => {
        this.socialShareForm.markAsDirty();
        if (data) {
          this.socialShareForm.patchValue({
            EnableFacebookShare: false,
            EnableLinkedinShare: false,
            EnableTwitterShare: false
          })
          this.socialShareForm.get('EnableFacebookShare').disable();
          this.socialShareForm.get('EnableLinkedinShare').disable();
          this.socialShareForm.get('EnableTwitterShare').disable();
        } else {
          this.socialShareForm.get('EnableFacebookShare').enable();
          this.socialShareForm.get('EnableLinkedinShare').enable();
          this.socialShareForm.get('EnableTwitterShare').enable();
          this.socialShareForm.patchValue({
            EnableFacebookShare: this.socialShareData.EnableFacebookShare,
            EnableLinkedinShare: this.socialShareData.EnableLinkedinShare,
            EnableTwitterShare: this.socialShareData.EnableTwitterShare
          })
        }
      })
  }

  /**
   * Api Integration: To Update Social Share Access according to QuizId
   */
  onSocialShare() {
    if (this.socialShareForm.dirty)
      this.quizBuilderApiService
        .updateSocialShareAccess(this.socialShareForm.value)
        .subscribe(
          data => {
            this._markFormPristine(this.socialShareForm);
            this.notificationsService.success(
              "Social-Sharing",
              "Social Sharing has been Updated"
            );
          },
          error => {
            this.notificationsService.error(
              "Social-Sharing",
              "Something went wrong"
            );
          }
        );
  }
  private _markFormPristine(form: FormGroup): void {
    Object.keys(form.controls).forEach(control => {
      form.controls[control].markAsPristine();
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

  onPreviewQuiz(publishTemplate) {
    var quiz;
    this.publishTemplate = publishTemplate;
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
                this.renderer.removeStyle(this.document.body, "overflow");
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
        // this.selectedQuiz.IsPublished = true;
        // this.selectedQuiz.PublishedCode = data;
        if (this.openMode === "PREVIEW") {
          this.onPreviewQuiz(this.publishTemplate);
        } else if (this.openMode === "SHARE") {
          this.onSharLinkClicked(this.shareTemplate, this.publishTemplate);
        }
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

  publishModal(template: TemplateRef<any>, quizId, mode) {
    this.openMode = mode;
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
    this.onSocialShare();
  }
}
