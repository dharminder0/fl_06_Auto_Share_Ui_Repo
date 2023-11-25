/**
 * Courtesy from third party Module:
 * Made local because third party was not working with angular 4.
 * https://github.com/amitmahida92/ng4-loading-spinner
 */
import { Component, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { LoaderService } from './loader-spinner.service';
import { Subscription } from 'rxjs/Subscription';

/**
 * @description 
 * @author Ankit Sharma
 * @export
 * @class LoaderSpinnerComponent
 * @implements {OnDestroy}
 * 
 */
@Component({
  selector: 'loading-spinner',
  templateUrl: './loader-spinner.component.html',
  styleUrls: ['./loader-spinner.component.css'],
  inputs: ['template', 'loadingText', 'zIndex'],
  encapsulation: ViewEncapsulation.None  // Use the native Shadow DOM to encapsulate our CSS
})
export class LoaderSpinnerComponent implements OnDestroy {

  /**
   * @description Default loading spinner template
   * @type {string}
   * @memberof LoaderSpinnerComponent
   */
  // _template: string = `
  // <div style="color: #64d6e2" class="la-ball-clip-rotate-multiple la-3x">
  //   <div></div>
  //   <div></div>
  //   <div></div>
  // </div>`;
   _template: string = `<div class="comp-overlay-full">
   <div class="comp-overlay-full-container">
     <span class="fa fa-spinner fa-2x fa-spin"></span>
   </div>
 </div>`;

  /**
   * @description Loading text
   * @type {string}
   * @memberof LoaderSpinnerComponent
   */
  _loadingText: string = '';


  /**
   * @description Defines threhold for not to diplay if time is less than 500ms
   * @type {number}
   * @memberof LoaderSpinnerComponent
   */
  _threshold: number = 500;

  /**
   * @description Defines z-index property of the loading text
   * @type {number}
   * @memberof LoaderSpinnerComponent
   */
  _zIndex: number = 9999;

  /**
   * @description Sets z-index for input text
   * @memberof LoaderSpinnerComponent
   */
  @Input()
  public set zIndex(value: number) {
    this._zIndex = value;
  }

  /**
   * @description returns z-index for input text 
   * @readonly
   * @type {number}
   * @memberof LoaderSpinnerComponent
   */
  public get zIndex(): number {
    return this._zIndex;
  }

  /**
   * @description Accepts custom template
   * @memberof LoaderSpinnerComponent
   */
  @Input()
  public set template(value: string) {
    this._template = value;
  }


  /**
   * @description Gives the current template
   * @readonly
   * @type {string}
   * @memberof LoaderSpinnerComponent
   */
  public get template(): string {
    return this._template;
  }


  /**
   * @description Accepts loading text string
   * @memberof LoaderSpinnerComponent
   */
  @Input()
  public set loadingText(value: string) {
    this._loadingText = value;
  }


  /**
   * @description Gives loading text
   * @readonly
   * @type {string}
   * @memberof LoaderSpinnerComponent
   */
  public get loadingText(): string {
    return this._loadingText;
  }


  /**
   * @description Accepts external threshold
   * @memberof LoaderSpinnerComponent
   */
  @Input()
  public set threshold(value: number) {
    this._threshold = value;
  }


  /**
   * @description 
   * @readonly
   * @type {number}
   * @memberof LoaderSpinnerComponent
   */
  public get threshold(): number {
    return this._threshold;
  }

  /**
   * Subscription
   * @type {Subscription}
   * @memberof LoaderSpinnerComponent
   */
  subscription: Subscription;

  /**
   * @description Show/hide spinner
   * @memberof LoaderSpinnerComponent
   */
  showSpinner = false;

  /**
   * Constructor
   * @param {LoaderService} spinnerService Spinner Service
   * @memberof LoaderSpinnerComponent
   */
  constructor(
    private spinnerService: LoaderService
  ) {
    this.createServiceSubscription();
  }

  /**
   * Destroy function
   * @memberof LoaderSpinnerComponent
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  /**
   * Create service subscription
   * @memberof LoaderSpinnerComponent
   */
  createServiceSubscription() {
    let timer: any;

    this.subscription =
      this.spinnerService.getMessage().subscribe(show => {
        if (show) {
          if(timer)
            return;

          timer = setTimeout(function () {
            timer = null;

            this.showSpinner = show;
          }.bind(this), this.threshold);
        } else {
          clearTimeout(timer);
          this.showSpinner = false;
        }
      });
      this.subscription = this.spinnerService.spinnerSubject
      .subscribe((data) => {
        this.showSpinner = data
      });
  }
}
