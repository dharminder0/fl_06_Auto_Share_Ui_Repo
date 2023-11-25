import { NgModule } from "@angular/core";
import { AnalyticsComponent } from "./analytics.component";
import { CommonModule } from "@angular/common";
import { AnalyticsRoutingModule } from "./analytics-routing.module";
import { QuizInvitationComponent } from './quiz-invitation/quiz-invitation.component';
import { QuizReminderComponent } from './quiz-reminder/quiz-reminder.component';
import { QuizResultComponent } from './quiz-result/quiz-result.component';
import { SelectModule } from "ng-select";
import { AnalyticsResolver } from './analytics.resolver'
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AnalyticsSubjectService } from './analytics-subject.service';
import { ProgressbarModule } from "ngx-bootstrap";
import * as moment from 'moment';
import { TranslateModule } from "@ngx-translate/core";
import { SvgComboChartModule } from "../../shared/combo-chart/combo-chart";

@NgModule({
    declarations: [
        AnalyticsComponent,
        QuizInvitationComponent,
        QuizReminderComponent,
        QuizResultComponent
    ],
    imports: [
        CommonModule,
        SvgComboChartModule,
        SelectModule,
        AnalyticsRoutingModule,
        FormsModule,
        TranslateModule,
        ProgressbarModule.forRoot(),
        ReactiveFormsModule
    ],
    providers: [
        AnalyticsResolver,
        AnalyticsSubjectService
    ]
})

export class AnalyticsModule{}