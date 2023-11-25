import { Component, OnInit } from '@angular/core';
import { UserInfoService } from '../../shared/services/security.service';

@Component({
  selector: 'app-sidebar-right',
  templateUrl: './sidebar-right.component.html',
  styleUrls: ['./sidebar-right.component.css']
})
export class SidebarRightComponent implements OnInit {
public CreateTemplate;
public CreateTemplateEnabled;

  constructor(private userInfoService : UserInfoService) { }

  ngOnInit() {
    this.CreateTemplate =  this.userInfoService._info.CreateTemplate;
    this.CreateTemplateEnabled = this.userInfoService._info.CreateTemplateEnabled;
  }

}
