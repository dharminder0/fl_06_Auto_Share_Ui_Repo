import {
  Component,
  OnInit,
  Inject,
  Renderer2,
  OnDestroy
} from "@angular/core";

import { BsModalRef } from "ngx-bootstrap";
import { ActivatedRoute, Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';

@Component({
  selector: "app-template-preview",
  templateUrl: "./template-preview.component.html",
  styleUrls: ["./template-preview.component.scss"]
})
export class TemplatePreviewComponent implements OnInit, OnDestroy {
  public bodyTemplate;
  public bsModalRef: BsModalRef;
  public templateId;
  public showUseTemplateButton: boolean = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.changeBodyStyle();
    this.route.queryParams.subscribe(params => {
      this.templateId = params["templateId"];
      this.showUseTemplateButton = params['mode'] != 'view-only'
    });
  }

  changeBodyStyle() {
    this.bodyTemplate = this.document.body;
    this.renderer.setStyle(this.bodyTemplate, "overflow", "hidden");
  }

  openModal() {
    this.router.navigate(["", { outlets: { popup: null } }],{ queryParamsHandling: 'preserve' 
  });

    setTimeout(() => {
      this.router.navigate(['/quiz-builder', 'select-automation', 'add-quiz'],{ queryParams:{
        mode : "template",templateId:this.templateId
      }})
    });
  }

  ngOnDestroy() {
    this.renderer.setStyle(this.bodyTemplate, "overflow", "unset");
  }
}
