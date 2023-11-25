import {
  Component,
  OnInit,
  TemplateRef,
  Inject,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver
} from "@angular/core";
import { FormGroup, FormControl, FormArray, Validators } from "@angular/forms";
import { ActivatedRoute, Router, NavigationStart } from "@angular/router";
import { QuizBuilderApiService } from "../../quiz-builder-api.service";
import { environment } from "../../../../environments/environment";
import { NotificationsService } from "angular2-notifications";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { DOCUMENT, Location } from "@angular/common";
import { Subscription } from "rxjs/Subscription";
import { QuizHelperUtil } from "../../QuizHelper.util";
import { ShareQuizComponent } from "../../share-quiz/share-quiz.component";
import { UserInfoService } from "../../../shared/services/security.service";
import { Config } from '../../../../config';
import { CommonService } from "../../../shared/services/common.service";
declare var cloudinary: any;
declare var $: any;
@Component({
  selector: "app-attachments",
  templateUrl: "./attachments.component.html",
  styleUrls: ["./attachments.component.css"]
})
export class AttachmentsComponent implements OnInit, OnDestroy {
  public attachmentsForm: FormGroup;
  public quizId;
  public attachmentData;
  public publishTemplate;
  public openMode;
  public shareTemplate;
  public modalRef: BsModalRef;
  public quizURL;
  public hostURL;
  public routerEventSubcription: Subscription;
  public defaultImage:any="https://res.cloudinary.com/dbbkqtyqn/image/upload/c_fill,w_338,h_148,g_auto,q_auto:best,f_auto/v1588680596/Jobrock/automation-place-holder-corner.png";
  @ViewChild("shareQuizTemplate", { read: ViewContainerRef , static:true})
  shareQuizTemplate: ViewContainerRef;
  public hoverOnImage:any = {};
  //mediafile
  public isVisibleMediaLibrary:boolean=false;
  public config = new Config();
  public attachControlUseMedia:any;

  constructor(
    private quizBuilderApiService: QuizBuilderApiService,
    private route: ActivatedRoute,
    private notificationsService: NotificationsService,
    private router: Router,
    private userInfoService: UserInfoService,
    private modalService: BsModalService,
    @Inject(DOCUMENT) private document: Document,
    private location: Location,
    private _crf : ComponentFactoryResolver,
    private commonService:CommonService
  ) {}



  ngOnInit() {

    this.hostURL = this.location[
      "_platformLocation"
    ].location.host;

    this.route.parent.params.subscribe(params => {
      this.quizId = +params["id"];
    });
    this.getAttachmentDetails();
  }

  getAttachmentDetails(){
    let self=this;
    this.quizBuilderApiService.getAttachments(this.quizId).subscribe(function(res){
      self.attachmentData=res;
      self.initializeForm();
      self.formValueChanges();
      self.routerParamSubscription();
    });
  }

  initializeForm() {
    this.attachmentsForm = new FormGroup({
      QuizId: new FormControl(this.attachmentData[0].QuizId),
      Attachments: new FormArray([])
    });
    this.attachmentData[0].Attachments.forEach((attachData, index) => {
      let uploadIndex=attachData.Description.indexOf( "upload/");
      let uploadedSubstring=attachData.Description.substring(0,(uploadIndex+7));
      let c_cropIndex=attachData.Description.indexOf( "c_crop/");
      if(c_cropIndex != -1){
      let c_cropSubstring=attachData.Description.substring(c_cropIndex+7);
      attachData.Description=uploadedSubstring + c_cropSubstring;
      attachData.Description = attachData.Description.replace('upload/', "upload/c_fill,w_338,h_148,g_auto,q_auto:best,f_auto/");
      }
      (<FormArray>this.attachmentsForm.get("Attachments")).push(
        new FormGroup({
          Title: new FormControl(attachData.Title),
          Description: new FormControl(attachData.Description),
          imageORvideo: new FormControl("image")
        })
      );

      let contentType = this.commonService.getImageOrVideo(attachData.Description);
      this.attachmentsForm.controls.Attachments["controls"][index].patchValue(
        { imageORvideo: contentType }
      );
    });
  }

  formValueChanges() {
    this.attachmentsForm.valueChanges.subscribe(data => {
      $(document).ready(function () {
        $(window).on("beforeunload", function () {
          // return confirm("Do you really want to close?");
          return "";
        });
      });
    });
  }

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

  addAttachments() {
    (<FormArray>this.attachmentsForm.get("Attachments")).push(
      new FormGroup({
        Title: new FormControl(""),
        Description: new FormControl("", Validators.required),
        imageORvideo: new FormControl("image")
      })
    );
  }

  removeAttachmentImage(attachmentControl, index) {
    attachmentControl.patchValue({ Description: "" });
    attachmentControl.patchValue({ imageORvideo: "image" });
    attachmentControl.controls.Description.markAsDirty();
  }

  private removeDataFromAttachmentsControl(index) {
    const control = <FormArray>this.attachmentsForm.controls["Attachments"];
    control.removeAt(index);
  }

  /**
   * Subscription for listening to router change
   */
  private routerParamSubscription() {
    this.routerEventSubcription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.saveAttachments();
      }
    });
  }

     //use Media Lib

     onUseMedia(attachControl, index){
      if(this.config.disableMedia){
        this.uploadAttachmentImage(attachControl, index);
      }else{
        this.attachControlUseMedia=attachControl;
        this.isVisibleMediaLibrary=true;
      }
    }

    changeUploadedUrl(event){
      if(event.message == "success"){
        if (event.externalUrl) {
          let contentType = this.commonService.getImageOrVideo(event.externalUrl);
          this.attachControlUseMedia.patchValue({ imageORvideo: contentType });
          this.attachControlUseMedia.patchValue({ Description: event.externalUrl });
        }
        this.attachControlUseMedia.controls.Description.markAsDirty();
      }
      this.isVisibleMediaLibrary=false;
    }

  /**
   * Function to upload image
   */
  uploadAttachmentImage(attachControl, index) {
    var env = Object.assign({}, environment.cloudinaryConfiguration)
    env.upload_preset = "wtc9p7id";
    var widget = cloudinary.createUploadWidget(
      env,
      function(error, result) {
        if (!error && result[0].secure_url) {
          let contentType = this.commonService.getImageOrVideo(result[0].secure_url);
          attachControl.patchValue({ imageORvideo: contentType });
          var coordinate = "";
          if (
            result[0] &&
            result[0].coordinates &&
            result[0].coordinates.faces
          ) {
            var cloudCoordinate = result[0].coordinates.faces;
            coordinate = `x_${cloudCoordinate[0][0]},y_${
              cloudCoordinate[0][1]
            },w_${cloudCoordinate[0][2]},h_${cloudCoordinate[0][3]},c_crop`;
          }
          if (result[0].secure_url.match("upload")) {
            var index = result[0].secure_url.match("upload").index;
            result[0].secure_url =
              result[0].secure_url.slice(0, index + 6) +
              "/" +
              coordinate +
              result[0].secure_url.slice(index + 6 + Math.abs(0));
          }
            let uploadIndex=result[0].secure_url.indexOf( "image/upload/");
            if(uploadIndex != -1){
            let uploadedSubstring=result[0].secure_url.substring(0,(uploadIndex+13));
            let c_cropIndex=result[0].secure_url.indexOf( "c_crop/");
            if(c_cropIndex != -1){
            let c_cropSubstring=result[0].secure_url.substring(c_cropIndex+7);
            result[0].secure_url=uploadedSubstring + c_cropSubstring;
            result[0].secure_url = result[0].secure_url.replace('upload/', "upload/c_fill,w_338,h_148,g_auto,q_auto:best,f_auto/");
            }
            }
          attachControl.patchValue({ Description: result[0].secure_url });
          attachControl.controls.Description.markAsDirty();
        } else {
          console.log(
            "Error! Cloudinary upload widget error answerImage",
            error
          );
        }
      }
    );
    widget.open(attachControl.controls.Description.value);
  }

  removeAttachmentsImage(attachControl, index) {
    attachControl.controls.Description.markAsDirty();
    this.removeDataFromAttachmentsControl(index);
  }

  getAttachmentsList(forms) {
    return forms.get("Attachments").controls;
  }

  saveAttachments() {
    if (this.attachmentsForm.dirty) {
      this.quizBuilderApiService
        .addNewAttachments(this.attachmentsForm.value)
        .subscribe(
          data => {
            $(window).off("beforeunload");
            // this.notificationsService.success("Added");
            this._markFormPristine(this.attachmentsForm);
          },
          error => {
            // this.notificationsService.error("Error");
          }
        );
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

  publishModal(template: TemplateRef<any>, quizId, Mode) {
    this.openMode = Mode;
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
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
   * *CLoudinary Upload Widget Extra configuration
   */
  cloudinaryUploadWidgetConfigurations = {
    cropping_aspect_ratio: 1,
    upload_preset:'wtc9p7id',
    min_image_width: '250',
    min_image_height: '250',

    folder: this.userInfoService._info.CloudinaryBaseFolder
  }

  /**
   * * Tags for cloudinary
   */
  C_tags = []

  CM_accepted_formats = ['image','video','pdf'];

  /**
   ** Callback when image is inserted using media widget
   * @param data : Data received from the Media widget
   */
  whenImageInsertedUsingMediaWidget(data, attachControl, index) {
    data.assets.forEach(asset => {
      let imageUrl = asset.derived ? asset.derived[0].secure_url : asset.secure_url;
      let filetype = QuizHelperUtil.getFileType(imageUrl);
      attachControl.patchValue({ imageORvideo: filetype });
      attachControl.patchValue({ Description: imageUrl });
      attachControl.controls.Description.markAsDirty();
    });
  }

  /**
   * *Callback when image is inserted using upload widget
   * @param callbackObject { error: any, result : any}
   */
  whenImageInsertedUsingUploadWidget(callbackObject: { error: any, result: any }, attachControl, index): void {
    let error = callbackObject.error;
    let result = callbackObject.result

    if (!error && result[0].url) {
      let filetype = QuizHelperUtil.getFileType(result[0].url);
      attachControl.patchValue({ imageORvideo: filetype });
      let url = QuizHelperUtil.applyCoorniateFacesInUrl(result[0].secure_url, result[0].coordinates)
      attachControl.patchValue({ Description: url });
      attachControl.controls.Description.markAsDirty();
    } else {
      console.log(
        "Error! Cloudinary upload widget error questionImage",
        error
      );
    }

  }


  ngOnDestroy() {
    if (this.routerEventSubcription) {
      this.routerEventSubcription.unsubscribe();
    }
  }
}
