import { Component, OnInit } from '@angular/core';
import { QuizBuilderApiService } from '../../quiz-builder-api.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { EmailSmsSubjectService } from '../email-sms-subject.service';
import { UserInfoService } from '../../../shared/services/security.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-add-templates',
  templateUrl: './add-templates.component.html',
  styleUrls: ['./add-templates.component.css']
})
export class AddTemplatesComponent implements OnInit {

  public addTemplateForm: FormGroup;
  public officeId;
  public sharedWithMe;
  public quizList;
  public businessUserEmail;
  public businessUserId;
  public offsetValue;  

  constructor(private quizBuilderApiService: QuizBuilderApiService,
    private _fb: FormBuilder,
    private emailSmsSubjectService: EmailSmsSubjectService,
    private userInfoService: UserInfoService,
    private notificationsService: NotificationsService) { 

      /**
       * Get busimessUserId and businessUserEmail from backend
       */

      this.businessUserId = this.userInfoService.get().BusinessUserId;
      this.businessUserEmail = this.userInfoService.get().UserName;
    }

  ngOnInit() {
    this.offsetValue = this.userInfoService.get().OffsetValue;
    /**
     * Create New Form instance
     */

    this.addTemplateForm = this._fb.group({
      'OfficeId': this.officeId,
      'NotificationType': this.emailSmsSubjectService.notificationType,
      'Subject': '',
      'Body': '',
      'SMSText': '',
      'QuizInTemplateList': this._fb.array([]),
      'TemplateAttachmentList': this._fb.array([])

    });

    /**
     * Get Quiz List Data against businessuserid, businessuserEmail, officeId and sharedWithMe
     * Api integration
     */
    this.quizBuilderApiService.getQuizList(this.officeId, this.sharedWithMe, this.offsetValue ,this.quizBuilderApiService.automationType.toString())
    .subscribe((data) => {
      this.quizList = data;
    },(error) => {
      this.notificationsService.error('Add-Template', 'Something Went Wrong');
    });
  }

  /**
   * 
   * @param index : selected Quiz Index for drag-drop
   */
  omSelectQuiz(index){

    var quizIndex = 0;
    var idExist = false;

    idExist = this.addTemplateForm.controls['QuizInTemplateList'].value.forEach(data => {
      quizIndex++;
      if(data.Id == this.quizList[index].Id){
        return true;
      }
    });

    if(idExist){
      (<FormArray>this.addTemplateForm.get('QuizInTemplateList')).removeAt(quizIndex);
    }else{
      (<FormArray>this.addTemplateForm.get('QuizInTemplateList')).push(this.formGroupBuilder(this.quizList[index].Id))
    }
  }

  /**
   * 
   * @param quizId QuizID
   * create new FormGroup against QuizId
   */
  formGroupBuilder(quizId){
    return this._fb.group({
      'Id': quizId,
    });
  }

  /** 
   * To Add New Template body
  */
  addNewTemplate(){
    if(this.addTemplateForm.value.QuizInTemplateList.length == 0){
      this.notificationsService.alert('Please add atleast one automation type');
      return;
    }

    this.quizBuilderApiService.addNewQuizTemplate(this.addTemplateForm.value)
    .subscribe(data => {
    //  this.notificationsService.success('Add-Template', `New Template has been created with id = ${data.id}`)
      this.emailSmsSubjectService.setAddNewTemplate(true);
    },(error) => {
      this.notificationsService.error('Error');
    })
  }

}
