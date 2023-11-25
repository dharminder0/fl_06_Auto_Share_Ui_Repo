import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { UserInfoService } from '../../shared/services/security.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public companyName: string = "";
  public uiFooter;

  constructor(private sharedService: SharedService,
    private usernfoService :UserInfoService) { }

  ngOnInit() {
    this.companyName = this.sharedService.getProjectTitle();
    this.uiFooter =this.usernfoService._info.UiFooter;
  }

}
