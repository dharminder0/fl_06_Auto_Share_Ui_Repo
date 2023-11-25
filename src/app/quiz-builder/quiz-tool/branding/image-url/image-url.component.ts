import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-image-url',
  templateUrl: './image-url.component.html',
  styleUrls: ['./image-url.component.css']
})
export class ImageUrlComponent implements OnInit {

  @Input() imageUrl;
  @Input() formName;
  constructor(private fb:FormBuilder) { }

  ngOnInit() {
    this.formName.addControl('ImageFileURL', this.createControl());
  }
  
  /** 
   * to create New Form Control
  */
  createControl(){
    return this.fb.control(this.imageUrl);
  }

}
