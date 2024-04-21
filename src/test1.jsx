import React from "react";
import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import ColorAxis from "highcharts/modules/coloraxis";
import PatternFill from "highcharts/modules/pattern-fill";
import Exporting from "highcharts/modules/exporting";
import ExportData from "highcharts/modules/export-data";
import Accessibility from "highcharts/modules/accessibility";

HighchartsMore(Highcharts);
ColorAxis(Highcharts);
PatternFill(Highcharts);
Exporting(Highcharts);
ExportData(Highcharts);
Accessibility(Highcharts);

const data = JSON.parse(document.getElementById("data").innerHTML),
  scoreData = data[3],
  colors = Highcharts.getOptions().colors.map(Highcharts.Color.parse),
  // Defining recurring values.
  monthExtremes = { min: 1, max: 28 },
  weekExtremes = { min: 1, max: 5 },
  paneOpeningAngles = { startAngle: 40.5, endAngle: 319.5 },
  noLabelProp = { labels: { enabled: false } },
  specialSeriesProps = {
    showInLegend: false,
    groupPadding: 0,
    pointPadding: 0,
  },
  // A gradient background for the inner circle (aka pane.)
  //   console.log(data)
  toggleableGradient = {
    pattern: undefined,
    radialGradient: [1, 0.25, 0.1],
    stops: [
      [0, "#1f1836"],
      [1, "#45445d"],
    ],
  },
  // A function which (re)sets the inner circles background to our gradient.
  setGradient = function () {
    const chart = this.series.chart;
    chart.setMidPaneBg({
      backgroundColor: toggleableGradient,
      outerRadius: "75%",
    });
    chart.subtitle.element.style.opacity = 1;
  },
  // A function used in the creation of our second custom tooltip.
  asColFieldStr = (str) =>
    '<span class="col-display-fieldwrap">' +
    '<span class="symbolSize" ' +
    'style="color:{point.color};">●</span> ' +
    str +
    "</span>",
  // We create our teams, 1 serie per team.
  teamNames = ["Ulambaator", "Sofia", "Asmara"],
  teamColors = [
    colors[9 % colors.length].tweenTo(colors[0], 0.25),
    colors[9 % colors.length].tweenTo(colors[8 % colors.length], 0.65),
    colors[9 % colors.length].tweenTo(colors[3], 0.85),
  ],
  teamSeries = Array(3)
    .fill({
      type: "bubble",
      shadow: true,
      maxSize: "4%",
      minSize: "1%",
      clip: false,
      point: {
        events: {
          // When hovering a bubble, change the inner circles background
          // to the color of its parent series.
          mouseOver: function () {
            const chart = this.series.chart;
            chart.subtitle.element.style.opacity = 0;
            chart.setMidPaneBg({
              backgroundColor: teamColors[this.series.index],
              innerRadius: "0%",
            });
          },
          mouseOut: setGradient,
        },
      },
      colorKey: "t",

      // A custom tooltip, using our own CSS
      tooltip: {
        headerFormat:
          '<div class="team-day center">' +
          '<span class="team-header">' +
          '<b class="team-index">Day {point.x}</b></span>' +
          '<span class="team-name" style="' +
          "border: 0 outset {series.color};" +
          'border-block-end: 0 outset {series.color};">' +
          "<b>{series.name}</b></span>",
        pointFormat:
          '<span class="team-points">' +
          '<span class="team-salescount-header">Daily Sales:</span>' +
          "</br>" +
          '<span class="team-salescount">{point.z}</span>',
        footerFormat: "</div>",
      },
    })
    .map((seriesProps, i) => ({
      ...seriesProps,
      name: teamNames[i],
      data: data[i],
      color: teamColors[i],
      marker: {
        fillColor: teamColors[i],
        fillOpacity: 1,
        lineColor: "#46465C",
        lineWidth: 2,
      },
    }));
// We create a series which only purpose is to act as a label
// indicating the week in which a given datapoint occurred.

weekLabels = Array(4)
  .fill(0)
  .map((_value, index) => ({
    dataLabels: {
      format: "Week {x}",
      enabled: true,
      inside: true,
      style: {
        textOutline: undefined,
        fontSize: "0.7em",
        fontWeight: "700",
        textTransform: "uppercase",
        fontStyle: "normal",
        letterSpacing: "0.01em",
      },
      textPath: {
        enabled: true,
        attributes: {
          startOffset: index % 3 ? "75%" : index % 2 ? "22%" : "28%",
          dx: index % 2 ? "-2%" : "0%",
          dy: index % 3 ? "2.8%" : "3.3%",
        },
      },
    },
    x: index + 1,
    y: 1.5,
  }));

const HighchartsComponent = () => {
  const chartRef = React.useRef(null);

  React.useEffect(() => {
    const chart = Highcharts.chart(chartRef.current, {
      // ... (chart options)
    });

    return () => {
      chart.destroy();
    };
  }, []);

  return <div ref={chartRef} />;
};

export default HighchartsComponent;
