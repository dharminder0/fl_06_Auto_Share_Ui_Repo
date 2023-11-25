import { Component, OnInit, Input } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Config } from '../../../../../config';
import { SharedService } from '../../../../shared/services/shared.service';
import { LoaderService } from '../../../../shared/loader-spinner';

 
 
@Component({
  selector: 'app-multi-upload',
  templateUrl: './multi-upload.component.html',
  styleUrls: ['./multi-upload.component.css'],
  
})
  
export class MultiUploadComponent implements OnInit {
  
  uploader: FileUploader

  @Input() form: FormGroup;
  public config = new Config();
  public URL = `${new Config().automationApiUrl}v1/Quiz/UploadAttachment`;
  public apiSecret = new Config().ApiSecret;
  public myHeaders =  [{
    name:'ApiSecret',
    value: this.apiSecret},
    {
      name:'CompanyCode',
      value: this.sharedService.getCookie("clientCode")},
    {
    name:'JwtToken',
    value: this.sharedService.getCookie("token")
  }]
  public isActiveIcon: boolean = false;
  
  constructor(private sharedService: SharedService,
              private loaderService: LoaderService){}
  
  ngOnInit(){
    let maxFileSize= 10 * 1024 * 1024;
    this. uploader = new FileUploader({
      url: this.URL,
      allowedFileType: ['image', 'pdf', 'doc','xls','ppt'],
      maxFileSize: maxFileSize,
      headers: this.myHeaders
      });
     // this.uploader.onAfterAddingFile = (file) => file.withCredentials = false;

    this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false;
      this.loaderService.show();
    };
    this.uploader.response.subscribe(
    data => 
      { 
         if(data != '{"Message":"An error has occurred."}'){
          if(data && JSON.parse(data) && JSON.parse(data).data && JSON.parse(data).data.length>0){
            JSON.parse(data).data.forEach(item=>{
              (<FormArray>this.form.controls['TemplateAttachmentList']).push(this.pushData(item))
            });
          }
        }
      })
        
      this.uploader.onCompleteAll = () => {
        setTimeout(()=>{
          this.loaderService.hide();
        },800);
      };

    this.uploader.onWhenAddingFileFailed = (item, filter) => {
      let message = '';
      switch (filter.name) {
        case 'fileSize':
          message = 'The File ' + item.name + ' has ' + this.formatBytes(item.size) + ' that exceeds the maximum allowable size of ' + this.formatBytes(maxFileSize);
          break;
        default:
          message = "Error trying to include file '" + item.name +  "'. Please try again  with allowed file types['image', 'pdf', 'doc','xls','ppt'] of file size < 10MB";
          break;
      }
    
      alert(message);
    };
    }
  

  pushData(data){
    return new FormGroup({
      FileName: new FormControl(data.FileName),
      FileUrl: new FormControl(data.FileLink),
      FileIdentifier: new FormControl(data.FileIdentifier)
    })
  }
  private formatBytes(bytes, decimals?) {
    if (bytes == 0) return '0 Bytes';
    const k = 1024,
      dm = decimals || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      }

  // removeCurrentFile(item, name): void {
  //   var data =  (<FormArray>this.form.controls['TemplateAttachmentList']).value
  //  var index = this.findIndex(data, name);
  //   this.removeFromQueue(index);
  //   item.remove();
    
  // }
//  public findIndex(data, name) {
//     var indexNum = data.findIndex(obj => obj.FileName==name); 
//     return (indexNum+1);
//  }

  public removeFromQueue(index): void {  
    (<FormArray>this.form.controls['TemplateAttachmentList']).removeAt(index)
  }

  onFileSelected () {
    this.uploader.uploadAll();
  }
  

}



