import { NgModule, Pipe } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedService } from "./services/shared.service";
import { ErrorsComponent } from "./components/errors/errors.component";
import { TranslateModule } from "@ngx-translate/core";
import { AppSearchComponent } from "./components/app-search/app-search.component";
import { DebounceService } from "./components/app-search/debounce.service";
import { SuggestionPanelComponent } from './components/suggestion-panel/suggestion-panel.component';
import { ShareConfigService } from './services/shareConfig.service';
import { ClickOutsideModule } from 'ng-click-outside';
import { NgHighlightModule } from 'ngx-text-highlight';
import { MediaLibraryComponent } from '../shared/components/media-library/media-library.component';
import { testPipe } from './pipes/safe.pipe';
import { DaterangepickerComponent } from './components/daterangepicker/daterangepicker.component';
import { LocaleService, NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { RecordingComponent } from './components/recording/recording.component';
import { VideoRecordingComponent } from './components/video-recoding/video-recoding.component';
import { VariablePopupService } from "./services/variable-popup.service";
import { AvailablestepsService } from "./services/availablesteps.service";
import { MessageVariablePopupComponent } from "./components/message-variable-popup/message-variable-popup.component";
import { CommonService } from "./services/common.service";
import { WhatsappTemplateNewVersionService } from "./services/whatsapp-template-new-version";
import { DomSanitizer } from "@angular/platform-browser";
import { TestAutomationComponent } from './components/test-automation/test-automation.component';
import { WhatsappHsmComponent } from './components/whatsapp-hsm/whatsapp-hsm.component';

@Pipe({ name: "safeUrl" })
export class SafeUrlPipe {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
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
        ErrorsComponent,
        AppSearchComponent,
        SuggestionPanelComponent,
        MediaLibraryComponent,
        testPipe,
        DaterangepickerComponent,
        RecordingComponent,
        VideoRecordingComponent,
        MessageVariablePopupComponent,
        SafeUrlPipe,
        TestAutomationComponent,
        WhatsappHsmComponent,
        SafePipe
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule,
        ClickOutsideModule,
        NgHighlightModule,
        NgxDaterangepickerMd.forRoot()
    ],
    providers: [SharedService,DebounceService,ShareConfigService,LocaleService,VariablePopupService,AvailablestepsService,CommonService,WhatsappTemplateNewVersionService],
    exports: [AppSearchComponent,SuggestionPanelComponent,MediaLibraryComponent,DaterangepickerComponent,RecordingComponent,VideoRecordingComponent,testPipe,MessageVariablePopupComponent,TestAutomationComponent,WhatsappHsmComponent]
})

export class SharedModule{}