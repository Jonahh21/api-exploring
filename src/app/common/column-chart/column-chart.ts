import { Component, computed, effect, input, model, viewChild, ViewChild } from "@angular/core";
import {
    ApexAxisChartSeries,
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexTitleSubtitle,
    ApexXAxis,
    ApexFill
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    fill: ApexFill;
    title: ApexTitleSubtitle;
};

@Component({
    selector: "app-column-chart",
    templateUrl: "./column-chart.html",
    imports: [ChartComponent],
})
export class ColumnChart {
    chart = viewChild<ChartComponent>('chart');
    public chartOptions = computed<ChartOptions>(() => {
        return {
            series: this.dataseries(),
            chart: {
                height: 350,
                type: "bar"
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        position: "top" // top, center, bottom
                    }
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val + "€";
                },
                offsetY: -20,
                style: {
                    fontSize: "12px",
                    colors: ["#304758"]
                }
            },

            xaxis: {
                categories: this.xaxislabels(),
                position: "top",
                labels: {
                    offsetY: -18
                },
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                crosshairs: {
                    fill: {
                        type: "gradient",
                        gradient: {
                            colorFrom: "#D8E3F0",
                            colorTo: "#BED1E6",
                            stops: [0,50 , 100],
                            opacityFrom: 0.4,
                            opacityTo: 0.5
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    offsetY: -35
                }
            },
            fill: {
                type: "gradient",
                gradient: {
                    shade: "light",
                    type: "horizontal",
                    shadeIntensity: 0.25,
                    gradientToColors: undefined,
                    inverseColors: true,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [50, 0, 100, 100]
                }
            },
            yaxis: {
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    show: false,
                    formatter: (val) => {
                        return val + "€";
                    }
                }
            },
            title: {
                text: this.title(),
                floating: false,
                offsetY: 320,
                align: "center",
                style: {
                    color: "#444"
                }
            }
        }
    });

    public dataseries = input.required<ApexAxisChartSeries>()
    public xaxislabels = input.required<string[]>()
    public title = input<string>("Monthly Inflation In Argentina 2002 uwu")

    
}
