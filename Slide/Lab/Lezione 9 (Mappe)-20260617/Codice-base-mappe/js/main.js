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
    const mapPaths = [
        './datasets/africa.geojson',
        './datasets/africa_hd.geojson',
        './datasets/usa.geojson',
        './datasets/world.geojson'
    ];

    Promise.all([
        getDataJSON(mapPaths[3]),   // Selezione della mappa
        getDataCSV('./datasets/world_population.csv')
    ]).then(([dataJSON, dataCSV]) => {
        const idSVG = "mappaSVG";
        renderMap([dataJSON, dataCSV], idSVG);
    }).catch(error => console.error('Error loading data:', error));
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

    const margin = {top: 40, right: 60, bottom: 40, left: 60};
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const legendWidth = 600;
    const legendHeight = 20;
    const exp = 0.25;

    const gContainer = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Configura la proiezione geografica
    /* --- Potrebbe essere: ---
    * d3. :
    * * geoMercator()               // Distorce aree soprattutto vicino ai poli
    * * geoAzimuthalEqualArea()     // Sfera
    * * geoEquirectangular()        // Coordinate geografiche della latitudine e della longitudine come delle coordinate cartesiane
    * * geoEqualEarth()             // Proporzioni corrette
    * * geoConicConformal()         // Longitudini medie
    * oppure: */
    const projection = d3.geoNaturalEarth1()
        .fitSize([chartWidth, chartHeight], dataJSON);

    const geoGenerator = d3.geoPath().projection(projection);

    // Scala di colori basata sulla popolazione (da bianco a blu scuro)
    const colorScale = d3.scaleSequentialSqrt()
        .exponent(exp)
        .domain(d3.extent(population, d => d.pop))
        .interpolator(d3.interpolateBlues);     // Scala di colori visualizzata

    // Disegna i paesi colorati in base alla popolazione
    gContainer.selectAll(null)
        .data(dataJSON.features)
        .join('path')
        .attr('d', geoGenerator)
        .attr('stroke', 'black')
        .attr('fill', d => {
            // Abbina il codice paese ai dati di popolazione
            const countryData = population.find(country => country.code === d.id);
            return countryData ? colorScale(countryData.pop) : 'lightgray';
        });

    // Elementi per visualizzare il bounding box e il centroide al hover
    const hoveredCountryG = gContainer.append('g');

    const boundsRect = hoveredCountryG.append('rect')
        .attr('id', 'bounding-box')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-dasharray', '5, 1');

    // Cerchio al centro geometrico del Paese
    const centroidCircle = hoveredCountryG.append('circle')
        .attr('id', 'centroid')
        .attr('r', 3)
        .attr('fill', 'none');

    // Inizializza la legenda
    creazioneLegendaInfo(svg, margin);
    // Seleziona il testo appena creato affinchè possa essere aggiornato dal handleMouseOver
    const text_legend = svg.select('#legend-info').select('text');

    // Aggiunge interattività ai paesi (Corretto con parentesi graffe protettive)
    gContainer.selectAll('path')
        .on('mouseover', (e, d) => {
            handleMouseOver(e, d, geoGenerator, boundsRect, centroidCircle, text_legend, population);
        })
        .on('mouseout', (e, d) => {
            handleMouseOut(e, d, boundsRect, centroidCircle, text_legend);
        });

    // Scala per l'asse della legenda colori
    const legendScale = d3.scaleSqrt()
        .exponent(exp)
        .domain(d3.extent(population, d => d.pop))
        .range([0, legendWidth]);

    creazioneLegendaColori(svg, margin, svgWidth, [legendWidth, legendHeight], exp, colorScale, legendScale, population);
}

function handleMouseOver(e, d, geoGenerator, boundsRect, centroidCircle, text_legend, population){
    // 1. Cerchiamo il dato della popolazione per il paese corrente (usando l'id)
    const countryData = population.find(country => country.code === d.id);

    // 2. Prepariamo la stringa: se il dato esiste lo formattiamo, altrimenti usiamo il placeholder
    const popText = countryData ? d3.format(".3s")(countryData.pop) : "Dato Sconosciuto";

    // Per rendere il bordo rosso
    d3.select(e.currentTarget)
        .attr('stroke', 'red')
        .attr('stroke-width', 2)
        .append('title')
        .text(popText);

    // Mostra il bounding box attorno al paese
    const bounds = geoGenerator.bounds(d);
    boundsRect
        .attr('x', bounds[0][0])
        .attr('y', bounds[0][1])
        .attr('width', bounds[1][0] - bounds[0][0])
        .attr('height', bounds[1][1] - bounds[0][1]);

    // Mostra il centroide del paese in rosso
    const centroid = geoGenerator.centroid(d);
    centroidCircle
        .attr('fill', 'red')
        .attr('cx', centroid[0])
        .attr('cy', centroid[1]);

    // Aggiorna la legenda con informazioni del paese
    const countryName = d.properties.name;
    const pixelArea = geoGenerator.area(d);
    const measure = geoGenerator.measure(d);
    text_legend.text(`${countryName} (Area: ${pixelArea.toFixed(1)} - Perimetro: ${measure.toFixed(1)})`);
}

function handleMouseOut(e, d, boundsRect, centroidCircle, text_legend){
    // Reset del bordo
    d3.select(e.currentTarget)
        .attr('stroke', 'black')
        .attr('stroke-width', 1);

    // Nascondi il bounding box e il centroide
    boundsRect.attr('width', 0).attr('height', 0);
    centroidCircle.attr('fill', 'none');
    text_legend.text('Hover over a country');
}

function creazioneLegendaInfo(svg, margin){
    // Aggiunge legenda informativa in alto
    const gLegendInfo = svg.append('g')
        .attr('id', 'legend-info')
        .attr('transform', `translate(${margin.left}, ${margin.top / 2})`);

    gLegendInfo.append('text')
        .attr('dx', margin.left / 2)
        .text('Hover over a country');
}

function creazioneLegendaColori(svg, margin, svgWidth, legendSize, exp, colorScale, legendScale, population){
    const [legendWidth, legendHeight] = legendSize;
    const defs = svg.append('defs');

    // Crea un gradiente lineare dalla scala di colori
    const linearGradient = defs.append('linearGradient')
        .attr('id', 'linear-gradient')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '100%').attr('y2', '0%');

    // Generiamo 10 stop artificiali spaziati in modo uniforme per simulare la scala continua
    const numStops = 10;
    const stopsData = d3.range(numStops).map(i => i / (numStops - 1));
    const populationExtent = d3.extent(population, d => d.pop);

    linearGradient.selectAll('stop')
        .data(stopsData)
        .join('stop')
        .attr('offset', d => `${d * 100}%`)
        .attr('stop-color', d => {
            // Calcoliamo il valore di popolazione corrispondente alla percentuale corrente
            const value = populationExtent[0] + d * (populationExtent[1] - populationExtent[0]);
            return colorScale(value);
        });

    // Aggiunge legenda colori per popolazione
    const legendColor = svg.select('#legend-info').append('g')
        .attr('transform', `translate(${svgWidth - legendWidth - 10}, 0)`);

    legendColor.append('rect')
        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .style('fill', 'url(#linear-gradient)');

    legendColor.append('text')
        .attr('x', 0)
        .attr('y', -5)
        .text(`Population (exponent: ${exp})`);

    // Aggiunge l'asse dei valori sotto la legenda
    const legendAxis = d3.axisBottom(legendScale)
        .tickSize(legendHeight)
        .ticks(5)
        .tickFormat(d3.format('.2s'));

    legendColor.append('g')
        .attr('transform', `translate(0, ${legendHeight})`)
        .call(legendAxis);
}