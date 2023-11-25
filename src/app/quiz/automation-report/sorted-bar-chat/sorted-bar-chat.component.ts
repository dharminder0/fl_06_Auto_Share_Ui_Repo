import { Component, Input, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.addLicense("CH204852226");
am4core.useTheme(am4themes_animated);

@Component({
    selector: 'app-sorted-bar-chat',
    templateUrl: './sorted-bar-chat.component.html',
    styleUrls: ['./sorted-bar-chat.component.scss']
  })
  export class SortedBarChartComponent implements OnInit {
    chartId = "chartSorted";
    @Input() index:string;
    @Input() anwserDetails;

      constructor(){}

      ngOnInit(){
          this.chartId += this.index;
      }

      ngAfterViewInit(){
        let sortedChart = am4core.create(this.chartId, am4charts.XYChart);
        sortedChart.padding(40, 40, 40, 40);
        
        let categoryAxis = sortedChart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.dataFields.category = "AnswerText";
        categoryAxis.renderer.minGridDistance = 1;
        categoryAxis.renderer.inversed = true;
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.maxWidth = 150;
        categoryAxis.renderer.labels.template.truncate = true;
        
        let valueAxis = sortedChart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        
        let series = sortedChart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryY = "AnswerText";
        series.dataFields.valueX = "LeadCount";
        series.columns.template.tooltipText = "{categoryY}[bold font-size: 17px] : {valueX.value}";
        series.columns.template.strokeOpacity = 0;
        series.columns.template.column.cornerRadiusBottomRight = 5;
        series.columns.template.column.cornerRadiusTopRight = 5;
        
        let labelBullet = series.bullets.push(new am4charts.LabelBullet())
        labelBullet.label.horizontalCenter = "left";
        labelBullet.label.dx = 10;
        labelBullet.label.text = "{values.valueX.workingValue}";
        labelBullet.locationX = 1;
        
        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
        series.columns.template.adapter.add("fill", function(fill, target){
          return sortedChart.colors.getIndex(target.dataItem.index);
        });
        
        categoryAxis.sortBySeries = series;
        sortedChart.data = this.anwserDetails;
      }
  }