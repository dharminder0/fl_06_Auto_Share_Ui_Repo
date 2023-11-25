import { Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-free-text-question',
    templateUrl: './free-text-question.component.html',
    styleUrls: ['./free-text-question.component.scss']
  })
  export class FreeTextQuestionComponent implements OnInit {

    public regXForVarFormulaV2 = /\{\{(([a-zA-Z0-9_]\.){0,1}[a-zA-Z0-9_])+\}\}/g;
    public questionTitle: string = '';
    public questionDetail;
      constructor(){}
      ngOnInit(){
        if(this.questionDetail.QuestionType != 11 && this.questionDetail.QuestionType != 12 && this.questionDetail.QuestionType != 13){
          if(this.questionDetail.Answers && this.questionDetail.Answers.length > 0){
            this.questionDetail.Answers.map(ans =>{
              ans.isLessText = false;
            });
          }
        }else if(this.questionDetail.QuestionType != 13){
          if(this.questionDetail.Comments && this.questionDetail.Comments.length > 0){
            this.questionDetail.Comments.map(comment =>{
              comment.isLessText = false;
            });
          }
        }
        this.questionTitle = this.questionDetail.QuestionTitle ? this.questionDetail.QuestionTitle.replace(this.regXForVarFormulaV2, ''): '';
      }
  }