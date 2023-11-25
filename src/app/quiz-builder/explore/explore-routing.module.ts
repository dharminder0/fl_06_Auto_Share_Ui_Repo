import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ExploreComponent } from "./explore.component";

const exploreRoutes: Routes = [
    { path: '', component: ExploreComponent }
]

@NgModule({
    imports: [RouterModule.forChild(exploreRoutes)],
    exports: [RouterModule]
})

export class ExploreRoutingModule{}