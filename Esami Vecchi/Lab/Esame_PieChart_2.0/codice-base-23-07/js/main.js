window.onload = main;

function main(){
    piechart();
}


function renderPiechart(idSVG, data) {

    // SVG e dimensioni
    const svg = d3.select('#' + idSVG);
    const svgWidth = svg.attr("width");
    const svgHeight = svg.attr("height");

    // Margini e dimensioni del grafico
    const margin = {top: 40, right: 40, bottom: 80, left: 40};
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    // Gruppo principale per il grafico
    const gContainer = svg.append('g')
        .attr('transform', `translate(${svgWidth / 2}, ${(svgHeight - margin.bottom) / 2})`);

    // Gruppo per l'etichetta informativa
    const infoLabel = svg.append('g')
        .attr('id', 'info-label')
        .attr('transform', `translate(${svgWidth / 2}, ${svgHeight - 30})`);

    // Testo dell'etichetta informativa
    infoLabel.append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .text('Fai click su una fetta per vederne i dettagli...');

    // Generazione archi e fette per il grafico a torta
    const pie = d3.pie().value(d => d[1])
    const arcs = pie(Object.entries(data))

    const outerRadius =
        Math.min(chartWidth, chartHeight) / 2 - Math.max(...Object.values(margin))

    const arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(outerRadius)

    // Creazione delle fette del grafico a torta
    gContainer.selectAll('path')
        .data(arcs)
        .join('path')
        .attr('d', arcGenerator)
        .attr('fill', 'pink')
        .attr('stroke', 'black')
        .attr('class', d => d.data[0])
        .style('stroke-width', '2px')
}

async function piechart(){

    // Dati Hardcoded per il grafico a torta
    let data = {
        Instagram: 35,
        TikTok: 30,
        YouTube: 15,
        WhatsApp: 10,
        Altro: 10
    };

    let idSVG = 'piechartSVG';
    renderPiechart(idSVG, data);
}