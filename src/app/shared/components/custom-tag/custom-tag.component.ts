import { Component, OnInit, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-custom-tag',
  templateUrl: './custom-tag.component.html',
  styleUrls: ['./custom-tag.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomTagComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CustomTagComponent),
      multi: true
    }
  ]
})

export class CustomTagComponent implements ControlValueAccessor, OnInit {

  @Input() quizId;
  @Input() tagArr;
  @Input() labelTxt;
  @Input() selectedColor;
  @Output() saveTagColor: EventEmitter<any> = new EventEmitter();
  @Output() removeTagColor: EventEmitter<any> = new EventEmitter();

  writeValue(value: any): void { }
  registerOnChange(fn: any): void { }
  registerOnTouched(fn: any): void { }
  setDisabledState?(isDisabled: boolean): void { }


  public COLORS;
  public savedColor: boolean = false;
  public tagDetails = {
      "QuizId": '',
      "QuizTagDetails": [
        {
          "TagColor": "",
          "LabelText": ""
        }
      ]
  };
  emptyTag = {
    'TagColor' : '',
    'LabelText' : ''
  }
  popover : any

  constructor() {
    this.COLORS = COLORS;
  }

  ngOnInit() {
    this.initializeTagOptions();
  }

  /** 
   * Initialize Tag Details against quizId
  */
  public initializeTagOptions() {
    this.tagDetails = {
      QuizId: this.quizId,
      QuizTagDetails : this.tagArr
      
    };
    if(this.tagArr.length != 0){
      this.savedColor=true;
    }
  }

  /**
   * Function call when popover open
   */

  openTag(tag,pop) {
    setTimeout(()=>{
      $(".input-box").focus();
    },50);
    this.popover = pop
    if(tag == null){
     this.emptyTag.LabelText = '';
     this.emptyTag.TagColor = this.COLORS[0].value;
    }
  }

  getColor(color,tag) {
    tag.TagColor = color;
  }

  /** 
   * Function call on save button clicked
  */

 entryTag(emptyTag){
   this.tagDetails.QuizTagDetails.push(emptyTag)
   this.saveColor()
   this.popover.hide();
 }
  saveColor() {
    this.savedColor = true;
    this.saveTagColor.emit(this.tagDetails);
    this.emptyTag = {'TagColor' : '','LabelText' : ''}
  }

  /** 
   * function call On remove button clicked 
  */
  removeColor(tag,i) {
    this.tagDetails.QuizTagDetails.splice(i,1);
    this.removeTagColor.emit(this.tagDetails)
  }

  /**
   * 
   * @param e string (changed label value)
   * function call on label value changed
   */
  onLabelChange(e,tag) {
    tag.LabelText = e.target.value.trim();
  }

  hidePopover(){
    if(!this.savedColor){
      this.tagDetails.QuizTagDetails['TagColor'] = ''
    }
  }

}


export const COLORS = [
  {
    id: 0,
    value: '#DC143C',
  }, {
    id: 1,
    value: '#FF6347',
  }, {
    id: 2,
    value: '#ffb200',
  }, {
    id: 3,
    value: '#66CD00',
  }, {
    id: 4,
    value: '#009B2B',
  }, {
    id: 5,
    value: '#00BFFF',
  }, {
    id: 6,
    value: '#4876FF',
  }, {
    id: 7,
    value: '#9A32CD',
  }, {
    id: 8,
    value: '#CD00CD',
  }, {
    id: 9,
    value: '#FF69B4',
  }
]