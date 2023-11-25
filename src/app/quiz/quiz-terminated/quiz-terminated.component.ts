import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { QuizDataService } from '../quiz-data.service';

@Component({
  selector: 'app-quiz-terminated',
  template: `
  <div class="container error">
    <!-- <h2 class="error-status">We're sorry</h2> -->
    <p class="error-message">Quiz End</p>
  </div>
`,
  styleUrls: ['./quiz-terminated.component.css']
})
export class QuizTerminatedComponent implements OnInit {

  constructor(private router: Router,
    private titleService: Title,
    private quizDataService: QuizDataService) { }

  ngOnInit() { 
    this.titleService.setTitle( this.quizDataService.defaultTitle +" "+ "| Jobrock");
    this.router.navigate(['',{ outlets: { popup: null }}]);
  }

}
