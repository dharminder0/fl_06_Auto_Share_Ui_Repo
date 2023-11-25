import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Renderer2} from '@angular/core';

@Component({
    selector: 'app-recording',
    templateUrl: './recording.component.html',
    styleUrls: ['./recording.component.scss']
})

export class RecordingComponent implements OnInit {

    @Output() closePopup = new EventEmitter();
    @ViewChild('video', { static: true }) videoElement: ElementRef;
    @ViewChild('canvas', { static: true }) canvas: ElementRef;
    constraints = {
        video: {
            facingMode: "environment",
            width: { ideal: 4096 },
            height: { ideal: 2160 }
        }
    };

    constructor(private renderer: Renderer2) { }

    ngOnInit() {
        this.startCamera();

    }

    startCamera() {
        if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) { 
     navigator.mediaDevices.getUserMedia({ video: true }).then(this.attachVideo.bind(this)).catch(this.handleError);
        } else {
            alert('Sorry, camera not available.');
        }
    }

    handleError(error) {
        console.log('Error: ', error);
    }

    videoWidth = 0;
    videoHeight = 0;

    attachVideo(stream) {
        this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
        this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
            this.videoHeight = this.videoElement.nativeElement.videoHeight;
            this.videoWidth = this.videoElement.nativeElement.videoWidth;
        });
    }

    capture() {
        this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
        this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
        this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
    }

    decline() {
        this.closePopup.emit();
    }
}