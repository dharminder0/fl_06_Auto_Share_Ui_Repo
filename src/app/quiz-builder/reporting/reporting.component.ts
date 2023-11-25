import { Component, OnInit, AfterViewInit, AfterViewChecked, Inject } from '@angular/core';
import { QuizBuilderApiService } from '../quiz-builder-api.service';
import { ActivatedRoute } from '@angular/router';
import { Moment } from 'moment';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { NotificationsService } from 'angular2-notifications';
import { DOCUMENT } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css']
})
export class ReportingComponent implements OnInit, AfterViewInit, AfterViewChecked {
  public quizList;
  public countData = 0;
  public dropdownList = [];
  public selectedItems = [];
  public dropdownSettings = {};
  public reportingDetailList;
  public daterangepickerModel: Date[];
  public minDate;
  public maxDate;
  public quizIdList = [];
  public aggregateReportingData;
  public individualReportingData;
  public multi: any[];
  public individualReporting = [];
  public conversion1 = 'Views';
  public conversion2 = 'Leads';
  public sortByDate = false;
  public sortByName;
  public sortByTotals;
  public sortByConversion;
  public conversionOption1 = [
    { label: 'Views', value: 'Views' },
    { label: 'Starts', value: 'Starts' },
    { label: 'Completions', value: 'Completions' }
  ];
  public conversionOption2 = [
    { label: 'Starts', value: 'Starts' },
    { label: 'Completions', value: 'Completions' },
    { label: 'Leads', value: 'Leads' }
  ]
  view: any[] = [$('body').width() - 0.1 * $('body').width(), 250];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = 'count';
  timeline = true;

  // line, area
  autoScale = true;

  constructor(private quizBuilderApiService: QuizBuilderApiService,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private notificationsService: NotificationsService) { }

  ngOnInit() {
    /**
     * Get quizListing data via resolver
     */
    this.quizList = this.route.snapshot.data['quizList']

    if (this.quizList.length > 0) {
      this.quizList.forEach(quiz => {
        this.dropdownList.push({
          id: quiz.Id,
          itemName: quiz.QuizTitle
        });
        this.quizIdList.push(quiz.Id);
      });
      var sortedQuizList = this.quizList.sort((a, b) => {
        if (a.createdOn > b.createdOn) {
          return 1;
        }
        else {
          return -1;
        }
      })
      this.minDate = new Date(sortedQuizList[0].createdOn);
      this.maxDate = new Date();
      this.daterangepickerModel = [this.minDate, this.maxDate];
      this.selectedItems = this.dropdownList.slice();
      this.multi = [];
      this.getQuizReportingDetails(this.quizIdList.toString(), moment(this.daterangepickerModel[0]).format('l'), moment(this.daterangepickerModel[1]).format('l'), this.conversion2, this.conversion1)
    }

    this.dropdownSettings = {
      singleSelection: false,
      text: "Select Quizzes",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass custom-class-example",
      badgeShowLimit: 0
    };
  }

  /**
   * Get quiz Reporting Details data against QuizIdList,fromDate,toDate,conversion2 and conversion1
   * Api Integration
   */

  getQuizReportingDetails(quizIdList, fromDate, toDate, conversion2, conversion1) {
    this.quizBuilderApiService.getQuizReportingDetails(quizIdList, fromDate, toDate, conversion2, conversion1)
      .subscribe((data) => {
        this.reportingDetailList = data;
        this.aggregateReportingData = JSON.parse(JSON.stringify(data.AggregatedReporting));
        this.individualReportingData = JSON.parse(JSON.stringify(data.IndividualReporting));
        this.multi = []
        this.multi.push(data.AggregatedReporting);
        this.individualReporting = data.IndividualReporting;
        this.process(this.multi[0]);
        this.individualReporting.forEach(quizReport => {
          this.process(quizReport.data);
        });
        this.individualReporting.forEach(quiz => {
          quiz.createdOnFormat = moment(quiz.createdOn).format('ll');
        });
        this.countData = 0;
      }, (error) => {
        this.notificationsService.error('Error')
      });
  }

  /**on sortby date button clicked */
  onSortedByDate() {
    this.sortByDate = !this.sortByDate;
    this.sortByConversion = null;
    this.sortByName = null;
    this.sortByTotals = null;
  }

  /**on sortby name button clicked */
  onSortedByName() {
    this.sortByName = !this.sortByName;
    this.sortByConversion = null;
    this.sortByDate = null;
    this.sortByTotals = null;
  }

  /**on sortby totals button clicked */
  onSortedByTotals() {
    this.sortByTotals = !this.sortByTotals;
    this.sortByConversion = null;
    this.sortByDate = null;
    this.sortByName = null;
  }

  /**on sortby conversion button clicked */
  onSortedByConversion() {
    this.sortByConversion = !this.sortByConversion;
    this.sortByTotals = null;
    this.sortByDate = null;
    this.sortByName = null;
  }

  /**
   * 
   * @param item Object (selected Item)
   * get selected item and push it into quizIdList
   */
  onQuizSelect(item: any) {
    this.quizIdList.push(item.id);

    this.getQuizReportingDetails(this.quizIdList.toString(), moment(this.daterangepickerModel[0]).format('l'), moment(this.daterangepickerModel[1]).format('l'), this.conversion2, this.conversion1);
  }

  /**
   * 
   * @param item Object (deSelected Item)
   * get deselected Item and pop out to the quizIdList
   */
  OnItemDeSelect(item: any) {
    var index = this.quizIdList.indexOf(item.id);
    this.quizIdList.splice(index, 1);

    this.getQuizReportingDetails(this.quizIdList.toString(), moment(this.daterangepickerModel[0]).format('l'), moment(this.daterangepickerModel[1]).format('l'), this.conversion2, this.conversion1);
  }

  /**
   * 
   * @param items Object (all selected Item)
   * get all quizzes and push it into the quizIdList
   */
  onSelectAll(items: any) {
    this.quizIdList = [];
    items.forEach((quiz) => {
      this.quizIdList.push(quiz.id);
    });

    this.getQuizReportingDetails(this.quizIdList.toString(), moment(this.daterangepickerModel[0]).format('l'), moment(this.daterangepickerModel[1]).format('l'), this.conversion2, this.conversion1);
  }

  /**
   * 
   * @param items Object (all deselected Item)
   * Make the quizIdList empty
   */
  onDeSelectAll(items: any) {
    this.quizIdList = [];

    this.getQuizReportingDetails(this.quizIdList.toString(), moment(this.daterangepickerModel[0]).format('l'), moment(this.daterangepickerModel[1]).format('l'), this.conversion2, this.conversion1);
  }

  /**
   * 
   * @param e Array (date rande fromdate, toDate)
   * Api integrate whenever date Range changes
   */
  dateChange(e) {
    if (e) {
      if (!((e[0] === this.daterangepickerModel[0]) && (e[1] === this.daterangepickerModel[1]))) {
        this.getQuizReportingDetails(this.quizIdList.toString(), moment(e[0]).format('l'), moment(e[1]).format('l'), this.conversion2, this.conversion1);
      }
    }
  }

  /**
   * 
   * @param item String
   * item selected for denominator and Api integrated
   */
  onselectedFirstData(item) {
    this.conversion1 = item;
    this.getQuizReportingDetails(this.quizIdList.toString(), moment(this.daterangepickerModel[0]).format('l'), moment(this.daterangepickerModel[1]).format('l'), this.conversion2, this.conversion1);
  }
  /**
    * 
    * @param item String
    * item selected for numerator and Api integrated
    */

  onSelectedSecondData(item) {
    this.conversion2 = item;
    this.getQuizReportingDetails(this.quizIdList.toString(), moment(this.daterangepickerModel[0]).format('l'), moment(this.daterangepickerModel[1]).format('l'), this.conversion2, this.conversion1);
  }

  /** Set the colors of charts legend */
  colorScheme = {
    domain: ['#ff6d60', '#ffeb3b', '#8FCC1B', '#57c8f2', 'rgba(249, 144, 80, 0)']
  };

  /**
   * 
   * @param event String (selected legend)
   * @param index number (Index -1 to n-2)
   * plotting and destroy the data on chart against selected legends
   */
  onSelect(event, index) {
    if (index < 0) {
      this.multi[0].forEach(data => {
        if (data.name.match(event)) {
          if (!data.series.length) {
            this.aggregateReportingData.forEach((report) => {
              if (report.name.match(event)) {
                data.series = report.series;
              }
            });
          } else {
            data.series = []
          }
        }
      });
      this.multi = [...this.multi]
      this.process(this.multi[0]);
    } else {
      this.individualReporting[index].data.forEach(data => {
        if (data.name.match(event)) {
          if (!data.series.length) {
            this.individualReportingData[index].data.forEach((report) => {
              if (report.name.match(event)) {
                data.series = report.series;
              }
            })
          } else {
            data.series = [];
          }
        }
      });
      this.individualReporting[index].data = [...this.individualReporting[index].data];
      this.process(this.individualReporting[index].data)
    }

  }

  logValues(item) {
  }

  /**
   * 
   * @param data Array
   * Manipulation of x-axis data in the charts
   */
  process(data) {
    for (let item of data) {
      for (let s of item.series) {
        s.name = new Date(s.name)
      }
    }
  }

  ngAfterViewInit() {
    $('.ember-body-srcoller').scroll(function () {
      var scroll = $('.ember-body-srcoller').scrollTop();
      if (scroll >= 480) {
        $('.reporting-compare-sort-container').addClass('active');
        $('.ember-body-srcoller').addClass('active');
      } else {
        $('.reporting-compare-sort-container').removeClass('active');
        $('.ember-body-srcoller').removeClass('active');
      }
    });
  }

  ngAfterViewChecked() {
    var that = this;
    var k = -1;
    if (!that.countData) {
      $('.legend-label-text').ready(function () {
        // var data1 = $('.legend-label-text').isEmisEmptyObject();
        if ($('.legend-label-text').length && !that.countData) {
          var data = $('.legend-label-text');
          for (let i = 0; i < data.length; i++) {
            var textSpan = document.createElement("span");
            if (i < 5) {
              if (data[i].innerText === "Conversion") {
                textSpan.className = "legent-number-text"
                textSpan.innerText = that.aggregateReportingData[i].total + "%"
                data[i].parentElement.insertBefore(textSpan, data[i]);
              } else {
                textSpan.className = "legent-number-text"
                textSpan.innerText = that.aggregateReportingData[i].total
                data[i].parentElement.insertBefore(textSpan, data[i]);
                // data[i].prepend(that.aggregateReportingData[i].total);
              }
            } else {
              var j = i % 5;
              if (!j) {
                k++;
              }
              if (data[i].innerText === "Conversion") {
                textSpan.className = "legent-number-text"
                textSpan.innerText = that.individualReportingData[k].data[j].total + "%"
                data[i].parentElement.insertBefore(textSpan, data[i]);
                // data[i].prepend(that.individualReportingData[k].data[j].total+"%");
              } else {
                textSpan.className = "legent-number-text"
                textSpan.innerText = that.individualReportingData[k].data[j].total
                data[i].parentElement.insertBefore(textSpan, data[i]);
                // data[i].prepend(that.individualReportingData[k].data[j].total);
              }
            }
          }
          that.countData++
        }
      });
    }

  }

}

