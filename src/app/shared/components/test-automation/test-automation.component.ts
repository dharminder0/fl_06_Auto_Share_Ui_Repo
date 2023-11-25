import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Config } from '../../../../config';
import { LoaderService } from '../../../shared/loader-spinner';
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'app-test-automation',
  templateUrl: './test-automation.component.html',
  styleUrls: ['./test-automation.component.scss']
})
export class TestAutomationComponent implements OnInit {

  @Input() quizId:any ;
  @Output() changeInTestAutoamtionModal: EventEmitter<any> = new EventEmitter<any>();
  public Url:any;
  public config = new Config();
  constructor(
    private loaderService: LoaderService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    let self=this;
    this.loaderService.show();
    // get user info
    if (window.addEventListener) {
      window.addEventListener("message", onMessage, false);        
    } 
    function onMessage(event) {
      // Check sender origin to be trusted
      if (event.origin == self.config.hubUrl){
        if (event.data && event.data.mcode == 'automationTestPopupLoader') {
          if(event.data.isLoaderStop){
            self.loaderService.hide();
            // self.ngxService.stopLoader('templateTestPopup');
          }
          if(event.data.isCloseWindow){
            self.changeInTestAutoamtionModal.emit(false);
            self.Url = "";
            /**
             * deleteVerifyRequest will hit in quiz header 
             * when test-automation emit to quiz hesder after closing popup
             */
          }
          if(event.data.isRequestGenerated){
            if(!self.commonService.testAutomationRequestIds.includes(event.data.requestId)){
              self.commonService.testAutomationRequestIds.push(event.data.requestId);
            }
          }
        }
      }
    }

    this.openTestAutoamtion()
  }

  openTestAutoamtion(){
    this.Url = `${this.config.hubUrl}/flowPreview?quizId=${this.quizId}&action=testautomation`
  }
}
