import { Component, Input, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.addLicense("CH204852226");
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-column-with-roated-series',
  templateUrl: './column-with-roated-series.component.html',
  styleUrls: ['./column-with-roated-series.component.scss']
})
export class ColumnWithRoatedSeriesComponent implements OnInit {

  @Input() reportDetails: any;
  constructor() { }
  ngOnInit() {
  }

  ngAfterViewInit() {
    // Create chart instance
    let chart = am4core.create("columnChart", am4charts.XYChart);

    // Add data
    chart.data = this.reportDetails.Stages;

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minWidth = 50;

    // let label = categoryAxis.renderer.labels.template;
    // label.truncate = true;
    // label.maxWidth = 70;

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "category";
    series.tooltipText = "{categoryX}[bold font-size: 17px] : {valueY}[/]";
    series.columns.template.strokeWidth = 0;
    valueAxis.min = 0;

    series.tooltip.pointerOrientation = "horizontal";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;
    // on hover, make corner radiuses bigger
    let hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();
  }
}