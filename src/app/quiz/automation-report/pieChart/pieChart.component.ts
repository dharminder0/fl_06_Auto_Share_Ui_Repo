import { Component, Input, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.addLicense("CH204852226");
am4core.useTheme(am4themes_animated);

@Component({
    selector: 'app-pieChart',
    templateUrl: './pieChart.component.html',
    styleUrls: ['./pieChart.component.scss']
  })
  export class PieChartComponent implements OnInit {
      @Input() anwserDetails;
      @Input() index:string;
      @Input() isRatingType;
      chartId = "chartView";
      public pieChart;
      public pieSeries;

      constructor(){}
      ngOnInit(){
          this.getPieChart();
      }

      getPieChart(){
        this.chartId += this.index;

      }

      ngAfterViewInit(){
        // Create chart instance
        this.pieChart = am4core.create(this.chartId , am4charts.PieChart);
      
        // Add data
        this.pieChart.data = this.anwserDetails;
        // Add and configure Series
        this.pieSeries = this.pieChart.series.push(new am4charts.PieSeries());
        this.pieSeries.dataFields.value = "LeadCount";
        this.pieSeries.dataFields.category = "AnswerText";
        this.pieSeries.slices.template.stroke = am4core.color("#fff");
        this.pieSeries.slices.template.strokeWidth = 2;
        this.pieSeries.slices.template.strokeOpacity = 1;
        if(this.isRatingType){
          this.pieSeries.labels.template.maxWidth = 160;
        }else{
          this.pieSeries.labels.template.maxWidth = 320;
        }
        this.pieSeries.labels.template.wrap = true;
        
        // This creates initial animation
        this.pieSeries.hiddenState.properties.opacity = 1;
        this.pieSeries.hiddenState.properties.endAngle = -90;
        this.pieSeries.hiddenState.properties.startAngle = -90;
      }

  }