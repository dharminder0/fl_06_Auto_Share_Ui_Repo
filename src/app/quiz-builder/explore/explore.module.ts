import { NgModule } from "@angular/core";
import { ExploreComponent } from "./explore.component";
import { CommonModule } from "@angular/common";
import { ExploreRoutingModule } from "./explore-routing.module";
import { SelectModule } from "ng-select";
import { FormsModule } from "@angular/forms";
import { ModalModule, PopoverModule } from "ngx-bootstrap";
import { FilterPipeModule } from '../../shared/pipes/filter.pipe'
import { TranslateModule } from "@ngx-translate/core";
import { SortPipeModule } from "../../shared/pipes/sort.pipe";
import { FilterByUserNamePipeModule } from "../../shared/pipes/filterByUserName.pipe";
import { ClickOutsideModule } from 'ng-click-outside';
import { SearchPipes } from '../../shared/pipes/search.pipe';
import { SharedModule } from '../../shared/shared.module';
import { CloudinaryModule } from "@cloudinary/angular-5.x";
import { environment } from "../../../environments/environment";
import { cloudinaryLib } from "../../quiz/quiz.module";

@NgModule({
    declarations: [
        ExploreComponent
    ],
    imports: [
        CommonModule,
        ExploreRoutingModule,
        SelectModule,
        FormsModule,
        SortPipeModule,
        TranslateModule,
        ModalModule.forRoot(),
        FilterPipeModule,
        FilterByUserNamePipeModule,
        ClickOutsideModule,
        SearchPipes,
        SharedModule,
        PopoverModule.forRoot(),
        CloudinaryModule.forRoot(cloudinaryLib, {
            cloud_name: environment.cloudinaryConfiguration.cloud_name,
            upload_preset: environment.cloudinaryConfiguration.upload_preset
        }),
    ],
    providers: []
})

export class ExploreModule{}