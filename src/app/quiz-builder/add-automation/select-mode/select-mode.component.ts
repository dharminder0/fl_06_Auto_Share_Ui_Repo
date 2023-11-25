import { Component, OnInit } from '@angular/core';
import { QuizBuilderDataService } from '../../quiz-builder-data.service';

@Component({
  selector: 'app-select-mode',
  templateUrl: './select-mode.component.html',
  styleUrls: ['./select-mode.component.scss']
})
export class SelectModeComponent implements OnInit {

  public isActiveIcon: boolean = false;
  public isActiveIconScratch:boolean=false;

  constructor( private quizBuilderData :QuizBuilderDataService) { }

  ngOnInit() {
  }

  setTypeCategory(typeCategory)
  {
    this.quizBuilderData.setCategotyType(typeCategory);
  }
}
