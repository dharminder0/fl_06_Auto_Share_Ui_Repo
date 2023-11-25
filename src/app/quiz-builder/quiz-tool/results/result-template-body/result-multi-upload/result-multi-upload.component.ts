import { Component, OnInit, Input,TemplateRef } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Config } from '../../../../../../config';
import { SharedService } from '../../../../../shared/services/shared.service';
import { LoaderService } from '../../../../../shared/loader-spinner';
 
@Component({
  selector: 'app-result-multi-upload',
  templateUrl: './result-multi-upload.component.html',
  styleUrls: ['./result-multi-upload.component.css'],
  
})
  
export class ResultMultiUploadComponent implements OnInit {
  uploader: FileUploader
  @Input() form: FormGroup;
  public config = new Config();
  public URL = `${new Config().apiUrl}Quiz/UploadAttachment`;
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

  constructor(private sharedService: SharedService,
              private loaderService: LoaderService){}
  
  ngOnInit(){
    let maxFileSize= 10 * 1024 * 1024
    this. uploader = new FileUploader({
      url: this.URL,
      allowedFileType: ['image', 'pdf', 'doc','xls','ppt'],
      maxFileSize: maxFileSize,
      headers: this.myHeaders
      });

    this.uploader.onAfterAddingFile = (file) => file.withCredentials = false;

    this.uploader.response.subscribe(
      data => 
        {
          if(data != '{"Message":"An error has occurred."}'){
            this.loaderService.show();
            if(JSON.parse(data).data && JSON.parse(data).data.length>0){
              JSON.parse(data).data.forEach(item=>{
                (<FormArray>this.form.controls['TemplateAttachmentList']).push(this.pushData(item))
              });
            }
            setTimeout(()=>{
              this.loaderService.hide();
            },800);
          }
         },error => {
          this.loaderService.hide();
        }
        );
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
public makedirty(){
  this.form.controls['TemplateAttachmentList'].markAsDirty();

}
  public removeFromQueue(index): void { 
    this.makedirty() ;
    (<FormArray>this.form.controls['TemplateAttachmentList']).removeAt(index)
  }

  onFileSelected () {
    this.makedirty();
    this.uploader.uploadAll();
  }
  


}

