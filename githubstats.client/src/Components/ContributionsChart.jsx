/* eslint-disable react/prop-types */

import React from "react";
import CanvasJSReact from "@canvasjs/react-charts";

var CanvasJS = CanvasJSReact.CanvasJS;

class ContributionsChart extends React.Component {
  constructor(props) {
    super(props);
    this.title = this.props.title;
    this.totalContrData = this.props.totalContrData;
  }

  componentDidMount() {
    var chart = new CanvasJS.Chart("contributionsChartContainer", {
      backgroundColor: "#0d0d0d",
      theme: "dark2",
      exportFileName: "ContributionsChart",
      exportEnabled: true,
      animationEnabled: true,
      title: {
        text: this.title,
        fontSize: 22,
      },
      axisY: {
        includeZero: true,
        gridThickness: 0,
      },
      dataPointWidth: 30,
      data: [
        {
          type: "column",
          dataPoints: this.totalContrData.totalContrData,
        },
      ],
    });
    chart.render();
  }

  render() {
    return (
      <div
        id="contributionsChartContainer"
        style={{ height: 350 + "px", width: 40 + "%" }}
      ></div>
    );
  }
}

export default ContributionsChart;
