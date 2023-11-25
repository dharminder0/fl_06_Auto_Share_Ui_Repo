import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.css']
})
export class ErrorsComponent implements OnInit {

  constructor(private sharedService: SharedService) { }
  public errorMessage;
  public errorMessage1;
  ngOnInit() {
    this.errorMessage1 = this.sharedService.getErrorFromBackendMessage1();
    this.errorMessage1.message != "" ? this.errorMessage = '' : this.errorMessage = this.sharedService.getErrorMessage();
  }
}
