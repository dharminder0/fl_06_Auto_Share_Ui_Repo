import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import videojs from 'video.js';
import * as adapter from 'webrtc-adapter/out/adapter_no_global.js';
import * as RecordRTC from 'recordrtc';
import * as Record from 'videojs-record/dist/videojs.record.js';

@Component({
    selector: 'app-video-recording',
    templateUrl: './video-recoding.component.html',
    styleUrls: ['./video-recoding.component.scss']
})

export class VideoRecordingComponent implements OnInit {

    @Output() closePopup2 = new EventEmitter();
    // reference to the element itself: used to access events and methods
    private _elementRef: ElementRef

    // index to create unique ID for component
    idx = 'clip1';

    private config: any;
    private player: any;
    private plugin: any;

    constructor(elementRef: ElementRef) {
        this.player = false;

        // save reference to plugin (so it initializes)
        this.plugin = Record;

        // video.js configuration
        this.config = {
            controls: true,
            autoplay: false,
            fluid: false,
            loop: false,
            width: 500,
            height: 400,
            bigPlayButton: false,
            controlBar: {
                volumePanel: false
            },
            plugins: {
                // configure videojs-record plugin
                record: {
                    audio: true,
                    video: true,
                    maxLength: 180,
                    debug: true
                }
            }
        };
    }
    ngOnInit() { }

    // use ngAfterViewInit to make sure we initialize the videojs element
    // after the component template itself has been rendered
    ngAfterViewInit() {
        // ID with which to access the template's video element
        let el = 'video_' + this.idx;

        // setup the player via the unique element ID
        this.player = videojs(document.getElementById(el), this.config, () => {
            console.log('player ready! id:', el);

            // print version information at startup
            var msg = 'Using video.js ' + videojs.VERSION +
                ' with videojs-record ' + videojs.getPluginVersion('record') +
                ' and recordrtc ' + RecordRTC.version;
            videojs.log(msg);
        });

        // device is ready
        this.player.on('deviceReady', () => {
            console.log('device is ready!');
        });

        // user clicked the record button and started recording
        this.player.on('startRecord', () => {
            console.log('started recording!');
        });

        // user completed recording and stream is available
        this.player.on('finishRecord', () => {
            // recordedData is a blob object containing the recorded data that
            // can be downloaded by the user, stored on server etc.
            console.log('finished recording: ', this.player.recordedData);
        });

        // error handling
        this.player.on('error', (element, error) => {
            console.warn(error);
        });

        this.player.on('deviceError', () => {
            console.error('device error:', this.player.deviceErrorCode);
        });
    }


    decline() {
        this.closePopup2.emit();
    }

    // use ngOnDestroy to detach event handlers and remove the player
    ngOnDestroy() {
        if (this.player) {
            this.player.dispose();
            this.player = false;
        }
    }
}