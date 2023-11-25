import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplatesRoutingModule } from './templates-routing.module';
import { TemplatesComponent, DeleteTemplate } from './templates.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule, PopoverModule, PaginationModule } from 'ngx-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { SharedModule } from '../../shared/shared.module';
import { UseTemplateComponent } from './use-template/use-template.component';
import { SelectCategoryComponent } from './select-category/select-category.component';
import { SelectTypeComponent } from './select-type/select-type.component';
import { SelectTemplateComponent } from './select-template/select-template.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TemplateListResolver } from './select-template/template-list.resolve';
import { AddTemplateComponent } from './add-template/add-template.component';

@NgModule({
  imports: [
    CommonModule,
    TemplatesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ClipboardModule,
    SharedModule,
    InfiniteScrollModule,
    PopoverModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot()
  ],
  declarations: [
    TemplatesComponent, 
    SelectCategoryComponent,
    SelectTypeComponent,
    SelectTemplateComponent,
    UseTemplateComponent,
    DeleteTemplate,
    AddTemplateComponent],
  entryComponents:[DeleteTemplate],
    providers:[TemplateListResolver]
})
export class TemplatesModule { }
