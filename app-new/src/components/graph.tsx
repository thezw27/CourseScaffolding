'use client';
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

let mnt = false;

const Graph = ({data}) => {

  const width = 1200;
  const height = 800;
  const svgRef = useRef(null);

  useEffect(() => {
    if (!mnt) {
      const [nodes, links] = data;
      generateGraph(svgRef, nodes, links, width, height);
      mnt = true;
    }

  }, [])

  return (
    <svg className="ml-auto border-2 border-gray-500" ref={svgRef} width={width} height={height} />
  )
}

const generateGraph = (svgR, nodes, links, width, height) => {
  
  const svg = d3.select(svgR.current);

  svg.append("defs").append("marker")
    .attr("viewBox", "0 0 10 10")
    .attr("refX", "30")
    .attr("refY", "5")
    .attr("id", "arrow")
    .attr("markerWidth", 3)
    .attr("markerHeight", 5)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0 0 L 10 5 L 0 10 z")
    .attr("fill", "black");

  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  const link = svg.append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", 7)
    .attr("marker-end", "url(#arrow)");

  const node = svg.append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 35)
    .attr("fill", function(d) {
      switch (d.course_code[0]) {
        case "1":
            return "green";
        case "2":
            return "yellow";
        case "4":
            return "red";
        default:
            return "black";
      }
    })
    .on("click", (d, e) => {
      window.location.href = "/courses/" + e.id;
    });

  const text = svg.append("g")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .text(d => d.course_name)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .on("click", (d, e) => {
      window.location.href = "/courses/" + e.id;
    });

  node.call(d3.drag()
    .on("start", (event) => dragstarted(event, simulation))
    .on("drag", (event) => dragged(event, simulation))
    .on("end", (event) => dragended(event, simulation)));

  text.call(d3.drag()
    .on("start", (event) => dragstarted(event, simulation))
    .on("drag", (event) => dragged(event, simulation))
    .on("end", (event) => dragended(event, simulation)));

  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
    
    text
      .attr("x", d => d.x)
      .attr("y", d => d.y);
  });    

  const zoom = d3
    .zoom()
    .scaleExtent([1/4, 128])
    .on("zoom", (event) => zoomed(event, svg));

  svg.call(zoom).call(zoom.translateTo, width / 2, height / 2);

}

const zoomed = (event, svg) => {
  const { transform } = event;
  svg.selectChildren('g')
  .attr('transform', transform)
}

const dragstarted = (event, simulation) => {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
}

const dragged = (event, simulation) => {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}

const dragended = (event, simulation) => {
  if (!event.active) simulation.alphaTarget(0);
  event.subject.fx = null;
  event.subject.fy = null;
}


export default Graph;