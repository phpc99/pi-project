import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function ChartWidget({ data, type, width = 300, height = 300 }) {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;
    d3.select(ref.current).selectAll("*").remove(); // Clear previous chart
    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height);

    if (type === "bar") {
      renderBarChart(svg, data, width, height);
    } else if (type === "pie") {
      renderPieChart(svg, data, width, height);
    }
  }, [data, type]);

  return <svg ref={ref}></svg>;
}

function renderBarChart(svg, data, width, height) {
  const margin = { top: 20, right: 20, bottom: 20, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const keys = Object.keys(data[0]);
  const xKey = keys[0];
  const yKey = keys[1];

   const colorPalette = [
    "#32CD32", // Lime Green
    "#FFA943", // Orange
    "#8D9DF5", // Light Blue/Indigo
    "#A251B9", // Purple
    "#FF6164", // Coral Red
    "#4ECDC4", // Turquoise
    "#FFC952", // Sunny Yellow
    "#4B89AC", // Steel Blue
    "#7B68EE", // Medium Slate Blue
    "#FF8C69", // Salmon
    "#6A5ACD", // Slate Blue
    "#F0E68C", // Khaki (light yellow)
    "#DDA0DD", // Plum (light purple)
    "#ADD8E6", // Light Blue
    "#BA55D3", // Medium Orchid
    "#FFB6C1", // Light Pink
    "#20B2AA", // Light Sea Green
    "#FAFAD2", // Light Goldenrod Yellow
    "#9370DB", // Medium Purple
    "#DAA520"  // Goldenrod
    ];
  const colorScale = d3.scaleOrdinal()
    .domain(data.map((_, i) => i))
    .range(colorPalette);

  const x = d3.scaleBand()
    .domain(data.map(d => d[xKey]))
    .range([0, innerWidth])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => +d[yKey])])
    .nice()
    .range([innerHeight, 0]);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("x", d => x(d[xKey]))
    .attr("y", d => y(+d[yKey]))
    .attr("width", x.bandwidth())
    .attr("height", d => innerHeight - y(+d[yKey]))
    .attr("fill", (_, i) => colorScale(i));

  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x));

  g.append("g").call(d3.axisLeft(y));
}

function renderPieChart(svg, data, width, height) {
  const keys = Object.keys(data[0]);
  const labelKey = keys[0];
  const valueKey = keys[1];

  const margin = 20;
  const radius = Math.min(width, height) / 2 - margin;

  const pie = d3.pie().value(d => +d[valueKey]);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  const colorPalette = [
    "#32CD32", // Lime Green 
    "#FFA943", // Orange 
    "#8D9DF5", // Light Blue/Indigo
    "#A251B9", // Purple
    "#FF6164", // Coral Red
    "#4ECDC4", // Turquoise
    "#FFC952", // Sunny Yellow
    "#4B89AC", // Steel Blue
    "#7B68EE", // Medium Slate Blue
    "#FF8C69", // Salmon
    "#6A5ACD", // Slate Blue
    "#F0E68C", // Khaki (light yellow)
    "#DDA0DD", // Plum (light purple)
    "#ADD8E6", // Light Blue
    "#BA55D3", // Medium Orchid
    "#FFB6C1", // Light Pink
    "#20B2AA", // Light Sea Green
    "#FAFAD2", // Light Goldenrod Yellow
    "#9370DB", // Medium Purple
    "#DAA520"  // Goldenrod
    ];
  const color = d3.scaleOrdinal()
    .domain(data.map((_, i) => i))
    .range(colorPalette);

  const g = svg.append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  g.selectAll("path")
    .data(pie(data))
    .enter().append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => color(i));

  g.selectAll("text")
    .data(pie(data))
    .enter().append("text")
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("dy", "0.35em")
    .attr("fill", "#fff")
    .style("font-size", "10px")
    .style("text-anchor", "middle")
    .text(d => d.data[labelKey]);

  // Legend (subtitle area)
  const legendYOffset = height - 10;
  const legend = svg.append("g")
    .attr("transform", `translate(10, ${legendYOffset - data.length * 18})`);

  data.forEach((d, i) => {
    const legendRow = legend.append("g")
      .attr("transform", `translate(0, ${i * 20})`);

    legendRow.append("rect")
      .attr("width", 8)
      .attr("height", 8)
      .attr("fill", color(i));

    legendRow.append("text")
      .attr("x", 18)
      .attr("y", 8)
      .text(`${d[valueKey]}`) 
      .attr("fill", "#ccc")
      .style("font-size", "12px");      
  });
  
}