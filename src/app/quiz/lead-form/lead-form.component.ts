import { Component, Input, OnInit } from '@angular/core';
import { QuizDataService } from '../quiz-data.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { QuizApiService } from '../quiz-api.service';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../shared/loader-spinner';
import { CommonService } from '../../shared/services/common.service';
@Component({
  selector: 'app-lead-form',
  templateUrl: './lead-form.component.html',
  styleUrls: ['./lead-form.component.css']
})
export class LeadFormComponent implements OnInit {
  @Input() public ResultScore;
  @Input() public companycode;
  public leadUserForm: FormGroup;
  public emailRegex: string = '(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))';
  public PublishedCode;
  @Input() public QuizBrandingAndStyle;
  @Input() public resultLeadForm;
  public flowOrder;
  public isMobileView:boolean=false;
  public isStartQuiz:boolean=false;
  public countryCode: string = "+31";
  public isPrivate:boolean=true;
  public privacyLink:string;
  // public privacyLinkLabel:string;
  public privacyStatementEnable:boolean = false;
  public isCVMandatory:boolean = false;
  public quizStatus = {
    status: '',
    data: '',
    quizBrandingAndStyle: ''
  };
  public leftSlide:boolean=false;
  public minHeightInDiv:any;
  public buttonShow:boolean=true;
  public logoImage:string = "";
  public leadFormTitle:string = "";
  public logoBackgroundColor:string = "";
  public formId:any = 1;
  public countryCodeList: Array<object> = [];
  public isHoveredOnButton = false;

  Id;
  IdName;

  constructor(
    private _fb: FormBuilder,
    private quizDataService: QuizDataService,
    private quizApiService:QuizApiService,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private commonService:CommonService
  ) {
    
    if(this.route.snapshot.queryParams["Vacature"]){
      this.IdName = "Vacature"
      let Vacature = this.route.snapshot.queryParams["Vacature"];
      this.Id = Vacature;
    }
    if(this.route.snapshot.queryParams["Campaign"]){
      this.IdName = "Campaign"
      let Campaign = this.route.snapshot.queryParams["Campaign"];
      this.Id = Campaign;
    }
    if(this.route.snapshot.queryParams["Social_Campaign"]){
      this.IdName = "Social_Campaign"
      let SocialCampaign = this.route.snapshot.queryParams["Social_Campaign"];
      this.Id = SocialCampaign;
    }
    if(this.route.snapshot.queryParams["Event"]){
      this.IdName = "Event"
      let Event = this.route.snapshot.queryParams["Event"];
      this.Id = Event;
    }
    if(this.route.snapshot.queryParams["Partnerships"]){
      this.IdName = "Partnerships"
      let Partnerships = this.route.snapshot.queryParams["Partnerships"];
      this.Id = Partnerships;
    }
    if(this.route.snapshot.queryParams["Open_Application"]){
      this.IdName = "Open_Application"
      let OpenApplication = this.route.snapshot.queryParams["Open_Application"]
      this.Id = OpenApplication;
    }  
  }


  getPrivacyLink(){
    this.quizApiService.isPrivacyLinkSubmissionObservable.subscribe(data=>{
      if(data && data.indexOf("https:") < 0 && data.indexOf("http:") < 0){
        this.privacyLink= "//" + data;
      }
      else{
        this.privacyLink=data;
      }
    });
  }

  onScroll() {
    if(this.isMobileView){
      this.buttonShow = this.commonService.isScrolledIntoView();
    }
  }
  /**
 * Creating form
 */
  public createForm() {
    this.leadUserForm = this._fb.group({
      PublishedCode: [this.PublishedCode, [Validators.required]],
      Voornaam: ['', [Validators.required]],
      Achternaam: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
      PhoneNr: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      CombinedPhoneNr: ['+31', [Validators.required]],
      CompanyCode: [this.companycode, [Validators.required]],
      INFS_TAG: [""],
      Privacy : [false,[Validators.required]],
      SourceType:[this.quizApiService.sourceType],
      SourceId:[this.quizApiService.sourceId],
      Utm_Id: [""],
      Utm_Source: [""],
      Utm_Medium: [""],
      Utm_Content: [""],
      Utm_Campaign: [""],
      Utm_Term: [""],
      Utm_Channel: [""],
      GAClientId: [""],
      Origin: [""],
      OriginId: [""],
      Web_Id: [""]
    });
    this.leadUserForm.addControl('SourceType', new FormControl(this.IdName));
    this.leadUserForm.addControl('SourceId', new FormControl(this.Id));
  }
  /**
* When user clicks the button 
* It is then informed in quiz.component.ts where the subscription to 
* the behaviour subject determines which component to call
* 
* 
* In this case the data is also send to render a new component either
* result or question detail component with the data which is send
*/
  submitLeadInfo() {
    if(this.isMobileView){
      this.isStartQuiz=true;
      let self=this;
      setTimeout(function(){ 
        self.loaderService.show()
      }, 1000);
    }else{
      this.loaderService.show()
    }
    this.leadUserForm.patchValue({
      CombinedPhoneNr: this.countryCode + this.leadUserForm.value['PhoneNr']
    });

    this.leadUserForm.patchValue({Utm_Id: this.getCookie('jr_utm_id')});
    this.leadUserForm.patchValue({Utm_Source: this.getCookie('jr_utm_source')});
    this.leadUserForm.patchValue({Utm_Medium: this.getCookie('jr_utm_medium')});
    this.leadUserForm.patchValue({Utm_Content: this.getCookie('jr_utm_content')});
    this.leadUserForm.patchValue({Utm_Campaign: this.getCookie('jr_utm_campaign')});
    this.leadUserForm.patchValue({Utm_Term: this.getCookie('jr_utm_term')});
    this.leadUserForm.patchValue({Utm_Channel: this.getCookie('jr_utm_channel')});
    this.leadUserForm.patchValue({Origin: "Automation"});
    this.leadUserForm.patchValue({OriginId: this.QuizBrandingAndStyle.QuizId});
    this.leadUserForm.patchValue({Web_Id: this.getCookie('jr_uuid')});

    if(window["jobrockClientId"] && window["jobrockClientId"] !== ""){
      this.leadUserForm.patchValue({
        GAClientId: window["jobrockClientId"]
      });
    }
    //Api call
    this.quizApiService.saveLeadUserInfo(this.leadUserForm.value).subscribe((data) => {
      this.loaderService.hide();
      this.quizStatus.status = 'getAppointmentCode';
      this.quizStatus.data = this.ResultScore;
      this.quizStatus.quizBrandingAndStyle = this.QuizBrandingAndStyle;
      this.quizDataService.nextStepStatus.next(this.quizStatus);
      this.quizDataService.createDataLayer('jr_Automation_Lead', this.QuizBrandingAndStyle.QuizId, '');
    }, error => {
      this.loaderService.hide();
    })
  }

  ngOnInit() {
    this.countryCodeList = this.quizDataService.countryCodeList;
    this.commonService.scrollUp();
    this.logoBackgroundColor = this.quizDataService.logoBackGroundColor ? this.quizDataService.logoBackGroundColor : '';
    this.logoImage = this.quizDataService.logoImage ? this.quizDataService.logoImage : '';
    this.isMobileView = window.outerWidth < 768 ? true : false;
    this.PublishedCode = this.route.snapshot.queryParams["QuizCode"];
    if(this.isMobileView){
      let self=this;
      setTimeout(function(){  self.leftSlide = true }, 1000);
    }
    this.createForm();
    if(!this.QuizBrandingAndStyle){
      this.QuizBrandingAndStyle = this.quizApiService.attemptQuizSetting.QuizBrandingAndStyle;
    }else {
      this.quizDataService.setQuizBrandingAndStyle(this.QuizBrandingAndStyle);
    }
    // this.getPrivacyLink();

    if(this.quizApiService.isPrivacyLink){
      this.privacyLink = this.quizApiService.isPrivacyLink;      
      this.privacyStatementEnable = true;

      if(this.privacyLink.indexOf("https:") < 0 && this.privacyLink.indexOf("http:") < 0){
        this.privacyLink= "//" + this.privacyLink;
      }
    }
    else{
      this.privacyLink = "";
    }
    
    if(this.quizApiService.privacyJson && Object.keys(this.quizApiService.privacyJson).length > 0){
      this.privacyLink = this.quizApiService.privacyJson.PrivacyLink;
      if(this.privacyLink && this.privacyLink.indexOf("https:") < 0 && this.privacyLink.indexOf("http:") < 0){
        this.privacyLink= "//" + this.privacyLink;
      }
      // this.privacyLinkLabel = this.quizApiService.privacyJson.PrivacyLabel;
      this.privacyStatementEnable = this.quizApiService.privacyJson.IsMandatory? true : this.privacyLink ? true : false;
      this.isCVMandatory = this.quizApiService.privacyJson.IsCVMandatory;
      this.countryCode = this.quizApiService.privacyJson.CountryCode? this.quizApiService.privacyJson.CountryCode : "+31" ;
    }else{
      this.privacyLink = "";
      // this.privacyLinkLabel = "";
      this.privacyStatementEnable = this.privacyLink ? true : false;
      this.isCVMandatory = false;
      this.countryCode = "+31";
    }
    if(this.isCVMandatory){
      let resumeControl = new FormControl(null, [Validators.required]);
      this.leadUserForm.addControl('resume',resumeControl);
      // this.leadUserForm.get('resume').setValidators([Validators.required]);
      // this.leadUserForm.get('resume').updateValueAndValidity();
    }
    if(this.quizApiService.isFormId){
      this.formId = this.quizApiService.isFormId;
    }
    if(this.quizApiService.isLeadFormTitle){
      this.leadFormTitle = this.quizApiService.isLeadFormTitle;
    }else{
      if(this.QuizBrandingAndStyle.Language == 1){
        this.leadFormTitle = "Wil je meer weten? Laat je gegevens achter!"
      }else if(this.QuizBrandingAndStyle.Language == 2){
        this.leadFormTitle = "Want to know more? Leave you details below!"
      }else if(this.QuizBrandingAndStyle.Language == 3){
        this.leadFormTitle = "Chcesz dowiedzieć się więcej? Wprowadź swoje dane poniżej!"
      }
    }
    this.getScrollSubscription();
  }

  ngAfterViewInit(){
    let self = this;
    setTimeout(function(){  
      if(self.isMobileView){
        self.buttonShow = self.commonService.isScrolledIntoView();
      } }, 100);
  }

  getScrollSubscription(){
    this.quizDataService.isScrollSubmissionObservable.subscribe(res => {
      this.onScroll();
    });
  }

  onCountryCodeChange(e) {
    this.leadUserForm.patchValue({
      CombinedPhoneNr: e.value,
      PhoneNr: ''
    });
  }

  onFileSelected (event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];      
      this.getBase64(file);
    }
  }


  public resumeObj: any = {};
  getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      this.resumeObj = {
        "file": {
            "fileName": file.name,
            "contentType": "application/pdf",
            "data": (<string>reader.result).split(',')[1]
        } 
    }
    this.leadUserForm.get('resume').setValue(this.resumeObj);
    this.leadUserForm.get('resume').markAsTouched();
    this.leadUserForm.get('resume').updateValueAndValidity();
    };
  }

  isResumeObjValid(): boolean{
    return (this.leadUserForm.get('resume').value && Object.keys(this.leadUserForm.get('resume').value).length > 0 )
  }
  
  removeResume(){
    this.leadUserForm.get('resume').setValue(null);
    this.resumeObj = {};
  }

  checkValidationOnCancel(){
    let inputCVBtn: any = document.getElementById('inputBtn');
    inputCVBtn.onfocus = () =>{
      let cvInput: any = document.getElementById('cvFile');
      let inputCVBtn: any = document.getElementById('inputBtn');
      inputCVBtn.onfocus = null;
      setTimeout( () => {
        if(!cvInput.value){
          this.leadUserForm.get('resume').markAsTouched();
          this.leadUserForm.get('resume').updateValueAndValidity();
        }         
      }, 300);
    };
  }

  getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  
}
