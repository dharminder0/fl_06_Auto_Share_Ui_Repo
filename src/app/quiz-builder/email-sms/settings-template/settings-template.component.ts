import { Component, OnInit } from '@angular/core';
import { QuizBuilderApiService } from '../../quiz-builder-api.service';
import { NotificationsService } from 'angular2-notifications';
import { EmailSmsSubjectService } from '../email-sms-subject.service';

@Component({
  selector: 'app-settings-template',
  templateUrl: './settings-template.component.html',
  styleUrls: ['./settings-template.component.css']
})
export class SettingsTemplateComponent implements OnInit {
  public inactiveValue = 0;
  public _ref;
  public list;
  public templateId;
  public notificationtype;

  constructor(
    private quizBuilderApiService: QuizBuilderApiService,
    private notificationsService: NotificationsService,
    private emailSmsSubjectService: EmailSmsSubjectService,
  ) { }

  ngOnInit() { }


  saveOrder() {

    if (this.templateId == 0) {
      this.makeTemplateInactive()
    } else {
      var templateResult = this.list.NotificationTemplateList.filter(item => { return item.Id == this.templateId })[0]
      templateResult.QuizInTemplateList.push(this.notificationtype)
      templateResult.QuizInTemplateList = templateResult.QuizInTemplateList
      this.quizBuilderApiService.updateQuizTemplate(templateResult)
        .subscribe((data) => {
          this.notificationsService.success("Success");
          this.emailSmsSubjectService.setAddNewTemplate(true)
        }, (error) => {
          this.notificationsService.error("Error")
        })
    }

    // this.emailSmsSubject.whenSettingCloses.next(this.emailSmsDataService.getNotificationType())
  }


  /**
   * Function to make a template inactive
   */
  makeTemplateInactive() {
    var body = {
      OfficeId: this.quizBuilderApiService.getOffice(),
      NotificationType: this.emailSmsSubjectService.getNotificationType(),
      QuizInTemplateList: []
    }

    this.list.InactiveQuizList.forEach((type) => {
      body.QuizInTemplateList.push({
        id: type.Id
      })
    })

    body.QuizInTemplateList.push({
      id: this.notificationtype.Id
    })

    this.quizBuilderApiService.setInactiveQuizType(body)
      .subscribe((data) => {
        this.notificationsService.success("Success");
        this.emailSmsSubjectService.setAddNewTemplate(true)
      }, (error) => {
        this.notificationsService.error(error)
      })

  }
}

