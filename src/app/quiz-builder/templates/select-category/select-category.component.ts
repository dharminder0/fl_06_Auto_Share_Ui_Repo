/**
 * @author : Renil
 * 
 * `SelectCategoryComponent` is a dummy component . It displays all the categories and 
 * emits the selected categories when user clicks submit.
 * 
 */
import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { CATEGORY_LIST } from "../templates.constants";
import { ActivatedRoute, Router } from "@angular/router";

/**
 * * There are 2 modes of selection
 * 1. Single : When Single user can only select a single category
 * 2. Multiple : When Multiple user can select more than one category
 */
const SELECT_MODES = {
  SINGLE: "single",
  MULTIPLE: "multiple"
}

@Component({
  selector: "app-select-category",
  templateUrl: "./select-category.component.html",
  styleUrls: ["./select-category.component.scss"]
})
export class SelectCategoryComponent implements OnInit {

  /** Selected categories */
  public selectedCategories: any[] = [];

  /** All Category List */
  public categoryList = CATEGORY_LIST;
  public check = true;
  dupselectedCategories;
  public isActiveIcon: any = {};

  /** Select Mode as Input. Default is multiple */
  // @Input() selectMode = SELECT_MODES.MULTIPLE
  selectMode:string;

  /** 'add-template' || 'edit-template */
  mode:string;

  /** When Submit button clicked . Event is emitted to parent with selectedCategories */
  @Output() whenSubmit: EventEmitter<any> = new EventEmitter();


  constructor( 
    private route :ActivatedRoute,
    private router :Router) {}

  ngOnInit() {
    this.assignSelectionMode();
    this.assignMode();
    this.assignPreselectedCategory();
  }


  assignPreselectedCategory(){
    if(localStorage.getItem(this.mode+'-category')){
      this.dupselectedCategories = localStorage.getItem(this.mode+'-category').split(',');
      this.dupselectedCategories.forEach(element=>
        {
          this.selectedCategories.push(parseInt(element))
        })
    }
  }


  assignSelectionMode(){
    this.selectMode = this.route.snapshot.data.selectionMode;
  }

  assignMode(){
    this.mode = this.route.snapshot.data.mode;
  }

  onUnSelectAll()
  {
    this.check = true;
    this.selectedCategories =[];
  }

  onSelectAll()
  {
    this.check = false;
    this.categoryList.forEach(category =>{
      this.selectedCategories.push(category.Id);
    });
  }


  /**
   * * Function called when user clicks on a category
   * * If category is not present then the category id is pushed to selected categories
   * * If category is present then it is removed from the selectedcategories
   * * If selection mode is single then the user is aloowed to select only a single category else multiple
   * @param categoryId 
   */
  public addOrRemoveCategory(categoryId): void {
    if (this.selectMode == SELECT_MODES.MULTIPLE) {
      let isCategoryIdAlreadyPresent: boolean =
        this.selectedCategories.indexOf(categoryId) > -1;
      if (isCategoryIdAlreadyPresent) {
        let index: number = this.selectedCategories.indexOf(categoryId);
        this.selectedCategories.splice(index, 1);
      } else {
        this.selectedCategories.push(categoryId);
      }
    } else {
      let isCategoryIdAlreadyPresent: boolean =
        this.selectedCategories.indexOf(categoryId) > -1;
      if (isCategoryIdAlreadyPresent) {
        this.selectedCategories = [];
      } else {
        this.selectedCategories = [categoryId];
      }
    }
  }


  /** When submit button is clicked then event is emitted to parent with selected categories */
  onSubmit() {
    let typeIds= "5,6,7";
    localStorage.setItem(this.mode+'-category',this.selectedCategories.toString())
    localStorage.setItem('use-template-type',typeIds)
    this.router.navigate(["..", "template"], {
      relativeTo: this.route,
      queryParams: { QuizType: typeIds, CategoryId: this.selectedCategories.toString() }
    });
  }
}
