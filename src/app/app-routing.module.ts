import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { UnauthorizedComponent } from "./shared/components/unauthorized/unauthorized.component";
import { FetchToken, IsOtherDomain } from "./shared/services/auth-guard.service";
import { NotFoundComponent } from "./shared/components/not-found/not-found.component";
import { ErrorsComponent } from "./shared/components/errors/errors.component";
import { QuizComponent } from "./quiz/quiz.component";
import { CustomDomainResolve } from './quiz/quiz-resolve';
import { PublishCodeRedirectComponent } from './quiz/publish-code-redirect/publish-code-redirect.component';

const appRoutes: Routes = [
  { path: "", redirectTo: "quiz-builder", pathMatch: "full" },
  {
    path: "quiz-builder",
    loadChildren: () => import('./quiz-builder/quiz-builder.module').then(m => m.QuizbuilderModule),
    canActivate: [FetchToken]
  },
  {
    path: "quiz",
    loadChildren: () => import('./quiz/quiz.module').then(m => m.QuizModule),
    canActivate: [FetchToken]
  },
  {
    path: ':id', component: PublishCodeRedirectComponent, resolve: { customDomainData: CustomDomainResolve }, canActivate: [IsOtherDomain]
  },
  { path: "unauthorized", component: UnauthorizedComponent },
  { path: "404", component: NotFoundComponent },
  { path: "error", component: ErrorsComponent },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
