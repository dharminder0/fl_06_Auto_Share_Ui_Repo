import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizBuilderApiService } from '../../quiz-builder-api.service';
import { FormGroup, FormControl } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { Font } from 'ngx-font-picker';
import { QuizzToolHelper } from '../quiz-tool-helper.service';
import { environment } from '../../../../environments/environment';
import { QuizBuilderDataService } from '../../quiz-builder-data.service';
import { Subscription } from 'rxjs';
import { Config } from '../../../../config';
import { CommonService } from '../../../shared/services/common.service';
declare var cloudinary: any;

@Component({
  selector: 'app-branding',
  templateUrl: './branding.component.html',
  styleUrls: ['./branding.component.css']
})
export class BrandingComponent implements OnInit {

  public quizId: number;
  public sub;
  public brandingData;
  public brandingForm: FormGroup;
  public backgroundColor;
  public isBackType;
  public backColor;
  public opacity;
  public buttoncolor;
  public buttonFontColor
  public optioncolor;
  public optionFontColor;
  public applyToAll;
  public filpBackGround:boolean=false;
  public fontcolor;
  public imageORvideo;
  public imageUploadType: number = 1;
  public imageUrl;
  public backImageFileURL;
  public logoUrl;
  public backgroundColorofSelectedAnswer;
  public backgroundColorofAnsweronHover;
  public answerTextColorofSelectedAnswer;
  public backgroundColorofLogo;
  public selectBackgroundImage:boolean=false;

  //mediafile
  public isVisibleMediaLibrary:boolean=false;
  public isBackgroundMediaLibrary:boolean=false;
  public section:string='';
  public config = new Config();

  public defaultImage:any="https://res.cloudinary.com/dbbkqtyqn/image/upload/v1588680596/Jobrock/automation-place-holder-corner.png";
  public fontFamilyArray = [
    {label: 'Arial', value: 'Arial'},
    {label: 'Helvetica', value: 'Helvetica'},
    {label: 'Times New Roman', value: 'Times New Roman'},
    {label: 'Courier New', value: 'Courier New'},
    {label: 'Tahoma', value: 'Tahoma'},
    {label: 'Verdana', value: 'Verdana'},
    {label: 'Georgia', value: 'Georgia'},
    {label: 'Impact', value: 'Impact'},
    {label: 'Arial Black', value: 'Arial Black'},
    {label: 'Trebuchet MS', value: 'Trebuchet MS'},
    {label: 'Lucida Console', value: 'Lucida Console'},
    {label: 'monospace', value: 'monospace'},
    {label: 'Montserrat', value: 'Montserrat'}
  ];
  public languages = [
    {value:'1', label:'DUTCH'},
    {value:'2', label:'ENGLISH'},
    {value:'3', label:'POLISH'}
  ];
  public alignment = [
    {value:'Center', label:'CENTER'},
    {value:'Left', label:'LEFT'},
    {value:'Right', label:'ALI_RIGHT'}
  ];
  public logoAlignment = [
    {value:'Left', label:'LEFT'},
    {value:'Right', label:'ALI_RIGHT'}
  ];
  public selectedFontType;
  public selectedLanguage:string;
  public selectedAlignment:string;
  public selectedLogoAlignment:string;
  public hoverOnImage:boolean=false;
  public isBackgroundImage:boolean;
  public isLogoImage:boolean;
  public font: Font = new Font({
    family: 'Roboto',
    size: '14px',
    style: 'regular',
    styles: ['regular']
  });

  constructor(private route: ActivatedRoute,
    private quizBuilderApiService: QuizBuilderApiService,
    private notificationsService: NotificationsService,
    private quizToolHelperService :QuizzToolHelper,
    private quizBuilderDataService:QuizBuilderDataService,
    private commonService:CommonService) {}

  ngOnInit() {

    /**
     * to Get QuizId from parent routing params
     */
    this.sub = this.route.parent.params.subscribe(param=>{
      this.quizId = +param['id']
    })

    this.createForm();
    this.fatchingBrandingDetails();
    this.onChangeBrandingValue();
  }
  
  /**
  * To Create New Form Instance
  */

  createForm(){
    this.brandingForm = new FormGroup({
      'QuizId': new FormControl(''),
      'BackgroundColor': new FormControl(''),
      'BackColor':new FormControl(''),
      "BackImageFileURL": new FormControl(''),
      "Opacity": new FormControl(''),
      "IsBackType": new FormControl(''),
      'ButtonColor': new FormControl(''),
      'ButtonFontColor':new FormControl(''),
      'OptionColor': new FormControl(''),
      'OptionFontColor': new FormControl(''),
      'ApplyToAll':  new FormControl(''),
      'FontColor': new FormControl(''),
      'FontType': new FormControl(''),
      'ImageFileURL': new FormControl(''),
      'BackgroundColorofSelectedAnswer':new FormControl(''),
      'BackgroundColorofAnsweronHover':new FormControl(''),
      'AnswerTextColorofSelectedAnswer':new FormControl(''),
      'LogoUrl':new FormControl(''),
      'Language':new FormControl(null),
      'AutomationAlignment':new FormControl(''),
      'BackgroundColorofLogo':new FormControl(''),
      'LogoAlignment':new FormControl(''),
      'Flip':new FormControl(''),
      'PublicIdForFileURL':new FormControl(''),
      'LogoPublicId':new FormControl('')
    });
  }

  /**
  * Api Integration: To Get Branding Details according to QuizId
  * Patch response Data to the form controls
  */

  fatchingBrandingDetails(){
    this.quizBuilderApiService.getBranding(this.quizId)
      .subscribe((data) => {
        this.brandingData = data;
        this.brandingForm.patchValue({
          'QuizId': data.QuizId,
          'BackgroundColor': data.BackgroundColor,
          'ButtonColor': data.ButtonColor,
          'ButtonFontColor': data.ButtonFontColor,
          'OptionColor': data.OptionColor,
          'OptionFontColor': data.OptionFontColor,
          'ApplyToAll': data.ApplyToAll,
          'FontColor': data.FontColor,
          'FontType': data.FontType?data.FontType:'Montserrat',
          'ImageFileURL': data.ImageFileURL,
          'IsBackType':data.IsBackType,
          "Opacity":data.Opacity,
          'BackColor':data.BackColor,
          'BackImageFileURL':data.BackImageFileURL,
          'BackgroundColorofSelectedAnswer':data.BackgroundColorofSelectedAnswer,
          'BackgroundColorofAnsweronHover':data.BackgroundColorofAnsweronHover,
          'AnswerTextColorofSelectedAnswer':data.AnswerTextColorofSelectedAnswer,
          'LogoUrl':data.LogoUrl,
          'Language':data.Language.toString(),
          'Alignment':data.AutomationAlignment,
          'BackgroundColorofLogo':data.BackgroundColorofLogo,
          'LogoAlignment':data.LogoAlignment,
          'Flip':data.Flip,
          'PublicIdForFileURL':data.PublicIdForFileURL,
          'LogoPublicId':data.LogoPublicId
        })
        this.imageUrl = data.ImageFileURL;
        this.selectedLanguage = data.Language.toString();
        this.selectedAlignment = data.AutomationAlignment;
        this.selectedLogoAlignment = data.LogoAlignment;
      },(error) => {
        this.notificationsService.error('Error');
      });
  }

  /**
   * form control value change when Image uploaded
   */
  onUploadedImage(e){
    this.brandingForm.patchValue({
      'ImageFileURL': e
    })
  }

  /**
   * Change color engine values when Form value changes
  */
  onChangeBrandingValue(){
    this.brandingForm.valueChanges
    .subscribe((data) => {
      let backgroundImage;
      let logoImage;
      this.backgroundColor = data.BackgroundColor;
      this.buttoncolor = data.ButtonColor;
      this.optioncolor = data.OptionColor;
      this.fontcolor = data.FontColor;
      this.buttonFontColor = data.ButtonFontColor;
      this.optionFontColor = data.OptionFontColor;
      this.applyToAll = data.ApplyToAll;
      this.backColor = data.BackColor;
      this.opacity = data.Opacity;
      this.isBackType = data.IsBackType;
      this.backgroundColorofLogo = data.BackgroundColorofLogo;
      this.filpBackGround = data.Flip;
      if(data.BackImageFileURL){
        this.isBackgroundImage=true;
        if(this.filpBackGround){
          backgroundImage = data.BackImageFileURL.replace('upload/', "upload/c_fill,w_274,h_136,g_auto,q_auto:best,f_auto,a_hflip/");
        }else{
          backgroundImage = data.BackImageFileURL.replace('upload/', "upload/c_fill,w_274,h_136,g_auto,q_auto:best,f_auto/");
        }
      }else{
        this.isBackgroundImage=false;
        backgroundImage = this.defaultImage.replace('upload/', "upload/c_fill,w_274,g_auto,q_auto:best,f_auto/");
      }
      if(data.LogoUrl){
        this.isLogoImage=true;
        logoImage = data.LogoUrl.replace('upload/', "upload/c_lpad,f_auto,h_136,w_274/");
      }else{
        this.isLogoImage=false;
        logoImage = this.defaultImage.replace('upload/', "upload/c_lpad,f_auto,h_136,w_274/");
      }
      this.backImageFileURL = backgroundImage;
      this.backgroundColorofSelectedAnswer = data.BackgroundColorofSelectedAnswer;
      this.backgroundColorofAnsweronHover = data.BackgroundColorofAnsweronHover;
      this.answerTextColorofSelectedAnswer = data.AnswerTextColorofSelectedAnswer;
      this.logoUrl = logoImage;
    })
  }

  setOpacity(event){

    if(event.color && event.slider == 'alpha'){
      var x = this.hexToRgbA(event.color).split(')')[0]+','+event.value.toFixed(2)+")";
      this.brandingForm.controls.Opacity.patchValue(x);
    }
  }
 hexToRgbA(hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',');
    }
    return hex
}

  changeDesktopType(data){

   this.brandingForm.controls.IsBackType.patchValue(data);
    this.isBackType = data;
  }

  /**
   * to decide which way to upload Image either 'url' or to 'select Image'
   */
  onSelectUploadImageType(id){
    this.imageUploadType = id;
  }

  
     //use Media Lib

     onUseMedia(){
      if(this.config.disableMedia){
        this.uploadBackgroundImage(false);
      }else{
      this.isVisibleMediaLibrary=true;
      this.section = 'logo';
      }
    }
    changeUploadedUrl(event){
      if(event.message == "success"){
        if(this.isVisibleMediaLibrary){
          this.brandingForm.controls.LogoUrl.patchValue(event.externalUrl);
          this.brandingForm.controls.LogoPublicId.patchValue(event.publicId);
          this.isVisibleMediaLibrary=false;
          this.section = '';
        }else if(this.isBackgroundMediaLibrary){
          this.brandingForm.controls.BackImageFileURL.patchValue(event.externalUrl);
          this.brandingForm.controls.PublicIdForFileURL.patchValue(event.publicId);
          this.isBackgroundMediaLibrary=false;
          this.selectBackgroundImage = false;
        }
      }
    }

   onBackgroundMedia(){
    if(this.config.disableMedia){
      this.uploadBackgroundImage(true);
    }else{
    this.selectBackgroundImage=true;
    this.isBackgroundMediaLibrary=true;
    }
  }

    uploadBackgroundImage(data:any) {
    var env_result = Object.assign({}, environment.cloudinaryConfiguration);
    env_result.cropping='';
    env_result.max_image_height='';
    env_result.max_image_width='';
    var widget = cloudinary.createUploadWidget(
      env_result,
      (error, result) => {
        if (!error && result[0].secure_url) {
          this.imageORvideo = this.commonService.getImageOrVideo(result[0].secure_url);
          var coordinate = "";
          if (
            result[0] &&
            result[0].coordinates &&
            result[0].coordinates.faces
          ) {
            var cloudCoordinate = result[0].coordinates.faces;
            coordinate = `x_${cloudCoordinate[0][0]},y_${
              cloudCoordinate[0][1]
              },w_${cloudCoordinate[0][2]},h_${cloudCoordinate[0][3]},c_crop`;
          }
          if (result[0].secure_url.match("upload")) {
            var index = result[0].secure_url.match("upload").index;
            result[0].secure_url =
              result[0].secure_url.slice(0, index + 6) +
              "/" +
              coordinate +
              result[0].secure_url.slice(index + 6 + Math.abs(0));
          }

          if(data){
            this.brandingForm.controls.BackImageFileURL.patchValue(result[0].secure_url);
          }else{
            this.brandingForm.controls.LogoUrl.patchValue(result[0].secure_url);
          }

        } else {
          console.log(
            "Error! Cloudinary upload widget error resultImage",
            error
          );
        }
      }
    );

    if(data){
      widget.open( this.brandingForm.controls.BackImageFileURL.value);
    }else{
      widget.open( this.brandingForm.controls.LogoUrl.value);
    }
  }

  removeBackgroundImage(){
    this.brandingForm.controls.BackImageFileURL.patchValue('');
  }

  removeBackgroundLogo(){
    this.brandingForm.controls.LogoUrl.patchValue('');
  }

  /**
   * Api Integration: To Update branding colors and image
   */
  onUpdateBranding(){
    this.quizBuilderApiService.addNewBranding(this.brandingForm.value)
    .subscribe((data) => {
      // this.notificationsService.success('Branding', 'Branding has been Updated');
    }, (error) => {
      // this.notificationsService.error('Branding', 'Something went wrong');
    });

    this.quizToolHelperService.setBrandingAndStyling(this.brandingForm.value);
    this.quizToolHelperService.setBrandingAndStylingSubmission()
  }

  onClose(){
    this.quizBuilderDataService.isStyleTabSubmission='true';
    this.quizBuilderDataService.changeStyleTabSubmission();
  }

}
