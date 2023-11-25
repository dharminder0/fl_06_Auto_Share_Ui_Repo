/**
 * @author:Renil Babu
 * 
 * UseTemplateComponent is a smart component that uses 2 dummy components
 * 1. TypeComponent
 * 2. CategoryComponent
 * 
 * Data from both the dummy components is saved in a service `UseTemplateService`
 */
import { Component, OnInit } from '@angular/core';
import { UseTemplateService } from './use-template.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-use-template',
  templateUrl: './use-template.component.html',
  styleUrls: ['./use-template.component.css'],
  providers: [UseTemplateService]
})
export class UseTemplateComponent implements OnInit {

  /** Show/Hide type component */
  showType: boolean = false;

  /**Show Hide Category Component */
  showCategory: boolean = false;

  constructor(
    private useTemplateService: UseTemplateService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.showCategoryComponent();
  }

  ngOnInit() { }

  /** Hide Category Component */
  hideCategoryComponent() {
    this.showCategory = false;
  }

  /** Show Category Component */
  showCategoryComponent() {
    this.showCategory = true;
  }

  /** Hide Type component */
  hideTypeComponent() {
    this.showType = true;
  }

  /**Show TypeComponent */
  showTypeComponent() {
    this.showType = true;
  }

  /**
   * Emitted when user submits type from typecomponent
   * @param data 
   */
  whenTypeSubmit(data) {
    this.useTemplateService.setSelectedTypes(data);
    this.navigateToTemplates();
  }

  /**
   * *When user has selected both type and category then the user is navigated to tmeplate where 
   * user can choose the templates based on category and types
   */
  navigateToTemplates() {
    /**
     * TODO: Change industryid to category
     */
    let categoryIds = this.useTemplateService
      .getSelectedCategory()
      .toString();
    let typeIds = this.useTemplateService.getSelectedTypes().toString();
    this.router.navigate(["..", "use-template", "template"], {
      relativeTo: this.route,
      queryParams: { QuizType: typeIds, CategoryId: categoryIds }
    });
  }

  /**
 * * When user selects the categories and clicks on submit then categorycomponent emits submit event
 * @param data categorydata
 */
  whenCategorySubmit(data) {
    this.useTemplateService.setSelectedCategory(data);
    this.hideCategoryComponent();
    this.showTypeComponent();
  }

}
