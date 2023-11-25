import { quizTypeEnum, usageTypeEnum } from "../commonEnum";

export class QuestionHelperUtil{
    public answerTypeArray = [
        {label: "ONLY_ONE_CORRECT_ANSWER", value: "1", allowQuizType : [quizTypeEnum.Nps,quizTypeEnum.Assessment,quizTypeEnum.Personality,quizTypeEnum.Score], allowUsageType : [usageTypeEnum.WebFlow,usageTypeEnum.Chatbot,usageTypeEnum.WhatsApp_Chatbot], isSalesForce: true},
        // {label: "MULTIPLE_CORRECT_ANSWER", value: "2", allowQuizType : [quizTypeEnum.Nps,quizTypeEnum.Assessment,quizTypeEnum.Personality,quizTypeEnum.Score], allowUsageType : [usageTypeEnum.WebFlow,usageTypeEnum.Chatbot,usageTypeEnum.WhatsApp_Chatbot]},
        {label: "MULTIPLE_CORRECT_ANSWER", value: "2", allowQuizType : [quizTypeEnum.Nps,quizTypeEnum.Assessment,quizTypeEnum.Personality,quizTypeEnum.Score], allowUsageType : [usageTypeEnum.WebFlow,usageTypeEnum.Chatbot], isSalesForce: true},
        {label: "FREE_TEXT_SMALL", value: "3", allowQuizType : [quizTypeEnum.Nps,quizTypeEnum.Assessment], allowUsageType : [usageTypeEnum.WebFlow,usageTypeEnum.Chatbot], isSalesForce: true},
        {label: "FREE_TEXT_LARGE", value: "4", allowQuizType : [quizTypeEnum.Nps,quizTypeEnum.Assessment], allowUsageType : [usageTypeEnum.WebFlow,usageTypeEnum.Chatbot,usageTypeEnum.WhatsApp_Chatbot], isSalesForce: true},        
        // {label: "DATE_OF_BIRTH", value: "5", allowQuizType : [quizTypeEnum.Nps,quizTypeEnum.Assessment,quizTypeEnum.Personality,quizTypeEnum.Score], allowUsageType : [usageTypeEnum.WebFlow,usageTypeEnum.Chatbot,usageTypeEnum.WhatsApp_Chatbot]},
        {label: "DATE_OF_BIRTH", value: "5", allowQuizType : [quizTypeEnum.Nps,quizTypeEnum.Assessment,quizTypeEnum.Personality,quizTypeEnum.Score], allowUsageType : [usageTypeEnum.WebFlow,usageTypeEnum.Chatbot], isSalesForce: true},
        // {label: "DRIVERS_LICENSE", value: "6", allowQuizType : [quizTypeEnum.Nps,quizTypeEnum.Assessment,quizTypeEnum.Personality,quizTypeEnum.Score], allowUsageType : [usageTypeEnum.WebFlow,usageTypeEnum.Chatbot,usageTypeEnum.WhatsApp_Chatbot]},
        {label: "DRIVERS_LICENSE", value: "6", allowQuizType : [quizTypeEnum.Nps,quizTypeEnum.Assessment,quizTypeEnum.Personality,quizTypeEnum.Score], allowUsageType : [usageTypeEnum.WebFlow,usageTypeEnum.Chatbot], isSalesForce: false},
        // {label: "FULL_ADDRESS", value: "7", allowQuizType : [quizTypeEnum.Nps,quizTypeEnum.Assessment,quizTypeEnum.Personality,quizTypeEnum.Score], allowUsageType : [usageTypeEnum.WebFlow,usageTypeEnum.Chatbot,usageTypeEnum.WhatsApp_Chatbot]},
        {label: "FULL_ADDRESS", value: "7", allowQuizType : [quizTypeEnum.Nps,quizTypeEnum.Assessment,quizTypeEnum.Personality,quizTypeEnum.Score], allowUsageType : [usageTypeEnum.WebFlow,usageTypeEnum.Chatbot], isSalesForce: false},
        // {label: "POST_CODE", value: "8", allowQuizType : [quizTypeEnum.Nps,quizTypeEnum.Assessment,quizTypeEnum.Personality,quizTypeEnum.Score], allowUsageType : [usageTypeEnum.WebFlow,usageTypeEnum.Chatbot,usageTypeEnum.WhatsApp_Chatbot]},
        {label: "POST_CODE", value: "8", allowQuizType : [quizTypeEnum.Nps,quizTypeEnum.Assessment,quizTypeEnum.Personality,quizTypeEnum.Score], allowUsageType : [usageTypeEnum.WebFlow,usageTypeEnum.Chatbot], isSalesForce: true},
        // {label: "LOOKING_FOR_JOBS", value: "9", allowQuizType : [quizTypeEnum.Nps,quizTypeEnum.Assessment,quizTypeEnum.Personality,quizTypeEnum.Score], allowUsageType : [usageTypeEnum.WebFlow,usageTypeEnum.Chatbot,usageTypeEnum.WhatsApp_Chatbot]},
        {label: "LOOKING_FOR_JOBS", value: "9", allowQuizType : [quizTypeEnum.Nps,quizTypeEnum.Assessment,quizTypeEnum.Personality,quizTypeEnum.Score], allowUsageType : [usageTypeEnum.WebFlow,usageTypeEnum.Chatbot], isSalesForce: false},
        {label: "NPS", value: "10", allowQuizType : [quizTypeEnum.Nps], allowUsageType : [usageTypeEnum.WebFlow,usageTypeEnum.Chatbot,usageTypeEnum.WhatsApp_Chatbot], isSalesForce: true},
        {label: "RATING_EMOJI_ANSWER", value: "11", allowQuizType : [quizTypeEnum.Nps,quizTypeEnum.Assessment,quizTypeEnum.Personality,quizTypeEnum.Score], allowUsageType : [usageTypeEnum.WebFlow,usageTypeEnum.Chatbot,usageTypeEnum.WhatsApp_Chatbot], isSalesForce: true},
        {label: "RATING_STARTS_ANSWER", value: "12", allowQuizType : [quizTypeEnum.Nps,quizTypeEnum.Assessment,quizTypeEnum.Personality,quizTypeEnum.Score], allowUsageType : [usageTypeEnum.WebFlow,usageTypeEnum.Chatbot,usageTypeEnum.WhatsApp_Chatbot], isSalesForce: true},
        {label: "Lbl_AVAILABILITY", value: "13", allowQuizType : [quizTypeEnum.Nps,quizTypeEnum.Assessment,quizTypeEnum.Personality,quizTypeEnum.Score], allowUsageType : [usageTypeEnum.WebFlow,usageTypeEnum.WhatsApp_Chatbot], isSalesForce: true}
    ];
}