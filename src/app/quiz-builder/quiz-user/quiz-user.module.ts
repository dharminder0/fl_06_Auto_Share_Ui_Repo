import { NgModule } from "@angular/core";
import { QuizUserComponent } from "./quiz-user.component";
import { CommonModule } from "@angular/common";
import { QuizUserRoutingModule } from "./quiz-user-routing.module";
import { QuizUserResolver } from "./quiz-user.resolver";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FilterPipeModule } from "../../shared/pipes/filter.pipe";
import { SortPipeModule } from '../../shared/pipes/sort.pipe';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { CustomTagComponent } from '../../shared/components/custom-tag/custom-tag.component';
import { ModalModule } from "ngx-bootstrap";
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from "@ngx-translate/core";
import { SelectModule } from "ng-select";
import { FilterOfficePipeModule } from "../../shared/pipes/officeFilter.pipe";

@NgModule({
    declarations: [
        QuizUserComponent,
        CustomTagComponent
    ],
    imports: [
        CommonModule,
        QuizUserRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        FilterPipeModule,
        FilterOfficePipeModule,
        SortPipeModule,
        SelectModule,
        ClipboardModule,
        TranslateModule,
        PopoverModule.forRoot(),
        ModalModule.forRoot(),
    ],
    providers: [
        QuizUserResolver
    ]
})

export class QuizUserModule{}