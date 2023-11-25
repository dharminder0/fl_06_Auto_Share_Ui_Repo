import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-add-automation",
  templateUrl: "./add-automation.component.html",
  styleUrls: ["./add-automation.component.css"]
})
export class AddAutomationComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    localStorage.removeItem('use-template-category');
    localStorage.removeItem('use-template-type');
  }
}
