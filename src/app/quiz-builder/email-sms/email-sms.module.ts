import { NgModule, Pipe } from "@angular/core";
import { EmailSmsComponent } from "./email-sms.component";
import { CommonModule } from "@angular/common";
import { EmailSmsRoutuingModule } from "./email-sms-routing.module";
import { AddTemplatesComponent } from "./add-templates/add-templates.component";
import { QuizInvitationComponent } from "./quiz-invitation/quiz-invitation.component";
import { QuizReminderComponent } from "./quiz-reminder/quiz-reminder.component";
import { QuizResultComponent } from "./quiz-result/quiz-result.component";
import { ReminderSettingsComponent } from "./quiz-reminder/reminder-settings/reminder-settings.component";
import { SelectModule } from "ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EmailSmsSubjectService } from "./email-sms-subject.service";
import { DragulaModule } from "ng2-dragula";
import { DragdropNotificationComponent } from "./dragdrop-notification/dragdrop-notification.component";
import { SettingsTemplateComponent } from "./settings-template/settings-template.component";
import { TemplateBodyComponent } from "./template-body/template-body.component";
import { ModalModule } from "ngx-bootstrap";
import { OnlyNumberModule } from "../../shared/directives/directives";
import { TranslateModule } from "@ngx-translate/core";
import { OnlyDecimalModule } from "../../shared/directives/decimal.directive";
import {
  CloudinaryModule,
  CloudinaryConfiguration
} from "@cloudinary/angular-5.x";
import { Cloudinary } from "cloudinary-core";
import { environment } from "../../../environments/environment";
import { ClipboardModule } from "ngx-clipboard";
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
// import { CloudinaryWidgetModule } from "../../shared/directives/cloudinary/coudinary-widget.module";
import { MultiUploadComponent } from './template-body/multi-upload/multi-upload.component';
import {FileUploadModule} from 'ng2-file-upload';
import { LinkedUnlinkedAutomationComponent } from './linked-unlinked-automation/linked-unlinked-automation.component';
import { SearchPipes } from '../../shared/pipes/search.pipe';
import { templateSearchPipes } from '../../shared/pipes/templateFilter.pipe';
import { SharedModule } from '../../shared/shared.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { DomSanitizer } from "@angular/platform-browser";
import { WhatsappTemplateComponent } from './whatsapp-template/whatsapp-template.component';

@Pipe({ name: "safeHtml" })
export class SafePipe {
  constructor(private sanitizer: DomSanitizer) {}

  transform(style) {
    //@ READ MORE at https://medium.com/@swarnakishore/angular-safe-pipe-implementation-to-bypass-domsanitizer-stripping-out-content-c1bf0f1cc36b
    return this.sanitizer.bypassSecurityTrustHtml(style);
  }
}
export const cloudinaryLib = {
  Cloudinary: Cloudinary
};

@NgModule({
  declarations: [
    EmailSmsComponent,
    AddTemplatesComponent,
    QuizInvitationComponent,
    QuizReminderComponent,
    QuizResultComponent,
    ReminderSettingsComponent,
    DragdropNotificationComponent,
    SettingsTemplateComponent,
    TemplateBodyComponent,
    MultiUploadComponent,
    LinkedUnlinkedAutomationComponent,
    SafePipe,
    WhatsappTemplateComponent
  ],
  imports: [
    CommonModule,
    EmailSmsRoutuingModule,
    SelectModule,
    OnlyNumberModule,
    FormsModule,
    OnlyDecimalModule,
    ReactiveFormsModule,
    DragulaModule,
    TranslateModule,
    ModalModule.forRoot(),
    ClipboardModule,
    FroalaEditorModule.forRoot(), 
    FroalaViewModule.forRoot(),
    CloudinaryModule.forRoot(cloudinaryLib, {
      cloud_name: environment.cloudinaryConfiguration.cloud_name,
      upload_preset: environment.cloudinaryConfiguration.upload_preset
    }),
    // CloudinaryWidgetModule,
    FileUploadModule,
    SearchPipes,
    templateSearchPipes,
    SharedModule,
    ClickOutsideModule
  ],
  providers: [],
  entryComponents: [AddTemplatesComponent, SettingsTemplateComponent,ReminderSettingsComponent]
})
export class EmailSmsModule {}
