import {
  Component,
  OnInit,
  Input,
  SimpleChange,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { QuizBuilderApiService } from "../../quiz-builder-api.service";
import { QuizzToolHelper } from "../quiz-tool-helper.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-result-range",
  templateUrl: "./result-range.component.html",
  styleUrls: ["./result-range.component.css"]
})
export class ResultRangeComponent implements OnInit {
  public isUpperLimitReach: boolean = false;
  public isLowerLimitReach: boolean = false;
  public quizTypeID;
  public quizID;
  public highest;
  public lowest;
  public updatedResult;

  @Input() result;
  @Input() branchingLogicSide;

  @Output() datachange = new EventEmitter();

  public rangeForm: FormGroup;
  public overAllResultData: Array<Object>;
  public overAllQuestionData: Array<Object>;
  public isOpenTooltip = false;
  constructor(
    private _fb: FormBuilder,
    private quizBuilderApiService: QuizBuilderApiService,
    private quizzToolHelper: QuizzToolHelper,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getOverallRanges();
    this.createForm();
    this.rangeCheckSubscription();
    this.quizTypeID = this.quizzToolHelper.quizTypeId;

  }

  onTooltipShown(res) {
    this.isUpperLimitReach = false;
    this.isLowerLimitReach = false;
    let resIndex = this.findCurrentResultIndex(res.ResultId);
    if (resIndex === 0) {
      this.isUpperLimitReach = true;
      // this.rangeForm.controls['MinScore'].disable();
    }
    if (resIndex === this.overAllResultData.length - 1) {
      this.isLowerLimitReach = true;
      // this.rangeForm.controls['MaxScore'].disable();
    }
    this.rangeForm.patchValue({
      MinScore: this.result.MinScore,
      MaxScore: this.result.MaxScore
    });
    this.isOpenTooltip = true;
  }

  onTooltipHidden() {
    this.isOpenTooltip = false;
  }


  private createForm() {
    this.rangeForm = this._fb.group({
      ResultId: [this.result.ResultId, [Validators.required]],
      ResultTitle: [this.result.ResultTitle],
      MinScore: [
        this.result.MinScore,
        [Validators.required]
      ],
      MaxScore: [this.result.MaxScore, [Validators.required]]
    });
  }

  getOverallRanges() {
    this.quizzToolHelper.updatedQuizData.subscribe(quizData => {
      if (quizData) {
        this.overAllResultData = quizData.Results;
        this.overAllQuestionData = quizData.QuestionsInQuiz;
      }
    });
  }

  public reCreatedResultRange = [];
  saveRange() {
    this.onTooltipHidden();
    this.reCreatedResultRange = [];
    let curResultIndex = this.findCurrentResultIndex(
      this.rangeForm.controls.ResultId.value
    );
    let curResultRange;
    // if (+this.rangeForm.controls.MaxScore.value != 0) {
      curResultRange = {
        MinScore: +this.rangeForm.controls.MinScore.value,
        MaxScore: +this.rangeForm.controls.MaxScore.value
      };
    // } else {
    //   curResultRange = { MinScore: +this.rangeForm.controls.MinScore.value };
    // }

    if (this.quizTypeID == 4 || this.quizTypeID == 6) {
      let upperQueCount = +this.rangeForm.controls.MinScore.value - this.overAllResultData[0]["MinScore"];
      let upperResCount = curResultIndex;
      let lowerQueCount =
        this.findMaxRange() - +this.rangeForm.controls.MaxScore.value;
      let lowerResCount = this.overAllResultData.length - (curResultIndex + 1);

      let uppResultRange;
      let lowResultRange;

      let MiniScore = +this.rangeForm.controls.MinScore.value;
      let MaxiScore = +this.rangeForm.controls.MaxScore.value;

      if (this.overAllResultData[curResultIndex]["MinScore"] != MiniScore) {
        uppResultRange = this.divideScoreInResult(
          upperQueCount,
          upperResCount,
          1
        );
      }
      else {
        uppResultRange = this.oldUpperScores(curResultIndex);
      }

      if (this.overAllResultData[curResultIndex]["MaxScore"] != MaxiScore) {
        lowResultRange = this.divideScoreInResult(
          lowerQueCount,
          lowerResCount,
          2
        );
      }
      else {
        lowResultRange = this.oldLowerScores(curResultIndex);
      }

      this.reCreatedResultRange.push(...uppResultRange);
      this.reCreatedResultRange.push(curResultRange);
      this.reCreatedResultRange.push(...lowResultRange);
    }


    else {
      let upperQueCount = +this.rangeForm.controls.MinScore.value;
      let upperResCount = curResultIndex;
      let lowerQueCount =
        this.findMaxRange() - +this.rangeForm.controls.MaxScore.value;
      let lowerResCount = this.overAllResultData.length - (curResultIndex + 1);
      let uppResultRange = this.divideQuestionInResult(
        upperQueCount,
        upperResCount
      );
      let lowResultRange = this.divideQuestionInResult(
        lowerQueCount,
        lowerResCount
      );
      for (let i = 0; i < lowResultRange.length; i++) {
        let curData = lowResultRange[i];
        curData.MinScore =
          +curData.MinScore + +this.rangeForm.controls.MaxScore.value + 1;
        curData.MaxScore =
          +curData.MaxScore + +this.rangeForm.controls.MaxScore.value + 1;
        lowResultRange[i] = curData;
      }
      this.reCreatedResultRange.push(...uppResultRange);
      this.reCreatedResultRange.push(curResultRange);
      this.reCreatedResultRange.push(...lowResultRange);
    }
    this.datachange.emit(this.reCreatedResultRange);
  }

  rangeCheckSubscription() {
    this.rangeForm.valueChanges.subscribe((simplechanges: SimpleChange) => {
      let MinScore = simplechanges["MinScore"];
      let MaxScore = simplechanges["MaxScore"];
      // this.calculateMaxMin();
      const MinScoreControl = this.rangeForm.controls["MinScore"];
      const MaxScoreControl = this.rangeForm.controls["MaxScore"];
      let resultIndex = this.findCurrentResultIndex(
        this.rangeForm.controls["ResultId"].value
      );

      if (this.quizTypeID == 4 || this.quizTypeID == 6) {
        let lastResultIndex = this.overAllResultData.length - 1;
        let overallMinScore = this.overAllResultData[0]["MinScore"] + resultIndex;
        let overallMaxScore = this.overAllResultData[lastResultIndex]["MaxScore"] - (lastResultIndex - resultIndex);

        if ((lastResultIndex + 1) >
          (this.overAllResultData[lastResultIndex]["MaxScore"] - this.overAllResultData[0]["MinScore"])
          || this.overAllResultData[lastResultIndex]["MaxScore"] == null) {
          overallMaxScore = this.overAllResultData[resultIndex]["MaxScore"];
        }

        if (+MinScore < overallMinScore || +MinScore > overallMaxScore ||
          (+MinScore > +MaxScore && (+MinScore != this.overAllResultData[resultIndex]["MinScore"]))) {
          MinScoreControl.setErrors({ rangeMisMatch: true });
        }
        else {
          this.removeErrorFromControl(MinScoreControl, "rangeMisMatch");
        }
        if (+MaxScore > overallMaxScore || +MaxScore < overallMinScore ||
          (+MinScore > +MaxScore && (+MaxScore != this.overAllResultData[resultIndex]["MaxScore"]))) {
          MaxScoreControl.setErrors({ rangeMisMatch: true });
        }
        else {
          this.removeErrorFromControl(MaxScoreControl, "rangeMisMatch");
        }

        if(MinScore === "-"){
          MinScoreControl.setErrors({ rangeMisMatch: true });
        }
        if(MaxScore === "-"){
          MaxScoreControl.setErrors({ rangeMisMatch: true });
        }
      }

      else {
        let isMinUpperRangeInterrupt = this.isMinRangeInterrupted(
          MinScoreControl,
          MaxScoreControl,
          resultIndex,
          "upper"
        );
        let isMinLowerRangeInterrupt = this.isMinRangeInterrupted(
          MinScoreControl,
          MaxScoreControl,
          resultIndex,
          "lower"
        );
        let isRangeInvalid =
          MinScore &&
          MaxScore &&
          Number(MinScore) > Number(MaxScore) ||
          Number(MinScore) < resultIndex;
        if (isRangeInvalid) {
          MinScoreControl.setErrors({ rangeMisMatch: true });
          MaxScoreControl.setErrors({ rangeMisMatch: true });
        } else if (isMinUpperRangeInterrupt || isMinLowerRangeInterrupt) {
          MaxScoreControl.setErrors({ rangeMisMatch: true });
        } else {
          this.removeErrorFromControl(MinScoreControl, "rangeMisMatch");
          this.removeErrorFromControl(MaxScoreControl, "rangeMisMatch");
        }
      }
    });
  }

  isMinRangeInterrupted(minCon, maxCon, curIndex, type) {
    let maxRange = this.findMaxQuestionRange();
    let minRange = 0;
    let maxIndex = this.overAllResultData.length - 1;
    let minRI = false;
    if (type === "upper") {
      if (maxRange != 0) {
        minRI = (+minCon.value - 1) / (curIndex - 1) < 1;
      } else {
        minRI = false;
      }
    } else if (type === "lower") {
      if (maxRange != 0) {
        minRI = (maxRange - +maxCon.value) / (maxIndex - curIndex) < 1;
      } else {
        minRI = false;
      }
    }
    return minRI;
  }

  findMaxRange() {
    if (this.overAllResultData.length == 0) {
      return 0;
    }
    if (
      this.overAllResultData.length > 1 &&
      this.overAllResultData[this.overAllResultData.length - 1]["MaxScore"] == 0
    ) {
      return this.overAllResultData[this.overAllResultData.length - 1][
        "MinScore"
      ];
    } else {
      return this.overAllResultData[this.overAllResultData.length - 1][
        "MaxScore"
      ];
    }
  }

  findMaxQuestionRange() {
    if (this.overAllQuestionData.length == 0) {
      return 0;
    }

    else {
      return this.overAllQuestionData.length

    }
  }

  findCurrentResultIndex(resultId) {
    return this.overAllResultData.findIndex(result => {
      return result["ResultId"] === resultId;
    });
  }

  /**
   * *Removes errorName from the controls error
   * @param control FormControl
   * @param errorName Error to remove
   */
  private removeErrorFromControl(control, errorName) {
    let controlErrors = control.errors;
    if (controlErrors) {
      delete controlErrors[errorName];
      if (!Object.keys(controlErrors).length) {
        control.setErrors(null);
      } else {
        control.setErrors(controlErrors);
      }
    }
  }

  public questionDivisionArray = [];
  divideQuestionInResult(questionLength, resultLength) {
    this.questionDivisionArray = [];
    var questionStartCount = 0;
    var questionEndCount = -1;
    questionLength = questionLength;
    for (var i = resultLength; i >= 1; i--) {
      if (questionLength > 0) {
        var tempQuestionCount = Math.ceil(questionLength / i);
        questionStartCount = questionEndCount + 1;
        questionEndCount = questionStartCount + tempQuestionCount - 1;
        if (questionStartCount == questionEndCount) {
          this.questionDivisionArray.push({
            MinScore: questionEndCount,
            MaxScore: questionEndCount
          });
        } else {
          this.questionDivisionArray.push({
            MinScore: questionStartCount,
            MaxScore: questionEndCount
          });
        }
        questionLength = questionLength - tempQuestionCount;
      }
    }
    return this.questionDivisionArray;
  }
  
  public scoreDivisionArray = [];
  divideScoreInResult(score, length, num) {
    this.scoreDivisionArray = [];
    var sco = score;
    var len = length;
    var s;
    var min;
    if (num == 1) {
      min = this.overAllResultData[0]["MinScore"];
    }
    else {
      min = +this.rangeForm.controls.MaxScore.value + 1;
    }
    for (var i = 0; i < length; i++) {
      s = Math.ceil(sco / len);
      len--;
      sco = sco - s;
      this.scoreDivisionArray.push({
        MinScore: min,
        MaxScore: min + (s - 1)
      });
      min = min + s;
    }
    return this.scoreDivisionArray;
  }

  oldUpperScores(index) {
    this.scoreDivisionArray = [];
    for (var i = 0; i < index; i++) {
      this.scoreDivisionArray.push(
        {
          MinScore: this.overAllResultData[i]["MinScore"],
          MaxScore: this.overAllResultData[i]["MaxScore"]
        }
      );
    }
    return this.scoreDivisionArray;
  }

  oldLowerScores(index) {
    this.scoreDivisionArray = [];
    for (var i = index + 1; i < this.overAllResultData.length; i++) {
      this.scoreDivisionArray.push(
        {
          MinScore: this.overAllResultData[i]["MinScore"],
          MaxScore: this.overAllResultData[i]["MaxScore"]
        }
      );
    }
    return this.scoreDivisionArray;
  }

}
