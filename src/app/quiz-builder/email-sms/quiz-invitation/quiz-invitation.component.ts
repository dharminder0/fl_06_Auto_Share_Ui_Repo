import { Component, OnInit } from '@angular/core';
import { EmailSmsSubjectService } from '../email-sms-subject.service';

@Component({
  selector: 'app-quiz-invitation',
  templateUrl: './quiz-invitation.component.html',
  styleUrls: ['./quiz-invitation.component.css']
})
export class QuizInvitationComponent implements OnInit {
  public activeTemplateId;
  constructor(private emailSmsSubjectService: EmailSmsSubjectService) { 
    /**
     * Set notification type
     */
    this.emailSmsSubjectService.setNotificationType(2)
    this.emailSmsSubjectService.changeNotificationType(true)
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
