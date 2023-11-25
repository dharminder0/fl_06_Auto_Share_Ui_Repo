/**
 * @author:Renil Babu
 * 
 * AddTemplateComponent is a smart component that uses 2 dummy components
 * 1. TypeComponent
 * 2. CategoryComponent
 * 
 * Data from both the dummy components is saved in a service `AddTemplateService`
 */
import { Component, OnInit } from '@angular/core';
import { AddTemplateService } from './add-template.service';
import { Router, ActivatedRoute } from '@angular/router';
import { QuizBuilderApiService } from '../../quiz-builder-api.service';
import { LoaderService } from '../../../shared/loader-spinner';

@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styleUrls: ['./add-template.component.css'],
  providers : [AddTemplateService]
})
export class AddTemplateComponent implements OnInit {

  /** Show/Hide type component */
  showType: boolean = false;

  /**Show Hide Category Component */
  showCategory: boolean = false;

  constructor(
    private addTemplateService: AddTemplateService,
    private router:Router,
    private route:ActivatedRoute,
    private quizBuilderApiService:QuizBuilderApiService,
    private loaderService:LoaderService
    ) {

    /** Initially Category is shown */
    this.showCategoryComponent();
  }

  ngOnInit() {
  }

  /** Hide Category Component */
  hideCategoryComponent(){
    this.showCategory = false;
  }

  /** Show Category Component */
  showCategoryComponent(){
    this.showCategory = true;
  }

  /** Hide Type component */
  hideTypeComponent(){
    this.showType = true;
  }

  /**Show TypeComponent */
  showTypeComponent(){
    this.showType = true;
  }

  /**
   * Emitted when user submits type from typecomponent
   * @param data 
   */
  whenTypeSubmit(data) {
    this.addTemplateService.setSelectedTypes(data);
    this.addTemplate()
  }

  /**
   * *Add Template
   */
  addTemplate(){
    let QuizType = this.addTemplateService.getSelectedTypes().toString();
    let CategoryId = this.addTemplateService.getSelectedCategory().toString();
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


  /**
   * * When user selects the categories and clicks on submit then categorycomponent emits submit event
   * @param data categorydata
   */
  whenCategorySubmit(data) {
    this.addTemplateService.setSelectedCategory(data);
    this.hideCategoryComponent();
    this.showTypeComponent();
  }

}
