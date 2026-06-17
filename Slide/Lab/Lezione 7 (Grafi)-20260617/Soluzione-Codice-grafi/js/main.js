window.onload = main;

function main() {
    graph();
}

// Carica un file JSON
async function getDataJSON(path) {
    const data = await d3.json(path);
    console.log(data);
    return data;
}

async function graph() {
    // Caricamento dei dati del grafo dal file JSON
    let data = await getDataJSON('../datasets/graph.json');

    // Posizioni iniziali predefinite dei nodi:
    // ogni coppia rappresenta [x, y]
    // Servono per posizionare inizialmente i nodi e per collocare le etichette degli archi
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
    ];

    // Id dell'SVG dentro cui disegnare il grafo
    const idSVG = "grafoSVG";

    // Disegno vero e proprio del grafo
    renderGraph(data, idSVG, nodesPositions);
}

// Funzione che crea gli elementi SVG del grafo e li collega alla simulazione
function renderGraph(data, idSVG, nodesPositions) {
    // Selezione dell'elemento SVG e recupero delle sue dimensioni
    const svg = d3.select("#" + idSVG);
    const svgHeight = svg.attr('height');
    const svgWidth = svg.attr('width');

    // Margini interni e calcolo delle dimensioni dell'area di disegno effettiva
    const margin = { top: 40, right: 50, bottom: 40, left: 120 };
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const gContainer = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Mappa: id del nodo -> posizione iniziale [x, y]
    // Serve per posizionare le etichette degli archi prima che parta la simulazione
    const posById = new Map(
        data.nodes.map((node, i) => [node.id, nodesPositions[i]])
    );

    // Creazione del gruppo per ogni nodo del grafo
    const nodesG = gContainer
        .selectAll(null)
        .data(data.nodes)
        .join('g')
        .classed('node', true);

    // Crea il cerchio che rappresenta il nodo
    const nodes = nodesG
        .append('circle')
        .attr('r', 20)
        .style('fill', 'lightskyblue');

    // Layer separato per i collegamenti, inserito come primo figlio
    // così i link restano dietro ai nodi
    const linksLayer = gContainer
        .insert('g', ':first-child')
        .classed('link', true);

    // Un gruppo per ogni link
    const linksG = linksLayer
        .selectAll(null)
        .data(data.links)
        .join('g')
        .classed('link', true);

    // Segmento che rappresenta il collegamento tra due nodi
    const arcs = linksG
        .append('line')
        .style('stroke', 'gray');

    // Etichetta del nodo, centrata sopra il cerchio
    const node_labels = nodesG
        .append('text')
        .text(d => d.id)
        .style('fill', 'black')
        .style('font-size', 15)
        .style('font-weight', 'bold')
        .attr('alignment-baseline', 'central')
        .attr('text-anchor', 'middle')
        .style('user-select', 'none');

    // Etichetta dell'arco, posizionata inizialmente nel punto medio tra source e target
    const arc_labels = linksG
        .append('text')
        .text(d => `${d.source} -> ${d.target}`)
        .style('font-size', 15)
        .attr('text-anchor', 'start')
        .attr('alignment-baseline', 'baseline')
        .style('user-select', 'none')
        // Posizione iniziale: punto medio tra source e target, usando le posizioni predefinite dei nodi
        .attr('x', d => (posById.get(d.source)[0] + posById.get(d.target)[0]) / 2)
        .attr('y', d => (posById.get(d.source)[1] + posById.get(d.target)[1]) / 2);

    // Avvio della simulazione di forza sul grafo
    // Ad ogni tick aggiorniamo la posizione di nodi, link ed etichette
    const simulation = getSimulation(data, [chartWidth, chartHeight])
        .on('tick', () => { ticked(arcs, nodes, node_labels, arc_labels); });

    // Inizio drag: "fissa" il nodo nella posizione corrente e riattiva la simulazione
    const dragstarted = (event) => {
        simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    };

    // Durante il drag: aggiorna la posizione fissata del nodo
    const dragged = (event) => {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    };

    // Fine drag: libera il nodo, così la simulazione può riposizionarlo
    const dragended = (event) => {
        simulation.alphaTarget(0).restart();
        event.subject.fx = null;
        event.subject.fy = null;
    };

    // Associa il comportamento di trascinamento ai gruppi dei nodi
    nodesG.call(
        d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended)
    );
}

// Crea e configura la simulazione di forza
function getSimulation(data, dimensions) {
    const [chartWidth, chartHeight] = dimensions;

    return d3.forceSimulation(data.nodes)
        // Forza dei link: mantiene vicini i nodi collegati
        .force('link', d3.forceLink()
            .id(d => d.id) // usa l'id del nodo per associare source/target
            .links(data.links)
            .distance(200)
        )
        // Forza repulsiva tra tutti i nodi
        .force('charge', d3.forceManyBody().strength(-400))
        // Forza che tende a portare il grafo verso il centro
        .force('center', d3.forceCenter(chartWidth / 2, chartHeight / 2))
        // Forze aggiuntive per stabilizzare la disposizione orizzontale e verticale
        .force('x', d3.forceX(chartWidth / 2))
        .force('y', d3.forceY(chartHeight / 2));
}

// Aggiorna tutte le coordinate degli elementi SVG a ogni tick della simulazione
function ticked(arcs, nodes, node_labels, arc_labels) {
    // Aggiorna la posizione dei nodi
    nodes
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

    // Aggiorna la posizione del testo dei nodi
    node_labels
        .attr('x', d => d.x)
        .attr('y', d => d.y);

    // Aggiorna gli estremi delle linee dei link
    arcs
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

    // Riposiziona le etichette dei link nel punto medio tra source e target
    arc_labels
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2);
}
