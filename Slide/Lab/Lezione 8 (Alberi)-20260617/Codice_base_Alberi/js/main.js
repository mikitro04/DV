window.onload = main;

function main(){
    tree();
}

async function getDataJSON(path){
    const data = await d3.json(path);
    console.log(data);
    return data;
}

async function tree(){
    let data = await getDataJSON('./datasets/tree.json');
    const idSVG = "alberoSVG";
    //console.log(data)
    renderTree(data, idSVG);

}

function renderTree(data, idSVG) {
    const svg = d3.select("#" + idSVG);
    const svgHeight = svg.attr('height');
    const svgWidth = svg.attr('width');

    const margin = {top: 40, right: 40, bottom: 40, left: 100}
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const gContainer = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const root = d3.hierarchy(data);
    console.log("DESCENDANTS: ", root.descendants());
    console.log("LINKS: ", root.links());

    const treeLayout = d3.tree().size([chartWidth, chartHeight]);
    treeLayout(root);

    const nodesGroup = gContainer.append('g').attr('class', 'nodes');
    // Creiamo un gruppo per ogni nodo, posizionandolo in base alle coordinate calcolate dal layout
    const node = nodesGroup.selectAll('.node')
        .data(root.descendants())
        .join('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x}, ${d.y})`);

    // Per ogni nodo, aggiungiamo un cerchio e del testo
    // Iniziamo con un cerchio di raggio 0 e poi facciamo una transizione per farlo crescere
    node.append('circle')
        .attr('r', 0)
        .attr('fill', '#69b3a2')
        .attr('stroke', '#333')
        .attr('stroke-width', 2)
        .transition()
        .duration(800) //ms
        .attr('r', 8);

    // Aggiungiamo il testo, posizionandolo sopra o sotto il nodo a seconda se è una foglia o meno
    node.append('text')
        .text(d => d.data.name)
        .attr('dy', (d, i) =>{
            if(!d.children)
                return i % 2 === 0? '-12px' : '20px'; // Se è una foglia, alterna sopra e sotto
            return '-12px'; // Se non è un nodo foglia, posiziona il testo sopra
        })
        .attr('text-anchor', 'middle')
        .attr('fill', '#333')
        // user-select: none per evitare che il testo venga evidenziato quando si clicca
        .style('user-select', 'none')
        // Se il nodo ha figli, rendi il testo in grassetto
        .style('font-weight', d => d.children? 'bold' : 'normal');

    const linkGroup = gContainer.insert('g', ':first-child').attr('class', 'links');

    // Per ogni link, aggiungiamo un path che collega il nodo padre al nodo figlio
    const links = linkGroup.selectAll('.link')
        .data(root.links())
        .join('path')
        .attr('class', 'link')
        .attr('d', d3.linkVertical() //crea un path verticale che collega i nodi padre e figlio
            .x(d => d.x)
            .y(d => d.y))
        .attr('fill', 'none')
        .attr('stroke-width', 2)
        .attr('stroke', '#ccc')
        .attr('stroke-dasharray', function() {
            // this.getTotalLength() restituisce la lunghezza totale del percorso del link
            const totalLength = this.getTotalLength();
            return totalLength + " " + totalLength;
        })
        // Impostiamo l'offset iniziale pari alla lunghezza totale del percorso,
        // in modo che il link sia completamente nascosto
        .attr('stroke-dashoffset', function() {
            return this.getTotalLength();
        })
        .transition()
        .duration(1000)
        // Dopo la transizione, impostiamo l'offset a 0, facendo apparire il link come se fosse disegnato
        .attr('stroke-dashoffset', 0);
}


