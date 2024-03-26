import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./Linegraph.css";
import useTheme from "../../contexts/ProvideContext";
import { useState } from "react";
const StepCountsGraph = () => {
  const svgRef = useRef();
  const { themeMode } = useTheme();
  // const [tooltip, setTooltip] = useState(null);
  useEffect(() => {
    const width = 828;
    const height = 500;
    const marginTop = 20;
    const marginRight = 5;
    const marginBottom = 30;
    const marginLeft = 400;

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr(
        "style",
        "max-width: 100%; height: auto; height: intrinsic; font: 10px sans-serif;"
      )
      .style("-webkit-tap-highlight-color", "transparent")
      .style("overflow", "visible");

    Promise.all([d3.csv("./src/components/LinePLot/step_hourly1.csv"), d3.csv("./src/components/LinePLot/step_hourly2.csv")]).then(
      ([data1, data2]) => {
        // console.log(data1, data2)
        data1.forEach(function (d) {
          d.ActivityHour = new Date(d.ActivityHour);
          d.ActivityHour = d.ActivityHour.toLocaleTimeString("en-US", {
            hour12: false,
          });
          d.StepTotal = +d.StepTotal;
        });

        data2.forEach(function (d) {
          d.ActivityHour = new Date(d.ActivityHour);
          d.ActivityHour = d.ActivityHour.toLocaleTimeString("en-US", {
            hour12: false,
          });
          d.StepTotal = +d.StepTotal;
        });

        const x = d3
          .scaleBand()
          .domain(data1.map((d) => d.ActivityHour))
          .range([marginLeft, width - marginRight])
          .padding(0.1);

        const y = d3
          .scaleLinear()
          .domain([0, d3.max([...data1, ...data2], (d) => d.StepTotal)])
          .range([height - marginBottom, marginTop]);

        const line1 = d3
          .line()
          .x((d) => x(d.ActivityHour) + x.bandwidth() / 2)
          .y((d) => y(d.StepTotal));

        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", marginTop - 10)
          .attr("text-anchor", "middle")
          .attr("font-size", "14px")
          .text("Today Steps: " + d3.max(data1, (d) => d.StepTotal))
          .style("fill", "#E64A19");

        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", marginTop - 10 + 20)
          .attr("text-anchor", "middle")
          .attr("font-size", "14px")
          .text("Average Steps: " + d3.max(data2, (d) => d.StepTotal))
          .style("fill", "#546E7A");

        svg
          .append("path")
          .datum(data1)
          .attr("fill", "none")
          .attr("stroke", "#E64A19")
          .attr("stroke-width", 4)
          .attr("d", line1);

        const line2 = d3
          .line()
          .x((d) => x(d.ActivityHour) + x.bandwidth() / 2)
          .y((d) => y(d.StepTotal));

        svg
          .append("path")
          .datum(data2)
          .attr("fill", "none")
          .attr("stroke", "#546E7A")
          .attr("stroke-width", 4)
          .attr("d", line2);

        svg
          .selectAll(".circle1")
          .data(data1)
          .enter()
          .append("circle")
          .attr("class", "circle1")
          .attr("cx", (d) => x(d.ActivityHour) + x.bandwidth() / 2)
          .attr("cy", (d) => y(d.StepTotal))
          .attr("r", 4)
          .attr("fill", "#BF360C")
          .on("mouseover", pointermoved)
          .on("mouseout", pointerleft);

        const tooltip = svg.append("g").style("display", "none");
        
        tooltip.append("text").attr("x", 10).attr("dy", "-1.2em");
        setTooltip(tooltip);

        function pointermoved(event, d) {
          tooltip.style("display", "block");
          
          tooltip.attr(
            "transform",
            `translate(${x(d.ActivityHour) + x.bandwidth() / 2}, ${y(
              d.StepTotal
            )})`
          );
          tooltip
            .select("text")
            .text(
              formatDate(d.ActivityHour) +
              ", Steps: " +
              formatValue(d.StepTotal)
            );
        }

        function pointerleft() {
          tooltip.style("display", "none");
        }

        function formatValue(value) {
          return value.toLocaleString("en");
        }

        function formatDate(date) {
          return date;
        }

        svg
          .append("g")
          .attr("transform", `translate(0,${height - marginBottom})`)
          .call(d3.axisBottom(x))
          .selectAll("text")
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "end");

        svg
          .append("g")
          .attr("transform", `translate(${marginLeft},0)`)
          .call(d3.axisLeft(y).ticks(height / 40))
          .call((g) => g.select(".domain").remove())
          .call((g) =>
            g
              .selectAll(".tick line")
              .clone()
              .attr("x2", width - marginLeft - marginRight)
              .attr("stroke-opacity", 0.1)
          )
          .call((g) =>
            g
              .append("text")
              .attr("x", -marginLeft)
              .attr("y", 10)
              .attr("fill", "currentColor")
              .attr("text-anchor", "start")
              .text("↑ Number of Steps")
          );
      }
    );
  }, []);
  // useEffect(()=>{
  //   if (themeMode === "dark") {
  //     tooltip.style("color", "red");
  //   }
  

  // },[themeMode])
 
  return (

    <div className="container" style={{
      backgroundColor: themeMode === "light" ? "#ffffff" : "#333333",
      color: themeMode === "light" ? "#333333" : "#ffffff",
    }}>
      <h1>Step Counts Graph</h1>
      <div id="plot-container">
        <svg ref={svgRef} id="plot"></svg>
      </div>
    </div>
  );
};

export default StepCountsGraph;
