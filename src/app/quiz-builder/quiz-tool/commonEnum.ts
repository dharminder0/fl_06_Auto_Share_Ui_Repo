export enum usageTypeEnum {
    WebFlow = 1, 
    Chatbot = 2, 
    WhatsApp_Chatbot = 3
}

export enum quizTypeEnum {
    Nps = 1, 
    Assessment = 2, 
    Personality = 3,
    Score = 4
}

export enum answerTypeEnum {
    singleSelect = 1,
    multiSelect = 2,
    smallText = 3,
    largeText = 4,
    dateOfBirth = 5,
    driversLicense = 6,
    fullAddress = 7,
    postCode = 8,
    lookingForJob = 9,
    nps = 10,
    ratingEmoji = 11,
    ratingStar = 12,
    availability = 13
}

export enum QuizAnswerStructureType {
    default = 0,
    list = 1,
    button = 2
}

export enum elementReorderKey{
    title = 'title',
    media = 'media',
    description = 'description',
    descriptionMedia = 'description media',
    question = 'question',
    button = 'button'
}

export enum elementDisplayOrder{
    title = 1,
    media = 2,
    description = 3,
    descriptionMedia = 4,
    coverOrResultButton = 4,
    question = 5,
    button = 6
}

export enum enableItemPage{
    cover_page = 'cover_page',
    content_page = 'content_page',
    question_page = 'question_page',
    question_des_page = 'question_des_page',
    content_title_page = 'content_title_page',
    content_des_page = 'content_des_page',
    result_page = 'result_page'
}

export enum BranchingLogicEnum{
    START = 1,
    QUESTION = 2,
    ANSWER = 3,
    RESULT = 4,
    RESULTNEXT = 5,
    CONTENT = 6,
    CONTENTNEXT = 7,
    ACTION = 8,
    ACTIONNEXT = 9,
    NONE = 10,
    BADGE = 11,
    BADGENEXT = 12,
    QUESTIONNEXT = 13,
    COVERDETAILS = 14,
    WHATSAPPTEMPLATE = 15,
    WHATSAPPTEMPLATEACTION = 16
}

export enum CommunicationModes {
    EmailTemplateMsg = "emailMsg",
    SmsTemplateMsg = "smsMsg",
    WhatsappTemplateMsg = "whatsappMsg",
}

export enum BrandingLanguage {
    Dutch = 1,
    English = 2,
    Polish = 3
}