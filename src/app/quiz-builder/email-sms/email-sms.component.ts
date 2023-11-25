import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { AddTemplatesComponent } from './add-templates/add-templates.component';
import { QuizBuilderApiService } from '../quiz-builder-api.service';
import { FormGroup, FormControl } from '@angular/forms';
import { UserInfoService } from '../../shared/services/security.service';
import { EmailSmsSubjectService } from './email-sms-subject.service';
import { SettingsTemplateComponent } from './settings-template/settings-template.component';
import { Subscription } from 'rxjs';
import { ReminderSettingsComponent } from '../email-sms/quiz-reminder/reminder-settings/reminder-settings.component';
import { Title } from '@angular/platform-browser';
import { VariablePopupService } from '../../shared/services/variable-popup.service';

@Component({
  selector: 'app-email-sms',
  templateUrl: './email-sms.component.html',
  styleUrls: ['./email-sms.component.css']
})
export class EmailSmsComponent implements OnInit {

  @ViewChild('_ref', { read: ViewContainerRef, static:true }) _ref: ViewContainerRef
  @ViewChild('addTemplate', {read: ViewContainerRef, static:true}) addTemplate: ViewContainerRef;
  @ViewChild('reminderSettingTemplate', { read: ViewContainerRef , static:true}) reminderSettingTemplate: ViewContainerRef;

  public templateHeadForm: FormGroup;
  public officeList = [];
  public officeId = '';
  public selectAll: boolean = true;

  public newTemplateOfficeID;
  public officeIdSubscription: Subscription;
  public isCompanyWise:boolean=false;
  public isNotification:any;
  public enabledPermissions:any = {};
  public userInfo:any = {};

  constructor(private _cfr: ComponentFactoryResolver,
  private quizBuilderApiService: QuizBuilderApiService,
  private userInfoService: UserInfoService,
  private emailSmsSubjectService: EmailSmsSubjectService,
  private titleService: Title,
  private variablePopupService: VariablePopupService) {
    this.enabledPermissions = JSON.parse(JSON.stringify(this.userInfoService.userPermissions));
    this.userInfo = this.userInfoService._info;
  }

  ngOnInit() {
    this.titleService.setTitle( "E-mail & SMS templates | Jobrock" );
    this.emailSmsSubjectService.currentNotificationType.subscribe(res => this.isNotification = res);
    /**
     * to get officeList and push into ng-select
     */
    this.officeList = [];
    if(this.userInfoService.get().officesParentChildList.length > 0){
      this.userInfoService.get().officesParentChildList.forEach(office => {
        this.officeList.push({
          value: office.id.toString(),
          label: office.name,
          type : 'Parent'
        });
        if(office.children && office.children.length > 0){
          office.children.forEach(child => {
            this.officeList.push({
              value :  child.id.toString(),
              label :  child.name,
              type  :  'Child'
            }) 
          })
      }
      });

    }
    
    // this.quizBuilderApiService.getTemplateBody
    this.templateHeadForm = new FormGroup({
      'sharedWithMe': new FormControl(false),
      'officeId': new FormControl('')
    });

    if(this.quizBuilderApiService.getOffice()){
      this.templateHeadForm.patchValue({
        'officeId': this.quizBuilderApiService.getOffice()
      });
      this.officeId = this.quizBuilderApiService.getOffice()
      // this.emailSmsSubjectService.setOfficeId(this.quizBuilderApiService.getOffice());
    }else {
      // this.officeList.forEach((office) => {
      //   if(office.value == '133'){
      //     this.officeId = office.value;
      //   }
      // });
      if(!this.officeId && this.officeList.length){
        this.officeId = this.officeList[0].value.toString()
      }
      this.templateHeadForm.patchValue({
        'officeId': this.officeId
      });
      this.emailSmsSubjectService.setOfficeId(this.officeId);
      this.quizBuilderApiService.setOffice(this.officeId)
    }

    this.onChanges();
    if(this.variablePopupService.showExtVariablePopup && !(this.variablePopupService.mappedSfFieldsObj && Object.keys(this.variablePopupService.mappedSfFieldsObj).length > 0)
     && this.enabledPermissions.isJRSalesforceEnabled && this.userInfo.AccountLoginType == 'salesforce' && this.enabledPermissions.isNewVariablePopupEnabled ){
      this.getMappedSfFieldsList(); 
    }
  }

  /** 
   * function call whenever sharedWithMe control value changes
  */
  onChanges(){
    this.templateHeadForm.get('sharedWithMe').valueChanges
    .subscribe((data) => {
      if(data) {
        this.templateHeadForm.patchValue({
          'officeId': ''
        });
        this.emailSmsSubjectService.setOfficeId("");
      }else{
        if(this.quizBuilderApiService.getOffice()){
          this.templateHeadForm.patchValue({
            'officeId': this.quizBuilderApiService.getOffice()
          });
          this.officeId = this.quizBuilderApiService.getOffice()
          this.emailSmsSubjectService.setOfficeId(this.quizBuilderApiService.getOffice());
        }else {
          // this.officeList.forEach((office) => {
          //   if(office.value == '133'){
          //     this.officeId = office.value;
          //   }
          // });
          if(!this.officeId && this.officeList.length){
            this.officeId = this.officeList[0].value.toString()
          }
          this.templateHeadForm.patchValue({
            'officeId': this.officeId
          });
          this.emailSmsSubjectService.setOfficeId(this.officeId);
          this.quizBuilderApiService.setOffice(this.officeId)
        }
      }
    })
  }

  /**
   * Function call on shared with me checkbox clicked
   */
  onSharedWithMe(){
    this.isCompanyWise=!this.isCompanyWise;
    this.templateHeadForm.value['sharedWithMe'] = !this.templateHeadForm.value['sharedWithMe'];
    this.setSharedWithMe(this.templateHeadForm.value['sharedWithMe'])
  }


  /**
   * 
   * @param bool boolean
   * send boolean value to emailSmsSubjectService and set shared with me
   */
  setSharedWithMe(bool){
    this.emailSmsSubjectService.setSharedWithMe(bool);
    this.emailSmsSubjectService.setShared(bool)
    this.templateHeadForm.patchValue({
      'sharedWithMe': this.templateHeadForm.value['sharedWithMe']
    });
  }

  /**
   * 
   * @param e event
   * function call whenever select office dropdown value change
   */
  onOfficeChange(e){
    this.templateHeadForm.patchValue({
      'officeId': e.value
    });
    this.emailSmsSubjectService.setOfficeId(e.value);
    this.quizBuilderApiService.setOffice(e.value);
  }

  /** 
   * dynamic addnewtemplate component loaded
  */
  addNewTemplate(){
    // this.addTemplate.clear();
    // var AddTemplate = this._cfr.resolveComponentFactory(AddTemplatesComponent);
    // var AddTemplateRef = this.addTemplate.createComponent(AddTemplate);
    // AddTemplateRef.instance.sharedWithMe = this.templateHeadForm.value['sharedWithMe'];
    // AddTemplateRef.instance.officeId = this.templateHeadForm.value['officeId'];

    if(this.isCompanyWise){
      this.newTemplateOfficeID='';
    }else{
      this.newTemplateOfficeID=this.quizBuilderApiService.getOffice();
    }

    let addTemplateparam = {
      'OfficeId': this.newTemplateOfficeID,
      'NotificationType': this.emailSmsSubjectService.notificationType,
    }

     this.quizBuilderApiService.addNewQuizTemplate(addTemplateparam)
    .subscribe(data => {
      this.emailSmsSubjectService.setAddNewTemplate(true);
    })

  }

   /**
  * Sidebar Settings when clicked on drag drop
  * @param list : Template Lists
  * @param templateId : current template id
  * @param type : Notification type(1:Initial,2:Confirmation,3.Reminder...so on)
  */
 callSettingSidebar(list, templateId, type) {
  var SectionRef = this._cfr.resolveComponentFactory(SettingsTemplateComponent);
  this._ref.clear();
  var SettingComponentRef = this._ref.createComponent(SectionRef);
  SettingComponentRef.instance.list = list;
  SettingComponentRef.instance.templateId = templateId;
  SettingComponentRef.instance.notificationtype = type;
  SettingComponentRef.instance._ref = SettingComponentRef;
}

onReminderSetting(){
  this.reminderSettingTemplate.clear();
  var reminderSettingsTemplate = this._cfr.resolveComponentFactory(ReminderSettingsComponent);
  var Reminder_SettingComponentRef = this.reminderSettingTemplate.createComponent(reminderSettingsTemplate);
  Reminder_SettingComponentRef.instance.officeId = this.templateHeadForm.value['officeId'];
  Reminder_SettingComponentRef.instance.notificationType = this.emailSmsSubjectService.notificationType;
}

ngOnDestroy() {
 // this.officeIdSubscription.unsubscribe();
 this.titleService.setTitle( "Automation | Jobrock");
}

getMappedSfFieldsList(){
  // this.ngxService.startLoader('appointmentTemplate');
  this.variablePopupService.mappedSfFieldsObj = {};

  this.quizBuilderApiService.getMappedSfFieldsList().subscribe((results) => {
    if (results && results.length > 0) {
      results.forEach((currObj:any) => {
        if(currObj.Fields && currObj.Fields.length > 0){
          currObj.Fields.map((subObj:any) => {
            this.variablePopupService.mappedSfFieldsObj[`${currObj.ObjectName}.${subObj.FieldName}`] = subObj.FieldLabel;
          });
        }
      });
    }
  }), (error:any) => {
    console.log('Could not load Group status  data');
  }
}

}