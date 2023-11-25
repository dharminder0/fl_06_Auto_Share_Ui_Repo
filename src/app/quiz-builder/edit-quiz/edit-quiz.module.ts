import { NgModule } from "@angular/core";
import { EditQuizComponent } from "./edit-quiz.component";
import { CommonModule } from "@angular/common";
import { EditQuizRouting } from "./edit-quiz-routing.module";
import { SelectModule } from "ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TagInputModule } from "ngx-chips";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
    declarations: [
        EditQuizComponent
    ],
    imports: [
        CommonModule,
        EditQuizRouting,
        SelectModule,
        FormsModule,
        TranslateModule,
        ReactiveFormsModule,
        TagInputModule
    ],
    providers: []
})

export class EditQuizModule{}