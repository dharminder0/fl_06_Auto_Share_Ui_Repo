import {
    Component,
    OnInit
  } from "@angular/core";
import { CommonService } from "../../shared/services/common.service";

@Component({
    selector: "default-message",
    templateUrl: "./default-message.component.html",
    styleUrls: ["./default-message.component.scss"]
})

  export class DefaultMessageComponent implements OnInit{
    public isMobileView:boolean=false;
    public leftSlide:boolean=false;
    public QuizBrandingAndStyle;

      constructor(private commonService:CommonService){}
      ngOnInit(){
        this.commonService.scrollUp();
        this.isMobileView = window.outerWidth < 768 ? true : false;
        if(this.isMobileView){
            let self=this;
            setTimeout(function(){  self.leftSlide = true }, 1000);
          }
      }
  }