import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserInfoService } from '../../../shared/services/security.service';
import { QuizBuilderApiService } from '../../quiz-builder-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { TagModel } from 'ngx-chips/core/accessor';

@Component({
  selector: 'app-office-company',
  templateUrl: './office-company.component.html',
  styleUrls: ['./office-company.component.css']
})
export class OfficeCompanyComponent implements OnInit {
  public officeList = [];
  public officeId;
  public quizId;
  public editQuizForm: FormGroup;
  public accessibleEmail = [];
  public RequireId = '1';
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
  public placeholderData = "Enter E-mail";
  
  constructor(private userInfoService: UserInfoService,
    private quizBuilderApiService: QuizBuilderApiService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationsService: NotificationsService) { }

  ngOnInit() {
    this.isStandard = this.userInfoService.get().IsCreateStandardAutomationPermission;
    /**
     * to Get id via eouting
     */
    this.route.params.subscribe(params => {
      this.quizId = +params['id'];
    });
    
    /**
     * to Get OfficeList and store in ng-select
     */
    this.officeList = [];
    if(this.userInfoService.get().officesParentChildList.length > 0){
      this.userInfoService.get().officesParentChildList.forEach(office => {
        this.officeList.push({
          value: office.id.toString(),
          label: office.name,
          type : 'Parent'
        });
        if(office.children && office.children.length > 0){
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
    /**
     * to create new form instance
     */
    this.editQuizForm = new FormGroup({
      'QuizId': new FormControl(''),
      'access': new FormControl('', Validators.required),
      'AccessibleOfficeId': new FormControl(null),
      'usersEmail': new FormControl('')
    });

    /**
     * to get the automation access data according to QuizId
     */
    this.quizBuilderApiService.getQuizAccessSetting(this.quizId)
    .subscribe((data) => {
      /**
       * patch Quiz Data in angular form instance
       */
      this.editQuizForm.patchValue({
        'QuizId': data.QuizId,
        'AccessibleOfficeId': data.AccessibleOfficeId ? data.AccessibleOfficeId.toString():''
      });


      /**
       * checked the check box according to office and company
       */
      if(data.AccessibleOfficeId){
        this.editQuizForm.patchValue({
          'access': 1
        });
      }
      else{
        this.editQuizForm.patchValue({
              'access': 2
        });
      }
    }, (error) => {
      this.notificationsService.error('Error');
    });

    this.onChnages();
}

  /**
   * function call when company type option has been selected...
   */
  CompanyAccessibleLevelSelected(e) {
    this.editQuizForm.patchValue({
      CompanyAccessibleLevel: e.value
    })
    if (e.value == 1 || e.value == 2) {
      this.userAccess = true;
      this.editQuizForm.get("usersEmail").setErrors(null);
    } else {
      this.userAccess = false;
    }
    if(e.value != 4){
      this.editQuizForm.patchValue({
        CompanyAccessibleLevel: ((+e.value)%4).toString()
      });
    }
  }
/**
 * Patch value to usersEmail form backend data
 */

 patchUserEmailValueFromBackend(userEmailData){
  let userEmailarray: Array<Object> = [];
  userEmailData.forEach((email) => {
    let obj = {display: email, value: email};
    userEmailarray.push(obj)
  })
  this.editQuizForm.patchValue({
    'usersEmail': userEmailarray
  });
 }

onChnages(){
  this.editQuizForm.controls['access'].valueChanges
  .subscribe((accessValue) => {
    if(accessValue == 1){
      this.editQuizForm.patchValue({
        'usersEmail': ''
      });
      this.userAccess = true;
      this.editQuizForm.get('usersEmail').setErrors(null);
    }else{
      this.editQuizForm.patchValue({
        'AccessibleOfficeId': '',
      });
      this.editQuizForm.get('AccessibleOfficeId').setErrors(null);
    }
  });
}

/**
 * On changing the office selection
 */
  public onOfficeChange(e) {
    this.quizBuilderApiService.setOffice(this.officeId)
  }

  /**
   * Asynchronous Validation for email chips
   */
  emailValidation(control: FormControl){
    var emailRegex: string = '(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))';
    var length = control.value.length;
        if(!control.value.match(emailRegex)){
          return{
            'emailInvalid': true
          };
        } 
  }

/**
 * Set the Error Message
 */
  public errorMessages = {
    'emailInvalid': 'Please enter valid email-id',
};
  public validators = [this.emailValidation];

  /**
   * to Add New Email Chips
   */
  public onAdding(tag: TagModel) {
    this.accessibleEmail.push(tag['value']);
}

/**
 * to update Quiz Access Settings (API integrated)
 */
  onAddNewQuiz(){
    if(!this.userAccess){
      let userEmailData = this.editQuizForm.value.usersEmail.map(function(item) {
        return item['value'];
      });
    }
    this.quizBuilderApiService.updateQuizAccessSettings(this.editQuizForm.value)
    .subscribe((data) => {
    }, (error) => {
    });
  }

  onCompanySelected(){
    this.editQuizForm.patchValue({
      'CompanyAccessibleLevel': '1',
      'tempCompanyAccessibleLevel': '1'
    });
  }

}
