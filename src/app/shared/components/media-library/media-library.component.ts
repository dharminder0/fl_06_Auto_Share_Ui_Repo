import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { Config } from "../../../../config";

@Component({
  selector: 'app-media-library',
  templateUrl: './media-library.component.html',
  styleUrls: ['./media-library.component.scss']
})

export class MediaLibraryComponent implements OnInit {

  @Output() changeValue = new EventEmitter();
  @Input() automationId:any;
  @Input() section:any;
  @Input() backgroundImage:any;
  @Input() isWhatsappEnable:boolean;
  
  public resourceType: string;
  public Url: string = "";
  public quizId: any;
  public companyCode: any;
  public uploadedArea:any;
  public config = new Config();

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    let self=this;
    // get user info
    if (window.addEventListener) {
      window.addEventListener("message", onMessage, false);        
  } 
  function onMessage(event) {
      // Check sender origin to be trusted
      if (event.origin == self.config.mediaSiteUrl){
        let data = event.data;
        if(data){
          self.changeValue.emit(data);
        }
      }
  }
  this.companyCode = this.sharedService.getCookie("clientCode");
    this.uploadMedia(this.automationId);
  }

  uploadMedia(automationId: any) {
    let relationFilters:any =[];
    let url: string;
    if(this.section == "logo"){
      relationFilters=[{
        "relationType": "automation",
        "relationItemId": automationId.toString()
      },
      {
        "relationType": "elementType",
        "relationItemId": "logo"
      }];
      let r_filters = JSON.stringify(relationFilters);
      url = `${this.config.mediaSiteUrl}/openMediaPopup?r_filters=${r_filters}&clientcode=${this.companyCode}`;
    }else if(this.backgroundImage){
        let relationFilters:any =[{
          "relationType": "automation",
          "relationItemId": automationId.toString()
        },
        {
          "relationType": "elementType",
          "relationItemId": "image"
        }
      ];
      let r_filters = JSON.stringify(relationFilters);
      url = `${this.config.mediaSiteUrl}/openMediaPopup?r_filters=${r_filters}&clientcode=${this.companyCode}`;
    }else{
      let relationFilters:any =[
        {
          "relationType": "automation",
          "relationItemId": automationId.toString()
        },
        {
          "relationType": "elementType",
          "relationItemId": "image,video"
        }
      ];
      let r_filters = JSON.stringify(relationFilters);      
      url = `${this.config.mediaSiteUrl}/openMediaPopup?r_filters=${r_filters}&clientcode=${this.companyCode}`;
    }
    // if(this.isWhatsappEnable){
    //   //64 Mb = 67108864 bytes
    //   let mSize:any = {
    //     "imgSize":67108864, 
    //     "vidSize":67108864
    //   }
    //   let m_size = JSON.stringify(mSize);
    //   url += `&m_size=${m_size}`;
    // }
    this.Url = url;
  }
}