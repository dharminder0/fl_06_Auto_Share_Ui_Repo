import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddAutomationRoutingModule } from './add-automation-routing.module';
import { AddAutomationComponent } from './add-automation.component';
import { SelectModeComponent } from './select-mode/select-mode.component';
import { TemplatesModule } from '../templates/templates.module';
import { AddQuizModule } from '../add-quiz/add-quiz.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    AddAutomationRoutingModule,
    TemplatesModule,
    AddQuizModule,
    TranslateModule
  ],
  declarations: [
    AddAutomationComponent,
    SelectModeComponent
  ],
  providers : []
})
export class AddAutomationModule { }
