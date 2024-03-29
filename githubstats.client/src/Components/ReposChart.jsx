/* eslint-disable react/prop-types */

import React from "react";
import CanvasJSReact from "@canvasjs/react-charts";

var CanvasJS = CanvasJSReact.CanvasJS;

class ReposChart extends React.Component {
  constructor(props) {
    super(props);
    this.title = this.props.title;
    this.reposData = this.props.reposData;
  }

  componentDidMount() {
    var chart = new CanvasJS.Chart("reposChartContainer", {
      backgroundColor: "#0d0d0d",
      theme: "dark2",
      exportFileName: "ReposChart",
      exportEnabled: true,
      animationEnabled: true,
      title: {
        text: this.title,
        fontSize: 22,
      },
      data: [
        {
          type: "pie",
          startAngle: -90,
          indexLabel: "{name}: {y}",
          dataPoints: this.reposData.reposData,
        },
      ],
    });
    chart.render();
  }

  render() {
    return (
      <div
        id="reposChartContainer"
        style={{ height: 350 + "px", width: 40 + "%" }}
      ></div>
    );
  }
}

export default ReposChart;
