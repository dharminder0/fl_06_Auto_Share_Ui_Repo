
export class Tag{
    private TagId:Number;
    private TagName:String;

    constructor(tag:object){
        for(var key in tag){
            this[key] = tag[key];
        }
    }
}