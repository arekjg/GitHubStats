/* eslint-disable react/prop-types */

import React from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import languageColors from "../languageColors.json";

var CanvasJS = CanvasJSReact.CanvasJS;

class LanguagesChart extends React.Component {
  constructor(props) {
    super(props);
    this.title = this.props.title;
    this.languagesData = this.props.languagesData;
  }

  componentDidMount() {
    const dataPoints = transformObject(this.languagesData.languagesData);

    var chart = new CanvasJS.Chart("languagesChartContainer", {
      backgroundColor: "#0d0d0d",
      theme: "dark2",
      exportFileName: "LanguagesChart",
      exportEnabled: true,
      animationEnabled: true,
      title: {
        text: this.title,
        fontSize: 28,
      },
      data: [
        {
          type: "doughnut",
          innerRadius: 100,
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
          const color = languageColors[key];
          result.push({ y: value, name: key, color: color });
        }
      }
      return result;
    }
  }

  render() {
    return (
      <div
        id="languagesChartContainer"
        style={{ height: 450 + "px", width: 100 + "%" }}
      ></div>
    );
  }
}

export default LanguagesChart;
