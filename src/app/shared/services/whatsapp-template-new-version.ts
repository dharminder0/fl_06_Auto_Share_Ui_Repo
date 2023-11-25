import { Injectable } from "@angular/core";
import { QuizBuilderApiService } from "../../quiz-builder/quiz-builder-api.service";

@Injectable()
export class WhatsappTemplateNewVersionService {

    public languageNameByCode: any = {};
    public clientWhatsappTemplates = {};
    public clientLanguageListByType = [];
    public defualtLanguageCode: string = 'nl-NL';
    public addedTemplateParameters: any = [];
    public addedHsmTemplateId: number;
    public quizId:any;
    public selectedTemplateObj:any = {};

    constructor(private quizBuilderApiService: QuizBuilderApiService){}

    getAllLanguageList(){
        this.quizBuilderApiService.getAllLanguageListAutomation('chatbot').subscribe(response => {
            if(response.data && response.data.length > 0){
                response.data.map(langObj =>{
                    this.languageNameByCode[langObj.code] = langObj.name;
                })
            }
        });
    }

}