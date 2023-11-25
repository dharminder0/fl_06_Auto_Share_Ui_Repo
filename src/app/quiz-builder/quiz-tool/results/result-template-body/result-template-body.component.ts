 import {
    Component,
    OnInit,
    Input,
    AfterViewInit,
    TemplateRef,
    OnChanges,
    SimpleChanges
  } from "@angular/core";
  import { FormGroup, FormControl, FormArray } from "@angular/forms";
  import { BsModalRef, BsModalService } from "ngx-bootstrap";
  import { Subscription } from "rxjs";
  import { NotificationsService } from "angular2-notifications";
  import { QuizBuilderApiService } from "../../../quiz-builder-api.service";
  import { environment } from "../../../../../environments/environment";
  import { FroalaEditorOptions } from "../../../email-sms/template-body/template-froala-options";
  import { QuizHelperUtil } from "../../../QuizHelper.util";
  import { QuizToolData } from "../../quiz-tool.data";
import { DynamicMediaReplaceMentsService } from "../../dynamic-media-replacement";
import { rightMenuEnum } from "../../rightmenu-enum/rightMenuEnum";
  declare var $: any;
  declare var cloudinary: any;

  @Component({
    selector: "app-result-template-body",
    templateUrl: "./result-template-body.component.html",
    styleUrls: ["./result-template-body.component.css"]
  })
  export class ResultTemplateBodyComponent implements OnInit, AfterViewInit {
    public notificationType = 1;
    @Input()
    templateForm: FormGroup;
    public sharedWithMe = true;
    public modalRef: BsModalRef;
    public templateId;
    public options : object ;
    public isFilterList:boolean=false;
    public froalaEditorOptions = new FroalaEditorOptions();
    public isEmailTemplate:boolean = true;
    public isSMSTemplate:boolean = true;
    public isDefaultTemplate:boolean = true;
    public isProcess:boolean = false;

    defaultModules = {
      toolbar: [
        ["bold", "italic", "underline", "strike"], // toggled buttons
        ["blockquote", "code-block"],

        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }], // superscript/subscript
        // [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        // [{ 'direction': 'rtl' }],                         // text direction
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ align: [] }],
        ["clean"], // remove formatting button

        ["link", "image"],
        ["showHtml"] // link and image, video
      ]
    };

    smsOptions = [
      {
        groupName: "Lead",
        options: [
          {
            name: "FIRST_NAME_%_FNAME_%",
            value: "%fname%"
          },
          {
            name: "LAST_NAME_%_LNAME_%",
            value: "%lname%"
          },
          {
            name: "PHONE_NUMBER_%_PHONE_%",
            value: "%phone%"
          },
          {
            name: "E_MAIL_ADDRESS_%_EMAIL_%",
            value: "%email%"
          },
          {
            name: "LEAD_ID_%_LEADID_%",
            value: "%leadid%"
          }
        ]
      },
      {
        groupName: "Automation",
        options: [
          {
            name: "AUTOMATION_NAME_%_QNAME_%",
            value: "%qname%"
          },
          // {
          //   name: "Automation Link : %qlink%",
          //   value: "%qlink%"
          // },
          {
            name: "AUTOMATION_RESULT/SCORE_%_QENDRESULT_%",
            value: "%qendresult%"
          }
        ]
      }
    ];

    constructor(
      private quizBuilderApiService: QuizBuilderApiService,
      private notificationsService: NotificationsService,
      private modalService: BsModalService,
      private quizToolData:QuizToolData,
      private dynamicMediaReplaceService:DynamicMediaReplaceMentsService
    ) {
      this.assignTagsForCloudinary();
    }

    private assignTagsForCloudinary(){
      if(this.quizToolData.getCurrentOfficeName()){
        this.C_tags = this.quizToolData.getCurrentOfficeName();
      }else{
        this.C_tags = []
      }
    }

    /**
     * Quill Editor  by default supports p tag to wrap the content due to which extra margin is added when send to mail
     * We have replaced the default `p` tag with div tag so that the extra margin is removed
     */
    // makeQuillEditorToReplacePTagWithDiv() {
    //   var Block = Quill.import("blots/block");
    //   Block.tagName = "DIV";
    //   Quill.register(Block, true);
    // }

    ngOnInit() {
     // this.froalaEditorOptions.dropdownBARResult();
      this.options = this.froalaEditorOptions.setEditorOptions();
    }

    onFilterList(){
      this.isFilterList = !this.isFilterList;
    }

    getEmailSmsTemplateBody() {
      this.quizBuilderApiService.getTemplateBody(this.sharedWithMe);
    }

    fetchTemplateBody() {
      if (!this.templateId) return;
      this.quizBuilderApiService.getTemplateBody(this.templateId).subscribe(
        data => {
          this.templateForm.patchValue({
            ResultTemplateId: data.Id,
            ResultTemplateBody: data.Body,
            ResultTemplateSMSText: data.SMSText,
            ResultTemplateSubject: data.Subject
          });

        const control = <FormArray>this.templateForm.controls['TemplateAttachmentList'];
          for(let i = control.length-1; i >= 0; i--) {
            control.removeAt(i)
              }
          data.TemplateAttachmentList.forEach((ele) => {
            (<FormArray>this.templateForm.get("TemplateAttachmentList")).push( 
              new FormGroup({
                FileName: new FormControl(ele.FileName),
                FileUrl: new FormControl(ele.FileUrl),
                FileIdentifier: new FormControl(ele.FileIdentifier)
              })
            )
          })
        },
        error => {
          this.notificationsService.error("Something went wrong");
        }
      );
    }

    smsDefaultTemplate() {
      this.quizBuilderApiService
        .getDefaultTemplate(this.notificationType)
        .subscribe(
          data => {
            this.templateForm.patchValue({
              ResultTemplateId: data.Id,
              ResultTemplateType: data.NotificationType,
              ResultTemplateSubject: data.Subject,
              ResultTemplateBody: data.Body,
              ResultTemplateSMSText: data.SMSText,
              QuizInTemplateList: data.QuizInTemplateList, //check it later
              // TemplateAttachmentList:  data.TemplateAttachmentList
            });
        
          },
          error => {
            this.notificationsService.error(
              "Template-Body",
              "Something Went Wrong"
            );
          }
        );
    }

    pasteHtmlAtCaret(html) {
      var sel, range;
      if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.deleteContents();

          // Range.createContextualFragment() would be useful here but is
          // non-standard and not supported in all browsers (IE9, for one)
          var el = document.createElement("div");
          el.innerHTML = html;
          var frag = document.createDocumentFragment(),
            node,
            lastNode;
          while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node);
          }
          range.insertNode(frag);

          // Preserve the selection
          if (lastNode) {
            range = range.cloneRange();
            range.setStartAfter(lastNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      }
    }

    /**
     * Modal for Default Template
     * @param template: template reference(#defaultTemplate)
     */
    openDefaultTemplateModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template, { class: "modal-sm" });
    }
    /**
     * confirm Default template
     */
    confirmDefaultTemplate(): void {
      this.smsDefaultTemplate();
      this.modalRef.hide();
    }

    /**
     * Decline Default Template
     */
    declineDefaultTemplate(): void {
      this.modalRef.hide();
    }

    onSmsVariableSelect(value) {
      this.isFilterList=false;
      var cursorPos = $("#sms-textarea").prop("selectionStart");
      var v = $("#sms-textarea").val();
      var textBefore = v.substring(0, cursorPos);
      var textAfter = v.substring(cursorPos, v.length);
      this.templateForm.controls.ResultTemplateSMSText.patchValue(
        textBefore + value + textAfter
      );
    }

    /**
     *
     * @param shareTemplate: copy to clipboard popup HTML Element reference
     * create an inline image URL
     */
    public imageORvideo: string = "image";
    public imageURL;
    addImageAttachment(shareTemplate) {

      var widget = cloudinary.createUploadWidget(
        environment.cloudinaryConfiguration,
        (error, result) => {
          if (!error && result[0].url) {
            var content = result[0].url.split(".");
            var contentType = content[content.length - 1];
            if (
              contentType === "jpg" ||
              contentType === "jpeg" ||
              contentType === "tiff" ||
              contentType === "jpg" ||
              contentType === "gif" ||
              contentType === "" ||
              contentType === "png"
            ) {
              this.imageORvideo = "image";
            } else {
              this.imageORvideo = "video";
            }
            if (!error && result[0].url) {
              var coordinate_crop = "",
                coordinate_scale = "",
                max_height = 50;
              if (
                result[0] &&
                result[0].coordinates &&
                result[0].coordinates.faces
              ) {
                var cloudCoordinate = result[0].coordinates.faces;
                coordinate_crop = `x_${cloudCoordinate[0][0]},y_${
                  cloudCoordinate[0][1]
                },w_${cloudCoordinate[0][2]},h_${cloudCoordinate[0][3]},c_crop`;

                if (cloudCoordinate[0][3] > max_height) {
                  let ratio = cloudCoordinate[0][2] / cloudCoordinate[0][3];
                  let max_width = Math.trunc(ratio * max_height);
                  coordinate_scale = `w_${max_width},h_${max_height},c_scale`;
                }
              }
              if (result[0].url.match("upload")) {
                var index = result[0].url.match("upload").index;
                result[0].url =
                  result[0].url.slice(0, index + 6) +
                  "/" +
                  coordinate_crop +
                  "/" +
                  coordinate_scale +
                  result[0].url.slice(index + 6 + Math.abs(0));
              }
            }
            this.imageURL = `<img src="${result[0].url}">`;
            this.openImageModal(result[0].url, shareTemplate);
            // attachControl.patchValue({ Description: result[0].url });
            // attachControl.controls.Description.markAsDirty();
          } else {
            console.log(
              "Error! Cloudinary upload widget error answerImage",
              error
            );
          }
        }
      );
      widget.open();
    }

    /**
     * * Tags for cloudinary
     */
    C_tags = []

    /**
     * 
     * @param Image Dimension
     */
    CM_recommended_image_dimensions = {
      width:250,
      height:250
    }

    CM_accepted_formats = ['image'];

    /**
     ** Callback when image is inserted using media widget
    * @param data : Data received from the Media widget
    */
    whenImageInsertedUsingMediaWidget(data,shareTemplate) {
      data.assets.forEach(asset => {
        let imageUrl = asset.derived ? asset.derived[0].secure_url : asset.secure_url;
        this.imageORvideo = QuizHelperUtil.getFileType(imageUrl);
        this.imageURL = `<img src="${imageUrl}">`;
        this.openImageModal(imageUrl, shareTemplate);
      });
    }

    /**
     * *Callback when image is inserted using upload widget
     * @param callbackObject { error: any, result : any}
     */
    whenImageInsertedUsingUploadWidget(callbackObject: { error: any, result: any },shareTemplate): void {
      let error = callbackObject.error;
      let result = callbackObject.result

      if (!error && result[0].url) {
        this.imageORvideo = QuizHelperUtil.getFileType(result[0].url);
        let url = QuizHelperUtil.applyCoorniateFacesInUrl(result[0].url, result[0].coordinates)
        this.imageURL = `<img src="${url}">`;
        this.openImageModal(url, shareTemplate);
      } else {
        console.log(
          "Error! Cloudinary upload widget error questionImage",
          error
        );
      }
    }

    openImageModal(resultUrl, shareTemplate) {
      this.modalRef = this.modalService.show(shareTemplate);
    }
    addQuizNameText() {
      var cursorPos = $('#subject').prop('selectionStart');
      var v = $('#subject').val();
      var textBefore = v.substring(0, cursorPos);
      var textAfter = v.substring(cursorPos, v.length);
      this.templateForm.controls['ResultTemplateSubject'].patchValue(
        textBefore + "%qname%" + textAfter
      );
    }

    ngAfterViewInit() {
      var that = this;
      // var str = `<select id="dropdown" class="form-control myDropdown ql-size">
      // <option value="">Insert Variable Field</option>
      // <optgroup label="Client">
      //   <option value="%fname%" >First Name : %fname%</option>
      //   <option value="%lname%" >Last Name : %lname%</option>
      //   <option value="%phone%" >Phone : %phone%</option>
      //   <option value="%email%" >Email : %email%</option>
      // </optgroup>
      // <optgroup label="Appointment">
      //   <option value="%qname%" >Automation Name : %qname%</option>
      //   <option value="%qlink%" >Automation Link : %qlink%</option>
      //   <option value="%qendresult%" >Automation End Result/Score : %qendresult%</option>
      // </optgroup>
      // </select>`;
      // var str1 = `<select id="dropdown1" class="form-control myDropdown ql-size">
      // <option value="">Insert Variable Field</option>
      // <optgroup label="Client">
      //   <option value="%fname%" >First Name : %fname%</option>
      //   <option value="%lname%" >Last Name : %lname%</option>
      //   <option value="%phone%" >Phone : %phone%</option>
      //   <option value="%email%" >Email : %email%</option>
      //   <option value="%leadid%" >Lead Id : %leadid%</option>
      // </optgroup>
      // <optgroup label="Appointment">
      // <option value="%qname%" >Automation Name : %qname%</option>
      // <option value="%qlink%" >Automation Link : %qlink%</option>
      // <option value="%qendresult%" >Automation End Result/Score : %qendresult%</option>
      // </optgroup>
      // </select>`;
      // var customButton = document.querySelectorAll(".ql-showHtml");
      // customButton[0].innerHTML = "add button";
      // customButton[0].parentElement.insertAdjacentHTML("beforeend", str);
      // customButton[0].classList.add("hide");
      // customButton[1].innerHTML = 'add button';
      // customButton[1].parentElement.insertAdjacentHTML('beforeend', str1);
      // customButton[1].classList.add('hide');
      // document
      //   .getElementById("dropdown")
      //   .addEventListener("change", function($event) {
      //     $(".beta .ql-editor").focus();
      //     that.pasteHtmlAtCaret($event.target["value"]);
      //     $event.target["value"] = "";
      //   });
      // document.getElementById('dropdown1').addEventListener('change', function ($event) {
      //   $('.sms-editor .ql-editor').focus();
      //   that.pasteHtmlAtCaret($event.target['value']);
      //   $event.target['value'] = '';
      // })
      $("#dropdown")
        .parent("span")
        .addClass("float-right");
      // $("#dropdown1").parent('span').addClass('float-right1')

      if (this.notificationType == 5) {
        $('option[value="%ical%"]').hide();
        $('option[value="%gcal%"]').hide();
        $('option[value="%rclink%"]').hide();
      }

      if (this.notificationType == 1) {
        $('option[value="%rclink%"]').hide();
      }
    }

  }
