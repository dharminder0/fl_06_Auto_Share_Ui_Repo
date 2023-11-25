import { NgModule } from "@angular/core";
import { ReportingComponent } from "./reporting.component";
import { CommonModule } from "@angular/common";
import { ReportingRoutingModule } from "./reporting-routing.module";
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ReportingResolve } from './reporting-resolver';
import { SortPipeModule } from "../../shared/pipes/sort.pipe";
import { SelectModule } from "ng-select";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
    declarations: [
        ReportingComponent
    ],
    imports: [
        CommonModule,
        ReportingRoutingModule,
        AngularMultiSelectModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        NgxChartsModule,
        SelectModule,
        SortPipeModule,
        BsDatepickerModule.forRoot()
    ],
    providers: [
        ReportingResolve
    ]
})

export class ReportingModule{}