// import { OnInit, Component, OnDestroy } from "@angular/core";
// import { BsModalRef } from "ngx-bootstrap";
// import { Subject, Subscription } from "rxjs";
// import { ACTION, FILE_ERRORS } from "./cloudinary-widget.util";

// @Component({
//     selector: 'modal-content',
//     styles: [
//         `
//         `
//     ],
//     template: `
//       <div class="modal-header">
//         <h4 class="modal-title pull-left">{{title}}</h4>
//         <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
//           <span aria-hidden="true">&times;</span>
//         </button>
//       </div>
//       <div class="modal-body">
//          <div class="row">
//              <div class="col-sm-6" *ngIf="showTryAgainButtonForWrongDimension">
//              <div class="card-widget"> <button class="btn btn-success" (click)="onActionClick(ACTION.USE_CLOUDINAY_MEDIA_WIDGET)">Try Again</button>
//                 <span class="error">{{errorMessageForWrongDimension}}</span>
//                 </div>
//              </div>
//              <div *ngIf="!showTryAgainButtonForWrongDimension" class="col-sm-6"  (click)="onActionClick(ACTION.USE_CLOUDINAY_MEDIA_WIDGET)"><div class="card-widget"><i class="fa fa-cloud-upload"></i>Use Existing Media</div></div>
//              <div class="col-sm-6" (click)="onActionClick(ACTION.USE_CLOUDINAY_UPLOAD)"><div class="card-widget"><i class="fa fa-upload"></i>Upload From Local</div></div>
//          </div>
//          <small class="hint">{{info}}</small>
//       </div>
//     `
// })

// export class ModalContentComponent implements OnInit, OnDestroy {

//     /**Info: this is received from the modalcomponent */
//     info:string = ""
    
//     /** Header Title */
//     title: string;

//     /** Action List */
//     ACTION = ACTION;

//     /** Action Click Subject to inform the cloudinary directive about the event */
//     actionClickSubject = new Subject();

//     /** Boolean variable to toggle Try Again button if user inserts wrong dimension image */
//     showTryAgainButtonForWrongDimension:boolean = false;

//     /** Error message to show if user inserts wrong dimension image */
//     errorMessageForWrongDimension:string = "";

//     /** Subject : Triggered from the directive when user inserts wrong dimension image */
//     showErrorBlock$ = new Subject();

//     /** Subscription container */
//     subscription:Subscription;

//     constructor(public bsModalRef: BsModalRef) {}

//     ngOnInit() {
//         this.whenErrorListener();
//     }

//     /** This function is triggered from the directive when the user inserts wrong dimention/format image */
//     whenErrorListener(){
//         this.subscription = this.showErrorBlock$.subscribe(error=>{

//             let isWrongDimensions:boolean = error && error['type'] == FILE_ERRORS.WRONG_DIMENSION
//             let isWrongFormat:boolean = error && error['type'] == FILE_ERRORS.WRONG_FORMAT

//             if(isWrongDimensions || isWrongFormat){
//                 this.showTryAgainButtonForWrongDimension = true;
//                 this.errorMessageForWrongDimension = error['errorMsg']
//             }else{
//                 this.showTryAgainButtonForWrongDimension = false;
//                 this.errorMessageForWrongDimension = ""
//             }
//         })
//     }

//     /** When Action Button Clicked is emitted to the directive */
//     onActionClick(actionType) {
//         switch (actionType) {
//             case ACTION.USE_CLOUDINAY_MEDIA_WIDGET: this.actionClickSubject.next(ACTION.USE_CLOUDINAY_MEDIA_WIDGET); break;
//             case ACTION.USE_CLOUDINAY_UPLOAD: this.actionClickSubject.next(ACTION.USE_CLOUDINAY_UPLOAD); break;
//             default: throw new Error("Unrecognized action");
//         }
//     }

//     ngOnDestroy(){
//         try{
//             this.subscription.unsubscribe()
//         }catch(e){
//             console.warn(e);
//         }
//     }
// }
