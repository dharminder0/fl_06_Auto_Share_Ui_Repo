import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { QuizUserComponent } from "./quiz-user.component";
import { QuizUserResolver } from "./quiz-user.resolver";

const quizUserRoutes: Routes = [
    { path: '', component: QuizUserComponent, resolve: {
        quizList: QuizUserResolver
    } }
];

@NgModule({
    imports: [RouterModule.forChild(quizUserRoutes)],
    exports: [RouterModule]
})

export class QuizUserRoutingModule{}