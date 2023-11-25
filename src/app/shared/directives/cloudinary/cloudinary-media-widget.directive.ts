// /**
//  * @author : Renil Babu
//  * @date : 23/01/19
//  * *All prefixes of CU_* belong to cloudinary upload/normal upload
//  * *All prefixes of CM_* belong to cloudinary media upload
//  * *All prefixes of C_* are common variables/functions 
//  */
// import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
// import { Directive, HostListener, Output, EventEmitter, Input } from '@angular/core';
// import { ModalContentComponent } from './modal-selection.component';
// import { ACTION, ImageDimension, FILE_ERRORS } from './cloudinary-widget.util';
// import { environment } from '../../../../environments/environment';
// import { UserInfoService } from '../../services/security.service';
// import { HttpClient } from '@angular/common/http';

// declare var cloudinary: any;
// declare var $: any;

// @Directive({
//     selector: '[cloud]'
// })
// export class CloudinaryMediaWidgetDirective {
//     /* Modal Reference */
//     bsModalRef: BsModalRef;

//     /** Cloudinary Upload Configuration */
//     @Input() CU_configuration;

//     /** Custom Upload Image : If any. This image will be opened as default on cloudinary */
//     @Input() CU_image;

//     /** Emits the inserted object when media is inserted */
//     @Output() CU_whenImageInsertedUsingUploadWidget = new EventEmitter();

//     /** Tags for images: Can be used by both upload and media widget */
//     @Input() C_tags = [];

//     /** EMits the callback parameters when cloudinary upload is used */
//     @Output() CM_whenImageInsertedUsingMediaWidget = new EventEmitter();

//     @Input() CM_recommended_image_dimensions: ImageDimension;

//     /**Accepted formats for Cloudinary Media Widget */
//     @Input() CM_accepted_formats: string[] = [];

//     constructor(
//         private modalService: BsModalService,
//         private http: HttpClient,
//         private userInfoService :UserInfoService
//     ) { }

//     /** Click listener on directive */
//     @HostListener('click', ['$event'])
//     onClick(event: MouseEvent) {
//         this.openModalWithComponent()
//     }

//     /** NGX-Modal config */
//     private modal_config: ModalOptions = {
//         backdrop: true,
//         ignoreBackdropClick: true,
//     }

//     /** Opens Modal to choose upload option */
//     private openModalWithComponent() {
//         let info: string;
//         if (this.isAllDimensionsAllowed()) {
//             info = ""
//         } else {
//             info = `Image resolution should be ${this.CM_recommended_image_dimensions.width}X${this.CM_recommended_image_dimensions.height}`;
//         }
//         let title: string = 'Choose option to upload'
//         const initialState = {
//             title,
//             info
//         };
//         this.bsModalRef = this.modalService.show(ModalContentComponent, { initialState, ...this.modal_config });
//         this.bsModalRef.content.actionClickSubject.subscribe(actionType => {
//             switch (actionType) {
//                 case ACTION.USE_CLOUDINAY_MEDIA_WIDGET: this.initiateCloudinaryMediaWidget(); break;
//                 case ACTION.USE_CLOUDINAY_UPLOAD: this.openCloudinaryUploadWidget(); break;
//             }
//         })

//     }

//     /** 
//      * Checks if all image dimension is allowed or not. 
//      * If the @var CM_recommended_image_dimensions is empty,
//      * then it means that all dimensions are allowed
//      */
//     private isAllDimensionsAllowed(): boolean {
//         return !this.CM_recommended_image_dimensions;
//     }

//     /** Hide Modal */
//     private hideModal() {
//         this.bsModalRef.hide()
//     }

//     /** Initiate Cloudinary Media update widget */
//     private initiateCloudinaryMediaWidget() {
//         // let params = {
//         //     CloudName: environment.cloudinaryConfiguration.cloud_name,
//         //     Timestamp: Date.now(),
//         // }
//         // this.getSHA256ValueFromServer(params).subscribe(this.openCloudinaryMediaWidget)
//         this.openCloudinaryMediaWidget('signature')
//     }
//     // 251295234656565
//     // accounts@ignite.online
//     // 495a2adad28d632e2c1307cb2d70d40fbd49db2774f0470ac20c3d3efa090c89
//     // environment.cloudinaryConfiguration.cloud_name

//     /** Open Cloudinary Media Widget */
//     private openCloudinaryMediaWidget(signature) {
//         const cloudinary_media_widget_config = {
//             cloud_name: this.userInfoService._info.CloudinaryCompanyName,
//             api_key: this.userInfoService._info.CloudinaryApikey,
//             username: this.userInfoService._info.CloudinaryUsername,
//             timestamp: this.userInfoService._info.CloudinaryTimestamp,
//             signature: this.userInfoService._info.CloudinaryKey,
//             folder: this.userInfoService._info.CloudinaryBaseFolder,
//             multiple: false,
//         }
//         cloudinary.openMediaLibrary(cloudinary_media_widget_config, { insertHandler: this.insertHandler.bind(this) })
//     }

//     /** Insert Handler of Cloudinary Media Library. When useropens the media library widget and inserts an image then this insertHandler is called */
//     private insertHandler(data): void {

//         let image_height = data.assets[0].height;
//         let image_width = data.assets[0].width;
        
//         /**Extension of the file */
//         let format_type = data.assets[0].format;
        
//         /** Image or Video */
//         let resource_type = data.assets[0].resource_type;


//         let isFileImage: boolean = format_type === "jpeg" || format_type === "tiff" || format_type === "jpg" || format_type === "gif" || format_type === "png";
//         let isFileDoc: boolean = format_type === "text" || format_type === "doc" || format_type === "docx" || format_type === "pdf" || format_type === "ppt" || format_type === "pttx";
//         let isVideoType: boolean = resource_type == "video";

//         let isImageAllowed:boolean = isFileImage && this.CM_accepted_formats.indexOf(resource_type) > -1;
//         let isDocAllowed:boolean = isFileDoc && this.CM_accepted_formats.indexOf(format_type) > -1;
//         let isVideoAllowed:boolean = isVideoType && this.CM_accepted_formats.indexOf(resource_type) > -1;


//         let isSupportedResourceType: boolean = isImageAllowed || isDocAllowed || isVideoAllowed;
            

//         if (!isSupportedResourceType) {
//             this.informModalComponentAboutUnsupportedFormatType();
//         } else {
//             if (isVideoType || this.doesImageFallsInRecommendedDimension(image_height, image_width)) {
//                 this.hideModal();
//                 this.CM_whenImageInsertedUsingMediaWidget.emit(data);
//             } else {
//                 this.informModalComponentAboutDimensionMismatch();
//             }
//         }
//     }

//     /**Subject next to inform modal about wrong format type */
//     informModalComponentAboutUnsupportedFormatType(): void {
//         this.bsModalRef.content.showErrorBlock$.next({
//             type: FILE_ERRORS.WRONG_FORMAT,
//             errorMsg: "Format type not supported"
//         });
//     }

//     /** Subject to inform modal component that dimension mismatch has happened  */
//     informModalComponentAboutDimensionMismatch(): void {
//         this.bsModalRef.content.showErrorBlock$.next({
//             type: FILE_ERRORS.WRONG_DIMENSION,
//             errorMsg: `Image resolution should be ${this.CM_recommended_image_dimensions.width}X${this.CM_recommended_image_dimensions.height}`
//         });
//     }

//     /** 
//      * !DEPRICATED: SHA is managed in Validateuser api. 
//      *  Get SHA256 encrypted signature */
//     private getSHA256ValueFromServer(params : any) {
//         let { CloudName, Timestamp } = params
//         return this.http.get(`Integration/GetSHA256GeneratorValue?CloudName=${CloudName}&Timestamp=${Timestamp}`)

//     }

//     /** Open  Cloudinary Upload Widget*/
//     private openCloudinaryUploadWidget(): void {

//         this.hideModal();
//         var cloudinaryconfig = Object.assign({}, environment.cloudinaryConfiguration);

//         for (var key in this.CU_configuration) {
//             cloudinaryconfig[key] = this.CU_configuration[key];
//         }

//         /** Assign tags */
//         cloudinaryconfig['tags'] = this.C_tags

//         /** Initialize Cloudinary upload widget */
//         var widget = cloudinary.createUploadWidget(
//             cloudinaryconfig, (error, result) => {
//                 this.CU_whenImageInsertedUsingUploadWidget.emit({ error, result })
//             }
//         )
        

//         widget.open(this.CU_image);
//     }


//     /**
//      * *Checks if the image height received from the cloudinary media widget is below the recommended dimensions
//      * *If height or width is below the recommended dimension then false will be sent
//      * @param image_height : Image height
//      * @param image_width : Image width
//      */
//     private doesImageFallsInRecommendedDimension(image_height, image_width) {
//         if (this.isAllDimensionsAllowed()) {
//             return true;
//         } else {
//             let isHeightUnderRecommendedDimension: boolean = Number(image_height) >= Number(this.CM_recommended_image_dimensions.height);
//             let isWidthUnderRecommendedDimension: boolean = Number(image_width) >= Number(this.CM_recommended_image_dimensions.width);
//             return isHeightUnderRecommendedDimension && isWidthUnderRecommendedDimension
//         }
//     }




// }


