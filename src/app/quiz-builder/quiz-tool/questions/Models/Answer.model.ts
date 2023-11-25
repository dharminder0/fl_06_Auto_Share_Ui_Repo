import { Category } from "./Category.model";

export class Answer {
    private AnswerId:Number;
    private AnswerText:String;
    private AnswerImage:String;
    private PublicIdForAnswer:String;
    private IsCorrectAnswer:boolean;
    private DisplayOrder:Number;
    private Categories:Category[] = [];

    constructor(answer:Object){
        for(let key in answer){
            if( key == "Categories"){
                answer["Categories"].forEach(category=>{
                    this.Categories.push(new Category(category));
                })
            }else{
                this[key] = answer[key];
            }
        }
    }

    update(anser:Object){
        
    }
}