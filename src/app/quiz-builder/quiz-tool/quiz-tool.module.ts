import { NgModule, Pipe } from "@angular/core";
import { QuizToolComponent } from "./quiz-tool.component";
import { CommonModule } from "@angular/common";
import { QuizToolRoutingModule } from "./quiz-tool-routing.module";
import { BrandingComponent } from "./branding/branding.component";
import { SocialSharingComponent } from "./social-sharing/social-sharing.component";
import { CoverPageComponent } from "./cover-page/cover-page.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ImageUrlComponent } from "./branding/image-url/image-url.component";
import { QuizzToolHelper } from "./quiz-tool-helper.service";
import { FocusDirective } from "./focus-directive";
import { QuestionsComponent } from "./questions/questions.component";
import { ResultsComponent } from "./results/results.component";
import { SetCorrectAnswerComponent } from "./questions/set-correct-answer/set-correct-answer.component";
import { ReorderQuestionsComponent } from "./reorder-questions/reorder-questions.component";
import { TextViewComponent } from "./questions/text-view/text-view.component";
import { PredefinedAnsComponent } from "./questions/predefined-ans/predefined-ans.component";
import { ImageViewComponent } from "./questions/image-view/image-view.component";
import { DragulaModule } from "ng2-dragula";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { QuizToolResolver, QuizCategoriesResolve, BrandingAndStylingResolver } from "./quiz-tool-resolve";
import { QuestionsResolver } from "./questions/questions-resolve";
import { CustomImgUploaderComponent } from "./custom-img-uploader/custom-img-uploader.component";
import {
  CloudinaryModule,
  CloudinaryConfiguration
} from "@cloudinary/angular-5.x";
import { Cloudinary } from "cloudinary-core";
import { RedirectResultsComponent } from "./redirect-results/redirect-results.component";
import { SelectModule } from "ng-select";
import { DropdownDirective } from "./drop-down-directive";
import { BranchingLogicAuthService } from "./branching-logic-auth.service";
import { ResultResolver } from "./results/result.resolver";
import { PopoverModule } from "ngx-bootstrap/popover";
import { TooltipComponent } from "./results/tooltip/tooltip.component";
import { ResultSettingsComponent } from "./results/result-settings/result-settings.component";
import { UrlSizeColorSidebarComponent } from "./url-size-color-sidebar/url-size-color-sidebar.component";
import { ColorPickerModule } from "ngx-color-picker";
import { ModalModule } from "ngx-bootstrap/modal";
import { SidebarOpenDirective } from "./sidebar-open-directive";
import { ApplicationPipes } from "../../shared/pipes/TimeFormatPipe";
import { TextTruncatePipeModule } from "../../shared/pipes/text-truncate.pipe";
import { CoverPageResolver } from "./cover-page/cover-resolve";
import { ResultTemplateBodyComponent } from "./results/result-template-body/result-template-body.component";
import { ClipboardModule } from "ngx-clipboard";
import { TranslateModule } from "@ngx-translate/core";
import { environment } from "../../../environments/environment";
import { FONT_PICKER_CONFIG } from "ngx-font-picker";
import { FontPickerModule, FontPickerConfigInterface } from "ngx-font-picker";
import { ActionComponent } from "./action/action.component";
import { ContentComponent } from "./content/content.component";
import { ActionResolver, AppointmentResolver, AutomationResolver } from "./action/action.resolver";
import { ContentResolver } from "./content/content.resolver";
import { AttachmentsComponent } from "./attachments/attachments.component";
import { AttachmentsResolve } from "./attachments/attachments.resolve";
import { BadgesComponent } from "./badges/badges.component";
import { BadgesResolver } from "./badges/badges.resolver";
import { BranchingLogicLatestResolve } from "./branching-logic/branching-logic-latest.resolver";
import { BranchingLogicLatestComponent } from "./branching-logic/branching-logic-latest.component";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { SetTagsComponent } from './questions/set-tags/set-tags.component';
import { ResultRangeComponent } from './result-range/result-range.component';
import { OnlyDecimalModule } from "../../shared/directives/decimal.directive";
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { QuizToolData } from "./quiz-tool.data";
import { OnlyNumberModule } from "../../shared/directives/directives";
import { NegativeModule } from "../../shared/directives/negative.directive";
import { ShowMultipleResultComponent } from './show-multiple-result/show-multiple-result.component';
import { ProgressbarModule } from "ngx-bootstrap";
import { MultipleResultSettingComponent } from './multiple-result-setting/multiple-result-setting.component';
import { EditResultCorelationsComponent } from './questions/edit-result-corelations/edit-result-corelations.component';
import { appActiveModule } from "../../shared/directives/active.directive";
import { appActive2Module } from "../../shared/directives/active2.directive";
import { ResultMultiUploadComponent } from './results/result-template-body/result-multi-upload/result-multi-upload.component';
import { FileUploadModule } from 'ng2-file-upload';
import { TagInputModule } from 'ngx-chips';
// import { CloudinaryWidgetModule } from '../../shared/directives/cloudinary/coudinary-widget.module';
import { PreviousQuestionComponent } from './previous-question/previous-question.component';
import { QuestionSettingComponent } from './questions/question-setting/question-setting.component';
import { ContentSettingComponent } from './content/content-setting/content-setting.component';
import { DomSanitizer } from '@angular/platform-browser';
import { CoverSettingComponent } from './cover-page/cover-setting/cover-setting.component';
import { QuizHeaderComponent } from './quiz-header/quiz-header.component';
import { OfficeCompanyComponent } from '../edit-quiz/office-company/office-company.component';
import { QuizConfigurationMenuComponent } from './quiz-configuration-menu/quiz-configuration-menu.component';
import { SharedModule } from '../../shared/shared.module';
import { EnableMediaSettingComponent } from './enable-media-setting/enable-media-setting.component';
import { DynamicMediaReplaceMentsService } from './dynamic-media-replacement';
import { SelectUsageComponent } from './select-usage/select-usage.component';
import { SearchPipes } from '../../shared/pipes/search.pipe';
import { ClickOutsideModule } from 'ng-click-outside';
import { AnwserTypeComponent } from './anwser-type/anwser-type.component';
import { EditQuizOverLayComponent } from "./edit-quiz-overLay/edit-quiz-overLay.component";
import { DetectBranchingLogicAuthService } from "./detect-branching-logic-auth.service";
import { AnswerReorderComponent } from "./questions/answer-reorder/answer-reorder.component";
import { VideoDesignSetupComponent } from "./video-design-setup/video-design-setup.component";
import { WhatsappTemplateNewVersion } from "./whatsapp-template-new-version/whatsapp-template-new-version.component";
import { OwlDateTimeModule } from "ng-pick-datetime";
import { OwlNativeDateTimeModule } from "ng-pick-datetime/date-time";

export const cloudinaryLib = {
  Cloudinary: Cloudinary
};

const DEFAULT_FONT_PICKER_CONFIG: FontPickerConfigInterface = {
  apiKey: "AIzaSyCeNbYSLGrynlZh8mRWg6RhJfTLw3y4QEM"
};
@Pipe({ name: "safeHtml" })
export class SafePipe {
  constructor(private sanitizer: DomSanitizer) {}

  transform(style) {
    //@ READ MORE at https://medium.com/@swarnakishore/angular-safe-pipe-implementation-to-bypass-domsanitizer-stripping-out-content-c1bf0f1cc36b
    return this.sanitizer.bypassSecurityTrustHtml(style);
  }
}

@NgModule({
  declarations: [
    QuizToolComponent,
    BrandingComponent,
    BranchingLogicLatestComponent,
    SocialSharingComponent,
    CoverPageComponent,
    ImageUrlComponent,
    FocusDirective,
    DropdownDirective,
    QuestionsComponent,
    ResultsComponent,
    SetCorrectAnswerComponent,
    ReorderQuestionsComponent,
    TextViewComponent,
    PredefinedAnsComponent,
    ImageViewComponent,
    CustomImgUploaderComponent,
    RedirectResultsComponent,
    TooltipComponent,
    ResultSettingsComponent,
    UrlSizeColorSidebarComponent,
    SidebarOpenDirective,
    ResultTemplateBodyComponent,
    ActionComponent,
    ContentComponent,
    AttachmentsComponent,
    BadgesComponent,
    SetTagsComponent,
    ResultRangeComponent,
    ShowMultipleResultComponent,
    MultipleResultSettingComponent,
    EditResultCorelationsComponent,
    ResultMultiUploadComponent,
    PreviousQuestionComponent,
    QuestionSettingComponent,
    ContentSettingComponent,
    CoverSettingComponent,
    SafePipe,
    QuizHeaderComponent,
    OfficeCompanyComponent,
    QuizConfigurationMenuComponent,
    EnableMediaSettingComponent,
    SelectUsageComponent,
    AnwserTypeComponent,
    EditQuizOverLayComponent,
    AnswerReorderComponent,
    VideoDesignSetupComponent,
    WhatsappTemplateNewVersion
  ],
  imports: [
    CommonModule,
    ProgressbarModule.forRoot(),
    QuizToolRoutingModule,
    FontPickerModule,
    FormsModule,
    TagInputModule,
    ReactiveFormsModule,
    DragulaModule,
    TranslateModule,
    SelectModule,
    ClipboardModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    ApplicationPipes,
    TextTruncatePipeModule,
    AccordionModule.forRoot(),
    FroalaEditorModule,
    FroalaViewModule,
    CloudinaryModule.forRoot(cloudinaryLib, {
      cloud_name: environment.cloudinaryConfiguration.cloud_name,
      upload_preset: environment.cloudinaryConfiguration.upload_preset
    }),
    ColorPickerModule,
    OnlyDecimalModule,
    // CloudinaryWidgetModule,
    OnlyNumberModule,
    NegativeModule,
    appActiveModule,
    appActive2Module,

    TooltipModule.forRoot(),
    FileUploadModule,
    SharedModule,
    SearchPipes,
    ClickOutsideModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  providers: [
    QuizzToolHelper,
    QuizToolResolver,
    QuestionsResolver,
    TextViewComponent,
    BranchingLogicLatestResolve,
    BranchingLogicAuthService,
    DetectBranchingLogicAuthService,
    ResultResolver,
    ActionResolver,
    ContentResolver,
    AppointmentResolver,
    AutomationResolver,
    BadgesResolver,
    AttachmentsResolve,
    CoverPageResolver,
    BrandingAndStylingResolver,
    DynamicMediaReplaceMentsService,
    {
      provide: FONT_PICKER_CONFIG,
      useValue: DEFAULT_FONT_PICKER_CONFIG
    },
    QuizCategoriesResolve,
    QuizToolData,
    
  ],
  entryComponents: [
    SetCorrectAnswerComponent,
    EditResultCorelationsComponent,
    ReorderQuestionsComponent,
    RedirectResultsComponent,
    ResultSettingsComponent,
    UrlSizeColorSidebarComponent,
    SetTagsComponent,
    MultipleResultSettingComponent,
    QuestionSettingComponent,
    ContentSettingComponent,
    CoverSettingComponent,
    OfficeCompanyComponent,
    BrandingComponent,
    PreviousQuestionComponent,
    AttachmentsComponent,
    EditQuizOverLayComponent,
    AnswerReorderComponent
  ]
})
export class QuizToolModule { }
