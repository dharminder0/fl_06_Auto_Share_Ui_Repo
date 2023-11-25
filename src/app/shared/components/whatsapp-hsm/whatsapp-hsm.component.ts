import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Config } from '../../../../config';
import { UserInfoService } from '../../services/security.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-whatsapp-hsm',
  templateUrl: './whatsapp-hsm.component.html',
  styleUrls: ['./whatsapp-hsm.component.scss']
})
export class WhatsappHsmComponent implements OnInit {
  @Input() isOpenBranchingLogicSide: boolean = false;
  // @Output() isdataAvailable:EventEmitter<boolean> = new EventEmitter();
  public config = new Config();

  // String variables
  public hsmUrl: string;

  // Object variables
  public hsmTemplateData: any = {};
  public userInfo: any = {};

  // boolean variable
  public isHsmDataPresent: boolean = false;
  public openWhatsappPopup:boolean = false;

  constructor(
    private userInfoService: UserInfoService,
    private sharedService: SharedService
  ) { 
    this.userInfo = this.userInfoService._info;
  }

  ngOnInit() {
   
    if(this.sharedService.hsmTemplateData && Object.keys(this.sharedService.hsmTemplateData).length > 0){
        this.hsmTemplateData = JSON.parse(JSON.stringify(this.sharedService.hsmTemplateData));
        this.isHsmDataPresent = true;
    }

  // getting hsm template data through window.postMessage() from core module 
    let self = this;
      if (window.addEventListener) {
        window.addEventListener("message", onMessage, false);        
      } 
      function onMessage(event) {
        // Check sender origin to be trusted

          if (event.data && event.data.mcode == "hsmSelection") {
            if(event.data.isTemplateSelected){
              if(event.data.selectedTemplate && Object.keys(event.data.selectedTemplate).length > 0){
                self.hsmTemplateData = JSON.parse(JSON.stringify(event.data.selectedTemplate));
                self.openWhatsappPopup = false;
                if(self.hsmTemplateData && Object.keys(self.hsmTemplateData).length > 0){
                    self.isHsmDataPresent = true;
                    // self.sendData(false);
                }
                if(window.document.body.classList.contains("overflow-hidden") && !this.isOpenBranchingLogicSide){
                  window.document.body.classList.remove("overflow-hidden");
                }
                self.sharedService.hsmTemplateData = self.hsmTemplateData;
              }
            }
            else{
              self.closePopup();
            }
          }

      }
  }

  openPopup(){
    let clientCode: string = this.sharedService.getCookie("clientCode");
    let type = this.isOpenBranchingLogicSide ? 'Chatbot' : 'automation';
    this.openWhatsappPopup = true;
    if(this.hsmTemplateData && Object.keys(this.hsmTemplateData).length > 0){
      let lang: string = JSON.parse(JSON.stringify(this.hsmTemplateData['templateBody'] ? this.hsmTemplateData['templateBody'][0].langCode : ''));
      this.hsmUrl = `${this.config.coreUrl}/hsmSelection?clientCode=${clientCode}&type=${type}&lang=${lang}&id=${this.hsmTemplateData.id}&audienceType=${this.hsmTemplateData.audienceType ? this.hsmTemplateData.audienceType : ""}`;
    }else{
      this.hsmUrl = `${this.config.coreUrl}/hsmSelection?clientCode=${clientCode}&type=${type}`;
    }
    if(!window.document.body.classList.contains("overflow-hidden") && !this.isOpenBranchingLogicSide){
      window.document.body.classList.add("overflow-hidden");
    }
  }
  
  deleteHsm(){
    this.hsmTemplateData = {};
    this.isHsmDataPresent = false;
    this.openWhatsappPopup = false;
    this.sharedService.hsmTemplateData = JSON.parse(JSON.stringify(this.hsmTemplateData));
    // this.sendData(true);
  }
  // sendData(isdataAvailable){
  //   this.isdataAvailable.emit(isdataAvailable);
  // }

  closePopup(){
    this.openWhatsappPopup = false;
    if(window.document.body.classList.contains("overflow-hidden") && !this.isOpenBranchingLogicSide){
      window.document.body.classList.remove("overflow-hidden");
    }
  }

}
