import { Component, OnInit, ViewEncapsulation, OnDestroy, AfterViewInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { QuizBuilderApiService } from '../../quiz-builder-api.service';
import { SharedService } from '../../../shared/services/shared.service';
import { DynamicMediaReplaceMentsService } from '../dynamic-media-replacement';
declare var $: any;
@Component({
  selector: 'app-reorder-questions',
  templateUrl: './reorder-questions.component.html',
  styleUrls: ['./reorder-questions.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ReorderQuestionsComponent implements OnInit,AfterViewInit, OnDestroy {
  public quizData;
  public groups = [];
  public dragulaSubscription;
  public reOrderList:any = [];
  public isQuesAndContentInSameTable:boolean;
  constructor(private dragulaService: DragulaService,
    private quizBuilderApiService: QuizBuilderApiService,
    private sharedService: SharedService,
    private dynamicMediaReplaceService:DynamicMediaReplaceMentsService) {
     // dragulaService.setOptions('parent-bag', {});
      const bag: any = this.dragulaService.find('parent-bag');
      if (bag !== undefined ) this.dragulaService.destroy('parent-bag');
      this.dragulaService.setOptions('parent-bag', { revertOnSpill: true }); 
      const childbag: any = this.dragulaService.find('child-bag');
      if (childbag !== undefined ) this.dragulaService.destroy('child-bag');
      this.dragulaService.setOptions('child-bag', { revertOnSpill: true }); 
      this.dragulaSubscription = dragulaService.dropModel.subscribe((value:any) => {
                this.onDropModel(value);
      });
  }

  private onDropModel(args:any) {
    if(args && args.length > 0 && args.includes('parent-bag')){
      this.reOrderingGroupList();
    }
  }

  reOrderingGroupList(){
    this.reOrderList = [];
      if(this.groups){
        this.groups.map((group,index) => {
          if(group.Type == 2){
            this.reOrderList.push({
              "QuestionId" : group.QuestionId,
              "DisplayOrder" : index + 1,
              "Type":group.Type,
              "Answers":group.Answers
            });
          }
          if(group.Type == 6){
            this.reOrderList.push({
              "QuestionId" : this.isQuesAndContentInSameTable ? group.QuestionId : group.Id,
              "DisplayOrder" : index + 1,
              "Type":group.Type,
              "Answers":[]
            });
          }
        });
      }
      this.quizBuilderApiService.reorderQuestionsAnswers(this.reOrderList,this.isQuesAndContentInSameTable)
        .subscribe((data) => {});
  }

  ngOnInit() {
    this.groups = this.quizData['QuestionAndContent'];
    this.isQuesAndContentInSameTable = this.dynamicMediaReplaceService.IsQuesAndContentInSameTable;
    this.groups.forEach((elem) => {
      if(elem.Answers && elem.Answers.length > 0){
        elem.Answers.forEach(element => {
          element.AnswerText = this.sharedService.sanitizeData(element.AnswerText);
        });
      }
    })
  }

  ngAfterViewInit(){
    this.getIcon();
  }

  getIcon() {
    let list:any;
    list = document.getElementsByClassName("accordion-toggle");
    for(let i=0;i<list.length;i++){
      if(list[i].firstElementChild){
        list[i].firstElementChild.setAttribute("class", "rel-block");
        list[i].firstElementChild.innerHTML=`<svg class="mtop-5" width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect y="12" width="3" height="3" rx="1" fill="#D0D0D0"/>
        <rect x="6" y="12" width="3" height="3" rx="1" fill="#D0D0D0"/>
        <rect y="6" width="3" height="3" rx="1" fill="#D0D0D0"/>
        <rect x="6" y="6" width="3" height="3" rx="1" fill="#D0D0D0"/>
        <rect width="3" height="3" rx="1" fill="#D0D0D0"/>
        <rect x="6" width="3" height="3" rx="1" fill="#D0D0D0"/>
        </svg>
        <span style ="margin-left:16px;">${list[i].textContent}</span>
        <span class="questionicon">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.78715 11.0132C6.36091 11.0132 6.01416 10.6621 6.01416 10.2307C6.01416 9.79933 6.36091 9.44824 6.78715 9.44824C7.21123 9.44824 7.56964 9.80665 7.56964 10.2307C7.56964 10.6548 7.21123 11.0132 6.78715 11.0132Z" fill="#808080"/>
        <path d="M6.77789 8.63281C6.3484 8.63281 6.20351 8.45917 6.20351 7.94502C6.20351 7.13297 6.55216 6.72816 6.85603 6.46634C6.91409 6.41696 6.97813 6.36812 7.04568 6.31603C7.34251 6.08812 7.67894 5.82983 7.67894 5.43859C7.67894 5.00448 7.26735 4.84983 6.88208 4.84983C6.35247 4.84983 6.19917 5.07611 6.06378 5.27553C5.95824 5.43099 5.85867 5.57805 5.61475 5.57805C5.31332 5.57805 4.99316 5.37022 4.99316 4.98468C4.99316 4.45181 5.60254 3.66309 6.91057 3.66309C7.50964 3.66309 8.0265 3.82154 8.40553 4.12161C8.77561 4.41464 8.97937 4.82541 8.97937 5.2777C8.97937 5.89685 8.61607 6.49375 7.89925 7.0513C7.39053 7.44905 7.39053 7.7125 7.39053 8.19057C7.39026 8.39243 7.2839 8.63281 6.77789 8.63281Z" fill="#808080"/>
        <path d="M0.596899 14C0.267791 14 0 13.7322 0 13.4031V7C0 5.12872 0.727674 3.37058 2.04926 2.04899C3.37058 0.727674 5.12899 0 7 0C8.87128 0 10.6294 0.727674 11.951 2.04926C13.2723 3.37058 14 5.12899 14 7C14 8.87128 13.2723 10.6294 11.9507 11.951C10.6294 13.2723 8.87101 14 7 14H0.596899ZM7 12.8062C10.2016 12.8062 12.8062 10.2016 12.8062 7C12.8062 3.79845 10.2016 1.1938 7 1.1938C3.79845 1.1938 1.1938 3.79845 1.1938 7V12.8062H7Z" fill="#808080"/>
      </svg>
      </span>`;
      }
    }
  }

  ngOnDestroy() {
    this.dragulaSubscription.unsubscribe()
    this.dragulaService.destroy('parent-bag');
    this.dragulaService.destroy('child-bag');
  }

}
