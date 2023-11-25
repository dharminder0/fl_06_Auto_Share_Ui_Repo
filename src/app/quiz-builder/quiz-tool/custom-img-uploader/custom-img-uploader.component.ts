import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { QuizBuilderApiService } from '../../quiz-builder-api.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-custom-img-uploader',
  templateUrl: './custom-img-uploader.component.html',
  styleUrls: ['./custom-img-uploader.component.css']
})
export class CustomImgUploaderComponent implements OnInit {

  public quizId;
  public imageUploaderForm: FormGroup;

  constructor(private route: ActivatedRoute,
  private quizBuilderApiService: QuizBuilderApiService,
  private notificationsService: NotificationsService) { }

  ngOnInit() {
    /**
     * to gwt the QuizId via parent routing params
     */
    this.route.parent.params
    .subscribe((params) => {
      this.quizId = +params['id'];
    });

    /**
     * Create new Form Instance
     */
    this.imageUploaderForm = new FormGroup({
      'QuizId': new FormControl(''),
      'QuizCoverImage': new FormControl(''),
      'QuizCoverImgXCoordinate': new FormControl(''),
      'QuizCoverImgYCoordinate': new FormControl(''),
      'QuizCoverImgHeight': new FormControl(''),
      'QuizCoverImgWidth': new FormControl(''),
      'QuizCoverImgAttributionLabel': new FormControl(''),
      'QuizCoverImgAltTag': new FormControl('')
    });

    /**
     * Api Integration: To Get Cover Details according to the QuizId
     * Patch the response data to the form
     */
    this.quizBuilderApiService.getQuizCoverDetails(this.quizId)
    .subscribe((data) => {
      this.imageUploaderForm.patchValue({
        'QuizId': this.quizId,
        'QuizCoverImage': data.QuizCoverImage,
        'QuizCoverImgXCoordinate': data.QuizCoverImgXCoordinate,
        'QuizCoverImgYCoordinate': data.QuizCoverImgYCoordinate,
        'QuizCoverImgHeight': data.QuizCoverImgHeight,
        'QuizCoverImgWidth': data.QuizCoverImgWidth,
        'QuizCoverImgAttributionLabel': data.QuizCoverImgAttributionLabel,
        'QuizCoverImgAltTag': data.QuizCoverImgAltTag
      });
    },(error) => {
      this.notificationsService.error('Error');
    });
  }

  onCroppedIMage(){
    this.quizBuilderApiService.uploadCoverImage(this.imageUploaderForm.value)
    .subscribe((data) => {
      this.notificationsService.success('Custom-Img-Uploader', 'Cover-Image has been Updated');
    }, (error) => {
      this.notificationsService.error('Custom-Img-Uploader', 'Something Went Wrong');
    });
  }
}
