import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AnalyticsComponent } from "./analytics.component";
import { QuizInvitationComponent } from "./quiz-invitation/quiz-invitation.component";
import { QuizReminderComponent } from "./quiz-reminder/quiz-reminder.component";
import { QuizResultComponent } from "./quiz-result/quiz-result.component";
import { AnalyticsResolver } from "./analytics.resolver";

const analyticsRoutes: Routes = [
    { path: '', component: AnalyticsComponent, children: [
        { path: '', redirectTo: 'invitation', pathMatch: 'full' },
        { path: 'invitation', component: QuizInvitationComponent },
        { path: 'reminder', component: QuizReminderComponent },
        { path: 'result', component: QuizResultComponent }
    ], resolve: {
        versionListData: AnalyticsResolver
    } }
]

@NgModule({
    imports: [RouterModule.forChild(analyticsRoutes)],
    exports: [RouterModule]
})

export class AnalyticsRoutingModule{}