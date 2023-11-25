import { Component, Input, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as moment from 'moment-timezone';
import { UserInfoService } from '../../../shared/services/security.service';

am4core.addLicense("CH204852226");
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-zoomable-value-axis',
  templateUrl: './zoomable-value-axis.component.html',
  styleUrls: ['./zoomable-value-axis.component.scss']
})

export class ZoomableValueChartComponent implements OnInit {
  @Input() npsScoreDetails;
  @Input() chatView;
  public language;
  public userInfo: any = {};

  constructor( private userInfoService: UserInfoService) { }
  ngOnInit() { 
    this.userInfo = this.userInfoService._info;
    this.language = this.userInfo.ActiveLanguage;
    this.getNpsScoreDetail();
  }

  getNpsScoreDetail(){
    if(this.npsScoreDetails && this.npsScoreDetails.length > 0){
      this.npsScoreDetails.map(scoreDetail => {
        if(this.chatView == 1){
          scoreDetail.duration = scoreDetail.Date ? moment(scoreDetail.Date).format("ll"):'';
          scoreDetail.dayName = this.weekDay(scoreDetail.Day);
        }else if(this.chatView == 2){
          scoreDetail.duration = scoreDetail.Week + " Week " +  scoreDetail.Year;
        }else if(this.chatView == 3){
          scoreDetail.duration = scoreDetail.MonthName + " " + scoreDetail.Year;
        }else{
          scoreDetail.duration = scoreDetail.Year;
        }
        scoreDetail.value = scoreDetail.NPSScore;
      });
    }
    this.setChartData();
  }

  weekDay(dayCount){
    if(dayCount == 1){
      return "Monday";
    }else if(dayCount == 2){
      return "Tuesday";
    }else if(dayCount == 3){
      return "Wednesday";
    }else if(dayCount == 4){
      return "Thursday";
    }else if(dayCount == 5){
      return "Friday";
    }else if(dayCount == 6){
      return "Saturday";
    }else{
      return "Sunday";
    }
  }

  setChartData() {
      // Particular chart used in report 
      let chart = am4core.create("zoomble", am4charts.XYChart);
      /* Create axes (x-axis) */
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "duration";
      if(this.language && this.language == 'en-US'){
        categoryAxis.title.text =" Duration "; // Setting Label 
      }else{
        categoryAxis.title.text =" Duur "; // Setting Label 
      }
      categoryAxis.renderer.grid.template.location = 0;

      /** Settings ticks on x-axis */
      categoryAxis.renderer.ticks.template.disabled = false;
      categoryAxis.renderer.ticks.template.strokeOpacity = 1;
      categoryAxis.renderer.ticks.template.stroke = am4core.color("#495C43");
      categoryAxis.renderer.ticks.template.strokeWidth = 2;

      /* Create value axis (y-axis) */
      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis()); 
      //valueAxis.dataFields.value = "messagesCount"
      valueAxis.title.text ="NPS Score" // Setting label
     // valueAxis.min = 0; // Setting min value start

      // Create series
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = "value";
      series.dataFields.categoryX = "duration";
      // series properties
      series.strokeWidth = 2;
      series.fillOpacity = 0.5; // colour in charts
      
      // Tool Tip in series
      if(this.chatView == 1){
        series.tooltipText =  "{dayName},{categoryX}\n[bold font-size: 17px]Count: {valueY}[/]";  
      }else{
        series.tooltipText =  "{categoryX}\n[bold font-size: 17px]Count: {valueY}[/]";  
      }
      
      series.tooltip.pointerOrientation = "vertical";
      series.tooltip.background.cornerRadius = 20;
      series.tooltip.background.fillOpacity = 0.5;
      series.tooltip.label.padding(12,12,12,12)

      // Add bullets
      let bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.strokeWidth = 2;
      bullet.circle.radius = 4;
      bullet.circle.fill = am4core.color("#fff");

       // Make bullets grow on hover
      let bullethover = bullet.states.create("hover");
      bullethover.properties.scale = 1.3;

      // Add cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.xAxis = categoryAxis;
      chart.cursor.snapToSeries = series

      //Set chart data 
      chart.data = this.npsScoreDetails; 
  }
}