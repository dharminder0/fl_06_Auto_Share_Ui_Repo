/**
 * @author : Renil Babu
 * 31st October 2018
 * @description : Any reusable data from api or any should be stored in this service so 
 * that any component can use the data. 
 * 
 */
import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class QuizBuilderDataService {

    /**
     * @description: Quiz Category List 
     */
    private quizCategoryList = []
    public categoryType;

    private quizHeader = new BehaviorSubject(undefined);
    currentQuizHeader = this.quizHeader.asObservable();

    public isQuizCoverTitleSubmission: string = '';
    public isQuizCoverTitleSubmissionObservable = new BehaviorSubject(this.isQuizCoverTitleSubmission);

    changeIsQuizCoverTitleSubmission() {
        this.isQuizCoverTitleSubmissionObservable.next(this.isQuizCoverTitleSubmission);
      }

    public isBranchingLogicSubmission: string = '';
    public isBranchingLogicSubmissionObservable = new BehaviorSubject(this.isBranchingLogicSubmission);

    changeBranchingLogicSubmission() {
        this.isBranchingLogicSubmissionObservable.next(this.isBranchingLogicSubmission);
    }

    public isBranchingLogicLinkSubmission: string = '';
    public isBranchingLogicLinkSubmissionObservable = new BehaviorSubject(this.isBranchingLogicLinkSubmission);

    changeBranchingLogicLinkSubmission() {
        this.isBranchingLogicLinkSubmissionObservable.next(this.isBranchingLogicLinkSubmission);
    }

    public isPreQuizCoverTitleSubmission: string = '';
    public isPreQuizCoverTitleSubmissionObservable = new BehaviorSubject(this.isPreQuizCoverTitleSubmission);

    changeIsPreQuizCoverTitleSubmission() {
        this.isPreQuizCoverTitleSubmissionObservable.next(this.isPreQuizCoverTitleSubmission);
    }


    public isQuizConfigurationMenuSubmission: string = '';
    public isQuizConfigurationMenuSubmissionObservable = new BehaviorSubject(this.isQuizConfigurationMenuSubmission);

    changeQuizConfigurationMenuSubmission() {
        this.isQuizConfigurationMenuSubmissionObservable.next(this.isQuizConfigurationMenuSubmission);
    }

    public isStyleTabSubmission: string = '';
    public isStyleTabSubmissionObservable = new BehaviorSubject(this.isStyleTabSubmission);

    changeStyleTabSubmission() {
        this.isStyleTabSubmissionObservable.next(this.isStyleTabSubmission);
    }

    changeQuizHeader(message:any){
        this.quizHeader.next(message)
    }

    private quizSaveAll = new BehaviorSubject(undefined);
    currentQuizSaveAll = this.quizSaveAll.asObservable();

    changeQuizSaveAll(message:any){
        this.quizSaveAll.next(message)
    }

    private quizWhatsappSave = new BehaviorSubject(undefined);
    currentWhatsappSave = this.quizWhatsappSave.asObservable();

    changeQuizWhatsappSave(message:any){
        this.quizWhatsappSave.next(message)
    }

    /** Set Category List */
    setQuizCategoryList(quizCategoryList) {
        this.quizCategoryList = quizCategoryList;
    }

    /** Get Category List */
    getQuizCategoryList() {
        return this.quizCategoryList;
    }

    setCategotyType(category)
    {
        this.categoryType = category;
    }

    getCategoryType()
    {
        return this.categoryType;
    }

    constructor() { }


}