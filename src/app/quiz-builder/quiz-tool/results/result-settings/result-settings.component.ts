import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { QuizBuilderApiService } from '../../../quiz-builder-api.service';
import { QuizzToolHelper } from '../../quiz-tool-helper.service';
import { DynamicMediaReplaceMentsService } from '../../dynamic-media-replacement';
import { rightMenuEnum } from '../../rightmenu-enum/rightMenuEnum';

@Component({
  selector: 'app-result-settings',
  templateUrl: './result-settings.component.html',
  styleUrls: ['./result-settings.component.css']
})
export class ResultSettingsComponent implements OnInit {

  public revealTimeParamArray = [
    {label: "MINUTES", value: "1"},
    {label: "HOURS", value: "2"},
    {label: "DAYS", value: "3"},
  ]
  public resultData;
  public resultSettingsForm: FormGroup;
  public quizTypeId;
  @ViewChild('focusField',{ static:false}) private focusField: ElementRef;

  @Output() leadFormCaptureEvent: EventEmitter<any> = new EventEmitter();

  constructor(private quizBuilderApiService: QuizBuilderApiService,
    private quizzToolHelper: QuizzToolHelper,
    private dynamicMediaReplaceService:DynamicMediaReplaceMentsService) { }

  ngOnInit() {
    this.quizTypeId = this.quizzToolHelper.quizTypeId;
    this.fatchResultSettingDetail();
    this._fillRevealTimeAccordingToParameter(this.resultData['ResultSettings'].RevealAfter);
  }

  fatchResultSettingDetail(){
    var score = this.resultData['ResultSettings'].CustomTxtForScoreValueInResult.split('%');
    this.resultSettingsForm = new FormGroup({
      'QuizId': new FormControl(this.resultData['ResultSettings'].QuizId),
      'ShowScoreValue': new FormControl(this.resultData['ResultSettings'].ShowScoreValue),
      'ShowCorrectAnswer': new FormControl(this.resultData['ResultSettings'].ShowCorrectAnswer),
      'IGOT': new FormControl(score[0]),
      'OUTOF': new FormControl(score[2]),
      'CORRECT': new FormControl(score[4]),
      'CustomTxtForScoreValueInResult': new FormControl(''),
      'CustomTxtForAnswerKey': new FormControl(this.resultData['ResultSettings'].CustomTxtForAnswerKey),
      'CustomTxtForYourAnswer': new FormControl(this.resultData['ResultSettings'].CustomTxtForYourAnswer),
      'CustomTxtForCorrectAnswer': new FormControl(this.resultData['ResultSettings'].CustomTxtForCorrectAnswer),
      'CustomTxtForExplanation': new FormControl(this.resultData['ResultSettings'].CustomTxtForExplanation),
      "RevealAfter": new FormControl(this.resultData['ResultSettings'].RevealAfter),
      "RevealTime": new FormControl(''),
      "RevealTimeParam": new FormControl('1'),
      'YouScoredA' :new FormControl(score[0]),
      "ResultId": new FormControl(this.resultData.ResultId),
      "ShowLeadUserForm": new FormControl(this.resultData.ShowLeadUserForm),
      "AutoPlay": new FormControl(this.resultData['ResultSettings'].AutoPlay), 
    });
  }

  _fillRevealTimeAccordingToParameter(timeInMin){
    if(timeInMin/(24*60) >= 1){
      let revealTempArray = (timeInMin/(24*60)).toString().split(".");
      let revealTime = revealTempArray[0] + "." + (revealTempArray[1] ? revealTempArray[1].substring(0,2) : "0");
      this.resultSettingsForm.patchValue({
        RevealTimeParam: "3",
        RevealTime: revealTime
      });
    }else if(timeInMin/60 >= 1){
      let revealTempArray = (timeInMin/60).toString().split(".");
      let revealTime = revealTempArray[0] + "." + (revealTempArray[1] ? revealTempArray[1].substring(0,2) : "0");
      this.resultSettingsForm.patchValue({
        RevealTimeParam: "2",
        RevealTime: revealTime
      });
    } else{
      this.resultSettingsForm.patchValue({
        RevealTimeParam: "1",
        RevealTime: this.resultSettingsForm.value.RevealAfter
      });
    }
  }

  _updateRevealTimeAccordingToParam(){
    if(this.resultSettingsForm.value.RevealTimeParam == 1){
      this.resultSettingsForm.patchValue({
        RevealAfter: this.resultSettingsForm.value.RevealTime * 1
      });
    }else if(this.resultSettingsForm.value.RevealTimeParam == 2){
      this.resultSettingsForm.patchValue({
        RevealAfter: this.resultSettingsForm.value.RevealTime * 60
      });
    }else if(this.resultSettingsForm.value.RevealTimeParam == 3){
      this.resultSettingsForm.patchValue({
        RevealAfter: this.resultSettingsForm.value.RevealTime * 60 * 24
      });
    }
  }

  /** 
   * To update Result Settings (API integration)
  */
  updateResultSettings() { 
    this._updateRevealTimeAccordingToParam();

    if(this.quizTypeId == 2){
      this.resultSettingsForm.patchValue({
        'CustomTxtForScoreValueInResult': `${this.resultSettingsForm.value['IGOT']}%score%${this.resultSettingsForm.value['OUTOF']}%total%${this.resultSettingsForm.value['CORRECT']}`
      });
    }else if(this.quizTypeId == 4){
      this.resultSettingsForm.patchValue({
        'CustomTxtForScoreValueInResult': `${this.resultSettingsForm.value['YouScoredA']}%score%`
      });
    }

    this.quizBuilderApiService.updateResultSettings(this.resultSettingsForm.value)
      .subscribe((data) => {
        this.quizzToolHelper.updateResultData(this.resultSettingsForm.value);
          this.leadFormCaptureEvent.emit(this.resultSettingsForm.value['ShowLeadUserForm']);
      });
  }

  onClose(){
    if(this.dynamicMediaReplaceService.isOpenEnableMediaSetiing.isOpen == true){
      this.dynamicMediaReplaceService.isOpenEnableMediaSetiing={
          "isOpen":false,
          "menuType":rightMenuEnum.DynamicMedia
      };
      this.dynamicMediaReplaceService.changeOpenEnableMediaSetiingSubmission();
    }
  }

}
