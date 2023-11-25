import { answer } from "./answer";

export interface question {
    QuestionId:Number;
    ShowAnswerImage:boolean;
    QuestionTitle:String;
    QuestionImage:String;
    PublicIdForQuestion:String;
    ShowQuestionImage:String;
    DisplayOrder:Number;
    AnswerList:answer[];
    CorrectAnswerExplanation:String;
    RevealCorrectAnswer:boolean;
    AliasTextForCorrect:String;
    AliasTextForIncorrect:String;
    AliasTextForYourAnswer:String;
    AliasTextForCorrectAnswer:String;
    AliasTextForExplanation:String;
    AliasTextForNextButton:String;
}

