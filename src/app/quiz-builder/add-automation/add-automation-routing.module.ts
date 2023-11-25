import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddAutomationComponent } from './add-automation.component';
// import { SelectTemplateComponent } from './select-template/select-template.component';
// import { TemplateListResolver } from './select-template/template-list.resolve';
import { SelectModeComponent } from './select-mode/select-mode.component';
import { SelectCategoryComponent } from '../templates/select-category/select-category.component';
// import { SelectTypeComponent } from './select-type/select-type.component';
// import { SelectCategoryComponent } from './select-category/select-category.component';

const routes: Routes = [
  {
    path: "",
    component: AddAutomationComponent,
    children: [
      {
        path: '',
        redirectTo: 'select-automation'
      },
      {
        path: "mode",
        component: SelectModeComponent
      },
      {
        path: "category",
        component: SelectCategoryComponent,
      },
      {
        path: 'select-automation',
        loadChildren: () => import('../add-quiz/add-quiz.module').then(m => m.AddQuizModule)
      },
      // {
      //   path:"type",
      //   component:SelectTypeComponent
      // },{
      //   path:"template",
      //   component:SelectTemplateComponent,
      //   resolve:{
      //     templateList:TemplateListResolver
      //   }
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddAutomationRoutingModule { }
