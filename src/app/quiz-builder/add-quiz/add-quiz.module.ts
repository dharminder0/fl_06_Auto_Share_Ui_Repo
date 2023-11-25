import { NgModule } from "@angular/core";
import { AddQuizComponent } from "./add-quiz.component";
import { CommonModule } from "@angular/common";
import { AddQuizRoutingModule } from "./add-quiz-routing.module";
import { SelectModule } from 'ng-select';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TagInputModule } from 'ngx-chips';
import { OfficeCompanyComponent } from './office-company/office-company.component';
import { TranslateModule } from "@ngx-translate/core";
import { TemplatesModule } from "../templates/templates.module";
 
@NgModule({
    declarations: [
        AddQuizComponent, 
        OfficeCompanyComponent
    ],
    entryComponents:[AddQuizComponent],
    exports:[AddQuizComponent],
    imports: [
        CommonModule,
        AddQuizRoutingModule,
        SelectModule,
        FormsModule,
        TranslateModule,
        ReactiveFormsModule,
        TagInputModule,
        TemplatesModule
    ],
    providers: []
})
export class AddQuizModule{}