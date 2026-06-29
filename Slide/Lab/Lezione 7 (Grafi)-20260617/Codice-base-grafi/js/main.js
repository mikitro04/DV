window.onload = main;

function main(){
    graph();
    graphDynamic();
}

async function getDataJSON(path){
    const data = await d3.json(path);
    console.log(data);
    return data;
}

async function graph(){
    let data = await getDataJSON('./datasets/graph.json');
    //x, y
    const nodesPositions = [
        [340, 115],
        [340, 455],
        [502, 338],
        [178, 338],
        [440, 423],
        [240, 423],
        [178, 232],
        [240, 147],
        [440, 147],
        [502, 232],
    ]

    const idSVG = "grafoSVG";
    renderGraphStatic(data, idSVG, nodesPositions);
}

function renderGraphStatic(data, idSVG, nodesPositions) {
    const svg = d3.select("#" + idSVG);
    const svgHeight = svg.attr('height');
    const svgWidth = svg.attr('width');

    const margin = {top: 40, right: 50, bottom: 40, left: 120}
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    // in posById si associa a ogni nodo la sua posizione dell'array nodesPosition
    const posById = new Map(
        data.nodes.map((node, i) => [node.id, nodesPositions[i]])
    );

    const gContainer = svg
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    //un gruppo per ogni nodo
    const nodesG = gContainer
        .selectAll(null)
        .data(data.nodes)
        .join("g")
        .classed('node', true)
        // Per adesso, ogni nodo ha una posizione statica
        // Spostiamo il gruppo (1 gruppo = 1 nodo)
        .attr('transform', (d) =>
            `translate(${posById.get(d.id)[0]}, ${posById.get(d.id)[1]})`)

    // Si crea un cerchio per ogni gruppo/nodo
    const nodes = nodesG
        .append("circle")
        .attr("r", 20)
        .style("fill", "lightskyblue")

    // Un gruppo per arco
    const linksG = gContainer
        .selectAll(null)
        .data(data.links)
        .join("g")
        .classed('link', true)

    const arcs = linksG
        .selectAll("line")
        .data(d => [d]) // 1 linea per ogni gruppo-link
        .join("line")
        .style("stroke", "lightgray")
        .style("stroke-width", 2)
        .attr("x1", d => posById.get((d.source))[0])
        .attr("y1", d => posById.get((d.source))[1])
        .attr("x2", d => posById.get((d.target))[0])
        .attr("y2", d => posById.get((d.target))[1])

    const node_labels = nodesG
        .append("text")
        .text(d => d.id)
        .style("fill", "black")
        .style("font-size", 15)
        .style("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .style("user-select", "none")

    const arc_labels = linksG
        .append("text")
        .text(d => `${d.source} -> ${d.target}`)
        .style("font-size", 15)
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "baseline")
        .style("user-select", "none")
        .attr("x", d => (posById.get(d.source)[0] + posById.get(d.target)[0]) / 2)
        .attr("y", d => (posById.get(d.source)[1] + posById.get(d.target)[1]) / 2)
}
/*
*
*
*
*
*
* */

async function graphDynamic(){
    let data = await getDataJSON('./datasets/graph.json');
    //x, y
    const nodesPositions = [
        [340, 115],
        [340, 455],
        [502, 338],
        [178, 338],
        [440, 423],
        [240, 423],
        [178, 232],
        [240, 147],
        [440, 147],
        [502, 232],
    ]

    const idSVG = "grafoDSVG";
    renderGraphDynamic(data, idSVG, nodesPositions);
}

function renderGraphDynamic(data, idSVG, nodesPositions) {
    const svg = d3.select("#" + idSVG);
    const svgHeight = svg.attr('height');
    const svgWidth = svg.attr('width');

    const margin = {top: 40, right: 50, bottom: 40, left: 120}
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    // in posById si associa a ogni nodo la sua posizione dell'array nodesPosition
    const posById = new Map(
        data.nodes.map((node, i) => [node.id, nodesPositions[i]])
    );

    const gContainer = svg
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    //un gruppo per ogni nodo ma non traslato (è dinamico adesso)
    const nodesG = gContainer
        .selectAll(null)
        .data(data.nodes)
        .join("g")
        .classed('node', true)

    // Si crea un cerchio per ogni gruppo/nodo
    const nodes = nodesG
        .append("circle")
        .attr("r", 20)
        .style("fill", "lightskyblue")

    // Un gruppo per arco
    const linksG = gContainer
        .selectAll(null)
        .data(data.links)
        .join("g")
        .classed('link', true)

    //la posizione degli archi sarà dinamica
    const arcs = linksG
        .append("line")
        .style("stroke", "lightgray")

    const node_labels = nodesG
        .append("text")
        .text(d => d.id)
        .style("fill", "black")
        .style("font-size", 15)
        .style("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .style("user-select", "none")

    const arc_labels = linksG
        .append("text")
        .text(d => `${d.source} -> ${d.target}`)
        .style("font-size", 15)
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "baseline")
        .style("user-select", "none")
        .attr("x", d => (posById.get(d.source)[0] + posById.get(d.target)[0]) / 2)
        .attr("y", d => (posById.get(d.source)[1] + posById.get(d.target)[1]) / 2)

    const simulation = getSimulation(data, [chartWidth, chartHeight])
        .on("tick", () => {ticked(arcs, nodes, node_labels, arc_labels)} );

    const dragstarted = (event) => {
        simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    const dragged = (event) => {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    const dragended = (event) => {
        simulation.alphaTarget(0).restart();
        event.subject.fx = null;
        event.subject.fy = null;
    }

    nodesG.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
}

function getSimulation(data, dimensions){
    const [chartWidth, chartHeight] = dimensions;
    return d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink()
            .id(d => d.id)
            .links(data.links)
            .distance(200)
        )
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(chartWidth/2, chartHeight/2))
        .force("x", d3.forceX(chartWidth/2))
        .force("y", d3.forceY(chartHeight/2))
}

function ticked(arcs, nodes, node_labels, arc_labels) {

    // Aggiorna la posizione di ogni nodo.
    nodes
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)

    // Aggiorna la posizione di ogni testo del nodo.
    node_labels
        .attr("x", d => d.x)
        .attr("y", d => d.y)

    //Aggiorna la posizione di ogni link.
    arcs
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x )
        .attr("y2", d => d.target.y);

    // Aggiorna la posizione di ogni testo del link.
    arc_labels
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2)

}