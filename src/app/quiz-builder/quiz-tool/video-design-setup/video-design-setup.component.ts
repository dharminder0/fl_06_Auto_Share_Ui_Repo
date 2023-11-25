import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { DynamicMediaReplaceMentsService } from "../dynamic-media-replacement";

@Component({
    selector: 'app-video-design-setup',
    templateUrl: './video-design-setup.component.html',
    styleUrls: ['./video-design-setup.component.scss']
})

export class VideoDesignSetupComponent implements OnInit, OnChanges {

  @Input() setFrameVideo:any;
  @Output() editSetFrameVideo: EventEmitter<any> = new EventEmitter<any>();
  isSetFrameEnable: boolean = false;
    secondsToApply:any;
    videoTimeDuration:any;

    hourTimeInput = new FormControl();
    secondTimeInput = new FormControl();
    msecondTimeInput = new FormControl();
    minuteTimeInput = new FormControl();
    public hourFocus = false ;
    public minuteFocus = false ;
    public secondFocus = false ;
    public msecondFocus = false ;
    hours :number = 0 ;
    minutes : number = 0 ;
    seconds : number = 0 ; 
    mseconds : number = 0 ;
    public tempSec  ;

    VideoFrameEnabled: boolean =  false;
    DescVideoFrameEnabled : boolean = false;

    constructor(private dynamicMediaService:DynamicMediaReplaceMentsService){}

    ngOnInit() {
      this.secondsToApply = this.setFrameVideo.secondsToApply;
      this.videoTimeDuration = this.setFrameVideo.videoDuration;
      this.VideoFrameEnabled = this.setFrameVideo.VideoFrameEnabled;
      this.setVaildTime();
      this.mseconds = 999 ;
      this.setValue();
      this.setMaxValue();
      this.timeChange();
      this.getSecondsToApplyDetails();
    }

    ngOnChanges() {
      // this.setValue();
      // this.setMaxValue();
    }

    getSecondsToApplyDetails(){
      let applySecs = parseInt(this.secondsToApply);
      let applyHours = Math.floor(applySecs / 60)
      if(applySecs && applyHours){
        this.getMin(applyHours);
      }
    }

    setVaildTime(){
      this.hours = Math.floor(this.videoTimeDuration / 60 / 60); 
      this.seconds = Math.floor(this.videoTimeDuration % 60);
      this.minutes = Math.floor(this.videoTimeDuration / 60);
      this.tempSec = Math.floor(this.videoTimeDuration % 60);
      this.setDataTime(this.hours,this.minutes, this.seconds);
    }

    setDataTime(hrs,min,sec){
        if(!hrs && !min && sec ){
          this.seconds = sec ;
          this.hours = 0 ;
          this.minutes = 0 ;
        }
         if(!hrs && min && min<=1 && !sec ){
          this.seconds = 60 ;
          this.minutes = 0 ;
          this.hours = 0 ;
        }else if (!hrs && min && min<=1 && sec){
          this.seconds = 60 ;
          this.minutes = min ;
          this.hours = 0 ;
        }
        else if(!hrs && min && min>1){
          this.seconds = 60 ;
          this.minutes = min ;
          this.hours = 0 ;
        }
        
        if(hrs && hrs<=1){
          this.seconds = 60 ;
          this.minutes = 60 ;
          this.hours = 0 ;
        }else if(hrs && hrs >1 ){
          this.seconds = 60 ;
          this.minutes = 60 ;
          this.hours = hrs ;
        }
    }

    setValue(){
        if(this.secondsToApply){
          let hours = Math.floor(this.secondsToApply / 60 / 60)
          let min = Math.floor(this.secondsToApply / 60 )
          let sec = Math.floor(this.secondsToApply % 60 )
          let msec = Math.floor(parseInt(String(this.secondsToApply).split('.')[1]))
          this.hourTimeInput.setValue(hours);
          this.minuteTimeInput.setValue(min);
          this.secondTimeInput.setValue(sec);
          (msec)?this.msecondTimeInput.setValue(msec):this.msecondTimeInput.setValue(0);
        }else{
        this.hourTimeInput.setValue(0);
        this.minuteTimeInput.setValue(0);
        this.secondTimeInput.setValue(0);
        this.msecondTimeInput.setValue(0);
        }
        this.hourTimeInput.updateValueAndValidity();
        this.secondTimeInput.updateValueAndValidity();
        this.minuteTimeInput.updateValueAndValidity();
        this.msecondTimeInput.updateValueAndValidity();
    }

    setMaxValue(){
        if(this.hours){
        this.hourTimeInput.enable();
        this.hourTimeInput.setValidators([Validators.required, Validators.max(this.hours),Validators.min(0)]);
        this.hourTimeInput.updateValueAndValidity();
        this.hourTimeInput.markAsTouched();
        }else{
          this.hourTimeInput.disable();
        }
        if(this.minutes){
          this.minuteTimeInput.enable();
        this.minuteTimeInput.setValidators([Validators.required,Validators.max(this.minutes),Validators.min(0)]);
        this.minuteTimeInput.updateValueAndValidity();
        this.minuteTimeInput.markAsTouched();
        }else{
          this.minuteTimeInput.disable();
        }
        if(this.seconds){
          this.secondTimeInput.enable();
        this.secondTimeInput.setValidators([Validators.required,Validators.max(this.seconds),Validators.min(0)]);
        this.secondTimeInput.updateValueAndValidity();
        this.secondTimeInput.markAsTouched();
        }else{
          this.secondTimeInput.disable();
        }
        if(this.mseconds){
          this.msecondTimeInput.enable();
        this.msecondTimeInput.setValidators([Validators.required,Validators.max(this.mseconds),Validators.min(0)]);
        this.msecondTimeInput.updateValueAndValidity();
        this.msecondTimeInput.markAsTouched();
        }else{
          this.msecondTimeInput.disable();
        }
    }

    setValidation(){
      if(this.hours){
        this.hourTimeInput.setValidators([Validators.required, Validators.max(this.hours),Validators.min(0)]);
        this.hourTimeInput.markAsTouched();
        }
        if(this.minutes){
        this.minuteTimeInput.setValidators([Validators.required,Validators.max(this.minutes),Validators.min(0)]);
        this.minuteTimeInput.markAsTouched();
        }
        if(this.seconds){
        this.secondTimeInput.setValidators([Validators.required,Validators.max(this.seconds),Validators.min(0)]);
        this.secondTimeInput.markAsTouched();
        }
        if(this.mseconds){
        this.msecondTimeInput.setValidators([Validators.required,Validators.max(this.mseconds),Validators.min(0)]);
        this.msecondTimeInput.markAsTouched();
        }
    }

    timeChange(){
        this.msecondTimeInput.valueChanges.subscribe(
          val =>{
             if(this.msecondTimeInput.valid){
              if(!val){
                this.secondsToApply = this.calSeconds() ;
                this.changeTime();
                return false;
               }
               else{
                if(val <= this.mseconds && val >= 0){  
                  if(val <10){
                    this.secondsToApply = parseFloat(parseInt(this.secondsToApply)+'.'+val); 
                  val =1000;
                  }
                  if(val <100){this.secondsToApply = parseFloat(parseInt(this.secondsToApply)+'.'+val).toFixed(2);
                  val =1000; 
                }
                 if(val < 1000){
                  this.secondsToApply = parseFloat(parseInt(this.secondsToApply)+'.'+val).toFixed(3); 
                 }
                 this.changeTime();
                }
               }
             }
          }
        )
        this.secondTimeInput.valueChanges.subscribe(
          val =>{
             if(this.secondTimeInput.valid){
              if(!val){
                this.secondsToApply = this.calSeconds() ;
                this.changeTime();
                return false;
               }
               else{
                if(val <= this.seconds && val >= 0){  
                  if(this.secondTimeInput.value){
                    this.secondsToApply= parseFloat(this.calSeconds()+'.'+Math.floor(this.msecondTimeInput.value));
                  }else{
                    this.secondsToApply = this.calSeconds() ;
                  }
                  this.changeTime();
                }
               }
             }
          }
        )
        this.minuteTimeInput.valueChanges.subscribe(
          val =>{
             if(this.minuteTimeInput.valid){
              if(!val){
                this.setVaildTime();
                this.setValidation();
                this.secondsToApply = this.calSeconds() ;
                this.changeTime();
                return false;
               }
               else{
                if(val <= this.minutes && val >= 0){ 
                  let temp ;
                  temp = this.tempSec 
                  if(val == this.minutes){
                    this.seconds = this.tempSec ; 
                    this.secondTimeInput.value <  this.seconds ? '':this.secondTimeInput.setValue(this.seconds);
                    this.secondTimeInput.updateValueAndValidity();
                    
                  }else{
                    
                    this.seconds = this.minutes ? 60 :this.tempSec ; 
                  }
                  if(this.secondTimeInput.value){
                    this.secondsToApply = parseFloat(this.calSeconds()+'.'+Math.floor(this.msecondTimeInput.value));
                  }else{
                    this.secondsToApply = this.calSeconds() ;
                  }
                  this.setValidation();
                  this.changeTime();
                }
               }
             }
          }
        )
    
        this.hourTimeInput.valueChanges.subscribe(
          val =>{
             if(this.hourTimeInput.valid){
              if(!val){
                this.secondsToApply = this.calSeconds() ;
                this.changeTime();
                return false;
               }
               else{
                if(val <= this.hours && val >= 0){ 
                  if(this.secondTimeInput.value){
                    this.secondsToApply = parseFloat(this.calSeconds()+'.'+Math.floor(this.msecondTimeInput.value));
                  }else{
                    this.secondsToApply = this.calSeconds() ;
                  }
                  this.changeTime();
                }
               }
             }
          }
        )
    }

    getMin(val){
      if(val <= this.minutes && val >= 0){ 
        let temp ;
        temp = this.tempSec 
        if(val == this.minutes){
          this.seconds = this.tempSec ; 
        }else{
          
          this.seconds = this.minutes ? 60 :this.tempSec ; 
        }
        this.setValidation();
      }
    }

    calSeconds(){
        let sum = 0 ;
        if(this.hourTimeInput.value){
          sum = sum + Math.floor(this.hourTimeInput.value * 60 *60)
        }
        if(this.minuteTimeInput.value){
          sum = sum + Math.floor(this.minuteTimeInput.value * 60 )
        }
        if(this.secondTimeInput.value){
          sum = sum + Math.floor(this.secondTimeInput.value)
        }

        if(this.msecondTimeInput.value <= this.mseconds && this.msecondTimeInput.value > 0 && sum == 0){  
          sum = parseFloat(sum+'.'+this.msecondTimeInput.value); 
        }
        return sum ;
    }
    setFrameEnable(){
        this.VideoFrameEnabled = this.VideoFrameEnabled ? false : true;
        this.editSetFrameVideo.emit({'videoFrameEnabled': this.VideoFrameEnabled});
        this.dynamicMediaService.isEnableSetFrameToggle = {'page': this.setFrameVideo.page, 'VideoFrameEnabled' : this.VideoFrameEnabled, 'id': this.setFrameVideo.id,};
        this.dynamicMediaService.setFrameEnableChange();
    }

    changeTime(){
      this.editSetFrameVideo.emit({'secToApply': this.secondsToApply, 'check':"forSecToapply"});
      this.dynamicMediaService.videoTimeChange = { 'page': this.setFrameVideo.page,'secToApply':this.secondsToApply,'id':this.setFrameVideo.id};
      this.dynamicMediaService.changeVideoTimeChange();
    }

}