import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UserInfoService } from '../../../shared/services/security.service';
import { EmailSmsSubjectService } from '../email-sms-subject.service';
import { FroalaEditorOptions } from "../template-body/template-froala-options";
@Component({
  selector: 'app-whatsapp-template',
  templateUrl: './whatsapp-template.component.html',
  styleUrls: ['./whatsapp-template.component.scss']
})
export class WhatsappTemplateComponent implements OnInit {
  @Input() templateBodyForm: FormGroup;
  public whatsappTemplateList: any = [];
  public whatsappTemplateStructureList: any = [];
  public availableHsmTemplateList: Array<any> = [];
  public allowedVariblesFor: string = 'automation';
  public selectedTempDetails: any = {};
  public clientLanguageList:any = [];
  public languageNameByCode:any = {};
  public templateObj:any = {};
  public hoverOnTempName:any = {};
  public userInfo: any = {};
  public selectedTemplateLangCode: string = "";
  public editWhatsAppTemplateObservableSubscription: Subscription;
  // public optionsWhatsapp: object;
  // public froalaEditorOptionsWhatsapp = new FroalaEditorOptions();
  public isPermissionForWhatsappAsSms:boolean = false;
  public isWhatsappVariablePopupOpen: boolean = false;
  public isOpenPopup: boolean = false;
  public whatsappTemplateForm: FormGroup;
  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private emailSmsSubjectService: EmailSmsSubjectService,
    private userInfoService : UserInfoService
  ) {
    this.userInfo = this.userInfoService.get();
     this.whatsappTemplateForm = this.formBuilder.group({});
  }

  ngOnInit() {
    //this.setClientLanguageList();
    //this.presetSavedWhatsapp();
    this.editWhatsAppTemplateObservableSubscription = this.emailSmsSubjectService.editWhatsAppTemplateObservable.subscribe((edit) => {
      if(edit){
        this.setClientLanguageList();
        this.presetSavedWhatsapp();
      }
    })
    
  }

  setClientLanguageList(){
    this.clientLanguageList = this.emailSmsSubjectService.clientLanguageListByType["automation"];
    this.languageNameByCode = this.emailSmsSubjectService.languageNameByCode;
    this.selectedTemplateLangCode = this.emailSmsSubjectService.defualtLanguageCode;
  }


  presetSavedWhatsapp() {
    let hsmTemplatesTotalObj: any = this.emailSmsSubjectService.clientWhatsappTemplates["automation"] ? JSON.parse(JSON.stringify(this.emailSmsSubjectService.clientWhatsappTemplates["automation"])) : null;
    let langToSet: string = "";
    this.templateObj.whatsappTemplateObj = {};
    if (hsmTemplatesTotalObj && Object.keys(hsmTemplatesTotalObj).length > 0) {
      if (hsmTemplatesTotalObj[this.emailSmsSubjectService.defualtLanguageCode]) {
        langToSet = this.emailSmsSubjectService.defualtLanguageCode;
      }
      else {
        langToSet = Object.keys(hsmTemplatesTotalObj)[0];
      }
      hsmTemplatesTotalObj[langToSet].map((currObj) => {
        if (currObj.id == this.emailSmsSubjectService.addedHsmTemplateId) {
          this.templateObj.whatsappTemplateObj = JSON.parse(JSON.stringify(currObj));
        }
      });
      if (!(this.templateObj.whatsappTemplateObj && Object.keys(this.templateObj.whatsappTemplateObj).length > 0)) {
        this.templateObj.whatsappTemplateObj = JSON.parse(JSON.stringify(hsmTemplatesTotalObj[langToSet][0]));
      }
      this.templateObj.hsmTemplateLanguageCode = this.templateObj.whatsappTemplateObj.templateLanguage;
      this.presetWhatsAppContent();
    }

  }

  presetWhatsAppContent(){  
        if(this.templateObj.hsmTemplateLanguageCode){
          this.selectedTemplateLangCode = this.templateObj.hsmTemplateLanguageCode;
        }
        this.setWhatsappTemplateList();
        this.onSelectedTemp(this.templateObj.whatsappTemplateObj);
  }      
       
  setWhatsappTemplateList(){
    if(this.emailSmsSubjectService.clientWhatsappTemplates["automation"] && 
      this.emailSmsSubjectService.clientWhatsappTemplates["automation"][this.selectedTemplateLangCode] && 
      this.emailSmsSubjectService.clientWhatsappTemplates["automation"][this.selectedTemplateLangCode].length > 0)
    {
        this.availableHsmTemplateList = JSON.parse(JSON.stringify(this.emailSmsSubjectService.clientWhatsappTemplates["automation"][this.selectedTemplateLangCode]));
    }
    else{
      this.availableHsmTemplateList = [];
      this.selectedTempDetails = {};        
    }
  }

  onSelectedTemp(templateToSelect:any){
    if(templateToSelect && Object.keys(templateToSelect).length > 0){
      this.selectedTempDetails = JSON.parse(JSON.stringify(templateToSelect));
      this.selectedTempDetails.allowedAnswersList = [];
      if(this.selectedTempDetails && this.selectedTempDetails.allowedAnswers){
        this.selectedTempDetails.allowedAnswersList = typeof this.selectedTempDetails.allowedAnswers === "string" ? this.selectedTempDetails.allowedAnswers.split(",") : this.selectedTempDetails.allowedAnswers;
      }
      this.fetchTemplate();
    }
  }

  fetchTemplate() {

    let availablePlaceHolderList: any = [];
    this.whatsappTemplateStructureList = [];

    if (this.selectedTempDetails && this.selectedTempDetails.params.length > 0) {
      this.selectedTempDetails.params.map((paramObj: any) => {
        availablePlaceHolderList.push(`{{${paramObj.paraname}}}`)
      });
    }

    let contentRemaining: string = (this.selectedTempDetails && this.selectedTempDetails.templateBody) ? this.selectedTempDetails.templateBody : '';
    let temp: any = {};
    let currPlaceHolderCode = '';
    let templateFiledsValue: any = {};
    let contentRemainingList: Array<any> = [];

    availablePlaceHolderList.forEach((item: any, index: number) => {
      // currPlaceHolderCode = item.replace("{{", "").replace("}}", "").toLowerCase();
      currPlaceHolderCode = item.replace("{{", "").replace("}}", "").replace(/[^a-zA-Z ]/g, "").replace(/(\s)+/g, "_").toLowerCase();
      templateFiledsValue[currPlaceHolderCode] = "";
      contentRemainingList = contentRemaining.split(item);
      contentRemaining = "";

      contentRemainingList.forEach((subItem: any, subIndex: number) => {
        contentRemaining += subItem;

        if (subIndex < contentRemainingList.length - 1) {
          let fieldPlaceholderKey: string = `Lbl_${currPlaceHolderCode.replace(/(\d*)$/g, "")}`;
          let fieldPlaceholder = (this.translate.instant(fieldPlaceholderKey) !== fieldPlaceholderKey) ? this.translate.instant(fieldPlaceholderKey) : currPlaceHolderCode.replace(/(\-|\_|\.)/g, "");

          contentRemaining += `<input type="text" formControlName="${currPlaceHolderCode}" placeholder="${fieldPlaceholder}" />`;
        }
      });
    });

    this.selectedTempDetails.templateBodyToDisplay = contentRemaining;

    let inputFieldList = this.selectedTempDetails.templateBodyToDisplay.match(/<(“[^”]*”|'[^’]*’|[^'”>])*>/g);
    let templateBodyToDisplayList = this.selectedTempDetails.templateBodyToDisplay.split(/<(“[^”]*”|'[^’]*’|[^'”>])*>/g);

    if (templateBodyToDisplayList && templateBodyToDisplayList.length > 0) {
      templateBodyToDisplayList.map((currItem: any) => {
        if (currItem === "/") {
          temp = {};
          temp.fieldCode = "inputField";
          temp.fieldValue = inputFieldList[0].match(/(?<=(formControlName="))(\w|\d|\_)+(?=("))/g)[0];
          temp.fieldPlaceholder = inputFieldList[0].match(/(?<=(placeholder="))(\w|\d|\_|\s)+(?=("))/g)[0];
          inputFieldList.splice(0, 1);
        }
        else {
          temp = {};
          temp.fieldCode = "text";
          temp.fieldValue = currItem;
        }
        this.whatsappTemplateStructureList.push(temp);
      });
    }
    
    if(this.emailSmsSubjectService.addedTemplateParameters && this.emailSmsSubjectService.addedTemplateParameters.length > 0){
      this.emailSmsSubjectService.addedTemplateParameters.map((currParamObj:any) =>{
        if (currParamObj.paraname && currParamObj.value) {
          templateFiledsValue[currParamObj.paraname.toLowerCase()] = currParamObj.value;
        }
      });
    }

    if(this.selectedTempDetails){
      this.emailSmsSubjectService.addedHsmTemplateId = this.selectedTempDetails.id;
    }
    this.createTemplateForm(availablePlaceHolderList, templateFiledsValue);
  }

  createTemplateForm(fieldsList: any, filedsValueObj: any) {

    let formObj: any = {};
    let fieldCode: string = "";
    let defaultValue: any;
    let validatorsList: any = [];

    for (let item of fieldsList) {
     
      fieldCode = item.replace("{{", "").replace("}}", "").toLowerCase();
      defaultValue = null;
      validatorsList = [];

      if (filedsValueObj && filedsValueObj[fieldCode]) {
        defaultValue = filedsValueObj[fieldCode];
      }
      else if(fieldCode == "recruiter"){
        defaultValue = this.userInfo.firstName ? this.userInfo.firstName : null;
      }
      else if(fieldCode == "client"){
        defaultValue = this.userInfo.clientOrganization ? this.userInfo.clientOrganization : null;
      }
      
      if (
        fieldCode === "firstname" && filedsValueObj && filedsValueObj[fieldCode] && filedsValueObj[fieldCode] === "%fname%" || 
        fieldCode === "phoneno" && filedsValueObj && filedsValueObj[fieldCode] && filedsValueObj[fieldCode] === "%phone%" || 
        fieldCode === "recruiter" && filedsValueObj && filedsValueObj[fieldCode] && filedsValueObj[fieldCode] === "%rfname%" ||
        fieldCode === "recruiterphone" && filedsValueObj && filedsValueObj[fieldCode] && filedsValueObj[fieldCode] === "%rphone%" ||
        (fieldCode == "jobtitle" || fieldCode === "sourcename") && filedsValueObj && filedsValueObj[fieldCode] && filedsValueObj[fieldCode] === "%sourcename%"
      ) {
        defaultValue = "";
      }
      if (fieldCode !== "firstname" && fieldCode !== "phoneno" && fieldCode !== "recruiter" && 
        fieldCode !== "recruiterphone" &&  fieldCode !== "jobtitle" && fieldCode !== "sourcename") {
        validatorsList.push(Validators.required);
      }

      formObj[fieldCode.replace("{{", "").replace("}}", "").replace(/[^a-zA-Z ]/g, "").replace(/(\s)+/g, "_")] = new FormControl(defaultValue, validatorsList);
    }

    // this.whatsappTemplateForm= new FormGroup(formObj);
       this.whatsappTemplateForm = new FormGroup(formObj);
    //this.whatsappTemplateForm.setControl("whatsappMsg", this.formBuilder.group(formObj));
    this.templateBodyForm.setControl("WhatsApp",this.whatsappTemplateForm);

    if(this.whatsappTemplateForm.status && this.whatsappTemplateForm.status.toLowerCase() === "valid"){
      this.getSelectedParams();
    }
  

    this.whatsappTemplateForm.valueChanges.subscribe((result:any) => {
      // if(this.whatsappTemplateForm.status && this.whatsappTemplateForm.status.toLowerCase() === "valid"){
      //   this.getSelectedParams();
      // }
      this.getSelectedParams();
    });
  }

  getSelectedParams(){
    if(this.selectedTempDetails && this.selectedTempDetails.params && this.selectedTempDetails.params.length > 0){
      let fieldCode = '';
      this.selectedTempDetails.params.map((param:any) => {
      // fieldCode = param.paraname.toLowerCase();
      fieldCode = param.paraname.replace(/[^a-zA-Z ]/g, "").replace(/(\s)+/g,"_").toLowerCase();

        if(this.whatsappTemplateForm.value && this.whatsappTemplateForm.value[fieldCode]){
          param.value = this.whatsappTemplateForm.value[fieldCode];
        }
        else if (fieldCode === "firstname") {
          param.value = "%fname%";
        }
        else if (fieldCode === "phoneno") {
          param.value = "%phone%";
        }
        else if(fieldCode === "recruiter"){
          param.value = "%rfname%";
        }else if(fieldCode === "recruiterphone"){
          param.value = "%rphone%";
        }else if(fieldCode === "jobtitle"){
          param.value = "%sourcename%";
        }else if(fieldCode === "sourcename"){
          param.value = "%sourcename%";
        }
        else{
          param.value = '';
        }
      });
      this.emailSmsSubjectService.addedTemplateParameters = this.selectedTempDetails.params;

    }
  }



  getWhatsappHsmTemplates(){
      if(this.emailSmsSubjectService.clientWhatsappTemplates["automation"] && 
      this.emailSmsSubjectService.clientWhatsappTemplates["automation"][this.selectedTemplateLangCode] && 
      this.emailSmsSubjectService.clientWhatsappTemplates["automation"][this.selectedTemplateLangCode].length > 0){
        this.availableHsmTemplateList = JSON.parse(JSON.stringify(this.emailSmsSubjectService.clientWhatsappTemplates["automation"][this.selectedTemplateLangCode]));
      }else{
        this.availableHsmTemplateList = [];
        this.selectedTempDetails = {};        
      }

      this.selectedTempDetails = {};
      if(this.availableHsmTemplateList && this.availableHsmTemplateList.length > 0){
         if(this.emailSmsSubjectService.addedHsmTemplateId){
             this.availableHsmTemplateList.map((templateData) => {
               if(templateData.id == this.emailSmsSubjectService.addedHsmTemplateId){
                 this.selectedTempDetails = JSON.parse(JSON.stringify(templateData));
                 this.emailSmsSubjectService.defualtLanguageCode = this.selectedTempDetails.templateLanguage;
               }
             })
         }
         if(!(this.selectedTempDetails && Object.keys(this.selectedTempDetails).length > 0)){
               this.selectedTempDetails = JSON.parse(JSON.stringify(this.availableHsmTemplateList[0]));
               this.emailSmsSubjectService.defualtLanguageCode = this.selectedTempDetails.templateLanguage;
         }
         this.selectedTempDetails.allowedAnswersList = [];
         if(this.selectedTempDetails && this.selectedTempDetails.allowedAnswers){
           this.selectedTempDetails.allowedAnswersList = typeof this.selectedTempDetails.allowedAnswers === "string" ? this.selectedTempDetails.allowedAnswers.split(",") : this.selectedTempDetails.allowedAnswers;
         }
         setTimeout(() => this.fetchTemplate(), 10)
      }
  }

  ngOnDestroy(){
    this.editWhatsAppTemplateObservableSubscription.unsubscribe();
  }
}
