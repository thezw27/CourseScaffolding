var currentSim, currnetLink, currentNode, currentText, arr;

var nodes = [
  { id: "ECSE1010", name: "Intro to ECSE" },
  { id: "ECSE1090", name: "Introduction to Mechatronics Hardware and Software" },
  { id: "ECSE2010", name: "Electric Circuits" },
  { id: "ECSE2050", name: "Introduction to Electronics" },
  { id: "ECSE2100", name: "Fields and Waves I" },
  { id: "ECSE2110", name: "Electrical Energy Systems" },
  { id: "ECSE2210", name: "Microelectronics Technology" },
  { id: "ECSE2410", name: "Signals and Systems" },
  { id: "ECSE2500", name: "Engineering Probability" },
  { id: "ECSE2610", name: "Computer Components and Operations" },
  { id: "ECSE2660", name: "Computer Architecture, Networks, and Operating Systems" },
  { id: "ECSE2900", name: "ECSE Enrichment Seminar" },
  { id: "ECSE4030", name: "Analog IC Design" },
  { id: "ECSE4040", name: "Digital Electronics" },
  { id: "ECSE4050", name: "Advanced Electronic Circuits" },
  { id: "ECSE4080", name: "Semiconductor Power Electronics" },
  { id: "ECSE4090", name: "Mechatronics" },
  { id: "ECSE4110", name: "Power Engineering Analysis" },
  { id: "ECSE4120", name: "Electromechanics" },
  { id: "ECSE4130", name: "EPE Laboratory" },
  { id: "ECSE4141", name: "Renewable Power Generation" },
  { id: "ECSE4170", name: "Modeling and Simulation for Cyber-Physical Systems" },
  { id: "ECSE4180", name: "Industrial Power System Design" },
  { id: "ECSE4220", name: "VLSI Design" },
  { id: "ECSE4250", name: "Integrated Circuit Processes and Design" },
  { id: "ECSE4310", name: "Fundamentals of RF/Microwave Engineering" },
  { id: "ECSE4320", name: "Advanced Computer Systems" },
  { id: "ECSE4370", name: "Introduction to Optoelectronics Technology" },
  { id: "ECSE4380", name: "Fundamentals of Solid State Lighting Systems" },
  { id: "ECSE4440", name: "Control Systems Engineering" },
  { id: "ECSE4480", name: "Robotics I" },
  { id: "ECSE4490", name: "Robotics II" },
  { id: "ECSE4500", name: "Distributed Systems and Sensor Networks" },
  { id: "ECSE4510", name: "Digital Control Systems" },
  { id: "ECSE4530", name: "Digital Signal Processing" },
  { id: "ECSE4540", name: "Introduction to Image Processing" },
  { id: "ECSE4560", name: "Modern Communication Systems" },
  { id: "ECSE4620", name: "Computer Vision for Visual Effects" },
  { id: "ECSE4630", name: "Lasers and Optical Systems" },
  { id: "ECSE4640", name: "Optical Communications and Integrated Optics" },
  { id: "ECSE4660", name: "Internetworking of Things" },
  { id: "ECSE4670", name: "Computer Communication Networks" },
  { id: "ECSE4720", name: "Solid-State Physics" },
  { id: "ECSE4740", name: "Applied Parallel Computing for Engineers" },
  { id: "ECSE4750", name: "Computer Graphics" },
  { id: "ECSE4760", name: "Real-Time Applications in Control and Communications" },
  { id: "ECSE4770", name: "Computer Hardware Design" },
  { id: "ECSE4780", name: "Advanced Computer Hardware Design" },
  { id: "ECSE4790", name: "Microprocessor Systems" },
  { id: "ECSE4810", name: "Introduction to Probabilistic Graphical Models" },
  { id: "ECSE4840", name: "Introduction to Machine Learning" },
  { id: "ECSE4850", name: "Introduction to Deep Learning" },
  { id: "ECSE4900", name: "Multidisciplinary Capstone Design" }
];

var links = [
  { source: "ECSE1010", target: "ECSE2010" },
  { source: "ECSE2010", target: "ECSE2050" },
  { source: "ECSE2010", target: "ECSE2100" },
  { source: "ECSE2010", target: "ECSE2110" },
  { source: "ECSE2010", target: "ECSE2210" },
  { source: "ECSE2010", target: "ECSE2410" },
  { source: "ECSE2610", target: "ECSE2660" },
  { source: "ECSE2050", target: "ECSE4030" },
  { source: "ECSE2610", target: "ECSE4040" },
  { source: "ECSE2050", target: "ECSE4040" },
  { source: "ECSE2050", target: "ECSE4050" },
  { source: "ECSE2050", target: "ECSE4080" },
  { source: "ECSE2410", target: "ECSE4090" },
  { source: "ECSE2110", target: "ECSE4110" },
  { source: "ECSE2110", target: "ECSE4120" },
  { source: "ECSE4080", target: "ECSE4130" },
  { source: "ECSE4110", target: "ECSE4130" },
  { source: "ECSE4120", target: "ECSE4130" },
  { source: "ECSE2110", target: "ECSE4141" },
  { source: "ECSE2110", target: "ECSE4180" },
  { source: "ECSE4080", target: "ECSE4130" },
  { source: "ECSE2050", target: "ECSE4220" },
  { source: "ECSE2610", target: "ECSE4220" },
  { source: "ECSE2210", target: "ECSE4220" },
  { source: "ECSE2210", target: "ECSE4250" },
  { source: "ECSE2050", target: "ECSE4310" },
  { source: "ECSE2660", target: "ECSE4220" },
  { source: "ECSE2210", target: "ECSE4370" },
  { source: "ECSE2050", target: "ECSE4380" },
  { source: "ECSE2410", target: "ECSE4440" },
  { source: "ECSE2410", target: "ECSE4500" },
  { source: "ECSE2410", target: "ECSE4510" },
  { source: "ECSE2410", target: "ECSE4530" },
  { source: "ECSE2500", target: "ECSE4530" },
  { source: "ECSE4530", target: "ECSE4540" },
  { source: "ECSE2410", target: "ECSE4560" },
  { source: "ECSE2410", target: "ECSE4560" },
  { source: "ECSE2660", target: "ECSE4660" },
  { source: "ECSE2610", target: "ECSE4670" },
  { source: "ECSE2500", target: "ECSE4670" },
  { source: "ECSE2660", target: "ECSE4740" },
  { source: "ECSE2610", target: "ECSE4750" },
  { source: "ECSE4440", target: "ECSE4760" },
  { source: "ECSE4560", target: "ECSE4760" },
  { source: "ECSE2610", target: "ECSE4770" },
  { source: "ECSE4770", target: "ECSE4780" },
  { source: "ECSE2500", target: "ECSE4810" },
  { source: "ECSE2500", target: "ECSE4840" },
  { source: "ECSE2500", target: "ECSE4850" }
];

const width = 1500;
const height = 800;

const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("style", "max-width: 100%; height: auto;");

function findLeadingIDs(data, targetID) {
  // Create a graph object to represent the connections
  let graph = {};
  data.forEach(item => {
    if (!graph[item.target]) {
      graph[item.target] = [];
    }
    graph[item.target].push(item.source);
  });

  // Perform BFS to find all nodes leading to the target ID
  let queue = [targetID];
  let reachableIDs = new Set();
  let visited = new Set();

  while (queue.length > 0) {
    let currentID = queue.shift();
    visited.add(currentID);

    if (graph[currentID]) {
      graph[currentID].forEach(sourceID => {
        if (!reachableIDs.has(sourceID)) {
          reachableIDs.add(sourceID);
          queue.push(sourceID);
        }
      });
    }
  }

  return [Array.from(reachableIDs), Array.from(visited)];
}

function search(event) {
  event.preventDefault();
  const searchTerm = document.getElementById("searchbar").value.toUpperCase().replace(/\s/g, ""); 
  let foundNode = nodes.find(node => node.id.toUpperCase().replace(/\s/g, "") === searchTerm); 
  if (!foundNode) {
    foundNode = nodes.find(node => node.name.toUpperCase().replace(/\s/g, "") === searchTerm); 
  }
  if (foundNode) {

    const centerX = width / 2 - foundNode.x;
    const centerY = height / 3 - foundNode.y;
    svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity.translate(centerX, centerY).scale(2)); 
  } else {
    console.log("Node not found");
  }
}

function pruneSearch(event) {

  event.preventDefault();
  const searchTerm = document.getElementById("pruneSearchbar").value.toUpperCase().replace(/\s/g, ""); 
  let foundNode = nodes.find(node => node.id.toUpperCase().replace(/\s/g, "") === searchTerm); 
  if (!foundNode) {
    foundNode = nodes.find(node => node.name.toUpperCase().replace(/\s/g, "") === searchTerm); 
  }
  if (foundNode) {
    console.log(foundNode.id);
    const newIDs = findLeadingIDs(links, foundNode.id);
    console.log(newIDs);
    svg.selectAll("*").remove()
    arr = generateGraph(svg, nodes, links);
    currentSim = arr[0];
    currentLink = arr[1];
    currentNode = arr[2];
    currenttText = arr[3];
    zoom = arr[4];

  } else {
    console.log("Node not found");
  }
}

function generateGraph(svg, nodes, links) {

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

  let simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(100))
  .force("charge", d3.forceManyBody().strength(-1000))
  .force("x", d3.forceX())
  .force("y", d3.forceY());
  
   link = svg.append("g")
  .attr("stroke", "#999")
  .attr("stroke-opacity", 0.6)
  .selectAll("line")
  .data(links)
  .join("line")
  .attr("stroke-width", 7)
  .attr("marker-end", "url(#arrow)");

  let node = svg.append("g")
  .attr("stroke", "#fff")
  .attr("stroke-width", 1.5)
  .selectAll("circle")
  .data(nodes)
  .join("circle")
  .attr("r", 35)
  .attr("fill", function(d) {
    switch (d.id[4]) {
      case "1":
          return "green";
      case "2":
          return "yellow";
      case "4":
          return "red";
      default:
          return "black";
    }
  });

  let text = svg.append("g")
  .selectAll("text")
  .data(nodes)
  .join("text")
  .text(d => d.name)
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "middle");

  node.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

  text.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));


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
  .on("zoom", zoomed);

  svg.call(zoom).call(zoom.translateTo, width / 2, height / 2);

  return [simulation, link, node, text, zoom];
}

function zoomed(event) {
  const { transform } = event;
  svg.selectChildren('g')
  .attr('transform', transform)
}

function dragstarted(event) {
  if (!event.active) currentSim.alphaTarget(0.3).restart();
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
}

function dragged(event) {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}

function dragended(event) {
  if (!event.active) currentSim.alphaTarget(0);
  event.subject.fx = null;
  event.subject.fy = null;
}


window.addEventListener("load", function() {
  container.append(svg.node());  
  arr = generateGraph(svg, nodes, links);
  currentSim = arr[0];
  currentLink = arr[1];
  currentNode = arr[2];
  currenttText = arr[3];
  zoom = arr[4];

  currentNode.on("click", function(event, d) {
    window.location.href = d.id + ".html";
  })

})


document.getElementById("search").addEventListener("click", search);
document.getElementById("pruneSearch").addEventListener("click", pruneSearch);