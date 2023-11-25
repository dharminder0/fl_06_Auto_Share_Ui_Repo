import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { DragulaService } from "ng2-dragula";
import { QuizBuilderApiService } from "../../../../quiz-builder/quiz-builder-api.service";
import { DynamicMediaReplaceMentsService } from "../../dynamic-media-replacement";
import { rightMenuEnum } from "../../rightmenu-enum/rightMenuEnum";


@Component({
    selector: 'app-answer-reorder',
    templateUrl: './answer-reorder.component.html',
    styleUrls: ['./answer-reorder.component.css']
  })
  export class AnswerReorderComponent implements OnInit, OnDestroy{
    @Output() answerReorderObj: EventEmitter<any> = new EventEmitter<any>();
    public dragulaSubscription;
    public questionData;
    public reOrderList:any = [];

      constructor(private dragulaService: DragulaService,
        private quizBuilderApiService: QuizBuilderApiService,
        private dynamicMediaReplaceService:DynamicMediaReplaceMentsService){
        const answerBag: any = this.dragulaService.find('answer-bag');
        if (answerBag !== undefined ) this.dragulaService.destroy('answer-bag');
        this.dragulaService.setOptions('answer-bag', { revertOnSpill: true }); 
        this.dragulaSubscription = dragulaService.dropModel.subscribe((value:any) => {
            this.onDropModel(value);
        });
      }

      private onDropModel(args:any) {
        if(args && args.length > 0 && args.includes('answer-bag')){
          this.reOrderingAnswerList();
        }
      }

      reOrderingAnswerList(){
        this.reOrderList = [];
        if(this.questionData && this.questionData.AnswerList && this.questionData.AnswerList.length > 0){
          this.questionData.AnswerList.map((group,index) => {
            this.reOrderList.push({
              "DisplayOrder" : index + 1,
              "AnswerId":group.AnswerId
            });
          });
        }
        let paramObj = {
          'QuestionId': this.questionData.QuestionId,
          'Answers':this.reOrderList
        }
        this.quizBuilderApiService.reorderAnswerInQuestionId(paramObj)
        .subscribe((data) => {
          this.answerReorderObj.emit(paramObj);
        }, (error) => {});
      }

      ngOnInit(){
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
        this.dragulaSubscription.unsubscribe()
        this.dragulaService.destroy('answer-bag');
      }

  }