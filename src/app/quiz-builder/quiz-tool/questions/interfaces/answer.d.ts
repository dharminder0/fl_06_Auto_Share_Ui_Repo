import { category } from "./category";

export interface answer{
    AnswerId:Number;
    AnswerText:String;
    AnswerImage:String;
    PublicIdForAnswer:String;
    IsCorrectAnswer:boolean;
    DisplayOrder:Number;
    Categories:category[];
}