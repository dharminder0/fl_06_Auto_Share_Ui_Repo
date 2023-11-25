import { Component, OnInit } from "@angular/core";
import { UserInfoService } from "../../../shared/services/security.service";
import { QuizBuilderApiService } from "../../quiz-builder-api.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { Router, ActivatedRoute } from "@angular/router";
import { NotificationsService } from "angular2-notifications";
import { TagModel } from 'ngx-chips/core/accessor';

@Component({
  selector: "app-office-company",
  templateUrl: "./office-company.component.html",
  styleUrls: ["./office-company.component.css"]
})
export class OfficeCompanyComponent implements OnInit {
  public officeList = [];
  public officeId;
  public addQuizForm: FormGroup;
  public accessibleEmail = [];
  public businessUserEmail;
  public RequireId = "1";
  public newData;
  public userAccess: boolean = true;
  public isStandard;
  public companyReqList = [
    {
      value: "1",
      label: "ALL_USERS_CAN_VIEW_THE_AUTOMATION"
    },
    {
      value: "2",
      label: "ALL_USERS_CAN_VIEW_AND_EDIT_THE_AUTOMATION"
    },
    {
      value: "3",
      label: "ALL_USERS_CAN_VIEW_THE_AUTOMATION_EXCEPT"
    },
    {
      value: "4",
      label: "ALL_USERS_CAN_VIEW_AND_EDIT_THE_AUTOMATION_EXCEPT"
    },
    {
      value: "5",
      label: "ONLY_SELECTED_USERS_CAN_VIEW_THE_AUTOMATION"
    },
    {
      value: "6",
      label: "ONLY_SELECTED_USERS_CAN_EDIT_THE_AUTOMATION"
    }
  ];

  templateModeData = {
    isTemplateMode: false,
    templateId: null
  }

  constructor(
    private userInfoService: UserInfoService,
    private quizBuilderApiService: QuizBuilderApiService,
    private router: Router,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.isStandard = this.userInfoService.get().IsCreateStandardAutomationPermission;
    this.checkIfTemplateMode();
    this.businessUserEmail = this.userInfoService.get().UserName;

    /**
     * to get officeList and push into ng-select
     */
    this.officeList = [];
    if(this.userInfoService.get().officesParentChildList && this.userInfoService.get().officesParentChildList.length > 0){
      this.userInfoService.get().officesParentChildList.forEach(office => {
        this.officeList.push({
          value: office.id.toString(),
          label: office.name,
          type : 'Parent'
        });
        if(office.children && office.children && office.children.length > 0){
          office.children.forEach(child => {
            this.officeList.push({
              value :  child.id.toString(),
              label :  child.name,
              type  :  'Child'
            }) 
          })
      }
      });
    }

    if (this.officeList.length) {
      this.officeId = this.officeList[0].value;
    }

    /**
     * to create new Form instance
     */
    this.addQuizForm = new FormGroup({
      QuizType: new FormControl(2, Validators.required),
      access: new FormControl(1, Validators.required),
      AccessibleOfficeId: new FormControl(null),
      // CompanyAccessibleLevel: new FormControl(null),
      // AccessibleUserEmails: new FormControl(""),
      usersEmail: new FormControl(""),
      // BusinessUserEmail: new FormControl(this.businessUserEmail),
      // tempCompanyAccessibleLevel: new FormControl(null)
    });

    this.onChnages();
  }

  checkIfTemplateMode() {
    let mode = this.route.snapshot.queryParams['mode'];
    let templateid = this.route.snapshot.queryParams['templateId'];
    if (mode == 'template' && templateid) {
      this.templateModeData.isTemplateMode = true;
      this.templateModeData.templateId = templateid;
    }

  }

  onChnages() {
    this.addQuizForm.controls["access"].valueChanges.subscribe(accessValue => {
      if (accessValue == 1) {
        this.addQuizForm.patchValue({
          // CompanyAccessibleLevel: "",
          usersEmail: "",
          AccessibleOfficeId: this.officeList[0].value.toString()
        });
        this.addQuizForm.get("usersEmail").setErrors(null);
        // this.addQuizForm.get("CompanyAccessibleLevel").setErrors(null);
      } else {
        this.addQuizForm.patchValue({
          AccessibleOfficeId: ""
          // CompanyAccessibleLevel: "1",
          // tempCompanyAccessibleLevel: "1"
        });
        this.addQuizForm.get("AccessibleOfficeId").setErrors(null);
      }
    });
  }

  /**
   * function call when company type option has been selected...
   */
  CompanyAccessibleLevelSelected(e) {
    this.addQuizForm.patchValue({
      CompanyAccessibleLevel: e.value
    })
    if (e.value == 1 || e.value == 2) {
      this.userAccess = true;
      this.addQuizForm.get("usersEmail").setErrors(null);
      this.addQuizForm.patchValue({
        AccessibleUserEmails: "",
      })
    } else {
      this.userAccess = false;
    }
    if (e.value != 4) {
      this.addQuizForm.patchValue({
        CompanyAccessibleLevel: ((+e.value) % 4).toString()
      });
    }
  }

  /**
   * to detect which office selected
   */
  public onOfficeChange(e) {
    this.quizBuilderApiService.setOffice(this.officeId);
  }

  /**
   * Asynchronous Validation for email chips
   */
  emailValidation(control: FormControl) {
    var emailRegex: string =
      '(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))';
    var length = control.value.length;
    if (!control.value.match(emailRegex)) {
      return {
        emailInvalid: true
      };
    }
  }
  /**
   * to set Error Message
   */
  public errorMessages = {
    emailInvalid: "Please enter valid email-id"
  };
  public validators = [this.emailValidation];

  public placeholderData = "Enter E-mail";
  /**
   * to add new Email chips
   */
  public onAdding(tag: TagModel) {
    this.accessibleEmail.push(tag["value"]);
    this.addQuizForm.patchValue({
      AccessibleUserEmails: this.accessibleEmail.toString()
    });
  }

  /**
   * onSubmit to Create new Quiz
   */
  onAddNewQuiz() {
    let isTemplateMode: boolean = this.templateModeData.isTemplateMode && this.templateModeData.templateId;
    if (isTemplateMode) {
      this.useTemplate();
      return;
    }
    if (this.router.url.match("add-quiz")) {
      this.addQuizForm.patchValue({
        QuizType: 2
      });
    }
    // else if (this.router.url.match("add-course")) {
    //   this.addQuizForm.patchValue({
    //     QuizType: 5
    //   });
    // }
    else if (this.router.url.match("add-personality"))
    {
      this.addQuizForm.patchValue({
        QuizType :3
      });
    }
    else if (this.router.url.match("add-scored")) {
      this.addQuizForm.patchValue({
        QuizType: 4
      });
    }
    else if (this.router.url.match("add-NPS")) {
      this.addQuizForm.patchValue({
        QuizType: 1
    });
  }

    this.quizBuilderApiService.createNewQuiz(this.addQuizForm.value).subscribe(
      data => {
        //this.notificationsService.success("Add-Automation", "Automation has been created");
        // this.router.navigate([`quiz-builder/quiz-tool/${data}/cover`]);
        window.open("quiz-builder/quiz-tool/"+data+"/cover");
        this.router.navigate([`quiz-builder/explore`]);
      },
      error => {
        //this.notificationsService.error("Add-Automation", "Something went Wrong");
      }
    );


  }


  useTemplate() {
    let formData = this.addQuizForm.value;
    let AccessibleOfficeId = formData["AccessibleOfficeId"];
    // let CompanyAccessibleLevel = formData["CompanyAccessibleLevel"];
    // let AccessibleUserEmails = formData["AccessibleUserEmails"];
    const QuizId = this.templateModeData.templateId;
    this.quizBuilderApiService
      .createDuplicateTemplate(
        QuizId,
        AccessibleOfficeId
        // CompanyAccessibleLevel,
        // AccessibleUserEmails
      )
      .subscribe(data => {
        if (data) {
         // this.notificationsService.success("Success");
          // this.router.navigate([`quiz-builder/quiz-tool/${data}/cover`]);
          window.open("quiz-builder/quiz-tool/"+data+"/cover");
          this.router.navigate([`quiz-builder/explore`]);
        }
      });
  }
}
