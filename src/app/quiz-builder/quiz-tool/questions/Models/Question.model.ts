import { Answer } from "./Answer.model";

export class Question{
    private QuestionId:Number;
    private ShowAnswerImage:boolean;
    private QuestionTitle:String;
    private QuestionImage:String;
    private PublicIdForQuestion:String;
    private ShowQuestionImage:String;
    private DisplayOrder:Number;
    private AnswerList:Answer[] = [];
    private CorrectAnswerExplanation:String;
    private RevealCorrectAnswer:boolean;
    private AliasTextForCorrect:String;
    private AliasTextForIncorrect:String;
    private AliasTextForYourAnswer:String;
    private AliasTextForCorrectAnswer:String;
    private AliasTextForExplanation:String;
    private AliasTextForNextButton:String;

    constructor(quizData:Object){
        for(let key in quizData){
            if(key == "AnswerList"){
                quizData["AnswerList"].forEach(answer=>{
                    this["AnswerList"].push(new Answer(answer));
                })
            }else{
                this[key] = quizData[key];
            }    
        }
    }

    public addAnswer(answer:Answer){
        this.AnswerList.push(new Answer(answer));
    }

    public removeAnswer(index:number):void{
        let isOutOfBound:boolean = index > this.AnswerList.length;
        if(isOutOfBound){
            throw new Error("Index Out of Bound");
        }else{
            this.AnswerList.splice(index,1);
        }
    }

    public updateAnswer(index:number, newAnswer:Answer):void{
        let oldAnswer:Answer = this.AnswerList[index];
        try{
            oldAnswer.update(newAnswer);
        }catch(e){
        }
        
    }
    
}