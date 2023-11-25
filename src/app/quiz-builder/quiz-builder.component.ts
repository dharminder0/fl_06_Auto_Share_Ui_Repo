import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { CssVarsService } from '../shared/services/cssVarsService.service';
import { UserInfoService } from '../shared/services/security.service';
import { SharedService } from '../shared/services/shared.service';
import { QuizBuilderDataService } from './quiz-builder-data.service';
import { Subscription } from 'rxjs';
import { Config } from '../../config';

@Component({
  selector: 'app-quiz-builder',
  templateUrl: './quiz-builder.component.html',
  styleUrls: ['./quiz-builder.component.css']
})
export class QuizbuilderComponent implements OnInit {
  public quizData;
  public isQuizTool: boolean;
  public isVisibleMediaLibrary: boolean = false;
  public config = new Config();
  constructor(private cssVarsService: CssVarsService,
    private userInfoService: UserInfoService,
    private sharedService: SharedService,
    private quizBuilderDataService: QuizBuilderDataService) {
    cssVarsService.setVariables({
      '--primary-color': localStorage.getItem("primaryColor"),
      '--secondary-color': localStorage.getItem("secondaryColor")
      //   "--primary-color": "#00b7ab",
      // "--secondary-color": "#00b7ab"
    });
  }

  ngOnInit() {
    let self = this;
    this.quizBuilderDataService.currentQuizHeader.subscribe(function (res) {
      if (res) {
        self.isQuizTool = true;
      } else {
        self.isQuizTool = false;
      }
    });
    this.readTextOfJobrockHeaderFile();
  }

  readTextOfJobrockHeaderFile() {
    let self = this;
    let d = new Date();
    let versionNumber:string = [d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()].join('/');
    let clientCode: string = this.sharedService.getCookie("clientCode");
    (function () {
      var oScript = document.createElement('script');
      oScript.type = 'text/javascript';
      oScript.async = true;
      oScript.src = self.config.coreUrl+'/assets/jr/jobrockHeaderOrg.js?v='+ versionNumber;
      oScript.id = "jobrockHeaderScript";
      oScript.event = clientCode;
      var oParent = document.getElementsByTagName('script')[0];
      oParent.parentNode.insertBefore(oScript, oParent);
    })();
  }

}
