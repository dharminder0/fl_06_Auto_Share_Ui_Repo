import { FroalaConfig } from "../../../../config";

declare var $: any;

export class FroalaEditorOptions{
    public editorRefernce;
    public editorOptions = {};
    private key = new FroalaConfig();
    setEditorOptions(limitVal?,placeHolder?){
        return this.editorOptions = {
            key : this.key.froalaKey,
            placeholderText: placeHolder ? placeHolder : '',
            inlineMode: true,
            charCounterCount: true,
            disableRightClick: true,
            charCounterMax:limitVal ? limitVal : 2000,
            toolbarButtons: ['bold', 'italic', 'underline','paragraphStyle' , '|', 'html', 'my_dropdown', 'paragraphFormat','fontSize','align',
                             'color','insertLink', 'formatOL', 'formatUL','insertTable','insertHR', 'formatBlock','fontAwesome'],
            events: {
              "froalaEditor.initialized": (e, editor) => {                                
                this.editorRefernce = editor;
                if(e.target.parentElement.classList.contains("template") || e.target.parentElement.classList.contains("has-variable")){
                  editor.toolbar.show();
                }
                else
                {                    
                  editor.toolbar.hide();
                }
                if(e.target.parentElement.classList.contains( 'template' )){                                
                  editor.events.bindClick($('body'), 'button#btn-variable', function () {
                    if(editor.selection.get() && editor.selection.get().anchorNode && editor.selection.get().anchorNode.parentNode && 
                      editor.selection.get().anchorNode.parentNode.parentNode && 
                      editor.selection.get().anchorNode.parentNode.parentNode.classList &&
                      editor.selection.get().anchorNode.parentNode.parentNode.classList.contains('fr-deletable')
                    ){
                      editor.selection.setAfter(editor.selection.get().anchorNode.parentNode.parentNode);
                      editor.selection.restore();
                    }
                    editor.selection.save();
                  });
                }
                if(e.target.parentElement.classList.contains( 'has-variable' )){                                
                  editor.events.bindClick($('body'), 'button#btn-variable-sms', function () {
                    if(editor.selection.get() && editor.selection.get().anchorNode && editor.selection.get().anchorNode.parentNode && 
                      editor.selection.get().anchorNode.parentNode.parentNode && 
                      editor.selection.get().anchorNode.parentNode.parentNode.classList &&
                      editor.selection.get().anchorNode.parentNode.parentNode.classList.contains('fr-deletable')
                    ){
                      editor.selection.setAfter(editor.selection.get().anchorNode.parentNode.parentNode);
                      editor.selection.restore();
                    }
                    editor.selection.save();
                  });
                }
                if(e.target.parentElement.classList.contains( 'has-followUp-variable' )){                                  
                  editor.events.bindClick($('body'), 'button#btn-variable-followUp', function () {
                    if(editor.selection.get() && editor.selection.get().anchorNode && editor.selection.get().anchorNode.parentNode && 
                    editor.selection.get().anchorNode.parentNode.parentNode && 
                    editor.selection.get().anchorNode.parentNode.parentNode.classList &&
                    editor.selection.get().anchorNode.parentNode.parentNode.classList.contains('fr-deletable')
                    ){
                      editor.selection.setAfter(editor.selection.get().anchorNode.parentNode.parentNode);
                      editor.selection.restore();
                    }
                    editor.selection.save();
                  });
                }                                
              },
              "froalaEditor.focus": (e, editor) => {                               
                if(e.target.classList.contains("text-view")){
                  editor.toolbar.hide();
                }else{
                  editor.toolbar.show();
                }
              },
              "froalaEditor.blur": (e, editor) => {
                if(e.target.parentElement.classList.contains("template") ||  e.target.parentElement.classList.contains("has-variable") || e.target.parentElement.classList.contains("has-followUp-variable")) {
                  editor.toolbar.show();
                }
                else 
                {
                  editor.toolbar.hide();
                }
              },
              "froalaEditor.commands.after": (e, editor, command) => {
                var btnEle = document.getElementById('btn-variable');
                // For code view command
                if (command == 'html' && btnEle) {
                  
                  if (editor.codeView.isActive()) {
                    btnEle.classList.add("disabled");
                  }
                  else{
                    if(btnEle.classList.contains("disabled")){
                      btnEle.classList.remove("disabled");
                    }
                  }
                }
              },
              "froalaEditor.commands.before": (e, editor, command) => {
                let range: any;
                if (window.getSelection) {
                  let selection = window.getSelection();
                  if (selection.rangeCount > 0) {
                    range = selection.getRangeAt(0);
                    if(range.startContainer.nodeName == "#text" && range.startContainer.parentNode && range.startContainer.parentNode.classList.contains("editor-var-tag")){
                      selection.removeAllRanges();
                    }else{
                      let clonedSelection = range.cloneContents();
                      if (clonedSelection.childNodes && clonedSelection.childNodes.length > 0) {
                        clonedSelection.childNodes.forEach((item: any) => {
                          if (item.classList && item.classList.contains('editor-var-tag')) {
                            selection.removeAllRanges();
                          }
                        });
                      }
                    }
                  }
                }
              },
              'froalaEditor.html.set': function (e, editor) {
                editor.events.trigger('charCounter.update');
              }
            },
            fontSize: ['8', '10', '11', '12','14','16','18','20','21','24','26','28','30','32', '60', '96'],
            toolbarInline: false,
            toolbarSticky: false,
            htmlExecuteScripts : false,
            enter: $.FroalaEditor.ENTER_BR,
            htmlUntouched:true,
            imageAllowedTypes: ['jpeg', 'jpg', 'png'],
            imageMove: false,
            imageTextNear: false,
            imageUploadRemoteUrls: false,
            imageInsertButtons: ['imageUpload','imageManager'],
            editorClass: 'custom-class',
            // imageUploadURL: cloudinaryConfig.cloudinaryUpload,
            imageEditButtons:['imageReplace', 'imageAlign', 'imageCaption', 'imageRemove', '|', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '-', 'imageDisplay', 'imageStyle', 'imageAlt', 'imageSize','alert','roundIcon'],
            imageUploadParams: {
                // upload_preset: configEnv.cloudinaryConfiguration.upload_preset
            },
            videoAllowedTypes: ['mp4', 'webm', 'ogg','avi','mov'],
            videoInsertButtons :['videoUpload'],
            videoMove: false,
            videoDefaultWidth: 400,
            // videoUploadURL: cloudinaryConfig.cloudinaryUpload,
            videoUploadParams: {
                // upload_preset: configEnv.cloudinaryConfiguration.upload_preset
            },
            colorsHEXInput: true,
            pastePlain: false,
            pluginsEnabled : ['align','colors','fontFamily','fontSize','image','imageManager','lineBreaker','link','lists','paragraphFormat','paragraphStyle','save','table','url','video','codeView','charCounter','charCounterCount','charCounterMax'],
            pasteDeniedAttrs:[]
        }
    }

    // dropdownBARResult(){
    //       $.FroalaEditor.DefineIcon('my_dropdown', {NAME: 'cog'});
    //       $.FroalaEditor.RegisterCommand('my_dropdown', {
    //         title: 'Insert Variable Field',
    //         type: 'dropdown',
    //         focus: false,
    //         undo: false,
    //         refreshAfterCallback: true,
    //         options: {
    //           '%fname%': 'First Name : %fname%',
    //           '%lname%': 'Last Name : %lname%',
    //           '%phone%': 'Phone : %phone%',
    //           '%email%': 'Email : %email%',
    //           '%qname%': 'Automation Name : %qname%',
    //           '%leadid%':'Lead Id : %leadid%',
    //           '%qendresult%': 'Automation End Result/Score : %qendresult%'
    //         },
    //         callback: function (cmd, val) {
    //             this.html.insert(val, false);
    //         },
    //       });
    // }

    customPopupBtn(){
      $.FroalaEditor.DefineIcon('my_dropdown', {NAME: 'cog'});
      $.FroalaEditor.RegisterCommand('my_dropdown', {
        title: 'Insert Variable Field',
        focus: false,
        undo: false,
        refreshAfterCallback: false,
        callback: function () {
          let self = this;
          if(self.selection.get() && self.selection.get().anchorNode && self.selection.get().anchorNode.parentNode && 
          self.selection.get().anchorNode.parentNode.parentNode && 
          self.selection.get().anchorNode.parentNode.parentNode.classList &&
          self.selection.get().anchorNode.parentNode.parentNode.classList.contains('fr-deletable')
            ){
              self.selection.setAfter(self.selection.get().anchorNode.parentNode.parentNode);
              self.selection.restore();
          }
          self.selection.save();
          if(self.$box.length > 0 && self.$box[0].id == 'froala-editor-sms'){
            document.getElementById('btn-variable-sms').click();
          }else if(self.$box.length > 0 && self.$box[0].id == 'froala-editor-followUp'){
            document.getElementById('btn-variable-followUp').click();
          }else{
            document.getElementById('btn-variable').click();
          }
        }
      });
    }
    // SS Custom plugin
    SSEditorCharCount(){
      // Add an option for your plugin.
      $.extend($.FroalaEditor.DEFAULTS, {
        ssCharCounterMax: -1,
        ssCharCounterCount: !0
      });
    
      // Define the plugin.
      // The editor parameter is the current instance.
      $.FroalaEditor.PLUGINS.ssCharCounter = function (editor) {
        var r;
    
        function i() {
          var content = editor.el.innerHTML;
          var doc = new DOMParser().parseFromString(content, 'text/html');
          var regXForVarFormula = /\{\{(([a-zA-Z0-9_]\.){0,1}[a-zA-Z0-9_])+\}\}/g;
          var list = content ? content.match(regXForVarFormula) : [];
          if(list && list.length > 0){
            list.map(formula => {
              let el:any = doc.getElementById(formula);
              if(el){
                el.replaceWith(el.value);
              }
            })
          }
          var tempContent = doc.body.innerHTML.replace(/<br(\s)*([^<])*>/g,"\n");
          // tempContent = tempContent.replace(/\n/g,'').length <= 0 ? tempContent.replace(/\n/g,'') : tempContent;
          tempContent = tempContent.match(/\n/g) && tempContent.match(/\n/g).length <= 1 ? tempContent.replace(/\n/g,'') : tempContent;
          var tempDivEl = document.createElement("div");
          tempDivEl.innerHTML = tempContent;
          return (tempDivEl.textContent|| tempDivEl.innerText || "").replace(/\u200B/g, "").length
        }
    
        function e(e) {
          if (editor.opts.ssCharCounterMax < 0) return !0;
          if (i() < editor.opts.ssCharCounterMax) return !0;
          var t = e.which;
          return !(!editor.keys.ctrlKey(e) && editor.keys.isCharacter(t) || t === $.FroalaEditor.KEYCODE.IME || t == $.FroalaEditor.KEYCODE.ENTER) || (e.preventDefault(), e.stopPropagation(), editor.events.trigger("charCounter.exceeded"), !1)
        }
    
        function t(e) {
          return editor.opts.ssCharCounterMax < 0 ? e : $("<div>").html(e).text().length + i() <= editor.opts.ssCharCounterMax ? e : (editor.events.trigger("charCounter.exceeded"), "")
        }
    
        function a() {
          if (editor.opts.ssCharCounterCount) {
            var e = i() + (0 < editor.opts.ssCharCounterMax ? "/" + editor.opts.ssCharCounterMax : "");
            r.text(e), editor.opts.toolbarBottom && r.css("margin-bottom", editor.$tb.outerHeight(!0));
            var t = editor.$wp.get(0).offsetWidth - editor.$wp.get(0).clientWidth;
            0 <= t && ("rtl" == editor.opts.direction ? r.css("margin-left", t) : r.css("margin-right", t))
          }
        }
    
        return {
          _init: function() {
              return !!editor.$wp && !!editor.opts.ssCharCounterCount && ((r = $('<span class="fr-ss-counter"></span>')).css({"bottom": "-19px","position": "absolute","display":"none"}), editor.$box.append(r), editor.events.on("keydown", e, !0), editor.events.on("paste.afterCleanup", t), editor.events.on("keyup contentChanged input", function() {
                  editor.events.trigger("charCounter.update")
              }), editor.events.on("charCounter.update", a), editor.events.trigger("charCounter.update"), void editor.events.on("destroy", function() {
                  $(editor.o_win).off("resize.char" + editor.id), r.removeData().remove(), r = null
              }))
          },
          count: i
        }
      }
    }
}
