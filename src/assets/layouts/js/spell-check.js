

// var popupPosition = ["left"];
// var isTextAreaSame;
// var idCount = 0;
// var popupIsOpen = false;
// var prefixId = "spell_check_live_";
// var errorSpanPrefixId = "error_span_";
// var suggestionBtnPrefix = "sugg_btn_";
// var suggestionBtnCount = 0;

// var tempDom = `
// <div class="popup-box">
//     <div class="popup-head">
//     <a href="javascript:void(0)" class="zmdi zmdi-close close-popup" onclick="hidePopup(event)"></a>
//       Suggesties
//         <br/>
//         <small>Je hebt spell-count spellingsuggesties en tips-count conversiesuggestie</small>
//     </div>
//     <div class="popup-body scroll-y">
//         <div class="suggestions">
//             <div class="suggestions-box">spellingsuggesties</div>
//         </div>
//         <hr>
//     </div>
//     <div class="popup-foot">
//     </div>
// </div>
// `;

// var tempDom_tips = `
// <div class="popup-box">
//     <div class="popup-head">
//     <a href="javascript:void(0)" class="zmdi zmdi-close close-popup" onclick="hidePopup(event)"></a>
//       Suggesties
//         <br/>
//         <small>Je hebt spell-count spellingsuggesties en tips-count conversiesuggestie</small>
//     </div>
//     <div class="popup-body scroll-y">
//       <div class="tipss">
//         <div class="tipss-box">Conversiesuggesties</div>
//       </div>
//       <hr>
//     </div>
//     <div class="popup-foot">
//     </div>
// </div>
// `;

// var tips_title_DOM = `
// <div class="tipss">
//   <div class="tipss-box">Conversiesuggesties</div>
// </div>
// `;
// var correction_box1_hv_suggestions = `
// <div class="correction-box">
//     <div class="flexspacebt">
//         <div class="correction">
//             <span class="wrong-txt">
//                 <del>incoorporate</del>
//             </span>
//             <div class="dropdown correct-option-parent">
//                 <span class="correct-txt green-txt hd-suggestions hv-suggestions" data-toggle="dropdown">incorporate</span>
//                 <div class="dropdown-menu pull-right green"></div>
//             </div>
//         </div>
//         <div class="actions">
//             <button offset="offset-change" sugg-num="suggestion_count_with_change" class="btn btn-blue change-btn" onclick="correctSpelling(event)">Change</button>
//             <button offset="offset-ignore" sugg-num="suggestion_count_with_ignore" class="btn btn-link btn-re d-txt ignore-btn" onclick="ignoreData(event)">Ignore</button>
//         </div>
//     </div>
// </div>
// `;

// var correction_box1 = `
// <div class="correction-box">
//     <div class="flexspacebt">
//         <div class="correction">
//             <span class="wrong-txt">
//                 <del>incoorporate</del>
//             </span>
//             <div class="dropdown correct-option-parent">
//                 <span class="correct-txt green-txt hd-suggestions" data-toggle="dropdown">incorporate</span>          
//             </div>
//         </div>
//         <div class="actions">
//             <button offset="offset-change" sugg-num="suggestion_count_with_change" class="btn btn-blue change-btn" onclick="correctSpelling(event)">Change</button>
//             <button offset="offset-ignore" sugg-num="suggestion_count_with_ignore" class="btn btn-link btn-re d-txt ignore-btn" onclick="ignoreData(event)">Ignore</button>
//         </div>
//     </div>
// </div>
// `;

// var tipss_box = `
// <div class="correction-box tip-box">
//   <div class="tip-container">
//     <div class="tip-text">incoorporate</div>
//     <div class="tip-info" tips-offset="tips-suggestion">Suggestion tip</div>
//   </div>
// </div>`;

// var popup_box = `<div class="popup-box"></div>`;
// var popup_head = `<div class="popup-head">Suggesties <br/><small>(You have 1 spelling, 2 conversion and 3 advance writing suggestions)</small> <a href="javascript:void(0)" class="zmdi zmdi-close close-popup"></a></div>`;
// var popup_body = `<div class="popup-body scroll-y"></div>`;
// var suggestions = `<div class="suggestions"></div>`;
// var suggestionsbox_SCS = `<div class="suggestions-box">Spelling and Conversion suggestions</div>`;
// var correction_box = `<div class="correction-box">
//                         <div class="flexspacebt">
//                         </div>              
//                         </div>`;
// var correction = `<div class="correction"></div>`;
// var wrong_txt = `<span class="wrong-txt"><del>incoorporate</del></span>`;
// var dropdown = ` <div class="dropdown"><span class="correct-txt green-txt hv-suggestions" data-toggle="dropdown">incorporate</span></div>`;
// var dropdown_menu = `<div class="dropdown-menu pull-right green"></div>`;
// var dropdown_item = `<a class="dropdown-item" href="javascript:void(0)">spelling_1</a>`;
// var suggestionsbox_AWS = `<div class="suggestions-box">Avanced writing suggestions</div>`;
// var actions = `<div class="actions"></div>`;
// var btn_change = `<button offset="offset-change" sugg-num="suggestion_count_with_change" class="btn btn-blue change-btn" onclick="correctSpelling(event)">Change</button>`;
// var btn_ignore = `<button offset="offset-ignore" sugg-num="suggestion_count_with_ignore" class="btn btn-link btn-re d-txt ignore-btn" onclick="ignoreData(event)">Ignore</button>`;
// var btn_undo = `<button offset="offset-undo" sugg-num="suggestion_count_with_undo" class="btn btn-link btn-bl ue-txt undo-btn" onclick="undoSpellChangeData(event)">Undo</button>`;
// var warning_info = ` <div class="warning-info" tips-offset="tips-suggestion">Suggestion tip</div>`;

// // var suggestion_btn = `<div class="suggestion-btn" onclick="openPopup(event)">suggestion_number</div>`;
// var suggestion_btn_for_div = `<div class="suggestion-btn" onclick="openPopupwithDiv(event)">suggestion_number</div>`;
// var suggestion_btn_for_input = `<div class="suggestion-btn" onclick="openPopupWithInput(event)">suggestion_number</div>`;
// var loader = `<div class="api-loader"></div>`;

// // $(document).ready(checkContainer);
// var storedInputDataArray = [];
// var tempStoredInputDataArray = [];
// var storedInputField;
// var storedDIV;
// var innerText = "";
// // function getMutationObserver(){

// var specialEntity = [
//   { Ename: "&lt;", Etext: "<" },
//   { Ename: "&gt;", Etext: ">" },
//   { Ename: "&amp;", Etext: "&" },
//   { Ename: "&para;<br>", Etext: "\n" }
// ];

// $(window).click(function(event) {
//   var event = event || window.event;
//   //Hide the menus if visible
//   if (
//     event.target.nodeName !== "DIV" &&
//     event.target.nodeName !== "INPUT" &&
//     event.target.nodeName !== "TEXTAREA"
//   ) {
//     /**
//      * Input (editable) field display
//      */
//     if (storedInputField) {
//       storedInputField.style.display = "block";
//     }
//     /**
//      * "Created" editable div remove if present any
//      */
//     if (storedDIV) {
//       storedDIV.remove();
//     }
//   }
//   if (
//     (event.target.nodeName === "INPUT" ||
//       event.target.nodeName === "TEXTAREA") &&
//     event.target.className.includes("spell-checker")
//   ) {
//     getFocusInputField(event.target);
//   } else if (event.target.isContentEditable) {
//     getFocusDivField(event.target);
//   }
// });

// var innerFunction = function(ele) {
//   keypressANDfocusouEventBinding(ele);
// };

// var curr_spell_check_id = "";
// var targetElement = "";
// function getFocusInputField(element) {
//   if (!element.dataset.spell_check_id) {
//     // spellCheckWithInput._targetElement = element;
//     setDataSpellCheckId(element);
//     let querySelectorDataString = `document.querySelector("[data-spell_check_id='${curr_spell_check_id}']")`;
//     addScriptTagOFSpellChecker(
//       document,
//       innerFunction,
//       querySelectorDataString,
//       true
//     );
//   }
// }

// function setDataSpellCheckId(ele) {
//   curr_spell_check_id = generateARandomCode();
//   ele.setAttribute("data-spell_check_id", curr_spell_check_id);
// }
// /*
//  *script tag added to document
//  */
// function addScriptTagOFSpellChecker(hostEle, innerFn, targetEle, isAdded) {
//   if (isAdded) {
//     var scriptTag = hostEle.createElement("script");
//     targetEle = targetEle || [];
//     var innerFnStr = innerFn.toString();
//     // var targetEleSelector = targetEle.toString();
//     return (
//       (scriptTag.innerHTML =
//         "(function(){(" + innerFnStr + ")(" + targetEle + ") })()"),
//       hostEle.documentElement.appendChild(scriptTag),
//       scriptTag
//     );
//   }
// }

// function keypressANDfocusouEventBinding(targetElement) {
//   targetElement._previousTextLength = targetElement.value.length;
//   targetElement.addEventListener("keypress", keypressEventOnInpFunction);
//   targetElement.addEventListener("focusout", focusoutEventOnInpFunction);
// }

// /**
//  * key-press event function call
//  */

// function keypressEventOnInpFunction(event) {
//   event = event || window.event;
//   let sugg_btn = event.target.nextElementSibling;
//   while (sugg_btn) {
//     sugg_btn.remove();
//     sugg_btn = event.target.nextElementSibling;
//   }
//   this._isApiHitted = false;
//   if (!this._previousTextLength) {
//     this._previousTextLength = event.target.value.length;
//   } else {
//     if (event.target.value.length - this._previousTextLength >= config.keyCount) {
//       setApiTimeOut(event);
//       this._previousTextLength = 0;
//     }
//   }
//   if (
//     (event.charCode && event.charCode === config.specificKeyCode) ||
//     (event.keyCode && event.charCode === config.specificKeyCode) ||
//     (event.key && event.key === config.specificKey)
//   ) {
//     setApiTimeOut(event);
//     this._previousTextLength = 0;
//   }
// }

// function focusoutEventOnInpFunction(event) {
//   event = event || window.event;
//   if (event.type === "focusout" && config.focusOutBool) {
//     setApiTimeOut(event);
//     this._previousTextLength = 0;
//   }
// }

// /**
//  * Api integration
//  */
// var apiResponseData;
// var apiStream;
// var isApiReadyToHit = false;
// var apiTimeOut;
// var specText = "";
// // var api_text = "";
// var config = {
//   url: "https://spell-check-test.jobrock.com/api/v1/SpellCheck",
//   ApiSecret: "9a597082778a42268b33e56ce96dd45a",
//   Content_Type: "application/json",
//   focusOutBool : true,
//   specificKey : '.',
//   specificKeyCode : 46,
//   keyCount : 20,
//   culture: "nl"
// };

// /**
//  *
//  * @param {called function} func
//  * @param {time to wail} wait
//  * @param {boolean if invoke function immediately} immediate
//  * custom debounceTime function for plain js
//  *
//  */
// function debounce(func, wait, immediate) {
//   var timeout;
//   return function() {
//     var context = this,
//       args = arguments;
//     var later = function() {
//       timeout = null;
//       if (!immediate) func.apply(context, args);
//     };
//     var callNow = immediate && !timeout;
//     clearTimeout(timeout);
//     timeout = setTimeout(later, wait);
//     if (callNow) func.apply(context, args);
//   };
// }

// var setApiTimeOut = debounce(function(event$) {
//   hitTempApiWithInput(event$);
// }, 2000);

// function hitTempApiWithInput(event) {
//   event = event || window.event;
//   if (!event.target._isApiHitted) {
//     event.target._isApiHitted = true;
//     if (event.target.value) {
//       event.target._previousTextLength = event.target.value.length;
//       event.target._apiResponseData = [];
//       event.target._tempApiResponseData = [];
//       event.target._specText = getNonSpaceTextforInput(event.target.value);
//       event.target._api_text = event.target.value;
//       hitSpellcheckApi(event, "textAREA");
//     } else if (event.target.innerText) {
//       event.target._previousTextLength = event.target.innerText.length;
//       event.target._apiResponseData = [];
//       event.target._tempApiResponseData = [];
//       event.target._specText = getNonSpaceText(event.target.innerHTML);
//       event.target._api_text = event.target.innerText;
//       hitSpellcheckApi(event);
//     }
//   }
// }

// function getNonSpaceText(t_innerHTML) {
//   let api_text = "";
//   let skipText = false;
//   for (let i = 0; i < t_innerHTML.length; i++) {
//     let cc = t_innerHTML.charAt(i);
//     if (cc === "<") {
//       // if (t_innerHTML.charAt(i + 1) === "/") {
//       //   api_text = api_text + " ";
//       // }
//       skipText = true;
//     }
//     if (cc === ">") {
//       skipText = false;
//       continue;
//     }
//     if (skipText) {
//       continue;
//     } else {
//       api_text = api_text + cc;
//     }
//   }
//   api_text = api_text.split(">").join("");
//   api_text = api_text.split("&nbsp;").join(" ");
//   return api_text;
// }

// function getNonSpaceTextforInput(t_innerText) {
//   let temp_innerText = t_innerText.split(/\n/).join("&bsp;");
//   return temp_innerText;
// }

// function hitSpellcheckApi(event, type) {
//   addLoader(event.target);
//   var clientCode = getDataFromCookie('clientCode');
//   var request = new XMLHttpRequest();
//   request.open("POST", config.url + "?Culture=" + config.culture + "&Mode=" + config.mode + "&ClientCode=" + clientCode, true);

//   request.setRequestHeader("ApiSecret", config.ApiSecret)  
//   request.setRequestHeader("Content-Type", config.Content_Type);
//   request.onload = function() {
//     // Begin accessing JSON data here
//     if (this.readyState === 4) {
//       if (this.status === 200) {
//         while ($(".api-loader").length) {
//           $(".api-loader")[0].remove();
//         }
//         apiResponseData = JSON.parse(this.response);
//         apiResponseData = sortApiResponse(apiResponseData.data);
//         event.target._apiResponseData = apiResponseData.slice(0);
//         event.target._tempApiResponseData = apiResponseData.slice(0);
//         event.target._popupIsOpen = false;
//         if (apiResponseData.length) {
//           if (type === "textAREA") {
//             createSuggestionBtnWithInput(event.target);
//           } else {
//             createSuggestionBtn(event.target);
//           }
//         }
//       }
//     }
//   };
//   request.send(JSON.stringify({Text: event.target._api_text}));
// }

// function addLoader(htmlEle) {
//   $(loader).insertAfter(htmlEle);
//   $(".api-loader")[0].style["margin-top"] = -22 + "px";
//   $(".api-loader")[0].style["margin-left"] =
//     htmlEle.offsetWidth + htmlEle.offsetLeft - 18 + "px";
//   if (htmlEle.nodeName == "TEXTAREA" || htmlEle.nodeName == "INPUT") {
//     loader.classname = "relative-loader";
//     $(".api-loader")[0].style["margin-top"] = -22 + "px";
//     $(".api-loader")[0].style["margin-left"] =
//       htmlEle.offsetWidth + htmlEle.offsetLeft - 68 + "px";
//   }
// }

// function sortApiResponse(apiData) {
//   if (apiData) {
//     apiData.sort((a, b) => {
//       if (+a.Offset < b.Offset) {
//         return 1;
//       } else {
//         return -1;
//       }
//     });
//     return apiData;
//   }
// }

// /**
//  *
//  * @param {targetElementReference} storedDIV
//  * only create a suggestion-btn that is sibling with Target Input element
//  */
// function createSuggestionBtnWithInput(storedDIV) {
//   var suggestionsCount = 0;
//   let curApiResData = $(storedDIV)[0]._apiResponseData;
//   let curTargetEle = $(storedDIV)[0];

//   for (var sc = 0; sc < curApiResData.length; sc++) {
//     if (curApiResData[sc].Suggestions.length > 0) {
//       suggestionsCount++;
//     }
//     if (curApiResData[sc].Tips) {
//       suggestionsCount++;
//     }
//   }

//   var suggestion_btn_data = suggestion_btn_for_input.replace(
//     "suggestion_number",
//     suggestionsCount
//   );
//   // $(storedDIV.parentElement).append(suggestion_btn_data);

//   $(suggestion_btn_data).insertAfter(curTargetEle);
//   let suggestion_btn = curTargetEle.nextElementSibling;
//   $(suggestion_btn)[0].style.top =
//     curTargetEle.offsetHeight + curTargetEle.offsetTop - 23 + "px";
//   $(suggestion_btn)[0].style.left =
//     curTargetEle.offsetWidth + curTargetEle.offsetLeft - 23 + "px";
//   $(suggestion_btn)[0].style["z-index"] = 92;
//   $(suggestion_btn)[0].setAttribute(
//     "data-sugg_num",
//     suggestionBtnPrefix + suggestionBtnCount++
//   );
// }

// function closePopupifAnyOpen() {
//   while ($(".popup-box").length) {
//     let popupBox = $(".popup-box")[0];
//     let currentDiv = popupBox.parentElement.previousElementSibling;
//     let targetEle = currentDiv.previousElementSibling;
//     removeAllErrorSpan(currentDiv);
//     targetEle.style.display = "block";
//     targetEle._popupIsOpen = false;
//     targetEle._api_text = currentDiv.innerText.split(/\n/).join("\n");
//     targetEle._specText = currentDiv.innerText.split(/\n/).join("&bsp;");
//     targetEle._apiResponseData = targetEle._tempApiResponseData.slice(0);
//     spellCheck.formManipulation(currentDiv.innerHTML);
//     if (+currentDiv.nextElementSibling.innerText.split(/\n/)[0] === 0) {
//       currentDiv.nextElementSibling.remove();
//     }
//     popupBox.remove();
//     currentDiv.remove();
//   }
// }
// /**
//  *
//  * @param {suggestion_btn click event} event
//  * function call when suggestion btn has been clicked which is attached to InputField
//  */
// function openPopupWithInput(event) {
//   var event = event || window.event;
//   event.stopPropagation();
//   var element = event.target;
//   if (
//     element.className.includes("suggestion-btn") &&
//     !element.previousElementSibling._popupIsOpen
//   ) {
//     let curElement = event.target.previousElementSibling;
//     let curApiResData = curElement._apiResponseData;
//     var suggNum = element.getAttribute("data-sugg_num");
//     closePopupifAnyOpen();
//     if(curApiResData){
//     createDivWithInput(curElement, curApiResData);
    

//     curElement._popupIsOpen = true;
//     var tempDom_data;
//     var tipsCount = 0;
//     var spellCount = 0;

//     // $(element).append(DOM);
//     curApiResData = divideResDataIntoSuggestionAndTips(curApiResData);
//     spellCount = curApiResData.suggestion.length;
//     tipsCount = curApiResData.tips.length;
    
//     if(curApiResData.suggestion.length){
//       tempDom_data = tempDom.replace("spell-count", spellCount);
//       tempDom_data = tempDom_data.replace("tips-count", tipsCount);
//       // tempDom_data = tempDom_data.replace("advance-settings-count", "0");
    
//       $(element).append(tempDom_data);
//     }
//     for (var i = 0; i < curApiResData.suggestion.length; i++) {
//       var correction_box_data, warning_info_data;
//       var temp_correction_box1 = correction_box1;
//       if (curApiResData.suggestion[i].Suggestions.length > 1) {
//         temp_correction_box1 = correction_box1_hv_suggestions;
//       }
//       if (curApiResData.suggestion[i].Token) {
//         correction_box_data = temp_correction_box1.replace(
//           "incoorporate",
//           curApiResData.suggestion[i].Token
//         );
//       }
//       if (
//         curApiResData.suggestion[i].Suggestions.length > 0 &&
//         curApiResData.suggestion[i].Suggestions[0].Suggestion
//       ) {
//         correction_box_data = correction_box_data.replace(
//           "incorporate",
//           curApiResData.suggestion[i].Suggestions[0].Suggestion
//         );
//       } else {
//         correction_box_data = correction_box_data.replace("incorporate", "");
//       }
//       if (curApiResData.suggestion[i].Offset > -1) {
//         correction_box_data = correction_box_data.replace(
//           "offset-change",
//           curApiResData.suggestion[i].Offset
//         );
//         correction_box_data = correction_box_data.replace(
//           "suggestion_count_with_change",
//           suggNum
//         );
//         correction_box_data = correction_box_data.replace(
//           "offset-ignore",
//           curApiResData.suggestion[i].Offset
//         );
//         correction_box_data = correction_box_data.replace(
//           "suggestion_count_with_ignore",
//           suggNum
//         );
//       }
//       var popup_parent_html = $(".suggestions").append(correction_box_data);
//       if (curApiResData.suggestion[i].Suggestions.length > 1) {
//         createDrowpdownList(popup_parent_html, curApiResData.suggestion[i]);
//       }
//       if (
//         curApiResData.suggestion[i].Offset > -1 &&
//         !curApiResData.suggestion[i].Suggestions.length
//       ) {
//         $($(".actions")[$(".actions").length - 1]).remove();
//         if (curApiResData.suggestion[i].Suggestions.length === 1) {
//           $($(".hd-suggestions")[$(".hd-suggestions").length - 1]).remove();
//         } else if (curApiResData.suggestion[i].Suggestions.length > 1) {
//           $($(".hv-suggestions")[$(".hv-suggestions").length - 1]).remove();
//         }
//       }
//     }
//     if(curApiResData.suggestion.length && curApiResData.tips.length){
//       var temp_tips_title_DOM = tips_title_DOM
//       $('.scroll-y').append(temp_tips_title_DOM);
//     } else if(curApiResData.tips.length){
//       tempDom_data = tempDom_tips.replace("spell-count", spellCount);
//       tempDom_data = tempDom_data.replace("tips-count", tipsCount);
//       // tempDom_data = tempDom_data.replace("advance-settings-count", "0");
    
//       $(element).append(tempDom_data);
//     }
//     for(let t=0; t<curApiResData.tips.length; t++){
//       var temp_tipss_box = tipss_box, warning_info_data;
//       if(curApiResData.tips[t].Token){
//         warning_info_data = temp_tipss_box.replace(
//           "incoorporate",
//           curApiResData.tips[t].Token
//         );
//       }
//       if (curApiResData.tips[t].Tips) {
//         warning_info_data = warning_info_data.replace(
//           "Suggestion tip",
//           curApiResData.tips[t].Tips
//         );
//         if (curApiResData.tips[t].Offset > -1) {
//           warning_info_data = warning_info_data.replace(
//             "tips-suggestion",
//             curApiResData.tips[t].Offset
//           );
//         }
//         $(".tipss").append(warning_info_data);
//       }
//     }
//   }
//     for (var i = 0; i < popupPosition.length; i++) {
//       if (popupPosition[i] == "right") {
//         $(".popup-box").addClass("right-side");
//       } else if (popupPosition[i] == "left") {
//         $(".popup-box").addClass("left-side");
//       } else if (popupPosition[i] == "top") {
//         $(".popup-box").addClass("top-side");
//       } else if (popupPosition[i] == "bottom") {
//         $(".popup-box").addClass("bottom-side");
//       }
//     }
//     // $(".close-popup").bind("click", hidePopup);
//     $(".correct-option-parent").on("click", function() {
//       $(this).toggleClass("open");
//     });
//   }
// }

// function divideResDataIntoSuggestionAndTips(curApiResData){
//   var suggestionData = [], tipData = [], changedApiData = {suggestion:[], tips: []};
//   curApiResData.forEach((resData) => {
//       if(resData.Suggestions.length){
//           let tempSuggData = {
//               Offset: resData.Offset,
//               Suggestions: JSON.parse(JSON.stringify(resData.Suggestions)),
//               Tips: '',
//               Token: resData.Token
//           }
//           suggestionData.push(tempSuggData);
//       }
//       if(resData.Tips){
//           let tempTipData = {
//               Offset: resData.Offset,
//               Suggestions: [],
//               Tips: resData.Tips,
//               Token: resData.Token
//           }
//           tipData.push(tempTipData);
//       }
//   });
//   changedApiData.suggestion = JSON.parse(JSON.stringify(suggestionData));
//   changedApiData.tips = JSON.parse(JSON.stringify(tipData));
//   return changedApiData;
// }

// function createDivWithInput(curEle, resData) {
//   let curApiResData = curEle._apiResponseData;
//   let targetEle = curEle;
//   let createdEle = curEle._createdEle;
//   if (!targetEle.popupIsOpen) {
//     if (targetEle) {
//       targetEle.style.display = "block";
//     }
//     if (createdEle) {
//       createdEle.remove();
//     }
//     targetEle = curEle;
//     if (!targetEle.id) {
//       targetEle.setAttribute("id", prefixId + idCount++);
//     }
//     createdEle = document.createElement("div");
//     if (targetEle.value != undefined) {
//       createdEle.innerText = targetEle._specText.split("&bsp;").join("<br>");
//     } else if (targetEle.innerText != undefined) {
//       innerText = targetEle.innerText;
//       createdEle.innerText = innerText;
//     }
//     createSpellErrorSpan(createdEle, curApiResData, targetEle._api_text);
//     getFocusInDataOnDiv(targetEle, createdEle);
//     targetEle.getAttributeNames().forEach(attr => {
//       if (attr === "class") {
//         var className = targetEle
//           .getAttribute(attr)
//           .replace("spell-checker", "");
//         $(createdEle).attr(attr, className);
//       } else {
//         $(createdEle).attr(attr, targetEle.getAttribute(attr));
//       }
//       if (attr === "formcontrolname") {
//         spellCheck.formControlName = targetEle.getAttribute("formcontrolname");
//       }
//     });
//     $(createdEle).prop("contentEditable", true);
//     createdEle.style.overflow = "auto";
//     createdEle.style.display = "block";
//     targetEle.style.display = "none";
//     $(createdEle).insertAfter($(targetEle));
//     // setTimeout(function() {
//     //   var char = createdEle.innerText.length; // character at which to place caret  content.focus();
//     //   var sel = window.getSelection();
//     //   sel.collapse(createdEle.lastChild, createdEle.lastChild.length);
//     //   createdEle.focus();
//     // }, 0);
//     window.getSelection().removeAllRanges();
//   }
// }

// function createSpellErrorSpan(createdEle, resData, api_text) {
//   let curApiResData = resData;
//   curApiResData.sort((a, b) => {
//     if (a.Offset > b.Offset) {
//       return -1;
//     } else {
//       return 1;
//     }
//   });
//   var text = createdEle.innerText;
//   var tempStoredDivHtml;
//   var str = "";
//   str = text;
//   let cur_pos = api_text.length - 1;
//   let skipText = false;
//   let apiResponseDataIndex = 0;
//   var HTML = (text = str);

//   for (let i = text.length - 1; i >= 0; i--) {
//     let cc = text.charAt(i);
//     if (
//       apiResponseDataIndex < curApiResData.length &&
//       cur_pos === curApiResData[apiResponseDataIndex].Offset
//     ) {
//       text = errorSpanReturn(curApiResData[apiResponseDataIndex], text, i);
//       apiResponseDataIndex++;
//     }
//     if (cc === ">") {
//       skipText = true;
//     }
//     if (cc === "<") {
//       if (text.charAt(i + 1) === "b") {
//         if (text.charAt(i + 2) === "r") {
//           cur_pos--;
//         }
//       }
//       skipText = false;
//       continue;
//     }
//     if (skipText) {
//       continue;
//     } else {
//       cur_pos--;
//     }
//   }
//   createdEle.innerHTML = text;
// }

// function errorSpanReturn(errorData, innerHTML_data, cur_pos) {
//   let temp_innerHTML = "";
//   let start_Html = innerHTML_data.slice(0, cur_pos);
//   // let cur_Html = `<span id=${errorSpanPrefixId}${errorData.Offset} class="livespell_redwiggle">${errorData.Token}</span>`
//   let storedSpan = document.createElement("span");
//   storedSpan.innerText = errorData.Token;
//   storedSpan.id = errorSpanPrefixId + errorData.Offset;
//   let temp_div = document.createElement("div");
//   temp_div.append(storedSpan);
//   storedSpan.className = "help_to_rem";
//   if (errorData.Suggestions.length > 0) {
//     storedSpan.className = storedSpan.className + " " + "livespell_redwiggle";
//   }
//   if (errorData.Tips) {
//     storedSpan.className = storedSpan.className + " " + "livespell_bluewiggle";
//   }
//   let end_Html = innerHTML_data.slice(cur_pos + errorData.Token.length);
//   temp_innerHTML = start_Html + temp_div.innerHTML + end_Html;
//   return temp_innerHTML;
// }

// function createDrowpdownList(ddParent, apiSuggestions) {
//   var temp_dropdown_menu = $(".green");
//   let correct_option_parent = $(".correct-option-parent");
//   for (let i = 0; i < apiSuggestions.Suggestions.length; i++) {
//     let temp_dropdown_item = dropdown_item;
//     temp_dropdown_item = dropdown_item.replace(
//       "spelling_1",
//       apiSuggestions.Suggestions[i].Suggestion
//     );
//     $(temp_dropdown_menu[temp_dropdown_menu.length - 1]).append(
//       temp_dropdown_item
//     );
//   }
//   $(".dropdown-item").hover(function(event) {
//     $(this).click(function(event) {
//       this.parentElement.parentElement.firstElementChild.innerText = this.innerText;
//     });
//   });
// }

// function getFocusInDataOnDiv(targetEle, createdEle) {
//   $(createdEle).on("keypress", function(ev) {
//     ev = ev || window.event;
//     removeDivOnFocusinOrKeypress(targetEle, createdEle);
//   });
// }

// function removeDivOnFocusinOrKeypress(targetEle, createdEle) {
//   if ($(createdEle)[0].previousElementSibling) {
//     $(createdEle)[0].previousElementSibling.style.display = "block";
//     $(createdEle)[0].previousElementSibling.focus();
//   }
//   if ($(createdEle)[0].nextSibling) {
//     $(createdEle)[0].nextSibling.remove();
//   }
//   if ($(createdEle)[0]) {
//     $(createdEle)[0].remove();
//     targetEle._popupIsOpen = false;
//   }
// }

// function hidePopup(event) {
//   var event = event || window.event;
//   event.stopPropagation();
//   var ele = event.target;
//   let currentDiv =
//     ele.parentElement.parentElement.parentElement.previousSibling;
//   let targetEle = currentDiv.previousElementSibling;
//   if(!targetEle || !targetEle.dataset.spell_check_id){
//     targetEle = currentDiv;
//   }
//   targetEle._popupIsOpen = false;

//   removeAllErrorSpan(currentDiv);
//   if (targetEle.nodeName === "DIV") {
//     spellCheck.modelManipulation(currentDiv, currentDiv.innerHTML);
//     targetEle._api_text = targetEle.innerText.split(/\n/).join("\n");
//     targetEle._specText = targetEle.innerText.split(/\n/).join("&bsp;");
//     targetEle._apiResponseData = targetEle._tempApiResponseData.slice(0);
//   } else if (targetEle) {
//     targetEle.style.display = "block";
//     targetEle._api_text = currentDiv.innerText.split(/\n/).join("\n");
//     targetEle._specText = currentDiv.innerText.split(/\n/).join("&bsp;");
//     targetEle._apiResponseData = targetEle._tempApiResponseData.slice(0);
//     spellCheck.formManipulation(currentDiv.innerHTML);
//     $(ele.parentElement.parentElement.parentElement.previousSibling).remove();
//   }
//   let suggBTN = $(ele.parentElement.parentElement.parentElement);
//   if (+suggBTN[0].innerText.split(/\n/)[0] === 0) {
//     suggBTN.remove();
//   }
//   $(ele.parentElement.parentElement).remove();
// }

// function removeAllErrorSpan(ele) {
//   $(`span.help_to_rem`).replaceWith(function() {
//     return $(this).text();
//   });
// }

// function correctSpelling(event) {
//   var event = event || window.event;
//   event.stopPropagation();
//   let element = event.target;
//   let offset = +element.getAttribute("offset");
//   let suggNum = element.getAttribute("sugg-num");
//   let correct_text = $(
//     element.parentElement.parentElement.firstElementChild
//   ).find(".hd-suggestions")[0].innerText;
//   var ele= document.getElementsByClassName(`${errorSpanPrefixId}${offset}`);
//   if(ele.length >= 1){
//     for(var i=ele.length-1;i>0;i--)
//       {
//         ele[i].remove();
//       }
//   }
//   $(`#${errorSpanPrefixId}${offset}`)[0].innerText = correct_text;
//   $(`#${errorSpanPrefixId}${offset}`)[0].className = "";
//   $(`#${errorSpanPrefixId}${offset}`)[0].className = "help_to_rem";
//   element.nextElementSibling.remove();
//   let btn_undo_data = btn_undo.replace("offset-undo", offset);
//   btn_undo_data = btn_undo_data.replace("suggestion_count_with_undo", suggNum);
//   $(element.parentElement).append(btn_undo_data);
//   element.remove();
//   updateSuggestionButtonCount(suggNum, "reduce", offset);
// }

// function ignoreData(event) {
//   var event = event || window.event;
//   event.stopPropagation();
//   let element = event.target;
//   let offset = +element.getAttribute("offset");
//   let suggNum = element.getAttribute("sugg-num");
//   element.parentElement.parentElement.parentElement.remove();
//   updateSuggestionButtonCount(suggNum, "reduce", offset);
// }

// function undoSpellChangeData(event) {
//   var event = event || window.event;
//   event.stopPropagation();
//   let element = event.target;
//   let offset = +element.getAttribute("offset");
//   let suggNum = element.getAttribute("sugg-num");
//   let incorrect_text = $(
//     element.parentElement.parentElement.firstElementChild
//   ).find(".wrong-txt")[0].innerText;
//   $(`#${errorSpanPrefixId}${offset}`)[0].innerText = incorrect_text;
//   $(`#${errorSpanPrefixId}${offset}`)[0].className =
//     "livespell_redwiggle help_to_rem";
//   let btn_change_data = btn_change.replace("offset-change", offset);
//   btn_change_data = btn_change_data.replace(
//     "suggestion_count_with_change",
//     suggNum
//   );
//   let btn_ignore_data = btn_ignore.replace("offset-ignore", offset);
//   btn_ignore_data = btn_ignore_data.replace(
//     "suggestion_count_with_ignore",
//     suggNum
//   );
//   $(element.parentElement).append(btn_change_data);
//   $(element.parentElement).append(btn_ignore_data);
//   element.remove();
//   // copyTextFromDivtoInput();
//   updateSuggestionButtonCount(suggNum, "add", offset);
// }

// function updateSuggestionButtonCount(selector, type, offsetData) {
//   let suggestionBTN = document.querySelector(`[data-sugg_num='${selector}']`);
//   let targetEle = suggestionBTN.previousElementSibling.previousElementSibling;
//   if(!targetEle || !targetEle.dataset.spell_check_id){
//     targetEle = suggestionBTN.previousElementSibling;
//   }
//   let suggNum = getTextFromSuggestionBtn(suggestionBTN);
//   if (type === "reduce") {
//     deleteTempApiData(targetEle, offsetData);
//     suggNum--;
//   } else if (type === "add") {
//     addTempApiData(targetEle, offsetData);
//     suggNum++;
//   }
//   setTextToSuggestionBtn(suggestionBTN, suggNum);
// }

// function getTextFromSuggestionBtn(ele) {
//   let textArray = ele.innerText.split(/\n/);
//   return textArray[0];
// }

// function setTextToSuggestionBtn(ele, num) {
//   let textArray = ele.innerText.split(/\n/);
//   let curNum = textArray[0];
//   ele.innerHTML = ele.innerHTML.replace(curNum, num);
//   $(".correct-option-parent").on("click", function() {
//     $(this).toggleClass("open");
//   });
//   $(".dropdown-item").hover(function(event) {
//     $(this).click(function(event) {
//       this.parentElement.parentElement.firstElementChild.innerText = this.innerText;
//     });
//   });
// }

// function deleteTempApiData(targetEle, offsetData) {
//   let delIndex = targetEle._tempApiResponseData.findIndex(data => {
//     return data.Offset === offsetData;
//   });
//   targetEle._tempApiResponseData.splice(delIndex, 1);
// }

// function addTempApiData(targetEle, offsetData) {
//   let deletedData = targetEle._apiResponseData.find(data => {
//     return data.Offset === offsetData;
//   });
//   let deletedIndex = targetEle._apiResponseData.findIndex(data => {
//     return data.Offset === offsetData;
//   });
//   targetEle._tempApiResponseData.splice(deletedIndex, 0, deletedData);
// }

// /**
//  * spell check all functions for Editable DIV
//  */
// var innerFunctionWithDiv = function(ele) {
//   keypressANDfocusouEventBindingWithDiv(ele);
// };

// function keypressANDfocusouEventBindingWithDiv(targetElement) {
//   targetElement._previousTextLength = targetElement.innerText.length;
//   targetElement.addEventListener("keypress", keypressEventFunction);
//   targetElement.addEventListener("focusout", focusoutEventFunction);
//   targetElement.addEventListener("keydown", keydownEventFunction);
// }

// function getFocusDivField(element) {
//   while (element.contentEditable !== "true") {
//     element = element.parentElement;
//   }
//   if (!element.dataset.spell_check_id) {
//     // spellCheckWithDiv._targetElement = element;
//     setDataSpellCheckId(element);
//     let querySelectorDataString = `document.querySelector("[data-spell_check_id='${curr_spell_check_id}']")`;
//     addScriptTagOFSpellChecker(
//       document,
//       innerFunctionWithDiv,
//       querySelectorDataString,
//       true
//     );
//     // keypressANDfocusouEventBinding();
//   }
// }
// /**
//  * key-press event function call
//  */

// function keydownEventFunction(event){
//   event = event || window.event;
//   if (event.target.dataset.gramm_editor) {
//     event.target.dataset.gramm_editor = false;
//   }
//   let sugg_btn = event.target.nextElementSibling;
//   while (sugg_btn) {
//     sugg_btn.remove();
//     sugg_btn = event.target.nextElementSibling;
//   }
//   this._isApiHitted = false;
// }

// function keypressEventFunction(event) {
//   event = event || window.event;
//   if (event.target.dataset.gramm_editor) {
//     event.target.dataset.gramm_editor = false;
//   }
//   let sugg_btn = event.target.nextElementSibling;
//   while (sugg_btn) {
//     sugg_btn.remove();
//     sugg_btn = event.target.nextElementSibling;
//   }
//   this._isApiHitted = false;
//   if (!this._previousTextLength) {
//     this._previousTextLength = event.target.innerText.length;
//   } else {
//     if (event.target.innerText.length - this._previousTextLength >= config.keyCount) {
//       setApiTimeOut(event);
//     }
//   }
//   if (
//     (event.charCode && event.charCode === config.specificKeyCode) ||
//     (event.keyCode && event.charCode === config.specificKeyCode) ||
//     (event.key && event.key === config.specificKey)
//   ) {
//     setApiTimeOut(event);
//   }
// }

// function focusoutEventFunction(event) {
//   event = event || window.event;
//   if (event.type === "focusout" && config.focusOutBool) {
//     setApiTimeOut(event);
//   }
// }

// function createSuggestionBtn(htmlEle) {
  
//   var suggestionsCount = 0;
//   let curApiResData = htmlEle._apiResponseData;
//   let curTargetEle = htmlEle;

//   for (var sc = 0; sc < curApiResData.length; sc++) {
//     if (curApiResData[sc].Suggestions.length > 0) {
//       suggestionsCount++;
//     }
//     if (curApiResData[sc].Tips) {
//       suggestionsCount++;
//     }
//   }

//   var suggestion_btn_data = suggestion_btn_for_div.replace(
//     "suggestion_number",
//     suggestionsCount
//   );
//   $(suggestion_btn_data).insertAfter(curTargetEle);
//   let suggestion_btn = curTargetEle.nextElementSibling;
//   $(suggestion_btn)[0].style.top =
//     curTargetEle.offsetHeight + curTargetEle.offsetTop - 20 + "px";
//   $(suggestion_btn)[0].style.left =
//     curTargetEle.offsetWidth + curTargetEle.offsetLeft - 20 + "px";
//   $(suggestion_btn)[0].style["z-index"] = 100;
//   $(suggestion_btn)[0].setAttribute(
//     "data-sugg_num",
//     suggestionBtnPrefix + suggestionBtnCount++
//   );
  
// }

// function closePopupifAnyOpenWithDiv() {
//   while ($(".popup-box").length) {
//     let popupBox = $(".popup-box")[0];
//     let currentDiv = popupBox.parentElement.previousElementSibling;
//     // let targetEle = currentDiv.previousElementSibling;
//     while(!currentDiv.dataset.spell_check_id){
//       currentDiv = currentDiv.previousElementSibling;
//     }
//     removeAllErrorSpan(currentDiv);
//     // targetEle.style.display = "block";
//     currentDiv._popupIsOpen = false;
//     currentDiv._api_text = currentDiv.innerText.split(/\n/).join("\n");
//     currentDiv._specText = currentDiv.innerText.split(/\n/).join("&bsp;");
//     currentDiv._apiResponseData = currentDiv._tempApiResponseData.slice(0);
//     spellCheck.modelManipulation(currentDiv, currentDiv.innerHTML);
//     if (+popupBox.parentElement.innerText.split(/\n/)[0] === 0) {
//       popupBox.parentElement.remove();
//     }
//     popupBox.remove();
//     // currentDiv.remove();
//   }
// }

// function openPopupwithDiv(event) {
//   var event = event || window.event;
//   event.stopPropagation();
//   var element = event.target;
//   if (
//     element.className.includes("suggestion-btn") &&
//     !element.previousElementSibling._popupIsOpen
//   ) {
//     let curElement = event.target.previousElementSibling;
//     while (!curElement.dataset.spell_check_id){
//       curElement = curElement.previousElementSibling;
//     }
//     let curApiResData = curElement._apiResponseData;
//     var suggNum = element.getAttribute("data-sugg_num");
//     closePopupifAnyOpenWithDiv();
//     createDivWithDiv(curElement);

//     curElement._popupIsOpen = true;
//     var tempDom_data;
//     var tipsCount = 0;
//     var spellCount = 0;

//     // $(element).append(DOM);
//     curApiResData = divideResDataIntoSuggestionAndTips(curApiResData);
//     spellCount = curApiResData.suggestion.length;
//     tipsCount = curApiResData.tips.length;

//     if(curApiResData.suggestion.length){
//       tempDom_data = tempDom.replace("spell-count", spellCount);
//       tempDom_data = tempDom_data.replace("tips-count", tipsCount);
//       // tempDom_data = tempDom_data.replace("advance-settings-count", "0");
    
//       $(element).append(tempDom_data);
//     }
//     for (var i = 0; i < curApiResData.suggestion.length; i++) {
//       var correction_box_data, warning_info_data;
//       var temp_correction_box1 = correction_box1;
//       if (curApiResData.suggestion[i].Suggestions.length > 1) {
//         temp_correction_box1 = correction_box1_hv_suggestions;
//       }
//       if (curApiResData.suggestion[i].Token) {
//         correction_box_data = temp_correction_box1.replace(
//           "incoorporate",
//           curApiResData.suggestion[i].Token
//         );
//       }
//       if (
//         curApiResData.suggestion[i].Suggestions.length > 0 &&
//         curApiResData.suggestion[i].Suggestions[0].Suggestion
//       ) {
//         correction_box_data = correction_box_data.replace(
//           "incorporate",
//           curApiResData.suggestion[i].Suggestions[0].Suggestion
//         );
//       } else {
//         correction_box_data = correction_box_data.replace("incorporate", "");
//       }
//       if (curApiResData.suggestion[i].Offset > -1) {
//         correction_box_data = correction_box_data.replace(
//           "offset-change",
//           curApiResData.suggestion[i].Offset
//         );
//         correction_box_data = correction_box_data.replace(
//           "suggestion_count_with_change",
//           suggNum
//         );
//         correction_box_data = correction_box_data.replace(
//           "offset-ignore",
//           curApiResData.suggestion[i].Offset
//         );
//         correction_box_data = correction_box_data.replace(
//           "suggestion_count_with_ignore",
//           suggNum
//         );
//       }
//       var popup_parent_html = $(".suggestions").append(correction_box_data);
//       if (curApiResData.suggestion[i].Suggestions.length > 1) {
//         createDrowpdownList(popup_parent_html, curApiResData.suggestion[i]);
//       }
//       if (
//         curApiResData.suggestion[i].Offset > -1 &&
//         !curApiResData.suggestion[i].Suggestions.length
//       ) {
//         $($(".actions")[$(".actions").length - 1]).remove();
//         if (curApiResData.suggestion[i].Suggestions.length === 1) {
//           $($(".hd-suggestions")[$(".hd-suggestions").length - 1]).remove();
//         } else if (curApiResData.suggestion[i].Suggestions.length > 1) {
//           $($(".hv-suggestions")[$(".hv-suggestions").length - 1]).remove();
//         }
//       }
//     }

//     if(curApiResData.suggestion.length && curApiResData.tips.length){
//       var temp_tips_title_DOM = tips_title_DOM
//       $('.scroll-y').append(temp_tips_title_DOM);
//     } else if(curApiResData.tips.length){
//       tempDom_data = tempDom_tips.replace("spell-count", spellCount);
//       tempDom_data = tempDom_data.replace("tips-count", tipsCount);
//       // tempDom_data = tempDom_data.replace("advance-settings-count", "0");
    
//       $(element).append(tempDom_data);
//     }
//     for(let t=0; t<curApiResData.tips.length; t++){
//       var temp_tipss_box = tipss_box, warning_info_data;
//       if(curApiResData.tips[t].Token){
//         warning_info_data = temp_tipss_box.replace(
//           "incoorporate",
//           curApiResData.tips[t].Token
//         );
//       }
//       if (curApiResData.tips[t].Tips) {
//         warning_info_data = warning_info_data.replace(
//           "Suggestion tip",
//           curApiResData.tips[t].Tips
//         );
//         if (curApiResData.tips[t].Offset > -1) {
//           warning_info_data = warning_info_data.replace(
//             "tips-suggestion",
//             curApiResData.tips[t].Offset
//           );
//         }
//         $(".tipss").append(warning_info_data);
//       }
//     }


//     for (var i = 0; i < popupPosition.length; i++) {
//       if (popupPosition[i] == "right") {
//         $(".popup-box").addClass("right-side");
//       } else if (popupPosition[i] == "left") {
//         $(".popup-box").addClass("left-side");
//       } else if (popupPosition[i] == "top") {
//         $(".popup-box").addClass("top-side");
//       } else if (popupPosition[i] == "bottom") {
//         $(".popup-box").addClass("bottom-side");
//       }
//     }
//     // $(".close-popup").bind("click", hidePopup);
//     $(".correct-option-parent").on("click", function() {
//       $(this).toggleClass("open");
//     });
//   }
// }

// function createDivWithDiv(curEle) {
//   let created_innerHtml = traverseTextRev(curEle);
//   curEle.innerHTML = created_innerHtml;
//   // createSuggestionBtn(ev.target);
// }

// function traverseTextRev(curEle) {
//   let n_text = "";
//   let skipText = false;
//   let t_innerHTML = curEle.innerHTML;
//   let cursor_pos = curEle._specText.length - 1;
//   let apiResponseDataIndex = 0;
//   let curApiResponse = curEle._apiResponseData;
//   t_innerHTML = t_innerHTML.split("&nbsp;").join(" ");
//   let temp_innerHTML = t_innerHTML;
//   for (let i = t_innerHTML.length - 1; i >= 0; i--) {
//     let cc = temp_innerHTML.charAt(i);
//     if (cc === ">") {
//       skipText = true;
//     }
//     if (cc === "<") {
//       // if (i + 1 > 0 && t_innerHTML.charAt(i + 1) === "/") {
//       //   n_text = " " + n_text;
//       //   cursor_pos--;
//       // }
//       skipText = false;
//       continue;
//     }
//     if (skipText) {
//       continue;
//     }
//     if (
//       apiResponseDataIndex < curApiResponse.length &&
//       cursor_pos === curApiResponse[apiResponseDataIndex].Offset
//     ) {
//       t_innerHTML = errorSpanReturn(
//         curApiResponse[apiResponseDataIndex],
//         t_innerHTML,
//         i
//       );
//       apiResponseDataIndex++;
//     }
    
//     cursor_pos--;
//     n_text = cc + n_text;
    
//   }
//   return t_innerHTML;
// }

// function errorSpanReturn(errorData, innerHTML_data, cur_pos) {
//   let temp_innerHTML = "";
//   let start_Html = innerHTML_data.slice(0, cur_pos);
//   // let cur_Html = `<span id=${errorSpanPrefixId}${errorData.Offset} class="livespell_redwiggle">${errorData.Token}</span>`
//   let fromErrorText = innerHTML_data.slice(cur_pos);
//   let error = "";
//   let skipText = false;
//   let errorTextArray = [];
//   let errorTextLength=0;
//   // let curLastPos = 0;
//   // let startIndex=cur_pos, endIndex=0;
//   let errorObj = {startIndex:cur_pos, endIndex: 0, errorText: ""};
//   for(let cl=0; errorTextLength<errorData.Token.length; cl++){
//     let cc = fromErrorText.charAt(cl);
//     if(cc === "<"){
//       errorObj.endIndex = cur_pos+cl;
//       errorObj.errorText = error
//       errorTextArray.push(Object.assign({}, errorObj));
//       skipText = true;
//     }else if (cc === ">"){
//       errorObj.startIndex = cur_pos+cl+1;
//       skipText = false;
//       error = "";
//       continue;
//     }
//     if(skipText){
//       continue;
//     }
//     error = error + cc;
//     errorTextLength++;
//     if(errorTextLength === errorData.Token.length){
//       errorObj.endIndex = cur_pos+cl+1;
//       // curLastPos = cl;
//     }
//   }
//   errorObj.errorText = error;
//   errorTextArray.push(Object.assign({}, errorObj));
//   let storedDivInnerHtml = "";
//   // let storedSpanArray = [];
//   for(let et=0; et<errorTextArray.length; et++){
//     let temp_div = document.createElement("div");
//     let storedSpan = document.createElement("span");
//     storedSpan.innerText = errorTextArray[et].errorText;
//     storedSpan.id = errorSpanPrefixId + errorData.Offset;
//     storedSpan.className = `${errorSpanPrefixId}${errorData.Offset}`;
//     // storedSpan.innerText = errorData.Token;
//     let tempInnerHtml = ""
//     if(et !== 0){
//       tempInnerHtml = innerHTML_data.slice(errorTextArray[et-1].endIndex, errorTextArray[et].startIndex);
//     }
//     storedSpan.className = storedSpan.className +" " + "help_to_rem";
//     if (errorData.Suggestions.length > 0) {
//       storedSpan.className = storedSpan.className + " " + "livespell_redwiggle";
//     }
//     if (errorData.Tips) {
//       storedSpan.className = storedSpan.className + " " + "livespell_bluewiggle";
//     }
//     temp_div.append(storedSpan);
//     storedDivInnerHtml = storedDivInnerHtml+tempInnerHtml+temp_div.innerHTML;
//   }
//   let end_Html = innerHTML_data.slice(errorTextArray[errorTextArray.length-1].endIndex);
//   temp_innerHTML = start_Html + storedDivInnerHtml + end_Html;
//   return temp_innerHTML;
// }
// /**
//  * get a data gramm id
//  */
// function generateARandomCode() {
//   let str = "";
//   for (let i = 0; i < 16; i++) {
//     if ((i % 4) - 3 === 0) {
//       str = str + "-";
//     }
//     str = str + getASingleletter();
//   }
//   return str;
// }

// function getASingleletter() {
//   let num = Math.trunc(Math.random() * 10 + 97);
//   if (Math.random() > 0.5) {
//     return String.fromCharCode(num);
//   } else {
//     return num;
//   }
// }

// var spellCheck = {
//   domChangeBool: false,
//   formGroupRef: "",
//   formManipulation: function(correctText) {
//     correctText = correctText.split("<br>").join("\n");
//     var that = this;
//     var data = {};
//     if (that["formControlName"]) {
//       data[that["formControlName"]] = correctText;
//     }
//     if (this.formGroupRef) {
//       this.formGroupRef.patchValue(data);
//       this.formGroupRef.controls[this.formControlName].markAsDirty();
//     }
//   },
//   formControlName: [],
//   ngModelName: "",
//   modelManipulation: function(element, updatedText) {
//     var range = element.ownerDocument.createRange();
//     range.selectNodeContents(element), range.deleteContents();
//     var fragment = range.createContextualFragment(updatedText);
//     element.appendChild(fragment);
//     var f = new DataTransfer();
//     f.setData("text/plain", updatedText);
//     element.dispatchEvent(
//       new ClipboardEvent("paste", {
//         clipboardData: f
//       })
//     );
//   }
// };

// function getDataFromCookie(cname){
//   var name = cname + "=";
//   var decodedCookie = decodeURIComponent(document.cookie);
//   var ca = decodedCookie.split(';');
//   for (let i = 0; i < ca.length; i++) {
//       let c = ca[i];
//       while (c.charAt(0) == ' ') {
//           c = c.substring(1);
//       }
//       if (c.indexOf(name) == 0) {
//           return c.substring(name.length, c.length);
//       }
//   }
//   return "";
// }
