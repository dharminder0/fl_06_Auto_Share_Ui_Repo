import { Component, OnInit, TemplateRef } from "@angular/core";
import { QuizBuilderApiService } from "../quiz-builder-api.service";

import { NotificationsService } from "angular2-notifications";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { Subject } from "rxjs";
import { LoaderService } from "../../shared/loader-spinner";
import { Router } from "@angular/router";
import { CATEGORY_LIST, TYPE_LIST } from "./templates.constants";

@Component({
    selector: "app-templates",
    templateUrl: './templates.component.html',
    styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit {
    templateList = []
    categoryList = CATEGORY_LIST;
    typeList = TYPE_LIST;
    readonly PAGE_SIZE: number = 10;
    selectedTypeList = [];
    selectedCategoryList = [];
    isSelectAllCategories: boolean = false;
    isSelectAllTypes: boolean = false;
    totalRecords: number;
    page: number = 1;
    currentPage: number;
    OrderByDate: number = 1;
    SearchText = '';
    isDataLoading: boolean = false;
     public StatusEnum =  {
        Active : 1,
        Deleted : 2,
        Inactive : 3
    }
    constructor(
        private quizBuilderApiService: QuizBuilderApiService,
        private notificationsService: NotificationsService,
        private modalService: BsModalService,
        private loader: LoaderService,
        private router:Router
    ) { }

    ngOnInit() {
        localStorage.removeItem('add-template-category');
        localStorage.removeItem('add-template-type');
        this.prefillAllCategoryInDropdown()
        this.prefillAllTypes()
        this.getData();
    }

    prefillAllCategoryInDropdown() {
        this.isSelectAllCategories = true;
        this.selectedCategoryList = this.categoryList.map(item => item.Id);
    }

    prefillAllTypes() {
        this.isSelectAllTypes = true;
        this.selectedTypeList = this.typeList.map(item => item.id);
    }

    onSelectCategory(categoryId): void {
        if (this.selectedCategoryList.includes(categoryId)) {
            let index = this.selectedCategoryList.indexOf(categoryId)
            this.selectedCategoryList.splice(index, 1);
        } else {
            this.selectedCategoryList.push(categoryId)
        }

        if (this.selectedCategoryList.length === this.categoryList.length) {
            this.isSelectAllCategories = true;
        } else {
            this.isSelectAllCategories = false;
        }

        this.getData();
    }
    onSelectType(typeId): void {
        if (this.selectedTypeList.includes(typeId)) {
            let index = this.selectedTypeList.indexOf(typeId)
            this.selectedTypeList.splice(index, 1);
        } else {
            this.selectedTypeList.push(typeId)
        }

        if (this.selectedTypeList.length === this.typeList.length) {
            this.isSelectAllTypes = true;
        } else {
            this.isSelectAllTypes = false;
        }
    this.getData();
    }


    changeStatusOfTemplate(templateObj){
        var changeStatusCode;
        if(templateObj.Status == this.StatusEnum.Active){
            changeStatusCode = this.StatusEnum.Inactive    
        }else{
            changeStatusCode = this.StatusEnum.Active
        }

        if(changeStatusCode){
            this.quizBuilderApiService.changeTemplateStatus(templateObj.Id,changeStatusCode).subscribe(data=>{
                this.loader.hide();
                templateObj.Status = changeStatusCode
            },error=>{
                this.notificationsService.error(error.message || "Something went wrong!");
            })
        }
    }


    onSelectAllCategory() {
        this.isSelectAllCategories = !this.isSelectAllCategories;
        if (this.isSelectAllCategories) {
            this.selectedCategoryList = [];
            this.categoryList.forEach(category => {
                this.selectedCategoryList.push(category.Id);
            });
        } else {
            this.selectedCategoryList = [];
        }
        this.getData();
    }

    onSelectAllType() {
        this.isSelectAllTypes = !this.isSelectAllTypes;
        if (this.isSelectAllTypes) {
            this.selectedTypeList = [];
            this.typeList.forEach(type => {
                this.selectedTypeList.push(type.id);
            });
        } else {
            this.selectedTypeList = [];
        }
       this.getData();
    }

    pageChanged(event: any) {
        this.page = event.page;
        this.getData();
    }

    onSortedByDate() {
        if (this.OrderByDate == 1) {
            this.OrderByDate = 2;
        } else {
            this.OrderByDate = 1;
        }
        this.getData()
    }

    onSearchText(e) {
        this.SearchText = e;
        this.getData();
    }


    getData() {
        this.isDataLoading = true;
        let types = this.selectedTypeList.toString();
        let category = this.selectedCategoryList.toString();
        this.quizBuilderApiService.getTemplateList(types, category, this.page, this.PAGE_SIZE, this.SearchText, this.OrderByDate).subscribe(data => {
            this.isDataLoading = false;
            if (data) {
                this.templateList = data.Templates;
                this.totalRecords = data.TotalRecords
            }
        }, error => {
            this.isDataLoading = false;
            this.notificationsService.error(error.message || " Something went wront");
        })
    }

    public modalRef: BsModalRef;
    /**
 *
 * @param template Template reference
 * @param templateId number
 */
    onRemovedQuiz(templateId) {
        this.modalRef = this.modalService.show(DeleteTemplate);
        this.modalRef.content.whenDelete.subscribe(
            shouldDelete => {
                if (shouldDelete) {
                    this.loader.show();
                    this.quizBuilderApiService.removeQuiz(templateId).subscribe(data => {
                        this.loader.hide();
                        this.modalRef.hide();
                        this.notificationsService.success("Deleted Successfully");
                        this.resetPagination();
                        this.getData();
                    }, error => {
                        this.modalRef.hide();
                        this.loader.hide();
                        this.notificationsService.error(error.message || "Something went wrong!")
                    })
                }
            }
        )

        this.modalRef.content.whenCancel.subscribe(modalCancel => {
            if (modalCancel) {
                this.modalRef.hide();
            }
        })
    }

    onPreviewQuiz(template) {
        this.quizBuilderApiService
            .getQuizCode(template.PublishedCode, "PREVIEW")
            .subscribe(
                data => {
                    window.open("template-preview/attempt-quiz?QuizCodePreview="+data+"&mode=view-only","_blank");
                    this.router.navigate(
                        [{ outlets: { popup: "template-preview/attempt-quiz" } }],
                        { queryParams: { QuizCodePreview: data , mode:'view-only' } }
                    );
                },
                error => {
                    this.notificationsService.error("Error");
                }
            );
    }

    resetPagination() {
        this.page = 1;
        this.currentPage = 1;
    }


}


@Component({
    selector: 'delete-template',
    template: `
    <div class="modal-body text-center">
    <p>{{"ARE_YOU_SURE_YOU_WOULD_LIKE_TO_DELETE_THIS_TEMPLATE?" | translate }}</p>
    <button type="button" class="btn blue" (click)="delete()">{{"YES" | translate }}</button>
    <button type="button" class="btn btn-default" (click)="cancel()">{{"NO" | translate }}</button>
  </div>
    `
})
export class DeleteTemplate {
    public whenDelete = new Subject();
    public whenCancel = new Subject();

    constructor() {

    }
    delete() {
        this.whenDelete.next(true);
    }

    cancel() {
        this.whenCancel.next(true);

    }

}