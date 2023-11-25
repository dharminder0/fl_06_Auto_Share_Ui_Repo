/**
 * @author : Renil
 * 
 * `SelectTypeComponent` is a dummy component . It displays all the types and 
 * emits the selected types when user clicks submit.
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { TYPE_LIST } from "../templates.constants";
import { ActivatedRoute, Router } from "@angular/router";
import { LoaderService } from "../../../shared/loader-spinner";
import { QuizBuilderApiService } from "../../quiz-builder-api.service";
// import { UseTemplateService } from "../use-template/use-template.service";

/**
 * * There are 2 modes of selection
 * 1. Single : When Single user can only select a single type
 * 2. Multiple : When Multiple user can select more than one type
 */
const SELECT_MODES = {
  SINGLE: "single",
  MULTIPLE: "multiple"
}

@Component({
  selector: "app-select-type",
  templateUrl: "./select-type.component.html",
  styleUrls: ["./select-type.component.scss"]
})
export class SelectTypeComponent implements OnInit {

  /** Type List */
  public typeList = TYPE_LIST
  public check = true;


  /** Select Mode as Input. Default is multiple */
  // @Input() selectMode = SELECT_MODES.MULTIPLE
  selectMode;

  /** When Submit button clicked . Event is emitted to parent with selectedCategories */
  @Output() whenSubmit: EventEmitter<any> = new EventEmitter();

  selectedTypes = [];

  constructor(
    private route: ActivatedRoute,
    private loaderService : LoaderService,
    private quizBuilderApiService : QuizBuilderApiService,
    private router : Router
  ) { }

  ngOnInit() {
    this.assignSelectionMode();
    this.assignMode();
    this.assignPreselectedTypes();
  }

  assignPreselectedTypes(){
    if(localStorage.getItem(this.mode+'-type')){
      this.selectedTypes = localStorage.getItem(this.mode+'-type').split(',')
    }
    
  }

  onUnSelectAll()
  {
    this.check = true;
    this.selectedTypes =[];
  }

  onSelectAll()
  {
    this.check = false;
    this.typeList.forEach(category =>{
      this.selectedTypes.push(category.id);
    });
  }

  /**
 * * Function called when user clicks on a type
 * * If type is not present then the type id is pushed to selectedTypes
 * * If type is present then it is removed from the selectedTypes
 * * If selection mode is single then the user is aloowed to select only a single type else multiple
 * @param typeId 
 */
  public addOrRemoveType(typeId): void {
    if (this.selectMode == SELECT_MODES.MULTIPLE) {
      let isTypeIdAlreadyPresent: boolean =
        this.selectedTypes.indexOf(typeId) > -1;
      if (isTypeIdAlreadyPresent) {
        let index: number = this.selectedTypes.indexOf(typeId);
        this.selectedTypes.splice(index, 1);
      } else {
        this.selectedTypes.push(typeId);
      }
    } else {
      let isTypeIdAlreadyPresent: boolean =
        this.selectedTypes.indexOf(typeId) > -1;
      if (isTypeIdAlreadyPresent) {
        this.selectedTypes = [];
      } else {
        this.selectedTypes = [typeId];
      }
    }
  }

  /** 'add-template' || 'edit-template */
  mode:string;
  assignMode(){
    this.mode = this.route.snapshot.data.mode;
  }



  assignSelectionMode() {
    this.selectMode = this.route.snapshot.data.selectionMode;
  }


  /** When user selects submit button */
  submit() {
    let categoryids = this.route.snapshot.queryParams['categories'];
    let typeids = this.selectedTypes.toString();
    if(this.mode == 'add-template'){
      this.addTemplate(categoryids,typeids);
    }else{
      this.navigateToTemplates(categoryids, typeids);
    }

    localStorage.setItem(this.mode+'-type',this.selectedTypes.toString())
    // this.whenSubmit.emit(this.selectedTypes);
  }


  addTemplate(categories,types){
    let QuizType = types;
    let CategoryId = categories;
    let body = {
      QuizType,
      CategoryId
    }
    this.loaderService.show();
    this.quizBuilderApiService.addNewTemplate(body).subscribe(data=>{
      this.loaderService.hide();
      this.router.navigate([`quiz-builder/quiz-tool/${data}/cover`])
    },error=>{
      this.loaderService.hide();
    })
  }

  navigateToTemplates(categories,types) {
    /**
     * TODO: Change industryid to category
     */
    let categoryIds = categories;
    let typeIds = types
    this.router.navigate(["..", "template"], {
      relativeTo: this.route,
      queryParams: { QuizType: typeIds, CategoryId: categoryIds }
    });
  }

}
