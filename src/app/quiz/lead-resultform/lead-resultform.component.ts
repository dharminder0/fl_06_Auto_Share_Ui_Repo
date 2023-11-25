import { Component, OnInit } from "@angular/core";

@Component({
    selector: "lead-resultform",
    templateUrl: "./lead-resultform.component.html",
    styleUrls: ["./lead-resultform.component.scss"]
  })
  export class LeadResultComponent implements OnInit {

    public ResultScore;
    public companycode;
    public QuizBrandingAndStyle;
    public quizType;
    public resultLeadForm:boolean = true;
    public isMobileView:boolean;
    public individualResult:boolean = false;
    public index;

      constructor(){}
      ngOnInit(){
        this.isMobileView = window.outerWidth < 768 ? true : false;
      }

      onSelectedResultIndex(data){
        this.index = data;
        this.individualResult = true;
      }

      onBackMultpleResults(){
        this.individualResult = false;
      }
  }