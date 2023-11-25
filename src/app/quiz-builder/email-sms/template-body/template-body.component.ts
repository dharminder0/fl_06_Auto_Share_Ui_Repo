  import {
    Component,
    OnInit,
    Input,
    AfterViewInit,
    TemplateRef,
    OnDestroy
  } from "@angular/core";
  import { FormGroup, FormControl, FormArray } from "@angular/forms";
  import { BsModalRef, BsModalService } from "ngx-bootstrap";
  import { Subscription } from "rxjs";
  import { NotificationsService } from "angular2-notifications";
  import { EmailSmsSubjectService } from "../email-sms-subject.service";
  import { QuizBuilderApiService } from "../../quiz-builder-api.service";
  import { environment } from "../../../../environments/environment";
  import { FroalaEditorOptions } from "./template-froala-options";
  import { QuizHelperUtil } from "../../QuizHelper.util";
  import { UserInfoService } from "../../../shared/services/security.service";
  import { VariablePopupService } from "../../../shared/services/variable-popup.service";
  import { Config } from "../../../../config";
import { CommunicationModes } from "../../quiz-tool/commonEnum";
import { SharedService } from "../../../shared/services/shared.service";
  declare var $: any;
  declare var cloudinary: any;

  @Component({
    selector: "app-template-body",
    templateUrl: "./template-body.component.html",
    styleUrls: ["./template-body.component.css"]
  })
  export class TemplateBodyComponent implements OnInit, AfterViewInit, OnDestroy {
    _notificationType
    @Input()
    set notificationType(value){
      this._notificationType = value;
      this.assignTagsForCloudinary();
    };

    get notificationType(){
      return this._notificationType;
    }

    get communicationModes(): typeof CommunicationModes {
      return CommunicationModes;
    }
    
    public clientDomain:string = "";
    public sharedWithMe = true;
    public templateBodyForm: FormGroup;
    public modalRef: BsModalRef;
    public templateId;
    public sharedWithMeSubscription: Subscription;
    public templateIdSubscription: Subscription;
    public options : object;
    public optionsSMS: object;
    public optionsWhatsapp: object;
    public froalaEditorOptions = new FroalaEditorOptions();
    public froalaEditorOptionsSMS = new FroalaEditorOptions();
    public froalaEditorOptionsWhatsapp = new FroalaEditorOptions();
    public deleteTempateObject: { template_id: any};
    // get template list
    public officeId:any;
    public offsetValue:any;
    public officeList:any;
    public businessUserEmail:any;
    public isFilterList:boolean=false;
    public selectedName:any;
    public emailSignature;
    public isOpenPopup: boolean = false;
    public allowedVariblesFor: string = 'automation';
    public msg_html: any;
    public whatsAppTemplateDataAvailable:boolean = false;
    public isTemplateEmailBodyVariablePopupOpen: boolean = false;
    public isLoaderEnable: boolean = true;
    public followUpMessage: any;
    public isEnableWhatsappTemplate:boolean = false;
    public userInfo: any = {};
    public config: any;
    public isEnableWhatsappSection:boolean = false;
    
    automationTemObjPreview:any = {};
    public enabledPermissions:any = {};
    public showFollowUpMsg:boolean = false;
    // defaultModules = {
    //   toolbar: [
    //     ["bold", "italic", "underline", "strike"], // toggled buttons
    //     ["blockquote", "code-block"],

    //     [{ header: 1 }, { header: 2 }], // custom button values
    //     [{ list: "ordered" }, { list: "bullet" }],
    //     [{ script: "sub" }, { script: "super" }], // superscript/subscript
    //     // [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    //     // [{ 'direction': 'rtl' }],                         // text direction
    //     [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    //     [{ font: [] }],
    //     // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    //     [{ header: [1, 2, 3, 4, 5, 6, false] }],
    //     [{ align: [] }],
    //     ["clean"], // remove formatting button

    //     ["link", "image"],
    //     ["showHtml"] // link and image, video
    //   ]
    // };

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
          {
            name: "AUTOMATION_LINK_%_QLINK_%",
            value: "%qlink%"
          }
        ]
      }
    ];

    constructor(
      private emailSmsSubjectService: EmailSmsSubjectService,
      private quizBuilderApiService: QuizBuilderApiService,
      private notificationsService: NotificationsService,
      private userInfoService:UserInfoService,
      private variablePopupService: VariablePopupService,
      private modalService: BsModalService,
      private sharedService: SharedService
      ) {
      // this.makeQuillEditorToReplacePTagWithDiv();
      // this.options = this.froalaEditorOptions.editorOptions;
      this.userInfo =  this.userInfoService._info;
      this.enabledPermissions = JSON.parse(JSON.stringify(this.userInfoService.userPermissions));
      if(!this.enabledPermissions.isJRSalesforceEnabled || this.userInfo.AccountLoginType != 'salesforce' || !this.enabledPermissions.isNewVariablePopupEnabled){
        this.showFollowUpMsg = true;
      }
      this.config = new Config();
      this.assignTagsForCloudinary();
      this.officeList = this.userInfoService.get().OfficeList;
      this.clientDomain = this.userInfoService.get().Domain? this.userInfoService.get().Domain : "link.jobrock.com";
      this.getEmailSignature();
    }

    officeIdChangeSubscription:Subscription;
    assignTagsForCloudinary(){

      /**
       * Inner function invoked initially and when office changes
       * @param id officeid
       */
      function assignId(id){
        let officeid = id;
        let officeList = this.userInfoService.get().OfficeList;
        if(officeid && officeList && officeList.length){
          for(var office = 0 ; office < officeList.length ; office++){
            if(officeList[office].id == officeid){
              this.C_tags = officeList[office].name;
              return ;
            }
          }
          this.C_tags = [];
        }else{
          this.C_tags = [];
        }
      }

      /**
       * Initially this code is executed
       */
      let officeid = localStorage.getItem('officeId');
      assignId.bind(this)(officeid);

      /**
       * Listens for office id change. If changes then tags are updated
       */
      this.officeIdChangeSubscription = this.emailSmsSubjectService.officeIdSubject.subscribe(id=>{
        if(id){
          assignId.bind(this)(id);
        }
      })
    
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
      this.isEnableWhatsappTemplate = this.config.enableWhatsAppTemplate;
      if(this.isEnableWhatsappTemplate){
        this.getAllLanguageList();
        this.getWhastappHsmTemplate();
      }

      this.offsetValue = this.userInfoService.get().OffsetValue;
      this.businessUserEmail = this.userInfoService.get().UserName;

      // this.froalaEditorOptions.dropdownBAR();
      this.options = this.froalaEditorOptions.setEditorOptions();
      this.options["events"]["froalaEditor.keyup"] = (e, editor) => {
        editor.selection.save();                        
        this.templateBodyForm.get("Body").patchValue(editor.html.get(true));
        editor.selection.restore();
      };
      this.froalaEditorOptions.customPopupBtn();

      this.optionsSMS = this.froalaEditorOptionsSMS.setEditorOptions();
      this.optionsSMS["events"]["froalaEditor.keyup"] = (e, editor) => {    
        editor.selection.save();                       
        this.templateBodyForm.get("SMSText").patchValue(editor.html.get(true));
        editor.selection.restore();
      };
      this.optionsSMS['toolbarButtons'] = ['my_dropdown'];
      this.froalaEditorOptionsSMS.customPopupBtn();
      
      this.optionsWhatsapp = this.froalaEditorOptionsWhatsapp.setEditorOptions();
      this.optionsWhatsapp['toolbarButtons'] = ['my_dropdown'];
      this.froalaEditorOptionsWhatsapp.customPopupBtn();

      let msgVariablesObj:any = {};
      msgVariablesObj[CommunicationModes.EmailTemplateMsg] = new FormControl([]);
      msgVariablesObj[CommunicationModes.SmsTemplateMsg] = new FormControl([]);
      msgVariablesObj[CommunicationModes.WhatsappTemplateMsg] = new FormControl([]);

      this.templateBodyForm = new FormGroup({
        Id: new FormControl(""),
        OfficeId: new FormControl(""),
        NotificationType: new FormControl(this.notificationType),
        Subject: new FormControl(""),
        TemplateTitle: new FormControl(""),
        EmailLinkVariable : new FormControl(""),
        Body: new FormControl(""),
        SMSText: new FormControl(""),
        QuizInTemplateList: new FormArray([]),
        TemplateAttachmentList: new FormArray([]),
        MsgVariablesObj: new FormGroup(msgVariablesObj)

      });
      
      this.sharedWithMeSubscription = this.emailSmsSubjectService.sharedWithMeSubjcet.subscribe(
        data => {
          this.sharedWithMe = data;
        }
      );

      this.templateIdSubscription = this.emailSmsSubjectService.templateIdSubject.subscribe(
        id => {
          if(id >= 0){
            this.templateId = id;
            this.fetchTemplateBody();
          }else if(id === -1){
            this.fetchEmptyTemplateBody();
          }
          this.selectedName='';
        }
      );

      this.officeIdChangeSubscription = this.emailSmsSubjectService.officeIdSubject.subscribe(id=>{
        this.officeId = id;
      })

    }

    onFilterList(){
      this.isFilterList = !this.isFilterList;
    }

    omit_special_char(event) {
      var k;
      k = event.charCode;
      if(k == 45 || k == 95){
        return true;
      }
      if(k == 32){
        return false;
      }
      return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
    }
  
    onPaste(event: ClipboardEvent) {
      let clipboardData = event.clipboardData
      let pastedText = clipboardData.getData('text');
      pastedText = pastedText.replace(/ +/g, "");
      var last = pastedText.replace(/[^0-9a-zA-Z-_ ]/g,'')
      var first = this.templateBodyForm.controls.EmailLinkVariable.value
      this.templateBodyForm.controls.EmailLinkVariable.patchValue(first+last);
      event.preventDefault();
    }
    
    fetchTemplateBody() {
      if (!this.templateId) return;
      this.quizBuilderApiService.getTemplateBody(this.templateId).subscribe(
        data => {
          let listOfUsedVariableObj = this.variablePopupService.getListOfUsedVariableObj(data.Body);
          data.SMSText = data.SMSText ? data.SMSText : '';
          let listOfUsedVariableObjSms = this.variablePopupService.getListOfUsedVariableObj(data.SMSText);

          let tempVarObj:any = {};
          let msgVariablesObj = {};
          if(data.MsgVariables && data.MsgVariables.length > 0){
            data.MsgVariables.map((item:string) => {
              if(data.Body && data.Body.includes(item)){
                if(!tempVarObj[CommunicationModes.EmailTemplateMsg]){ tempVarObj[CommunicationModes.EmailTemplateMsg] = []; }
                
                tempVarObj[CommunicationModes.EmailTemplateMsg].push(item);
              }
              if(data.SMSText && data.SMSText.includes(item)){
                if(!tempVarObj[CommunicationModes.SmsTemplateMsg]){ tempVarObj[CommunicationModes.SmsTemplateMsg] = []; }
                
                tempVarObj[CommunicationModes.SmsTemplateMsg].push(item);
              }
              if(this.isEnableWhatsappTemplate && data.WhatsApp && data.WhatsApp.FollowUpMessage && data.WhatsApp.FollowUpMessage.includes(item)){
                if(!tempVarObj[CommunicationModes.WhatsappTemplateMsg]){ tempVarObj[CommunicationModes.WhatsappTemplateMsg] = []; }
                
                tempVarObj[CommunicationModes.WhatsappTemplateMsg].push(item);
              }
            });
          }

          if(data.Body){
            msgVariablesObj[CommunicationModes.EmailTemplateMsg] = this.variablePopupService.getListOfUsedVariableObj(data.Body, tempVarObj[CommunicationModes.EmailTemplateMsg]);
          }
          if(data.SMSText){
            msgVariablesObj[CommunicationModes.SmsTemplateMsg] = this.variablePopupService.getListOfUsedVariableObj(data.SMSText, tempVarObj[CommunicationModes.SmsTemplateMsg]);
          }
          if(this.isEnableWhatsappTemplate && data.WhatsApp && data.WhatsApp.FollowUpMessage){
            msgVariablesObj[CommunicationModes.WhatsappTemplateMsg] = this.variablePopupService.getListOfUsedVariableObj(data.WhatsApp.FollowUpMessage, tempVarObj[CommunicationModes.WhatsappTemplateMsg]);
          }

          this.templateBodyForm.patchValue({
            Id: data.Id,
            Body: this.variablePopupService.updateTemplateVariableIntoHTML(data.Body, msgVariablesObj[CommunicationModes.EmailTemplateMsg],'body'),
            SMSText:this.variablePopupService.updateTemplateVariableIntoHTML(data.SMSText, msgVariablesObj[CommunicationModes.SmsTemplateMsg],'sms'),
            Subject: data.Subject,
            TemplateTitle: data.TemplateTitle,
            EmailLinkVariable : data.EmailLinkVariable == null ? '' : data.EmailLinkVariable,
            MsgVariablesObj : msgVariablesObj
          });
          // For WhatsApp Template
          if(this.isEnableWhatsappTemplate){
            if(data.WhatsApp && Object.keys(data.WhatsApp).length > 0){
              let tempWhatsApp: any = {};
              tempWhatsApp.hsmTemplateId = data.WhatsApp.HsmTemplateId;
              tempWhatsApp.hsmTemplateLanguageCode = data.WhatsApp.HsmTemplateLanguageCode;
              tempWhatsApp.followUpMessage = data.WhatsApp.FollowUpMessage;
              tempWhatsApp.templateParameters = [];
              if(data.WhatsApp.TemplateParameters && data.WhatsApp.TemplateParameters.length > 0){
                data.WhatsApp.TemplateParameters.map((item:any) => {
                  let tempParam:any = {
                    "paraname": item.Paraname,
                    "position": item.Position,
                    "value": item.Value,
                  }
                  tempWhatsApp.templateParameters.push(tempParam);
                })
              }
              if(this.enabledPermissions.isJRSalesforceEnabled && this.userInfo.AccountLoginType == 'salesforce'){
                this.getWhastappHsmTemplate2(tempWhatsApp);
              }
              this.isLoaderEnable = true;
              let listOfUsedVariableObjWhatsapp = this.variablePopupService.getListOfUsedVariableObj(tempWhatsApp.followUpMessage);
              this.followUpMessage = tempWhatsApp.followUpMessage ? tempWhatsApp.followUpMessage : '';
              this.followUpMessage = this.variablePopupService.updateTemplateVariableIntoHTML(this.followUpMessage,msgVariablesObj[CommunicationModes.WhatsappTemplateMsg],'followUp');
              this.emailSmsSubjectService.addedHsmTemplateId = tempWhatsApp.hsmTemplateId;
              this.emailSmsSubjectService.defualtLanguageCode = tempWhatsApp.hsmTemplateLanguageCode;
              this.emailSmsSubjectService.addedTemplateParameters = tempWhatsApp.templateParameters;
              this.emailSmsSubjectService.editWhatsAppTemplate = true;
              setTimeout(()=>{
                this.isLoaderEnable = false;
              },500);
            }
            else{
              
              this.isLoaderEnable = true;
              this.followUpMessage = "";
              this.sharedService.hsmTemplateData = {};
              this.isEnableWhatsappSection = true;
              this.emailSmsSubjectService.addedHsmTemplateId = 0;
              this.emailSmsSubjectService.defualtLanguageCode = "nl-NL";
              this.emailSmsSubjectService.addedTemplateParameters = [];
              this.emailSmsSubjectService.editWhatsAppTemplate = true;

              setTimeout(()=>{
                this.isLoaderEnable = false;
              },500);
            }
            this.emailSmsSubjectService.callForEditCase();
          }
          //  if(this.isEnableWhatsappTemplate && data.whatsApp && Object.keys(data.whatsApp).length > 0){
          //   this.isLoaderEnable = true
          //    let listOfUsedVariableObjWhatsapp = this.variablePopupService.getListOfUsedVariableObj(data.whatsApp.followUpMessage);
          //    this.followUpMessage = this.variablePopupService.updateTemplateVariableIntoHTML(data.whatsApp.followUpMessage,listOfUsedVariableObjWhatsapp,'followUp');
          //    this.emailSmsSubjectService.addedHsmTemplateId = data.whatsApp.hsmTemplateID;
          //    this.emailSmsSubjectService.defualtLanguageCode = data.whatsApp.hsmTemplateLanguageCode;
          //    this.emailSmsSubjectService.addedTemplateParameters = data.whatsApp.templateParameters;
          //    this.emailSmsSubjectService.editWhatsAppTemplate = true;
          //    this.emailSmsSubjectService.callForEditCase();
          //    setTimeout(()=>{
          //      this.isLoaderEnable = false;
          //    },500)
          //  }      
           
        const control = <FormArray>this.templateBodyForm.controls['TemplateAttachmentList'];
          for(let i = control.length-1; i >= 0; i--) {
          control.removeAt(i)
            }
        
          data.TemplateAttachmentList.forEach((ele) => {
            (<FormArray>this.templateBodyForm.get("TemplateAttachmentList")).push( 
              new FormGroup({
                FileName: new FormControl(ele.FileName),
                FileUrl: new FormControl(ele.FileUrl),
                FileIdentifier: new FormControl(ele.FileIdentifier)
              })
            )
          })
        
        },
        error => {
        //  this.notificationsService.error("Something went wrong");
        }
      );
    }

    fetchEmptyTemplateBody(){
      this.templateBodyForm.patchValue({
        Id: -1,
        Body: "",
        SMSText: "",
        Subject: "",
        TemplateTitle:""
      });
      // this.sharedService.hsmTemplateData = {};
    }

    /**
     * Update Template details against form value
     */
    updateTemplateDetails() {
      if(this.isEnableWhatsappTemplate && this.whatsAppTemplateDataAvailable){
        this.setWhatsAppPayload();
      } 
      let listOfUsedVariableObj = this.variablePopupService.getListOfUsedVariableObj(this.templateBodyForm.value.Body);
      // this.templateBodyForm.value.Body = this.variablePopupService.updateTemplateVarHTMLIntoVariable(this.templateBodyForm.value.Body, this.getUsedMsgVariablesList(CommunicationModes.EmailTemplateMsg), 'body');
      this.templateBodyForm.value.Body = this.variablePopupService.updateTemplateVarHTMLIntoVariable(this.templateBodyForm.value.Body, listOfUsedVariableObj, 'body');
      let listOfUsedVariableObjSms = this.variablePopupService.getListOfUsedVariableObj(this.templateBodyForm.value.SMSText);
      // this.templateBodyForm.value.SMSText = this.variablePopupService.updateTemplateVarHTMLIntoVariable(this.templateBodyForm.value.SMSText, this.getUsedMsgVariablesList(CommunicationModes.SmsTemplateMsg), 'sms');
      this.templateBodyForm.value.SMSText = this.variablePopupService.updateTemplateVarHTMLIntoVariable(this.templateBodyForm.value.SMSText, listOfUsedVariableObj, 'sms');
      // this.templateBodyForm.value.SMSText = this.templateBodyForm.value.SMSText ? this.templateBodyForm.value.SMSText.replace(/&nbsp;/g," ").replace(/<br(\s\/)*>/g,"\n") : '';
      this.templateBodyForm.value.SMSText = this.templateBodyForm.value.SMSText ? this.variablePopupService.convertToPlainText(this.templateBodyForm.value.SMSText) : null;
      this.emailSmsSubjectService.changeTemplateId(this.templateBodyForm.get('Id').value)
      this.emailSmsSubjectService.changeTemplateName(this.templateBodyForm.get('TemplateTitle').value)

      let requestPayload:any = JSON.parse(JSON.stringify(this.templateBodyForm.value));

      if(requestPayload.MsgVariablesObj && Object.keys(requestPayload.MsgVariablesObj).length > 0){
        requestPayload.MsgVariables = [];

        for(let key in requestPayload.MsgVariablesObj){
          requestPayload.MsgVariablesObj[key].map((currObj:any) => {
            if(!requestPayload.MsgVariables.includes(currObj.formula)){
              requestPayload.MsgVariables.push(currObj.formula);
            }
          });
        }

        delete requestPayload.MsgVariablesObj;
      }

      this.quizBuilderApiService
        .saveTemplateBody(requestPayload)
        .subscribe(
          data => {
            this.notificationsService.success(
              "Template-Body",
              "Template body has been saved"
            );
          },
          error => {
            this.notificationsService.error(
              "Template-Body",
              "Something Went Wrong"
            );
          }
        );
    }
 
    setWhatsAppPayload(){
      let hsmTemplateData: any = JSON.parse(JSON.stringify(this.sharedService.hsmTemplateData));
      let whatsApp:any = {}
        whatsApp.hsmTemplateId = (this.enabledPermissions.isJRSalesforceEnabled && this.userInfo.AccountLoginType == 'salesforce') ?  (hsmTemplateData.id ? hsmTemplateData.id  : null) : this.emailSmsSubjectService.addedHsmTemplateId;
        whatsApp.hsmTemplateLanguageCode = (this.enabledPermissions.isJRSalesforceEnabled && this.userInfo.AccountLoginType == 'salesforce') ? (hsmTemplateData.templateBody ? hsmTemplateData.templateBody[0].langCode : null): this.emailSmsSubjectService.defualtLanguageCode;
        let listOfUsedVariableObjwhatsapp = this.variablePopupService.getListOfUsedVariableObj(this.followUpMessage);
        if(this.showFollowUpMsg){
        whatsApp.followUpMessage = this.variablePopupService.updateTemplateVarHTMLIntoVariable(this.followUpMessage, this.getUsedMsgVariablesList(CommunicationModes.WhatsappTemplateMsg), 'followUp');
        whatsApp.followUpMessage = whatsApp.followUpMessage ? this.variablePopupService.convertToPlainText(whatsApp.followUpMessage) : null;
        }else{
          whatsApp.followUpMessage = null;
        }
        if(!this.enabledPermissions.isJRSalesforceEnabled && this.userInfo.AccountLoginType != 'salesforce'){
          whatsApp.templateParameters = this.emailSmsSubjectService.addedTemplateParameters;
        }
        this.templateBodyForm.value.WhatsApp = whatsApp;
        // this.templateBodyForm.value.WhatsApp = JSON.parse(JSON.stringify(this.sharedService.hsmTemplateData))
    }

    smsDefaultTemplate() {
      this.quizBuilderApiService
        .getDefaultTemplate(this.notificationType)
        .subscribe(
          data => {
            this.templateBodyForm.patchValue({
              // 'Id': data.Id,
              OfficeId: data.OfficeId,
              NotificationType: data.NotificationType,
              Subject: data.Subject,
              Body: data.Body,
              SMSText: data.SMSText,
              QuizInTemplateList: data.QuizInTemplateList,
              TemplateAttachmentList:  data.TemplateAttachmentList,
              TemplateTitle:data.TemplateTitle
              // [{FileName: "", FileUrl: ""}]
            });
          },
          error => {
            // this.notificationsService.error(
            //   "Template-Body",
            //   "Something Went Wrong"
            // );
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

    onSmsVariableSelect(value,name) {
      this.selectedName=name;
      this.isFilterList=false;
      var cursorPos = $("#sms-textarea").prop("selectionStart");
      var v = $("#sms-textarea").val();
      var textBefore = v.substring(0, cursorPos);
      var textAfter = v.substring(cursorPos, v.length);
      this.templateBodyForm.controls.SMSText.patchValue(
        textBefore + value + textAfter
      );
    }
    /**
     * 
     * @param shareTemplate copy to clipboard popup HTML Element reference
     * create an inline image URL
     */
    public imageORvideo: string="image";
    public imageURL;
    addImageAttachment(shareTemplate) {
      var template_config = Object.assign({}, environment.cloudinaryConfiguration);
      template_config.resource_type = ['image'];
      var widget = cloudinary.createUploadWidget(
        template_config,
        (error, result) => {
          if (!error && result[0].url) {
            var content = result[0].url.split(".");
            var contentType = content[content.length - 1];
            if (
              contentType === "jpg" ||
              contentType === "jpeg" ||
              contentType === "tiff" ||
              contentType === "gif" ||
              contentType === "" ||
              contentType === "png"
            ) {
              this.imageORvideo = "image";
            } else {
              this.imageORvideo = "video";
            }
            if (!error && result[0].url) {
              var coordinate_crop = "", coordinate_scale = "", max_height = 50;
              if (
                result[0] &&
                result[0].coordinates &&
                result[0].coordinates.faces
              ) {
                var cloudCoordinate = result[0].coordinates.faces;
                coordinate_crop = `x_${cloudCoordinate[0][0]},y_${
                  cloudCoordinate[0][1]
                },w_${cloudCoordinate[0][2]},h_${cloudCoordinate[0][3]},c_crop`;

                if(cloudCoordinate[0][3] > max_height){
                  let ratio = cloudCoordinate[0][2]/cloudCoordinate[0][3];
                  let max_width = Math.trunc(ratio*max_height)
                  coordinate_scale = `w_${max_width},h_${max_height},c_scale`
                }
              }
              if (result[0].url.match("upload")) {
                var index = result[0].url.match("upload").index;
                result[0].url =
                  result[0].url.slice(0, index + 6) +
                  "/" +
                  coordinate_crop + "/" + coordinate_scale +
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

    ngAfterViewInit() {
      // var that = this;
      // var str = `<select id="dropdown" class="form-control myDropdown ql-size">
      // <option value="">Insert Variable Field</option>
      // <optgroup label="Client">
      //   <option value="%fname%" >First Name : %fname%</option>
      //   <option value="%lname%" >Last Name : %lname%</option>
      //   <option value="%phone%" >Phone : %phone%</option>
      //   <option value="%email%" >Email : %email%</option>
      // </optgroup>
      // <optgroup label="Quiz">
      //   <option value="%qname%" >Quiz Name : %qname%</option>
      //   <option value="%qlink%" >Quiz Link : %qlink%</option>
      // </optgroup>
      // </select>`;
      // var str1 = `<select id="dropdown1" class="form-control myDropdown ql-size">
      // <option value="">Insert Variable Field</option>
      // <optgroup label="Client">
      //   <option value="%fname%" >First Name : %fname%</option>
      //   <option value="%lname%" >Last Name : %lname%</option>
      //   <option value="%phone%" >Phone : %phone%</option>
      //   <option value="%email%" >Email : %email%</option>
      // </optgroup>
      // <optgroup label="Quiz">
      //   <option value="%qname%" >Quiz Name : %qname%</option>
      //   <option value="%qlink%" >Quiz Link : %qlink%</option>
      // </optgroup>
      // </select>`;
      // var customButton = document.querySelectorAll(".ql-showHtml");
      // customButton[0].innerHTML = "add button";
      // // customButton[0].parentElement.insertAdjacentHTML("beforeend", str);
      // customButton[0].classList.add("hide");
      // // customButton[1].innerHTML = 'add button';
      // // customButton[1].parentElement.insertAdjacentHTML('beforeend', str1);
      // // customButton[1].classList.add('hide');
      // document
      //   .getElementById("dropdown")
      //   .addEventListener("change", function ($event) {
      //     $(".beta .ql-editor").focus();
      //     that.pasteHtmlAtCaret($event.target["value"]);
      //     $event.target["value"] = "";
      //   });
      // // document.getElementById('dropdown1').addEventListener('change', function ($event) {
      // //   $('.sms-editor .ql-editor').focus();
      // //   that.pasteHtmlAtCaret($event.target['value']);
      // //   $event.target['value'] = '';
      // // })
      // $("#dropdown")
      //   .parent("span")
      //   .addClass("float-right");
      // // $("#dropdown1").parent('span').addClass('float-right1')

      if (this.notificationType == 5) {
        $('option[value="%ical%"]').hide();
        $('option[value="%gcal%"]').hide();
        $('option[value="%rclink%"]').hide();
      }

      if (this.notificationType == 1) {
        $('option[value="%rclink%"]').hide();
      }
    }

    /**
   * Modal Open for preview template
   * @param template: template reference (#preview)
   */

    openPreviewModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template, { class: "modal-lg pre-temp" });
    }

    openPreviewEmailModal(template: TemplateRef<any>) {
      this.automationTemObjPreview = {};
      this.automationTemObjPreview.subject = JSON.parse(JSON.stringify(this.templateBodyForm.controls.Subject.value ? this.templateBodyForm.controls.Subject.value.replace(/\s/g,'&nbsp') : ""));
      this.automationTemObjPreview.messageText = JSON.parse(JSON.stringify(this.templateBodyForm.controls.Body.value));

      this.automationTemObjPreview.messageText = this.variablePopupService.addInlineCSSForParagraphStyle(this.automationTemObjPreview.messageText);
      let listOfUsedVariableObj = this.variablePopupService.getListOfUsedVariableObj(this.automationTemObjPreview.messageText);    

      if(this.automationTemObjPreview.messageText && listOfUsedVariableObj && listOfUsedVariableObj.length > 0 && 
        (this.automationTemObjPreview.messageText.includes("%signature%") || this.automationTemObjPreview.messageText.includes("%qname%") || 
        this.userInfoService.get() && Object.keys(this.userInfoService.get()).length > 0)
      ){
        listOfUsedVariableObj.map((itemObj:any) => {
          let doc = new DOMParser().parseFromString(this.automationTemObjPreview.messageText, 'text/html');
          if(doc.getElementById(itemObj.formula)){
            let outerhtml = doc.getElementById(itemObj.formula).outerHTML;
            let valueToUpdate = "";
            switch (itemObj.formula) {
              // case "%fname%":
              //   valueToUpdate = this.userInfoService.get().FirstName ? this.userInfoService.get().FirstName : "";
              //   break;
              // case "%lname%":
              //   valueToUpdate = this.userInfoService.get().LastName ? this.userInfoService.get().LastName : "";
              //   break;
              // case "%phone%":
              //   valueToUpdate = this.userInfoService.get().PhoneNumber ? this.userInfoService.get().PhoneNumber : "";
              //   break;
              // case "%email%":
              //   valueToUpdate = this.userInfoService.get().UserName ? this.userInfoService.get().UserName : "";
              //   break;
              // case "%leadid%":
              //   valueToUpdate = "";
              //   break;
              // case "%sourcename%":
              //   valueToUpdate = "";
              //   break;
              // case "%qname%":
              //   valueToUpdate = "";
              //   break;
              case "%signature%":
                valueToUpdate = this.emailSignature ? this.emailSignature : "";
                valueToUpdate = valueToUpdate.replace("%rfname%",(this.userInfoService.get().FirstName ? this.userInfoService.get().FirstName : ""))
                                             .replace("%rlname%",(this.userInfoService.get().LastName ? this.userInfoService.get().LastName : ""))
                                             .replace("%remail%",(this.userInfoService.get().UserName ? this.userInfoService.get().UserName : ""))
                                             .replace("%rphone%",(this.userInfoService.get().PhoneNumber ? this.userInfoService.get().PhoneNumber : ""));
                break;
            }
            if(valueToUpdate){
              this.automationTemObjPreview.messageText = this.variablePopupService.removeVariableHTMLStructure(this.automationTemObjPreview.messageText,itemObj,doc,'body');
              this.automationTemObjPreview.messageText = this.automationTemObjPreview.messageText.replace(itemObj.formula,valueToUpdate);
            }
          }
        });
      }
       this.modalRef = this.modalService.show(template, { class: "modal-lg pre-temp" });
    }

    getEmailSignature(){
      let type = 2;
      this.quizBuilderApiService.getEmailSignature(type).subscribe(res => {
        this.emailSignature = '';
        if(res){
          this.emailSignature = res.signatureText;
        }
      });
    }
  

    addQuizNameText() {
      var cursorPos = $('#subject').prop('selectionStart');
      var v = $('#subject').val();
      var textBefore = v.substring(0, cursorPos);
      var textAfter = v.substring(cursorPos, v.length);
      this.templateBodyForm.controls.Subject.patchValue(
        textBefore + "%qname%" + textAfter
      );
    }

//Modal open when delete button clicked
openModalDelete(template: TemplateRef<any>, tempId) {

  if(!this.emailSmsSubjectService.getShared() && !this.officeId){
    if(this.quizBuilderApiService.getOffice()){
      this.officeId = this.quizBuilderApiService.getOffice();
    }
    if(!this.officeId && this.officeList.length){
      this.officeId = this.officeList[0].id
    }
  }

  let readyToSendObj: any = {
    "IncludeSharedWithMe": this.emailSmsSubjectService.getShared(),
    "IsFavorite": "",
    "NotificationType": this.notificationType,
    "OfficeId": this.officeId,
    "OrderBy": 0,
    "PageNo": 1,
    "PageSize": 2,
    "QuizId": "",
    "QuizTagId": "",
    "QuizTypeId": "",
    "SearchTxt": "",
    "TemplateId": tempId
  }

    this.quizBuilderApiService.getNotificationTemplateQuizTemplateList(readyToSendObj).subscribe(data => {
      if(data.TotalRecords == 0){
        this.deleteTempateObject = {
          template_id: tempId
        }
        this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
      }
    });
  }
  openVariablePopup(){
    let variablePopupPayload: any = {};
    let msg = this.froalaEditorOptions.editorRefernce.html.get();    
    variablePopupPayload.listOfUsedVariableObj = this.variablePopupService.getListOfUsedVariableObj(msg);    
    variablePopupPayload.allowedVariblesFor = this.allowedVariblesFor;
    variablePopupPayload.isOpenPopup = true;
    variablePopupPayload.communicationType = 'emailMsg';
    this.variablePopupService.variablePopupOpened = 'normal';

    this.variablePopupService.variablePopupPayload = variablePopupPayload;
    this.variablePopupService.changeInVariablePopupPayload();
  }

  openVariablePopupSms(){
    let variablePopupPayload: any = {};
    let msg=this.froalaEditorOptionsSMS.editorRefernce.html.get();
    variablePopupPayload.listOfUsedVariableObj = this.variablePopupService.getListOfUsedVariableObj(msg);   
    variablePopupPayload.allowedVariblesFor = this.allowedVariblesFor;
    variablePopupPayload.isOpenPopup = true;
    variablePopupPayload.communicationType = 'smsMsg';
    this.variablePopupService.variablePopupOpened = 'sms';

    this.variablePopupService.variablePopupPayload = variablePopupPayload;
    this.variablePopupService.changeInVariablePopupPayload();
  }

  openVariablePopupWhatsApp(){  
    let variablePopupPayload: any = {};
    let msg=this.froalaEditorOptionsWhatsapp.editorRefernce.html.get();
    variablePopupPayload.listOfUsedVariableObj = this.variablePopupService.getListOfUsedVariableObj(msg);   
    variablePopupPayload.allowedVariblesFor = this.allowedVariblesFor;
    variablePopupPayload.isOpenPopup = true;
    variablePopupPayload.communicationType = 'followUpMsg';
    this.variablePopupService.variablePopupOpened = 'followUp';

    this.variablePopupService.variablePopupPayload = variablePopupPayload;
    this.variablePopupService.changeInVariablePopupPayload();

  }

  openVariablePopupNew(openFor:string){
    let msg = "";
    let variablePopupPayload: any = {};
    let usedVariablesList:Array<any> = this.getUsedMsgVariablesList(openFor);

    variablePopupPayload.listOfUsedVariableObj = usedVariablesList && usedVariablesList.length > 0 ? usedVariablesList : [];   
    variablePopupPayload.allowedVariblesFor = this.allowedVariblesFor;
    variablePopupPayload.isOpenPopup = true;

    switch(openFor){
      case CommunicationModes.EmailTemplateMsg :
            variablePopupPayload.communicationType = 'emailMsg';
            this.variablePopupService.variablePopupOpened = 'normal';
            break;
      case CommunicationModes.SmsTemplateMsg :
            variablePopupPayload.communicationType = 'smsMsg';
            this.variablePopupService.variablePopupOpened = 'sms';
            break;
      case CommunicationModes.WhatsappTemplateMsg :
            variablePopupPayload.communicationType = 'followUpMsg';
            this.variablePopupService.variablePopupOpened = 'followUp';
            break; 
    }

    this.variablePopupService.variablePopupPayload = variablePopupPayload;
    this.variablePopupService.changeInVariablePopupPayload();
  }

  UpdatePopUpStatus(e){    
    let froalaCode:string = "";

    switch(this.variablePopupService.variablePopupOpened){
      case 'normal' :
            froalaCode = CommunicationModes.EmailTemplateMsg;
            break;
      case 'sms' :
            froalaCode = CommunicationModes.SmsTemplateMsg;
            break;
      case 'followUp' :
            froalaCode = CommunicationModes.WhatsappTemplateMsg;
            break; 
    }

    let existingVariablesList:Array<string> = this.getUsedMsgVariablesList(froalaCode, true);
    let x = document.getElementsByTagName("BODY")[0];
    x.classList.remove("overflow-hidden")
    this.isOpenPopup = e; 
    
    if(this.variablePopupService.variablePopupOpened == 'sms'){
      this.templateBodyForm.patchValue({
       SMSText : this.variablePopupService.insertFormulaIntoEditor(this.variablePopupService.listOfUsedVariableObj, this.froalaEditorOptionsSMS, existingVariablesList)
      });
    }else if(this.variablePopupService.variablePopupOpened == 'followUp'){
       this.followUpMessage = this.variablePopupService.insertFormulaIntoEditor(this.variablePopupService.listOfUsedVariableObj, this.froalaEditorOptionsWhatsapp, existingVariablesList)
    }else if(this.variablePopupService.variablePopupOpened == 'normal'){
      this.templateBodyForm.patchValue({
       Body : this.variablePopupService.insertFormulaIntoEditor(this.variablePopupService.listOfUsedVariableObj, this.froalaEditorOptions, existingVariablesList)
      });
    }

    let temp:any = {};
    temp[froalaCode] = this.variablePopupService.listOfUsedVariableObj;
    this.templateBodyForm.get('MsgVariablesObj').patchValue(temp);
  }

/**
* Delete Template 
*/
deleteTemplate(deleteobj: { template_id: any }) {
  //if (!deleteobj.template_id) console.warn("Template id found missing");
  //this.quizTemplateList.NotificationTemplateList.splice(deleteobj.index, 1);
  this.quizBuilderApiService.deleteTemplateBody(deleteobj.template_id)
    .subscribe((data) => {
      this.emailSmsSubjectService.changeDeletedTemplateId(deleteobj.template_id)
     // this.notificationsService.success("Success");
     // this.emailSmsSubjectService.setTemplateId(null);
    }, (error) => {
    //  this.notificationsService.error(error)
    })
}

getWhastappHsmTemplate(){
  
  // this.isLoaderEnable = true;
  this.emailSmsSubjectService.clientWhatsappTemplates["automation"] = {};
  this.emailSmsSubjectService.clientLanguageListByType["automation"] = [];
   this.quizBuilderApiService.getWhatsAppHSMTemplatesV1("automation").subscribe((updatedResponse: any) => {

    if(updatedResponse && updatedResponse.length > 0){
      let templateListByCode = {};
      updatedResponse.map((currentObj) => {

        if(!templateListByCode[currentObj.templateLanguage]){
           templateListByCode[currentObj.templateLanguage] = [];
        }
        templateListByCode[currentObj.templateLanguage].push(currentObj);
      });
      this.emailSmsSubjectService.clientLanguageListByType["automation"] = Object.keys(templateListByCode).length > 0 ? Object.keys(templateListByCode) : [];
      this.emailSmsSubjectService.clientWhatsappTemplates["automation"] = templateListByCode;
      this.whatsAppTemplateDataAvailable = true;
      
     
     }

    //  setTimeout(()=>{
    //   this.isLoaderEnable = false
    //  },500)
   })
}

// get the selected whatsapp template from common popup for whatsapp
getWhastappHsmTemplate2(data: any){
  let paramObj: any = {};
  paramObj.clientCode = this.sharedService.getCookie("clientCode");
  paramObj.languageCode = data.hsmTemplateLanguageCode;
  paramObj.templateId = data.hsmTemplateId;
  paramObj.moduleType = "automation";

//  this.isEnableWhatsappSection = false;
  this.whatsAppTemplateDataAvailable = false;
  this.sharedService.hsmTemplateData = {};
  this.quizBuilderApiService.getWhastappHsmTemplate2(paramObj).subscribe(response =>{ 
     if(response && response.data && response.data.id && response.data.templateBody){
        // Update variables in template
        if(response.data.templateBody && response.data.templateBody.length > 0){
          response.data.templateBody.map((subItem:any) => {
            subItem.tempBody = subItem.tempBody ? subItem.tempBody.replace(/(?:\r\n|\r|\n)/g, '<br>') : subItem.tempBody
            if(response.data.headerParams && response.data.headerParams.length > 0){
              subItem = this.getUpdateVariables(response.data.headerParams, subItem, 'header');  
            }
            if(response.data.params && response.data.params.length > 0){
              subItem = this.getUpdateVariables(response.data.params, subItem, 'tempbody');  
            }
          });
        }
        this.sharedService.hsmTemplateData = JSON.parse(JSON.stringify(response.data));
        // this.isEnableWhatsappSection = true;
      }
      this.whatsAppTemplateDataAvailable = true;
  },error => {
    this.whatsAppTemplateDataAvailable = true;
  })

}

getAllLanguageList(){
  this.quizBuilderApiService.getAllLanguageList('automation').subscribe(response=>{
    if(response.data && response.data.length > 0){
      response.data.map(langObj =>{
        this.emailSmsSubjectService.languageNameByCode[langObj.code] = langObj.name;
      })
    }
  })
}

getUsedMsgVariablesList(froalaCode:string, fetchOnlyFormula:boolean = false){
  let msg = "";
  let listOfUsedVariableObj:Array<any> = this.templateBodyForm.value.MsgVariablesObj[froalaCode];
  
  if(froalaCode == CommunicationModes.EmailTemplateMsg){
    msg = this.froalaEditorOptions.editorRefernce.html.get();
  }
  else if(froalaCode == CommunicationModes.SmsTemplateMsg){
    msg = this.froalaEditorOptionsSMS.editorRefernce.html.get();
  }
  else if(froalaCode == CommunicationModes.WhatsappTemplateMsg){
    msg = this.froalaEditorOptionsWhatsapp.editorRefernce.html.get();
  }

  let usedVariablesList:Array<any> = [];

  if(listOfUsedVariableObj && listOfUsedVariableObj.length > 0){

    
    listOfUsedVariableObj.map((item:any) => {
      if(msg.indexOf(item.formula) >= 0){

        if(fetchOnlyFormula){
          usedVariablesList.push(item.formula);
        }
        else{
          usedVariablesList.push(item);
        }
      }
    });
  }
  else{
    if(fetchOnlyFormula){
      usedVariablesList = this.variablePopupService.getListOfUsedVariableFormulasInMsg(msg);
    }
    else{
      usedVariablesList = this.variablePopupService.getListOfUsedVariableObj(msg);
    }
  }

  return usedVariablesList && usedVariablesList.length > 0 ? usedVariablesList : [];
}

getUpdateVariables(paramsData:any, contentData:any, updateFor: string){
  if(paramsData && paramsData.length > 0){
    paramsData.map((item:any) => {
        if(item.params && item.params.length > 0){
          item.params.map((subItem:any) => {
            if(subItem.paraname){
              // Header Text
              if(updateFor == 'header' && contentData.headerText && contentData.headerText.indexOf(`{{${subItem.position}}}`) > -1){
                // contentData.headerText = contentData.headerText.replace(`{{${subItem.position}}}`, subItem.paraname);
                contentData.headerText = contentData.headerText.replace(`{{${subItem.position}}}`, `<a href="javascript:void(0);">${subItem.paraname}</a>`);
              } 
              // Body Text
              if(updateFor == 'tempbody' && contentData.tempBody && contentData.tempBody.indexOf(`{{${subItem.position}}}`) > -1){
                // contentData.tempBody = contentData.tempBody.replace(`{{${subItem.position}}}`, subItem.paraname);
                contentData.tempBody = contentData.tempBody.replace(`{{${subItem.position}}}`, `<a href="javascript:void(0);">${subItem.paraname}</a>`);
              } 
            }
          })
        }
    })
  }
  return contentData;
}

//Modal confirm
confirm(): void {
  this.deleteTemplate(this.deleteTempateObject)
  this.modalRef.hide();
}

//Modal decline
decline(): void {
  this.modalRef.hide();
}

    ngOnDestroy() {
      try{
        this.sharedWithMeSubscription.unsubscribe();
        this.templateIdSubscription.unsubscribe();
        this.officeIdChangeSubscription.unsubscribe()
      }catch(e){
        throw new Error(e);
      }
    }

    checkWhatsAppDataAvailable():boolean {
      if(this.sharedService.hsmTemplateData && this.sharedService.hsmTemplateData.id){
        return true;
      }else{
        return false;
      }
    }
}
