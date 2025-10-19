import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function GraphicWidget({ dataSource }) {
  const ref = useRef();

  useEffect(() => {
    if (!dataSource) return;

    d3.csv(dataSource).then((data) => {
      if (!data || data.length === 0) return;

      const [col1, col2] = Object.keys(data[0]); // Automatically extract first two columns
      const parsedData = data.map((d) => ({
        x: d[col1],
        y: +d[col2], // Assume second column is numeric
      }));

      const width = 400;
      const height = 200;
      const margin = { top: 20, right: 20, bottom: 40, left: 40 };

      d3.select(ref.current).selectAll("*").remove();

      const svg = d3
        .select(ref.current)
        .attr("width", width)
        .attr("height", height);

      const chart = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const xScale = d3
        .scaleBand()
        .domain(parsedData.map((d) => d.x))
        .range([0, width - margin.left - margin.right])
        .padding(0.1);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(parsedData, (d) => d.y)])
        .nice()
        .range([height - margin.top - margin.bottom, 0]);

      chart
        .selectAll("rect")
        .data(parsedData)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d.x))
        .attr("y", (d) => yScale(d.y))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => height - margin.top - margin.bottom - yScale(d.y))
        .attr("fill", "#32cd32");

      // Axes
      chart
        .append("g")
        .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-40)")
        .style("text-anchor", "end");

      chart.append("g").call(d3.axisLeft(yScale));
    });
  }, [dataSource]);

  return <svg ref={ref}></svg>;
}
