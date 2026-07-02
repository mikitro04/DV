window.onload = main;

function main(){
    map();
}

async function getDataJSON(path){
    const data = await d3.json(path);

    console.log(data);
    return data;
}

async function getDataCSV(path){
    const data = await d3.csv(path);
    console.log(data);
    return data;
}

async function map(){
    const mapPath = "../datasets/sardegna.geojson";
    const infoPath = "../datasets/informazioni.csv";

    Promise.all(
        [getDataJSON(mapPath), getDataCSV(infoPath)]
    ).then(([dataJSON, dataCSV]) => {
        renderMap(dataJSON, dataCSV);
    }).catch(error => console.error('Error loading data:', error));

}

function printInfo(svg, svgWidth, svgHeight){

    const infoLabel = svg.append('g')
        .attr('id', 'info')
        .attr('transform', `translate(${svgWidth / 2}, ${svgHeight - 15})`)

    infoLabel.append('text')
        .text('Fai click su una provincia per vedere il numero dei suoi comuni')
        .attr('text-anchor', 'middle')
}

function getRadius(currentProv, dataCSV, scaleRadius) {
    const provincia_acronimo = currentProv.properties.prov_acr;
    const provincia_info = dataCSV.find(p => p.provincia === provincia_acronimo);
    const num_abitanti = provincia_info['abitanti'];

    return scaleRadius(num_abitanti);
}


function renderMap(dataJSON, dataCSV) {
    const svg = d3.select("#SardegnaSVG");
    const svgHeight = svg.attr('height');
    const svgWidth = svg.attr('width');

    const margin = {top: 40, right: 60, bottom: 40, left: 60}
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;


    const gContainer = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const projection = d3.geoNaturalEarth1()
        .fitSize([chartWidth, chartHeight], dataJSON);

    const geoGenerator = d3.geoPath().projection(projection);

    gContainer
        .selectAll(null)
        .data(dataJSON.features)
        .join('path')
        .attr('d', geoGenerator)
        .attr('stroke', 'black')
        .attr('fill', 'lightgray')

    printInfo(svg, svgWidth, svgHeight);
    
}







