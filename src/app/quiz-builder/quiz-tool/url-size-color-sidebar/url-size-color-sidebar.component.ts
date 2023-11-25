import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { QuizBuilderApiService } from '../../quiz-builder-api.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-url-size-color-sidebar',
  templateUrl: './url-size-color-sidebar.component.html',
  styleUrls: ['./url-size-color-sidebar.component.css']
})
export class UrlSizeColorSidebarComponent implements OnInit {

  public resultData;
  public urlSizeColorform: FormGroup;

  constructor(private quizBuilderApiService: QuizBuilderApiService,
    private notificationsService: NotificationsService) { }

  ngOnInit() {
    this.urlSizeColorform = new FormGroup({
      'ActionButtonURL': new FormControl(this.resultData.ActionButtonURL),
      'ActionButtonTxtSize': new FormControl(this.resultData.ActionButtonTxtSize),
      'ActionButtonColor': new FormControl(this.resultData.ActionButtonColor),
      'ActionButtonHoverColor': new FormControl(this.resultData.ActionButtonHoverColor),
      'ActionButtonTitleColor': new FormControl(this.resultData.ActionButtonTitleColor)
    })
  }

  saveUrlSizeColor() {
    this.resultData.ActionButtonColor = this.urlSizeColorform.value['ActionButtonColor'];
    this.resultData.ActionButtonHoverColor = this.urlSizeColorform.value['ActionButtonHoverColor'];
    this.resultData.ActionButtonTitleColor = this.urlSizeColorform.value['ActionButtonTitleColor'];
    this.resultData.ActionButtonTxtSize = this.urlSizeColorform.value['ActionButtonTxtSize'];
    this.resultData.ActionButtonURL = this.urlSizeColorform.value['ActionButtonURL'];


    this.quizBuilderApiService.updateResultDetails(this.resultData)
    .subscribe((data) => {
      this.notificationsService.success('Updated Successfully');
    },(error) => {
      this.notificationsService.error('Error');
    })
   }

   changeEvent(e){
   }
   StepDown(e){
   }

}
