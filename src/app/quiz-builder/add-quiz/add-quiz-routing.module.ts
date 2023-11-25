import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddQuizComponent } from "./add-quiz.component";
import { OfficeCompanyComponent } from "./office-company/office-company.component";

const addQuizRoutes: Routes = [
  { path: "", component: AddQuizComponent },
  { path: "add-course", component: OfficeCompanyComponent },
  { path: "add-quiz", component: OfficeCompanyComponent },
  { path : "add-personality", component : OfficeCompanyComponent},
  { path : "add-scored", component : OfficeCompanyComponent},
  { path : "add-NPS", component : OfficeCompanyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(addQuizRoutes)],
  exports: [RouterModule]
})
export class AddQuizRoutingModule {}
