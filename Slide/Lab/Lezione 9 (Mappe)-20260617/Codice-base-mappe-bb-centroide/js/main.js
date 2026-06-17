window.onload = main;

// Visualizzazione di mappe geografiche con D3.js
function main(){
    map();
}

// Carica dati JSON/GeoJSON
async function getDataJSON(path){
    const data = await d3.json(path);
    console.log(data);
    return data;
}

// Carica dati CSV
async function getDataCSV(path){
    const data = await d3.csv(path);
    console.log(data);
    return data;
}

// Carica i dati della mappa e della popolazione
async function map(){
    const mapPaths = ['../datasets/africa.geojson',
        '../datasets/africa_hd.geojson',
        '../datasets/usa.geojson',
        '../datasets/world.geojson'];
    let data;
    const idSVG = "mappaSVG";
    // Carica simultaneamente i dati GeoJSON e CSV
    Promise.all(
        [getDataJSON(mapPaths[3]),
        getDataCSV('../datasets/world_population.csv')]
    ).then(
        ([dataJSON, dataCSV]) => {
            renderMap([dataJSON, dataCSV], idSVG);
        }).catch(error => console.error('Error loading data: ', error));
}

function renderMap(data, idSVG) {

    let [dataJSON, population] = data;
    // Converte i valori di popolazione in numeri
    population = population.map(d => ({
        ...d,
        pop: +d.pop
    }));

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

    // Configura la proiezione geografica
    const projection = d3.geoNaturalEarth1()
        .fitSize([chartWidth, chartHeight], dataJSON);

    const geoGenerator = d3.geoPath().projection(projection);

    // Disegna i paesi con sfondo grigio
    gContainer.selectAll(null)
        .data(dataJSON.features)
        .join('path')
        .attr('d', geoGenerator)
        .attr('fill', 'lightgray')
        .attr('stroke', 'black')

    // Elementi per visualizzare il bounding box e il centroide al hover
    const hoveredCountryG = gContainer.append('g')

    const boundsRect = hoveredCountryG.append('rect')
        .attr('id', 'bounding-box')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-dasharray', '5, 1');

    const centroidCircle = hoveredCountryG.append('circle')
        .attr('id', 'centroid')
        .attr('r', 3)
        .attr('fill', 'none')

    // Aggiunge interattività ai paesi
    gContainer.selectAll('path')
        .on('mouseover',
            (e, d) => handleMouseOver
            (e, d, geoGenerator,boundsRect, centroidCircle))
        .on('mouseout', (e, d) => handleMouseOut
            (e, d, boundsRect, centroidCircle))

    //creazioneLegendaInfo(svg, margin);
    //creazioneLegendaColori(svg, margin, svgWidth, [legendWidth, legendHeight], exp);

}

function handleMouseOver (e, d, geoGenerator, boundsRect, centroidCircle){
    // Mostra il bounding box attorno al paese
    // bounds[0] ha le coordinate x e y del punto in alto a sinistra
    // bounds[1] ha le coordinate x e y del punto in basso a destra
    const bounds = geoGenerator.bounds(d)
    boundsRect
        .attr('x', bounds[0][0])
        .attr('y', bounds[0][1])
        .attr('width', bounds[1][0] - bounds[0][0])
        .attr('height', bounds[1][1] - bounds[0][1])

    // Mostra il centroide del paese in rosso
    const centroid = geoGenerator.centroid(d)

    centroidCircle
        .attr('fill', 'red')
        .attr('cx', centroid[0])
        .attr('cy', centroid[1]);
}

function handleMouseOut(e, d, boundsRect, centroidCircle){
    // Nascondi il bounding box e il centroide
    boundsRect.attr('width', 0).attr('height', 0);
    centroidCircle.attr('fill', 'none');
}


function creazioneLegendaInfo(svg, margin){
    // Aggiunge legenda informativa in alto
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

    // Aggiunge legenda colori per popolazione
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
