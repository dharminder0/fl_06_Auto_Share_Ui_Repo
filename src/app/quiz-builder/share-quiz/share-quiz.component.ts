import { Component, OnInit } from "@angular/core";
import { QuizBuilderApiService } from "../quiz-builder-api.service";
import { FormGroup, FormControl } from "@angular/forms";
import { Location } from "@angular/common";
import { NotificationsService } from "angular2-notifications";
import { UserInfoService } from "../../shared/services/security.service";

@Component({
    selector: "app-share-quiz",
    templateUrl: "./share-quiz.component.html",
    styleUrls: ["./share-quiz.component.css"]
})

export class ShareQuizComponent implements OnInit {
    public shareQuizForm: FormGroup;
    public quizData;
    public hostURL;
    public quizURL;
    public id;
    public Course;
    public Recruiter;
    public placeholder;
    public disableJobrock :boolean = false;
    public disableTechnical :boolean = false;
    public campId='';
    public shareAr=[];
    public technicalRecruiterBool : boolean = false;
    public sourceType : Array<object> = [];
    public moduleType : any = [];
    public permissionModuleType : Array<object> = [];
    dropdownDisable;
   
    style : {};
    recruiterStyle : {};
    public disableELearning :boolean = false;

    constructor(
      private quizBuilderApiService: QuizBuilderApiService,
      private location: Location,
      private notificationsService: NotificationsService,
      private userInfoService : UserInfoService
    ) 
    {
      {
        this.Course = this.userInfoService.get();
          if(this.Course.CreateAcademyCourse == false || this.Course.CreateAcademyCourseEnabled == false)
          {
            this.disableJobrock = true;
          }
      }
      {
        this.Recruiter = this.userInfoService.get();
        if(this.Recruiter.CreateTechnicalRecruiterCourse  == false || this.Recruiter.CreateTechnicalRecruiterCourseEnabled  == false)
        {
          this.disableTechnical = true;
        }

      }
    }
    

    ngOnInit() { 
      this.moduleType = [
          {value:'1', label : "Automation", permission: this.Course.IsAutomationTechnicalRecruiterCoursePermission},  
          {value:'2', label : "Appointment",permission:this.Course.IsAppointmentTechnicalRecruiterCoursePermission},
          {value:'3', label : "ELearning",permission:this.Course.IsELearningTechnicalRecruiterCoursePermission},
          {value:'4', label : "Canvas",permission:this.Course.IsCanvasTechnicalRecruiterCoursePermission},
          {value:'5', label : "Vacancies",permission:this.Course.IsVacanciesTechnicalRecruiterCoursePermission},
          {value:'6', label : "Contacts",permission:this.Course.IsContactsTechnicalRecruiterCoursePermission},
          {value:'7', label : "Review",permission:this.Course.IsReviewTechnicalRecruiterCoursePermission},
          {value:'8', label : "Reporting",permission:this.Course.IsReportingTechnicalRecruiterCoursePermission},
          {value:'9', label : "Campaigns",permission:this.Course.IsCampaignsTechnicalRecruiterCoursePermission}
        ];

    this.moduleType.map(item=>{
      if(item && item.permission){
        this.permissionModuleType.push(item);
      }
    });

      this.sourceType = [
        {value:1, label : "Vacature"},
        {value:2, label : "Campaign"},
        {value:3, label : "Social_Campaign"},
        {value:4, label : "Event"},
        {value:5, label : "Partnerships"},
        {value:6, label : "Open_Application"}];

        this.hostURL = this.location[
          "_platformLocation"
        ].location.host;

      if (this.quizData.Id) {
        this.quizBuilderApiService
          .getQuizShare(this.quizData.Id)
          .subscribe(data => {
            this.technicalRecruiterBool = data.TechnicalRecruiter;
            this.fillFormData(data);
          });
      } 
      else if (this.quizData.QuizId) {
        this.quizBuilderApiService
          .getQuizShare(this.quizData.QuizId)
          .subscribe(data => {
            this.technicalRecruiterBool = data.TechnicalRecruiter;
            this.fillFormData(data);
          });
      }

      this.quizURL = this.hostURL + "/quiz?Code=" + this.quizData.PublishedCode;

      this.shareQuizForm = new FormGroup({
        QuizId: new FormControl(),
        JobRockAcademy: new FormControl(null),
        Recruiter: new FormControl(),
        TechnicalRecruiter: new FormControl(),
        Module: new FormControl(''),
        Lead: new FormControl(),
        // Public: new FormControl(),
        // shareURL: new FormControl(this.quizURL)
      });
      // this.formValueChanges();

      if(this.Course.IsManageElearningPermission == false){
        this.disableELearning = true;
      }

      if(this.Course.CreateAcademyCourse == false || this.Course.CreateAcademyCourseEnabled == false && this.Course.CreateTechnicalRecruiterCourse  == false || this.Course.CreateTechnicalRecruiterCourseEnabled  == false){
        this.shareQuizForm.controls['JobRockAcademy'].disable();
        this.shareQuizForm.controls['TechnicalRecruiter'].disable();
        this.disableJobrock = true;
        this.disableTechnical = true;
        return this.style = {'cursor': 'not-allowed'},this.recruiterStyle = {'cursor': 'not-allowed'};
      }

      if(this.Course.CreateAcademyCourse == false || this.Course.CreateAcademyCourseEnabled == false)
      {
        this.shareQuizForm.controls['JobRockAcademy'].disable();
        this.disableJobrock = true;
        return this.style = {'cursor': 'not-allowed'};
      }
      if(this.Course.CreateTechnicalRecruiterCourse  == false || this.Course.CreateTechnicalRecruiterCourseEnabled  == false)
      {
        this.shareQuizForm.controls['TechnicalRecruiter'].disable();
        this.disableTechnical = true;
        return this.recruiterStyle = {'cursor': 'not-allowed'};

      }

    }

    onSearchChange(searchValue){
      if(searchValue){
        this.dropdownDisable = true;
        if(this.shareQuizForm.controls.Module.value == "null"){
          this.shareQuizForm.controls.Module.setValue('1');
        }
        this.Course.shareQuizForm
        this.shareQuizForm
      }else{
      this.dropdownDisable = false;
      if(this.shareQuizForm.controls['Module']){
      this.shareQuizForm.controls['Module'].setValue('');
      }
      }
    }


  //  onselect(e) {
  //     this.placeholder = e.label;
  //     this.shareQuizForm.patchValue({
  //       shareURL: this.quizURL
  //     });
  //     this.id='';
  //   } 

    onselectModule(e) {
      this.shareQuizForm.controls.Module.patchValue(e.value);
    }

    public removeSpaces(x) {
      return x? x.replace(/\s/gm,''): "";
       }

    fillFormData(data) {
      this.shareQuizForm.patchValue({
        JobRockAcademy: data.JobRockAcademy,
        Recruiter: data.Recruiter,
        Lead: data.Lead,
        // Public: data.Public,
        QuizId: data.QuizId,
        TechnicalRecruiter: data.TechnicalRecruiter,
        Module: String(data.Module)
      });
      
      if(this.shareQuizForm.controls.TechnicalRecruiter.value){
        this.dropdownDisable = true;
      }
      let localdata = "campaignId" +this.shareQuizForm.controls.QuizId.value;

      if(localStorage.getItem(localdata))
      {
        this.shareAr = localStorage.getItem(localdata).split("=");
        if(this.shareAr[2])
        {
          this.campId = this.shareAr[2];
          // this.shareQuizForm.patchValue({
          //   shareURL: this.quizURL + "&campaignId=" +  this.campId
          // });
        }
      }
    }

    // onLabelChange(event)
    // {
    //   this.shareQuizForm.patchValue({
    //     shareURL: this.quizURL + "&" + this.placeholder + "=" + event.target.value + ""
    //   });

    //   if(event.target.value == "")
    //   {
    //     this.shareQuizForm.patchValue({
    //       shareURL: this.quizURL 
    //     }); 
    //   }
    // }

    // formValueChanges() {
    //   this.shareQuizForm.controls["Public"].valueChanges.subscribe(publicData => {
    //     if (publicData === false) 
    //     {
    //       this.shareQuizForm.patchValue({
    //         shareURL: ""
    //       });
    //     } 
    //     else 
    //     {
    //       this.shareQuizForm.patchValue({
    //         shareURL: this.quizURL
    //       });
    //     }
    //   });
    // }

    publish() {
      if (this.quizData.Id) 
      {
        this.quizBuilderApiService.publishQuiz(this.quizData.Id).subscribe(
          data => {
           // this.notificationsService.success("Success");
            this.quizData.IsPublished = true;
            this.quizURL =
              this.hostURL + "/quiz?Code=" + (this.quizData.PublishedCode? this.quizData.PublishedCode:data)
          },
          error => {
           // this.notificationsService.error("Error");
          }
        );
      } 
      else if (this.quizData.QuizId) 
      {
        this.quizBuilderApiService.publishQuiz(this.quizData.QuizId).subscribe(
          data => {
         //   this.notificationsService.success("Success");
            this.quizData.IsPublished = true;
            this.quizURL =
              this.hostURL + "/quiz?Code=" +  (this.quizData.PublishedCode? this.quizData.PublishedCode:data)
          },
          error => {
         //   this.notificationsService.error("Error");
          }
        );
      }
    }

    saveQuizShare() {
      if(this.shareQuizForm.controls['Module'] && this.shareQuizForm.controls['Module'].value == "null"){
        this.shareQuizForm.controls['Module'].setValue('')
      }
     if(this.Course.CreateAcademyCourse == false || this.Course.CreateAcademyCourseEnabled == false)
      {
        this.shareQuizForm.removeControl('JobRockAcademy');
      }

      if(this.Course.CreateTechnicalRecruiterCourse  == false || this.Course.CreateTechnicalRecruiterCourseEnabled  == false)
      {
        this.shareQuizForm.removeControl('TechnicalRecruiter');
        this.shareQuizForm.removeControl('Module');
      }
      if(this.Course.IsManageElearningPermission == false)
      {
        this.shareQuizForm.removeControl('Recruiter');
      }
      this.quizBuilderApiService
        .updateQuizShare(this.shareQuizForm.value)
        .subscribe(
          data => {
        //    this.notificationsService.success("Success");
          },
          error => {
          //  this.notificationsService.error("Error");
          }
        );
    }

    public isURLCopied= false;

    onCopyButtonClicked(){
      this.isURLCopied = true;
      setTimeout(() => {
        this.isURLCopied = false;
      }, 2000)
    }
}
