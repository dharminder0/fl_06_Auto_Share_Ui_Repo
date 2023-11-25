import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EmailSmsComponent } from "./email-sms.component";
import { QuizInvitationComponent } from "./quiz-invitation/quiz-invitation.component";
import { QuizReminderComponent } from "./quiz-reminder/quiz-reminder.component";
import { QuizResultComponent } from "./quiz-result/quiz-result.component";

const emailSmsRoutes: Routes = [
    { path: '', component: EmailSmsComponent, children: [
        { path: '', redirectTo: 'quiz-invitation', pathMatch: 'full' },
        { path: 'quiz-invitation', component: QuizInvitationComponent },
        { path: 'quiz-reminder', component: QuizReminderComponent },
        { path: 'quiz-result', component: QuizResultComponent }
    ] }
]

@NgModule({
    imports: [RouterModule.forChild(emailSmsRoutes)],
    exports: [RouterModule]
})

export class EmailSmsRoutuingModule{}