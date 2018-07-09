import React from "react";
const d3 = require("d3");
const $ = require("jquery");

class BaseSiteBarPlot extends React.Component {
  constructor(props) {
    super(props);

    // d3 variables used by multiple methods
    this.padding_bottom = 15;
    this.chart_height = this.props.height - this.padding_bottom;

    $("#alignmentjs-siteBarPlot-div").scrollLeft(this.props.x_pixel);
  }

  componentDidMount() {
    if (this.props.data != null) {
      this.createBarPlot();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    document
      .getElementById("alignmentjs-siteBarPlot-div")
      .addEventListener("alignmentjs_wheel_event", function(e) {
        $("#alignmentjs-siteBarPlot-div").scrollLeft(e.detail.x_pixel);
      });
    if (prevProps.data == null) {
      this.createBarPlot();
    } else {
      this.transitionBarPlot();
    }
  }

  createBarPlot() {
    var data = this.props.data;
    var chart_height = this.chart_height;
    var max_value = this.props.max_value && d3.max(data);

    var barChartScale = d3
      .scaleLinear()
      .domain([max_value, 0])
      .range([0, chart_height]);

    var barWidth = this.props.siteSize;

    var chart = d3
      .select("#alignmentjs-siteBarPlot")
      .attr("width", this.props.width)
      .attr("height", chart_height + this.padding_bottom);

    chart
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function(d, i) {
        return "translate(" + i * barWidth + ", 10)";
      })
      .append("rect")
      .attr("class", "bars")
      .attr("y", function(d) {
        return barChartScale(d);
      })
      .attr("height", function(d) {
        return chart_height - barChartScale(d);
      })
      .attr("width", barWidth - 2)
      .attr("fill", this.props.fillColor)
      .attr("stroke", this.props.outlineColor);
  }

  transitionBarPlot() {
    var data = this.props.data;
    var chart_height = this.chart_height;
    var max_value = this.props.max_value && d3.max(data);

    var barChartScale = d3
      .scaleLinear()
      .domain([max_value, 0])
      .range([0, this.chart_height]);

    var barChartTransition = d3
      .transition()
      .duration(500)
      .ease(d3.easeSin);

    d3
      .selectAll(".bars")
      .data(this.props.data)
      .transition(barChartTransition)
      .attr("y", function(d) {
        return barChartScale(d);
      })
      .attr("height", function(d) {
        return chart_height - barChartScale(d);
      })
      .style("fill", this.props.fillColor)
      .style("stroke", this.props.outlineColor);
  }

  render() {
    return (
      <div
        id={"alignmentjs-siteBarPlot-div"}
        className="-container"
        style={{ overflowY: "scroll", overflowX: "hidden" }}
      >
        <svg
          width={this.props.width}
          height={this.props.height}
          id={"alignmentjs-siteBarPlot"}
        />
      </div>
    );
  }
}

BaseSiteBarPlot.defaultProps = {
  id: "alignmentjs"
};

module.exports = BaseSiteBarPlot;
