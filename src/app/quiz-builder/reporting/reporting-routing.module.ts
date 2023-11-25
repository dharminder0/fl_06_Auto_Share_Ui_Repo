import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ReportingComponent } from "./reporting.component";
import { ReportingResolve } from "./reporting-resolver";

const reportingRoutes: Routes = [
    { path: '', component: ReportingComponent, resolve: {
        quizList: ReportingResolve
    } }
]

@NgModule({
    imports: [RouterModule.forChild(reportingRoutes)],
    exports: [RouterModule]
})

export class ReportingRoutingModule{}