export class Config {
    // properties
    apiUrl: string;
    ApiSecret: string;
    AppointmentApiSecret: string;
    appointmentApiUrl: string;
    loginUrl: string;
    logoutUrl: string;
    mediaSiteUrl:string;
    disableMedia:boolean;
    WebUrl: string;
    appointmentSlotUrl:string;
    coreUrl:string;
    automationApiUrl: string;
    enableWhatsAppTemplate:boolean;
    isQuizVarPopupEnable:boolean;
    // constructor
    constructor() {
        // set default values first
        this.apiUrl = "";
        this.ApiSecret = "";
        this.appointmentApiUrl="";
        this.AppointmentApiSecret="";
        this.loginUrl = "";
        this.logoutUrl = "";
        this.mediaSiteUrl= "";
        this.disableMedia=false;
        this.WebUrl = "";
        this.appointmentSlotUrl = "";
        this.coreUrl = "";
        this.automationApiUrl = "";
        this.enableWhatsAppTemplate = false;
        this.isQuizVarPopupEnable = false;
        try {
            // try to load JSON configuration file
            var config = require('./config.json');

            // parse SSO section (if any)
            if (config.hasOwnProperty('sso')) {
                var apiConfig = config['sso'];

                // read login (if any)
                if (apiConfig.hasOwnProperty('login')) {
                    this.loginUrl = apiConfig['login'];
                }
                if (apiConfig.hasOwnProperty('logout')) {
                    this.logoutUrl = apiConfig['logout'];
                }
            }
            if (config.hasOwnProperty('AppointmentApiURL')) {
                this.appointmentApiUrl = config['AppointmentApiURL'];
            }

            if (config.hasOwnProperty('AutomationApiSecret')) {
                this.ApiSecret = config['AutomationApiSecret'];
            }
            if (config.hasOwnProperty('AppointmentApiSecret')) {
                this.AppointmentApiSecret = config['AppointmentApiSecret'];
            }
            if (config.hasOwnProperty('MediaSiteUrl')) {
                this.mediaSiteUrl = config['MediaSiteUrl'];
            }
            if (config.hasOwnProperty('DisableMedia')) {
                this.disableMedia = config['DisableMedia'];
            }
            if (config.hasOwnProperty('WebUrl')) {
                this.WebUrl = config['WebUrl'];
            }
            if (config.hasOwnProperty('AppointmentSlotUrl')) {
                this.appointmentSlotUrl = config['AppointmentSlotUrl'];
            }
            if (config.hasOwnProperty('CoreUrl')) {
                this.coreUrl = config['CoreUrl'];
            }
            if (config.hasOwnProperty('AutomationApiURL')) {
                this.automationApiUrl = config['AutomationApiURL'];
            }
            if(config.hasOwnProperty("EnableWhatsAppTemplate")){
                this.enableWhatsAppTemplate = config["EnableWhatsAppTemplate"]
            }
            if (config.hasOwnProperty('isQuizVarPopupEnable')) {
                this.isQuizVarPopupEnable = config['isQuizVarPopupEnable'];
            }
        } catch (e) {
            console.log('No config.json found - using default values');
        }
    }
}


export class FroalaConfig {
    froalaKey : string;
    constructor(){
        this.froalaKey = ''
        let froalaConfig = require('./config.json');
        if(froalaConfig.hasOwnProperty('FroalaEditorKey')){
            this.froalaKey = froalaConfig.FroalaEditorKey;
        }
    }
}