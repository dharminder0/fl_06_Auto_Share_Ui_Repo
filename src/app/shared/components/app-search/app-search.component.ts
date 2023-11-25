import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Input,
  HostListener
} from "@angular/core";
import { DebounceService } from "./debounce.service";

@Component({
  selector: "app-app-search",
  templateUrl: "./app-search.component.html",
  styleUrls: ["./app-search.component.css"]
})
export class AppSearchComponent implements OnInit {
  @Output()
  searchText: EventEmitter<any> = new EventEmitter();

  @Input()
  placeholder: any;

  @ViewChild("textInput", { static:true})
  textInput: ElementRef;

  _searchTextModel = "";
  @Input()
  set searchTextModel(value) {
    this._searchTextModel = "";
  }
  constructor(private debounce: DebounceService) {}

  ngOnInit() {
  }

  search(keyword) {
    this._searchTextModel = keyword;

    this.debounce.delay(keyword).then((data: any) => {
      this.searchText.emit(encodeURIComponent(keyword.trim()));
    });
  }

  onSearchBoxEmpty(){
    this._searchTextModel = "";

    this.debounce.delay("").then((data: any) => {
      this.searchText.emit("");
    });
  }
}



