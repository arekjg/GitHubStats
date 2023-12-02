/* eslint-disable react/prop-types */

import React from "react";
import CanvasJSReact from "@canvasjs/react-charts";

var CanvasJS = CanvasJSReact.CanvasJS;

class LanguagesChart extends React.Component {
  constructor(props) {
    super(props);
    this.title = this.props.title;
    this.languagesData = this.props.languagesData;
  }

  componentDidMount() {
    const dataPoints = transformObject(this.languagesData.languagesData);

    var chart = new CanvasJS.Chart("chartContainer", {
      backgroundColor: "#0d0d0d",
      theme: "dark2",
      exportFileName: "LanguagesChart",
      exportEnabled: true,
      animationEnabled: true,
      title: {
        text: this.title,
      },
      legend: {
        cursor: "pointer",
        itemclick: explodePie,
      },
      data: [
        {
          type: "doughnut",
          innerRadius: 100,
          showInLegend: true,
          toolTipContent: "<b>{name}</b>: {y} (#percent%)",
          indexLabel: "{name} - #percent%",
          dataPoints: dataPoints,
        },
      ],
    });
    chart.render();

    function transformObject(inputObject) {
      const result = [];
      for (const key in inputObject) {
        if (Object.prototype.hasOwnProperty.call(inputObject, key)) {
          const value = inputObject[key];
          result.push({ y: value, name: key });
        }
      }
      return result;
    }

    function explodePie(e) {
      if (
        typeof e.dataSeries.dataPoints[e.dataPointIndex].exploded ===
          "undefined" ||
        !e.dataSeries.dataPoints[e.dataPointIndex].exploded
      ) {
        e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
      } else {
        e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
      }
      e.chart.render();
    }
  }

  render() {
    return (
      <div
        id="chartContainer"
        style={{ height: 450 + "px", width: 100 + "%" }}
      ></div>
    );
  }
}

export default LanguagesChart;
