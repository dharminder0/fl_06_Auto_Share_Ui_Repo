import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { QuizComponent } from "./quiz.component";
import { PublishCodeRedirectComponent, PreviewComonent } from "./publish-code-redirect/publish-code-redirect.component"
import { QuizResolve } from "./quiz-resolve";
import { GetQuizAttemptCode } from "./quiz-resolve"
import { TemplatePreviewComponent } from "./template-preview/template-preview.component";
import { AutomationReportComponent } from './automation-report/automation-report.component';
import { IndividualAutomationReportComponent } from './individual-automation-report/individual-automation-report.component';
import { CompleteQuizComponent } from './complete-quiz/complete-quiz.component';
const quizRoutes: Routes = [
    {
        path:'quiz',
        component: PublishCodeRedirectComponent, children: [
            {
                path: 'attempt-quiz',
                component: QuizComponent,
                resolve: {
                    quizData: QuizResolve
                }
            }
        ]
    },
    {
        path: 'quiz-preview', component: PreviewComonent, children: [
            {
                path: 'attempt-quiz',
                component: QuizComponent,
                resolve: {
                    quizData: QuizResolve
                }
            },
        ]
    },
    {
        path: 'template-preview', component: TemplatePreviewComponent, children: [
            {
                path: 'attempt-quiz',
                component: QuizComponent,
                resolve: {
                    quizData: QuizResolve
                }
            },
        ]
    },
    {
        path: 'automation-report', component: AutomationReportComponent
    },
    {
        path: 'individual-automation-report', component: IndividualAutomationReportComponent
    },
    {
        path: 'complete-quiz', component: CompleteQuizComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(quizRoutes)],
    exports: [RouterModule]
})
export class QuizRoutingModule { }