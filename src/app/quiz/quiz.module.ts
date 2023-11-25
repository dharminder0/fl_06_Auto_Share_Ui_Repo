import { Injectable, NgModule, Pipe } from "@angular/core";
import { MbscModule } from '@mobiscroll/angular';
import { CommonModule } from "@angular/common";
import { QuizRoutingModule } from "./quiz-routing.module";
import { QuizComponent } from "./quiz.component";
import { CoverDetailsComponent } from "./cover-details/cover-details.component";
import { QuestionDetailsComponent } from "./question-details/question-details.component";
import { ResultDetailsComponent } from "./result-details/result-details.component";
import { AnswerDetailsComponent } from "./answer-details/answer-details.component";
import { QuizResolve, GetQuizAttemptCode, QuizPreviewResolve } from "./quiz-resolve";
import { QuizApiService } from "./quiz-api.service";
import { QuizDataService } from "./quiz-data.service";
import { QuestionImageDetailsComponent } from "./question-image-details/question-image-details.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { QuizTerminatedComponent } from "./quiz-terminated/quiz-terminated.component";
import {
  PublishCodeRedirectComponent,
  PreviewComonent
} from "./publish-code-redirect/publish-code-redirect.component";
import { LeadFormComponent } from "./lead-form/lead-form.component";
import { OnlyNumberModule } from "../shared/directives/directives";
import { TranslateModule } from "@ngx-translate/core";
import { ShareButtonsModule } from "ngx-sharebuttons";
import { CloudinaryModule } from "@cloudinary/angular-5.x";
import { Cloudinary } from "cloudinary-core";
import { environment } from "../../environments/environment";
import { ContentDetailsComponent } from "./content-details/content-details.component";
// import { SelectModule } from 'ng-select';
import { CssVarsService } from "../shared/services/cssVarsService.service";
import { TemplatePreviewComponent } from './template-preview/template-preview.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
// import { MultipleResultsComponent } from './multiple-results/multiple-results.component';
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
// import { IndividualResultsDetailsComponent } from './individual-results-details/individual-results-details.component';
import { TooltipModule, BsDatepickerModule, DatepickerModule  } from "ngx-bootstrap";
export const cloudinaryLib = {
  Cloudinary: Cloudinary
};
import { ModalModule } from 'ngx-bootstrap/modal';
import { AddQuizModule } from "../quiz-builder/add-quiz/add-quiz.module";
import { QuizBuilderApiService } from "../quiz-builder/quiz-builder-api.service";
import { QuizBuilderDataService } from "../quiz-builder/quiz-builder-data.service";
import { MultipleResultsComponent } from "./multiple-results/multiple-results.component";
import { IndividualResultsDetailsComponent } from "./individual-results-details/individual-results-details.component";
import { DomSanitizer } from "@angular/platform-browser";
import { FroalaEditorOptions } from "../quiz-builder/email-sms/template-body/template-froala-options";
import { NgCircleProgressModule } from 'ng-circle-progress';
import { SearchPipes } from '../shared/pipes/search.pipe';
import { AutomationReportComponent } from './automation-report/automation-report.component';
import { CustomDomainRedirectComponent } from './custom-domain-redirect/custom-domain-redirect.component';
import { PieChartComponent } from './automation-report/pieChart/pieChart.component';
import { FreeTextQuestionComponent } from './automation-report/free-text-question/free-text-question.component';
import { SharedModule } from '../shared/shared.module';
import { SortedBarChartComponent } from './automation-report/sorted-bar-chat/sorted-bar-chat.component';
import { EmailSmsSubjectService } from '../quiz-builder/email-sms/email-sms-subject.service';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { ColumnWithRoatedSeriesComponent } from './automation-report/column-with-roated-series/column-with-roated-series.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { ReportResultComponent } from './automation-report/report-result/report-result.component';
import { IndividualAutomationReportComponent } from './individual-automation-report/individual-automation-report.component';
import { ZoomableValueChartComponent } from './automation-report/zoomable-value-axis/zoomable-value-axis.component';
import { CompleteQuizComponent } from './complete-quiz/complete-quiz.component';
import { LeadResultComponent } from "./lead-resultform/lead-resultform.component";
import { DefaultMessageComponent } from "./default-message/default-message.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { formatDate } from '@angular/common';
@Pipe({ name: "safeHtml" })
export class SafePipe {
  constructor(private sanitizer: DomSanitizer) {}

  transform(style) {
    //@ READ MORE at https://medium.com/@swarnakishore/angular-safe-pipe-implementation-to-bypass-domsanitizer-stripping-out-content-c1bf0f1cc36b
    return this.sanitizer.bypassSecurityTrustHtml(style);
  }
}

export const PICK_FORMATS = {
  parse: {dateInput: {month: 'short', year: 'numeric', day: 'numeric'}},
  display: {
      dateInput: 'input',
      monthYearLabel: {year: 'numeric', month: 'short'},
      dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
      monthYearA11yLabel: {year: 'numeric', month: 'long'}
  }
};

@Injectable()
export class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
      if (displayFormat === 'input') {
          return formatDate(date,'dd/MM/yyyy',this.locale);
      } else {
          return date.toDateString();
      }
  }
}

@NgModule({
  declarations: [
    QuizComponent,
    CoverDetailsComponent,
    QuestionDetailsComponent,
    ResultDetailsComponent,
    AnswerDetailsComponent,
    QuestionImageDetailsComponent,
    QuizTerminatedComponent,
    PublishCodeRedirectComponent,
    LeadFormComponent,
    PreviewComonent,
    ContentDetailsComponent,
    TemplatePreviewComponent,
    MultipleResultsComponent,
    IndividualResultsDetailsComponent,
    SafePipe,
    CustomDomainRedirectComponent,
    AutomationReportComponent,
    PieChartComponent,
    FreeTextQuestionComponent,
    SortedBarChartComponent,
    BookAppointmentComponent,
    ColumnWithRoatedSeriesComponent,
    ReportResultComponent,
    IndividualAutomationReportComponent,
    ZoomableValueChartComponent,
    CompleteQuizComponent,
    LeadResultComponent,
    DefaultMessageComponent
  ],
  imports: [
    CommonModule,
    QuizRoutingModule,
    //SelectModule,
    NgSelectModule,
    FormsModule,
    MbscModule,
    ReactiveFormsModule,
    ShareButtonsModule.forRoot(),
    OnlyNumberModule,
    TranslateModule,
    TooltipModule.forRoot(),
    ProgressbarModule.forRoot(),
    BsDatepickerModule.forRoot(),
    FroalaEditorModule,
    FroalaViewModule,
    DatepickerModule.forRoot(), 
    CloudinaryModule.forRoot(cloudinaryLib, {
      cloud_name: environment.cloudinaryConfiguration.cloud_name,
      upload_preset: environment.cloudinaryConfiguration.upload_preset
    }),
    ModalModule.forRoot(),
    NgCircleProgressModule.forRoot(),
    SearchPipes,
    SharedModule,
    ClickOutsideModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule
  ],
  providers: [QuizResolve,QuizApiService, QuizDataService, GetQuizAttemptCode,QuizPreviewResolve ,CssVarsService,QuizBuilderApiService,QuizBuilderDataService, FroalaEditorOptions,EmailSmsSubjectService,
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS }
  ],
  entryComponents: [
    CoverDetailsComponent,
    QuestionDetailsComponent,
    ResultDetailsComponent,
    QuestionImageDetailsComponent,
    LeadFormComponent,
    AnswerDetailsComponent,
    QuizTerminatedComponent,
    ContentDetailsComponent,
    MultipleResultsComponent,
    IndividualResultsDetailsComponent,
    FreeTextQuestionComponent,
    BookAppointmentComponent,
    LeadResultComponent,
    DefaultMessageComponent
  ]
})
export class QuizModule {}
