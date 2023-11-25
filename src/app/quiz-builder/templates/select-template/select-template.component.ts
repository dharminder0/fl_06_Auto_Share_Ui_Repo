import { Component, OnInit, TemplateRef } from "@angular/core";
import {
  ActivatedRoute,
  Router,
} from "@angular/router";
import { QuizBuilderApiService } from "../../quiz-builder-api.service";
import { NotificationsService } from "angular2-notifications";
import { CATEGORY_LIST, TYPE_LIST } from '../templates.constants';

@Component({
  selector: "app-select-template",
  templateUrl: "./select-template.component.html",
  styleUrls: ["./select-template.component.scss"]
})
export class SelectTemplateComponent implements OnInit {
  public alphabet = false;

  /** Template list : List of all templates from server */
  templateList: any[] = [];

  /** Pg No */
  public pageNumber: number = 1;

  /** If all data is fetched from the server then hasMoreData becomes false else true  */
  public hasMoreData: boolean = true;

  /** Show Loader at the botton */
  showLoading: boolean = false;

   /** Constant Template list and option Categories : List of all templates from server */
   public selectedTemplateList:any;
   

   public mouseoverId: number = -1;
   isActiveIconOnHover: any={};
   public isActiveIcon: any = {};
   public isActiveDotIcon: any = {};
   public isActiveTypeIcon: any = {};
   public categoryList = CATEGORY_LIST;
   public templateTypeList=TYPE_LIST;
   public selectedCategories:any;
   public typeLists:any;
   public isTemplateList:boolean=false;
   public filterCategoriesList:any[]=[];
   public isShowAll:boolean=true;
   public firstTimeCategoryListCount:number=5;
   public defaultImage:any="https://res.cloudinary.com/dbbkqtyqn/image/upload/c_fill,w_auto,g_auto,q_auto:best,f_auto/v1588680596/Jobrock/automation-place-holder-corner.png";

  constructor(
    private route: ActivatedRoute,
    private quizBuilderApiService: QuizBuilderApiService,
    private notificationsService: NotificationsService,
    private router: Router
  ) {
   }

  ngOnInit() {
    let categoryId = localStorage.getItem('use-template-category');
    this.selectedCategories= categoryId.split(",");
    let typeList = localStorage.getItem('use-template-type');
    this.typeLists= typeList.split(",");

   // this.getTemplateListFromRouteSnapshot();
   this.showLessCategoryList();
   this.getTemplateList();
  }

  showAllCategoryList(){
    this.isShowAll=false;
    this.filterCategoriesList=this.categoryList;
  }

  showLessCategoryList(){
    this.isShowAll=true;
    this.filterCategoriesList = [];
    for(let i=0; i<this.categoryList.length; i++){
      if(!!this.filterCategoriesList && this.filterCategoriesList.length>this.firstTimeCategoryListCount){
        break;
      }else{
        this.filterCategoriesList.push(this.categoryList[i]);
      }
    }
  }

  onSelectCategory(categoryId){
    if(this.selectedCategories.includes((categoryId).toString())){
      let findIndex = this.selectedCategories.indexOf(categoryId.toString());
      this.selectedCategories.splice(findIndex,1);
    }else{
      this.selectedCategories.push(categoryId.toString());
    }
    localStorage.setItem('use-template-category',this.selectedCategories);
    this.getTemplateList();
  }

  onSelectTemplateType(templateTypeId){
    if(this.typeLists.includes(templateTypeId)){
      let findIndex = this.typeLists.indexOf(templateTypeId);
      this.typeLists.splice(findIndex,1);
    }else{
      this.typeLists.push(templateTypeId);
    }
    localStorage.setItem('use-template-type',this.typeLists);
    this.getTemplateList();
  }

  getTemplateList(){
    let self=this;
    this.showLoader();
    this.isTemplateList=false;
    let QuizType =this.typeLists;
    let CategoryId = this.selectedCategories;
    this.quizBuilderApiService
      .getTemplates(QuizType, CategoryId, this.pageNumber)
      .subscribe(
        data => {
          this.hideLoader();
          this.templateList = new Array();
          if (data && data.Templates && data.Templates.length) {
            self.templateList = data.Templates;
          }else{
            self.isTemplateList=true;
          }
        },
        error => {
          self.isTemplateList=false;
          self.hideLoader();
        }
      );
  }

  getTemplateListFromRouteSnapshot() {
    this.templateList = this.route.snapshot.data["templateList"].Templates;
  }


  /**
   * When user clicks on a template then this function is called
   * @param temp : Template data object
   */
  onTemplateClick(temp: any) {
    this.quizBuilderApiService
      .getQuizCode(temp.PublishedCode, "PREVIEW")
      .subscribe(
        data => {
          window.open("template-preview/attempt-quiz?QuizType="+this.route.snapshot.queryParams.QuizType+"&CategoryId="+this.route.snapshot.queryParams.CategoryId+"&QuizCodePreview="+data+"&templateId="+temp.Id,"_blank");
          // this.router.navigate(
          //   [{ outlets: { popup: "template-preview/attempt-quiz" } }],
          //   { queryParams: { QuizType: this.route.snapshot.queryParams.QuizType, CategoryId: this.route.snapshot.queryParams.CategoryId, QuizCodePreview: data, templateId: temp.Id } },
          // );
        },
        error => {
          this.notificationsService.error("Error");
        }
      );
  }

  onUseAutomation(templateid) {
    this.router.navigate(["/quiz-builder/select-automation/add-quiz"],{ relativeTo: this.route,
      queryParams: { mode: "template", templateId: templateid }
  });
}

  sortAlphabetical() {
    this.alphabet = !this.alphabet;
    if (this.alphabet) {
      this.templateList.sort((a, b) => {
        if (a.QuizTitle.trim().toLowerCase() < b.QuizTitle.trim().toLowerCase()) {
          return 1;
        }
        else {
          return -1;
        }
      });
    }

    else {
      this.templateList.sort((a, b) => {
        if (a.QuizTitle.trim().toLowerCase() > b.QuizTitle.trim().toLowerCase()) {
          return 1;
        }
        else {
          return -1;
        }
      });
    }

  }

  /** Show Loader @bottom */
  showLoader() {
    this.showLoading = true;
  }

  /** Hide Loader @bottom */
  hideLoader() {
    this.showLoading = false;
  }

  /**
   * * Infinite Scroll Function when user reaches the bottom of the field
   */
  public onScroll() {
    if (this.hasMoreData) {
      this.showLoader();
      let QuizType = this.route.snapshot.queryParamMap.get("QuizType");
      let CategoryId = this.route.snapshot.queryParamMap.get("CategoryId");
      this.quizBuilderApiService
        .getTemplates(QuizType, CategoryId, ++this.pageNumber)
        .subscribe(
          data => {
            this.hideLoader();
            if (data && data.Templates && data.Templates.length) {
              this.templateList = this.templateList.concat(data.Templates);
            } else {
              this.hasMoreData = false;
            }
          },
          error => {
            this.hasMoreData = false;
            this.hideLoader();
          }
        );
    }
  }

}
