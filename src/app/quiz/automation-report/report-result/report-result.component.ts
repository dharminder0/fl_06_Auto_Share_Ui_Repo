import { Component, Input, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.addLicense("CH204852226");
am4core.useTheme(am4themes_animated);

@Component({
    selector: 'app-report-result',
    templateUrl: './report-result.component.html',
    styleUrls: ['./report-result.component.scss']
  })
  export class ReportResultComponent implements OnInit {
      @Input() reportDetails;
      @Input() QuizTypeId;
      public pieChart;
      public pieSeries;

      constructor(){}
      ngOnInit(){
      }


      ngAfterViewInit(){
        // Create chart instance
        this.pieChart = am4core.create("resultChart" , am4charts.PieChart);
      
        // Add data
        this.pieChart.data = this.reportDetails.Results;
        // Add and configure Series
        this.pieSeries = this.pieChart.series.push(new am4charts.PieSeries());
        this.pieSeries.dataFields.value = "Value";
        this.pieSeries.dataFields.category = "InternalResultTitle";
        this.pieSeries.slices.template.stroke = am4core.color("#fff");
        this.pieSeries.slices.template.strokeWidth = 2;
        this.pieSeries.slices.template.strokeOpacity = 1;
        if(this.QuizTypeId && this.QuizTypeId == 1){
         this.pieSeries.labels.template.maxWidth = 120;
        }else{
         this.pieSeries.labels.template.maxWidth = 300;
        }
        this.pieSeries.labels.template.wrap = true;
        
        // This creates initial animation
        this.pieSeries.hiddenState.properties.opacity = 1;
        this.pieSeries.hiddenState.properties.endAngle = -90;
        this.pieSeries.hiddenState.properties.startAngle = -90;
      }

  }