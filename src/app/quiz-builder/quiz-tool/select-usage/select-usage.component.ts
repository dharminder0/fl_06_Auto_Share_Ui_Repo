import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserInfoService } from '../../../shared/services/security.service';
import { LoaderService } from '../../../shared/loader-spinner';
import { QuizBuilderApiService } from '../../quiz-builder-api.service';
import { QuizBuilderDataService } from '../../quiz-builder-data.service';

@Component({
  selector: 'app-select-usage',
  templateUrl: './select-usage.component.html',
  styleUrls: ['./select-usage.component.scss']
})
export class SelectUsageComponent implements OnInit {
  @Output() changeValue = new EventEmitter();
  @Input() usagesData;
  @Input() quizId;
  @Input() isEditUsage;
  @Input() quizType;
  public isActiveIcon: any = {};
  public selectedUsage: any = [];
  public tagList:any = [];
  public usages:any=[{
    id : 1,
    title : "Webflow",
    image : "assets/layouts/img/quiz-icon.png",
    visit : "CANDIDATE_RECEIVES_A_URL_TO_ACCESS_THIS_FLOW"
  },
  // {
  //   id : 2,
  //   title : "ChatBot",
  //   image : "assets/layouts/img/chatbot.png",
  //   visit : "PUBLICEER_JE_FLOW_IN_DE_VORM_VAN_EEN_CHATBOT_OP_EEN_WEBPAGINA"
  // },
  {
    id : 3,
    title : "WhatsApp chatbot",
    image : "assets/layouts/img/whatapp-icon.png",
    visit : "whatsappVisit"
  }
];
public searchText;
public tagIdArray:any = [];
public selectAll: boolean = false;
public selectedTagName:any = [];
public tagNameObj:any = [];
public selectedTagString;
public isWebChatPermission:boolean = false;
public userInfo: any = {};
public tagDropDown:boolean = false;

  constructor(private quizBuilderApiService:QuizBuilderApiService,
    private loaderService: LoaderService,
    private quizBuilderDataService:QuizBuilderDataService,
    private userInfoService: UserInfoService) { 
    }

  ngOnInit() {
    this.userInfo = this.userInfoService._info;
    this.isWebChatPermission = this.userInfo.IsWebChatbotPermission;
    
    this.getTagDetails();
    if(this.usagesData && this.usagesData.UsageTypes){
      this.selectedUsage =JSON.parse(JSON.stringify(this.usagesData.UsageTypes));
      if(this.isWebChatPermission == false){
        this.selectedUsage = [];
        this.usagesData.UsageTypes.map(select => {
          if(select == 1){
            this.selectedUsage.push(select);
          }
        });
      }
    }
  }

  getSelectedUsages(){
    if(this.usagesData && this.usagesData.Tag && this.usagesData.Tag.length > 0){
      let tagIds = this.usagesData.Tag;
      if(this.tagList && this.tagList.length > 0 && tagIds && tagIds.length > 0){
        tagIds.map(tagId => {
          this.tagList.map(result => {
            if(result.TagId == tagId.TagId){
              this.tagIdArray.push(result.TagId.toString());
              this.selectedTagName.push(result.TagName);
              this.tagNameObj.push(result);
            }
          });
        });
        this.selectedTagString =this.selectedTagName.toString();
        if(this.tagList.length == tagIds.length){
          this.selectAll = true;
        }
      }
    }
  }

  getTagDetails(){
    this.loaderService.show();
    this.quizBuilderApiService.getAutomationTagList().subscribe(
      data => {
        this.loaderService.hide();
        this.tagList = data;
        this.getSelectedUsages();
      },
      error => {
        console.log(error);
        this.loaderService.hide();
      }
    );
  }

  onAddUsage(usageId){
    let isUsageIdAlreadyPresent: boolean = this.selectedUsage.indexOf(usageId) > -1;
    if (isUsageIdAlreadyPresent) {
      let index: number = this.selectedUsage.indexOf(usageId);
      this.selectedUsage.splice(index, 1);
    } else {
      this.selectedUsage = [];
      this.selectedUsage.push(usageId);
    }
  }

  autoFocus()
{
  $(function() {
    $("#Box1").focus();
  });
}

  onSelectAll() {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.tagIdArray = [];
      this.selectedTagName = [];
      this.tagNameObj = [];
      if(this.tagList && this.tagList.length > 0){
        this.tagList.map(result => {
          this.tagIdArray.push(result.TagId.toString());
          this.selectedTagName.push(result.TagName);
          this.tagNameObj.push(result);
        });
      }
      this.selectedTagString =this.selectedTagName.toString();
    } else {
      this.tagIdArray = [];
      this.selectedTagName = [];
      this.tagNameObj = [];
    }
  }
  
  onSelectResult(tag){
    if (this.tagIdArray.includes(tag.TagId.toString())) {
      var id = this.tagIdArray.indexOf(tag.TagId.toString());
      this.tagIdArray.splice(id, 1);
      var resultNames = this.selectedTagName.indexOf(tag.TagName);
      this.selectedTagName.splice(resultNames, 1);
      var tagNamesObj = this.tagNameObj.indexOf(tag);
      this.tagNameObj.splice(tagNamesObj, 1);
    } else {
      this.tagIdArray.push(tag.TagId.toString());
      this.selectedTagName.push(tag.TagName);
      this.tagNameObj.push(tag);
    }
    if (this.tagIdArray.length >= this.tagList.length) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }
    this.selectedTagString =this.selectedTagName.toString();
  }

  onNext(){  
    let obj = {
      "isSave" : true,
      "QuizId": this.quizId,
      "TagIds": this.tagIdArray,
      "UsageTypes": this.selectedUsage
    }
    this.changeValue.emit(obj);
  }

  decline(){
    let obj = {
      "isSave" : false
    }
    this.changeValue.emit(obj);
  }

  onClear(){
    this.tagDropDown = false;
    if(this.tagIdArray && this.tagIdArray.length > 0){
    this.selectAll = true;
    this.onSelectAll();
    }

  }

}