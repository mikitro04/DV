window.onload = main;

function main(){
    map();
}

async function getDataJSON(path){
    const data = await d3.json(path);
    //console.log(data);
    return data;
}

async function getDataCSV(path){
    const data = await d3.csv(path);
    //console.log(data);
    return data;
}

async function map(){
    const mapPaths = ['../datasets/africa.geojson',
        '../datasets/africa_hd.geojson',
        '../datasets/usa.geojson',
        '../datasets/world.geojson'];
    let data;
    const idSVG = "mappaSVG";
    renderMap(data, idSVG);
}

function renderMap(data, idSVG) {

    const svg = d3.select("#" + idSVG);
    const svgHeight = svg.attr('height');
    const svgWidth = svg.attr('width');

    const margin = {top: 40, right: 60, bottom: 40, left: 60}
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const legendWidth = 600;
    const legendHeight = 20;
    const exp = 0.25;

    const gContainer = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    //creazioneLegendaInfo(svg, margin);
    //creazioneLegendaColori(svg, margin, svgWidth, [legendWidth, legendHeight], exp);

}

function creazioneLegendaInfo(svg, margin){
    const gLegendInfo = svg.append('g')
        .attr('id', 'legend-info')
        .attr('transform', `translate(${margin.left}, ${margin.top / 2})`);

    const textLegend = gLegendInfo.append('text')
        .attr('dx', margin.left/2)
        .text('Hover over a country')
}

function creazioneLegendaColori(svg, margin, svgWidth, legendSize, exp){
    const [legendWidth, legendHeight] = legendSize;
    const defs = None;
    const linearGradient = None;

    const legendColor = svg.select('#legend-info').append('g')
        .attr('transform', `translate(${svgWidth-legendWidth-10}, 0)`);

    legendColor.append('rect')
        .attr('width', legendWidth)
        .attr('height', legendHeight)

    legendColor.append('text')
        .attr('x', 0)
        .attr('y', -5)
        .text(`Population (exponent: ${exp})`);
}
