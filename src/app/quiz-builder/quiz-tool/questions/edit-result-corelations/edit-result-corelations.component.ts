import { Component, OnInit, OnDestroy, Renderer2, Output, EventEmitter } from "@angular/core";
import { QuizBuilderApiService } from "../../../quiz-builder-api.service";
import { QuizzToolHelper } from "../../quiz-tool-helper.service";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NotificationsService } from "angular2-notifications";
import { UserInfoService } from "../../../../shared/services/security.service";
import { SharedService } from "../../../../shared/services/shared.service";
import { rightMenuEnum } from "../../rightmenu-enum/rightMenuEnum";
import { DynamicMediaReplaceMentsService } from "../../dynamic-media-replacement";
import { answerTypeEnum } from "../../commonEnum";
declare var Snap: any;

@Component({
  selector: "app-edit-result-corelations",
  templateUrl: "./edit-result-corelations.component.html",
  styleUrls: ["./edit-result-corelations.component.css"]
})
export class EditResultCorelationsComponent implements OnInit, OnDestroy {
  @Output() editQuestionData: EventEmitter<any> = new EventEmitter<any>();
  public questionData: any;
  public multipleDataSubscription: Subscription;
  public multipleResultData;
  public answerTypeData: number;
  public resultData;
  public answers;
  public c1 = [];
  public c2 = [];
  public id;
  public path = [];
  public arr: any = [];
  public resultArray = [];
  public setMaxForm: FormGroup;
  public secondaryColor;
  calculatedColor:any={};
  public IsMultiRating:any;

  constructor(
    private quizBuilderApiService: QuizBuilderApiService,
    private quizToolHelper: QuizzToolHelper,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private notificationsService: NotificationsService,
    private userInfoService : UserInfoService,
    private sharedService: SharedService,
    private dynamicMediaReplaceService:DynamicMediaReplaceMentsService
  ) {}

  ngOnInit() {
    this.createForm(this.questionData);
    this.getPersonalityResultSettings();
    this.setPredineAns();
    this.secondaryColor = this.userInfoService._info.SecondaryBrandingColor;
  }

  ngAfterViewInit(){
    this.checkCompanyColor();
  }

  sanitizeData(){
    this.questionData.AnswerList.forEach((ans) => {
      ans.AnswerText = this.sharedService.sanitizeData(ans.AnswerText);
    });
    this.resultData.forEach((res) => {
      res.Title = this.sharedService.sanitizeData(res.Title);
    })
  }

  setPredineAns(){
    if(this.questionData.AnswerType == answerTypeEnum.availability){
      this.questionData.AnswerList.forEach((ans,i) => {
        if(i == 0){
          ans.AnswerText = 'Immediately';
        }else if(i == 1){
          ans.AnswerText = 'Within 3 months';
        }else if(i == 2){
          ans.AnswerText = 'After 3 months';
        }
      });
    }else if(this.questionData.AnswerType == answerTypeEnum.ratingEmoji && !this.IsMultiRating){
      this.questionData.AnswerList.forEach((ans) => {
        ans.AnswerText = 'Rating for emoji';
      });
    }else if(this.questionData.AnswerType == answerTypeEnum.ratingEmoji && this.IsMultiRating){
      this.questionData.AnswerList.forEach((ans,i) => {
       if(i == 0){
        ans.AnswerText = ans.AnswerText ? ans.AnswerText : 'Zeer ontevreden';
       }else if(i == 1){
        ans.AnswerText = ans.AnswerText ? ans.AnswerText : 'Ontevreden';
       }else if(i == 2){
        ans.AnswerText = ans.AnswerText ? ans.AnswerText : 'Neutraal';
       }else if(i == 3){
        ans.AnswerText = ans.AnswerText ? ans.AnswerText : 'Tevreden';
       }else if(i == 4){
        ans.AnswerText = ans.AnswerText ? ans.AnswerText : 'Zeer tevreden';
       }
      });
    }else if(this.questionData.AnswerType == answerTypeEnum.ratingStar && !this.IsMultiRating){
      this.questionData.AnswerList.forEach((ans) => {
        ans.AnswerText = 'Rating for star';
      });
    }else if(this.questionData.AnswerType == answerTypeEnum.ratingStar && this.IsMultiRating){
      this.questionData.AnswerList.forEach((ans,i) => {
        if(i == 0){
          ans.AnswerText = 'Zeer ontevreden';
         }else if(i == 1){
          ans.AnswerText = 'Enigszins ontevreden';
         }else if(i == 2){
          ans.AnswerText = 'Niet tevreden en niet ontevreden';
         }else if(i == 3){
          ans.AnswerText = 'Enigszins tevreden';
         }else if(i == 4){
          ans.AnswerText = 'Zeer tevreden';
         }
      });
    }
  }

  createForm(data) {
    this.setMaxForm = new FormGroup({
      MinAnswer: new FormControl(data.MinAnswer ? data.MinAnswer : 0, [
        Validators.min(0),
        Validators.max(data.AnswerList.length)
      ]),
      MaxAnswer: new FormControl(data.MaxAnswer ? data.MaxAnswer : 0, [
        Validators.min(0),
        Validators.max(data.AnswerList.length)
      ])
    });
  }

  createCorrelations() {
    const s = Snap("#my-svg");

    for (var j = 0; j < this.questionData.AnswerList.length; j++) {
      this.path[this.questionData.AnswerList[j].AnswerId] = [];
      for (var k = 0; k < this.resultData.length; k++) {
        this.path[this.questionData.AnswerList[j].AnswerId][
          this.resultData[k].ResultId
        ] = s.path(
          "M20," +
            (30 + j * 61) +
            "C100," +
            (30 + j * 61) +
            " 100," +
            (30 + k * 61) +
            " 220," +
            (30 + k * 61)
        );
        this.path[this.questionData.AnswerList[j].AnswerId][
          this.resultData[k].ResultId
        ].attr({
          strokeWidth: "2",
          stroke: "",
          fill: "none"
        });
        // this.path[j][k].push(p);
      }
    }

    for (var i = 0; i < this.questionData.AnswerList.length; i++) {
      this.c1[this.questionData.AnswerList[i].AnswerId] = s.circle(
        20,
        30 + i * 61,
        8
      );
      // this.c1[i].attr(
      //   {

      //   }
      // )
    }
    for (var i = 0; i < this.resultData.length; i++) {
      this.c2[this.resultData[i].ResultId] = s.circle(220, 30 + i * 61, 8);
    }
  }

  getPersonalityResultSettings() {
    let quizId;
    if(this.route.parent.parent.snapshot.params.id){
      quizId = this.route.parent.parent.snapshot.params.id;
    }else{
      quizId = this.route.parent.snapshot.params.id;
    }
    this.multipleDataSubscription = this.quizToolHelper.updateMultipleData.subscribe(
      data => {
        this.quizBuilderApiService
          .getPersonalityResultSettings(quizId)
          .subscribe(data => {
            this.multipleResultData = data;
            this.resultData = [];
            this.resultData.push(
              ...this.multipleResultData[0]["ResultDetails"]
            );
            this.sanitizeData();
            this.createCorrelations();
            if (this.questionData.AnswerList.length > this.resultData.length) {
              this.answers = this.questionData.AnswerList.length * 61;
            } else {
              this.answers = this.resultData.length * 61;
            }
            this.getResultCorerealtions();
          });
      }
    );
  }
  // get initial Result Coreelations
  getResultCorerealtions() {
    this.quizBuilderApiService
      .getResultCorrelation(this.questionData.QuestionId)
      .subscribe(data => {
        this.resultArray = data;
        this.greyPath();
        this.id = this.questionData.AnswerList[0].AnswerId;
        this.onAnswerClick(this.id);
      });
  }

  greyPath() {
    for (var j = 0; j < this.resultArray.length; j++) {
      var ansId = this.resultArray[j].AnswerId;
      var resId = this.resultArray[j].ResultId;
      if (this.path[ansId]) {
        if (this.path[ansId][resId]) {
          this.path[ansId][resId].attr({
            stroke: this.secondaryColor
          });
        }
      }
    }
  }

  onAnswerClick(idx) {
    this.id = idx;
    for (var i = 0; i < this.questionData.AnswerList.length; i++) {
      this.c1[this.questionData.AnswerList[i].AnswerId].attr({
        fill: "#FFFFFF",
        stroke: this.secondaryColor
      });
    }

    var array = document.getElementsByClassName("def");
    for (var k = 0; k < array.length; k++) {
      this.arr[this.resultData[k].ResultId] = array[k];
    }

    for (var i = this.resultData.length - 1; i >= 0; i--) {
      this.c2[this.resultData[i].ResultId].attr({
        fill: "#FFFFFF",
        stroke:this.secondaryColor
      });

      this.renderer.removeClass(
        this.arr[this.resultData[i].ResultId],
        "backCol"
      );
      this.renderer.addClass(this.arr[this.resultData[i].ResultId], "back");
    }
    for (var j = 0; j < this.resultArray.length; j++) {
      var ansId = this.resultArray[j].AnswerId;
      var resId = this.resultArray[j].ResultId;
      if (idx != ansId) {
        if (this.path[ansId]) {
          if (this.path[ansId][resId]) {
            this.path[ansId][resId].attr({
              stroke: this.secondaryColor
            });
          }
        }
      } else {
        if (this.path[ansId]) {
          if (this.path[ansId][resId]) {
            this.path[ansId][resId].attr({
              stroke: this.secondaryColor
            });
          }
        }
        if (this.c2[resId]) {
          this.c2[resId].attr({
            fill: this.secondaryColor
          });
        }
        if (this.arr[resId]) {
          this.renderer.addClass(this.arr[resId], "backCol");
          this.renderer.removeClass(this.arr[resId], "back");
        }
      }
    }

    this.c1[idx].attr({
      fill: this.secondaryColor
    });
  }

  onResultClick(index) {
    var x = this.secondaryColor;
    if (this.c2[index].node.getAttribute("fill") && (this.c2[index].node.getAttribute("fill").toLocaleLowerCase() == x.toLocaleLowerCase())) {
      this.c2[index].attr({
        fill: "#FFFFFF",
        stroke:this.secondaryColor
      });
    } else {
      this.c2[index].attr({
        fill: x
      });
    }

    if (this.path[this.id][index].node.getAttribute("stroke") && (this.path[this.id][index].node.getAttribute("stroke").toLocaleLowerCase() == x.toLocaleLowerCase())) {
      this.path[this.id][index].attr({
        stroke: ""
      });

      for (var k = 0; k < this.resultArray.length; k++) {
        if (
          this.resultArray[k].AnswerId == this.id &&
          this.resultArray[k].ResultId == index
        ) {
          this.resultArray.splice(k, 1);
        }
      }
    } else {
      this.path[this.id][index].attr({
        stroke: x
      });
      var obj = {
        AnswerId: this.id,
        ResultId: index
      };
      this.resultArray.push(obj);
    }

  }

  onSave() {
    var final = {
      QuestionId: this.questionData.QuestionId,
      CorrelationList: this.resultArray,
      MinAnswer: this.setMaxForm.controls["MinAnswer"].value,
      MaxAnswer: this.setMaxForm.controls["MaxAnswer"].value
    };

    this.quizBuilderApiService
      .updateResultCorrelation(final)
      .subscribe(data => {
        this.editQuestionData.emit();
        // this.notificationsService.success('Correlation has been updated');
      }, (error) => {
        // this.notificationsService.error('Error');
      });
      // if(this.setMaxForm.dirty){
      //   this.quizBuilderApiService.updateAnswerType(
      //     this.questionData.QuestionId,
      //     this.answerTypeData,
      //     this.setMaxForm.controls["MinAnswer"].value,
      //     this.setMaxForm.controls["MaxAnswer"].value
      //   ).subscribe((response) => {}, (error) => {
      //     this.notificationsService.error('Error');
      //   });
      // }
  }

  public checkCompanyColor(){
    var saveBtn = document.getElementsByClassName("btns-create");
    var r, g, b, hsp;
    var color = this.userInfoService.get().SecondaryBrandingColor
    if (color.match(/^rgb/)) {
    color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
    r = color[1];
    g = color[2];
    b = color[3];
    }
    else {
    color = +("0x" + color.slice(1).replace(
    color.length < 5 && /./g, '$&$&'));
    
    r = color >> 16;
    g = color >> 8 & 255;
    b = color & 255;
    }
    
    hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
    );
    
    // Using the HSP value, determine whether the color is light or dark
    if (hsp>160) {
    this.calculatedColor = {'color':'#000000'};
    }
    else {
    this.calculatedColor = {'color':'#ffffff'};
    }
  
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

  ngOnDestroy() {
    this.multipleDataSubscription.unsubscribe();
  }
}
