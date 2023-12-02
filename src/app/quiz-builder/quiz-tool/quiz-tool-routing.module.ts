import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { QuizToolComponent } from "./quiz-tool.component";
import { BrandingComponent } from "./branding/branding.component";
import { SocialSharingComponent } from "./social-sharing/social-sharing.component";
import { CoverPageComponent } from "./cover-page/cover-page.component";
import { QuestionsComponent } from "./questions/questions.component";
import { ResultsComponent } from "./results/results.component";
import { QuizToolResolver, QuizCategoriesResolve, BrandingAndStylingResolver } from "./quiz-tool-resolve";
import { QuestionsResolver } from "./questions/questions-resolve";
import { BranchingLogicAuthService } from './branching-logic-auth.service';
import { ResultResolver } from './results/result.resolver';
import { CoverPageResolver } from './cover-page/cover-resolve'
import { ActionComponent } from "./action/action.component";
import { ContentComponent } from "./content/content.component";
import { ActionResolver, AppointmentResolver, AutomationResolver } from "./action/action.resolver";
import { ContentResolver } from "./content/content.resolver";
import { BadgesComponent } from "./badges/badges.component";
import { BadgesResolver } from "./badges/badges.resolver";
import { BranchingLogicLatestComponent } from "./branching-logic/branching-logic-latest.component";
import { BranchingLogicLatestResolve } from "./branching-logic/branching-logic-latest.resolver";
import { AttachmentsComponent } from "./attachments/attachments.component";
import { AttachmentsResolve } from "./attachments/attachments.resolve";
import { QuizPermissionGaurd } from "../quiz-permission.guard";
import { ShowMultipleResultComponent } from "./show-multiple-result/show-multiple-result.component";
import { PreviousQuestionComponent } from './previous-question/previous-question.component';
import { DetectBranchingLogicAuthService } from "./detect-branching-logic-auth.service";

const quizToolRoutes: Routes = [
    {
        path: '', component: QuizToolComponent, children: [
            { path: '', redirectTo: 'cover' },
            {
                path: 'cover', component: CoverPageComponent, resolve: {
                    coverPageDetail: CoverPageResolver
                }
            },
            { path: 'branding', component: BrandingComponent },
            { path: 'previous', component: PreviousQuestionComponent },
            { path: 'social-sharing', component: SocialSharingComponent },
            {
                path: "attachments",
                component: AttachmentsComponent,
                resolve: {
                    attachmentData: AttachmentsResolve
                }
            },
            {
                path: 'question',
                runGuardsAndResolvers: "always",
                children: [{
                    path: ':qId',
                    component: QuestionsComponent,
                    runGuardsAndResolvers: 'always',
                    resolve: {
                        questionData: QuestionsResolver
                    }
                }]
            },
            {
                path: 'result/:rId', component: ResultsComponent, resolve: {
                    resultData: ResultResolver
                }
            },
            {
                path: 'show-multiple-results', component: ShowMultipleResultComponent

            },
            {
                path: 'action/:aId', component: ActionComponent, resolve: {
                    quizActionData: ActionResolver,
                    appointmentData1: AppointmentResolver,
                    automationData1: AutomationResolver,
                }
            },
            {
                path: 'content/:cId', component: ContentComponent, resolve: {
                    contentData: ContentResolver
                }
            },
            {
                path: 'badge/:bId', component: BadgesComponent, resolve: {
                    badgeData: BadgesResolver
                }
            }
        ], resolve: {
            quizData: QuizToolResolver,
            brandingAndStyling: BrandingAndStylingResolver,
            quizCategoriesList: QuizCategoriesResolve
        }
    },
    {
        path: 'branching-logic', component: BranchingLogicLatestComponent, resolve: {
            quizData: QuizToolResolver,
            branchingData: BranchingLogicLatestResolve,
            quizCategoriesList: QuizCategoriesResolve
        }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(quizToolRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class QuizToolRoutingModule { }