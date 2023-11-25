import { Injectable } from '@angular/core';
import { AvailablestepsService } from './availablesteps.service';
import { BehaviorSubject } from 'rxjs';
import { UserInfoService } from './security.service';

@Injectable({
  providedIn: 'root'
})
export class VariablePopupService {
  public userInfo:any = {};
  public enabledPermissions:any = {};
  public listOfUsedVariableObj: any = {};
  public regXForVarFormula: any = /%[a-z]+%/g;
  public variablePopupPayload: any = {};
  public variablePopupOpened: any = '';
  public variablePopupPayload$ = new BehaviorSubject(this.variablePopupPayload);

  constructor(
    private availablestepsService: AvailablestepsService,
    private userInfoService: UserInfoService,
  ) { 
    this.userInfo = this.userInfoService._info;
    this.enabledPermissions = JSON.parse(JSON.stringify(this.userInfoService.userPermissions));

    if(this.enabledPermissions.isJRSalesforceEnabled && this.userInfo.AccountLoginType == 'salesforce' && this.enabledPermissions.isNewVariablePopupEnabled){
      this.regXForVarFormula = /%(([a-zA-Z0-9_]\.){0,1}[a-zA-Z0-9_])+%/g
    }
  }

  changeInVariablePopupPayload(){
    this.variablePopupPayload$.next(this.variablePopupPayload);
  }

  getListOfUsedVariableFormulasInMsg(msg:any){
    let usedVariables:any = msg.match(this.regXForVarFormula);

    return usedVariables ? usedVariables : [];
  }

  getListOfUsedVariableObj(msg:any, usedVariables:Array<string> = []){
    let listOfUsedVariableFormula = msg ? (usedVariables.length > 0 ? usedVariables : this.getListOfUsedVariableFormulasInMsg(msg)) : [] ;
    let listOfUsedVariableObj:any = [];

    if(listOfUsedVariableFormula && listOfUsedVariableFormula.length > 0){
      let remainingVars:Array<string> = JSON.parse(JSON.stringify(listOfUsedVariableFormula));

      this.availablestepsService.messageVariablesCategory.map(category=>{
        category.variables.map(variable=>{
          if(listOfUsedVariableFormula && listOfUsedVariableFormula.includes(variable.formula)){
            listOfUsedVariableObj.push(variable);
            remainingVars.splice(remainingVars.indexOf(variable.formula),1);
          }
        })
      });

      if(this.enabledPermissions.isJRSalesforceEnabled && this.userInfo.AccountLoginType == 'salesforce' && this.enabledPermissions.isNewVariablePopupEnabled){
        remainingVars.map((itemObj:any) => {
          listOfUsedVariableObj.push({
            "formula" : itemObj,
            "title" : itemObj.replace(/%/g,"")
          });
        });
      }
    }

    return listOfUsedVariableObj;
  }

  insertFormulaIntoEditor(listOfVariableObjToBeUsed: any, templateFroala: any, existingVariablesList:Array<string> = []){
    let newVariables: any = [];
    let newVariableObj: any =  {};
    let msg: any;
    let listOfUsedVariableFormula: any = existingVariablesList.length > 0 ? existingVariablesList : (templateFroala.editorRefernce.html.get().match(this.regXForVarFormula)? templateFroala.editorRefernce.html.get().match(this.regXForVarFormula): []);
    if(listOfVariableObjToBeUsed && listOfVariableObjToBeUsed.length > 0){
      listOfVariableObjToBeUsed.map(varItem => {
        if(listOfUsedVariableFormula && !listOfUsedVariableFormula.includes(varItem.formula)){
          newVariables.push(varItem);
        }
      });
      
      let oldfroalContent = templateFroala.editorRefernce.html.get();
      templateFroala.editorRefernce.selection.restore();
      if(newVariables && newVariables.length > 0){
        newVariableObj = this.createVariableTagElements(newVariables);  
        // newVariableObj['dummySpace'] = ' ';
        templateFroala.editorRefernce.html.insert(Object.values(newVariableObj).join('&nbsp;'));
      }
      let newFroalaContent =  templateFroala.editorRefernce.html.get();
      let contentLengthInTemplateFroala = templateFroala.editorRefernce.el.innerText.length;
      let charCounterMax = templateFroala.editorOptions.charCounterMax;
      if(contentLengthInTemplateFroala <= charCounterMax){
         msg = newFroalaContent;
      }else{
         msg = oldfroalContent;
      }
      var doc = new DOMParser().parseFromString(msg, 'text/html');
      listOfUsedVariableFormula.map(formula =>{          
        if(!(listOfVariableObjToBeUsed && listOfVariableObjToBeUsed.includes(listOfVariableObjToBeUsed.find(variable=>variable.formula === formula)))){
            
          // if(this.variablePopupOpened == 'sms'){
          //   if(doc.getElementById('sms-'+formula)){
          //     doc.getElementById('sms-'+formula).remove();
          //     msg = doc.body.innerHTML;
          //   }
          // }else if(this.variablePopupOpened == 'followUp'){
          //   if(doc.getElementById('followUp-'+formula)){
          //     doc.getElementById('followUp-'+formula).remove();
          //     msg = doc.body.innerHTML;
          //   }
          // }else{
            if(doc.getElementById(formula)){
              doc.getElementById(formula).remove();
              msg = doc.body.innerHTML;
            }
          // }
        }
      });
        templateFroala.editorRefernce.html.set(msg);   
    }else{
      msg = templateFroala.editorRefernce.html.get();
      var doc = new DOMParser().parseFromString(msg, 'text/html');
      listOfUsedVariableFormula.map(formula =>{
        // if(this.variablePopupOpened == 'sms'){
        //   if(doc.getElementById('sms-'+formula)){
        //     doc.getElementById('sms-'+formula).remove();
        //     msg = doc.body.innerHTML;
        //   }
        // }else if(this.variablePopupOpened == 'followUp'){
        //   if(doc.getElementById('followUp-'+formula)){
        //     doc.getElementById('followUp-'+formula).remove();
        //     msg = doc.body.innerHTML;
        //   }
        // }
        // else{
          if(doc.getElementById(formula)){
            doc.getElementById(formula).remove();
            msg = doc.body.innerHTML;
          }
        // }
      });
      templateFroala.editorRefernce.html.set(msg);
    }
    setTimeout(() => {
      let editableonContainer;
      if(this.variablePopupOpened == 'sms'){
        editableonContainer = document.querySelector("#froala-editor-sms .fr-element");
      }else if(this.variablePopupOpened == 'followUp'){
        editableonContainer = document.querySelector("#froala-editor-followUp .fr-element");
      }else{
        editableonContainer = document.getElementsByClassName("fr-element");
      }
      let range = document.createRange();
      let sel = window.getSelection();
      if(newVariables && newVariables.length >0){
        let lastInsertEl;
        // if(this.variablePopupOpened == 'sms'){
        //   lastInsertEl = <Node> document.getElementById('sms-'+newVariables[newVariables.length-1].formula);
        // }else if(this.variablePopupOpened == 'followUp'){
        //   lastInsertEl = <Node> document.getElementById('followUp-'+newVariables[newVariables.length-1].formula);
        // }else{
          lastInsertEl = <Node> document.getElementById(newVariables[newVariables.length-1].formula);
        // }
        if(lastInsertEl){
          range.setStartAfter(lastInsertEl);
        }
      }else{        
        if(this.variablePopupOpened == 'sms'){
          range.setStartAfter(editableonContainer.lastChild);
        }else if(this.variablePopupOpened == 'followUp'){
          range.setStartAfter(editableonContainer.lastChild);
        }else{
          range.setStartAfter(editableonContainer[0].lastChild);
        }
      }
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      templateFroala.editorRefernce.events.focus(true);  
      newVariables = [];  
    }, 50);
    return msg;
  }

  createVariableTagElements(variableObj: Array<any>): Array<any>{
    let varNodeObject: any = {};
    variableObj.map(variable => {
      // if(this.variablePopupOpened == 'sms'){
      //   varNodeObject[variable.formula]= `<span class="fr-deletable d-inline-block" id="sms-${variable.formula}" contenteditable="false"><span class="editor-var-tag">${variable.title}</span></span>`;
      // }else if(this.variablePopupOpened == 'followUp'){
      //   varNodeObject[variable.formula]= `<span class="fr-deletable d-inline-block" id="followUp-${variable.formula}" contenteditable="false"><span class="editor-var-tag">${variable.title}</span></span>`;
      // }else{
        varNodeObject[variable.formula]= `<span class="fr-deletable d-inline-block" id="${variable.formula}" contenteditable="false"><span class="editor-var-tag">${variable.title}</span>&nbsp;</span>`;
      // }
    });
    return varNodeObject;
  }
  
  //get api data
  updateTemplateVariableIntoHTML(msg: string, listOfUsedVariableObj: any, type:any): string{
    if (msg) {
      if(type == 'sms' || type == 'followUp'){
        msg = msg.replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/\s/g,"&nbsp;");
      }
      msg = this.removeInlineCSSForParagraphStyle(msg);
      if (msg) {
        if (listOfUsedVariableObj && listOfUsedVariableObj.length > 0) {
          if (type == 'sms') {
            this.variablePopupOpened = 'sms';
          } else if (type == 'followUp') {
            this.variablePopupOpened = 'followUp';
          } else {
            this.variablePopupOpened = 'normal';
          }
          let variableNodeObjToDisplay = this.createVariableTagElements(listOfUsedVariableObj);
          listOfUsedVariableObj.map(variable => {
            let regx = new RegExp(variable.formula, "g");
            msg = msg.replace(regx, variableNodeObjToDisplay[variable.formula]);
          });
        } else {
          listOfUsedVariableObj = [];
        }
      }
    }
    return msg ? msg : '';
  }

   //send api data
   updateTemplateVarHTMLIntoVariable(msg:any, listOfUsedVariableObj:any, type:any): string{
    let msgtxt: string = msg ? msg : '';
    msgtxt = this.addInlineCSSForParagraphStyle(msgtxt);
    if(msgtxt){
      var doc = new DOMParser().parseFromString(msgtxt, 'text/html');
      if(listOfUsedVariableObj && listOfUsedVariableObj.length > 0){
        listOfUsedVariableObj.map(varItem =>{
          msgtxt = this.removeVariableHTMLStructure(msgtxt,varItem,doc,type);
        });
      }
    }
    return msgtxt;
  }

  removeVariableHTMLStructure(msgtxt:any, varItem:any, doc:any, type:any){
    let innerhtml;

    // if(doc.getElementById(varItem.formula) && type == 'body'){
    if(doc.getElementById(varItem.formula)){
      innerhtml = doc.getElementById(varItem.formula).innerHTML;
      let regexStringToRep:any = `<span(\\s)*class=(.)*editor-var-tag(.)*>${varItem.title}</span>&nbsp;`;
      let regxToRep = new RegExp(regexStringToRep, "g");
      innerhtml = innerhtml.replace(regxToRep,varItem.formula);
      doc.getElementById(varItem.formula).outerHTML = innerhtml;
      msgtxt = doc.body.innerHTML;
    }

    // if(doc.getElementById('sms-'+varItem.formula) && type == 'sms'){
    //   innerhtml = doc.getElementById('sms-'+varItem.formula).innerHTML;
    //   let regexStringToRep:any = `<span(\\s)*class=(.)*editor-var-tag(.)*>${varItem.title}</span>`;
    //   let regxToRep = new RegExp(regexStringToRep, "g");
    //   innerhtml = innerhtml.replace(regxToRep,varItem.formula);
    //   doc.getElementById('sms-'+varItem.formula).outerHTML = innerhtml;
    //   msgtxt = doc.body.innerHTML;
    // }
    // if(doc.getElementById('followUp-'+varItem.formula) && type == 'followUp'){
    //   innerhtml = doc.getElementById('followUp-'+varItem.formula).innerHTML;
    //   let regexStringToRep:any = `<span(\\s)*class=(.)*editor-var-tag(.)*>${varItem.title}</span>`;
    //   let regxToRep = new RegExp(regexStringToRep, "g");
    //   innerhtml = innerhtml.replace(regxToRep,varItem.formula);
    //   doc.getElementById('followUp-'+varItem.formula).outerHTML = innerhtml;
    //   msgtxt = doc.body.innerHTML;
    // }
    return msgtxt;
  }

  removeInlineCSSForParagraphStyle(msg:any): string{
    let auxMsg = msg;
    let doc = new DOMParser().parseFromString(auxMsg, 'text/html');
    let grayTxtNode = doc.querySelectorAll(".fr-text-gray");
    let spacedNode = doc.querySelectorAll(".fr-text-spaced");
    let borderedNode = doc.querySelectorAll(".fr-text-bordered");
    let uppercaseNode = doc.querySelectorAll(".fr-text-uppercase");
    if(grayTxtNode && grayTxtNode.length > 0){
      grayTxtNode.forEach((node:any)=>{       
          node.style.color = '';
      });
    }
    if(spacedNode && spacedNode.length > 0){
      spacedNode.forEach((node:any)=>{
          node.style.letterSpacing = '';
      });
    }
    if(uppercaseNode && uppercaseNode.length > 0){
      uppercaseNode.forEach((node:any)=>{
          node.style.textTransform = '';
      });
    }
    if(borderedNode && borderedNode.length > 0){
      borderedNode.forEach((node:any)=>{
          node.style.borderTop = '';
          node.style.borderBottom = '';
          node.style.padding = '';
      });
    }
    auxMsg = doc.body.innerHTML;
    return auxMsg;
  }

  addInlineCSSForParagraphStyle(msg:any): string{
    let auxMsg = msg;
    let doc = new DOMParser().parseFromString(auxMsg, 'text/html');
    let grayTxtNode = doc.querySelectorAll(".fr-text-gray");
    let spacedNode = doc.querySelectorAll(".fr-text-spaced");
    let borderedNode = doc.querySelectorAll(".fr-text-bordered");
    let uppercaseNode = doc.querySelectorAll(".fr-text-uppercase");
    if(grayTxtNode && grayTxtNode.length > 0){
      grayTxtNode.forEach((node:any)=>{
          node.style.color = '#AAA';
      });
    }
    if(spacedNode && spacedNode.length > 0){
      spacedNode.forEach((node:any)=>{
        node.style.letterSpacing = '1px';
      });
    }
    if(uppercaseNode && uppercaseNode.length > 0){
      uppercaseNode.forEach((node:any)=>{
        node.style.textTransform = 'uppercase';
      });
    }
    if(borderedNode && borderedNode.length > 0){
      borderedNode.forEach((node:any)=>{
        node.style.borderTop = '1px solid #222';
        node.style.borderBottom = '1px solid #222';
        node.style.padding = '10px 0';
      });
    }
    auxMsg = doc.body.innerHTML;
    return auxMsg;
  }

  // ============================== new version methods Starts==============================

  insertFormulaIntoEditorV2(listOfVariableObjToBeUsed: any, templateFroala: any){
    let newVariables: any = [];
    let newVariableObj: any =  {};
    let msg: any;
    let listOfUsedVariableFormula: any = templateFroala.editorRefernce.html.get().match(this.regXForVarFormulaV2)? templateFroala.editorRefernce.html.get().match(this.regXForVarFormulaV2): [];
    if(listOfVariableObjToBeUsed && listOfVariableObjToBeUsed.length > 0){
      listOfVariableObjToBeUsed.map(varItem => {
        let tempVarItem = varItem;
        tempVarItem.formula = tempVarItem.formula.replace(/^%/g,'{{').replace(/%$/g,'}}');
        if(listOfUsedVariableFormula && !listOfUsedVariableFormula.includes(tempVarItem.formula)){
          newVariables.push(tempVarItem);
        }
      });
      
      let oldfroalContent = templateFroala.editorRefernce.html.get();

      templateFroala.editorRefernce.selection.restore();

      if(newVariables && newVariables.length > 0){
        newVariableObj = this.createVariableTagElementsV2(newVariables);
        templateFroala.editorRefernce.html.insert(Object.values(newVariableObj).join('&nbsp;'));
      }
     
      let newFroalaContent =  templateFroala.editorRefernce.html.get();
      
      let contentLengthInTemplateFroala = templateFroala.editorRefernce.charCounter.count();
      let charCounterMax = templateFroala.editorOptions.charCounterMax;
      /**
       * @ssCharCounterCount is custom counter enable
       */
      if(templateFroala.editorOptions.ssCharCounterCount){
        contentLengthInTemplateFroala = templateFroala.editorRefernce.ssCharCounter.count();
        charCounterMax = templateFroala.editorOptions.ssCharCounterMax;
      }
      
      if(contentLengthInTemplateFroala <= charCounterMax){
         msg = newFroalaContent;
      }else{
         msg = oldfroalContent;
      }

      var doc = new DOMParser().parseFromString(msg, 'text/html');
      listOfUsedVariableFormula.map(formula =>{          
        if(!(listOfVariableObjToBeUsed && listOfVariableObjToBeUsed.includes(listOfVariableObjToBeUsed.find(variable=>variable.formula === formula)))){
          if(doc.getElementById(formula)){
            doc.getElementById(formula).remove();
            msg = doc.body.innerHTML;
          }            
        }
      });
        
      templateFroala.editorRefernce.html.set(msg);

    }else{
      msg = templateFroala.editorRefernce.html.get();
      var doc = new DOMParser().parseFromString(msg, 'text/html');
      listOfUsedVariableFormula.map(formula =>{        
        if(doc.getElementById(formula)){
          doc.getElementById(formula).remove();
          msg = doc.body.innerHTML;
        }        
      });
      templateFroala.editorRefernce.html.set(msg);
    }
    setTimeout(() => {
      let editableonContainer;
      editableonContainer = document.getElementsByClassName("fr-element");      
      let range = document.createRange();
      let sel = window.getSelection();
      if(newVariables && newVariables.length >0){
        let lastInsertEl;
        lastInsertEl = <Node> document.getElementById(newVariables[newVariables.length-1].formula);
        if(lastInsertEl){
          range.setStartAfter(lastInsertEl);
        }
      }else{        
        range.setStartAfter(editableonContainer[0].lastChild);        
      }
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      templateFroala.editorRefernce.events.focus(true);  
      newVariables = [];  
    }, 50);
    return msg;
  }

  createVariableTagElementsV2(variableObj: Array<any>): Array<any>{
    let varNodeObject: any = {};
    variableObj.map(variable => {  
      // varNodeObject[variable.formula]= `<span class="fr-deletable d-inline-block" id="${variable.formula}" contenteditable="false"><span class="editor-var-tag">${variable.title}</span>&nbsp;</span>`;

      varNodeObject[variable.formula]= `<input readonly 
                                        style="padding: 0px 5px; 
                                               border-radius: 15px; 
                                               border: 1px solid; 
                                               border-color: inherit; 
                                               margin: 0 1px 5px 1px; 
                                               pointer-events: none; 
                                               background: inherit; 
                                               text-align: center;"
                                        size="${variable.title.length+1}" 
                                        id="${variable.formula}" 
                                        value="${variable.title}">`;  
    });
    return varNodeObject;
  }

  removeVariableHTMLStructureV2(msgtxt:any, varItem:any){
    let innerhtml;    
    var doc = new DOMParser().parseFromString(msgtxt, 'text/html');
    // if(doc.getElementById(varItem.formula)){
    //   innerhtml = doc.getElementById(varItem.formula).innerHTML;
    //   let regexStringToRep:any = `<span(\\s)*class=(.)*editor-var-tag(.)*>${varItem.title}</span>&nbsp;`;
    //   let regxToRep = new RegExp(regexStringToRep, "g");
    //   innerhtml = innerhtml.replace(regxToRep,varItem.formula);
    //   doc.getElementById(varItem.formula).outerHTML = innerhtml;
    //   msgtxt = doc.body.innerHTML;
    // }
    if(doc.getElementById(varItem.formula)){
      innerhtml = doc.getElementById(varItem.formula);
      doc.getElementById(varItem.formula).outerHTML = varItem.formula.replace(/^%/g,'{{').replace(/%$/g,'}}');
      msgtxt = doc.body.innerHTML;
    }
    return msgtxt;
  }

   //new get api data
   updateTemplateVariableIntoHTMLV2(msg: string): string{
    let listOfUsedVariableObj:any = this.getListOfUsedVariableObjV2(msg);
    let msgtxt: string = msg ? msg : '';
    msgtxt = this.removeInlineCSSForParagraphStyle(msgtxt);
    if(msgtxt){
      if(listOfUsedVariableObj && listOfUsedVariableObj.length > 0){
        let variableNodeObjToDisplay = this.createVariableTagElementsV2(listOfUsedVariableObj);
        listOfUsedVariableObj.map(variable => {
          // let regExp = variable.formula.includes("$") ? variable.formula.replace(/\$/g,'\\$'): variable.formula;
          let regExp = variable.formula.replace(/\{\{/g,'\\{\\{').replace(/\}\}/g,'\\}\\}');
          let regx = new RegExp(regExp, "g");
          msgtxt = msgtxt.replace(regx,variableNodeObjToDisplay[variable.formula]);
        });
      }else{
        listOfUsedVariableObj = [];
      }
    }
    return msgtxt;
  }

   //New send api data
  updateTemplateVarHTMLIntoVariableV2(msg:any): string{
    let listOfUsedVariableObj:any = this.getListOfUsedVariableObjV2(msg);
    let msgtxt: string = msg ? msg : '';
    msgtxt = this.addInlineCSSForParagraphStyle(msgtxt);
    if(msgtxt){
      if(listOfUsedVariableObj && listOfUsedVariableObj.length > 0){
        listOfUsedVariableObj.map(varItem =>{
          msgtxt = this.removeVariableHTMLStructureV2(msgtxt,varItem);
        });
      }
    }
    return msgtxt;
  }

  public regXForVarFormulaV2 = /\{\{(([a-zA-Z0-9_]\.){0,1}[a-zA-Z0-9_])+\}\}/g
  getListOfUsedVariableObjV2(msg:any){
    let listOfUsedVariableFormula = msg ? msg.match(this.regXForVarFormulaV2) : [] ;
    let listOfUsedVariableObj:any = [];

    if(listOfUsedVariableFormula && listOfUsedVariableFormula.length > 0){
      let remainingVars:Array<string> = JSON.parse(JSON.stringify(listOfUsedVariableFormula));

      this.availablestepsService.messageVariablesCategory.map(category=>{
        category.variables.map(variable=>{
          let tempVar = variable;
          tempVar.formula = tempVar.formula.replace(/^%/g,'{{').replace(/%$/g,'}}');
          if(listOfUsedVariableFormula && listOfUsedVariableFormula.includes(tempVar.formula)){
            listOfUsedVariableObj.push(tempVar);
            remainingVars.splice(remainingVars.indexOf(variable.formula),1);
          }
        })
      });

      if(this.enabledPermissions.isJRSalesforceEnabled && this.userInfo.AccountLoginType == 'salesforce' && this.enabledPermissions.isNewVariablePopupEnabled){
        remainingVars.map((itemObj:any) => {
          listOfUsedVariableObj.push({
            "formula" : itemObj,
            "title" : itemObj.replace(/\{\{/g,"").replace(/\}\}/g,"")
          });
        });
      }
    }

    return listOfUsedVariableObj;
  }

  getListVariableFormulaV2(msg:string){
    return msg 
          ? msg.match(this.regXForVarFormulaV2) ? msg.match(this.regXForVarFormulaV2) : [] 
          : [] ;
  }

  // ============================== new version methods ends==============================

  
  /**
   * feeding string transform into simple text string
   * @param htmlContent : string containing html special character code including new line html tag  (<br/>).
   * @returns transformed plain text string.
   */
   convertToPlainText(htmlContent:string): string {
    htmlContent = htmlContent.replace(/<br(\s)*([^<])*>/g,"\n");
    var tempDivElement = document.createElement("ss-temp-el");
    tempDivElement.innerHTML = htmlContent;

    /** convert anchor tag into simple url */
    tempDivElement.hidden = true;
    document.body.appendChild(tempDivElement);
    $("ss-temp-el a").each(function(e) {
      if(!$(this).is(':empty')){
        $(this).replaceWith(" "+$(this).attr('href')+" ");
      }
    });

    var text = tempDivElement.textContent || tempDivElement.innerText || "";
    tempDivElement.remove()
    return text;
  }

}
