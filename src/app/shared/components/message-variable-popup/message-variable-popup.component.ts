import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Config } from '../../../../config';
import { LoaderService } from '../../loader-spinner';
import { AvailablestepsService } from '../../services/availablesteps.service';
import { UserInfoService } from '../../services/security.service';
import { SharedService } from '../../services/shared.service';
import { VariablePopupService } from '../../services/variable-popup.service';
@Component({
  selector: 'app-message-variable-popup',
  templateUrl: './message-variable-popup.component.html',
  styleUrls: ['./message-variable-popup.component.scss']
})
export class MessageVariablePopupComponent implements OnInit {
  @Output() updateIsOpenPopup: EventEmitter<boolean> = new EventEmitter();

  public userInfo:any = {};
  public enabledPermissions:any = {};
  public clientCode:string = "";
  public config = new Config();
  
  public isOpenPopup: boolean;
  public isLoaderEnable:boolean = false;
  public showExtVariablePopup:boolean = false;
  public allowedVariblesFor: string;
  public listOfUsedVariableObj: Array<any>;
  public variableCategories: any = [];
  private variablePopupPayload$: Subscription;
  public selectedVariableCategoryCode: string = '';
  public selectedVaribles: any = [];
  public communicationTypeOpened: string = "";
  public extVariablePopupOrgUrl: string = "";
  public extVariablePopupUrl: string = "";

  constructor(
    private availableSteps: AvailablestepsService,
    private loaderService: LoaderService,
    private sharedService: SharedService,
    private userInfoService: UserInfoService,
    private variablePopupService: VariablePopupService
  ) { 
    this.userInfo = this.userInfoService._info;
    this.enabledPermissions = JSON.parse(JSON.stringify(this.userInfoService.userPermissions));
    this.clientCode = this.sharedService.getCookie("clientCode");
  }

  ngOnDestroy(): void {
    this.variablePopupPayload$.unsubscribe();
  }

  ngOnInit() {
    if(this.enabledPermissions.isJRSalesforceEnabled && this.userInfo.AccountLoginType == 'salesforce' && this.enabledPermissions.isNewVariablePopupEnabled){
      this.addJrVaraiablePopupListener();
      this.showExtVariablePopup = true;
      let allowedVariableCategories:Array<string> = ["lead","contact","automation","vacancy","recruiter"];
      this.extVariablePopupOrgUrl = `${this.config.coreUrl}/variablePopup?multiple=true&fetchDspName=true&entityFilter=${allowedVariableCategories.join()}&clientcode=${this.clientCode}`;
    }


    this.variableCategories = JSON.parse(JSON.stringify(this.availableSteps.messageVariablesCategory));

    this.variablePopupPayload$ = this.variablePopupService.variablePopupPayload$.subscribe((payload)=>{
      this.variableCategories = JSON.parse(JSON.stringify(this.availableSteps.messageVariablesCategory));
      if(payload.isOpenPopup){
        if(this.showExtVariablePopup){
          this.loaderService.show();
          this.isLoaderEnable = true;
          let allowedVariableCategories:Array<string>;
          if(payload.allowedVariblesFor && (payload.allowedVariblesFor === 'tag' || payload.allowedVariblesFor === 'quiz')){
            let updatedUrl = new URL(this.extVariablePopupOrgUrl);
            if(payload.allowedVariblesFor === 'tag'){
              allowedVariableCategories = ["lead","contact"];
              updatedUrl.searchParams.set('multiple','false');
              updatedUrl.searchParams.set('usageFeature', 'syncSalesforce');
            }
            if(payload.allowedVariblesFor === 'quiz'){
              allowedVariableCategories = ["lead","contact","vacancy"];
              updatedUrl.searchParams.set('multiple','true');
              updatedUrl.searchParams.set('usageFeature', 'automationmodule');
            }
            if(payload.fetchDspName){
              updatedUrl.searchParams.set('fetchDspName','true');
            }
            updatedUrl.searchParams.set('entityFilter', allowedVariableCategories.join());
            this.extVariablePopupUrl = decodeURIComponent(updatedUrl.href);
          }else{
            let updatedUrl = new URL(this.extVariablePopupOrgUrl);
            if(payload.allowedVariblesFor == "automation"){
              updatedUrl.searchParams.set('usageFeature', 'automationmodule');
            }
            this.extVariablePopupUrl = decodeURIComponent(updatedUrl.href);
          }

          if(payload.listOfUsedVariableObj && payload.listOfUsedVariableObj.length > 0){
            let temp:any = {};
            let entityName:any = {};
            let fieldName:any = {};
            let oldVarsObj:any = {};

            payload.listOfUsedVariableObj.map((itemObj:any) => {
              if(itemObj.formula.indexOf(".") > 0){
                entityName = `${itemObj.formula.replace(/\%/g,'').split('.')[0]}`;
                fieldName = `${itemObj.formula.replace(/\%/g,'').split('.')[1]}`;
                
                if(!temp[entityName]){
                  temp[entityName] = [];
                }
                temp[entityName].push(fieldName);
              }
              else{
                if(Object.keys(oldVarsObj).length <= 0){
                  this.variableCategories = JSON.parse(JSON.stringify(this.availableSteps.messageVariablesCategory));
                  
                  this.variableCategories.forEach((category:any) => {
                    if(category.variables.length > 0){
                      category.variables.map((subObj:any) => {
                        oldVarsObj[subObj.formula] = {
                          "entityName" : `${category.categoryCode}`,
                          "fieldName" : `${subObj.formula.replace(/\%/g,'')}`
                        }
                      });
                    }
                  });
                }

                if(oldVarsObj[itemObj.formula]){
                  if(!temp[oldVarsObj[itemObj.formula].entityName]){
                    temp[oldVarsObj[itemObj.formula].entityName] = [];
                  }
                  temp[oldVarsObj[itemObj.formula].entityName].push(oldVarsObj[itemObj.formula].fieldName);
                }
              }
            });
            this.extVariablePopupUrl = `${this.extVariablePopupUrl}&selectedVariables=${JSON.stringify(temp)}`;
          }

          if(payload.communicationType === "smsMsg" || payload.communicationType === "followUpMsg"){
            let variablesToRemove:any = {
              "recruiter" : "signature"
            };
            this.extVariablePopupUrl = `${this.extVariablePopupUrl}&removeVariables=${JSON.stringify(variablesToRemove)}`;
          }
        }
        else{
          this.listOfUsedVariableObj = payload.listOfUsedVariableObj;
          this.allowedVariblesFor = payload.allowedVariblesFor;
          this.communicationTypeOpened = payload.communicationType;
          this.filterVariablecategory(this.allowedVariblesFor);
          this.showVariableForSelectedCategory( this.variableCategories[0]);
        }
        let x = document.getElementsByTagName("BODY")[0];
        x.classList.add("overflow-hidden");
        this.isOpenPopup = payload.isOpenPopup;
      }
    });
  }

  filterVariablecategory(allowedVariblesFor: string){
    this.variableCategories = this.variableCategories.filter(category => {
      if(category.allowedflow && category.allowedflow.length > 0  && category.allowedflow.includes(allowedVariblesFor)){

        if(this.communicationTypeOpened && category.variables.length > 0){
          category.variables = category.variables.filter((subObj:any) => {
            if(!subObj.communicationTypeAllowed || subObj.communicationTypeAllowed.includes(this.communicationTypeOpened)){
              return subObj;
            }
          });
        }

        return this;
      }
    });
  }

  showVariableForSelectedCategory(category: any){
    this.selectedVariableCategoryCode = category.categoryCode;
    this.selectedVaribles = [...category.variables ];
  }
  selectFormulaOfVariable(variableObj: any){
    if(!this.listOfUsedVariableObj.includes(this.listOfUsedVariableObj.find(variable=>variable.formula === variableObj.formula))){
      this.listOfUsedVariableObj.push(variableObj);
    }else{
      this.listOfUsedVariableObj.splice(this.listOfUsedVariableObj.indexOf(this.listOfUsedVariableObj.find(variable=>variable.formula === variableObj.formula)),1);
    }
  }

  insertFormula(){
    this.isOpenPopup = false;
    this.variablePopupService.listOfUsedVariableObj = JSON.parse(JSON.stringify(this.listOfUsedVariableObj));    
    this.listOfUsedVariableObj = [];
    this.variablePopupService.variablePopupPayload = {};
    this.variablePopupService.changeInVariablePopupPayload();
    this.updateIsOpenPopup.emit(this.isOpenPopup);
  }

  closeVariablePopup(){
    let x = document.getElementsByTagName("BODY")[0];
    x.classList.remove("overflow-hidden")
    this.isOpenPopup = false;
    this.listOfUsedVariableObj = [];
    this.variablePopupService.variablePopupPayload = {};
    this.variablePopupService.changeInVariablePopupPayload();
  }
  insertActiveClass(variableObj): boolean{
    if(this.listOfUsedVariableObj && this.listOfUsedVariableObj.length > 0)
      return this.listOfUsedVariableObj.includes(this.listOfUsedVariableObj.find(variable=>variable.formula === variableObj.formula))
    else
      return false;
  }

  addJrVaraiablePopupListener(){
    // Detect data from variable popup
    let self = this;
    // get user info
    if (window.addEventListener) {
      window.addEventListener("message", onMessage, false);
    }
    function onMessage(event) {
      // Check sender origin to be trusted
      if (`${event.origin}` === self.config.coreUrl) {
        let data = event.data;
        if (data.message == 'save') {
          if(data.selectedVariables){
            self.isOpenPopup = false;
            self.variablePopupService.listOfUsedVariableObj = JSON.parse(data.selectedVariables);
            self.updateIsOpenPopup.emit(self.isOpenPopup);
            self.closeVariablePopup();
          }
        }
        else if (data.message == 'variableWindowLoader') {
          if(!data.isLoaderEnable){           
            self.loaderService.hide();
            self.isLoaderEnable = false;
          }
        }
        else if (data.message == 'cancel') {
          self.closeVariablePopup();
        }
      }
    }
  }

}
