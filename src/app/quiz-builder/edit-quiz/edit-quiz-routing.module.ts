import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EditQuizComponent } from "./edit-quiz.component";
import { OfficeCompanyComponent } from "./office-company/office-company.component";

const editQuizRoutes: Routes = [
    { path: '', component: EditQuizComponent, children: [
        { path: '', redirectTo: 'office-company' },
        { path: 'office-company/:id', component: OfficeCompanyComponent }
    ] }
]

@NgModule({
    imports: [RouterModule.forChild(editQuizRoutes)],
    exports: [RouterModule]
})

export class EditQuizRouting{}