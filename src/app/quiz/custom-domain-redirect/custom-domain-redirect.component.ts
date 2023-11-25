import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizApiService } from '../quiz-api.service';
import { SharedService } from '../../shared/services/shared.service';
import { LoaderService } from '../../shared/loader-spinner';

@Component({
  selector: 'app-custom-domain-redirect',
  templateUrl: './custom-domain-redirect.component.html',
  styleUrls: ['./custom-domain-redirect.component.css']
})
export class CustomDomainRedirectComponent implements OnInit {

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private quizApiService: QuizApiService,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    let domainName: string = window.location.host;
    let domainOrigin: string = window.location.origin;
    let keyName: string = "";

    this.activatedRoute.params.subscribe(params => {
      keyName = params['id'];
    });

    if(keyName === "unauthorized" || keyName === "404" || keyName === "error"){
      return false;
    }

    this.loaderService.show();
    this.quizApiService.getUrlValueByKey(domainName,keyName)
      // this.quizApiService.getQuizAtte  mptCode(publishCode, 'PREVIEW')
      .subscribe((data) => {
        this.loaderService.hide();
        if (data) {
          window.open(domainOrigin + data.replace("https://automation-test.jobrock.com",""),"_self");
        }
        else {
          this.sharedService.errorMessage.message = "No data available to display";
          this.router.navigate(["/error"]);
        }
      }, error => {
        this.loaderService.hide();
        this.sharedService.errorMessage.message = error ? error : 'Something went wrong'
        this.router.navigate(["/error"]);
      })
  }
}
