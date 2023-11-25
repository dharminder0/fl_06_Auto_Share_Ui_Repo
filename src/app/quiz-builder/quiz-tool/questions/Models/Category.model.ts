import { Tag } from "./Tag.model";

export class Category{
    private CategoryName:String;
    private TagDetails:Tag[] = [];

    constructor(category:Object){
        for(let key in category){
            if( key == "TagDetails"){
                category["TagDetails"].forEach(tag=>{
                    this.TagDetails.push(new Tag(tag));
                })
            }else{
                this[key] = category[key];
            }
        }
    }
}