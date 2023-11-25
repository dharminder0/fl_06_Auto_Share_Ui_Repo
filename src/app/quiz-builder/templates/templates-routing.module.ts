import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplatesComponent } from './templates.component';
import { UseTemplateComponent } from './use-template/use-template.component';
import { SelectCategoryComponent } from './select-category/select-category.component';
import { SelectTypeComponent } from './select-type/select-type.component';
import { SelectTemplateComponent } from './select-template/select-template.component';
import { TemplateListResolver } from './select-template/template-list.resolve';
import { AddTemplateComponent } from './add-template/add-template.component';

const routes: Routes = [
  {
    path: "", component: TemplatesComponent
  },
  {
    path: "use-template",
    component: UseTemplateComponent,
    children:[
      {
        path:"",
        redirectTo:"category",
      },
      {
        path:"category",
        component:SelectCategoryComponent,
        data:{
          selectionMode:'multiple',
          mode:'use-template'
        }
      },
      {
        path:"type",
        component:SelectTypeComponent,
        data:{
          selectionMode:'multiple',
          mode:'use-template'
        }
      }
    ]
  },
  {
    path: "use-template/template",
    component: SelectTemplateComponent,

    resolve: {
      templateList: TemplateListResolver
    }
  },
  {
    path: "add-template",
    component: AddTemplateComponent,
    children:[
      {
        path:"",
        redirectTo:"category",
      },
      {
        path:"category",
        component:SelectCategoryComponent,
        data:{
          selectionMode:'single',
          mode:'add-template'
        }
      },
      {
        path:"type",
        component:SelectTypeComponent,
        data:{
          selectionMode:'single',
          mode:'add-template'
        }
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplatesRoutingModule { }
