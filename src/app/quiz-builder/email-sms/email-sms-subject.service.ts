import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs';
@Injectable()

export class EmailSmsSubjectService{
    public addedHsmTemplateId: number;
    public clientWhatsappTemplates = {};
    public clientLanguageListByType = [];
    public addedTemplateParameters: any = [];
    public languageNameByCode: any = {};
    public defualtLanguageCode: string = 'nl-NL';

    public editWhatsAppTemplate: boolean = false;
    public editWhatsAppTemplateObservable = new BehaviorSubject(this.editWhatsAppTemplate);
    
    callForEditCase(){
        this.editWhatsAppTemplateObservable.next(this.editWhatsAppTemplate);
    }

    private isNotificationType = new BehaviorSubject(false);
    currentNotificationType = this.isNotificationType.asObservable();
    private isTemplateId = new BehaviorSubject(undefined);
    currentTemplateId = this.isTemplateId.asObservable();
    private isTemplateName = new BehaviorSubject(undefined);
    currentTemplateName = this.isTemplateName.asObservable();
    private isSearchSection = new BehaviorSubject(false);
    currentSearchSection = this.isSearchSection.asObservable();
    private isDeletedTemplateId = new BehaviorSubject(undefined);
    currentDeletedTemplateId = this.isDeletedTemplateId.asObservable();

    constructor() { }
    
    changeNotificationType(message:any){
        this.isNotificationType.next(message)
    }
    changeTemplateId(message:any){
        this.isTemplateId.next(message)
    }
    changeTemplateName(message:any){
        this.isTemplateName.next(message)
    }
    changeSearchSection(message:any){
        this.isSearchSection.next(message)
    }
    changeDeletedTemplateId(message:any){
        this.isDeletedTemplateId.next(message)
    }

    public sharedWithMeSubjcet: Subject<any> = new Subject();

    /**
     * 
     * @param data boolean
     * Set SharedWithMe in subject
     */
    setSharedWithMe(data){
        this.sharedWithMeSubjcet.next(data);
    }

    public officeIdSubject: Subject<any> = new Subject();

    /**
     * 
     * @param id Integer
     * Set OfficeId in subject
     */
    setOfficeId(id){
        this.officeIdSubject.next(id); 
        // localStorage.setItem("officeId", id);
    }

    public notificationType = 2;
    public notificationTypesSubject: Subject<any> = new Subject();

    /**
     * 
     * @param type Integer
     * Set Notification Type
     */
    setNotificationType(type){
        this.notificationType = type;
        this.notificationTypesSubject.next(type);
    }

    getNotificationType(){
        return this.notificationType;
    }

    public templateIdSubject: Subject<any> = new Subject();

    /**
     * 
     * @param id Integer
     * Set Template id in subject
     */
    setTemplateId(id){
        this.templateIdSubject.next(id);
    }

    public updateTemplateSubject: Subject<any> = new Subject();
    /**
     * 
     * @param bool boolean
     * set boolean when a new Template added
     */
    setAddNewTemplate(bool){
        this.updateTemplateSubject.next(bool);
    }

    public sharedWithMe = false;
    /**
     * 
     * @param bool boolean
     * Set SharedWithMe
     */
    setShared(bool){
        this.sharedWithMe = bool;
    }
    
    /** 
     * return boolean type shared with me
    */
    getShared(){
        return this.sharedWithMe;
    }

}