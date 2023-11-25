import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { QuizBuilderApiService } from '../../../quiz-builder-api.service';
import { EmailSmsSubjectService } from '../../email-sms-subject.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { NotificationsService } from 'angular2-notifications';
import { UserInfoService } from '../../../../shared/services/security.service';

@Component({
  selector: 'app-reminder-settings',
  templateUrl: './reminder-settings.component.html',
  styleUrls: ['./reminder-settings.component.css']
})
export class ReminderSettingsComponent implements OnInit, OnDestroy {

  // @Input() notificationType: any;
  public officeId = null;
  public notificationType:any;
  public officeList
  public officeIdSubscription: Subscription;
  public formValueChangeSubscription: Subscription;
  public reminderSettingsData;
  public reminderSettingForm: FormGroup;
  public isAnyChange: boolean = false;

  constructor(private quizBuilderApiService: QuizBuilderApiService,
  private emailSmsSubjectService: EmailSmsSubjectService,
  private notificationsService: NotificationsService,
  private userInfoService: UserInfoService) { 
    this.officeList = this.userInfoService.get().OfficeList;
    // if(this.quizBuilderApiService.getOffice()){
    //   this.officeId = this.quizBuilderApiService.getOffice();
    // }else{
    //    this.officeList.forEach((office) => {
    //      if(office.id == 133){
    //       this.officeId = 133
    //      }
    //    })
    // }
    // if(!this.officeId){
    //   this.officeId = this.officeList[0].id;
    // }
  }

  ngOnInit() {

   /**
    * Create New Form instance
    */ 
    this.reminderSettingForm = new FormGroup({
      'OfficeId': new FormControl(''),
      'FirstCheckBox': new FormControl(false),
      'FirstReminder': new FormControl(''),
      'SecondCheckBox': new FormControl(false),
      'SecondReminder': new FormControl(''),
      'ThirdCheckBox': new FormControl(false),
      'ThirdReminder': new FormControl('')
    });
    this.reminderValueChange();
    
    /**
     * get OfficeId using subject
     */
    this.officeIdSubscription = this.emailSmsSubjectService.officeIdSubject
    .subscribe((data) => {
      // if(!data){
      //   if(this.quizBuilderApiService.getOffice()){
      //     this.officeId = this.quizBuilderApiService.getOffice();
      //   }else{
      //     this.officeList.forEach((office) => {
      //       if(office.id == 133){
      //        this.officeId = 133
      //       }
      //     })
      //   }
      //   if(!this.officeId){
      //     this.officeId = this.officeList[0].id
      //   }
      // }else{
        this.officeId = data;
      // }
      this.getReminderData(this.officeId);
    });
    this.getReminderData(this.officeId);

    this.onChanges();   
  }

  
  reminderValueChange() {
    const { FirstReminder, SecondReminder, ThirdReminder } = this.reminderSettingForm.controls;
  
    FirstReminder.valueChanges.subscribe(firstData => {
      const secondReminderValue = SecondReminder.value;
      const thirdReminderValue = ThirdReminder.value;
  
      if ((secondReminderValue && firstData == secondReminderValue) || (thirdReminderValue && firstData == thirdReminderValue)) {
        FirstReminder.setErrors({ invalid: true });
      }
    });
  
    SecondReminder.valueChanges.subscribe(secondData => {
      const firstReminderValue = FirstReminder.value;
      const thirdReminderValue = ThirdReminder.value;
  
      if ((firstReminderValue && secondData == firstReminderValue) || (thirdReminderValue && secondData == thirdReminderValue)) {
        SecondReminder.setErrors({ invalid: true });
      }
    });
  
    ThirdReminder.valueChanges.subscribe(thirdData => {
      const firstReminderValue = FirstReminder.value;
      const secondReminderValue = SecondReminder.value;
  
      if ((firstReminderValue && thirdData == firstReminderValue) || (secondReminderValue && thirdData == secondReminderValue)) {
        ThirdReminder.setErrors({ invalid: true });
      }
    });
  }

  /**
   * Function call whenever forms Value changes
   */

  onChanges(){
    this.formValueChangeSubscription = this.reminderSettingForm.valueChanges.debounceTime(100)
    .subscribe(data => {
      this.resetNumberInput(data);
      this.makeInputFieldEnable(data);
      });
    }

  /**
   * 
   * @param data Object
   * function call when checkbox unchecked
   */
  resetNumberInput(data){
    if(!data['FirstCheckBox']){
      this.reminderSettingForm.patchValue({
        'FirstReminder': null
      });
      this.reminderSettingForm.get('FirstReminder').disable();
    }if(!data['SecondCheckBox']){
      this.reminderSettingForm.patchValue({
        'SecondReminder': null
      });
      this.reminderSettingForm.get('SecondReminder').disable();
    }if(!data['ThirdCheckBox']){
      this.reminderSettingForm.patchValue({
        'ThirdReminder': null
      });
      this.reminderSettingForm.get('ThirdReminder').disable();
    }
  }

  makeInputFieldEnable(data){
    if(data['FirstCheckBox']){
      this.reminderSettingForm.get('FirstReminder').enable();
    }if(data['SecondCheckBox']){
      this.reminderSettingForm.get('SecondReminder').enable();
    }if(data['ThirdCheckBox']){
      this.reminderSettingForm.get('ThirdReminder').enable();
    }
  }

  /**
   * 
   * @param officeId number (officeId)
   * Api integration: get Reminder Settings Data against officeId
   */
  getReminderData(officeId){
    if(!this.emailSmsSubjectService.getShared() && !officeId){
      if(this.quizBuilderApiService.getOffice()){
        officeId = this.quizBuilderApiService.getOffice();
      }else{
        // this.officeList.forEach((office) => {
        //   if(office.id == 133){
        //    officeId = 133
        //   }
        // })
      }
      if(!officeId && this.officeList.length){
        officeId = this.officeList[0].id
      }
    }else if(!officeId){
      officeId = "";
    }
    this.quizBuilderApiService.getReminderSettings(officeId)
    .subscribe((data) => {
      this.reminderSettingsData = data;
      this.reminderSettingForm.patchValue({
        "OfficeId": officeId
      })
      if(data.FirstReminder){
        this.reminderSettingForm.patchValue({
          'FirstCheckBox': true,
          'FirstReminder': data.FirstReminder
        });
      }else{
        this.reminderSettingForm.patchValue({
          'FirstCheckBox': false,
          'FirstReminder': data.FirstReminder
        });
      }
      if(data.SecondReminder){
        this.reminderSettingForm.patchValue({
          'SecondCheckBox': true,
          'SecondReminder': data.SecondReminder
        });
      }else{
        this.reminderSettingForm.patchValue({
          'SecondCheckBox': false,
          'SecondReminder': data.SecondReminder
        });  
      }
      if(data.ThirdReminder){
        this.reminderSettingForm.patchValue({
          'ThirdCheckBox': true,
          'ThirdReminder': data.ThirdReminder
        });
      }else{
        this.reminderSettingForm.patchValue({
          'ThirdCheckBox': false,
          'ThirdReminder': data.ThirdReminder
        });
      }
    }, (error) => {
      this.notificationsService.error('Error');
    });
  }

  /** 
   * Api Integration: Update Reminder Settings Details
  */
  updateReminderSettings(){
    this.resetNumberInput(this.reminderSettingForm.value);

    this.quizBuilderApiService.updateReminderSettings(this.reminderSettingForm.value)
    .subscribe((data) => {
     // this.notificationsService.success('Updated');
    }, (error) => {
      //this.notificationsService.error('Error');
    });
  }

  /** 
   * unsubscribe all subscription on component destroy
  */
  ngOnDestroy(){
    this.formValueChangeSubscription.unsubscribe();
    this.officeIdSubscription.unsubscribe();
  }

}
