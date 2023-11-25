// import { Component, OnInit, Input, SimpleChange, ViewChild, ViewContainerRef, Output, EventEmitter } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';

// declare var $: any;
// @Component({
//   selector: 'app-upload-image',
//   templateUrl: './upload-image.component.html',
//   styleUrls: ['./upload-image.component.css']
// })
// export class UploadImageComponent implements OnInit {

//   public imageUploadUrl;
//   @Input() formName:FormGroup;
//   @ViewChild('imageUpload', {static:false}) private imageUpload: ViewContainerRef;
//   @Output() uploadImage: EventEmitter<any> = new EventEmitter();
//   @Input() imageUrl;
//   public image = [];
//   myHeaders = {
//     'ApiSecret': '9a597082778a42268b33e56ce96dd45a',
//     'UserToken': 'b134bd51-9ec2-4082-a346-3b007ce61425'
//   }
//   constructor(private fb: FormBuilder) { }

//   ngOnInit() {
//     this.imageUploadUrl = "http://192.168.22.135:7881/api/v1/Quiz/UploadImage";

//     this.formName.valueChanges.subscribe((simplechanges:SimpleChange)=>{
      
//       this.src = simplechanges['ImageFileURL'].toString();
      
//     });

    
//   }

//   onImageRemoved() {
//     $('.no-image').css('z-index', 1);
//     this.formName.patchValue({
//       'ImageFileURL': ''
//     });
//     this.image = [];
//   }
//   onUploadFinished(event) {
//     $('.no-image').css('z-index', 0);
//     this.uploadImage.emit(event.serverResponse.json().data);

//   }
//   public fileCounter: number = 0;

//   src: string = "";
//   resizeOptions: ResizeOptions = {
//       resizeMaxHeight: 128,
//       resizeMaxWidth: 128
//   };

//   selected(imageResult: ImageResult) {
//       this.src = imageResult.resized
//           && imageResult.resized.dataURL
//           || imageResult.dataURL;
//   }
// }
