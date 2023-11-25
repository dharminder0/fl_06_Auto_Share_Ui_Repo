import { Component, OnInit } from '@angular/core';
import { UserInfoService } from '../../shared/services/security.service';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.scss']
})
export class AddQuizComponent implements OnInit {

  public isActiveIcon: boolean = false;
  public isPersonalityActionIcon: boolean = false;
  public isScoredActionIcon: boolean = false;
  public isNPSActionIcon: boolean = false;
  public userInfo: any = {};
  public isNpsPermission:boolean = false;

  constructor( private userInfoService: UserInfoService){}

  ngOnInit(){
    this.userInfo = this.userInfoService._info;
    this.isNpsPermission = this.userInfo.IsNPSAutomationPermission;
  }
}
