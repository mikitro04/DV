window.onload = main;

function main(){
    tree();
}

//Carica dati JSON dal percorso specificato
async function getDataJSON(path){
    const data = await d3.json(path);
    console.log(data);
    return data;
}

async function tree(){
    let data = await getDataJSON('../datasets/tree.json');
    const idSVG = "alberoSVG";
    renderTree(data, idSVG);

}

//Renderizza l'albero con animazioni usando D3.js
function renderTree(data, idSVG) {

    // Seleziona l'elemento SVG e ottiene le sue dimensioni
    const svg = d3.select("#" + idSVG);
    const svgHeight = svg.attr('height');
    const svgWidth = svg.attr('width');

    // Definisce i margini e calcola le dimensioni del grafico
    const margin = {top: 40, right: 40, bottom: 40, left: 100}
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const gContainer = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Trasforma i dati in una gerarchia D3
    const root = d3.hierarchy(data);
    //console.log("Descendants: ", root.descendants());
    //console.log("Links: ", root.links());

    // Applica il layout ad albero alle dimensioni disponibili
    const treeLayout = d3.tree().size([chartWidth, chartHeight]);
    treeLayout(root);

    // Renderizza i nodi (nodes)
    const nodesGroup = gContainer.append('g').attr('class', 'nodes');

    const nodes = nodesGroup.selectAll('.node')
        .data(root.descendants())
        .join('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x}, ${d.y})`);

    // Disegna i cerchi dei nodi con animazione di comparsa
    nodes.append('circle')
        .attr('r', 0)
        .attr('fill', '#69b3a2')
        .attr('stroke', '#333')
        .attr('stroke-width', 2)
        .transition()
        .duration(800)
        .attr('r', 8);

    // Aggiunge il testo con le etichette, posizionato alternativamente per evitare sovrapposizioni
    nodes.append('text')
        .text(d => d.data.name)
        .attr('dy', (d, i) => {
            if(!d.children)
                return i % 2 === 0? '-12px' : '20px';
            return '-12px';
        })
        .attr('text-anchor', 'middle')
        .attr('fill', '#333')
        .style('user-select', 'none')
        .style('font-weight', d => d.children? 'bold' : 'normal');

    // renderizza i link (edges) con animazione di disegno
    const linksGroup = gContainer.insert('g', ':first-child').attr('class', 'links');

    const links = linksGroup.selectAll('.link')
        .data(root.links())
        .join('path')
        .attr('class', 'link')
        .attr('d', d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y)
        )
        .attr('fill', 'none')
        .attr('stroke-width', 2)
        .attr('stroke', '#ccc')
        // Configura l'animazione di disegno dei link con stroke-dasharray
        .attr('stroke-dasharray', function(){
            const totalLength = this.getTotalLength();
            return totalLength + ' ' + totalLength;
        })
        .attr('stroke-dashoffset', function(){
            return this.getTotalLength();
        })
        // Anima il disegno dei link da nascosti a visibili
        .transition()
        .duration(1000)
        .attr('stroke-dashoffset', 0);

}


