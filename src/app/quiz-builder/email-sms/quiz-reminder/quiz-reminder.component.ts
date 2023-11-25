import { Component, OnInit } from '@angular/core';
import { EmailSmsSubjectService } from '../email-sms-subject.service';

@Component({
  selector: 'app-quiz-reminder',
  templateUrl: './quiz-reminder.component.html',
  styleUrls: ['./quiz-reminder.component.css']
})
export class QuizReminderComponent implements OnInit {
  public activeTemplateId;
  constructor(private emailSmsSubjectService: EmailSmsSubjectService) {
    /**
     * Set notification type
     */
    this.emailSmsSubjectService.setNotificationType(3);
    this.emailSmsSubjectService.changeNotificationType(false)
   }

  ngOnInit() {
    this.getActiveTemplate();
  }

  getActiveTemplate(){
    this.emailSmsSubjectService.templateIdSubject.subscribe((templateId) => {
      this.activeTemplateId = templateId;
    });
  }

}
