import { Component, OnInit, OnDestroy, Input, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { QuizBuilderApiService } from '../../quiz-builder-api.service';
import { EmailSmsSubjectService } from '../email-sms-subject.service';
import { UserInfoService } from '../../../shared/services/security.service';
import { DragulaService } from 'ng2-dragula';
import { NotificationsService } from 'angular2-notifications';
import { EmailSmsComponent } from '../email-sms.component';

@Component({
  selector: 'app-dragdrop-notification',
  templateUrl: './dragdrop-notification.component.html',
  styleUrls: ['./dragdrop-notification.component.scss']
})
export class DragdropNotificationComponent implements OnInit, OnDestroy {

  @Input() notificationType: any;
  public sharedWithMe = true;
  public officeId = null;
  public businessUserEmail;
  public quizTemplateList;
  public officeIdSubscription: Subscription;
  public sharedWithMeSubscription: Subscription;
  public dragulaSubscription: Subscription;
  public updateTemplateSubscription: Subscription;
  public notificationTypeSubscription: Subscription;
  public modalRef: BsModalRef;
  public deleteTempateObject: { template_id: any, index: any };
  public officeList;
  public templateId;
  public offsetValue;
  public deletedTemplateId:any;

  public searchTemplate;
  public lastTeamplateId;
  public isNewTemplate:boolean=false;
  public isTemplateId:any;
  public templateNameSubscription: Subscription;
  public templateIdSubscription: Subscription;
  public templateDeleteSubscription: Subscription;

  public recordsPerData = 0;
  public pageIndex:number = 1;
  public startRecord:any = 0;
  public endRecord:any = 0;
  public prePageIndex:number = 1;
  
  constructor(private quizBuilderApiService: QuizBuilderApiService,
    private emailSmsSubjectService: EmailSmsSubjectService,
    private userInfoService: UserInfoService,
    private dragula: DragulaService,
    private modalService: BsModalService,
    private notificationsService: NotificationsService,
    private emailSmsComponent: EmailSmsComponent) {

      this.officeList = this.userInfoService.get().OfficeList;
    /**
     * Get businessUserEmail from backend
     */
    this.businessUserEmail = this.userInfoService.get().UserName;

    /**
     * Event fire when quiz drop another section
     */
    this.dragulaSubscription = this.dragula.drop
      .subscribe((value) => {
        var fromId = value[3].id,
          toId = value[2].id,
          result;

        // toId == 0 is true when dragged to inactive bag
        if (toId == 0) {
          this.makeTemplateInactive();
        } else {
          result = this.findDroppedLocationTemplate(fromId, toId);
          this.updateTemplateQuizType(result);
        }
      });
  }

  ngOnInit() {
    this.offsetValue = this.userInfoService.get().OffsetValue;
    this.getTemplateDetails();
    this.officeIdSubscription = this.emailSmsSubjectService.officeIdSubject
      .subscribe((id) => {
        this.officeId = id;
        this.pageIndex = 1;
        this.getTemplateDetails();
      });

    this.sharedWithMeSubscription = this.emailSmsSubjectService.sharedWithMeSubjcet
      .subscribe((data) => {
        // if(!data){
        //   if(this.quizBuilderApiService.getOffice()){
        //     this.officeId = this.quizBuilderApiService.getOffice();
        //   }else{
        //     this.officeList.forEach((office) => {
        //       if(office.id == 133){
        //        this.officeId = 133
        //       }
        //     })
        //   }
        //   if(!this.officeId){
        //     this.officeId = this.officeList[0].id
        //   }
        // }
        this.sharedWithMe = data;
        // this.getTemplateDetails();
      });

    this.updateTemplateSubscription = this.emailSmsSubjectService.updateTemplateSubject
      .subscribe((bool) => {
        if (bool) {
          this.isNewTemplate=true;
          // let getPageIndex = (this.recordsPerData + 1) / 25;
          // this.pageIndex = Math.ceil(getPageIndex);
          this.pageIndex = 1;
          this.getTemplateDetails();
        }
      });

    this.notificationTypeSubscription = this.emailSmsSubjectService.notificationTypesSubject
      .subscribe((type) => {
          this.notificationType = type;
          this.pageIndex = 1;
          this.getTemplateDetails();
      })

      this.emailSmsSubjectService.templateIdSubject
      .subscribe((tempId) => {
        this.templateId = tempId
      })

      this.templateIdSubscription = this.emailSmsSubjectService.currentTemplateId.subscribe((res) => { this.isTemplateId = res });
      this.templateNameSubscription = this.emailSmsSubjectService.currentTemplateName.subscribe((res) => { 
        if(this.isTemplateId && this.quizTemplateList && res != null){
          for(let i=0; i<this.quizTemplateList.NotificationTemplateList.length; i++){
            if(this.quizTemplateList.NotificationTemplateList[i].Id == this.isTemplateId){
              this.quizTemplateList.NotificationTemplateList[i].TemplateTitle=res.trim();
            }
          }
        }
      });

     this.templateDeleteSubscription = this.emailSmsSubjectService.currentDeletedTemplateId.subscribe((res)=>{
        if(res && this.deletedTemplateId != res){
          this.deletedTemplateId=res;
          let selectedCategory = this.quizTemplateList.NotificationTemplateList.find(item => item.Id === res);
          let se=this.quizTemplateList.NotificationTemplateList.indexOf(selectedCategory);
          this.quizTemplateList.NotificationTemplateList.splice(se, 1);
          // if (this.quizTemplateList.NotificationTemplateList.length != 0) {
          //   this.emailSmsSubjectService.setTemplateId(this.quizTemplateList.NotificationTemplateList[0].Id);
          // }else {
          //   this.emailSmsSubjectService.setTemplateId(-1);
          // }
          this.pageIndex = 1;
          this.getTemplateDetails();
          this.emailSmsSubjectService.changeDeletedTemplateId(undefined);
        }
      });
  }

  /**
   * 
   * @param template selected Template Reference
   * to set Template Id
   */
  chooseTemplate(template) {
    this.searchTemplate='';
    this.emailSmsSubjectService.setTemplateId(template.Id);
  }

  /** 
   * Get Template Type Details against notificationType, officeId, sharedWithMe and businessUserEmail
   * Api integration
  */
  getTemplateDetails(pageIndex?) {
    this.pageIndex = pageIndex ? pageIndex : this.pageIndex;
    if(!this.emailSmsSubjectService.getShared() && !this.officeId){
      if(this.quizBuilderApiService.getOffice()){
        this.officeId = this.quizBuilderApiService.getOffice();
      }
      if(!this.officeId && this.officeList.length){
        this.officeId = this.officeList[0].id
      }
    }

    let readyToSendObj: any = {
      "NotificationType": this.notificationType,
      "OfficeId": this.officeId,
      "IncludeSharedWithMe": this.emailSmsSubjectService.getShared(),
      "PageNo": this.pageIndex,
      "PageSize": 25
    }

    this.quizBuilderApiService.getDetailsTemplateType(readyToSendObj)
      .subscribe((data) => {
        //pagination
        if(data.CurrentPageIndex == 1){
          this.startRecord = 1;
          this.endRecord = data.NotificationTemplateList.length + this.startRecord - 1 ;
        }else if(data.CurrentPageIndex > 1 && this.prePageIndex < data.CurrentPageIndex){
          this.startRecord = this.endRecord + 1;
          this.endRecord = data.NotificationTemplateList.length + this.startRecord - 1;
        }else if(data.CurrentPageIndex > 1 && this.prePageIndex > data.CurrentPageIndex){
          this.startRecord = this.startRecord - data.NotificationTemplateList.length;
          this.endRecord = this.endRecord - this.quizTemplateList.NotificationTemplateList.length;
        }
        this.recordsPerData = data.TotalRecords;
        this.prePageIndex = data.CurrentPageIndex;

        this.quizTemplateList = data;
        this.lastTeamplateId = this.quizTemplateList.NotificationTemplateList[this.quizTemplateList.NotificationTemplateList.length-1];
        this.quizTemplateList.NotificationTemplateList.forEach((quiz,i) => {
          quiz.templates="Template" + " "+ (i+1);
        }); 
        this.searchTemplate='';
        if(this.isNewTemplate){
          // if(this.prePageIndex > 1){
          //   this.startRecord = ((this.prePageIndex - 1) * 25 ) + 1;
          //   this.endRecord = this.recordsPerData;
          // }
          // this.emailSmsSubjectService.setTemplateId(this.lastTeamplateId.Id);
          this.emailSmsSubjectService.setTemplateId(this.quizTemplateList.NotificationTemplateList[0].Id);
          this.isNewTemplate=false;
        }else if (data.NotificationTemplateList.length != 0 && !this.isNewTemplate) {
          this.emailSmsSubjectService.setTemplateId(data.NotificationTemplateList[0].Id);
        }else {
          this.emailSmsSubjectService.setTemplateId(-1);
        }
      }, (error) => {
        this.notificationsService.error('Dropdown-Notification', 'Something Went Wrong')
      });
  }

  /** 
   * Function call when quiz drop into inactive section
   * Api integration
   * Set Inactive quiz
  */
  makeTemplateInactive() {
    var body = {
      NotificationType: this.notificationType,
      QuizInTemplateList: []
    };

    this.quizTemplateList.InactiveQuizList.forEach((type) => {
      body.QuizInTemplateList.push({
        id: type.Id
      });
    });

    this.quizBuilderApiService.setInactiveQuizType(body)
      .subscribe((data) => {
        this.notificationsService.success('Dropdown-Notification', 'Template has been Inactive');
      }, (error) => {
        this.notificationsService.error('Dropdown-Notification', 'Something Went Wrong');
      })

  }

  /**
 * Function to return the template to which the quiz type was dragged to
 * 
 * @param from : Template Id : The place ``FROM`` where the type was dragged
 * @param to : Template Id : The place ``TO`` where the type was dragge
 */
  findDroppedLocationTemplate(fromId, to_id) {
    var result;
    if (Number(to_id) !== 0) {
      result = this.quizTemplateList.NotificationTemplateList.filter(function (obj) {
        return obj.Id == to_id;
      });

      try {
        //copy field to new key for server requirement
        result[0]['QuizList'] = result[0].QuizList
      } catch (e) {
        // this.notificationsService.error(e)
      }
      return result[0];
    }
  }

  /**
   * Function to update quiz types in a template
   */
  updateTemplateQuizType(result) {
    if (!result) return;
    if (!result.NotificationType) {
      result.NotificationType = this.notificationType
    }
    if (!result.OfficeId || result.OfficeId == 0) {
      console.warn("Office id was found to be 0. pls verify");
      result.OfficeId = this.officeId;
    }

    this.quizBuilderApiService.updateQuizTemplate(result)
      .subscribe((data) => {
        this.notificationsService.success("Success")
      }, (error) => {
        this.notificationsService.error("Error")
      })
  }

  //Modal open when delete button clicked
  openModalDelete(template: TemplateRef<any>, tempId, index) {
    this.deleteTempateObject = {
      template_id: tempId,
      index: index
    }
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  /**
 * Delete Template 
 */
  deleteTemplate(deleteobj: { template_id: any, index: any }) {
    if (!deleteobj.template_id) console.warn("Template id found missing");
    this.quizTemplateList.NotificationTemplateList.splice(deleteobj.index, 1);
    this.quizBuilderApiService.deleteTemplateBody(deleteobj.template_id)
      .subscribe((data) => {
        this.notificationsService.success("Success");
        this.emailSmsSubjectService.setTemplateId(null);
      }, (error) => {
        this.notificationsService.error(error)
      })
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

  /**
 * Function to call when setting button is clicked
 */
  changeOrder(templateId, type) {
    this.emailSmsComponent.callSettingSidebar(JSON.parse(JSON.stringify(this.quizTemplateList)), templateId, type)
  }

  ngOnDestroy() {
    this.officeIdSubscription.unsubscribe();
    this.sharedWithMeSubscription.unsubscribe();
    this.dragulaSubscription.unsubscribe();
    this.updateTemplateSubscription.unsubscribe();
    this.notificationTypeSubscription.unsubscribe();
    this.templateNameSubscription.unsubscribe();
    this.templateIdSubscription.unsubscribe();
    this.templateDeleteSubscription.unsubscribe();
  }

}
