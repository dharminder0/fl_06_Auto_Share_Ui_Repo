import { Component,OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, Input } from "@angular/core";
import { QuizBuilderDataService } from '../../quiz-builder-data.service';
import { Subscription } from "rxjs/Subscription";
import { ActivatedRoute, Router } from '@angular/router';
import { BrandingComponent } from '../branding/branding.component';
import { of } from 'rxjs';
import { DynamicMediaReplaceMentsService } from '../dynamic-media-replacement';
import { rightMenuEnum } from '../rightmenu-enum/rightMenuEnum';
import { BranchingLogicAuthService } from "../branching-logic-auth.service";

@Component({
    selector: "quiz-configuration-menu",
    templateUrl: "./quiz-configuration-menu.component.html",
    styleUrls: ["./quiz-configuration-menu.component.scss"]
})

export class QuizConfigurationMenuComponent implements OnInit {
    // @ViewChild("quizStyle", { read: ViewContainerRef, static: true })
    // quizStyle: ViewContainerRef;
    @Input() quizTypeId;
    @Input() isEnabled;
    public activeTab;
    public isQuizConfigrationSubscription: Subscription;
    public isStyleTabSubscription: Subscription;
    public quizId;
    public preSelectedTab:any;
    public isWhatsappEnable: boolean = false;
    private isWhatsappEnableSubscription: Subscription;

    constructor(private quizBuilderDataService:QuizBuilderDataService,
        private route: ActivatedRoute,
        private _crf: ComponentFactoryResolver,
        private dynamicMediaReplaceService:DynamicMediaReplaceMentsService,
        private branchingLogicAuthService: BranchingLogicAuthService,
        private router: Router){}

    ngOnInit(){
        this.route.params.subscribe(params => {
            this.quizId = +params["id"];
        });
        this.getWhatsappUsage();
        this.getQuizConfigrationTab();
        this.getStyleTabClose();
    }

    getWhatsappUsage(){
        this.isWhatsappEnableSubscription = this.dynamicMediaReplaceService.isUsageTypeWhatsAppObservable.subscribe(res =>{
          this.isWhatsappEnable = res;
        });
      }

    getQuizConfigrationTab(){
        this.isQuizConfigrationSubscription = this.quizBuilderDataService.isQuizConfigurationMenuSubmissionObservable.subscribe((item: any) => {
          this.activeTab = item?item:"Slides";
        });
      }

    onSelectTab(data){
        this.preSelectedTab=this.activeTab;
            this.quizBuilderDataService.isQuizConfigurationMenuSubmission=data;
            this.quizBuilderDataService.changeQuizConfigurationMenuSubmission();
        this.activeTab=data;
        if(data=='Slides' || data=='Settings'){
            if(this.isEnabled){
                this.router.navigate(['/quiz-builder/quiz-tool',this.quizId,'branching-logic']);
            }else if(!this.isWhatsappEnable){
             this.router.navigate(['/quiz-builder/quiz-tool',this.quizId,'cover']);
            }
        }
        if(data=='Styles'){
            this.quizBuilderDataService.isStyleTabSubmission='false';
        }
        if(this.dynamicMediaReplaceService.isOpenEnableMediaSetiing.isOpen == true){
        this.dynamicMediaReplaceService.isOpenEnableMediaSetiing={
            "isOpen":false,
            "menuType":rightMenuEnum.DynamicMedia
        };
        this.dynamicMediaReplaceService.changeOpenEnableMediaSetiingSubmission();
        }
    }

    getStyleTabClose(){
        this.isStyleTabSubscription = this.quizBuilderDataService.isStyleTabSubmissionObservable.subscribe((item: any) => {
            if(item){
                this.activeTab=this.preSelectedTab;
                this.quizBuilderDataService.isQuizConfigurationMenuSubmission=this.activeTab;
                this.quizBuilderDataService.changeQuizConfigurationMenuSubmission();
            }
        });
    }

    // onBranchingtabToStyle(){
    //         this.quizStyle.clear();
    //         var QUIZ_style = this._crf.resolveComponentFactory(
    //           BrandingComponent
    //         );
    //         var QUIZ_styleComponentRef = this.quizStyle.createComponent(
    //           QUIZ_style
    //         );
    // }

    onBack(){
        this.router.navigate(['/quiz-builder/explore']);
    }

    ngOnDestroy() {
        this.isQuizConfigrationSubscription.unsubscribe();
        this.isStyleTabSubscription.unsubscribe();
        this.isWhatsappEnableSubscription.unsubscribe();
    }

}