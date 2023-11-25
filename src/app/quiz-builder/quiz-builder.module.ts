import { NgModule } from "@angular/core";
import { QuizbuilderComponent } from "./quiz-builder.component";
import { CommonModule } from "@angular/common";
import { QuizbuilderRoutingMOdule } from "./quiz-builder-routing.module";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { QuizBuilderApiService } from "./quiz-builder-api.service";
import { ModalModule } from "ngx-bootstrap";
import { EmailSmsSubjectService } from "./email-sms/email-sms-subject.service";
import { TranslateModule } from "@ngx-translate/core";
import { SidebarRightComponent } from "./sidebar-right/sidebar-right.component";
import { ShareQuizComponent } from "./share-quiz/share-quiz.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ClipboardModule } from "ngx-clipboard";
import { CssVarsService } from "../shared/services/cssVarsService.service";
import { QuizBuilderDataService } from "./quiz-builder-data.service";
import { HeaderAppComponent } from './header-app/header-app.component';
import { QuizPermissionGaurd } from "./quiz-permission.guard";
import {QuizzToolHelper} from "./quiz-tool/quiz-tool-helper.service";
import { AllowTemplate } from "../shared/services/auth-guard.service";
import { SelectModule } from 'ng-select';
import { QuizModule } from "../quiz/quiz.module";
import { SharedModule } from '../shared/shared.module';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { environment } from '../../environments/environment';
import { Cloudinary } from 'cloudinary-core';

export const cloudinaryLib = {
  Cloudinary: Cloudinary
};

@NgModule({
  declarations: [
    QuizbuilderComponent,
    HeaderComponent,
    FooterComponent,
    SidebarRightComponent,
    ShareQuizComponent,
    HeaderAppComponent
  ],
  imports: [
    QuizModule,
    CommonModule,
    SelectModule,
    QuizbuilderRoutingMOdule,
    TranslateModule,
    FormsModule,
    ClipboardModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule.forRoot(),
    CloudinaryModule.forRoot(cloudinaryLib, {
      cloud_name: environment.cloudinaryConfiguration.cloud_name,
      upload_preset: environment.cloudinaryConfiguration.upload_preset
    }),
  ],
  providers: [QuizBuilderApiService, EmailSmsSubjectService, QuizBuilderDataService,QuizzToolHelper,
    CssVarsService,QuizPermissionGaurd,AllowTemplate],
  entryComponents: [ShareQuizComponent]
})
export class QuizbuilderModule { }
