import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DaterangepickerDirective, LocaleConfig, LocaleService } from 'ngx-daterangepicker-material';
import * as moment from 'moment';
import { QuizDataService } from '../../../quiz/quiz-data.service';

@Component({
    selector: 'app-daterangepicker',
    templateUrl: './daterangepicker.component.html',
    styleUrls: ['./daterangepicker.component.scss'],
    providers: [LocaleService]
  })

  export class DaterangepickerComponent implements OnInit {

    @Input()startDate:any;
    @Input()endDate:any;
    locale: LocaleConfig = {
        format: 'MMM DD,YYYYTHH:mm:ss.SSSSZ',
        displayFormat: 'MMM DD,YYYY',
    };
    
    @ViewChild(DaterangepickerDirective, { static: false }) pickerDirective: DaterangepickerDirective;
    public moment = moment;
    public calendarLocale: LocaleConfig;
    public ranges: any;
    public selectedDaterange: any;
    public calendarPlaceholder: string;
    public minDate;
    public maxDate;

      constructor(private quizDataService: QuizDataService){}

      ngOnInit(){
        this.minDate = moment('08/01/2020');
        this.maxDate = moment();
        if(this.startDate && this.endDate){
          this.selectedDaterange = { startdDate: moment(this.startDate), endDate: moment(this.endDate) };
        }else{
          this.selectedDaterange = { startdDate: moment().subtract(1, 'months'), endDate: moment() };
        }
        this.calendarLocale = {
          customRangeLabel: 'Kies een datum...',
          format: 'MMM DD, YYYY',
          separator: ' - ', // default is ' - '
          clearLabel: 'Annuleren', // detault is 'Clear'
          cancelLabel: 'Annuleren', // detault is 'Cancel'
          applyLabel: 'Toepassen', // detault is 'Apply'
          firstDay: 1, // first day is monday
          daysOfWeek: ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'],
          monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    
        };
    
        this.ranges = {
          'Vandaag': [moment(), moment()],
          'Gisteren': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'Vorige week': [moment().subtract(6, 'days'), moment()],
          'Laatste 30 dagen': [moment().subtract(29, 'days'), moment()],
          'Deze maand': [moment().startOf('month'), moment().endOf('month')],
          'Vorige maand': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
      }

      openDatepicker() {
        this.pickerDirective.open();
      }

      private getNextSunday() {
        const dayINeed = 7; // for Sunday
        const today = moment().isoWeekday();
        if (today <= dayINeed) {
          return moment().isoWeekday(dayINeed);
        } else {
          return moment().add(1, 'weeks').isoWeekday(dayINeed);
        }
      }
    
      selectDateRange() {
        
        let startSelecredDateUTC, endSelecredDateUTC;
        let selectedDate;
    
        if (typeof (this.selectedDaterange.startdDate) !== 'undefined' && this.selectedDaterange.startdDate !== null) {
          startSelecredDateUTC = moment(this.selectedDaterange.startdDate).format('L');
        }
    
        if (typeof (this.selectedDaterange.endDate) !== 'undefined' && this.selectedDaterange.endDate !== null) {
          endSelecredDateUTC = moment(this.selectedDaterange.endDate).format('L');
        }
        if (this.selectedDaterange.startdDate == null && this.selectedDaterange.endDate == null) {
          this.selectedDaterange = { startdDate: moment().subtract(1, 'months'), endDate: moment() };
        }
        
        if (startSelecredDateUTC !== undefined && endSelecredDateUTC !== undefined) {
          selectedDate = {
            "startDate" : startSelecredDateUTC,
            "endDate": endSelecredDateUTC
          }
          this.quizDataService.selectedDateInAutomationReport = selectedDate;
          this.quizDataService.changeSelectedDateInAutomationReport();
        }
      }

  }