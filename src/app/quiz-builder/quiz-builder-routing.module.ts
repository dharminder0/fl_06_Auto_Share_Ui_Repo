import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { QuizbuilderComponent } from "./quiz-builder.component";
import { QuizToolResolver } from "./quiz-tool/quiz-tool-resolve";
import { AllowTemplate } from "../shared/services/auth-guard.service";
import { PreviewComonent } from "../quiz/publish-code-redirect/publish-code-redirect.component";
import { QuizComponent } from "../quiz/quiz.component";
import { QuizPreviewResolve } from "../quiz/quiz-resolve";

const quizRoutes: Routes = [
    {
        path: '', component: QuizbuilderComponent, children: [
            { path: "", redirectTo: "explore", pathMatch: "full" },
            // { path: '', loadChildren: () => import('./quiz-user/quiz-user.module').then(m => m.QuizUserModule) },
            { path: 'templates', loadChildren: () => import('./templates/templates.module').then(m => m.TemplatesModule) },
            { path: 'explore', loadChildren: () => import('./explore/explore.module').then(m => m.ExploreModule) },
            { path: 'email', loadChildren: () => import('./email-sms/email-sms.module').then(m => m.EmailSmsModule) },
            { path: 'reporting', loadChildren: () => import('./reporting/reporting.module').then(m => m.ReportingModule) },
            { path: 'select-automation', loadChildren: () => import('./add-quiz/add-quiz.module').then(m => m.AddQuizModule) },
            { path: 'add-automation', loadChildren: () => import('./add-automation/add-automation.module').then(m => m.AddAutomationModule) },
            { path: 'edit-quiz', loadChildren: () => import('./edit-quiz/edit-quiz.module').then(m => m.EditQuizModule) },
            { path: 'analytics/:id', loadChildren: () => import('./analytics/analytics.module').then(m => m.AnalyticsModule) },
            { path: 'quiz-tool/:id', loadChildren: () => import('./quiz-tool/quiz-tool.module').then(m => m.QuizToolModule) }
        ]
    },
    {
        path: 'quiz-preview-mode',
        component: PreviewComonent, children: [
            {
                path: 'attempt-quiz',
                component: QuizComponent,
                resolve: {
                    quizData: QuizPreviewResolve
                }
            }
        ]
    },
]
@NgModule({
    imports: [RouterModule.forChild(quizRoutes)],
    exports: [RouterModule]
})

export class QuizbuilderRoutingMOdule { }